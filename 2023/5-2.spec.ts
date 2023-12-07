import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";

const sampleInput = dedent(`
  seeds: 79 14 55 13

  seed-to-soil map:
  50 98 2
  52 50 48

  soil-to-fertilizer map:
  0 15 37
  37 52 2
  39 0 15

  fertilizer-to-water map:
  49 53 8
  0 11 42
  42 0 7
  57 7 4

  water-to-light map:
  88 18 7
  18 25 70

  light-to-temperature map:
  45 77 23
  81 45 19
  68 64 13

  temperature-to-humidity map:
  0 69 1
  1 0 69

  humidity-to-location map:
  60 56 37
  56 93 4
`);

const categoryOrder = {
  seed: 0,
  soil: 1,
  fertilizer: 2,
  water: 3,
  light: 4,
  temperature: 5,
  humidity: 6,
  location: 7,
};

type CategoryName =
  | "seed"
  | "soil"
  | "fertilizer"
  | "water"
  | "light"
  | "temperature"
  | "humidity"
  | "location";

type Range = {
  rangeStart: number;
  rangeContains: number;
};

type Map = {
  from: CategoryName;
  to: CategoryName;
  mapEntries: MapEntry[];
};

type MapEntry = {
  source: Range;
  destination: Range;
};

const parseMap = (input: string): Map => {
  const lines = input.split("\n").map((line) => line.trim());
  const name = lines[0]!.split(" ")[0]!;
  const from = name.split("-to-")[0]! as CategoryName;
  const to = name.split("-to-")[1]! as CategoryName;
  const mapsLines = lines.slice(1);
  const mapEntries: MapEntry[] = [];
  for (const mapLine of mapsLines) {
    const [destinationRangeStart, sourceRangeStart, rangesContain] =
      mapLine.split(" ");
    mapEntries.push({
      destination: {
        rangeStart: parseInt(destinationRangeStart!),
        rangeContains: parseInt(rangesContain!),
      },
      source: {
        rangeStart: parseInt(sourceRangeStart!),
        rangeContains: parseInt(rangesContain!),
      },
    });
  }
  return {
    from,
    to,
    mapEntries: mapEntries,
  };
};
it("parses map", () => {
  const input = dedent(`
    soil-to-fertilizer map:
    0 15 37
    37 52 2
    39 0 15
  `);
  const result = parseMap(input);
  expect(result).toEqual({
    from: "soil",
    to: "fertilizer",
    mapEntries: [
      {
        destination: { rangeStart: 0, rangeContains: 37 },
        source: { rangeStart: 15, rangeContains: 37 },
      },
      {
        destination: { rangeStart: 37, rangeContains: 2 },
        source: { rangeStart: 52, rangeContains: 2 },
      },
      {
        destination: { rangeStart: 39, rangeContains: 15 },
        source: { rangeStart: 0, rangeContains: 15 },
      },
    ],
  });
});

