import { useCallback, useEffect, useMemo, useState } from "react";
import type { BookDetail, BookListItem } from "../types/book";
import {
  getFavorites,
  getStorageEventName,
  isFavorite as isFavoriteUtil,
  toggleFavorite as toggleFavoriteUtil,
} from "../utils/localLibrary";

type BookLike = BookListItem | BookDetail;

export function useFavorites() {
  const [favorites, setFavorites] = useState(getFavorites);

  const sync = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", sync);
    window.addEventListener(getStorageEventName(), sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(getStorageEventName(), sync);
    };
  }, [sync]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((book) => book.id)),
    [favorites]
  );

  const toggleFavorite = useCallback((book: BookLike) => {
    toggleFavoriteUtil(book);
    setFavorites(getFavorites());
  }, []);

  const isFavorite = useCallback(
    (bookId: number) => favoriteIds.has(bookId) || isFavoriteUtil(bookId),
    [favoriteIds]
  );

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}