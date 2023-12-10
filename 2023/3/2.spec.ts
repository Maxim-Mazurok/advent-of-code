import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";

const isNumber = (char: string) => Number(char).toString() === char;

const isStar = (char?: string) => char === "*";

const adjacentStars = (
  lines: string[],
  row: number,
  column: number
): { row: number; column: number }[] => {
  return [
    { row: row - 1, column },
    { row: row + 1, column },
    { row, column: column - 1 },
    { row, column: column + 1 },
    { row: row - 1, column: column - 1 },
    { row: row - 1, column: column + 1 },
    { row: row + 1, column: column - 1 },
    { row: row + 1, column: column + 1 },
  ].filter(({ row, column }) => isStar(lines[row]?.[column]));
};

const main = (input: string) => {
  const lines = input.split("\n");
  const columnsNumber = lines[0]!.length;

  const numbersAdjacentToStar: {
    number: number;
    rowStart: number;
    columnStart: number;
    starRow: number;
    starColumn: number;
  }[] = [];

  let currentNumber = "";
  let adjacentStarsToCurrentNumber: {
    row: number;
    column: number;
  }[] = [];

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row]!;
    for (let column = 0; column < columnsNumber; column++) {
      const char = line[column]!;
      if (isNumber(char)) {
        currentNumber += char;
        const stars = adjacentStars(lines, row, column);
        for (const star of stars) {
          if (
            !adjacentStarsToCurrentNumber.find(
              (s) => s.column === star.column && s.row === star.row
            )
          ) {
            adjacentStarsToCurrentNumber.push(star);
          }
        }
      } else {
        if (currentNumber !== "") {
          for (const adjacentStar of adjacentStarsToCurrentNumber) {
            numbersAdjacentToStar.push({
              number: Number(currentNumber),
              rowStart: row,
              columnStart: column,
              starRow: adjacentStar.row,
              starColumn: adjacentStar.column,
            });
          }
        }
        currentNumber = "";
        adjacentStarsToCurrentNumber = [];
      }
    }
  }

  // console.table(numbersAdjacentToStar);

  const gearRatios: number[] = [];

  for (let row = 0; row < lines.length; row++) {
    const line = lines[row]!;
    for (let column = 0; column < columnsNumber; column++) {
      const char = line[column]!;
      if (isStar(char)) {
        const adjacentNumbers = numbersAdjacentToStar.filter(
          (number) => number.starRow === row && number.starColumn === column
        );
        // console.log(adjacentNumbers);
        if (adjacentNumbers.length === 2) {
          gearRatios.push(
            adjacentNumbers[0]!.number * adjacentNumbers[1]!.number
          );
        }
      }
    }
  }

  return gearRatios.reduce((a, b) => a + b, 0);
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
  expect(main(input)).toBe(467835);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(83279367);
});
