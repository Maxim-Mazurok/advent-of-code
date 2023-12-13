type Row = string;
type Pattern = Row[];

export const parseInput = (input: string): Pattern[] => {
  return input.split("\n\n").map((s) => s.split("\n"));
};

export const main = (input: string) => {
  const patterns = parseInput(input);
  let result = 0;
  for (const pattern of patterns) {
    const solution = solvePattern(pattern);
    if (solution.type === "vertical-reflection") {
      result += solution.rowsAboveMirrorNumber * 100;
    } else {
      // console.log(pattern.join("\n"));

      // console.log(solution, "\n-------------------\n");

      result += solution.columnsLeftOfMirrorNumber;
    }
  }
  return result;
};

type RowSolution = {
  type: "vertical-reflection";
  rowsAboveMirrorNumber: number;
};
type ColumnSolution = {
  type: "horizontal-reflection";
  columnsLeftOfMirrorNumber: number;
};
type Solution = RowSolution | ColumnSolution;
export const solvePattern = (pattern: Pattern): Solution => {
  const rowsNumber = pattern.length;
  const columnsNumber = pattern[0]!.length;

  let rowSolution: RowSolution | undefined;
  let columnSolution: ColumnSolution | undefined;

  for (let rowIndex = 0; rowIndex < rowsNumber - 1; rowIndex++) {
    if (mirrorIsAfterThisRow(pattern, rowIndex)) {
      rowSolution = {
        type: "vertical-reflection",
        rowsAboveMirrorNumber: rowIndex + 1,
      };
      break;
    }
  }

  for (let columnIndex = 0; columnIndex < columnsNumber - 1; columnIndex++) {
    if (mirrorIsAfterThisColumn(pattern, columnIndex)) {
      columnSolution = {
        type: "horizontal-reflection",
        columnsLeftOfMirrorNumber: columnIndex + 1,
      };
      break;
    }
  }

  // if (rowSolution && columnSolution) {
  //   if (
  //     rowSolution.rowsAboveMirrorNumber <
  //     columnSolution.columnsLeftOfMirrorNumber
  //   ) {
  //     return rowSolution;
  //   } else {
  //     return columnSolution;
  //   }
  // }
  if (rowSolution) {
    return rowSolution;
  }
  if (columnSolution) {
    return columnSolution;
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

  let smudgesFound = 0;
  for (let i = 1; i <= mirrorLength; i++) {
    const rowBeforeMirror = pattern[rowIndex - i + 1]!;
    const rowAfterMirror = pattern[rowIndex + i]!;
    for (let j = 0; j < rowBeforeMirror.length; j++) {
      if (rowBeforeMirror[j] !== rowAfterMirror[j]) {
        smudgesFound++;
      }
    }
    if (smudgesFound > 1) {
      return false;
    }
  }
  return smudgesFound === 1;
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

  let smudgesFound = 0;
  for (let i = 1; i <= mirrorLength; i++) {
    const columnBeforeMirror = pattern.map((row) => row[columnIndex - i + 1]);
    const columnAfterMirror = pattern.map((row) => row[columnIndex + i]);
    for (let j = 0; j < columnBeforeMirror.length; j++) {
      if (columnBeforeMirror[j] !== columnAfterMirror[j]) {
        smudgesFound++;
      }
    }
    if (smudgesFound > 1) {
      return false;
    }
  }
  return smudgesFound === 1;
};
