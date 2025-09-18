import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { AvatarPicture } from "@/components/avatar";
import { ProgressBar } from "@/components/progress-bar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { orpc } from "@/utils/orpc";
import { Button } from "./ui/button";

// Infer the input type from ORPC queryOptions
type UserOptionsRaw = NonNullable<
	Parameters<typeof orpc.user.getAll.queryOptions>[0]
>["input"];
type UserOptions = Exclude<UserOptionsRaw, symbol>;

const COLUMNS = [
	{ header: "Name", accessor: "name" as const, sortable: true },
	{ header: "Courses", accessor: "coursesCompleted" as const, sortable: true },
	{ header: "Progress", accessor: "progress" as const, sortable: true },
	{ header: "Time Spent", accessor: "timeSpent" as const, sortable: true },
	// Accesor this is just a placeholder, actions column is not sortable
	{ header: "Actions", accessor: "name" as const, sortable: false },
];

export default function Members() {
	const [searchInput, setSearchInput] = useState("");
	const [options, setOptions] = useState({
		search: "",
		limit: 10,
		offset: 0,
		sortBy: "name",
		sortOrder: "desc",
		overdue: false,
	});

	const debouncedSearch = useDebounce(searchInput, 300);

	// Update options when debounced search changes
	useEffect(() => {
		setOptions((prev) => ({
			...prev,
			search: debouncedSearch,
			offset: 0,
		}));
	}, [debouncedSearch]);

	// Helper to update filters
	const setFilter =
		<K extends keyof UserOptions>(key: K) =>
		(value: UserOptions[K]) => {
			if (key === "search") {
				setOptions((prev) => ({
					...prev,
					[key]: value,
					offset: 0,
				}));
			} else if (key === "sortBy") {
				setOptions((prev) => ({
					...prev,
					[key]: value,
					sortOrder:
						prev.sortBy === value && prev.sortOrder === "asc" ? "desc" : "asc",
				}));
			} else {
				setOptions((prev) => ({ ...prev, [key]: value }));
			}
		};

	const {
		data: users,
		isError: isErrorUsers,
		isLoading: isLoadingUsers,
	} = useQuery({
		...orpc.user.getAll.queryOptions({
			input: options as UserOptions,
		}),
		// No more loading state flicker when typing
		placeholderData: (previousData) => previousData,
	});

	const totalPages = Math.ceil((users?.count || 0) / options.limit) || 1;

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-bold text-2xl">Team Members</h2>
				<p className="text-muted-foreground">
					Manage and monitor all team members' learning progress
				</p>
			</div>

			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-4">
					<div className="relative w-full flex-1 md:max-w-2xl">
						<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search by name, email, or vector similarity... (use :* for wildcards)"
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
							className="h-11 pl-10 text-base"
							aria-label="Search team members"
						/>
					</div>
					<Button
						variant="ghost"
						className="flex items-center space-x-2"
						onClick={() => setFilter("overdue")(!options.overdue)}
					>
						<Checkbox checked={options.overdue} />
						<label
							htmlFor="overdue-filter"
							className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						>
							Show overdue only
						</label>
					</Button>
				</div>
			</div>

			<div className="overflow-hidden rounded-md border">
				<table className="w-full">
					<thead className="border-b bg-muted/50">
						<tr>
							{COLUMNS.map((col) => (
								<th
									key={col.accessor}
									className="py-3 text-left font-medium text-sm"
								>
									{col.sortable ? (
										<Button
											variant="ghost"
											onClick={() => setFilter("sortBy")(col.accessor)}
											className="flex items-center gap-1 transition-colors hover:text-foreground"
										>
											{col.header}
											{options.sortBy === col.accessor &&
												(options.sortOrder === "asc" ? (
													<ChevronUp className="h-4 w-4" />
												) : (
													<ChevronDown className="h-4 w-4" />
												))}
										</Button>
									) : (
										col.header
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{isLoadingUsers ? (
							<tr>
								<td colSpan={7} className="py-8 text-center">
									<Loader2 className="mx-auto h-6 w-6 animate-spin" />
								</td>
							</tr>
						) : null}
						{users?.items.length === 0 && (
							<tr>
								<td colSpan={7} className="py-4 text-center">
									No members found.
								</td>
							</tr>
						)}
						{isErrorUsers ? (
							<tr>
								<td colSpan={7} className="py-8 text-center text-red-500">
									Error loading team members.
								</td>
							</tr>
						) : null}
						{users?.items.map((member) => (
							<tr
								key={member.id}
								className="border-b text-left transition-colors hover:bg-muted/50"
							>
								<td className="px-4 py-3 font-medium">
									<Link
										to="/user/$id"
										params={{ id: member.id.toString() }}
										className="flex items-center gap-3 text-primary hover:underline"
									>
										<AvatarPicture name={member.name} />
										{member.name}
									</Link>
								</td>
								<td className="px-4 py-3">
									{member.coursesCompleted} / {member.totalCourses}
								</td>
								<td className="px-4 py-3">
									<ProgressBar progress={member.progress} />
								</td>
								<td className="px-4 py-3">{member.timeSpent}</td>
								<td>
									<Link to="/user/$id" params={{ id: member.id.toString() }}>
										<Button variant="outline">View Details</Button>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between">
				<div className="text-muted-foreground text-sm">
					{users?.count || 0} total members
				</div>
				<div className="flex items-center gap-2">
					<Button
						onClick={() =>
							setFilter("offset")((options.offset || 0) - options.limit)
						}
						disabled={options.offset === 0}
						className="rounded border px-3 py-1 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</Button>
					<span className="text-sm">
						Page {Math.ceil((options.offset || 0) / options.limit) + 1} of{" "}
						{totalPages}
					</span>
					<Button
						onClick={() =>
							setFilter("offset")((options.offset || 0) + options.limit)
						}
						disabled={
							(options.offset || 0) + options.limit >= (users?.count || 0)
						}
						className="rounded border px-3 py-1 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
