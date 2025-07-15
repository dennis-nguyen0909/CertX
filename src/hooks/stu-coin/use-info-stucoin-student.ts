import { useServices } from "@/services";
import { useQuery } from "@tanstack/react-query";

export function useInfoStudentSTUCoin() {
  const { STUCoinService } = useServices();
  return useQuery({
    queryKey: ["STU-coin-info-student"],
    queryFn: () => STUCoinService.getInfoSTUCoinOfStudent(),
  });
}
