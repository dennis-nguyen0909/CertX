import { useInfiniteStudentList } from "@/hooks/student/use-student-list";
import { useCallback, useState } from "react";
import { SingleSelect, Option } from "./base";
import { useDebounce } from "@/hooks/use-debounce";

export default function StudentsSelect({
  defaultValue,
  placeholder,
  onChange,
  disable,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  disable: boolean;
}) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteStudentList({
      pageSize: 10,
      studentCode: debouncedSearch.trim(),
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
      disabled={disable}
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
