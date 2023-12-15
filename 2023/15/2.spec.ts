import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { hash, main, parseInput, processSteps } from "./2.code";

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
    ["rn", 0],
    ["cm", 0],
  ] satisfies [string, number][]
).map(([input, expected]) =>
  it(`works for single string "${input}"`, () => {
    expect(hash(input)).toBe(expected);
  })
);

(
  [
    ["rn=1", { 0: [["rn", 1]] }],
    ["rn=1,cm-", { 0: [["rn", 1]] }],
    ["rn=1,cm-,qp=3", { 0: [["rn", 1]], 1: [["qp", 3]] }],
    [
      "rn=1,cm-,qp=3,cm=2",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        1: [["qp", 3]],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-,pc=4",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [["pc", 4]],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [
          ["pc", 4],
          ["ot", 9],
        ],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [
          ["pc", 4],
          ["ot", 9],
          ["ab", 5],
        ],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [
          ["ot", 9],
          ["ab", 5],
        ],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [
          ["ot", 9],
          ["ab", 5],
          ["pc", 6],
        ],
      },
    ],
    [
      "rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7",
      {
        0: [
          ["rn", 1],
          ["cm", 2],
        ],
        3: [
          ["ot", 7],
          ["ab", 5],
          ["pc", 6],
        ],
      },
    ],
  ] satisfies [string, { [key: number]: [string, number][] }][]
).map(([input, expected]) =>
  it(`works for "${input}"`, () => {
    expect(processSteps(parseInput(input))).toMatchObject(expected);
  })
);

it("works for example input", () => {
  expect(main(sampleInput)).toBe(244199);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(514281);
});
