import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import {
  Node,
  buildGraph,
  findLongestPath,
  findLoop,
  findPath,
  main,
  nodesConnected,
  parseInput,
  renderNodes,
} from "./1.code";

const sampleInput = dedent(`
  .....
  .S-7.
  .|.|.
  .L-J.
  .....
`);

it("renders nodes", () => {
  const nodes = parseInput(sampleInput);
  const output = renderNodes(nodes);
  expect(output).toMatchInlineSnapshot(`
    "     
     ×─┐ 
     │ │ 
     └─┘ 
         "
  `);
});

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toEqual([
    { value: ".", x: 0, y: 0 },
    { value: ".", x: 1, y: 0 },
    { value: ".", x: 2, y: 0 },
    { value: ".", x: 3, y: 0 },
    { value: ".", x: 4, y: 0 },
    { value: ".", x: 0, y: 1 },
    { value: "S", x: 1, y: 1 },
    { value: "-", x: 2, y: 1 },
    { value: "7", x: 3, y: 1 },
    { value: ".", x: 4, y: 1 },
    { value: ".", x: 0, y: 2 },
    { value: "|", x: 1, y: 2 },
    { value: ".", x: 2, y: 2 },
    { value: "|", x: 3, y: 2 },
    { value: ".", x: 4, y: 2 },
    { value: ".", x: 0, y: 3 },
    { value: "L", x: 1, y: 3 },
    { value: "-", x: 2, y: 3 },
    { value: "J", x: 3, y: 3 },
    { value: ".", x: 4, y: 3 },
    { value: ".", x: 0, y: 4 },
    { value: ".", x: 1, y: 4 },
    { value: ".", x: 2, y: 4 },
    { value: ".", x: 3, y: 4 },
    { value: ".", x: 4, y: 4 },
  ]);
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(4);
});
it("works for example input", () => {
  const sampleInput = dedent(`
    -L|F7
    7S-7|
    L|7||
    -L-J|
    L|-JF
  `);
  expect(main(sampleInput)).toBe(4);
});

it("works for another example input", () => {
  const sampleInput = dedent(`
    ..F7.
    .FJ|.
    SJ.L7
    |F--J
    LJ...
  `);
  expect(main(sampleInput)).toBe(8);
});

it("works for yet another example input", () => {
  const sampleInput = dedent(`
    7-F7-
    .FJ|7
    SJLL7
    |F--J
    LJ.LJ
  `);
  // console.log(renderNodes(parseInput(sampleInput)));
  expect(main(sampleInput)).toBe(8);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(6923);
});

it("builds graph", () => {
  const nodes = parseInput(sampleInput);
  const graph = buildGraph(nodes);
  expect(graph).toMatchInlineSnapshot(`
    Map {
      {
        "value": "S",
        "x": 1,
        "y": 1,
      } => [
        {
          "value": "-",
          "x": 2,
          "y": 1,
        },
        {
          "value": "|",
          "x": 1,
          "y": 2,
        },
      ],
      {
        "value": "-",
        "x": 2,
        "y": 1,
      } => [
        {
          "value": "S",
          "x": 1,
          "y": 1,
        },
        {
          "value": "7",
          "x": 3,
          "y": 1,
        },
      ],
      {
        "value": "7",
        "x": 3,
        "y": 1,
      } => [
        {
          "value": "-",
          "x": 2,
          "y": 1,
        },
        {
          "value": "|",
          "x": 3,
          "y": 2,
        },
      ],
      {
        "value": "|",
        "x": 1,
        "y": 2,
      } => [
        {
          "value": "S",
          "x": 1,
          "y": 1,
        },
        {
          "value": "L",
          "x": 1,
          "y": 3,
        },
      ],
      {
        "value": "|",
        "x": 3,
        "y": 2,
      } => [
        {
          "value": "7",
          "x": 3,
          "y": 1,
        },
        {
          "value": "J",
          "x": 3,
          "y": 3,
        },
      ],
      {
        "value": "L",
        "x": 1,
        "y": 3,
      } => [
        {
          "value": "|",
          "x": 1,
          "y": 2,
        },
        {
          "value": "-",
          "x": 2,
          "y": 3,
        },
      ],
      {
        "value": "-",
        "x": 2,
        "y": 3,
      } => [
        {
          "value": "L",
          "x": 1,
          "y": 3,
        },
        {
          "value": "J",
          "x": 3,
          "y": 3,
        },
      ],
      {
        "value": "J",
        "x": 3,
        "y": 3,
      } => [
        {
          "value": "|",
          "x": 3,
          "y": 2,
        },
        {
          "value": "-",
          "x": 2,
          "y": 3,
        },
      ],
    }
  `);
});

it("checks if nodes are connected", () => {
  expect(
    nodesConnected(
      parseInput(
        dedent(`
    |
    L
  `)
      ) as [Node, Node]
    )
  ).toBe(true);
});

it("finds longest loop", () => {
  const nodes = parseInput(sampleInput);
  const graph = buildGraph(nodes);
  const start = nodes.find((node) => node.value === "S")!;
  const loop = findLongestPath(graph, start);
  expect(loop).toMatchInlineSnapshot(`
    [
      {
        "value": "S",
        "x": 1,
        "y": 1,
      },
      {
        "value": "-",
        "x": 2,
        "y": 1,
      },
      {
        "value": "7",
        "x": 3,
        "y": 1,
      },
      {
        "value": "|",
        "x": 3,
        "y": 2,
      },
      {
        "value": "J",
        "x": 3,
        "y": 3,
      },
      {
        "value": "-",
        "x": 2,
        "y": 3,
      },
      {
        "value": "L",
        "x": 1,
        "y": 3,
      },
      {
        "value": "|",
        "x": 1,
        "y": 2,
      },
    ]
  `);
});
