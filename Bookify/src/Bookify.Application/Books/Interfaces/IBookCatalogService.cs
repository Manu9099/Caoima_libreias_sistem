using Bookify.Application.Books.Dtos;
using Bookify.Application.Common.Pagination;

namespace Bookify.Application.Books.Interfaces;

public interface IBookCatalogService
{
    Task<PagedResult<BookListItemDto>> SearchAsync(
        string query,
        int page,
        string? sort,
        CancellationToken cancellationToken = default);

    Task<BookDetailDto?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);
}