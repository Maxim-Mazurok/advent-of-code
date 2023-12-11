const Galaxy = "#";
const Space = ".";
type Universe = string[][];

export const parseInput = (input: string): Universe => {
  return input.split("\n").map((line) => line.split(""));
};

export const main = (input: string, expansionFactor = 1_000_000) => {
  const universe = parseInput(input);
  // console.log("input parsed");
  // const expandedUniverse = expandUniverse(universe, expansionFactor);
  // console.log("universe expanded");
  // const galaxies = findAllGalaxies(expandedUniverse);
  const galaxies = findAllGalaxiesInExpandedUniverse(universe, expansionFactor);
  // console.log("galaxies found");
  // console.log(galaxies);
  const pairs = getAllGalaxyPairs(galaxies);
  // console.log("pairs found");
  const pairsWithDistance = getGalaxyPairsWithDistance(pairs);
  // console.log("pairs with distance found");
  // console.log(pairsWithDistance);

  // const seenPairs = new Set<string>();

  // let sum = 0;

  // for (let i = 0; i < pairsWithDistance.length; i++) {
  //   // console.log(
  //   //   pairsWithDistance[i]!.pair[0],
  //   //   pairsWithDistance[i]!.pair[1],
  //   //   pairsWithDistance[i]!.distance
  //   // );
  //   const index1Index2 = `${pairsWithDistance[i]!.pair[0].index}-${
  //     pairsWithDistance[i]!.pair[1].index
  //   }`;
  //   const index2Index1 = `${pairsWithDistance[i]!.pair[1].index}-${
  //     pairsWithDistance[i]!.pair[0].index
  //   }`;
  //   if (seenPairs.has(index1Index2) || seenPairs.has(index2Index1)) {
  //     // console.log("seen");
  //   } else {
  //     sum += pairsWithDistance[i]!.distance;
  //     seenPairs.add(index1Index2);
  //     seenPairs.add(index2Index1);
  //   }
  // }

  // return sum;

  return pairsWithDistance.reduce((acc, pair) => acc + pair.distance, 0);
  // const combinations = getAllPairCombinations(pairsWithDistance);
  // // console.log(JSON.stringify(combinations, null, 2));
  // for (let i = 0; i < combinations.length; i++) {
  //   const combination = combinations[i]!;

  //   const y = combinations.find((otherCombination) => {
  //     return combination.find((pair) =>
  //       otherCombination.find((otherPair) =>
  //         pairOverlaps(pair.pair, otherPair.pair)
  //       )
  //     );
  //   });
  //   if (y) {
  //     console.log(y);
  //   }

  //   printCombination(combinations[i]);
  // }
  // console.log(combinations.length);
  // // const shortestCombination = findShortestCombination(combinations);
  // const sumOfDistances = findSumOfDistances(combinations);
  // return sumOfDistances;
};

export const findSumOfDistances = (combinations: Combination[]): number => {
  return combinations.reduce((acc, combination) => {
    return (
      acc +
      combination.reduce((acc, pair) => {
        return acc + pair.distance;
      }, 0)
    );
  }, 0);
};

export const findShortestCombination = (
  combinations: Combination[]
): number => {
  return Math.min(
    ...combinations.map((combination) => {
      return combination.reduce((acc, pair) => acc + pair.distance, 0);
    })
  );
};

export const renderUniverse = (universe: Universe) => {
  console.log("start");
  console.log(universe.map((row) => row.join("")).join("\n"));
  console.log("end");
};

export const insertEmptyRows = (
  universe: Universe,
  rowIndex: number,
  rowsNumberToInsert: number
): Universe => {
  const emptyRow = Array(universe[rowIndex]!.length).fill(Space);
  const rowsToInsert = Array(rowsNumberToInsert).fill(emptyRow);
  return universe.splice(rowIndex, 0).concat(rowsToInsert);
};

