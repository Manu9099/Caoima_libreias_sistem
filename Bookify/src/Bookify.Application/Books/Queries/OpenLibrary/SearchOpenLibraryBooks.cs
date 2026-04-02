using Bookify.Application.Books.Dtos;
using Bookify.Application.Common.Pagination;
using MediatR;

namespace Bookify.Application.Books.Queries.OpenLibrary.SearchOpenLibraryBooks;

public sealed record SearchOpenLibraryBooksQuery(
    string Q,
    int Page = 1,
    string? Genre = null,
    string? Language = null,
    int? YearFrom = null,
    int? YearTo = null,
    bool ReadableOnly = false) : IRequest<PagedResult<OpenLibraryBookListItemDto>>;