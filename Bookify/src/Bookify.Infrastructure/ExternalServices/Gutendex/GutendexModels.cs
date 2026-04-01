using System.Text.Json.Serialization;

namespace Bookify.Infrastructure.ExternalServices.Gutendex;

public sealed class GutendexSearchResponse
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("next")]
    public string? Next { get; set; }

    [JsonPropertyName("previous")]
    public string? Previous { get; set; }

    [JsonPropertyName("results")]
    public List<GutendexBookResponse> Results { get; set; } = [];
}

public sealed class GutendexBookResponse
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("authors")]
    public List<GutendexAuthorResponse> Authors { get; set; } = [];

    [JsonPropertyName("subjects")]
    public List<string> Subjects { get; set; } = [];

    [JsonPropertyName("summaries")]
    public List<string> Summaries { get; set; } = [];

    [JsonPropertyName("languages")]
    public List<string> Languages { get; set; } = [];

    [JsonPropertyName("download_count")]
    public int DownloadCount { get; set; }

    [JsonPropertyName("formats")]
    public Dictionary<string, string> Formats { get; set; } = [];
}

public sealed class GutendexAuthorResponse
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("birth_year")]
    public int? BirthYear { get; set; }

    [JsonPropertyName("death_year")]
    public int? DeathYear { get; set; }
}