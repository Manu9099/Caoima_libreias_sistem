using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using MediatR;

namespace Bookify.Application.Books.Queries.OpenLibrary.GetOpenLibraryWorkById;

public sealed class GetOpenLibraryWorkByIdQueryHandler 
    : IRequestHandler<GetOpenLibraryWorkByIdQuery, OpenLibraryBookDetailDto?>
{
    private readonly IOpenLibraryCatalogService _service;
    
    public GetOpenLibraryWorkByIdQueryHandler(IOpenLibraryCatalogService service)
    {
        _service = service;
    }
    
    public Task<OpenLibraryBookDetailDto?> Handle(
        GetOpenLibraryWorkByIdQuery request,
        CancellationToken cancellationToken)
    {
        return _service.GetWorkByIdAsync(request.WorkId, cancellationToken);
    }
}