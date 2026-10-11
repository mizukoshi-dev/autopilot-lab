import { describe, expect, it } from "vitest";
import { parseDuration } from "./parse-duration.js";

describe("parseDuration", () => {
	it.each([
		["500ms", 500],
		["2s", 2000],
		["3m", 180_000],
		["1h", 3_600_000],
		["1d", 86_400_000],
	])("単一の単位を変換する: %s", (input, expected) => {
		expect(parseDuration(input)).toBe(expected);
	});

	it("単位を組み合わせられる", () => {
		expect(parseDuration("1h30m")).toBe(5_400_000);
		expect(parseDuration("1d2h3m4s5ms")).toBe(93_784_005);
	});

	it("小数を扱える", () => {
		expect(parseDuration("1.5s")).toBe(1500);
	});

	it("0 を許す", () => {
		expect(parseDuration("0s")).toBe(0);
	});

	it("前後と単位間の空白を許す", () => {
		expect(parseDuration(" 2h 15m ")).toBe(8_100_000);
	});

	it.each([
		["空文字", ""],
		["空白のみ", "   "],
		["単位なし", "100"],
		["未知の単位", "1w"],
		["単位の後ろにゴミ", "1min"],
		["同じ単位の重複", "1h2h"],
		["負数", "-1h"],
		["数値と単位の間の空白", "1 h"],
		["数値なし", "h"],
	])("不正な入力は RangeError: %s", (_, input) => {
		expect(() => parseDuration(input)).toThrow(RangeError);
	});
});
