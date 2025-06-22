import { useCallback, useState } from "react";
import { SingleSelect, Option } from "./base";
import { Class } from "@/models/class";
import { useInfiniteClassOfDepartment } from "@/hooks/student/use-infinite-class-of-department";

export default function ClassSelect({
  defaultValue,
  placeholder,
  onChange,
  className,
  departmentId,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  className?: string;
  departmentId: string;
}) {
  const [search, setSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteClassOfDepartment({
      departmentId: departmentId,
      pageSize: 10,
      name: search.trim(),
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
      .map((cls: Class) => ({
        value: String(cls.id),
        label: cls.className,
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
      className={className}
      disabled={!departmentId}
    />
  );
}
