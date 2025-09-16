import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function useAuth() {
	const queryClient = useQueryClient();
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("token");
	});

	const login = (newToken: string) => {
		localStorage.setItem("token", newToken);
		setToken(newToken);
		queryClient.clear(); // Clear cache to refetch with new auth state
	};

	const logout = () => {
		localStorage.removeItem("token");
		setToken(null);
		// Clear all React Query cache on logout
		queryClient.clear();
	};

	const isAuthenticated = !!token;

	// Listen for storage changes (when user logs in/out in another tab)
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === "token") {
				setToken(e.newValue);
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	return {
		token,
		login,
		logout,
		isAuthenticated,
	};
}
