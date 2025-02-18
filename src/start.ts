import * as kolor from "kolorist";
import { getAccessToken } from "./freee/getAccessToken.js";
import { MyClient, type ExpenseInput } from "./freee/MyClient.js";
import { readConfig, type Config } from "./config/readConfig.js";
import { printTable } from "./lib/printTable.js";
import { inputAmountAndDate } from "./cli/inputAmountAndDate.js";

/**
 *
 * @param token アクセストークン
 * @param year 年
 * @param now 現在日時
 */
async function main(token: string, year: number, now: Date): Promise<void> {
	const config = await readConfig();
	const client = new MyClient(token, {
		company_id: config.company_id,
		from_walletable_id: config.defaults.walletable_id,
		from_walletable_type: config.defaults.walletable_type,
		tax_code: config.defaults.tax_code,
	});
	client.setYear(year);

	// 費用を表示
	console.log(`📅 ${year}年 📅\n`);
	const months = await printMonthly(config, client);
	console.log("");
	const yearlyItems = await printYearly(config, client);
	console.log("");

	// 未入力の費用を入力
	await inputMonthly(config, client, months, now, year);
	await inputYearly(config, client, yearlyItems, now, year);
}

type MonthlyResult = {
	month: number;
	items: Map<string, { amount: number }>;
};

/**
 * 月額費用を表示
 *
 * @param config
 * @param client
 */
async function printMonthly(
	config: Config,
	client: MyClient,
): Promise<MonthlyResult[]> {
	console.log("📅💰 月額費用");

	const months = Array.from({ length: 12 }, (_, k) => ({
		month: k + 1,
		items: new Map<string, { amount: number }>(),
	}));

	// 現在登録されている内容を仕分け
	const deals = await client.getDeals();
	for (const deal of deals) {
		const monthIndex = Number.parseInt(deal.issue_date.split("-")[1], 10) - 1;
		if (monthIndex < 0 || monthIndex >= 12) {
			console.warn(`月が不正です: ${deal.issue_date}`);
			continue;
		}
		const month = months[monthIndex];

		// 備考が前方一致する場合、月額費用として仕分ける
		const description = deal.details[0]?.description ?? "";
		const c = config.monthly.find((c) => description.indexOf(c.name) === 0);
		if (!c) continue;

		if (month.items.has(c.name)) {
			console.warn(
				kolor.lightGray(
					`支出の登録が重複しています: ${deal.issue_date}  ${c.name}  ${deal.amount.toLocaleString()} 円`,
				),
			);
			continue;
		}
		month.items.set(c.name, { amount: deal.amount });
	}

	const table = [
		[
			{ t: "" },
			...config.monthly.map((c) => ({
				t: c.slug ?? c.name,
				c: colorNameToFunction(c.color),
			})),
		],
		...months.map((m) => [
			{ t: `${m.month}月` },
			...config.monthly.map((c) => ({
				t: m.items.get(c.name)?.amount?.toLocaleString() ?? "",
			})),
		]),
	];
	printTable(table);

	return months;
}

type YearlyResult = Map<string, { amount: number; date: string }>;

/**
 * 年額費用を表示
 *
 * @param config
 * @param client
 */
async function printYearly(
	config: Config,
	client: MyClient,
): Promise<YearlyResult> {
	console.log("📅💰 年間費用");

	const items = new Map<string, { amount: number; date: string }>();

	// 現在登録されている内容を仕分け
	const deals = await client.getDeals();
	for (const deal of deals) {
		// 備考が前方一致する場合、年額費用として仕分ける
		const description = deal.details[0]?.description ?? "";
		const c = config.yearly.find((c) => description.indexOf(c.name) === 0);
		if (!c) continue;

		if (items.has(c.name)) {
			console.warn(
				kolor.lightGray(
					`支出の登録が重複しています: ${deal.issue_date}  ${c.name}  ${deal.amount.toLocaleString()} 円`,
				),
			);
			continue;
		}
		items.set(c.name, { amount: deal.amount, date: deal.issue_date });
	}

	const table = [
		[{ t: "項目" }, { t: "金額" }, { t: "日付" }],
		...config.yearly.map((c) => {
			const item = items.get(c.name);
			return [
				{ t: c.slug ?? c.name, c: colorNameToFunction(c.color) },
				{ t: item?.amount?.toLocaleString() ?? "" },
				{ t: item?.date ?? "" },
			];
		}),
	];
	printTable(table);

	return items;
}

