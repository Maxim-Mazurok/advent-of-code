import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import {
  Node,
  buildGraph,
  buildGraphOfGround,
  findLongestPath,
  findNodesInsideLoop,
  main,
  nodesConnected,
  parseInput,
  renderNodes,
} from "./2.code";

it("renders nodes", () => {
  const nodes = parseInput(
    dedent(`
    ...........
    .S-------7.
    .|F-----7|.
    .||.....||.
    .||.....||.
    .|L-7.F-J|.
    .|..|.|..|.
    .L--J.L--J.
    ...........
  `)
  );
  const output = renderNodes(nodes);
  expect(output).toMatchInlineSnapshot(`
    "***********
    *×───────┐*
    *│┌─────┐│*
    *││*****││*
    *││*****││*
    *│└─┐*┌─┘│*
    *│**│*│**│*
    *└──┘*└──┘*
    ***********"
  `);
});

it("finds nodes inside of loop", () => {
  const nodes = parseInput(
    dedent(`
    ...........
    .S-------7.
    .|F-----7|.
    .||.....||.
    .||.....||.
    .|L-7.F-J|.
    .|..|.|..|.
    .L--J.L--J.
    ...........
  `)
  );
  const graph = buildGraph(nodes);

  // console.log(graphOfGround);

  const start = nodes.find((node) => node.value === "S")!;
  const longestPath = findLongestPath(graph, start);

  const graphOfGround = buildGraphOfGround(nodes);

  const nodesInsideLoop = findNodesInsideLoop(graphOfGround, longestPath);
  expect(nodesInsideLoop).toBe(4);
});

it("finds nodes inside of tight loop", () => {
  const nodes = parseInput(
    dedent(`
    ..........
    .S------7.
    .|F----7|.
    .||....||.
    .||....||.
    .|L-7F-J|.
    .|..||..|.
    .L--JL--J.
    ..........
  `)
  );
  const graph = buildGraph(nodes);

  // console.log(graphOfGround);

  const start = nodes.find((node) => node.value === "S")!;
  const longestPath = findLongestPath(graph, start);
  const graphOfGround = buildGraphOfGround(nodes);
  const nodesInsideLoop = findNodesInsideLoop(graphOfGround, longestPath);
  expect(nodesInsideLoop).toBe(4);
});

it("finds longest path", () => {
  const nodes = parseInput(
    dedent(`
    ..........
    .S------7.
    .|F----7|.
    .||....||.
    .||....||.
    .|L-7F-J|.
    .|..||..|.
    .L--JL--J.
    ..........
  `)
  );
  const graph = buildGraph(nodes);
  const start = nodes.find((node) => node.value === "S")!;
  const longestPath = findLongestPath(graph, start);
  expect(renderNodes(longestPath)).toMatchInlineSnapshot(`
    "\`\`\`\`\`\`\`\`\`
    \`×──────┐
    \`│┌────┐│
    \`││\`\`\`\`││
    \`││\`\`\`\`││
    \`│└─┐┌─┘│
    \`│\`\`││\`\`│
    \`└──┘└──┘"
  `);
});

//////////////////////////

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
    "*****
    *×─┐*
    *│*│*
    *└─┘*
    *****"
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

it.skip("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(529);
});

it("works for example input", async () => {
  const input = dedent(`
    FF7FSF7F7F7F7F7F---7
    L|LJ||||||||||||F--J
    FL-7LJLJ||||||LJL-77
    F--JF--7||LJLJ7F7FJ-
    L---JF-JLJ.||-FJLJJ7
    |F|F-JF---7F7-L7L|7|
    |FFJF7L7F-JF7|JL---7
    7-L-JL7||F7|L7F-7F7|
    L.L7LFJ|||||FJL7||LJ
    L7JLJL-JLJLJL--JLJ.L
  `);
  expect(main(input)).toBe(10);
});

it("builds graph", () => {
  const nodes = parseInput(sampleInput);
  const graph = buildGraph(nodes);
  expect(graph).toMatchInlineSnapshot(`
    Map {
      {
        "value": ".",
        "x": 0,
        "y": 0,
      } => [],
      {
        "value": ".",
        "x": 1,
        "y": 0,
      } => [],
      {
        "value": ".",
        "x": 2,
        "y": 0,
      } => [],
      {
        "value": ".",
        "x": 3,
        "y": 0,
      } => [],
      {
        "value": ".",
        "x": 4,
        "y": 0,
      } => [],
      {
        "value": ".",
        "x": 0,
        "y": 1,
      } => [],
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
        "value": ".",
        "x": 4,
        "y": 1,
      } => [],
      {
        "value": ".",
        "x": 0,
        "y": 2,
      } => [],
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
        "value": ".",
        "x": 2,
        "y": 2,
      } => [],
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
        "value": ".",
        "x": 4,
        "y": 2,
      } => [],
      {
        "value": ".",
        "x": 0,
        "y": 3,
      } => [],
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
      {
        "value": ".",
        "x": 4,
        "y": 3,
      } => [],
      {
        "value": ".",
        "x": 0,
        "y": 4,
      } => [],
      {
        "value": ".",
        "x": 1,
        "y": 4,
      } => [],
      {
        "value": ".",
        "x": 2,
        "y": 4,
      } => [],
      {
        "value": ".",
        "x": 3,
        "y": 4,
      } => [],
      {
        "value": ".",
        "x": 4,
        "y": 4,
      } => [],
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
