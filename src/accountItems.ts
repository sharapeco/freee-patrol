import "dotenv/config";
import { gray, green, magenta, bold } from "kolorist";
import { Client } from "./freee/client/client.ts";
import { getAccessToken } from "./freee/getAccessToken.ts";

const company_id = process.env.FREEE_COMPANY_ID as string;
if (company_id == null) {
	throw new Error("環境変数 FREEE_COMPANY_ID が設定されていません");
}

async function main(token: string): Promise<void> {
	const client = new Client(token);
	const accountItems = await client.getAccountItems(company_id);

	console.log(`📚📚📚 ${bold("勘定科目")} (🏢 ${company_id}) 📚📚📚\n`);
	for (const accountItem of accountItems) {
		if (accountItem.available === false) continue;
		console.log(
			`${green(accountItem.id)} ${accountItem.name} ${gray(accountItem.shortcut ?? "")} ${magenta(accountItem.available != null ? (accountItem.available ? "有効" : "無効") : "")}`,
		);
	}
}

try {
	const token = await getAccessToken();
	await main(token);
} catch (e) {
	console.error(e);
}
