const Galaxy = "#";
const Space = ".";
type Universe = string[][];

export const parseInput = (input: string): Universe => {
  return input.split("\n").map((line) => line.split(""));
};

export const main = (input: string) => {
  const universe = parseInput(input);
  const galaxies = findAllGalaxies(universe);
  // console.log(galaxies);
  const pairs = getAllGalaxyPairs(galaxies);
  const pairsWithDistance = getGalaxyPairsWithDistance(pairs);
  // console.log(pairsWithDistance);
  const combinations = getAllPairCombinations(pairsWithDistance);
  // console.log(JSON.stringify(combinations, null, 2));
  for (let i = 0; i < combinations.length; i++) {
    const combination = combinations[i]!;

    const y = combinations.find((otherCombination) => {
      return combination.find((pair) =>
        otherCombination.find((otherPair) =>
          pairOverlaps(pair.pair, otherPair.pair)
        )
      );
    });
    if (y) {
      console.log(y);
    }

    printCombination(combinations[i]);
  }
  console.log(combinations.length);
  // const shortestCombination = findShortestCombination(combinations);
  const sumOfDistances = findSumOfDistances(combinations);
  return sumOfDistances;
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

export const expandUniverse = (universe: Universe): Universe => {
  renderUniverse(universe);

  for (let rowIndex = 0; rowIndex < universe.length; rowIndex++) {
    if (!rowHasGalaxies(universe, rowIndex)) {
      // console.log("rowHasGalaxies", rowIndex);
      universe = insertEmptyRow(universe, rowIndex);
      rowIndex++;
    }
  }

  const rowIndex = 0;
  for (
    let columnIndex = 0;
    columnIndex < universe[rowIndex]!.length;
    columnIndex++
  ) {
    if (!columnHasGalaxies(universe, columnIndex)) {
      universe = insertEmptyColumn(universe, columnIndex);
      columnIndex++;
    }
  }

  renderUniverse(universe);

  return universe;
};

export const insertEmptyRow = (
  universe: Universe,
  rowIndex: number
): Universe => {
  const emptyRow = universe[0]!.map(() => Space);
  universe.splice(rowIndex, 0, emptyRow);
  return universe;
};

export const insertEmptyColumn = (
  universe: Universe,
  columnIndex: number
): Universe => {
  universe.forEach((row) => row.splice(columnIndex, 0, Space));
  return universe;
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

export const findShortestPathBetween = (start: Point, end: Point): number => {
  const distanceY = Math.abs(end.y - start.y);
  const distanceX = Math.abs(end.x - start.x);

  // console.log({ distanceX, distanceY });

  const min = Math.min(distanceX, distanceY);
  const max = Math.max(distanceX, distanceY);

  // console.log({ min, max });

  const diagonal = Math.max(0, min % 2 === 0 ? min * 2 - 1 : min * 2);

  const remaining = max - min;

  // console.log({ diagonal, remaining });

  return diagonal + remaining;
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
