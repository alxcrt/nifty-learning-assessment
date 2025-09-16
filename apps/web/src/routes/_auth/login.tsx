import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/_auth/login")({
	component: LoginRoute,
});

function LoginRoute() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { login } = useAuth();

	const loginMutation = useMutation(
		orpc.auth.login.mutationOptions({
			onSuccess: (data) => {
				// Use auth hook to store token
				login(data.token);
				// Navigate to home
				router.navigate({ to: "/" });
			},
			onError: (error) => {
				setError(error.message);
			},
		}),
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		loginMutation.mutate({ email, password });
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Login</CardTitle>
				<CardDescription>Sign in to your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							disabled={loginMutation.isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
							disabled={loginMutation.isPending}
						/>
					</div>
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<Button
						type="submit"
						className="w-full"
						disabled={loginMutation.isPending}
					>
						{loginMutation.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Login"
						)}
					</Button>
				</form>
				<div className="mt-4 text-center">
					<p className="text-gray-600 text-sm">
						Don't have an account?{" "}
						<Button
							variant="link"
							className="p-0 underline"
							onClick={() => router.navigate({ to: "/register" })}
						>
							Sign up
						</Button>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
