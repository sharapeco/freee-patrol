import "dotenv/config";
import { gray, green, magenta, bold } from "kolorist";
import { Client } from "./freee/client/client.js";
import { getAccessToken } from "./freee/getAccessToken.js";

const company_id = process.env.FREEE_COMPANY_ID as string;
if (company_id == null) {
	throw new Error("環境変数 FREEE_COMPANY_ID が設定されていません");
}

async function main(token: string): Promise<void> {
	const client = new Client(token);
	const taxes = await client.getTaxes(company_id);

	console.log(`💰💰💰 ${bold("税区分")} (🏢 ${company_id}) 💰💰💰\n`);
	for (const tax of taxes) {
		if (!tax.available) continue;
		console.log(
			`${green(tax.code)} ${tax.name_ja} ${gray(tax.name)} ${magenta(tax.available ? "有効" : "無効")}`,
		);
	}
}

try {
	const token = await getAccessToken();
	await main(token);
} catch (e) {
	console.error(e);
}
