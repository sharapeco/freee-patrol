import "dotenv/config";
import { green, bold } from "kolorist";
import { Client } from "./freee/client/client.ts";
import { getAccessToken } from "./freee/getAccessToken.ts";

const company_id = process.env.FREEE_COMPANY_ID as string;
if (company_id == null) {
	throw new Error("環境変数 FREEE_COMPANY_ID が設定されていません");
}

async function main(token: string): Promise<void> {
	const client = new Client(token);
	const wallets = await client.getWalletables(company_id);

	console.log(`👛👛👛 ${bold("口座")} (🏢 ${company_id}) 👛👛👛\n`);
	for (const wallet of wallets) {
		console.log(`${green(wallet.id)} ${wallet.name}`);
	}
}

try {
	const token = await getAccessToken();
	await main(token);
} catch (e) {
	console.error(e);
}
