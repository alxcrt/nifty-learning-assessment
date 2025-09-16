import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_dashboard/")({
	component: HomeComponent,
});

function HomeComponent() {
	const _router = useRouter();

	const healthCheck = useQuery(orpc.healthCheck.queryOptions());

	return (
		<div className="flex items-center justify-center py-16">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-center">
						Nifty Learning Dashboard
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center">
						<div className="mb-4 flex items-center justify-center gap-2">
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
				</CardContent>
			</Card>
		</div>
	);
}
