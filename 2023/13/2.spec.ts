import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { main, parseInput } from "./2.code";

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
  expect(main(sampleInput)).toBe(400);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBeGreaterThan(38726);
  expect(main(input)).toBeGreaterThan(38830);
  expect(main(input)).toBe(42695);
});
