import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { main, parseInput } from "./1.code";

const sampleInput = dedent(`
  Something
  something
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toEqual(undefined);
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(undefined);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(undefined);
});
