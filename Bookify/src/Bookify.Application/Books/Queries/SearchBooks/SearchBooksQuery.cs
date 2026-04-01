using Bookify.Application.Books.Dtos;
using Bookify.Application.Common.Pagination;
using MediatR;

namespace Bookify.Application.Books.Queries.SearchBooks;

public sealed record SearchBooksQuery(
    string Q,
    int Page = 1,
    string? Sort = null
) : IRequest<PagedResult<BookListItemDto>>;