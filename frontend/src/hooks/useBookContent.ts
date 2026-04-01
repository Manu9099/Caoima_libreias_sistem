import { useQuery } from "@tanstack/react-query";
import { getBookContent } from "../api/booksApi";

export function useBookContent(id: string) {
  return useQuery({
    queryKey: ["book-content", id],
    queryFn: () => getBookContent(id),
    enabled: !!id,
  });
}