type Printable = string | number;

/**
 * 設定の色名を関数に変換
 *
 * @param name
 * @returns kolorist の色付け関数
 */
function colorNameToFunction(name: string): (text: Printable) => string {
	if (Object.keys(kolor).includes(name)) {
		// biome-ignore lint/suspicious/noExplicitAny: チェックしているので安全
		return (kolor as any)[name];
	}
	return kolor.white;
}

/**
 * 未入力の月額費用を入力
 *
 * @param config
 * @param client
 * @param months
 * @param now
 * @param year
 */
async function inputMonthly(
	config: Config,
	client: MyClient,
	months: MonthlyResult[],
	now: Date,
	year: number,
) {
	for (const month of months) {
		for (const c of config.monthly) {
			// 既に登録されている場合はスキップ
			if (month.items.has(c.name)) continue;
			// 読み取り専用の場合はスキップ
			if (c.readonly) continue;
			// 月指定があり、指定月以外の場合はスキップ
			if (c.months && !c.months.includes(month.month)) continue;
			// 費用が発生するより前の日付の場合はスキップ
			const minDate = new Date(year, month.month - 1, c.min_day);
			if (now < minDate) continue;

			let defaultDate = c.day;
			if (defaultDate == null) {
				if (defaultDate === 31) {
					// 末日を求める
					const nextMonth = new Date(year, month.month, 1);
					nextMonth.setDate(nextMonth.getDate() - 1);
					defaultDate = nextMonth.getDate();
				}
			}

			const input = await inputAmountAndDate({
				month: month.month,
				label: c.name,
				color: colorNameToFunction(c.color),
				defaultDate,
				defaultAmount: c.amount,
			});
			if (input) {
				await client.createExpense(
					launder({
						month: month.month,
						date: input.date,
						amount: input.amount,
						account_item_id: c.account_item_id,
						item_id: c.item_id,
						partner_id: c.partner_id,
						description: c.name,
					}) as ExpenseInput,
				);
			}
		}
	}
}

async function inputYearly(
	config: Config,
	client: MyClient,
	items: YearlyResult,
	now: Date,
	year: number,
) {
	for (const c of config.yearly) {
		// 既に登録されている場合はスキップ
		if (items.has(c.name)) continue;
		// 読み取り専用の場合はスキップ
		if (c.readonly) continue;
		// 費用が発生するより前の日付の場合はスキップ
		const minDate = new Date(year, c.month - 1, c.min_day);
		if (now < minDate) continue;

		const input = await inputAmountAndDate({
			month: c.month,
			label: c.name,
			color: colorNameToFunction(c.color),
			defaultDate: c.min_day,
			defaultAmount: c.amount,
		});
		if (input) {
			await client.createExpense(
				launder({
					month: c.month,
					date: input.date,
					amount: input.amount,
					account_item_id: c.account_item_id,
					item_id: c.item_id,
					partner_id: c.partner_id,
					description: c.name,
				}) as ExpenseInput,
			);
		}
	}
}

/**
 * オブジェクトから null や undefined のプロパティを取り除く
 *
 * @param obj
 * @returns
 */
// biome-ignore lint/suspicious/noExplicitAny: 何が入るかわからないので
function launder(obj: { [key: string]: any }): { [key: string]: any } {
	// biome-ignore lint/suspicious/noExplicitAny: 何が入るかわからないので
	const out: { [key: string]: any } = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value != null) {
			out[key] = value;
		}
	}
	return out;
}

try {
	const aYear = Number.parseInt(process.argv[2] ?? "", 10);
	const now = new Date();
	const year = !Number.isNaN(aYear) ? aYear : now.getFullYear();
	const token = await getAccessToken();
	await main(token, year, now);
} catch (e) {
	console.error("エラー: ", e);
}
