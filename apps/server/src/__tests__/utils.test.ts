import { describe, expect, test } from "bun:test";
import { formatHoursAndMinutes } from "../lib/utils";

describe("formatHoursAndMinutes", () => {
	test("formats minutes correctly", () => {
		expect(formatHoursAndMinutes(30)).toBe("30m");
		expect(formatHoursAndMinutes(45)).toBe("45m");
		expect(formatHoursAndMinutes(59)).toBe("59m");
	});

	test("formats hours correctly", () => {
		expect(formatHoursAndMinutes(60)).toBe("1h");
		expect(formatHoursAndMinutes(120)).toBe("2h");
		expect(formatHoursAndMinutes(180)).toBe("3h");
	});

	test("formats hours and minutes correctly", () => {
		expect(formatHoursAndMinutes(90)).toBe("1h 30m");
		expect(formatHoursAndMinutes(135)).toBe("2h 15m");
		expect(formatHoursAndMinutes(245)).toBe("4h 5m");
	});

	test("handles zero correctly", () => {
		expect(formatHoursAndMinutes(0)).toBe("0m");
	});

	test("handles large numbers", () => {
		expect(formatHoursAndMinutes(1440)).toBe("24h"); // 1 day
		expect(formatHoursAndMinutes(1500)).toBe("25h"); // 25 hours exactly
		expect(formatHoursAndMinutes(1530)).toBe("25h 30m"); // 25.5 hours
	});

	test("handles edge cases", () => {
		expect(formatHoursAndMinutes(1)).toBe("1m");
		expect(formatHoursAndMinutes(61)).toBe("1h 1m");
	});
});
