import { green, magenta, bold } from "kolorist";
import { Client } from "./freee/client/client.ts";
import { getAccessToken } from "./freee/getAccessToken.ts";

async function main(token: string): Promise<void> {
	const client = new Client(token);
	const companies = await client.getCompanies();

	console.log(`🏢🏢🏢 ${bold("事業所")} 🏢🏢🏢\n`);
	for (const company of companies) {
		console.log(
			`${green(company.id)} ${company.display_name} ${magenta(company.role)}`,
		);
	}
}

try {
	const token = await getAccessToken();
	await main(token);
} catch (e) {
	console.error(e);
}
