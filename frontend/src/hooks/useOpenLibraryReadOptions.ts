import { useQuery } from "@tanstack/react-query";
import { getOpenLibraryReadOptions } from "../api/openLibraryApi";

export function useOpenLibraryReadOptions(workId: string) {
  return useQuery({
    queryKey: ["open-library-read-options", workId],
    queryFn: () => getOpenLibraryReadOptions(workId),
    enabled: !!workId,
  });
}