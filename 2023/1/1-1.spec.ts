import { readFile } from "fs/promises";
import { join } from "path";
import { beforeAll, expect, it } from "vitest";

let input: string;

beforeAll(async () => {
  input = await readFile(join(__dirname, "1.input.txt"), "utf-8");
});

it("works", async () => {
  const lines = input.split("\n");
  let sum = 0;
  for (const line of lines) {
    const digits = line.match(/\d/g);

    if (digits === null) {
      throw new Error("No digits found");
    }

    const firstDigit = digits[0];
    const lastDigit = digits[digits.length - 1];

    const number = parseInt(`${firstDigit}${lastDigit}`);

    sum += number;
  }

  // console.log(sum);
  expect(sum).toBe(54450);
});
