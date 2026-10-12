import { describe, expect, it } from "vitest";
import { truncate } from "./truncate.js";

describe("truncate", () => {
	it("maxLength 以下ならそのまま返す", () => {
		expect(truncate("hello", 5)).toBe("hello");
		expect(truncate("hello", 10)).toBe("hello");
	});

	it("超えるときは省略記号を含めて maxLength に収める", () => {
		expect(truncate("hello world", 6)).toBe("hello…");
	});

	it("省略記号を指定できる", () => {
		expect(truncate("hello world", 8, "...")).toBe("hello...");
	});

	it("空文字はそのまま返す", () => {
		expect(truncate("", 0, "")).toBe("");
		expect(truncate("", 3)).toBe("");
	});

	it("maxLength が省略記号の長さちょうどなら省略記号だけになる", () => {
		expect(truncate("hello", 1)).toBe("…");
		expect(truncate("hello", 0, "")).toBe("");
	});

	it("絵文字（ZWJ 連結・肌色修飾）を途中で切らない", () => {
		const family = "👨‍👩‍👧‍👦";
		expect(truncate(`${family}${family}${family}`, 2)).toBe(`${family}…`);
		expect(truncate("👍🏽👍🏽👍🏽", 2)).toBe("👍🏽…");
	});

	it("結合文字を途中で切らない", () => {
		const e = "é";
		expect(truncate(`${e}${e}${e}`, 3)).toBe(`${e}${e}${e}`);
		expect(truncate(`${e}${e}${e}${e}`, 3)).toBe(`${e}${e}…`);
	});

	it("省略記号自体の長さも書記素で数える", () => {
		expect(truncate("abcdefg", 4, "👨‍👩‍👧‍👦")).toBe("abc👨‍👩‍👧‍👦");
	});

	it("maxLength が省略記号の長さより小さいと RangeError", () => {
		expect(() => truncate("hello", 2, "...")).toThrow(RangeError);
		expect(() => truncate("hi", 0)).toThrow(RangeError);
	});

	it("maxLength が整数でない・負数なら RangeError", () => {
		expect(() => truncate("hello", 1.5)).toThrow(RangeError);
		expect(() => truncate("hello", -1)).toThrow(RangeError);
		expect(() => truncate("hello", Number.NaN)).toThrow(RangeError);
		expect(() => truncate("hello", Number.POSITIVE_INFINITY)).toThrow(
			RangeError,
		);
	});
});
