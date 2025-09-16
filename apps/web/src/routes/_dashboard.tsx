import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Header from "@/components/header";

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
		<div className="grid h-svh grid-rows-[auto_1fr]">
			<Header />
			<Outlet />
		</div>
	);
}
