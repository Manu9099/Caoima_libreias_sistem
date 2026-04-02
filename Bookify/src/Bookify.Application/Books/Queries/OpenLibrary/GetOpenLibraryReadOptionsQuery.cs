using Bookify.Application.Books.Dtos;
using MediatR;

namespace Bookify.Application.Books.Queries.OpenLibrary.GetOpenLibraryReadOptions;

public sealed record GetOpenLibraryReadOptionsQuery(string WorkId) : IRequest<OpenLibraryReadOptionsDto?>;