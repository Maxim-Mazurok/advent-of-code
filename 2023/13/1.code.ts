type Row = string;
type Pattern = Row[];

export const parseInput = (input: string): Pattern[] => {
  return input.split("\n\n").map((s) => s.split("\n"));
};

export const main = (input: string) => {
  const patterns = parseInput(input);
  let result = 0;
  for (const pattern of patterns) {
    // console.log(pattern.join("\n"));
    const solution = solvePattern(pattern);
    // console.log(solution, "\n-------------------\n");
    if (solution.type === "vertical-reflection") {
      result += solution.rowsAboveMirrorNumber * 100;
    } else {
      result += solution.columnsLeftOfMirrorNumber;
    }
  }
  return result;
};

type Solution =
  | {
      //  xx
      //  --
      //  xx
      type: "vertical-reflection";
      rowsAboveMirrorNumber: number;
    }
  | {
      // xx | xx
      type: "horizontal-reflection";
      columnsLeftOfMirrorNumber: number;
    };
export const solvePattern = (pattern: Pattern): Solution => {
  const rowsNumber = pattern.length;
  const columnsNumber = pattern[0]!.length;

  for (let rowIndex = 0; rowIndex < rowsNumber - 1; rowIndex++) {
    if (mirrorIsAfterThisRow(pattern, rowIndex)) {
      return {
        type: "vertical-reflection",
        rowsAboveMirrorNumber: rowIndex + 1,
      };
    }
  }

  for (let columnIndex = 0; columnIndex < columnsNumber - 1; columnIndex++) {
    if (mirrorIsAfterThisColumn(pattern, columnIndex)) {
      return {
        type: "horizontal-reflection",
        columnsLeftOfMirrorNumber: columnIndex + 1,
      };
    }
  }

  throw new Error("No solution found");
};

const mirrorIsAfterThisRow = (pattern: Pattern, rowIndex: number): boolean => {
  //// LENGTH = 5
  //   0000
  //   1111
  //   ---- // rowIndex = 1
  //   2222
  //   3333
  //   4444
  const rowsNumberBeforeMirror = rowIndex + 1;
  const rowsNumberAfterMirror = pattern.length - rowsNumberBeforeMirror;
  const mirrorLength = Math.min(rowsNumberBeforeMirror, rowsNumberAfterMirror);

  if (mirrorLength === 0) {
    return false;
  }

  for (let i = 1; i <= mirrorLength; i++) {
    const rowBeforeMirror = pattern[rowIndex - i + 1];
    const rowAfterMirror = pattern[rowIndex + i];
    if (rowBeforeMirror !== rowAfterMirror) {
      return false;
    }
  }
  return true;
};

const mirrorIsAfterThisColumn = (
  pattern: Pattern,
  columnIndex: number
): boolean => {
  const columnsNumberBeforeMirror = columnIndex + 1;
  const columnsNumberAfterMirror =
    pattern[0]!.length - columnsNumberBeforeMirror;
  const mirrorLength = Math.min(
    columnsNumberBeforeMirror,
    columnsNumberAfterMirror
  );

  if (mirrorLength === 0) {
    return false;
  }

  for (let i = 1; i <= mirrorLength; i++) {
    const columnBeforeMirror = pattern
      .map((row) => row[columnIndex - i + 1])
      .join("");
    const columnAfterMirror = pattern
      .map((row) => row[columnIndex + i])
      .join("");
    if (columnBeforeMirror !== columnAfterMirror) {
      return false;
    }
  }
  return true;
};