const parseInput = (
  input: string
): {
  seeds: Range[];
  maps: MapEntry[];
} => {
  const lines = input.split("\n").map((line) => line.trim());
  const seedLine = lines.find((line) => line.startsWith("seeds:"));
  const seedLineParts = seedLine!.split(" ");
  const seeds = seedLineParts
    .slice(1)
    .map((part) => parseInt(part))
    .reduce((ranges, seed, i) => {
      if (i % 2 === 0) {
        ranges.push({ rangeStart: seed, rangeContains: 0 });
      } else {
        ranges[ranges.length - 1]!.rangeContains = seed;
      }
      return ranges;
    }, [] as Range[]);

  const mapsLines = lines.filter((line) => line.endsWith("map:"));
  const maps = mapsLines
    .map((mapLine, i) => {
      const nextMapLine = mapsLines[i + 1];
      const mapLines = lines
        .slice(
          lines.indexOf(mapLine),
          nextMapLine ? lines.indexOf(nextMapLine) : lines.length
        )
        .filter(Boolean);
      // console.log({ mapLines });
      return parseMap(mapLines.join("\n"));
    })
    .flat();

  return {
    seeds,
    maps,
  };
};
it("parses input", () => {
  const result = parseInput(sampleInput);
  // console.log(JSON.stringify(result, null, 2));
  expect(result).toMatchInlineSnapshot(`
    {
      "maps": [
        {
          "from": "seed",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 2,
                "rangeStart": 50,
              },
              "source": {
                "rangeContains": 2,
                "rangeStart": 98,
              },
            },
            {
              "destination": {
                "rangeContains": 48,
                "rangeStart": 52,
              },
              "source": {
                "rangeContains": 48,
                "rangeStart": 50,
              },
            },
          ],
          "to": "soil",
        },
        {
          "from": "soil",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 37,
                "rangeStart": 0,
              },
              "source": {
                "rangeContains": 37,
                "rangeStart": 15,
              },
            },
            {
              "destination": {
                "rangeContains": 2,
                "rangeStart": 37,
              },
              "source": {
                "rangeContains": 2,
                "rangeStart": 52,
              },
            },
            {
              "destination": {
                "rangeContains": 15,
                "rangeStart": 39,
              },
              "source": {
                "rangeContains": 15,
                "rangeStart": 0,
              },
            },
          ],
          "to": "fertilizer",
        },
        {
          "from": "fertilizer",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 8,
                "rangeStart": 49,
              },
              "source": {
                "rangeContains": 8,
                "rangeStart": 53,
              },
            },
            {
              "destination": {
                "rangeContains": 42,
                "rangeStart": 0,
              },
              "source": {
                "rangeContains": 42,
                "rangeStart": 11,
              },
            },
            {
              "destination": {
                "rangeContains": 7,
                "rangeStart": 42,
              },
              "source": {
                "rangeContains": 7,
                "rangeStart": 0,
              },
            },
            {
              "destination": {
                "rangeContains": 4,
                "rangeStart": 57,
              },
              "source": {
                "rangeContains": 4,
                "rangeStart": 7,
              },
            },
          ],
          "to": "water",
        },
        {
          "from": "water",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 7,
                "rangeStart": 88,
              },
              "source": {
                "rangeContains": 7,
                "rangeStart": 18,
              },
            },
            {
              "destination": {
                "rangeContains": 70,
                "rangeStart": 18,
              },
              "source": {
                "rangeContains": 70,
                "rangeStart": 25,
              },
            },
          ],
          "to": "light",
        },
        {
          "from": "light",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 23,
                "rangeStart": 45,
              },
              "source": {
                "rangeContains": 23,
                "rangeStart": 77,
              },
            },
            {
              "destination": {
                "rangeContains": 19,
                "rangeStart": 81,
              },
              "source": {
                "rangeContains": 19,
                "rangeStart": 45,
              },
            },
            {
              "destination": {
                "rangeContains": 13,
                "rangeStart": 68,
              },
              "source": {
                "rangeContains": 13,
                "rangeStart": 64,
              },
            },
          ],
          "to": "temperature",
        },
        {
          "from": "temperature",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 1,
                "rangeStart": 0,
              },
              "source": {
                "rangeContains": 1,
                "rangeStart": 69,
              },
            },
            {
              "destination": {
                "rangeContains": 69,
                "rangeStart": 1,
              },
              "source": {
                "rangeContains": 69,
                "rangeStart": 0,
              },
            },
          ],
          "to": "humidity",
        },
        {
          "from": "humidity",
          "mapEntries": [
            {
              "destination": {
                "rangeContains": 37,
                "rangeStart": 60,
              },
              "source": {
                "rangeContains": 37,
                "rangeStart": 56,
              },
            },
            {
              "destination": {
                "rangeContains": 4,
                "rangeStart": 56,
              },
              "source": {
                "rangeContains": 4,
                "rangeStart": 93,
              },
            },
          ],
          "to": "location",
        },
      ],
      "seeds": [
        {
          "rangeContains": 14,
          "rangeStart": 79,
        },
        {
          "rangeContains": 13,
          "rangeStart": 55,
        },
      ],
    }
  `);
});

type Step = {
  narrowedSource: Range;
  originalSource: Range;
  narrowedDestination: Range;
  originalDestination: Range;
};

type Path = Step[];

