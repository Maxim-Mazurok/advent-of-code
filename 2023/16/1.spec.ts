import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { main, parseInput, solve, visualize } from "./1.code";

const sampleInput = dedent(`
  .|...\\....
  |.-.\\.....
  .....|-...
  ........|.
  ..........
  .........\\
  ..../.\\\\..
  .-.-/..|..
  .|....-|.\\
  ..//.|....
`);

const energized = dedent(`
  ######....
  .#...#....
  .#...#####
  .#...##...
  .#...##...
  .#...##...
  .#..####..
  ########..
  .#######..
  .#...#.#..
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toMatchInlineSnapshot(`
    [
      [
        ".",
        "|",
        ".",
        ".",
        ".",
        "\\",
        ".",
        ".",
        ".",
        ".",
      ],
      [
        "|",
        ".",
        "-",
        ".",
        "\\",
        ".",
        ".",
        ".",
        ".",
        ".",
      ],
      [
        ".",
        ".",
        ".",
        ".",
        ".",
        "|",
        "-",
        ".",
        ".",
        ".",
      ],
      [
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "|",
        ".",
      ],
      [
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
      ],
      [
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        ".",
        "\\",
      ],
      [
        ".",
        ".",
        ".",
        ".",
        "/",
        ".",
        "\\",
        "\\",
        ".",
        ".",
      ],
      [
        ".",
        "-",
        ".",
        "-",
        "/",
        ".",
        ".",
        "|",
        ".",
        ".",
      ],
      [
        ".",
        "|",
        ".",
        ".",
        ".",
        ".",
        "-",
        "|",
        ".",
        "\\",
      ],
      [
        ".",
        ".",
        "/",
        "/",
        ".",
        "|",
        ".",
        ".",
        ".",
        ".",
      ],
    ]
  `);
});

it("shows energized grid", () => {
  const result = solve(parseInput(sampleInput));
  const expected = parseInput(energized);
  // console.log(visualize(result));
  // console.log("----------");
  // console.log(visualize(expected));
  expect(visualize(result)).toBe(visualize(expected));
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(46);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(7477);
});
