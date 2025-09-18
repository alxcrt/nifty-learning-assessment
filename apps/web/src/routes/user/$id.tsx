import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AvatarPicture } from "@/components/avatar";
import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/user/$id")({
	loader: async ({ params, context }) => {
		try {
			const user = await context.queryClient.ensureQueryData(
				context.orpc.user.getById.queryOptions({
					input: { id: Number(params.id) },
				}),
			);

			return user;
		} catch {
			throw redirect({ to: "/" });
		}
	},
	component: UserDetail,
});

function Header() {
	const user = Route.useLoaderData();

	return (
		<>
			<div className="mb-6 flex items-center gap-4">
				<AvatarPicture name={user.name} className="h-16 w-16" />
				<div>
					<h1 className="font-bold text-3xl">{user.name}</h1>
					<p className="text-muted-foreground">{user.email}</p>
				</div>
			</div>

			<div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Time Spent</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{user.stats.totalTimeSpent}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">
							Average Progress
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{user.stats.averageProgress}%
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Completed</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">
							{user.stats.coursesCompleted}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="font-medium text-sm">Total Courses</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="font-bold text-2xl">{user.stats.totalCourses}</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

function UserDetail() {
	const user = Route.useLoaderData();

	const getStatusColor = (status: string, overdueDate: Date | null) => {
		if (
			overdueDate &&
			new Date() > new Date(overdueDate) &&
			status !== "completed"
		) {
			return "bg-red-100 text-red-800";
		}

		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";

			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<main className="container mx-auto px-4 py-8">
			<div className="mb-6">
				<Link to="/">
					<Button variant="outline" className="mb-4">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Dashboard
					</Button>
				</Link>
			</div>

			<Header />

			<div>
				<h2 className="mb-4 font-bold text-2xl">Course Progress</h2>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
					{user.courses.length === 0 && (
						<p className="text-muted-foreground">No courses enrolled.</p>
					)}
					{user.courses.map((course) => (
						<Card key={course.id}>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div>
										<CardTitle className="text-lg">{course.title}</CardTitle>
									</div>
									<span
										className={`rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(
											course.status,
											course.dueDate,
										)}`}
									>
										{course.status}
									</span>
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<div>
										<div className="mb-2 flex justify-between text-sm" />
									</div>

									<div className="grid grid-cols-3 gap-4 text-sm">
										<div>
											<span className="text-muted-foreground">Progress</span>
											<ProgressBar progress={course.completionPercentage} />
										</div>
										<div>
											<span className="text-muted-foreground">Time Spent:</span>
											<div className="font-medium">{course.timeSpent}</div>
										</div>
										<div>
											<span className="text-muted-foreground">Duration:</span>
											<div className="font-medium">{course.duration}</div>
										</div>
									</div>

									<div className="grid grid-cols-3 gap-4 text-sm">
										{course.startedAt && (
											<div className="text-sm">
												<span className="text-muted-foreground">Started:</span>
												<div className="font-medium">
													{new Date(course.startedAt).toLocaleDateString()}
												</div>
											</div>
										)}

										{course.completedAt && (
											<div className="text-sm">
												<span className="text-muted-foreground">
													Completed:
												</span>
												<div className="font-medium">
													{new Date(course.completedAt).toLocaleDateString()}
												</div>
											</div>
										)}

										{course.dueDate && (
											<div className="text-sm">
												<span className="text-muted-foreground">Due Date:</span>
												<div className="font-medium">
													{new Date(course.dueDate).toLocaleDateString()}
												</div>
											</div>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</main>
	);
}
