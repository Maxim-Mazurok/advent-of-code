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

const createMap = (
  data: {
    destinationRangeStart: number;
    sourceRangeStart: number;
    bothRangesLength: number;
  }[]
) => {
  const map = (sourceValue: number) => {
    for (const {
      destinationRangeStart,
      sourceRangeStart,
      bothRangesLength,
    } of data) {
      if (
        sourceValue >= sourceRangeStart &&
        sourceValue < sourceRangeStart + bothRangesLength
      ) {
        return sourceValue - sourceRangeStart + destinationRangeStart;
      }
    }
    // console.log(`No map for ${sourceValue}`);
    return sourceValue;
  };
  return map;
};
it("creates a map function", () => {
  const map = createMap([
    {
      destinationRangeStart: 50,
      sourceRangeStart: 98,
      bothRangesLength: 2,
    },
    {
      destinationRangeStart: 52,
      sourceRangeStart: 50,
      bothRangesLength: 48,
    },
  ]);
  expect(map(0)).toBe(0);
  expect(map(1)).toBe(1);
  // ...
  expect(map(48)).toBe(48);
  expect(map(49)).toBe(49);
  expect(map(50)).toBe(52);
  expect(map(51)).toBe(53);
  // ...
  expect(map(96)).toBe(98);
  expect(map(97)).toBe(99);
  expect(map(98)).toBe(50);
  expect(map(99)).toBe(51);
});

const parseInput = (input: string) => {
  const lines = input.split("\n");
  const seeds = lines[0]!.split(": ")[1]!.split(" ").map(Number);
  const maps = [];

  const mapLines = lines.slice(1).join("\n").split("\n\n");
  for (const mapLine of mapLines) {
    const mapLines = mapLine.split("\n").filter(Boolean);
    const from = mapLines[0]!.split("-to-")[0]!.split(" ")[0]!;
    const to = mapLines[0]!.split("-to-")[1]!.split(" ")[0]!;
    const mapData = mapLines.slice(1).map((line) => ({
      destinationRangeStart: Number(line.split(" ")[0]!),
      sourceRangeStart: Number(line.split(" ")[1]!),
      bothRangesLength: Number(line.split(" ")[2]!),
    }));
    maps.push({
      from,
      to,
      map: createMap(mapData),
    });
  }

  return {
    seeds,
    maps,
  };
};

const resolveValue = (
  maps: {
    from: string;
    to: string;
    map: (value: number) => number;
  }[],
  value: number,
  from: string,
  to: string
): number => {
  if (from === to) {
    return value;
  }
  const map = maps.find((map) => map.from === from)!;
  if (map.to === to) {
    // console.log(`Map ${from} -> ${to} found: ${map.map(value)}`);
    return map.map(value);
  }
  // console.log(`Map ${from} -> ${map.to} found: ${map.map(value)}`);
  return resolveValue(maps, map.map(value), map.to, to);
};
it("resolves value", () => {
  const { maps } = parseInput(sampleInput);
  expect(resolveValue(maps, 79, "seed", "soil")).toBe(81);
  expect(resolveValue(maps, 14, "seed", "soil")).toBe(14);
  expect(resolveValue(maps, 55, "seed", "soil")).toBe(57);
  expect(resolveValue(maps, 13, "seed", "soil")).toBe(13);

  expect(resolveValue(maps, 79, "seed", "fertilizer")).toBe(81);
  expect(resolveValue(maps, 14, "seed", "fertilizer")).toBe(53);
  expect(resolveValue(maps, 55, "seed", "fertilizer")).toBe(57);
  expect(resolveValue(maps, 13, "seed", "fertilizer")).toBe(52);

  expect(resolveValue(maps, 79, "seed", "water")).toBe(81);
  expect(resolveValue(maps, 14, "seed", "water")).toBe(49);
  expect(resolveValue(maps, 55, "seed", "water")).toBe(53);
  expect(resolveValue(maps, 13, "seed", "water")).toBe(41);

  expect(resolveValue(maps, 79, "seed", "light")).toBe(74);
  expect(resolveValue(maps, 14, "seed", "light")).toBe(42);
  expect(resolveValue(maps, 55, "seed", "light")).toBe(46);
  expect(resolveValue(maps, 13, "seed", "light")).toBe(34);

  expect(resolveValue(maps, 79, "seed", "temperature")).toBe(78);
  expect(resolveValue(maps, 14, "seed", "temperature")).toBe(42);
  expect(resolveValue(maps, 55, "seed", "temperature")).toBe(82);
  expect(resolveValue(maps, 13, "seed", "temperature")).toBe(34);

  expect(resolveValue(maps, 79, "seed", "humidity")).toBe(78);
  expect(resolveValue(maps, 14, "seed", "humidity")).toBe(43);
  expect(resolveValue(maps, 55, "seed", "humidity")).toBe(82);
  expect(resolveValue(maps, 13, "seed", "humidity")).toBe(35);

  expect(resolveValue(maps, 79, "seed", "location")).toBe(82);
  expect(resolveValue(maps, 14, "seed", "location")).toBe(43);
  expect(resolveValue(maps, 55, "seed", "location")).toBe(86);
  expect(resolveValue(maps, 13, "seed", "location")).toBe(35);
});

const main = (input: string) => {
  const { seeds, maps } = parseInput(input);

  let minLocation = Infinity;
  for (const seed of seeds) {
    const location = resolveValue(maps, seed, "seed", "location");
    minLocation = Math.min(minLocation, location);
  }

  return minLocation;
};

it("works for example input", () => {
  expect(main(sampleInput)).toBe(35);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(910845529);
});
