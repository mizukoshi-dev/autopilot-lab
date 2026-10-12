const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });

function toGraphemes(text: string): string[] {
	return Array.from(segmenter.segment(text), (s) => s.segment);
}

/**
 * 文字列を書記素（見た目の 1 文字）単位で maxLength 以内に切り詰める。
 * 超えた場合は省略記号を含めて maxLength に収める。
 * maxLength が整数でない・負数、または省略記号の長さより小さい場合は RangeError。
 */
export function truncate(
	input: string,
	maxLength: number,
	ellipsis = "…",
): string {
	if (!Number.isInteger(maxLength) || maxLength < 0) {
		throw new RangeError(
			`maxLength は 0 以上の整数にしてください: ${maxLength}`,
		);
	}
	const ellipsisGraphemes = toGraphemes(ellipsis);
	if (maxLength < ellipsisGraphemes.length) {
		throw new RangeError(
			`maxLength (${maxLength}) が省略記号の長さ (${ellipsisGraphemes.length}) より小さいです`,
		);
	}

	const graphemes = toGraphemes(input);
	if (graphemes.length <= maxLength) {
		return input;
	}
	const keep = maxLength - ellipsisGraphemes.length;
	return graphemes.slice(0, keep).join("") + ellipsis;
}
