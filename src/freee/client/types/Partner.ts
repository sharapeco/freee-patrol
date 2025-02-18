/**
 * パートナー
 *
 * @see https://developer.freee.co.jp/reference/accounting/reference#/Partners/get_partners
 */
export type Partner = {
	id: number;
	code: string;
	company_id: number;
	name: string;
	update_date: string;
	available: boolean;
	shortcut1: string;
	shortcut2: string;
	org_code: string;
	country_code: string;
	long_name: string;
	name_kana: string;
	/** 敬称（例：御中） */
	default_title: string;
	phone: string;
	contact_name: string;
	email: string;
	payer_walletable_id: number;
	transfer_fee_handling_side: "payer" | "payee";
	qualified_invoice_issuer: boolean;
	invoice_registration_number?: string;
	address_attributes: {
		zipcode: string;
		prefecture_code: number;
		street_name1: string;
		street_name2: string;
	};
	partner_doc_setting_attributes: {
		sending_method: "posting" | "email" | "none";
	};
	partner_bank_account_attributes: {
		bank_name: string;
		bank_name_kana: string;
		bank_code: string;
		branch_name: string;
		branch_kana: string;
		branch_code: string;
		account_type: "ordinary" | "current" | "savings";
		account_number: string;
		account_name: string;
		long_account_name: string;
	};
};

export type PartnerSearchParam = {
	/** 事業所ID */
	company_id: number;
	/** 更新日で絞り込み：開始日(yyyy-mm-dd) */
	start_update_date?: string;
	/** 更新日で絞り込み：終了日(yyyy-mm-dd) */
	end_update_date?: string;
	/** 取得レコードのオフセット (デフォルト: 0) */
	offset?: number;
	/** 取得レコードの件数 (デフォルト: 50, 最小: 1, 最大: 3000) */
	limit?: number;
	/**
	 * 検索キーワード。
	 * 取引先コード・取引先名・正式名称・カナ名称・ショートカットキー1・2のいずれかに対する部分一致。
以下のいずれかで区切って複数キーワードを指定した場合はAND検索となります。
     * - 半角スペース
	 * - 全角スペース
	 * - タブ
	 */
	keyword?: string;
};