const rangesOverlap = (a: Range, b: Range): Range | false => {
  const rangeAStart = a.rangeStart;
  const rangeAEnd = a.rangeStart + a.rangeContains - 1;
  const rangeBStart = b.rangeStart;
  const rangeBEnd = b.rangeStart + b.rangeContains - 1;
  const rangeStart = Math.max(rangeAStart, rangeBStart);
  const rangeEnd = Math.min(rangeAEnd, rangeBEnd);

  if (rangeStart <= rangeEnd) {
    return {
      rangeStart,
      rangeContains: rangeEnd - rangeStart + 1,
    };
  }
  return false;
};
it("checks if ranges overlap", () => {
  expect(
    rangesOverlap(
      { rangeStart: 1, rangeContains: 2 },
      { rangeStart: 2, rangeContains: 2 }
    )
  ).toEqual({ rangeStart: 2, rangeContains: 1 });

  expect(
    rangesOverlap(
      { rangeStart: 1, rangeContains: 4 }, // 1 2 3 4
      { rangeStart: 2, rangeContains: 2 } //    2 3
    )
  ).toEqual({ rangeStart: 2, rangeContains: 2 });

  expect(
    rangesOverlap(
      { rangeStart: 2, rangeContains: 4 }, //   2 3 4 5
      { rangeStart: 1, rangeContains: 3 } //  1 2 3
    )
  ).toEqual({ rangeStart: 2, rangeContains: 2 });

  expect(
    rangesOverlap(
      { rangeStart: 7, rangeContains: 3 }, //         7 8 9
      { rangeStart: 3, rangeContains: 6 } //  3 4 5 6 7 8
    )
  ).toEqual({ rangeStart: 7, rangeContains: 2 });

  expect(
    rangesOverlap(
      { rangeStart: 1, rangeContains: 2 },
      { rangeStart: 3, rangeContains: 2 }
    )
  ).toEqual(false);
});