export const insertEmptyColumns = (
  universe: Universe,
  columnIndex: number,
  columnsNumberToInsert: number
): Universe => {
  const columnsToInsert = Array(columnsNumberToInsert).fill(Space);
  return universe.map((row) => {
    return row.splice(columnIndex, 0).concat(columnsToInsert);
  });
};

export const rowHasGalaxies = (
  universe: Universe,
  rowIndex: number
): boolean => {
  const row = universe[rowIndex]!;
  return row.includes(Galaxy);
};

export const columnHasGalaxies = (
  universe: Universe,
  columnIndex: number
): boolean => {
  return universe.some((row) => row[columnIndex] === Galaxy);
};

export type Point = {
  index: number;
  x: number;
  y: number;
};

export const findShortestPathBetween = (
  start: Pick<Point, "x" | "y">,
  end: Pick<Point, "x" | "y">
): number => {
  const distanceY = Math.abs(end.y - start.y);
  const distanceX = Math.abs(end.x - start.x);

  return distanceY + distanceX;
};

export const findAllGalaxiesInExpandedUniverse = (
  originalUniverse: Universe,
  expansionFactor: number
): Point[] => {
  const galaxies: Point[] = [];

  let galaxyIndex = 0;
  // let expandedRowIndex = 0;
  // let expandedColumnIndex = 0;

  const rowsIdsWithNoGalaxies: number[] = [];
  const columnsIdsWithNoGalaxies: number[] = [];

  for (let rowIndex = 0; rowIndex < originalUniverse.length; rowIndex++) {
    if (!rowHasGalaxies(originalUniverse, rowIndex)) {
      rowsIdsWithNoGalaxies.push(rowIndex);
    }
  }
  const rowIndex = 0;
  for (
    let columnIndex = 0;
    columnIndex < originalUniverse[rowIndex]!.length;
    columnIndex++
  ) {
    if (!columnHasGalaxies(originalUniverse, columnIndex)) {
      columnsIdsWithNoGalaxies.push(columnIndex);
    }
  }

  for (let rowIndex = 0; rowIndex < originalUniverse.length; rowIndex++) {
    const row = originalUniverse[rowIndex]!;
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const cell = row[columnIndex]!;
      if (cell === Galaxy) {
        const mappedColumnIndex =
          columnsIdsWithNoGalaxies.filter((x) => x < columnIndex).length *
            (expansionFactor - 1) +
          columnIndex;
        const mappedRowIndex =
          rowsIdsWithNoGalaxies.filter((x) => x < rowIndex).length *
            (expansionFactor - 1) +
          rowIndex;

        galaxies.push({
          index: galaxyIndex++,
          x: mappedColumnIndex,
          y: mappedRowIndex,
        });
      }
    }
  }

  return galaxies;
};

export const findAllGalaxies = (universe: Universe): Point[] => {
  const galaxies: Point[] = [];

  let index = 0;
  universe.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === Galaxy) {
        galaxies.push({
          index: index++,
          x,
          y,
        });
      }
    });
  });

  return galaxies;
};

export const getAllGalaxyPairs = (galaxies: Point[]): [Point, Point][] => {
  const pairs: [Point, Point][] = [];

  galaxies.forEach((galaxy1, index) => {
    // galaxies.forEach((galaxy2) => {
    galaxies.slice(index + 1).forEach((galaxy2) => {
      // if (!pointEquals(galaxy1, galaxy2)) {
      pairs.push([galaxy1, galaxy2]);
      // }
    });
  });

  return pairs;
};

type GalaxyPairWithDistance = {
  pair: [Point, Point];
  distance: number;
};

export const getGalaxyPairsWithDistance = (
  pairs: [Point, Point][]
): GalaxyPairWithDistance[] => {
  return pairs.map((pair) => ({
    pair,
    distance: findShortestPathBetween(pair[0], pair[1]),
  }));
};

type Combination = GalaxyPairWithDistance[];

const pointEquals = (point1: Point, point2: Point) =>
  point1.x === point2.x && point1.y === point2.y;

const pairEquals = (pair1: [Point, Point], pair2: [Point, Point]) =>
  pointEquals(pair1[0], pair2[0]) && pointEquals(pair1[1], pair2[1]);

