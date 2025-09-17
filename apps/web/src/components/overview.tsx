import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

export default function Overview() {
	const { data: stats, isLoading } = useQuery(
		orpc.analytics.getOverview.queryOptions(),
	);

	if (isLoading) {
		return <div>Loading overview...</div>;
	}

	if (!stats) {
		return <div>No overview data available.</div>;
	}

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat) => (
				<Card key={stat.title}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">{stat.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{stat.value}</div>
						<p className="text-muted-foreground text-xs">{stat.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
