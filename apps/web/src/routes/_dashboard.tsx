import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export const Route = createFileRoute("/_dashboard")({
	component: DashboardLayout,
	beforeLoad: async ({ context }) => {
		if (!context.user) {
			throw redirect({ to: "/login" });
		}
	},
});

function DashboardLayout() {
	return (
		<>
			<Sidebar />
			<div className="ml-[90px]">
				<Header />
				<main className="min-h-[calc(100vh-3.5rem)]">
					<Outlet />
				</main>
			</div>
		</>
	);
}
