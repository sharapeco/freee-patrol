/**
 * エラーレスポンス
 *
 * @see https://developer.freee.co.jp/reference/accounting/reference
 */
export type ErrorResponse = {
	status_code: number;
	errors: ErrorDesc[];
};

type ErrorDesc = {
	type: "status" | "validation";
	message?: string;
	messages?: string[];
};
