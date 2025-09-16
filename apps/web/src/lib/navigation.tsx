import { Book, Home } from "lucide-react";

export const navigationLinks = [
	{ to: "/", label: "Home", icon: <Home /> },
	{ to: "/courses", label: "Courses", icon: <Book /> },
] as const;

export function getPageTitle(pathname: string): string {
	// Find matching link
	const link = navigationLinks.find((link) => {
		if (link.to === "/") return pathname === "/";
		return pathname.startsWith(link.to);
	});

	if (link) return link.label;

	// Fallback: capitalize first letter of route
	const route = pathname.slice(1).split("/")[0];
	return route.charAt(0).toUpperCase() + route.slice(1);
}
