import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { main, parseInput } from "./1.code";

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

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toEqual({
    directions: ["R", "L"],
    nodes: [
      { name: "AAA", left: "BBB", right: "CCC" },
      { name: "BBB", left: "DDD", right: "EEE" },
      { name: "CCC", left: "ZZZ", right: "GGG" },
      { name: "DDD", left: "DDD", right: "DDD" },
      { name: "EEE", left: "EEE", right: "EEE" },
      { name: "GGG", left: "GGG", right: "GGG" },
      { name: "ZZZ", left: "ZZZ", right: "ZZZ" },
    ],
  });
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(2);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(18113);
});
