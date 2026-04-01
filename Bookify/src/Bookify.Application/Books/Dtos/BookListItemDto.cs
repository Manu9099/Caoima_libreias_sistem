namespace Bookify.Application.Books.Dtos;

public sealed record BookListItemDto(
    int Id,
    string Title,
    string Author,
    string? CoverUrl,
    int? Year,
    int DownloadCount,
    bool HasHtmlContent
);