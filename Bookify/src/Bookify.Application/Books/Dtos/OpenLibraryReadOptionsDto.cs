namespace Bookify.Application.Books.Dtos;
public sealed record OpenLibraryReadOptionsDto(
    string WorkId,
    bool CanReadOnline,
    bool CanBorrow,
    string? AvailabilityStatus,
    string? ReadUrl,
    string? BorrowUrl,
    IReadOnlyList<string> CandidateEditionIds,
    IReadOnlyList<string> Isbns);