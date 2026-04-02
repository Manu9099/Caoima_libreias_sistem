using Bookify.Application.Books.Queries.OpenLibrary.GetOpenLibraryReadOptions;
using Bookify.Application.Books.Queries.OpenLibrary.GetOpenLibraryWorkById;
using Bookify.Application.Books.Queries.OpenLibrary.SearchOpenLibraryBooks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Bookify.WebApi.Controllers;

[ApiController]
[Route("api/open-library")]
public sealed class OpenLibraryController : ControllerBase
{
    private readonly ISender _sender;

    public OpenLibraryController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] string? genre = null,
        [FromQuery] string? language = null,
        [FromQuery] int? yearFrom = null,
        [FromQuery] int? yearTo = null,
        [FromQuery] bool readableOnly = false,
        CancellationToken cancellationToken = default)
    {
        q = q?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("The query parameter 'q' is required.");

        if (page < 1)
            return BadRequest("The query parameter 'page' must be >= 1.");

        if (yearFrom.HasValue && yearTo.HasValue && yearFrom > yearTo)
            return BadRequest("yearFrom must be less than or equal to yearTo.");

        try
        {
            var result = await _sender.Send(
                new SearchOpenLibraryBooksQuery(q, page, genre, language, yearFrom, yearTo, readableOnly),
                cancellationToken);

            return Ok(result);
        }
        catch (TaskCanceledException)
        {
            return StatusCode(504, "Open Library tardó demasiado en responder.");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, $"Open Library no está disponible temporalmente: {ex.Message}");
        }
    }

    [HttpGet("works/{workId}")]
    public async Task<IActionResult> GetWorkById(
        string workId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _sender.Send(
                new GetOpenLibraryWorkByIdQuery(workId),
                cancellationToken);

            if (result is null)
            {
                return NotFound($"No se encontró la obra '{workId}'.");
            }

            return Ok(result);
        }
        catch (TaskCanceledException)
        {
            return StatusCode(504, "Open Library tardó demasiado en responder.");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(503, $"Open Library no está disponible temporalmente: {ex.Message}");
        }
    }

    [HttpGet("works/{workId}/read-options")]
    public async Task<IActionResult> GetReadOptions(
        string workId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _sender.Send(
                new GetOpenLibraryReadOptionsQuery(workId),
                cancellationToken);

            // Nunca romper la UI por esto.
            if (result is null)
            {
                return Ok(new
                {
                    workId,
                    canReadOnline = false,
                    canBorrow = false,
                    availabilityStatus = (string?)null,
                    readUrl = $"https://openlibrary.org/works/{workId}",
                    borrowUrl = (string?)null,
                    candidateEditionIds = Array.Empty<string>(),
                    isbns = Array.Empty<string>()
                });
            }

            return Ok(result);
        }
        catch (TaskCanceledException)
        {
            return Ok(new
            {
                workId,
                canReadOnline = false,
                canBorrow = false,
                availabilityStatus = "timeout",
                readUrl = $"https://openlibrary.org/works/{workId}",
                borrowUrl = (string?)null,
                candidateEditionIds = Array.Empty<string>(),
                isbns = Array.Empty<string>()
            });
        }
        catch (HttpRequestException)
        {
            return Ok(new
            {
                workId,
                canReadOnline = false,
                canBorrow = false,
                availabilityStatus = "unavailable",
                readUrl = $"https://openlibrary.org/works/{workId}",
                borrowUrl = (string?)null,
                candidateEditionIds = Array.Empty<string>(),
                isbns = Array.Empty<string>()
            });
        }
    }
}