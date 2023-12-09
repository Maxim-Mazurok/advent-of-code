import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import {
  extrapolateFromDiffs,
  getSequenceDiffs,
  main,
  parseInput,
  predictNextValue,
} from "./9-1.code";

const sampleInput = dedent(`
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toEqual([
    [0, 3, 6, 9, 12, 15],
    [1, 3, 6, 10, 15, 21],
    [10, 13, 16, 21, 30, 45],
  ]);
});

it("gets sequence diffs", () => {
  expect(getSequenceDiffs([0, 3, 6, 9, 12, 15])).toEqual([3, 3, 3, 3, 3]);
  expect(getSequenceDiffs([3, 3, 3, 3, 3])).toEqual([0, 0, 0, 0]);
});

it("extrapolates from diffs", () => {
  expect(
    extrapolateFromDiffs([
      [0, 3, 6, 9, 12, 15],
      [3, 3, 3, 3, 3],
      [0, 0, 0, 0],
    ])
  ).toBe(18);
});

it("works for one sequence", () => {
  expect(predictNextValue([0, 3, 6, 9, 12, 15])).toBe(18);
  expect(predictNextValue([1, 3, 6, 10, 15, 21])).toBe(28);
  expect(predictNextValue([10, 13, 16, 21, 30, 45])).toBe(68);
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(114);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "9.input.txt"), "utf-8");
  expect(main(input)).toBe(1757008019);
});
