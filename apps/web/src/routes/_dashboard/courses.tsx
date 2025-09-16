import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_dashboard/courses")({
	component: CoursesRoute,
});

function CoursesRoute() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [duration, setDuration] = useState("");

	const courses = useQuery(orpc.course.getAll.queryOptions());
	const createMutation = useMutation(
		orpc.course.create.mutationOptions({
			onSuccess: () => {
				courses.refetch();
				setTitle("");
				setDescription("");
				setDuration("");
			},
		}),
	);

	const deleteMutation = useMutation(
		orpc.course.delete.mutationOptions({
			onSuccess: () => {
				courses.refetch();
			},
		}),
	);

	const handleAddCourse = (e: React.FormEvent) => {
		e.preventDefault();
		if (title.trim() && description.trim() && duration.trim()) {
			createMutation.mutate({
				title,
				description,
				duration: Number.parseInt(duration, 10),
			});
		}
	};

	const handleDeleteCourse = (id: number) => {
		deleteMutation.mutate({ id });
	};

	return (
		<div className="mx-auto w-full max-w-2xl space-y-6 py-10">
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Courses</CardTitle>
							<CardDescription>Manage your learning courses</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleAddCourse} className="mb-6 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Course Title</Label>
							<Input
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								placeholder="Enter course title..."
								disabled={createMutation.isPending}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Enter course description..."
								disabled={createMutation.isPending}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="duration">Duration (hours)</Label>
							<Input
								type="number"
								value={duration}
								onChange={(e) => setDuration(e.target.value)}
								placeholder="Duration in hours..."
								disabled={createMutation.isPending}
								min="1"
								required
							/>
						</div>
						<Button
							type="submit"
							disabled={
								createMutation.isPending ||
								!title.trim() ||
								!description.trim() ||
								!duration.trim()
							}
							className="w-full"
						>
							{createMutation.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								"Add Course"
							)}
						</Button>
					</form>

					{courses.isLoading ? (
						<div className="flex justify-center py-4">
							<Loader2 className="h-6 w-6 animate-spin" />
						</div>
					) : courses.data?.length === 0 ? (
						<p className="py-4 text-center text-muted-foreground">
							No courses yet. Add one above!
						</p>
					) : (
						<div className="space-y-4">
							{courses.data?.map((course) => (
								<Card key={course.id}>
									<CardContent className="pt-4">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h3 className="font-semibold text-lg">
													{course.title}
												</h3>
												<p className="mt-1 text-muted-foreground text-sm">
													{course.description}
												</p>
												<div className="mt-2 flex items-center text-muted-foreground text-sm">
													<Clock className="mr-1 h-4 w-4" />
													{course.duration} hour
													{course.duration !== 1 ? "s" : ""}
												</div>
											</div>
											<Button
												variant="ghost"
												size="icon"
												onClick={() => handleDeleteCourse(course.id)}
												disabled={deleteMutation.isPending}
												aria-label="Delete course"
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
