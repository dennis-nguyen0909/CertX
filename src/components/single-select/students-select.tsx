import { useInfiniteStudentList } from "@/hooks/student/use-student-list";
import { useCallback, useState } from "react";
import { SingleSelect, Option } from "./base";

export default function StudentsSelect({
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
    useInfiniteStudentList({
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
      .map((student) => ({
        value: String(student.id),
        label: `${student.name} (${student.studentCode})`,
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
    />
  );
}
