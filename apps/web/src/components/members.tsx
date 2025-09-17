import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { orpc } from "@/utils/orpc";
import { Button } from "./ui/button";

type UserFilters = NonNullable<Parameters<typeof orpc.user.getAll.queryKey>[0]>;

const COLUMNS = [
	{ header: "Name", accessor: "name" as const, sortable: true },
	{ header: "Progress", accessor: "progress" as const, sortable: true },
	{ header: "Time Spent", accessor: "timeSpent" as const, sortable: true },
];

const ProgressBar = ({ progress }: { progress: number }) => {
	return (
		<div className="flex items-center gap-2">
			<div className="max-w-[80px] flex-1">
				<div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
					<div
						className="h-2 rounded-full bg-primary transition-all"
						style={{ width: `${progress}%` }}
					/>
				</div>
			</div>
			<span className="text-muted-foreground text-sm">{progress}%</span>
		</div>
	);
};

export default function Members() {
	const [searchInput, setSearchInput] = useState("");
	const [options, setOptions] = useState({
		search: "",
		limit: 10,
		offset: 0,
		sortBy: "timeSpent",
		sortOrder: "desc",
	});

	const debouncedSearch = useDebounce(searchInput, 300);

	// Update options when debounced search changes
	useEffect(() => {
		setOptions((prev) => ({ ...prev, search: debouncedSearch, offset: 0 }));
	}, [debouncedSearch]);

	// Helper to update filters
	const setFilter =
		<K extends keyof typeof options>(key: K) =>
		(value: (typeof options)[K]) => {
			if (key === "search") {
				setOptions((prev) => ({ ...prev, [key]: value, offset: 0 }));
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
			input: options as UserFilters,
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
				<div className="relative max-w-sm flex-1">
					<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search by name or email..."
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
						className="pl-10"
					/>
				</div>
			</div>

			<div className="overflow-hidden rounded-md border">
				<table className="w-full">
					<thead className="border-b bg-muted/50">
						<tr>
							{COLUMNS.map((col) => (
								<th
									key={col.accessor}
									className="px-4 py-3 text-left font-medium text-sm"
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
								<td colSpan={3} className="py-8 text-center">
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
								<td colSpan={3} className="py-8 text-center text-red-500">
									Error loading team members.
								</td>
							</tr>
						) : null}
						{users?.items.map((member) => (
							<tr
								key={member.id}
								className="border-b transition-colors hover:bg-muted/50"
							>
								<td className="px-4 py-3 font-medium">{member.name}</td>
								<td className="px-4 py-3">
									<ProgressBar progress={member.progress} />
								</td>
								<td className="px-4 py-3">{member.timeSpent}</td>
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
