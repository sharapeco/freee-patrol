import type { Company } from "./types/Company.ts";
import type { Deal, DealCreateParam, DealsParam } from "./types/Deal.ts";
import type { Partner } from "./types/Partner.ts";
import type { Tax } from "./types/Tax.ts";
import type { Walletable } from "./types/Walletable.ts";
import type { Meta as ApiMeta } from "./types/types.ts";

// biome-ignore lint/suspicious/noExplicitAny: 予期できないため
type ParamValue = any;

interface MapObject {
	[key: string]: ParamValue;
}

type Payload = {
	meta?: ApiMeta;
	// biome-ignore lint/suspicious/noExplicitAny: 予期できないため
	[key: string]: any;
};

export class Client {
	private baseURL: string;
	private token: string;

	constructor(token: string) {
		this.baseURL = "https://api.freee.co.jp";
		this.token = token;
	}

	async get(url: string, params: MapObject = {}): Promise<Payload> {
		try {
			const urlObj = new URL(this.baseURL + url);
			for (const key of Object.keys(params)) {
				urlObj.searchParams.set(key, params[key]);
			}

			const response = await fetch(urlObj, {
				method: "GET",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${this.token}`,
					"X-Api-Version": "2020-06-15",
				},
			});

			const payload = await response.json();

			if (response.status !== 200) {
				throw new Error(payload.code ?? "unknown");
			}

			return payload;
		} catch (e) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw e;
		}
	}

	// biome-ignore lint/suspicious/noExplicitAny: 予期できないため
	async post(url: string, data: MapObject | null = null): Promise<any> {
		try {
			const response = await fetch(this.baseURL + url, {
				method: "POST",
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${this.token}`,
					"Content-Type": "application/json",
					"X-Api-Version": "2020-06-15",
				},
				body: JSON.stringify(data),
			});
			const payload = await response.json();
			if (payload.errors != null) {
				console.error(JSON.stringify(payload));
			}
			return payload;
		} catch (e) {
			// biome-ignore lint/complexity/noUselessCatch: <explanation>
			throw e;
		}
	}

	async getAll<T>(
		endpoint: string,
		itemKey: string,
		params: MapObject = {},
	): Promise<[T[], ApiMeta?]> {
		const items: T[] = [];
		let response: Payload;
		let offset = 0;
		do {
			response = await this.get(endpoint, { offset, ...params });
			const partialItems = response[itemKey] as T[];
			items.push(...partialItems);
			offset += partialItems.length;
			if (response.meta == null) {
				break;
			}
		} while (items.length < response.meta.total_count);
		return [items, response.meta];
	}

	async getDeals(params: DealsParam): Promise<Deal[]> {
		const [items, _] = await this.getAll("/api/1/deals", "deals", params);
		return items as Deal[];
	}

	async createDeal(data: DealCreateParam): Promise<Deal> {
		return await this.post("/api/1/deals", data);
	}

	async getCompanies(): Promise<Company[]> {
		const [items, _] = await this.getAll("/api/1/companies", "companies");
		return items as Company[];
	}

	async getPartners(
		company_id: string | number,
		keyword: string | undefined = undefined,
	): Promise<Partner[]> {
		const params: { company_id: string | number; keyword?: string } = {
			company_id,
		};
		if (keyword != null) {
			params.keyword = keyword;
		}
		const [items, _] = await this.getAll("/api/1/partners", "partners", params);
		return items as Partner[];
	}

	async getTaxes(company_id: string | number): Promise<Tax[]> {
		const [items, _] = await this.getAll(
			`/api/1/taxes/companies/${company_id}`,
			"taxes",
		);
		return items as Tax[];
	}

	async getWalletables(company_id: string | number): Promise<Walletable[]> {
		const [items, _] = await this.getAll("/api/1/walletables", "walletables", {
			company_id,
		});
		return items as Walletable[];
	}
}
