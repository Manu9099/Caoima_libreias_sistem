using Bookify.Application.Books.Dtos;
using MediatR;

namespace Bookify.Application.Books.Queries.OpenLibrary.GetOpenLibraryWorkById;

public sealed record GetOpenLibraryWorkByIdQuery(string WorkId) : IRequest<OpenLibraryBookDetailDto?>;