import { useInfiniteRatingList } from "@/hooks/rating/use-rating-list";
import { Option, SingleSelect } from "./base";
import { Rating } from "@/models/rating";

export default function RatingSelect({
  defaultValue,
  placeholder,
  onChange,
}: {
  defaultValue?: Option | null;
  placeholder?: string;
  onChange?: (value: Option | null) => void;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRatingList();

  const options: Option[] =
    data?.pages.flatMap(
      (page) =>
        page.items?.map((rating: Rating) => ({
          value: String(rating.id),
          label: rating.name,
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
