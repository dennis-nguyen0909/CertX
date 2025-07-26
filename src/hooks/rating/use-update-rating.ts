import { useMutation } from "@tanstack/react-query";
import { RatingService } from "@/services/rating/rating.service";

export const useUpdateRating = () => {
  return useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      RatingService.updateRating(id, name),
  });
};
