import { spawn } from "node:child_process";

const children = [
	spawn("bun", ["dist/index.mjs"], {
		cwd: "apps/server",
		stdio: "inherit",
		env: process.env,
	}),
	spawn(
		"node_modules/.bin/sirv",
		[
			"apps/web/dist",
			"--host",
			"0.0.0.0",
			"--port",
			process.env.FRONTEND_PORT || "3001",
			"--single",
		],
		{
			stdio: "inherit",
			env: {
				...process.env,
				PORT: process.env.FRONTEND_PORT || "3001",
				HOST: "0.0.0.0",
			},
		},
	),
];
let stopping = false;
function stop(code) {
	if (stopping) return;
	stopping = true;
	for (const child of children) child.kill("SIGTERM");
	process.exitCode = code;
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stop(0));
for (const child of children) {
	child.on("error", () => stop(1));
	child.on("exit", (code) => stop(code || 1));
}
