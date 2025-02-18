import type { DateString, IdType, Price } from "./types";

export type Deal = {
	id: IdType;
	company_id: IdType;
	issue_date: DateString;
	due_date: DateString | null;
	amount: Price;
	due_amount: Price;
	type: DealType;
	partner_id: IdType | null;
	partner_code: string | null;
	ref_number: string | null;
	status: DealStatus;
	details: DealDetail[];
	payments: DealPayment[];
	receipts: DealReceipt[];
};

export type DealDetail = {
	id: IdType;
	account_item_id: IdType | null;
	tax_code: number;
	item_id: IdType;
	section_id: IdType | null;
	amount: Price;
	vat: Price;
	description: string;
	entry_side: "debit";
};

export type DealPayment = {
	id: IdType;
	date: DateString;
	from_walletable_type: string;
	from_walletable_id: IdType;
	amount: Price;
};

export type DealReceipt = {
	id: IdType;
};

export type DealStatus = "unsettled" | "settled";

export type DealType = "income" | "expense";

export type DealAccruals = "without" | "with";

export type DealsParam = {
	company_id: IdType;
	partner_id?: IdType;
	account_item_id?: IdType;
	partner_code?: string;
	status?: DealStatus;
	type?: DealType;
	start_issue_date?: DateString;
	end_issue_date?: DateString;
	start_due_date?: DateString;
	end_due_date?: DateString;
	start_renew_date?: DateString;
	end_renew_date?: DateString;
	offset?: number;
	limit?: number;
	accruals?: DealAccruals;
};

export type DealCreateParam = {
	company_id: IdType;
	issue_date: DateString;
	type: DealType;
	due_date?: DateString;
	partner_id?: IdType;
	partner_code?: string;
	ref_number?: string;
	details: DealCreateDetail[];
	payments: DealCreatePayment[];
	receipt_ids: IdType[];
};

type DealCreateDetail = {
	tax_code: number;
	account_item_id: IdType;
	amount: Price;
	item_id?: IdType;
	section_id?: IdType;
	tag_ids?: IdType[];
	segment_1_tag_id?: IdType;
	segment_2_tag_id?: IdType;
	segment_3_tag_id?: IdType;
	description?: string;
	vat?: Price;
};

type DealCreatePayment = {
	amount: Price;
	from_walletable_id: IdType;
	from_walletable_type: string;
	date: DateString;
};
