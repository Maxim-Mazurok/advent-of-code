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
    const digitsStart = line.match(
      /(?:\d|one|two|three|four|five|six|seven|eight|nine)/g
    );
    const digitsEnd = line
      .split("")
      .reverse()
      .join("")
      .match(/(?:\d|enin|thgie|neves|xis|evif|ruof|eerht|owt|eno)/g);

    if (digitsStart === null || digitsEnd === null) {
      throw new Error("Some digits not found");
    }

    const digitToNumber = (digit: string) => {
      switch (digit) {
        case "one":
          return 1;
        case "two":
          return 2;
        case "three":
          return 3;
        case "four":
          return 4;
        case "five":
          return 5;
        case "six":
          return 6;
        case "seven":
          return 7;
        case "eight":
          return 8;
        case "nine":
          return 9;
        default:
          return parseInt(digit);
      }
    };

    const firstDigit = digitToNumber(digitsStart[0]);
    const lastDigit = digitToNumber(digitsEnd[0].split("").reverse().join(""));

    // console.log(line, firstDigit, lastDigit, digitsStart, digitsEnd);

    const number = parseInt(`${firstDigit}${lastDigit}`);

    sum += number;
  }

  // console.log(sum);
  expect(sum).toBe(54265);
});
