import { useRouterState } from "@tanstack/react-router";
import { getPageTitle } from "@/lib/navigation";
import { Avatar } from "./avatar";
import { ModeToggle } from "./mode-toggle";

export default function Header() {
	const router = useRouterState();
	const pathname = router.location.pathname;

	return (
		<header className="bg-background sticky top-0 z-10 w-full border-b">
			<div className="mx-4 flex h-14 items-center">
				<div className="flex-1">
					<h1 className="text-lg font-semibold">{getPageTitle(pathname)}</h1>
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<Avatar />
				</div>
			</div>
		</header>
	);
}
