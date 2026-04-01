namespace Bookify.Application.Books.Dtos;

public sealed record BookContentDto(
    int BookId,
    string Title,
    string ContentType,
    string Html
);