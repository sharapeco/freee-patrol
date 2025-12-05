import "dotenv/config";
import { gray, green, magenta, bold } from "kolorist";
import { Client } from "./freee/client/client.ts";
import { getAccessToken } from "./freee/getAccessToken.ts";
import { compare } from "./lib/compare.ts";

const company_id = process.env.FREEE_COMPANY_ID as string;
if (company_id == null) {
	throw new Error("環境変数 FREEE_COMPANY_ID が設定されていません");
}

async function main(token: string): Promise<void> {
	const client = new Client(token);
	const partners = await client.getPartners(company_id);

	partners.sort((a, b) => compare(a.name, b.name));

	console.log(`🤝🤝🤝 ${bold("取引先")} (🏢 ${company_id}) 🤝🤝🤝\n`);
	for (const partner of partners) {
		if (!partner.available) continue;
		console.log(
			`${green(partner.id)} ${partner.name} ${gray(partner.long_name)} ${magenta(partner.available ? "有効" : "無効")}`,
		);
	}
}

try {
	const token = await getAccessToken();
	await main(token);
} catch (e) {
	console.error(e);
}
