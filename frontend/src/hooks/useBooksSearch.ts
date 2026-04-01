import { useQuery } from "@tanstack/react-query";
import { searchBooks } from "../api/booksApi";

export function useBooksSearch(q: string, page: number, sort: string) {
  return useQuery({
    queryKey: ["books", q, page, sort],
    queryFn: () => searchBooks(q, page, sort),
    enabled: q.trim().length > 0,
  });
}