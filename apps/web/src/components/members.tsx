import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { orpc } from "@/utils/orpc";
import { Button } from "./ui/button";

const COLUMNS = [
	{ header: "Name", accessor: "name" },
	{ header: "Progress", accessor: "progress" },
	{ header: "Time Spent", accessor: "timeSpent" },
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
	const [inputValue, setInputValue] = useState("");
	const [page, setPage] = useState(1);
	const limit = 10;

	const debounceSearch = useDebounce(inputValue, 300);

	const {
		data: users,
		isError: isErrorUsers,
		isLoading: isLoadingUsers,
	} = useQuery({
		...orpc.user.getAll.queryOptions({
			input: {
				search: debounceSearch,
				limit,
				offset: (page - 1) * limit,
			},
		}),
		// No more loading state flicker when typing
		placeholderData: (previousData) => previousData,
	});

	const totalPages = Math.ceil((users?.count || 0) / limit);

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
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
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
									{col.header}
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
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
						className="rounded border px-3 py-1 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
					>
						Previous
					</Button>
					<span className="text-sm">
						Page {page} of {totalPages}
					</span>
					<Button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page === totalPages}
						className="rounded border px-3 py-1 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
