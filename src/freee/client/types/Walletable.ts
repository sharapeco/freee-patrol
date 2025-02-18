/**
 * 口座
 *
 * ```
 * {
 *   "id": 1,
 *   "name": "freee銀行",
 *   "bank_id": 3,
 *   "type": "bank_account",
 *   "last_synced_at": "2019-01-01T00:00:00+09:00",
 *   "sync_status": "success",
 *   "last_balance": 1565583,
 *   "walletable_balance": 1340261
 * }
 * ```
 *
 * @see https://developer.freee.co.jp/reference/accounting/reference#/Walletables/get_walletables
 */
export type Walletable = {
	id: number;
	name: string;
	bank_id: number;
	type: WalletableType;
	last_synced_at: string;
	sync_status: "success" | "failed";
	last_balance: number;
	walletable_balance: number;
}

const walletableTypes = [
	"bank_account",
	"credit_card",
	"wallet",
] as const;

export type WalletableType = typeof walletableTypes[number];
