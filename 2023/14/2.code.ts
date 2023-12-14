type Row = string;
type Grid = Row[];

export const parseInput = (input: string): Grid => {
  return input.split("\n").map((row) => row.trim());
};

export const rotateGridToLeft = (grid: Grid): Grid => {
  const newGrid: Grid = [];
  for (let i = 0; i < grid[0]!.length; i++) {
    newGrid[i] = "";
    for (let j = grid.length - 1; j >= 0; j--) {
      newGrid[i] += grid[j]![i];
    }
  }
  return newGrid;
};

export const main = (input: string) => {
  let grid = parseInput(input);

  const seenGrids = new Map<string, number>();
  seenGrids.set(grid.join("\n"), 0);

  for (let i = 0; i < 1_000_000_000; i++) {
    // so I had this theory that at some point the grid would start repeating
    // however I couldn't really test this because of my "smart" solution for the first part
    // so before implementing I checked that this will actually work
    // so credit to https://www.youtube.com/watch?v=WCVOBKUNc38 for confirming the idea
    // apart from that, I stopped watching at 7:09 and I coded it up myself
    // so I consider it a relatively clean victory, and good on me for not spending hours of my life on potentially non-working solution :)
    grid = cycle(grid);
    const gridString = grid.join("\n");
    if (seenGrids.has(gridString)) {
      const index = seenGrids.get(gridString)!;
      const cycleLength = i - index;
      const remainingCycles = (1_000_000_000 - i) % cycleLength;
      for (let j = 1; j < remainingCycles; j++) {
        grid = cycle(grid);
      }
      break;
    } else {
      seenGrids.set(gridString, i);
    }
  }

  return scoreGrid(grid);
};

export const cycle = (grid: Grid): Grid => {
  grid = moveStonesUp(grid);
  grid = rotateGridToLeft(grid);
  grid = moveStonesUp(grid);
  grid = rotateGridToLeft(grid);
  grid = moveStonesUp(grid);
  grid = rotateGridToLeft(grid);
  grid = moveStonesUp(grid);
  grid = rotateGridToLeft(grid);
  return grid;
};

const transpose = (grid: Grid): Grid => {
  const newGrid: Grid = [];
  for (let i = 0; i < grid[0]!.length; i++) {
    newGrid[i] = "";
    for (let j = 0; j < grid.length; j++) {
      newGrid[i] += grid[j]![i];
    }
  }
  return newGrid;
};

export const moveStonesUp = (grid: Grid): Grid => {
  const newGrid: Grid = [];
  const width = grid[0]!.length;
  const height = grid.length;

  for (let columnIndex = 0; columnIndex < width; columnIndex++) {
    newGrid[columnIndex] = "";
    let emptySpaces = 0;
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const char = grid[rowIndex]![columnIndex]!;
      if (char === ".") {
        emptySpaces++;
      } else if (char === "O") {
        newGrid[columnIndex] += "O";
      } else if (char === "#") {
        newGrid[columnIndex] += ".".repeat(emptySpaces) + "#";
        emptySpaces = 0;
      }
    }
    newGrid[columnIndex] += ".".repeat(emptySpaces);
  }

  return transpose(newGrid);
};

export const scoreGrid = (grid: Grid): number => {
  let score = 0;
  const width = grid[0]!.length;
  const height = grid.length;
  for (let columnIndex = 0; columnIndex < width; columnIndex++) {
    for (let rowIndex = 0; rowIndex < height; rowIndex++) {
      const char = grid[rowIndex]![columnIndex]!;
      if (char === "O") {
        score += height - rowIndex;
      }
    }
  }
  return score;
};
