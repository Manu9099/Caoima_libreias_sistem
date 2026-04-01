namespace Bookify.Application.Books.Dtos;

public sealed record AuthorDto(
    string Name,
    int? BirthYear,
    int? DeathYear
);

public sealed record BookFormatsDto(
    bool Html,
    bool PlainText,
    bool Epub,
    bool Kindle
);

public sealed record BookDetailDto(
    int Id,
    string Title,
    IReadOnlyList<AuthorDto> Authors,
    IReadOnlyList<string> Languages,
    IReadOnlyList<string> Subjects,
    IReadOnlyList<string> Summaries,
    string? CoverUrl,
    int DownloadCount,
    int? Year,
    BookFormatsDto Formats
);