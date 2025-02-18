import { Client } from "./client/client.js";
import type { Deal } from "./client/types/Deal.js";

type MyClientConfig = {
	company_id: number;
	tax_code: number;
	from_walletable_id: number;
	from_walletable_type: string;
};

export type ExpenseInput = {
	month: number;
	date: number;
	amount: number;
	account_item_id: number;
	item_id: number;
	description?: string;
	partner_id?: number;
};

export class MyClient {
	private client: Client;
	private year: number;
	private config: MyClientConfig;

	private dealsCache: Deal[] | null = null;

	constructor(token: string, config: MyClientConfig) {
		this.client = new Client(token);
		this.year = new Date().getFullYear();
		this.config = config;
	}

	setYear(year: number) {
		this.year = year;
	}

	async getDeals(): Promise<Deal[]> {
		if (this.dealsCache == null) {
			this.dealsCache = await this.client.getDeals({
				company_id: this.config.company_id,
				start_issue_date: `${this.year}-01-01`,
				end_issue_date: `${this.year}-12-31`,
			});
		}
		return this.dealsCache;
	}

	async createExpense(e: ExpenseInput): Promise<Deal> {
		const date = [
			String(this.year),
			String(e.month).padStart(2, "0"),
			String(e.date).padStart(2, "0"),
		].join("-");

		return await this.client.createDeal({
			company_id: this.config.company_id,
			issue_date: date,
			type: "expense",
			partner_id: e.partner_id,
			details: [
				{
					amount: e.amount,
					tax_code: this.config.tax_code,
					account_item_id: e.account_item_id,
					item_id: e.item_id,
					description: e.description,
				},
			],
			payments: [
				{
					amount: e.amount,
					from_walletable_id: this.config.from_walletable_id,
					from_walletable_type: this.config.from_walletable_type,
					date: date,
				},
			],
			receipt_ids: [],
		});
	}
}
