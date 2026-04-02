import type {
  OpenLibraryBookDetail,
  OpenLibraryBookListItem,
  OpenLibraryReadOptions,
  PagedResult,
} from "../types/book";

const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Error en la petición");
  }

  return response.json() as Promise<T>;
}

export type OpenLibrarySearchParams = {
  q: string;
  page?: number;
  genre?: string;
  language?: string;
  yearFrom?: number;
  yearTo?: number;
  readableOnly?: boolean;
};

export async function searchOpenLibraryBooks(
  params: OpenLibrarySearchParams
): Promise<PagedResult<OpenLibraryBookListItem>> {
  const searchParams = new URLSearchParams();

  searchParams.set("q", params.q);
  searchParams.set("page", String(params.page ?? 1));

  if (params.genre?.trim()) searchParams.set("genre", params.genre.trim());
  if (params.language?.trim()) searchParams.set("language", params.language.trim());
  if (params.yearFrom) searchParams.set("yearFrom", String(params.yearFrom));
  if (params.yearTo) searchParams.set("yearTo", String(params.yearTo));
  if (params.readableOnly) searchParams.set("readableOnly", "true");

  const response = await fetch(
    `${API_URL}/api/open-library/search?${searchParams.toString()}`
  );

  return handleResponse<PagedResult<OpenLibraryBookListItem>>(response);
}

export async function getOpenLibraryWorkById(
  workId: string
): Promise<OpenLibraryBookDetail> {
  const response = await fetch(`${API_URL}/api/open-library/works/${workId}`);
  return handleResponse<OpenLibraryBookDetail>(response);
}

export async function getOpenLibraryReadOptions(
  workId: string
): Promise<OpenLibraryReadOptions> {
  const response = await fetch(
    `${API_URL}/api/open-library/works/${workId}/read-options`
  );
  return handleResponse<OpenLibraryReadOptions>(response);
}