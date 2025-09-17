import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Members from "@/components/members";
import Overview from "@/components/overview";
import { useUser } from "@/hooks/useUser";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_dashboard/")({
	component: HomeComponent,
});

function HomeComponent() {
	const user = useUser();

	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<>
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl">
						Welcome back,
						<span className="text-muted-foreground">{user?.name}</span>!
					</h1>
					<p className="text-muted-foreground">
						Here's an overview of your colleagues
					</p>
				</div>
				<div className="flex items-center gap-2">
					<div
						className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
					/>
					<span className="text-muted-foreground text-sm">
						{healthCheck.isLoading
							? "Checking API..."
							: healthCheck.data
								? "API Connected"
								: "API Disconnected"}
					</span>
				</div>
			</div>

			<Overview />
			<Members />
		</>
	);
}
