using Bookify.Application.Books.Dtos;

namespace Bookify.Application.Books.Interfaces;

public interface IBookContentService
{
    Task<BookContentDto?> GetContentAsync(
        int id,
        CancellationToken cancellationToken = default);
}