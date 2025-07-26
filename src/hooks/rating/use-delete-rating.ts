import { useMutation } from "@tanstack/react-query";
import { RatingService } from "@/services/rating/rating.service";

export const useDeleteRating = () => {
  return useMutation({
    mutationFn: (id: number) => RatingService.deleteRating(id),
  });
};
