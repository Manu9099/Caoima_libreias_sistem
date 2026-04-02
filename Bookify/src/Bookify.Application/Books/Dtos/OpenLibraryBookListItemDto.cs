namespace Bookify.Application.Books.Dtos;
public sealed record OpenLibraryBookListItemDto(
    string WorkId,
    string Title,
    string Author,
    string? CoverUrl,
    int? FirstPublishYear,
    IReadOnlyList<string> Languages,
    IReadOnlyList<string> Subjects,
    int EditionCount,
    bool HasFullText,
    bool IsReadableOnline,
    bool IsBorrowable);



