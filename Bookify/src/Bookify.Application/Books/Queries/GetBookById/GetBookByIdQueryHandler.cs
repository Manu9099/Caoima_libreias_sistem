using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using MediatR;

namespace Bookify.Application.Books.Queries.GetBookById;

public sealed class GetBookByIdQueryHandler
    : IRequestHandler<GetBookByIdQuery, BookDetailDto?>
{
    private readonly IBookCatalogService _bookCatalogService;

    public GetBookByIdQueryHandler(IBookCatalogService bookCatalogService)
    {
        _bookCatalogService = bookCatalogService;
    }

    public Task<BookDetailDto?> Handle(
        GetBookByIdQuery request,
        CancellationToken cancellationToken)
    {
        return _bookCatalogService.GetByIdAsync(request.Id, cancellationToken);
    }
}