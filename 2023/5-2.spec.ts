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

const createMaps = (
  data: {
    destinationRangeStart: number;
    sourceRangeStart: number;
    bothRangesLength: number;
  }[],
  doFillInTheGaps = true
) => {
  const maps: {
    rangeStart: number;
    rangeEnd: number;
    valueDifference: number;
  }[] = [];
  console.table(data);
  for (const {
    destinationRangeStart,
    sourceRangeStart,
    bothRangesLength,
  } of data) {
    maps.push({
      rangeStart: destinationRangeStart,
      rangeEnd: destinationRangeStart + bothRangesLength - 1,
      valueDifference: sourceRangeStart - destinationRangeStart,
    });
  }
  return doFillInTheGaps ? fillInTheGaps(maps) : maps;
};
it("creates a map", () => {
  const map = createMaps([
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
  // expect(map).toMatchInlineSnapshot(`
  //   [
  //     {
  //       "rangeEnd": 49,
  //       "rangeStart": 0,
  //       "valueDifference": 0,
  //     },
  //     {
  //       "rangeEnd": 51,
  //       "rangeStart": 50,
  //       "valueDifference": 48,
  //     },
  //     {
  //       "rangeEnd": 99,
  //       "rangeStart": 52,
  //       "valueDifference": -2,
  //     },
  //     {
  //       "rangeEnd": 52,
  //       "rangeStart": 51,
  //       "valueDifference": 0,
  //     },
  //     {
  //       "rangeEnd": Infinity,
  //       "rangeStart": 100,
  //       "valueDifference": 0,
  //     },
  //   ]
  // `);

  const maps2 = [
    {
      destinationRangeStart: 0,
      sourceRangeStart: 69,
      bothRangesLength: 1,
    },
    {
      destinationRangeStart: 1,
      sourceRangeStart: 0,
      bothRangesLength: 69,
    },
  ];
  const result2 = createMaps(maps2);
  console.table(result2);
  expect(result2).toMatchInlineSnapshot(`
        [
          {
            "rangeEnd": 68,
            "rangeStart": 0,
            "valueDifference": 1,
          },
          {
            "rangeEnd": 69,
            "rangeStart": 69,
            "valueDifference": -69,
          },
          {
            "rangeEnd": Infinity,
            "rangeStart": 70,
            "valueDifference": 0,
          },          
        ]
      `);
});
/**

1 2 3 4 5 6 7 8 9 // range of seeds: 1-9
1 2 3 7 8 9 4 5 6 // seed-to-humidity: 1-3 -> 0, 4-6 -> +2, 7-9 -> -3
                                       1-3       6-8        4-6
                  // humidity-to-location: 1-5 -> +5, 6-9 -> -5

0+5
0-5
2+5
2-5
-3+5
-3-5

*/

const parseInput = (input: string) => {
  const lines = input.split("\n");
  const seedDatums = lines[0]!.split(": ")[1]!.split(" ").map(Number);
  const seedRanges = [];
  for (let i = 0; i < seedDatums.length; i += 2) {
    seedRanges.push({
      seedStart: seedDatums[i]!,
      seedRangeLength: seedDatums[i + 1]!,
    });
  }

  const maps: {
    from: string;
    to: string;
    maps: {
      rangeStart: number;
      rangeEnd: number;
      valueDifference: number;
    }[];
  }[] = [];

  maps.push({
    from: "heaven",
    to: "seed",
    maps: createMaps(
      seedRanges.map((seedRange) => ({
        destinationRangeStart: seedRange.seedStart,
        sourceRangeStart: seedRange.seedStart,
        bothRangesLength: seedRange.seedRangeLength,
      })),
      false
    ),
  });
  // console.log(
  //   "AAA!!!",
  //   createMaps(
  //     seedRanges.map((seedRange) => ({
  //       destinationRangeStart: seedRange.seedStart,
  //       sourceRangeStart: seedRange.seedStart,
  //       bothRangesLength: seedRange.seedRangeLength,
  //     })),
  //     false
  //   )
  // );

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
      maps: createMaps(mapData),
    });
  }

  return {
    seedRanges,
    maps,
  };
};

