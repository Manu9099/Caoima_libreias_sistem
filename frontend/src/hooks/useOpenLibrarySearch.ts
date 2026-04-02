import { useQuery } from "@tanstack/react-query";
import {
  searchOpenLibraryBooks,
  type OpenLibrarySearchParams,
} from "../api/openLibraryApi";

export function useOpenLibrarySearch(params: OpenLibrarySearchParams) {
  return useQuery({
    queryKey: ["open-library-books", params],
    queryFn: () => searchOpenLibraryBooks(params),
    enabled: params.q.trim().length > 0,
  });
}