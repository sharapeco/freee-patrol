/** 事業所 */
export type Company = {
	/** ID */
	id: number,
	/** 不使用 */
	name: string | null,
	/** 不使用 */
	name_kana: string | null,
	/** 表示名（例：株式会社○○） */
	display_name: string,
	/** 法人番号（例：8253118193） */
	company_number: string,
	/** 役割 */
	role: "owner" | "admin" | "member",
};
