import { useInfiniteEducationModeList } from "@/hooks/education-mode/use-education-mode-list";
import { Option, SingleSelect } from "./base";
import { EducationMode } from "@/models/education-mode";

export default function EducationModeSelect({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteEducationModeList();

  const options: Option[] =
    data?.pages.flatMap(
      (page) =>
        page.items?.map((mode: EducationMode) => ({
          value: String(mode.id),
          label: mode.name,
        })) ?? []
    ) ?? [];

  return (
    <SingleSelect
      placeholder={placeholder}
      defaultValue={defaultValue ?? null}
      isLoading={isFetchingNextPage}
      options={options}
      onEndReached={hasNextPage ? fetchNextPage : undefined}
      onChange={onChange}
      showCheckbox={false}
    />
  );
}
