import * as readline from "node:readline";

export function question(q: string): Promise<string> {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	return new Promise((resolve) => {
		rl.question(q, (input) => {
			rl.close();
			resolve(input);
		});
	});
}
