import { describe, expect, it } from "vitest";
import { slugify } from "./slugify.js";

describe("slugify", () => {
	it("小文字にしてハイフンで区切る", () => {
		expect(slugify("Hello World")).toBe("hello-world");
	});

	it("アクセント記号を外す", () => {
		expect(slugify("Crème Brûlée")).toBe("creme-brulee");
	});

	it("前後の記号を落とす", () => {
		expect(slugify("  --Hi!--  ")).toBe("hi");
	});
});
