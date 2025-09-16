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

export const Route = createFileRoute("/_auth/register")({
	component: RegisterRoute,
});

function RegisterRoute() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();
	const { login } = useAuth();

	const registerMutation = useMutation(
		orpc.auth.register.mutationOptions({
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
		registerMutation.mutate({ email, password, name });
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Register</CardTitle>
				<CardDescription>Create a new account</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Name</Label>
						<Input
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your name"
							required
							disabled={registerMutation.isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							disabled={registerMutation.isPending}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="Enter your password (min 6 characters)"
							required
							minLength={6}
							disabled={registerMutation.isPending}
						/>
					</div>
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<Button
						type="submit"
						className="w-full"
						disabled={registerMutation.isPending}
					>
						{registerMutation.isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							"Register"
						)}
					</Button>
				</form>
				<div className="mt-4 text-center">
					<p className="text-gray-600 text-sm">
						Already have an account?{" "}
						<Button
							variant="link"
							className="p-0 underline"
							onClick={() => router.navigate({ to: "/login" })}
						>
							Sign in
						</Button>
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
