import { useQuery } from "@tanstack/react-query";
import { login } from "@/lib/chopin/chopin-client";

export function useAddress(initialAddress: string | null) {
  return useQuery({
    queryKey: ["address"],
    queryFn: () => login(),
    initialData: initialAddress,
    enabled: !initialAddress,
  });
}
