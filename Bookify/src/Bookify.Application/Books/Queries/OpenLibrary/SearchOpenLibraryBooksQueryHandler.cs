using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using Bookify.Application.Common.Pagination;
using MediatR;

namespace Bookify.Application.Books.Queries.OpenLibrary.SearchOpenLibraryBooks;

public sealed class SearchOpenLibraryBooksQueryHandler 
    : IRequestHandler<SearchOpenLibraryBooksQuery, PagedResult<OpenLibraryBookListItemDto>>
{
    private readonly IOpenLibraryCatalogService _service;
    
    public SearchOpenLibraryBooksQueryHandler(IOpenLibraryCatalogService service)
    {
        _service = service;
    }
    
    public Task<PagedResult<OpenLibraryBookListItemDto>> Handle(
        SearchOpenLibraryBooksQuery request,
        CancellationToken cancellationToken)
    {
        return _service.SearchAsync(
            request.Q,
            request.Page,
            request.Genre,
            request.Language,
            request.YearFrom,
            request.YearTo,
            request.ReadableOnly,
            cancellationToken);
    }
}