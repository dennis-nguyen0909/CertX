import { useInfiniteDepartmentList } from "@/hooks/user/use-department-list";
import { useCallback, useState } from "react";
import { SingleSelect, Option } from "./base";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { UserOfDepartment } from "@/models/user";

export default function DepartmentSelect({
  defaultValue,
  placeholder,
  onChange,
  className,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
  className?: string;
}) {
  const [search, setSearch] = useState("");
  const role = useSelector((state: RootState) => state.user.role);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteDepartmentList({
      role: role?.toLowerCase() || "pdt",
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
      .map((department: UserOfDepartment) => ({
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
      className={className}
    />
  );
}
