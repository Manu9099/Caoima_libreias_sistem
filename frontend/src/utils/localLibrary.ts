import type { BookDetail, BookListItem } from "../types/book";

const FAVORITES_KEY = "bookify:favorites";
const HISTORY_KEY = "bookify:history";
const PROGRESS_KEY = "bookify:progress";
const STORAGE_EVENT = "bookify-storage";

export type LocalBookItem = BookListItem & {
  savedAt?: string;
  lastOpenedAt?: string;
  progress?: number;
};

export type ReadingProgress = {
  bookId: number;
  percentage: number;
  scrollTop: number;
  updatedAt: string;
};

type BookLike = BookListItem | BookDetail;

function isBrowser() {
  return typeof window !== "undefined";
}

function notifyStorageChange() {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

export function getStorageEventName() {
  return STORAGE_EVENT;
}

function readJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!isBrowser()) return;

  window.localStorage.setItem(key, JSON.stringify(value));
  notifyStorageChange();
}

function normalizeBook(book: BookLike): LocalBookItem {
  if ("authors" in book) {
    return {
      id: book.id,
      title: book.title,
      author: book.authors.map((author) => author.name).join(", ") || "Autor desconocido",
      coverUrl: book.coverUrl,
      year: book.year,
      downloadCount: book.downloadCount,
      hasHtmlContent: book.formats.html,
    };
  }

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.coverUrl,
    year: book.year,
    downloadCount: book.downloadCount,
    hasHtmlContent: book.hasHtmlContent,
  };
}

export function getFavorites(): LocalBookItem[] {
  return readJson<LocalBookItem[]>(FAVORITES_KEY, []);
}

export function isFavorite(bookId: number) {
  return getFavorites().some((book) => book.id === bookId);
}

export function toggleFavorite(book: BookLike) {
  const normalized = normalizeBook(book);
  const favorites = getFavorites();

  const exists = favorites.some((item) => item.id === normalized.id);

  if (exists) {
    writeJson(
      FAVORITES_KEY,
      favorites.filter((item) => item.id !== normalized.id)
    );
    return false;
  }

  writeJson(FAVORITES_KEY, [
    {
      ...normalized,
      savedAt: new Date().toISOString(),
    },
    ...favorites,
  ]);

  return true;
}

export function getProgressMap() {
  return readJson<Record<string, ReadingProgress>>(PROGRESS_KEY, {});
}

export function getReadingProgress(bookId: number): ReadingProgress | null {
  const progressMap = getProgressMap();
  return progressMap[String(bookId)] ?? null;
}

export function saveReadingProgress(
  bookId: number,
  percentage: number,
  scrollTop: number
) {
  const progressMap = getProgressMap();

  progressMap[String(bookId)] = {
    bookId,
    percentage,
    scrollTop,
    updatedAt: new Date().toISOString(),
  };

  writeJson(PROGRESS_KEY, progressMap);
}

export function getReadingHistory(): LocalBookItem[] {
  const history = readJson<LocalBookItem[]>(HISTORY_KEY, []);
  const progressMap = getProgressMap();

  return history.map((book) => ({
    ...book,
    progress: progressMap[String(book.id)]?.percentage ?? 0,
  }));
}

export function addToReadingHistory(book: BookLike) {
  const normalized = normalizeBook(book);
  const history = getReadingHistory().filter((item) => item.id !== normalized.id);

  const updated: LocalBookItem[] = [
    {
      ...normalized,
      lastOpenedAt: new Date().toISOString(),
      progress: getReadingProgress(normalized.id)?.percentage ?? 0,
    },
    ...history,
  ].slice(0, 24);

  writeJson(HISTORY_KEY, updated);
}