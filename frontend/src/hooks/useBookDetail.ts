import { useQuery } from "@tanstack/react-query";
import { getBookById } from "../api/booksApi";

export function useBookDetail(id: string) {
  return useQuery({
    queryKey: ["book", id],
    queryFn: () => getBookById(id),
    enabled: !!id,
  });
}