const seedCanBePlanted = (
  seedRangeStart: number,
  seedRangeEnd: number,
  plantMaps: {
    rangeStart: number;
    rangeEnd: number;
    valueDifference: number;
  }[]
): boolean => {
  for (const plantMap of plantMaps) {
    if (
      seedRangeStart >= plantMap.rangeStart &&
      seedRangeEnd <= plantMap.rangeEnd
    ) {
      return true;
    }
  }
  return false;
};
it.skip("seedCanBePlanted works", () => {
  const plantMaps = [
    {
      rangeStart: 50,
      rangeEnd: 100,
      valueDifference: 48,
    },
  ];
  expect(seedCanBePlanted(1, 3, plantMaps)).toBe(true);
});

const fillInTheGaps = (
  maps: {
    rangeStart: number;
    rangeEnd: number;
    valueDifference: number;
  }[]
) => {
  if (maps.length === 0) {
    return [
      {
        rangeStart: 0,
        rangeEnd: Infinity,
        valueDifference: 0,
      },
    ];
  }

  let newMaps = [...maps];
  const sortedMaps = [...newMaps.sort((a, b) => a.rangeStart - b.rangeStart)];
  console.log("rangeStart:", sortedMaps[0]!.rangeStart);
  if (sortedMaps[0]!.rangeStart !== 0) {
    newMaps = [
      {
        rangeStart: 0,
        rangeEnd: sortedMaps[0]!.rangeStart - 1,
        valueDifference: 0,
      },
      ...newMaps,
    ];
  }
  for (let i = 0; i < sortedMaps.length - 1; i++) {
    const map = sortedMaps[i]!;
    const nextMap = sortedMaps[i + 1]!;
    if (map.rangeEnd + 1 !== nextMap.rangeStart) {
      newMaps.push({
        rangeStart: map.rangeEnd,
        rangeEnd: nextMap.rangeStart,
        valueDifference: 0,
      });
    }
  }
  newMaps.push({
    rangeStart: sortedMaps[sortedMaps.length - 1]!.rangeEnd + 1,
    rangeEnd: Infinity,
    valueDifference: 0,
  });
  // console.log(newMaps);

  return newMaps;
};
it("fillInTheGaps works", () => {
  const maps = [
    {
      rangeStart: 50,
      rangeEnd: 100,
      valueDifference: 48,
    },
  ];
  expect(fillInTheGaps(maps)).toMatchInlineSnapshot(`
    [
      {
        "rangeEnd": 49,
        "rangeStart": 0,
        "valueDifference": 0,
      },
      {
        "rangeEnd": 100,
        "rangeStart": 50,
        "valueDifference": 48,
      },
      {
        "rangeEnd": Infinity,
        "rangeStart": 101,
        "valueDifference": 0,
      },
    ]
  `);
});

const resolvedCache = new Map<string, number>();
const resolveValue = (
  maps: Map<
    string,
    {
      to: string;
      map: (value: number) => number;
    }
  >,
  value: number,
  from: string,
  to: string
): number => {
  if (from === to) {
    return value;
  }

  if (resolvedCache.has(`${from}->${to}:${value}`)) {
    console.log(`Cache hit ${from}->${to}:${value}`);
    return resolvedCache.get(`${from}->${to}:${value}`)!;
  }

  const map = maps.get(from);
  if (!map) {
    throw new Error(`No map found for ${from}`);
  }
  if (map.to === to) {
    // console.log(`Map ${from} -> ${to} found: ${map.map(value)}`);
    const resolvedValue = map.map(value);
    resolvedCache.set(`${from}->${to}:${value}`, resolvedValue);
    return resolvedValue;
  }
  // console.log(`Map ${from} -> ${map.to} found: ${map.map(value)}`);
  const resolvedValue = resolveValue(maps, map.map(value), map.to, to);
  resolvedCache.set(`${from}->${map.to}:${value}`, resolvedValue);
  return resolvedValue;
};
it.skip("resolves value", () => {
  const { maps } = parseInput(sampleInput);
  expect(resolveValue(maps, 82, "seed", "soil")).toBe(84);
  expect(resolveValue(maps, 82, "seed", "fertilizer")).toBe(84);
  expect(resolveValue(maps, 82, "seed", "water")).toBe(84);
  expect(resolveValue(maps, 82, "seed", "light")).toBe(77);
  expect(resolveValue(maps, 82, "seed", "temperature")).toBe(45);
  expect(resolveValue(maps, 82, "seed", "humidity")).toBe(46);
  expect(resolveValue(maps, 82, "seed", "location")).toBe(46);
});

