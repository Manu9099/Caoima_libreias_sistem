using System.Net;
using Bookify.Application.Books.Interfaces;
using Bookify.Infrastructure.ExternalServices.Gutendex;
using Bookify.Infrastructure.ExternalServices.OpenLibrary;
using Bookify.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Bookify.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddHttpClient<GutendexClient>(client =>
        {
            client.BaseAddress = new Uri("https://gutendex.com/");
            client.Timeout = TimeSpan.FromSeconds(90);
             client.DefaultRequestHeaders.UserAgent.ParseAdd("Bookify/1.0");
        })
        .ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
        {
            AllowAutoRedirect = true,
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
        });

        services.AddHttpClient<OpenLibraryClient>(client =>
        {
            client.BaseAddress = new Uri("https://openlibrary.org/");
            client.Timeout = TimeSpan.FromSeconds(60);
            client.DefaultRequestHeaders.UserAgent.ParseAdd("Bookify/1.0 (contact: your-email@example.com)");
        })
        .ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
        {
            AllowAutoRedirect = true,
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate
        });

        services.AddScoped<IBookCatalogService, BookCatalogService>();
        services.AddScoped<IBookContentService, BookContentService>();
        services.AddScoped<IOpenLibraryCatalogService, OpenLibraryCatalogService>();

        return services;
    }
}