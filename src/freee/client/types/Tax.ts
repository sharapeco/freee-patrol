/**
 * 税区分
 *
 * ```json
 * {
 *   "code": 21,
 *   "name": "sales_with_tax",
 *   "name_ja": "課税売上",
 *   "display_category": "tax_8",
 *   "available": true
 * }
 * ```
 *
 * @see https://developer.freee.co.jp/reference/accounting/reference#/Taxes/get_taxes_companies
 */
export type Tax = {
	code: number;
	name: string;
	name_ja: string;
	display_category: string;
	available: boolean;
};
