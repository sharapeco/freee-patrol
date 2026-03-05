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
	const items = await client.getItems(company_id);

	console.log(`🧾🧾🧾 ${bold("品目")} (🏢 ${company_id}) 🧾🧾🧾\n`);
	for (const item of items) {
		if (item.available === false) continue;
		const shortcuts = [item.shortcut1, item.shortcut2]
			.filter((value) => value != null && value !== "")
			.join("/");
		console.log(
			`${green(item.id)} ${item.name} ${gray(shortcuts)} ${magenta(item.available != null ? (item.available ? "有効" : "無効") : "")}`,
		);
	}
}

try {
	const token = await getAccessToken();
	await main(token);
} catch (e) {
	console.error(e);
}
