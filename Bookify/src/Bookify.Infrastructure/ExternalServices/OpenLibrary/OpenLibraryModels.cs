using System.Text.Json.Serialization;

namespace Bookify.Infrastructure.ExternalServices.OpenLibrary;

public sealed class OpenLibrarySearchResponse
{
    [JsonPropertyName("numFound")]
    public int? NumFound { get; set; }

    [JsonPropertyName("num_found")]
    public int? NumFoundLegacy { get; set; }

    [JsonPropertyName("start")]
    public int Start { get; set; }

    [JsonPropertyName("docs")]
    public List<OpenLibrarySearchDoc> Docs { get; set; } = [];

    public int TotalCount => NumFound ?? NumFoundLegacy ?? 0;
}

public sealed class OpenLibrarySearchDoc
{
    [JsonPropertyName("key")]
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("author_name")]
    public List<string>? AuthorName { get; set; }

    [JsonPropertyName("cover_i")]
    public int? CoverId { get; set; }

    [JsonPropertyName("first_publish_year")]
    public int? FirstPublishYear { get; set; }

    [JsonPropertyName("language")]
    public List<string>? Languages { get; set; }

    [JsonPropertyName("subject")]
    public List<string>? Subjects { get; set; }

    [JsonPropertyName("edition_count")]
    public int EditionCount { get; set; }

    [JsonPropertyName("has_fulltext")]
    public bool HasFullText { get; set; }

    [JsonPropertyName("ebook_access")]
    public string? EbookAccess { get; set; }

    [JsonPropertyName("isbn")]
    public List<string>? Isbn { get; set; }
}

public sealed class OpenLibraryWorkResponse
{
    [JsonPropertyName("key")]
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public object? Description { get; set; }

    [JsonPropertyName("subjects")]
    public List<string>? Subjects { get; set; }

    [JsonPropertyName("covers")]
    public List<int>? Covers { get; set; }

    [JsonPropertyName("first_publish_date")]
    public string? FirstPublishDate { get; set; }
}