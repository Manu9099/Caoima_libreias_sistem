using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using Bookify.Application.Common.Pagination;
using MediatR;

namespace Bookify.Application.Books.Queries.SearchBooks;

public sealed class SearchBooksQueryHandler
    : IRequestHandler<SearchBooksQuery, PagedResult<BookListItemDto>>
{
    private readonly IBookCatalogService _bookCatalogService;

    public SearchBooksQueryHandler(IBookCatalogService bookCatalogService)
    {
        _bookCatalogService = bookCatalogService;
    }

    public Task<PagedResult<BookListItemDto>> Handle(
        SearchBooksQuery request,
        CancellationToken cancellationToken)
    {
        return _bookCatalogService.SearchAsync(
            request.Q,
            request.Page,
            request.Sort,
            cancellationToken);
    }
}