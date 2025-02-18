import path from "node:path";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import type { WalletableType } from "../freee/client/types/Walletable";

export type Config = {
	company_id: number;
	defaults: {
		walletable_id: number;
		walletable_type: WalletableType;
		tax_code: number;
	};
	monthly: MonthlyItemDesc[];
	yearly: YearlyItemDesc[];
};

type ItemDesc = {
	/** 名前 兼 備考への登録文字列 */
	name: string;
	/** 短い名前 */
	slug?: string;
	/** 表示色（Koloristの関数名） */
	color: string;
	/** この日を過ぎたら入力 */
	min_day: number;
	/** 入力はしない */
	readonly?: boolean;
	/** 費目ID */
	account_item_id?: number;
	/** 品目ID */
	item_id?: number;
	/** 取引先ID */
	partner_id?: number;
	/** 日付が決まっている */
	day?: number;
	/** 金額が決まっている */
	amount?: number;
};

type MonthlyItemDesc = ItemDesc & {
	months?: number[];
};

type YearlyItemDesc = ItemDesc & {
	month: number;
};

export async function readConfig(): Promise<Config> {
	const root = path.join(process.cwd());
	const yaml = readFileSync(path.join(root, "config.yaml"), "utf-8");
	const config = YAML.parse(yaml) as Config;
	return config;
}
