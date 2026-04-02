namespace Bookify.Application.Books.Dtos;
public sealed record OpenLibraryBookDetailDto(
    string WorkId,
    string Title,
    IReadOnlyList<string> Authors,
    string? Description,
    string? CoverUrl,
    IReadOnlyList<string> Subjects,
    IReadOnlyList<string> Languages,
    int? FirstPublishYear,
    int EditionCount,
    bool HasFullText);

// OpenLibraryReadOptionsDto.cs