import { Link } from "@tanstack/react-router";
import Avatar from "./avatar";

export default function Header() {
	const links = [
		{ to: "/", label: "Home" },
		{ to: "/courses", label: "Courses" },
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => {
						return (
							<Link key={to} to={to}>
								{label}
							</Link>
						);
					})}
				</nav>
				<div className="flex items-center gap-2">
					<Avatar />
				</div>
			</div>
			<hr />
		</div>
	);
}
