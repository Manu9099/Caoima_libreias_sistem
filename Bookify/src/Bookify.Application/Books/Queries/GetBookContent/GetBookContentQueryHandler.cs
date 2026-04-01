using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using MediatR;

namespace Bookify.Application.Books.Queries.GetBookContent;

public sealed class GetBookContentQueryHandler
    : IRequestHandler<GetBookContentQuery, BookContentDto?>
{
    private readonly IBookContentService _bookContentService;

    public GetBookContentQueryHandler(IBookContentService bookContentService)
    {
        _bookContentService = bookContentService;
    }

    public Task<BookContentDto?> Handle(
        GetBookContentQuery request,
        CancellationToken cancellationToken)
    {
        return _bookContentService.GetContentAsync(request.Id, cancellationToken);
    }
}