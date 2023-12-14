import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { main, parseInput } from "./1.code";

const sampleInput = dedent(`
  O....#....
  O.OO#....#
  .....##...
  OO.#O....O
  .O.....O#.
  O.#..O.#.#
  ..O..#O..O
  .......O..
  #....###..
  #OO..#....
`);
// 37 27 22 17 17 32 17 21 6 26
// 

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toEqual([
    "O....#....",
    "O.OO#....#",
    ".....##...",
    "OO.#O....O",
    ".O.....O#.",
    "O.#..O.#.#",
    "..O..#O..O",
    ".......O..",
    "#....###..",
    "#OO..#....",
  ]);
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(136);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(109098);
});
