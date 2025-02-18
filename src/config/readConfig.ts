import path from "node:path";
import { readFileSync } from "node:fs";
import YAML from "yaml";
import type { WalletableType } from "../freee/client/types/Walletable";

export type Config = {
	company_id: number;
	defaults: Defaults;
	monthly: MonthlyItemDesc[];
	yearly: YearlyItemDesc[];
};

type Defaults = {
	walletable_id: number;
	walletable_type: WalletableType;
	tax_code: number;
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

let lastError = "";

export async function readConfig(): Promise<Config> {
	const root = path.join(process.cwd());
	const yaml = readFileSync(path.join(root, "config.yaml"), "utf-8");
	const config = YAML.parse(yaml);
	if (config.defaults == null) {
		config.defaults = {};
	}
	lastError = "";
	if (!isConfig(config)) {
		throw new Error(`config.yaml に間違いがあります: ${lastError}`);
	}
	return config as Config;
}

function isConfig(obj: unknown): obj is Config {
	const c = obj as Config;
	if (typeof c !== "object") {
		lastError = "config は object である必要があります";
		return false;
	}
	if (typeof c.company_id !== "number") {
		lastError = ".company_id は number である必要があります";
		return false;
	}
	if (c.defaults != null && !isDefaults(c.defaults, ".defaults")) return false;
	if (!Array.isArray(c.monthly)) {
		lastError = ".monthly は array である必要があります";
		return false;
	}
	if (c.monthly.some((m, i) => !isMonthlyItemDesc(m, `.monthly[${i}]`))) {
		return false;
	}
	if (!Array.isArray(c.yearly)) {
		lastError = ".yearly は array である必要があります";
		return false;
	}
	if (c.yearly.some((y, i) => !isYearlyItemDesc(y, `.yearly[${i}]`))) {
		return false;
	}
	return true;
}

function isDefaults(obj: unknown, prefix = ""): obj is Defaults {
	const d = obj as Defaults;
	if (typeof d.walletable_id !== "number") {
		lastError = `${prefix}.walletable_id は number である必要があります`;
		return false;
	}
	if (typeof d.walletable_type !== "string") {
		lastError = `${prefix}.walletable_type は string である必要があります`;
		return false;
	}
	if (typeof d.tax_code !== "number") {
		lastError = `${prefix}.tax_code は number である必要があります`;
		return false;
	}
	return true;
}

function isMonthlyItemDesc(obj: unknown, prefix = ""): obj is MonthlyItemDesc {
	const m = obj as MonthlyItemDesc;
	if (m.months != null && !Array.isArray(m.months)) {
		lastError = `${prefix}.months は array である必要があります`;
		return false;
	}
	return isItemDesc(obj, prefix);
}

function isYearlyItemDesc(obj: unknown, prefix = ""): obj is YearlyItemDesc {
	const y = obj as YearlyItemDesc;
	if (typeof y.month !== "number") {
		lastError = `${prefix}.month は number である必要があります`;
		return false;
	}
	return isItemDesc(obj, prefix);
}

function isItemDesc(obj: unknown, prefix = ""): obj is ItemDesc {
	const o = obj as ItemDesc;
	if (typeof o.name !== "string") {
		lastError = `${prefix}.name は string である必要があります`;
		return false;
	}
	if (o.slug != null && typeof o.slug !== "string") {
		lastError = `${prefix}.slug は string である必要があります`;
		return false;
	}
	if (typeof o.color !== "string") {
		lastError = `${prefix}.color は string である必要があります`;
		return false;
	}
	if (o.readonly != null && typeof o.readonly !== "boolean") {
		lastError = `${prefix}.readonly は boolean である必要があります`;
		return false;
	}
	const readonly = o.readonly ?? false;
	if (!readonly && typeof o.min_day !== "number") {
		lastError = `${prefix}.min_day は number である必要があります`;
		return false;
	}
	if (o.account_item_id != null && typeof o.account_item_id !== "number") {
		lastError = `${prefix}.account_item_id は number である必要があります`;
		return false;
	}
	if (o.item_id != null && typeof o.item_id !== "number") {
		lastError = `${prefix}.item_id は number である必要があります`;
		return false;
	}
	if (o.partner_id != null && typeof o.partner_id !== "number") {
		lastError = `${prefix}.partner_id は number である必要があります`;
		return false;
	}
	if (o.day != null && typeof o.day !== "number") {
		lastError = `${prefix}.day は number である必要があります`;
		return false;
	}
	if (o.amount != null && typeof o.amount !== "number") {
		lastError = `${prefix}.amount は number である必要があります`;
		return false;
	}
	return true;
}
