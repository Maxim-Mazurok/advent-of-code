import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { hash, main, parseInput } from "./1.code";

const sampleInput = dedent(`
  rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toMatchInlineSnapshot(`
    [
      "rn=1",
      "cm-",
      "qp=3",
      "cm=2",
      "qp-",
      "pc=4",
      "ot=9",
      "ab=5",
      "pc-",
      "pc=6",
      "ot=7",
    ]
  `);
});

(
  [
    ["HASH", 52],
    ["rn=1", 30],
    ["cm-", 253],
    ["qp=3", 97],
    ["cm=2", 47],
    ["qp-", 14],
    ["pc=4", 180],
    ["ot=9", 9],
    ["ab=5", 197],
    ["pc-", 48],
    ["pc=6", 214],
    ["ot=7", 231],
  ] satisfies [string, number][]
).map(([input, expected]) =>
  it(`works for single string "${input}"`, () => {
    expect(hash(input)).toBe(expected);
  })
);

it("works for example input", () => {
  expect(main(sampleInput)).toBe(1320);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(514281);
});
