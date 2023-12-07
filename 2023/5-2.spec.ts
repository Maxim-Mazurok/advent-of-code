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

type Range = {
  rangeStart: number;
  rangeContains: number;
};

type Map = {
  name: string;
  source: Range;
  destination: Range;
};

const parseMap = (input: string): Map[] => {
  const lines = input.split("\n").map((line) => line.trim());
  const name = lines[0]!.split(" ")[0]!;
  const mapsLines = lines.slice(1);
  const maps: Map[] = [];
  for (const mapLine of mapsLines) {
    const [destinationRangeStart, sourceRangeStart, rangesContain] =
      mapLine.split(" ");
    maps.push({
      name,
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
  return maps;
};
it("parses map", () => {
  const input = dedent(`
    soil-to-fertilizer map:
    0 15 37
    37 52 2
    39 0 15
  `);
  const result = parseMap(input);
  expect(result).toEqual([
    {
      name: "soil-to-fertilizer",
      destination: { rangeStart: 0, rangeContains: 37 },
      source: { rangeStart: 15, rangeContains: 37 },
    },
    {
      name: "soil-to-fertilizer",
      destination: { rangeStart: 37, rangeContains: 2 },
      source: { rangeStart: 52, rangeContains: 2 },
    },
    {
      name: "soil-to-fertilizer",
      destination: { rangeStart: 39, rangeContains: 15 },
      source: { rangeStart: 0, rangeContains: 15 },
    },
  ]);
});

const parseInput = (
  input: string
): {
  seeds: Range[];
  maps: Map[];
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
  expect(result).toEqual({
    seeds: [
      { rangeStart: 79, rangeContains: 14 },
      { rangeStart: 55, rangeContains: 13 },
    ],
    maps: [
      {
        name: "seed-to-soil",
        destination: { rangeStart: 50, rangeContains: 2 },
        source: { rangeStart: 98, rangeContains: 2 },
      },
      {
        name: "seed-to-soil",
        destination: { rangeStart: 52, rangeContains: 48 },
        source: { rangeStart: 50, rangeContains: 48 },
      },
      {
        name: "soil-to-fertilizer",
        destination: { rangeStart: 0, rangeContains: 37 },
        source: { rangeStart: 15, rangeContains: 37 },
      },
      {
        name: "soil-to-fertilizer",
        destination: { rangeStart: 37, rangeContains: 2 },
        source: { rangeStart: 52, rangeContains: 2 },
      },
      {
        name: "soil-to-fertilizer",
        destination: { rangeStart: 39, rangeContains: 15 },
        source: { rangeStart: 0, rangeContains: 15 },
      },
      {
        name: "fertilizer-to-water",
        destination: { rangeStart: 49, rangeContains: 8 },
        source: { rangeStart: 53, rangeContains: 8 },
      },
      {
        name: "fertilizer-to-water",
        destination: { rangeStart: 0, rangeContains: 42 },
        source: { rangeStart: 11, rangeContains: 42 },
      },
      {
        name: "fertilizer-to-water",
        destination: { rangeStart: 42, rangeContains: 7 },
        source: { rangeStart: 0, rangeContains: 7 },
      },
      {
        name: "fertilizer-to-water",
        destination: { rangeStart: 57, rangeContains: 4 },
        source: { rangeStart: 7, rangeContains: 4 },
      },
      {
        name: "water-to-light",
        destination: { rangeStart: 88, rangeContains: 7 },
        source: { rangeStart: 18, rangeContains: 7 },
      },
      {
        name: "water-to-light",
        destination: { rangeStart: 18, rangeContains: 70 },
        source: { rangeStart: 25, rangeContains: 70 },
      },
      {
        name: "light-to-temperature",
        destination: { rangeStart: 45, rangeContains: 23 },
        source: { rangeStart: 77, rangeContains: 23 },
      },
      {
        name: "light-to-temperature",
        destination: { rangeStart: 81, rangeContains: 19 },
        source: { rangeStart: 45, rangeContains: 19 },
      },
      {
        name: "light-to-temperature",
        destination: { rangeStart: 68, rangeContains: 13 },
        source: { rangeStart: 64, rangeContains: 13 },
      },
      {
        name: "temperature-to-humidity",
        destination: { rangeStart: 0, rangeContains: 1 },
        source: { rangeStart: 69, rangeContains: 1 },
      },
      {
        name: "temperature-to-humidity",
        destination: { rangeStart: 1, rangeContains: 69 },
        source: { rangeStart: 0, rangeContains: 69 },
      },
      {
        name: "humidity-to-location",
        destination: { rangeStart: 60, rangeContains: 37 },
        source: { rangeStart: 56, rangeContains: 37 },
      },
      {
        name: "humidity-to-location",
        destination: { rangeStart: 56, rangeContains: 4 },
        source: { rangeStart: 93, rangeContains: 4 },
      },
    ],
  });
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
      // console.log({ seedRange, map });
      const commonSourceRange = rangesOverlap(seedRange, map.source);
      if (!commonSourceRange) {
        continue;
      }
      // console.log({ commonSourceRange, seedRange });
      const diff = map.source.rangeStart - map.destination.rangeStart;
      paths.push([
        {
          narrowedSource: commonSourceRange,
          originalSource: seedRange,
          narrowedDestination: {
            rangeStart: commonSourceRange.rangeStart - diff,
            rangeContains: commonSourceRange.rangeContains,
          },
          originalDestination: map.destination,
        },
      ]);
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
      name: "seed-to-soil",
      destination: { rangeStart: 2, rangeContains: 2 },
      source: { rangeStart: 1, rangeContains: 2 }, // 1 2 >> 2 3
    },
    {
      name: "seed-to-soil",
      destination: { rangeStart: 1, rangeContains: 1 },
      source: { rangeStart: 3, rangeContains: 1 }, // 3 >> 1
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
      name: "seed-to-soil",
      destination: { rangeStart: 2, rangeContains: 2 },
      source: { rangeStart: 1, rangeContains: 2 }, // 1 2 >> 2 3
    },
    {
      name: "seed-to-soil",
      destination: { rangeStart: 1, rangeContains: 6 },
      source: { rangeStart: 3, rangeContains: 6 }, // 3 4 5 6 7 8 >> 1 2 3 4 5 6
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
