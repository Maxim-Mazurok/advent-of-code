import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { commonMultiplesOfArrays, main, parseInput } from "./2.code";

const sampleInput = dedent(`
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`);

it("parses input", () => {
  const sampleInput = dedent(`
    RL

    AAA = (BBB, CCC)
    BBB = (DDD, EEE)
    CCC = (ZZZ, GGG)
    DDD = (DDD, DDD)
    EEE = (EEE, EEE)
    GGG = (GGG, GGG)
    ZZZ = (ZZZ, ZZZ)
  `);
  const result = parseInput(sampleInput);
  expect(result).toEqual({
    directions: ["R", "L"],
    nodeMap: new Map([
      ["AAA", { name: "AAA", left: "BBB", right: "CCC" }],
      ["BBB", { name: "BBB", left: "DDD", right: "EEE" }],
      ["CCC", { name: "CCC", left: "ZZZ", right: "GGG" }],
      ["DDD", { name: "DDD", left: "DDD", right: "DDD" }],
      ["EEE", { name: "EEE", left: "EEE", right: "EEE" }],
      ["GGG", { name: "GGG", left: "GGG", right: "GGG" }],
      ["ZZZ", { name: "ZZZ", left: "ZZZ", right: "ZZZ" }],
    ]),
  });
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(6);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(12315788159977);
});

it("common multiples thing", () => {
  const array1 = [2];
  const array2 = [3, 6];
  expect(commonMultiplesOfArrays(array1, array2)).toEqual([6]);

  const array11 = [5, 1];
  const array22 = [3, 6];
  expect(commonMultiplesOfArrays(array11, array22)).toEqual([15, 30, 3, 6]);
});
