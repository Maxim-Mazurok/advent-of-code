type Row = string[];
type Grid = Row[];

export const parseInput = (input: string): Grid => {
  return input.split("\n").map((row) => row.split(""));
};

export const main = (input: string) => {
  const grid = parseInput(input);
  const energizedGrid = solve(grid);
  const count = energizedGrid.reduce((sum, row) => {
    return sum + row.filter((point) => point === "#").length;
  }, 0);
  return count;
};

export const visualize = (grid: Grid) => {
  return grid.map((row) => row.join("")).join("\n");
};

const getNextCoordinate = (
  row: number,
  column: number,
  direction: Direction
): [number, number] => {
  switch (direction) {
    case "up":
      return [row - 1, column];
    case "down":
      return [row + 1, column];
    case "left":
      return [row, column - 1];
    case "right":
      return [row, column + 1];
  }
};

type Direction = "up" | "down" | "left" | "right";
export const solve = (grid: Grid): Grid => {
  const energizedGrid = JSON.parse(JSON.stringify(grid));

  const visited: Set<string> = new Set();

  const nextStep = (
    grid: Grid,
    rayRow: number,
    rayColumn: number,
    rayDirection: Direction,
    firstStep = false
  ): void => {
    if (!firstStep) {
      [rayRow, rayColumn] = getNextCoordinate(rayRow, rayColumn, rayDirection);
    }

    const currentRow = grid[rayRow];
    if (!currentRow) return;
    const currentPoint = currentRow[rayColumn];
    if (!currentPoint) return;

    // console.log({ rayRow, rayColumn, rayDirection, currentPoint });

    const key = `${rayRow},${rayColumn},${rayDirection}`;
    if (visited.has(key)) return;
    visited.add(key);

    if (currentPoint === ".") {
      energizedGrid[rayRow]![rayColumn] = "#";
      nextStep(grid, rayRow, rayColumn, rayDirection);
    } else if (currentPoint === "|") {
      energizedGrid[rayRow]![rayColumn] = "#";
      if (rayDirection === "up" || rayDirection === "down") {
        nextStep(grid, rayRow, rayColumn, rayDirection);
      } else if (rayDirection === "left" || rayDirection === "right") {
        nextStep(grid, rayRow, rayColumn, "up");
        nextStep(grid, rayRow, rayColumn, "down");
      }
    } else if (currentPoint === "-") {
      energizedGrid[rayRow]![rayColumn] = "#";
      if (rayDirection === "left" || rayDirection === "right") {
        nextStep(grid, rayRow, rayColumn, rayDirection);
      } else if (rayDirection === "up" || rayDirection === "down") {
        nextStep(grid, rayRow, rayColumn, "left");
        nextStep(grid, rayRow, rayColumn, "right");
      }
    } else if (currentPoint === "/") {
      energizedGrid[rayRow]![rayColumn] = "#";
      if (rayDirection === "up") {
        nextStep(grid, rayRow, rayColumn, "right");
      } else if (rayDirection === "right") {
        nextStep(grid, rayRow, rayColumn, "up");
      } else if (rayDirection === "down") {
        nextStep(grid, rayRow, rayColumn, "left");
      } else if (rayDirection === "left") {
        nextStep(grid, rayRow, rayColumn, "down");
      }
    } else if (currentPoint === "\\") {
      energizedGrid[rayRow]![rayColumn] = "#";
      if (rayDirection === "up") {
        nextStep(grid, rayRow, rayColumn, "left");
      } else if (rayDirection === "right") {
        nextStep(grid, rayRow, rayColumn, "down");
      } else if (rayDirection === "down") {
        nextStep(grid, rayRow, rayColumn, "right");
      } else if (rayDirection === "left") {
        nextStep(grid, rayRow, rayColumn, "up");
      }
    }
  };

  nextStep(grid, 0, 0, "right", true);

  for (let i = 0; i < energizedGrid.length; i++) {
    const row = energizedGrid[i]!;
    for (let j = 0; j < row.length; j++) {
      const point = row[j];
      if (point !== "#") {
        energizedGrid[i]![j] = ".";
      }
    }
  }

  return energizedGrid;
};
