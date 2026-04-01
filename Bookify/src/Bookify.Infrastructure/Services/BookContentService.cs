using System.Net;
using Bookify.Application.Books.Dtos;
using Bookify.Application.Books.Interfaces;
using Bookify.Infrastructure.ExternalServices.Gutendex;

namespace Bookify.Infrastructure.Services;

public sealed class BookContentService : IBookContentService
{
    private readonly GutendexClient _gutendexClient;

    public BookContentService(GutendexClient gutendexClient)
    {
        _gutendexClient = gutendexClient;
    }

    public async Task<BookContentDto?> GetContentAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var book = await _gutendexClient.GetBookByIdAsync(id, cancellationToken);
        if (book is null) return null;

        var htmlUrl = ResolveHtmlUrl(book.Formats);
        if (!string.IsNullOrWhiteSpace(htmlUrl))
        {
            var html = await _gutendexClient.GetRawContentAsync(htmlUrl!, cancellationToken);
            if (string.IsNullOrWhiteSpace(html)) return null;

            return new BookContentDto(
                book.Id,
                book.Title,
                "text/html",
                EnsureHtmlDocument(html)
            );
        }

        var textUrl = ResolvePlainTextUrl(book.Formats);
        if (!string.IsNullOrWhiteSpace(textUrl))
        {
            var text = await _gutendexClient.GetRawContentAsync(textUrl!, cancellationToken);
            if (string.IsNullOrWhiteSpace(text)) return null;

            return new BookContentDto(
                book.Id,
                book.Title,
                "text/html",
                WrapPlainTextAsHtml(book.Title, text)
            );
        }

        return null;
    }

    private static string? ResolveHtmlUrl(Dictionary<string, string> formats)
    {
        return formats
            .Where(x => x.Key.StartsWith("text/html", StringComparison.OrdinalIgnoreCase))
            .Select(x => x.Value)
            .FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
    }

    private static string? ResolvePlainTextUrl(Dictionary<string, string> formats)
    {
        return formats
            .Where(x => x.Key.StartsWith("text/plain", StringComparison.OrdinalIgnoreCase))
            .Select(x => x.Value)
            .FirstOrDefault(v => !string.IsNullOrWhiteSpace(v));
    }

    private static string EnsureHtmlDocument(string html)
    {
        if (html.Contains("<html", StringComparison.OrdinalIgnoreCase))
            return html;

        return $"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>Book content</title>
        </head>
        <body>
          {html}
        </body>
        </html>
        """;
    }

    private static string WrapPlainTextAsHtml(string title, string text)
{
    var encoded = WebUtility.HtmlEncode(text);

    return $$"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>{{WebUtility.HtmlEncode(title)}}</title>
      <style>
        body {
          font-family: Georgia, serif;
          line-height: 1.7;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          color: #111;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: Georgia, serif;
        }
      </style>
    </head>
    <body>
      <h1>{{WebUtility.HtmlEncode(title)}}</h1>
      <pre>{{encoded}}</pre>
    </body>
    </html>
    """;
}
}