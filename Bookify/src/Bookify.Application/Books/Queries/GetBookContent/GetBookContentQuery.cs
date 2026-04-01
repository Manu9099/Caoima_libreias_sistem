using Bookify.Application.Books.Dtos;
using MediatR;

namespace Bookify.Application.Books.Queries.GetBookContent;

public sealed record GetBookContentQuery(int Id) : IRequest<BookContentDto?>;