import { useInfiniteUserDepartmentList } from "@/hooks/user/use-user-department-list";
import { useCallback, useState } from "react";
import { SingleSelect, Option } from "./base";

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUserDepartmentList({
      pageSize: 10,
      name: search,
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
