export type BookListItem = {
  id: number;
  title: string;
  author: string;
  coverUrl?: string | null;
  year?: number | null;
  downloadCount: number;
  hasHtmlContent: boolean;
};

export type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export type Author = {
  name: string;
  birthYear?: number | null;
  deathYear?: number | null;
};

export type BookDetail = {
  id: number;
  title: string;
  authors: Author[];
  languages: string[];
  subjects: string[];
  summaries: string[];
  coverUrl?: string | null;
  downloadCount: number;
  year?: number | null;
  formats: {
    html: boolean;
    plainText: boolean;
    epub: boolean;
    kindle: boolean;
  };
};

export type BookContent = {
  bookId: number;
  title: string;
  contentType: string;
  html: string;
};