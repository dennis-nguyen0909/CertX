import { useInfiniteStudentList } from "@/hooks/student/use-student-list";
import { useCallback, useState } from "react";
import { MultiSelect, Option } from "./base";

export default function StudentsSelect({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: Option[];
  placeholder?: string;
  onChange?: (value: Option[]) => void;
}) {
  const [search, setSearch] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteStudentList({
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
    (value: Option[]) => {
      onChange?.(value);
    },
    [onChange]
  );

  const options =
    data?.pages
      .flatMap((page) => page?.items ?? [])
      .map((student) => ({
        value: String(student.id),
        label: `${student.name} (${student.studentCode})`,
      })) ?? [];

  return (
    <MultiSelect
      placeholder={placeholder}
      defaultValue={defaultValue}
      isLoading={isFetchingNextPage}
      options={options}
      onEndReached={handleEndReached}
      onSearch={handleSearch}
      onChange={handleChange}
    />
  );
}
