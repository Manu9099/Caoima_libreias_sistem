using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using MediatR;

namespace Bookify.Application.Books.Queries.OpenLibrary.GetOpenLibraryReadOptions;

public sealed class GetOpenLibraryReadOptionsQueryHandler 
    : IRequestHandler<GetOpenLibraryReadOptionsQuery, OpenLibraryReadOptionsDto?>
{
    private readonly IOpenLibraryCatalogService _service;
    
    public GetOpenLibraryReadOptionsQueryHandler(IOpenLibraryCatalogService service)
    {
        _service = service;
    }
    
    public Task<OpenLibraryReadOptionsDto?> Handle(
        GetOpenLibraryReadOptionsQuery request,
        CancellationToken cancellationToken)
    {
        return _service.GetReadOptionsAsync(request.WorkId, cancellationToken);
    }
}