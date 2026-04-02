import { useEffect, useState } from "react";
import {
  getReadingProgress,
  getStorageEventName,
  type ReadingProgress,
} from "../utils/localLibrary";

export function useReadingProgress(bookId: number) {
  const [progress, setProgress] = useState<ReadingProgress | null>(() =>
    getReadingProgress(bookId)
  );

  useEffect(() => {
    const sync = () => setProgress(getReadingProgress(bookId));

    window.addEventListener("storage", sync);
    window.addEventListener(getStorageEventName(), sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(getStorageEventName(), sync);
    };
  }, [bookId]);

  return progress;
}
