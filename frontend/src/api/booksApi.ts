import type { BookContent, BookDetail, BookListItem, PagedResult } from "../types/book";

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error en la petición");
  }

  return response.json() as Promise<T>;
}

export async function searchBooks(
  q: string,
  page = 1,
  sort?: string
): Promise<PagedResult<BookListItem>> {
  const params = new URLSearchParams({
    q,
    page: String(page),
  });

  if (sort) {
    params.append("sort", sort);
  }

  const response = await fetch(`${API_URL}/api/books/search?${params.toString()}`);
  return handleResponse<PagedResult<BookListItem>>(response);
}

export async function getBookById(id: string): Promise<BookDetail> {
  const response = await fetch(`${API_URL}/api/books/${id}`);
  return handleResponse<BookDetail>(response);
}

export async function getBookContent(id: string): Promise<BookContent> {
  const response = await fetch(`${API_URL}/api/books/${id}/content`);
  return handleResponse<BookContent>(response);
}