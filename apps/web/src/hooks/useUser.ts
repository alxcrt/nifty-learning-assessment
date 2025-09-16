import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useAuth } from "./useAuth";

export function useUser() {
	const { isAuthenticated } = useAuth();

	return useQuery({
		...orpc.auth.me.queryOptions(),
		enabled: isAuthenticated, // Only fetch when authenticated
	}).data?.user;
}
