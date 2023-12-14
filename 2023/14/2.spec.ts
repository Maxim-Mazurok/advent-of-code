import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import {
  cycle,
  main,
  moveStonesUp,
  parseInput,
  rotateGridToLeft,
  scoreGrid,
} from "./2.code";

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
  expect(main(sampleInput)).toBe(64);
});

it("works for previous example input", () => {
  let grid = parseInput(sampleInput);
  grid = moveStonesUp(grid);
  const score = scoreGrid(grid);
  expect(score).toBe(136);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(100064);
});

it("rotates grid", () => {
  expect(rotateGridToLeft(["123", "223", "323"])).toEqual([
    "321",
    "222",
    "333",
  ]);
});

it("moves stones up", () => {
  const grid = parseInput(sampleInput);
  const result = parseInput(
    dedent(`
    OOOO.#.O..
    OO..#....#
    OO..O##..O
    O..#.OO...
    ........#.
    ..#....#.#
    ..O..#.O.O
    ..O.......
    #....###..
    #....#....
  `)
  );
  expect(moveStonesUp(grid)).toEqual(result);
});

it("cycles", () => {
  expect(cycle(parseInput(sampleInput))).toEqual(
    parseInput(
      dedent(`
        .....#....
        ....#...O#
        ...OO##...
        .OO#......
        .....OOO#.
        .O#...O#.#
        ....O#....
        ......OOOO
        #...O###..
        #..OO#....
        `)
    )
  );

  expect(cycle(cycle(parseInput(sampleInput)))).toEqual(
    parseInput(
      dedent(`
        .....#....
        ....#...O#
        .....##...
        ..O#......
        .....OOO#.
        .O#...O#.#
        ....O#...O
        .......OOO
        #..OO###..
        #.OOO#...O
        `)
    )
  );
});
