using Bookify.Application.Books.Dtos;
using Bookify.Application.Common.Pagination;

namespace Bookify.Application.Books.Interfaces;

public interface IOpenLibraryCatalogService
{
    Task<PagedResult<OpenLibraryBookListItemDto>> SearchAsync(
        string query,
        int page,
        string? genre,
        string? language,
        int? yearFrom,
        int? yearTo,
        bool readableOnly,
        CancellationToken cancellationToken = default);
    
    Task<OpenLibraryBookDetailDto?> GetWorkByIdAsync(
        string workId,
        CancellationToken cancellationToken = default);
    
    Task<OpenLibraryReadOptionsDto?> GetReadOptionsAsync(
        string workId,
        CancellationToken cancellationToken = default);
}