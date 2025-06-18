import { useInfiniteDegreeTitleList } from "@/hooks/degree/use-degree-title-list";
import { Option, SingleSelect } from "./base";
import { DegreeTitle } from "@/models/degree";

export default function DegreeTitleSelect({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteDegreeTitleList();

  const options: Option[] =
    data?.pages.flatMap(
      (page) =>
        page.items?.map((title: DegreeTitle) => ({
          value: String(title.id),
          label: title.name,
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
    />
  );
}
