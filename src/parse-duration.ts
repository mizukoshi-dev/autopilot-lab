const UNIT_MS = {
	ms: 1,
	s: 1000,
	m: 60 * 1000,
	h: 60 * 60 * 1000,
	d: 24 * 60 * 60 * 1000,
} as const;

type Unit = keyof typeof UNIT_MS;

// "ms" を "m" より先に試す。数値と単位の間の空白は許さない
const TOKEN = /\s*(\d+(?:\.\d+)?)(ms|s|m|h|d)\s*/y;

/** "1h30m" のような期間の文字列をミリ秒に変換する。不正な入力は RangeError */
export function parseDuration(input: string): number {
	if (input.trim() === "") {
		throw new RangeError("期間の文字列が空です");
	}

	const seen = new Set<Unit>();
	let total = 0;
	TOKEN.lastIndex = 0;
	while (TOKEN.lastIndex < input.length) {
		const start = TOKEN.lastIndex;
		const match = TOKEN.exec(input);
		if (match === null) {
			throw new RangeError(
				`期間の文字列を解釈できません: "${input}"（位置 ${start}）`,
			);
		}
		const unit = match[2] as Unit;
		if (seen.has(unit)) {
			throw new RangeError(`単位 "${unit}" が重複しています: "${input}"`);
		}
		seen.add(unit);
		total += Number(match[1]) * UNIT_MS[unit];
	}
	return total;
}
