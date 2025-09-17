import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_dashboard/courses")({
	component: CoursesRoute,
});

function CoursesRoute() {
	const courses = useQuery(orpc.course.getAll.queryOptions());

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-bold text-2xl">Courses</h2>
				<p className="text-muted-foreground">
					Browse and manage your learning courses
				</p>
			</div>

			{courses.isLoading ? (
				<div className="flex justify-center py-8">
					<Loader2 className="h-6 w-6 animate-spin" />
				</div>
			) : courses.data?.length === 0 ? (
				<p className="py-8 text-center text-muted-foreground">
					No courses available yet.
				</p>
			) : (
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{courses.data?.map((course) => (
						<Card key={course.id} className="transition-shadow hover:shadow-md">
							<CardHeader>
								<CardTitle className="text-lg">{course.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-muted-foreground text-sm">
									{course.description}
								</p>
								<div className="flex items-center text-muted-foreground text-sm">
									<Clock className="mr-2 h-4 w-4" />
									{course.duration}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
