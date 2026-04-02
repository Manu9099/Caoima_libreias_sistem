import { useQuery } from "@tanstack/react-query";
import { getOpenLibraryWorkById } from "../api/openLibraryApi";

export function useOpenLibraryDetail(workId: string) {
  return useQuery({
    queryKey: ["open-library-work", workId],
    queryFn: () => getOpenLibraryWorkById(workId),
    enabled: !!workId,
  });
}