export const pairOverlaps = (pair1: [Point, Point], pair2: [Point, Point]) =>
  pointEquals(pair1[0], pair2[0]) ||
  pointEquals(pair1[0], pair2[1]) ||
  pointEquals(pair1[1], pair2[0]) ||
  pointEquals(pair1[1], pair2[1]);

export const printCombination = (combination: Combination) => {
  console.log(
    combination
      .map((pair) => pair.pair.map((point) => point.index).join(","))
      .join(" - ")
  );
};

export const getAllPairCombinations = (pairs: GalaxyPairWithDistance[]) => {
  // const combinations: Combination[] = [];

  const seenPairs = new Set<string>();

  const findUniqueCombinations = (
    pairs: GalaxyPairWithDistance[],
    currentCombination: Combination = [],
    index: number = 0,
    combinations: Combination[] = []
  ): Combination[] => {
    if (index === pairs.length) {
      combinations.push(currentCombination);
      return combinations;
    }

    const currentPair = pairs[index]!;

    if (
      !currentCombination.find((pair) =>
        pairOverlaps(pair.pair, currentPair.pair)
      )
    ) {
      const newCombination = [...currentCombination, currentPair];
      combinations = findUniqueCombinations(
        pairs,
        newCombination,
        index + 1,
        combinations
      );
    }

    combinations = findUniqueCombinations(
      pairs,
      currentCombination,
      index + 1,
      combinations
    );

    return combinations;
  };

  const combinations = findUniqueCombinations(pairs);

  // return combinations;

  // const combinations: Combination[] = pairs.map((pair) => [pair]);

  // for (const pair of pairs) {
  //   // if (
  //   //   !combinations.find((combination) =>
  //   //     combination.find((pair2) => pairOverlaps(pair2.pair, pair.pair))
  //   //   )
  //   // ) {
  //   //   combinations.push([pair]);
  //   // }

  //   for (const combination of combinations) {
  //     if (!combination.find((pair2) => pairOverlaps(pair2.pair, pair.pair))) {
  //       combination.push(pair);
  //     }
  //   }
  // }

  // return combinations;

  // const getCombinations = (
  //   combinations: Combination[],
  //   otherPairs: GalaxyPairWithDistance[]
  // ): Combination[] => {
  //   if (otherPairs.length === 0) {
  //     return combinations;
  //   }

  //   for (let pair of otherPairs) {
  //     const remainingPairs = otherPairs.slice(1);
  //     // console.log(remainingPairs.length);
  //     for (let i = 0; i < combinations.length; i++) {
  //       if (
  //         !combinations[i]?.find((pair2) => pairOverlaps(pair2.pair, pair.pair))
  //       ) {
  //         combinations[i]?.push(pair);
  //       }
  //     }
  //     combinations.push([pair]);
  //     combinations = getCombinations(combinations, remainingPairs);
  //   }

  //   return combinations;

  //   // const pair = otherPairs[0]!;
  //   // const remainingPairs = otherPairs.slice(1);

  //   // for (const combination of combinations) {
  //   //   const newCombinations: Combination[] = [];
  //   //   const potentialPairsForCombination = remainingPairs.filter(
  //   //     (otherPair) => {
  //   //       return !combination.find((pair) =>
  //   //         pairOverlaps(pair.pair, otherPair.pair)
  //   //       );
  //   //     }
  //   //   );
  //   //   for (const potentialPair of potentialPairsForCombination) {
  //   //     newCombinations.push([...combination, potentialPair]);
  //   //   }

  //   //   for (const newCombination of newCombinations) {
  //   //     printCombination(newCombination);
  //   //   }

  //   //   combinations.push(...newCombinations);
  //   // }

  //   // return combinations;
  // };

  // console.log(pairs.length);

  // const combinations = getCombinations([], pairs);

  const maxLength = Math.max(
    ...combinations.map((combination) => combination.length)
  );

  return combinations.filter((combination) => combination.length === maxLength);
};
