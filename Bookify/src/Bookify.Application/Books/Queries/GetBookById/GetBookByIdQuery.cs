using Bookify.Application.Books.Dtos;
using MediatR;

namespace Bookify.Application.Books.Queries.GetBookById;

public sealed record GetBookByIdQuery(int Id) : IRequest<BookDetailDto?>;