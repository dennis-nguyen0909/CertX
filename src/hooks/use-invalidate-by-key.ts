import { useQueryClient } from "@tanstack/react-query";

/**
 * Trả về một hàm để invalidate tất cả queryKey có chứa từ khóa (ví dụ: "certificate" hoặc "degree")
 * @param keyword Từ khóa cần tìm trong queryKey
 */
export function useInvalidateByKey(keyword: string) {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey.some(
          (key) => typeof key === "string" && key.includes(keyword)
        ),
    });
}
