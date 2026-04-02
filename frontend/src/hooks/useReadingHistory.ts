import { useCallback, useEffect, useState } from "react";
import type { BookDetail, BookListItem } from "../types/book";
import {
  addToReadingHistory as addToReadingHistoryUtil,
  getReadingHistory,
  getStorageEventName,
} from "../utils/localLibrary";

type BookLike = BookListItem | BookDetail;

export function useReadingHistory() {
  const [history, setHistory] = useState(getReadingHistory);

  const sync = useCallback(() => {
    setHistory(getReadingHistory());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", sync);
    window.addEventListener(getStorageEventName(), sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(getStorageEventName(), sync);
    };
  }, [sync]);

  const addToHistory = useCallback((book: BookLike) => {
    addToReadingHistoryUtil(book);
    setHistory(getReadingHistory());
  }, []);

  return {
    history,
    addToHistory,
  };
}