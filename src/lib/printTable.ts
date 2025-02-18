/** セル。文字列と色付け関数のペア */
type CellDesc = {
	t: string;
	c?: (text: string) => string;
};

/**
 * 表を出力する。
 * ここでは右揃えしか使わないので、右揃えのみ対応。
 *
 * @param rows 行リスト
 */
export function printTable(rows: CellDesc[][]) {
	/** 列間のセパレータ */
	const sep = "  ";

	const columnWidths = new Map<number, number>();
	for (const row of rows) {
		for (let i = 0; i < row.length; i++) {
			const width = getStringWidth(row[i].t);
			const currentWidth = columnWidths.get(i) ?? 0;
			columnWidths.set(i, Math.max(currentWidth, width));
		}
	}

	for (const row of rows) {
		const line = [];
		for (let i = 0; i < row.length; i++) {
			const { t: text, c: color } = row[i];
			const width = columnWidths.get(i) ?? 0;
			const padding = width - getStringWidth(text);
			line.push(" ".repeat(padding) + (color ? color(text) : text));
		}
		console.log(line.join(sep));
	}
}

function getStringWidth(str: string): number {
	return [...str]
		.map((c) => {
			const code = c.codePointAt(0);
			if (code == null) {
				return 1;
			}
			// CJK
			if (code >= 0x4e00 && code <= 0x9fff) {
				return 2;
			}
			// Fullwidth
			if (code >= 0xff01 && code <= 0xff60) {
				return 2;
			}
			// 絵文字
			if (code > 0xffff) {
				return 2;
			}
			return 1;
		})
		.reduce((a, b) => a + b, 0);
}
