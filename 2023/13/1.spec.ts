import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { main, parseInput } from "./1.code";

const sampleInput = dedent(`
  #.##..##.
  ..#.##.#.
  ##......#
  ##......#
  ..#.##.#.
  ..##..##.
  #.#.##.#.

  #...##..#
  #....#..#
  ..##..###
  #####.##.
  #####.##.
  ..##..###
  #....#..#
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toMatchInlineSnapshot(`
    [
      [
        "#.##..##.",
        "..#.##.#.",
        "##......#",
        "##......#",
        "..#.##.#.",
        "..##..##.",
        "#.#.##.#.",
      ],
      [
        "#...##..#",
        "#....#..#",
        "..##..###",
        "#####.##.",
        "#####.##.",
        "..##..###",
        "#....#..#",
      ],
    ]
  `);
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(405);
});

it("works for example input 2", () => {
  const input = dedent(`
    .#.
    #.#
    #.#
  `);
  expect(main(input)).toBe(2 * 100);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(26957);
});
