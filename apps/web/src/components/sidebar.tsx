import { Link, useRouterState } from "@tanstack/react-router";
import { BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigationLinks } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
	const router = useRouterState();
	const currentPath = router.location.pathname;

	return (
		<aside className="fixed top-0 left-0 z-20 h-screen w-[90px] border-r bg-background">
			<div className="relative flex h-full flex-col overflow-y-auto py-4">
				<div className="mb-6 flex flex-col items-center gap-1">
					<BrainCircuit className="h-6 w-6 text-muted-foreground/50" />
					<span className="text-center text-muted-foreground/50 text-xs">
						Nifty
					</span>
				</div>

				<div className="flex flex-col items-center space-y-1">
					{navigationLinks.map(({ to, label, icon }) => {
						const isActive =
							currentPath === to || (to !== "/" && currentPath.startsWith(to));

						return (
							<Link key={to} to={to}>
								<Button
									variant={isActive ? "default" : "ghost"}
									className={cn(
										"flex h-auto w-16 flex-col items-center justify-center gap-1 p-2",
										isActive &&
											"bg-primary text-primary-foreground hover:bg-primary/90",
									)}
								>
									{icon}
									<span className="text-xs">{label}</span>
								</Button>
							</Link>
						);
					})}
				</div>
			</div>
		</aside>
	);
}
