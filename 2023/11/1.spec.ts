import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import {
  Point,
  expandUniverse,
  findShortestPathBetween,
  getAllPairCombinations,
  main,
  pairOverlaps,
  parseInput,
  printCombination,
} from "./1.code";

const sampleInput = dedent(`
  ...#......
  .......#..
  #.........
  ..........
  ......#...
  .#........
  .........#
  ..........
  .......#..
  #...#.....
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toMatchSnapshot();
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(374);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBeGreaterThan(9108609);
  expect(main(input)).toBe(9724940);
});

it("expands universe", () => {
  const universe = parseInput(sampleInput);
  const result = expandUniverse(universe);
  expect(result).toMatchSnapshot();
});

it("finds a path1", () => {
  const result = findShortestPathBetween(
    {
      x: 1,
      y: 6,
    },
    {
      x: 5,
      y: 12,
    }
  );
  expect(result).toBe(10);
});
it("finds a path2", () => {
  expect(
    findShortestPathBetween(
      {
        x: 4,
        y: 0,
      },
      {
        x: 9,
        y: 10,
      }
    )
  ).toBe(15);
});

it("finds a path3", () => {
  expect(
    findShortestPathBetween(
      {
        x: 0,
        y: 2,
      },
      {
        x: 12,
        y: 7,
      }
    )
  ).toBe(17);
});

it("finds a path5", () => {
  expect(
    findShortestPathBetween(
      {
        x: 8,
        y: 0,
      },
      {
        x: 0,
        y: 4,
      }
    )
  ).toBe(12);
});

it("finds a path6", () => {
  expect(
    findShortestPathBetween(
      {
        x: 3,
        y: 0,
      },
      {
        x: 0,
        y: 3,
      }
    )
  ).toBe(6);
});

it("finds a path4", () => {
  expect(
    findShortestPathBetween(
      {
        x: 0,
        y: 12,
      },
      {
        x: 5,
        y: 12,
      }
    )
  ).toBe(5);
});

// const shuffle = <T>(items: T[]): T[][] => {
//   const getVersions = (versions: T[][] = [], number = 0): T[][] => {
//     if (number === items.length) {
//       return versions;
//     }

//     const newVersions: T[][] = [];
//     for (const x of items) {
//       for (const version of versions) {
//         if (!version.includes(x)) {
//           newVersions.push([...version, x]);
//         }
//       }
//     }

//     // console.log(newVersions);

//     return getVersions(newVersions, number + 1);
//   };

//   return getVersions(
//     items.map((x) => [x]),
//     1
//   );
// };

// it("shuffle", () => {
//   const string = "1234";
//   const result = shuffle(string.split(""));
//   console.log(result.length);
//   console.log(result.map((x) => x.join("")));
// });
