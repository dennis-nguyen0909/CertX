import { useInfiniteUserDepartmentList } from "@/hooks/user/use-user-department-list";
import { useCallback, useState } from "react";
import { SingleSelect, Option } from "./base";
import { useDebounce } from "@/hooks/use-debounce";

export default function DepartmentSelect({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUserDepartmentList({
      pageSize: 10,
      name: debouncedSearch,
    });

  const handleEndReached = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const handleChange = useCallback(
    (value: Option | null) => {
      onChange?.(value);
    },
    [onChange]
  );

  const options =
    data?.pages
      .flatMap((page) => page?.items ?? [])
      .map((department) => ({
        value: String(department.id),
        label: department.name,
      })) ?? [];

  return (
    <SingleSelect
      placeholder={placeholder}
      defaultValue={defaultValue ?? null}
      isLoading={isFetchingNextPage}
      options={options}
      onEndReached={handleEndReached}
      onSearch={handleSearch}
      onChange={handleChange}
      showCheckbox={false}
    />
  );
}
