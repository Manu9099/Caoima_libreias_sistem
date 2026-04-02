using System.Text;
using System.Text.Json;
using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using Bookify.Application.Common.Pagination;
using Bookify.Infrastructure.ExternalServices.OpenLibrary;

namespace Bookify.Infrastructure.Services;

public sealed class OpenLibraryCatalogService : IOpenLibraryCatalogService
{
    private const int PageSize = 20;
    private readonly OpenLibraryClient _client;

    public OpenLibraryCatalogService(OpenLibraryClient client)
    {
        _client = client;
    }

    public async Task<PagedResult<OpenLibraryBookListItemDto>> SearchAsync(
        string query,
        int page,
        string? genre,
        string? language,
        int? yearFrom,
        int? yearTo,
        bool readableOnly,
        CancellationToken cancellationToken = default)
    {
        var fullQueryString = BuildSearchQuery(
            query,
            page,
            genre,
            language,
            yearFrom,
            yearTo,
            readableOnly);

        var response = await _client.SearchAsync(fullQueryString, cancellationToken);

        if (response is null)
        {
            return new PagedResult<OpenLibraryBookListItemDto>([], page, PageSize, 0, 0);
        }

        var items = response.Docs
            .Where(d => !string.IsNullOrWhiteSpace(d.Key) && !string.IsNullOrWhiteSpace(d.Title))
            .Select(MapListItem)
            .ToList();

        var totalCount = response.TotalCount;
        var totalPages = totalCount == 0
            ? 0
            : (int)Math.Ceiling(totalCount / (double)PageSize);

        return new PagedResult<OpenLibraryBookListItemDto>(
            items,
            page,
            PageSize,
            totalCount,
            totalPages
        );
    }

    public async Task<OpenLibraryBookDetailDto?> GetWorkByIdAsync(
    string workId,
    CancellationToken cancellationToken = default)
{
    var normalizedWorkId = NormalizeWorkId(workId);

    try
    {
        var work = await _client.GetWorkByIdAsync(normalizedWorkId, cancellationToken);
        if (work is null) return null;

        return new OpenLibraryBookDetailDto(
            normalizedWorkId,
            work.Title,
            [],
            ExtractDescription(work.Description),
            work.Covers?.Count > 0
                ? OpenLibraryClient.BuildCoverUrlFromCoverId(work.Covers[0])
                : null,
            work.Subjects ?? [],
            [],
            TryExtractYear(work.FirstPublishDate),
            0,
            false
        );
    }
    catch (HttpRequestException)
    {
        return null;
    }
}

    public Task<OpenLibraryReadOptionsDto?> GetReadOptionsAsync(
        string workId,
        CancellationToken cancellationToken = default)
    {
        // Dejamos esto simple por ahora hasta cerrar bien la búsqueda.
        var normalizedWorkId = NormalizeWorkId(workId);

        var result = new OpenLibraryReadOptionsDto(
            normalizedWorkId,
            CanReadOnline: false,
            CanBorrow: false,
            AvailabilityStatus: null,
            ReadUrl: OpenLibraryClient.BuildWorkPageUrl(normalizedWorkId),
            BorrowUrl: null,
            CandidateEditionIds: [],
            Isbns: []
        );

        return Task.FromResult<OpenLibraryReadOptionsDto?>(result);
    }

    private static string BuildSearchQuery(
        string query,
        int page,
        string? genre,
        string? language,
        int? yearFrom,
        int? yearTo,
        bool readableOnly)
    {
        var qParts = new List<string>();

        if (!string.IsNullOrWhiteSpace(query))
            qParts.Add(query.Trim());

        if (!string.IsNullOrWhiteSpace(genre))
            qParts.Add($"subject:{genre.Trim()}");

        if (!string.IsNullOrWhiteSpace(language))
            qParts.Add($"language:{language.Trim().ToLowerInvariant()}");

        if (yearFrom.HasValue || yearTo.HasValue)
        {
            var from = yearFrom?.ToString() ?? "*";
            var to = yearTo?.ToString() ?? "*";
            qParts.Add($"first_publish_year:[{from} TO {to}]");
        }

        if (readableOnly)
            qParts.Add("(ebook_access:public OR ebook_access:borrowable)");

        var q = string.Join(" ", qParts);

        var sb = new StringBuilder();
        sb.Append("q=").Append(Uri.EscapeDataString(q));
        sb.Append("&fields=key,title,author_name,cover_i,first_publish_year,language,subject,edition_count,has_fulltext,ebook_access,isbn");
        sb.Append("&limit=").Append(PageSize);
        sb.Append("&page=").Append(page);

        return sb.ToString();
    }

    private static OpenLibraryBookListItemDto MapListItem(OpenLibrarySearchDoc doc)
    {
        var normalizedWorkId = NormalizeWorkId(doc.Key);

        var ebookAccess = doc.EbookAccess?.ToLowerInvariant();
        var isReadableOnline = ebookAccess == "public";
        var isBorrowable = ebookAccess == "borrowable";

        return new OpenLibraryBookListItemDto(
            normalizedWorkId,
            doc.Title,
            doc.AuthorName?.FirstOrDefault() ?? "Autor desconocido",
            doc.CoverId.HasValue
                ? OpenLibraryClient.BuildCoverUrlFromCoverId(doc.CoverId.Value)
                : null,
            doc.FirstPublishYear,
            doc.Languages ?? [],
            doc.Subjects ?? [],
            doc.EditionCount,
            doc.HasFullText,
            isReadableOnline,
            isBorrowable
        );
    }

    private static string NormalizeWorkId(string key)
        => key.Replace("/works/", "", StringComparison.OrdinalIgnoreCase);

    private static string? ExtractDescription(object? description)
    {
        return description switch
        {
            null => null,
            string s => s,
            JsonElement el when el.ValueKind == JsonValueKind.String => el.GetString(),
            JsonElement el when el.ValueKind == JsonValueKind.Object && el.TryGetProperty("value", out var value) => value.GetString(),
            _ => null
        };
    }

    private static int? TryExtractYear(string? firstPublishDate)
    {
        if (string.IsNullOrWhiteSpace(firstPublishDate))
            return null;

        var digits = new string(firstPublishDate.Take(4).ToArray());
        return int.TryParse(digits, out var year) ? year : null;
    }
}