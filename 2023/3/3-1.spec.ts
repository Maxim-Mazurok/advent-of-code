import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";

const isNumber = (char: string) => Number(char).toString() === char;

const isAdjacentToSymbol = (lines: string[], row: number, column: number) => {
  const isSymbol = (char?: string) =>
    char !== undefined && !isNumber(char) && char !== ".";

  const top = lines[row - 1]?.[column];
  if (isSymbol(top)) return true;
  const bottom = lines[row + 1]?.[column];
  if (isSymbol(bottom)) return true;
  const left = lines[row]?.[column - 1];
  if (isSymbol(left)) return true;
  const right = lines[row]?.[column + 1];
  if (isSymbol(right)) return true;
  const topLeft = lines[row - 1]?.[column - 1];
  if (isSymbol(topLeft)) return true;
  const topRight = lines[row - 1]?.[column + 1];
  if (isSymbol(topRight)) return true;
  const bottomLeft = lines[row + 1]?.[column - 1];
  if (isSymbol(bottomLeft)) return true;
  const bottomRight = lines[row + 1]?.[column + 1];
  if (isSymbol(bottomRight)) return true;

  return false;
};

const main = (input: string) => {
  const lines = input.split("\n");
  const columnsNumber = lines[0]!.length;
  const includedNumbers: number[] = [];

  let currentNumber = "";
  let currentNumberIsIncluded = false;

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row]!;
    for (let column = 0; column < columnsNumber; column++) {
      const char = line[column]!;
      if (isNumber(char)) {
        currentNumber += char;
        if (isAdjacentToSymbol(lines, row, column)) {
          currentNumberIsIncluded = true;
        }
      } else {
        if (currentNumberIsIncluded) {
          includedNumbers.push(Number(currentNumber));
        }
        currentNumber = "";
        currentNumberIsIncluded = false;
      }
    }
  }

  // console.log(includedNumbers);

  return includedNumbers.reduce((a, b) => a + b, 0);
};

it("works for example input", () => {
  const input = dedent(`
    467..114..
    ...*......
    ..35..633.
    ......#...
    617*......
    .....+.58.
    ..592.....
    ......755.
    ...$.*....
    .664.598..
  `);
  expect(main(input)).toBe(4361);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "3.input.txt"), "utf-8");
  expect(main(input)).toBe(531561);
});
