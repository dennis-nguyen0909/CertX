import { useMutation } from "@tanstack/react-query";
import { RatingService } from "@/services/rating/rating.service";

export const useCreateRating = () => {
  return useMutation({
    mutationFn: (name: string) => RatingService.createRating(name),
  });
};
