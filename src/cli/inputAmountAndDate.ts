import { gray } from "kolorist";
import { question } from "./question.ts";

type Param = {
	month: number; // 何月分か表示する
	label: string; // 「電気料金」
	color: (str: string | number) => string; // ラベルの色
	defaultAmount?: number; // 既定の金額。設定すると入力が省略できる
	defaultDate?: number; // 既定の日付。設定すると入力が省略できる
};

type Result = {
	amount: number;
	date: number;
};

/**
 * プロンプトを表示し、金額と日付のペアを入力させる
 *
 * @param param
 * @returns 入力された金額と日付。キャンセルされた場合は undefined
 */
export async function inputAmountAndDate({
	month,
	label,
	color,
	defaultAmount,
	defaultDate,
}: Param): Promise<Result | undefined> {
	const amount = await inputAmount(
		gray(
			`  ${String(month).padStart(2, " ")}月の${color(label)}${
				defaultAmount ? ` [${defaultAmount}]` : ""
			}: `,
		),
		defaultAmount,
	);
	if (amount == null) {
		return;
	}
	const date = await inputDate(
		gray(`      支払日${defaultDate ? ` [${defaultDate}]` : ""}: `),
		defaultDate,
	);
	if (date == null) {
		return;
	}
	return { amount, date };
}

async function inputAmount(
	prompt: string,
	defaultValue?: number,
): Promise<number | undefined> {
	let amount: number;
	do {
		const value = await question(prompt);
		if (value.trim() === "") return defaultValue;
		amount = Number.parseInt(value, 10);
	} while (Number.isNaN(amount) || amount < 1);
	return amount;
}

async function inputDate(
	prompt: string,
	defaultValue?: number,
): Promise<number | undefined> {
	let date: number;
	do {
		const value = await question(prompt);
		if (value.trim() === "") return defaultValue;
		date = Number.parseInt(value, 10);
	} while (Number.isNaN(date) || date < 1 || date > 31);
	return date;
}
