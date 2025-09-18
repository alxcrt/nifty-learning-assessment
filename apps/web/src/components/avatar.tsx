import { useRouter } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";

export function AvatarPicture({
	name,
	className = "h-8 w-8",
}: {
	name: string;
	className?: string;
}) {
	const _initialsAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=32`;

	const avatarUrl = `https://avatar.iran.liara.run/public?username=${encodeURIComponent(name)}&size=32`;

	return (
		<img
			src={avatarUrl}
			alt="User avatar"
			className={cn(`${className} rounded-full`)}
			onError={(e) => {
				e.currentTarget.style.display = "none";
			}}
		/>
	);
}

export function Avatar() {
	const { logout } = useAuth();
	const user = useUser();

	const router = useRouter();

	if (!user) {
		return null;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
					<AvatarPicture name={user.name} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{user && (
					<DropdownMenuItem
						onClick={() => {
							logout();
							router.navigate({ to: "/" });
						}}
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Logout</span>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