const findRangePaths = (seedRanges: Range[], maps: Map[]): Path[] => {
  const paths: Path[] = [];
  for (const seedRange of seedRanges) {
    for (const map of maps) {
      for (const mapEntry of map.mapEntries) {
        const steps: Step[] = [];
        // console.log({ seedRange, map });
        const commonSourceRange = rangesOverlap(seedRange, mapEntry.source);
        if (!commonSourceRange) {
          continue;
        }
        // console.log({ commonSourceRange, seedRange });
        const diff =
          mapEntry.source.rangeStart - mapEntry.destination.rangeStart;
        steps.push({
          narrowedSource: commonSourceRange,
          originalSource: seedRange,
          narrowedDestination: {
            rangeStart: commonSourceRange.rangeStart - diff,
            rangeContains: commonSourceRange.rangeContains,
          },
          originalDestination: mapEntry.destination,
        });
        paths.push(steps);
      }
    }
  }
  return paths;
};
it("finds range paths for one seed range two maps on the same level", () => {
  const seeds: Range[] = [
    { rangeStart: 1, rangeContains: 3 }, // 1 2 3
  ];
  const maps: Map[] = [
    {
      from: "seed",
      to: "soil",
      mapEntries: [
        {
          destination: { rangeStart: 2, rangeContains: 2 },
          source: { rangeStart: 1, rangeContains: 2 }, // 1 2 >> 2 3
        },
        {
          destination: { rangeStart: 1, rangeContains: 1 },
          source: { rangeStart: 3, rangeContains: 1 }, // 3 >> 1
        },
      ],
    },
  ];
  const result = findRangePaths(seeds, maps);
  expect(result).toEqual([
    [
      {
        originalSource: { rangeStart: 1, rangeContains: 3 }, // 1 2 3
        narrowedSource: { rangeStart: 1, rangeContains: 2 }, // 1 2

        originalDestination: { rangeStart: 2, rangeContains: 2 }, // 2 3
        narrowedDestination: { rangeStart: 2, rangeContains: 2 }, // 2 3
      },
    ],
    [
      {
        originalSource: { rangeStart: 1, rangeContains: 3 }, // 1 2 3
        narrowedSource: { rangeStart: 3, rangeContains: 1 }, // 3

        originalDestination: { rangeStart: 1, rangeContains: 1 }, // 1
        narrowedDestination: { rangeStart: 1, rangeContains: 1 }, // 1
      },
    ],
  ] satisfies Path[]);
});
it("finds range paths for two seed ranges two maps on the same level", () => {
  const seeds: Range[] = [
    { rangeStart: 1, rangeContains: 3 }, // 1 2 3
    { rangeStart: 7, rangeContains: 3 }, // 7 8 9
  ];
  const maps: Map[] = [
    {
      from: "seed",
      to: "soil",
      mapEntries: [
        {
          destination: { rangeStart: 2, rangeContains: 2 },
          source: { rangeStart: 1, rangeContains: 2 }, // 1 2 >> 2 3
        },
        {
          destination: { rangeStart: 1, rangeContains: 6 },
          source: { rangeStart: 3, rangeContains: 6 }, // 3 4 5 6 7 8 >> 1 2 3 4 5 6
        },
      ],
    },
  ];
  const result = findRangePaths(seeds, maps);
  expect(result).toEqual([
    [
      {
        originalSource: { rangeStart: 1, rangeContains: 3 }, // 1 2 3
        narrowedSource: { rangeStart: 1, rangeContains: 2 }, // 1 2

        originalDestination: { rangeStart: 2, rangeContains: 2 }, // 2 3
        narrowedDestination: { rangeStart: 2, rangeContains: 2 }, // 2 3
      },
    ],
    [
      {
        originalSource: { rangeStart: 1, rangeContains: 3 }, // 1 2 3
        narrowedSource: { rangeStart: 3, rangeContains: 1 }, // 3

        originalDestination: { rangeStart: 1, rangeContains: 6 }, // 1 2 3 4 5 6
        narrowedDestination: { rangeStart: 1, rangeContains: 1 }, // 1
      },
    ],
    [
      {
        originalSource: { rangeStart: 7, rangeContains: 3 }, // 7 8 9
        narrowedSource: { rangeStart: 7, rangeContains: 2 }, // 7 8

        originalDestination: { rangeStart: 1, rangeContains: 6 }, // 1 2 3 4 5 6
        narrowedDestination: { rangeStart: 5, rangeContains: 2 }, // 5 6
      },
    ],
  ] satisfies Path[]);
});
it("finds range paths for a seed range and two maps on different levels", () => {
  // TODO: need to implement code to pass this test, probably by adding recursion around findRangePaths()

  const seeds: Range[] = [
    { rangeStart: 1, rangeContains: 3 }, // 1 2 3
  ];
  const maps: Map[] = [
    {
      from: "seed",
      to: "soil",
      mapEntries: [
        {
          destination: { rangeStart: 5, rangeContains: 2 },
          source: { rangeStart: 1, rangeContains: 2 }, // 1 2 >> 5 6
        },
      ],
    },
    {
      from: "soil",
      to: "fertilizer",
      mapEntries: [
        {
          destination: { rangeStart: 2, rangeContains: 2 },
          source: { rangeStart: 4, rangeContains: 2 }, // 4 5 >> 2 3
        },
      ],
    },
  ];
  const result = findRangePaths(seeds, maps);
  expect(result).toEqual([
    [
      {
        originalSource: { rangeStart: 1, rangeContains: 3 }, // 1 2 3
        narrowedSource: { rangeStart: 1, rangeContains: 2 }, // 1 2

        originalDestination: { rangeStart: 5, rangeContains: 2 }, // 5 6
        narrowedDestination: { rangeStart: 5, rangeContains: 2 }, // 5 6
      },
      {
        originalSource: { rangeStart: 4, rangeContains: 2 }, // 4 5
        narrowedSource: { rangeStart: 5, rangeContains: 1 }, // 5

        originalDestination: { rangeStart: 2, rangeContains: 2 }, // 2 3
        narrowedDestination: { rangeStart: 3, rangeContains: 1 }, // 3
      },
    ],
  ] satisfies Path[]);
});

const main = (input: string) => {
  // const  = parseInput(input);

  return 0;
};

it.skip("works for example input", () => {
  expect(main(sampleInput)).toBe(46);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "5.input.txt"), "utf-8");
  // expect(main(input)).toBe(910845529);
});
