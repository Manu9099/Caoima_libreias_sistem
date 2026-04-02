using System.Text.Json;

namespace Bookify.Infrastructure.ExternalServices.OpenLibrary;

public sealed class OpenLibraryClient
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public OpenLibraryClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<OpenLibrarySearchResponse?> SearchAsync(
        string queryParams,
        CancellationToken cancellationToken = default)
    {
        var url = $"search.json?{queryParams}";
        const int maxAttempts = 3;

        for (int attempt = 1; attempt <= maxAttempts; attempt++)
        {
            using var response = await _httpClient.GetAsync(
                url,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

            if (response.IsSuccessStatusCode)
            {
                await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
                return await JsonSerializer.DeserializeAsync<OpenLibrarySearchResponse>(
                    stream,
                    JsonOptions,
                    cancellationToken);
            }

            if ((int)response.StatusCode == 503 && attempt < maxAttempts)
            {
                await Task.Delay(TimeSpan.FromSeconds(attempt * 2), cancellationToken);
                continue;
            }

            response.EnsureSuccessStatusCode();
        }

        return null;
    }

    public async Task<OpenLibraryWorkResponse?> GetWorkByIdAsync(
        string workId,
        CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.GetAsync(
            $"works/{workId}.json",
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        return await JsonSerializer.DeserializeAsync<OpenLibraryWorkResponse>(
            stream,
            JsonOptions,
            cancellationToken);
    }

    public static string BuildCoverUrlFromCoverId(int coverId, string size = "M")
        => $"https://covers.openlibrary.org/b/id/{coverId}-{size}.jpg";

    public static string BuildWorkPageUrl(string workId)
        => $"https://openlibrary.org/works/{workId}";
}