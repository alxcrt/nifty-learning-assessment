import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useAuth } from "./useAuth";

export function useUser() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    ...orpc.auth.me.queryOptions(),
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  return query.data?.user || null;
}
