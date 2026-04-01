using Bookify.Application.Books.Queries.GetBookById;
using Bookify.Application.Books.Queries.GetBookContent;
using Bookify.Application.Books.Queries.SearchBooks;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Bookify.WebApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class BooksController : ControllerBase
{
    private static readonly HashSet<string> AllowedSorts = new(StringComparer.OrdinalIgnoreCase)
    {
        "title_asc",
        "title_desc",
        "author_asc",
        "author_desc",
        "year_asc",
        "year_desc",
        "downloads_asc",
        "downloads_desc"
    };

    private readonly ISender _sender;

    public BooksController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] string q,
        [FromQuery] int page = 1,
        [FromQuery] string? sort = null,
        CancellationToken cancellationToken = default)
    {
        q = q?.Trim() ?? string.Empty;

        if (string.IsNullOrWhiteSpace(q))
            return BadRequest("The query parameter 'q' is required and cannot be empty.");

        if (page < 1)
            return BadRequest("The query parameter 'page' must be greater than or equal to 1.");

        if (!string.IsNullOrWhiteSpace(sort) && !AllowedSorts.Contains(sort))
        {
            return BadRequest(
                "Invalid sort value. Allowed values: title_asc, title_desc, author_asc, author_desc, year_asc, year_desc, downloads_asc, downloads_desc."
            );
        }

        try
        {
            var result = await _sender.Send(
                new SearchBooksQuery(q, page, sort),
                cancellationToken);

            return Ok(result);
        }
        catch (TaskCanceledException)
        {
            return StatusCode(504, "Gutendex tardó demasiado en responder.");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, $"Error consultando Gutendex: {ex.Message}");
        }
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _sender.Send(
                new GetBookByIdQuery(id),
                cancellationToken);

            return result is null ? NotFound() : Ok(result);
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, $"Error consultando Gutendex: {ex.Message}");
        }
    }

    [HttpGet("{id:int}/content")]
    public async Task<IActionResult> GetContent(
        int id,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _sender.Send(
                new GetBookContentQuery(id),
                cancellationToken);

            return result is null ? NotFound() : Ok(result);
        }
        catch (TaskCanceledException)
        {
            return StatusCode(504, "La descarga del contenido tardó demasiado.");
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, $"Error descargando contenido del libro: {ex.Message}");
        }
    }
}