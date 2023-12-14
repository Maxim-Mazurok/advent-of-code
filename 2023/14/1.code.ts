type Row = string;
type Grid = Row[];

export const parseInput = (input: string): Grid => {
  return input.split("\n").map((row) => row.trim());
};

export const main = (input: string) => {
  const grid = parseInput(input);
  const width = grid[0]!.length;

  let totalLoad = 0;

  for (let columnIndex = 0; columnIndex < width; columnIndex++) {
    let totalColumnLoad = 0;
    let currentWeight = grid.length;
    let emptySpacesInARow = 0;
    for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
      const row = grid[rowIndex]!;
      const char = row[columnIndex]!;

      if (["#", "O"].includes(char)) {
        if (char === "#") {
          currentWeight -= emptySpacesInARow;
          // console.log({ char, currentWeight, totalLoad, emptySpacesInARow });
          emptySpacesInARow = 0;
        } else if (char === "O") {
          // console.log({ char, currentWeight, totalLoad, emptySpacesInARow });
          totalLoad += currentWeight;
          totalColumnLoad += currentWeight;
        }

        currentWeight--;
      } else if (char === ".") {
        emptySpacesInARow++;
      }
    }
    // console.log(columnIndex, totalColumnLoad);
  }

  return totalLoad;
};