type mymap = {
  rangeStart: number;
  rangeEnd: number;
  valueDifference: number;
};
const findPossibleCombos = (_maps1: mymap[], maps2: mymap[]) => {
  const maps1 = _maps1.map((map) => ({
    ...map,
    resultRangeStart: map.rangeStart + map.valueDifference,
    resultRangeEnd: map.rangeEnd + map.valueDifference,
  }));

  console.log({ maps2 });

  const combinedMaps = [];
  for (const maps2Map of maps2) {
    for (const maps1Map of maps1) {
      // console.log({
      //   humidityToLocationMap: maps2Map,
      //   seedsToHumidityResultsMap: maps1Map,
      // });
      const commonRangeStart = Math.max(
        maps2Map.rangeStart,
        maps1Map.resultRangeStart
      );
      const commonRangeEnd = Math.min(
        maps2Map.rangeEnd,
        maps1Map.resultRangeEnd
      );
      console.log({ commonRangeStart, commonRangeEnd });
      if (commonRangeStart > commonRangeEnd) {
        continue;
      }
      const valueDifference =
        maps2Map.valueDifference + maps1Map.valueDifference;

      // if (`${maps1Map.rangeStart}|${maps1Map.rangeEnd}` === "52|100") {
      //   console.log({
      //     maps1Map,
      //     maps2Map,
      //     commonRangeStart,
      //     commonRangeEnd,
      //     valueDifference,
      //   });
      //   throw new Error("AAA");
      // }

      combinedMaps.push({
        sourceRangeStart: commonRangeStart - maps1Map.valueDifference,
        sourceRangeEnd: commonRangeEnd - maps1Map.valueDifference,
        rangeStart: commonRangeStart,
        rangeEnd: commonRangeEnd,
        valueDifference,
        path:
          (maps2Map.path || "") +
          `${maps1Map.resultRangeStart}-${maps1Map.resultRangeEnd}` +
          " ",
      });
    }
  }

  return combinedMaps;
};
it("finds possible combos", () => {
  // const humidityToLocationMaps = [
  //   { rangeStart: 0, rangeEnd: 55, valueDifference: 0 },
  //   { rangeStart: 56, rangeEnd: 60, valueDifference: 37 },
  //   { rangeStart: 60, rangeEnd: 97, valueDifference: -4 },
  //   { rangeStart: 98, rangeEnd: Infinity, valueDifference: 0 },
  // ];
  // const seedsToHumidityMaps = [
  //   { rangeStart: 0, rangeEnd: 1, valueDifference: 69 },
  //   { rangeStart: 1, rangeEnd: 70, valueDifference: -1 },
  //   { rangeStart: 71, rangeEnd: Infinity, valueDifference: 0 },
  // ];
  // const seedsToLocationMaps = [

  // ];

  const seedsMap = [{ rangeStart: 0, rangeEnd: 9, valueDifference: 0 }];
  const humidityToLocationMaps = [
    { rangeStart: 0, rangeEnd: 0, valueDifference: 0 },
    { rangeStart: 1, rangeEnd: 5, valueDifference: 5 },
    { rangeStart: 6, rangeEnd: 9, valueDifference: -5 },
    { rangeStart: 10, rangeEnd: Infinity, valueDifference: 0 },
  ];
  const seedsToHumidityMaps = [
    { rangeStart: 0, rangeEnd: 0, valueDifference: 0 },
    { rangeStart: 1, rangeEnd: 3, valueDifference: 0 },
    { rangeStart: 4, rangeEnd: 6, valueDifference: 2 },
    { rangeStart: 7, rangeEnd: 9, valueDifference: -3 },
    { rangeStart: 10, rangeEnd: Infinity, valueDifference: 0 },
  ];
  /**
  0-0: 0+0
  1-5: 1+0, 2+0, 3+0, 7-3, 8-3
  6-9: 4+2, 5+2, 6+2, 9-3
  10-...: 10+0, ...
   */

  console.table(
    findPossibleCombos(seedsToHumidityMaps, humidityToLocationMaps)
  );

  expect(findPossibleCombos(seedsToHumidityMaps, humidityToLocationMaps))
    .toMatchInlineSnapshot(`
    [
      {
        "path": "0-0 ",
        "rangeEnd": 0,
        "rangeStart": 0,
        "sourceRangeEnd": 0,
        "sourceRangeStart": 0,
        "valueDifference": 0,
      },
      {
        "path": "1-3 ",
        "rangeEnd": 3,
        "rangeStart": 1,
        "sourceRangeEnd": 3,
        "sourceRangeStart": 1,
        "valueDifference": 5,
      },
      {
        "path": "4-6 ",
        "rangeEnd": 5,
        "rangeStart": 4,
        "sourceRangeEnd": 8,
        "sourceRangeStart": 7,
        "valueDifference": 2,
      },
      {
        "path": "6-8 ",
        "rangeEnd": 8,
        "rangeStart": 6,
        "sourceRangeEnd": 6,
        "sourceRangeStart": 4,
        "valueDifference": -3,
      },
      {
        "path": "4-6 ",
        "rangeEnd": 6,
        "rangeStart": 6,
        "sourceRangeEnd": 9,
        "sourceRangeStart": 9,
        "valueDifference": -8,
      },
      {
        "path": "10-Infinity ",
        "rangeEnd": Infinity,
        "rangeStart": 10,
        "sourceRangeEnd": Infinity,
        "sourceRangeStart": 10,
        "valueDifference": 0,
      },
    ]
  `);

  // const seedsToHumidityResultsMaps = seedsToHumidityMaps.map((map) => ({
  //   ...map,
  //   resultRangeStart: map.sourceRangeStart + map.valueDifference,
  //   resultRangeEnd: map.sourceRangeEnd + map.valueDifference,
  // }));
  // console.table(seedsToHumidityResultsMaps);

  // const combinedMaps = [];
  // for (const humidityToLocationMap of humidityToLocationMaps) {
  //   for (const seedsToHumidityResultsMap of seedsToHumidityResultsMaps) {
  //     console.log({ humidityToLocationMap, seedsToHumidityResultsMap });
  //     const commonRangeStart = Math.max(
  //       humidityToLocationMap.sourceRangeStart,
  //       seedsToHumidityResultsMap.resultRangeStart
  //     );
  //     const commonRangeEnd = Math.min(
  //       humidityToLocationMap.sourceRangeEnd,
  //       seedsToHumidityResultsMap.resultRangeEnd
  //     );
  //     console.log({ commonRangeStart, commonRangeEnd });
  //     if (commonRangeStart > commonRangeEnd) {
  //       continue;
  //     }
  //     const valueDifference =
  //       humidityToLocationMap.valueDifference +
  //       seedsToHumidityResultsMap.valueDifference;
  //     combinedMaps.push({
  //       sourceRangeStart:
  //         commonRangeStart - seedsToHumidityResultsMap.valueDifference,
  //       sourceRangeEnd:
  //         commonRangeEnd - seedsToHumidityResultsMap.valueDifference,
  //       rangeStart: commonRangeStart,
  //       rangeEnd: commonRangeEnd,
  //       valueDifference,
  //     });
  //   }
  // }
  // console.table(combinedMaps);
});
it.only("finds possible combos 2", () => {
  const seedsMap = createMaps(
    [
      {
        destinationRangeStart: 79,
        sourceRangeStart: 79,
        bothRangesLength: 14,
      },
      {
        destinationRangeStart: 55,
        sourceRangeStart: 55,
        bothRangesLength: 13,
      },
    ],
    false
  );
  console.table(seedsMap);
  const seedToSoilMaps = createMaps([
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

  // console.table(
  //   findPossibleCombos(seedsMap, seedToSoilMaps).sort(
  //     (a, b) => a.sourceRangeStart - b.sourceRangeStart
  //   )
  // );
  // expect(
  //   findPossibleCombos(seedsMap, seedToSoilMaps).sort(
  //     (a, b) => a.sourceRangeStart - b.sourceRangeStart
  //   )
  // ).toMatchSnapshot();

  const soilToFertilizerMaps = createMaps([
    {
      destinationRangeStart: 0,
      sourceRangeStart: 15,
      bothRangesLength: 37,
    },
    {
      destinationRangeStart: 37,
      sourceRangeStart: 52,
      bothRangesLength: 2,
    },
    {
      destinationRangeStart: 39,
      sourceRangeStart: 0,
      bothRangesLength: 15,
    },
  ]);

  // console.table(
  //   findPossibleCombos(seedToSoilMaps, soilToFertilizerMaps).sort(
  //     (a, b) => a.sourceRangeStart - b.sourceRangeStart
  //   )
  // );
  // return;

  const fertilizerToWaterMaps = createMaps([
    {
      destinationRangeStart: 49,
      sourceRangeStart: 53,
      bothRangesLength: 8,
    },
    {
      destinationRangeStart: 0,
      sourceRangeStart: 11,
      bothRangesLength: 42,
    },
    {
      destinationRangeStart: 42,
      sourceRangeStart: 0,
      bothRangesLength: 7,
    },
    {
      destinationRangeStart: 57,
      sourceRangeStart: 7,
      bothRangesLength: 4,
    },
  ]);

  const waterToLightMaps = createMaps([
    {
      destinationRangeStart: 88,
      sourceRangeStart: 18,
      bothRangesLength: 7,
    },
    {
      destinationRangeStart: 18,
      sourceRangeStart: 25,
      bothRangesLength: 70,
    },
  ]);

  const lightToTemperatureMaps = createMaps([
    {
      destinationRangeStart: 45,
      sourceRangeStart: 77,
      bothRangesLength: 23,
    },
    {
      destinationRangeStart: 81,
      sourceRangeStart: 45,
      bothRangesLength: 19,
    },
    {
      destinationRangeStart: 68,
      sourceRangeStart: 64,
      bothRangesLength: 13,
    },
  ]);

  const temperatureToHumidityMaps = createMaps([
    {
      destinationRangeStart: 0,
      sourceRangeStart: 69,
      bothRangesLength: 1,
    },
    {
      destinationRangeStart: 1,
      sourceRangeStart: 0,
      bothRangesLength: 69,
    },
  ]);

  const humidityToLocationMaps = createMaps([
    {
      destinationRangeStart: 60,
      sourceRangeStart: 56,
      bothRangesLength: 37,
    },
    {
      destinationRangeStart: 56,
      sourceRangeStart: 93,
      bothRangesLength: 4,
    },
  ]);

  let allPossibleMapResults = [];
  console.log("Doing temperatureToHumidityMaps and humidityToLocationMaps");
  allPossibleMapResults = findPossibleCombos(
    humidityToLocationMaps,
    temperatureToHumidityMaps
  );
  console.log("Doing temperatureToHumidityMaps and allPossibleMapResults");
  allPossibleMapResults = findPossibleCombos(
    temperatureToHumidityMaps,
    allPossibleMapResults
  );
  // console.log("Doing lightToTemperatureMaps and allPossibleMapResults");
  // console.table(temperatureToHumidityMaps);
  // console.table(lightToTemperatureMaps);
  // allPossibleMapResults = findPossibleCombos(
  //   temperatureToHumidityMaps,
  //   lightToTemperatureMaps
  // );

  console.log("Doing lightToTemperatureMaps and allPossibleMapResults");
  allPossibleMapResults = findPossibleCombos(
    lightToTemperatureMaps,
    allPossibleMapResults
  );

  // console.log("Doing waterToLightMaps and allPossibleMapResults");
  // allPossibleMapResults = findPossibleCombos(
  //   waterToLightMaps,
  //   allPossibleMapResults
  // );
  // console.log("Doing fertilizerToWaterMaps and allPossibleMapResults");
  // allPossibleMapResults = findPossibleCombos(
  //   fertilizerToWaterMaps,
  //   allPossibleMapResults
  // );

  // console.log("Doing soilToFertilizerMaps and allPossibleMapResults");
  // allPossibleMapResults = findPossibleCombos(
  //   soilToFertilizerMaps,
  //   allPossibleMapResults
  // );

  // console.log("Doing seedToSoilMaps and allPossibleMapResults");
  // allPossibleMapResults = findPossibleCombos(
  //   seedToSoilMaps,
  //   allPossibleMapResults
  // );
  // console.log("Doing seedsMap and allPossibleMapResults");
  // allPossibleMapResults = findPossibleCombos(seedsMap, allPossibleMapResults);

  console.table(
    allPossibleMapResults.sort(
      (a, b) => a.sourceRangeStart - b.sourceRangeStart
    )
  );
});

const main = (input: string) => {
  const { seedRanges, maps } = parseInput(input);

  console.log(maps);

  let allPossibleMapResults = findPossibleCombos(maps[6]!.maps, maps[7]!.maps);
  allPossibleMapResults = findPossibleCombos(
    maps[5]!.maps,
    allPossibleMapResults
  );
  allPossibleMapResults = findPossibleCombos(
    maps[4]!.maps,
    allPossibleMapResults
  );
  allPossibleMapResults = findPossibleCombos(
    maps[3]!.maps,
    allPossibleMapResults
  );
  allPossibleMapResults = findPossibleCombos(
    maps[2]!.maps,
    allPossibleMapResults
  );
  allPossibleMapResults = findPossibleCombos(
    maps[1]!.maps,
    allPossibleMapResults
  );
  allPossibleMapResults = findPossibleCombos(
    maps[0]!.maps,
    allPossibleMapResults
  );
  // for (let i = maps.length - 2; i >= 1; i--) {
  //   // console.log("i", i);
  //   const map = maps[i]!;
  //   console.table(
  //     allPossibleMapResults.sort(
  //       (a, b) => a.sourceRangeStart - b.sourceRangeStart
  //     )
  //   );
  //   allPossibleMapResults = findPossibleCombos(allPossibleMapResults, map.maps);
  // }

  // let allPossibleMapResults = maps[0]!.maps;
  // for (let i = 1; i < maps.length; i++) {
  //   const map = maps[i]!;
  //   console.table(
  //     allPossibleMapResults.sort((a, b) => a.sourceRangeStart - b.sourceRangeStart)
  //   );
  //   allPossibleMapResults = findPossibleCombos(allPossibleMapResults, map.maps);
  // }

  console.table(
    allPossibleMapResults.sort(
      (a, b) => a.sourceRangeStart - b.sourceRangeStart
    )
  );

  // for (const possibleMapResult of allPossibleMapResults) {
  //   for (const seedRange of seedRanges) {
  //     if (
  //       seedRange.seedStart >= possibleMapResult.rangeStart &&
  //       seedRange.seedStart + seedRange.seedRangeLength <=
  //         possibleMapResult.rangeEnd
  //     ) {
  //       return seedRange.seedStart + possibleMapResult.valueDifference;
  //     }
  //   }
  // }

  // console.table(allPossibleMapResults);

  // return minLocation;
};

it("works for example input", () => {
  expect(main(sampleInput)).toBe(46);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "5.input.txt"), "utf-8");
  // expect(main(input)).toBe(910845529);
});
