/** 文字列を URL 向けのスラッグ（小文字・ハイフン区切り）に変換する */
export function slugify(input: string): string {
	return input
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
