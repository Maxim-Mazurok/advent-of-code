export const createMap = (
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

export const parseInput = (input: string) => {
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

export const resolveValue = (
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

// let total = 0;

export function* allSeeds(seeds: number[]) {
  for (let i = 0; i < seeds.length; i += 2) {
    const start = seeds[i]!;
    const amount = seeds[i + 1]!;
    // total += amount;
    // console.log(`Seeds range: ${seeds[i]!} - ${seeds[i]! + seeds[i + 1]!}`);
    for (let s = start; s < start + amount; s++) {
      yield s;
    }
  }
}

export const main = (input: string) => {
  const { seeds, maps } = parseInput(input);

  const totalSeeds = 2_510_890_762;
  let timeSpentMS = 0;
  const startTime = Date.now();

  let minLocation = Infinity;
  let seedsChecked = 0;
  for (const seed of allSeeds(seeds)) {
    seedsChecked++;
    timeSpentMS = Date.now() - startTime;

    if (seedsChecked % 1_000_000 === 0) {
      console.log(
        `Seeds per minute: ${seedsChecked / (timeSpentMS / 1000 / 60)}`
      );
      console.log(
        `Minutes remaining: ${
          (totalSeeds - seedsChecked) /
          (seedsChecked / (timeSpentMS / 1000 / 60))
        }`
      );
      console.log(`Progress in %: ${(seedsChecked / totalSeeds) * 100}`);
    }

    const location = resolveValue(maps, seed, "seed", "location");
    if (location < minLocation) {
      minLocation = location;
      // console.log(minLocation);
    }
  }

  // console.log({ total });

  // console.log({ seedsNumber: seedsChecked });

  return minLocation;
};
