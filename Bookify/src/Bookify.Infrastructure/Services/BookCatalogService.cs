using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using Bookify.Application.Common.Pagination;
using Bookify.Infrastructure.ExternalServices.Gutendex;

namespace Bookify.Infrastructure.Services;

public sealed class BookCatalogService : IBookCatalogService
{
    private readonly GutendexClient _gutendexClient;

    public BookCatalogService(GutendexClient gutendexClient)
    {
        _gutendexClient = gutendexClient;
    }

    public async Task<PagedResult<BookListItemDto>> SearchAsync(
        string query,
        int page,
        string? sort,
        CancellationToken cancellationToken = default)
    {
        var response = await _gutendexClient.SearchBooksAsync(query, page, cancellationToken);

        if (response is null)
        {
            return new PagedResult<BookListItemDto>(
                [],
                page,
                32,
                0,
                0
            );
        }

        var items = response.Results.Select(book => new BookListItemDto(
            book.Id,
            book.Title,
            book.Authors.FirstOrDefault()?.Name ?? "Autor desconocido",
            ResolveCoverUrl(book.Formats),
            null,
            book.DownloadCount,
            HasHtmlFormat(book.Formats)
        )).ToList();

        items = ApplySort(items, sort).ToList();

        var totalPages = (int)Math.Ceiling(response.Count / 32.0);

        return new PagedResult<BookListItemDto>(
            items,
            page,
            32,
            response.Count,
            totalPages
        );
    }

    public async Task<BookDetailDto?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var book = await _gutendexClient.GetBookByIdAsync(id, cancellationToken);
        if (book is null) return null;

        return new BookDetailDto(
            book.Id,
            book.Title,
            book.Authors.Select(a => new AuthorDto(a.Name, a.BirthYear, a.DeathYear)).ToList(),
            book.Languages,
            book.Subjects,
            book.Summaries,
            ResolveCoverUrl(book.Formats),
            book.DownloadCount,
            null,
            new BookFormatsDto(
                Html: HasHtmlFormat(book.Formats),
                PlainText: HasPlainTextFormat(book.Formats),
                Epub: HasFormat(book.Formats, "application/epub+zip"),
                Kindle: HasFormat(book.Formats, "application/x-mobipocket-ebook")
            )
        );
    }

    private static IEnumerable<BookListItemDto> ApplySort(
        IEnumerable<BookListItemDto> source,
        string? sort)
    {
        return sort?.ToLowerInvariant() switch
        {
            "title_asc" => source.OrderBy(x => x.Title),
            "title_desc" => source.OrderByDescending(x => x.Title),
            "author_asc" => source.OrderBy(x => x.Author),
            "author_desc" => source.OrderByDescending(x => x.Author),
            "downloads_desc" => source.OrderByDescending(x => x.DownloadCount),
            "downloads_asc" => source.OrderBy(x => x.DownloadCount),
            "year_desc" => source.OrderByDescending(x => x.Year),
            "year_asc" => source.OrderBy(x => x.Year),
            _ => source
        };
    }

    private static string? ResolveCoverUrl(Dictionary<string, string> formats)
    {
        var image = formats.FirstOrDefault(x =>
            x.Key.StartsWith("image/jpeg", StringComparison.OrdinalIgnoreCase));

        return string.IsNullOrWhiteSpace(image.Value) ? null : image.Value;
    }

    private static bool HasHtmlFormat(Dictionary<string, string> formats)
        => formats.Keys.Any(k => k.StartsWith("text/html", StringComparison.OrdinalIgnoreCase));

    private static bool HasPlainTextFormat(Dictionary<string, string> formats)
        => formats.Keys.Any(k => k.StartsWith("text/plain", StringComparison.OrdinalIgnoreCase));

    private static bool HasFormat(Dictionary<string, string> formats, string format)
        => formats.Keys.Any(k => k.StartsWith(format, StringComparison.OrdinalIgnoreCase));
}