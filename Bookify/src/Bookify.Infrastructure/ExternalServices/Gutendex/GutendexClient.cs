using System.Text.Json;

namespace Bookify.Infrastructure.ExternalServices.Gutendex;

public sealed class GutendexClient
{
    private readonly HttpClient _httpClient;
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public GutendexClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<GutendexSearchResponse?> SearchBooksAsync(
        string query,
        int page,
        CancellationToken cancellationToken = default)
    {
        var url = $"books?search={Uri.EscapeDataString(query)}&page={page}";

        using var response = await _httpClient.GetAsync(
            url,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);

        return await JsonSerializer.DeserializeAsync<GutendexSearchResponse>(
            stream,
            JsonOptions,
            cancellationToken);
    }

    public async Task<GutendexBookResponse?> GetBookByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        using var response = await _httpClient.GetAsync(
            $"books/{id}",
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);

        return await JsonSerializer.DeserializeAsync<GutendexBookResponse>(
            stream,
            JsonOptions,
            cancellationToken);
    }

    public async Task<string?> GetRawContentAsync(
        string url,
        CancellationToken cancellationToken = default)
    {
        var finalUrl = await ResolveRedirectsAsync(url, cancellationToken);

        using var response = await _httpClient.GetAsync(
            finalUrl,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        return await response.Content.ReadAsStringAsync(cancellationToken);
    }

    private async Task<string> ResolveRedirectsAsync(
        string url,
        CancellationToken cancellationToken)
    {
        string currentUrl = url;

        for (int i = 0; i < 5; i++)
        {
            using var request = new HttpRequestMessage(HttpMethod.Get, currentUrl);
            using var response = await _httpClient.SendAsync(
                request,
                HttpCompletionOption.ResponseHeadersRead,
                cancellationToken);

            if ((int)response.StatusCode >= 300 &&
                (int)response.StatusCode < 400 &&
                response.Headers.Location is not null)
            {
                currentUrl = response.Headers.Location.IsAbsoluteUri
                    ? response.Headers.Location.ToString()
                    : new Uri(new Uri(currentUrl), response.Headers.Location).ToString();

                continue;
            }

            if (response.IsSuccessStatusCode)
            {
                return currentUrl;
            }

            response.EnsureSuccessStatusCode();
        }

        return currentUrl;
    }
}