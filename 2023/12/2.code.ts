export type Row = {
  records: string;
  damagedGroupLengths: number[];
};

export const parseInput = (input: string): Row[] => {
  return input
    .split("\n")
    .filter((row) => row.length > 0)
    .map((row) => {
      const [records, damagedGroupLengths] = row.split(" ");
      return {
        records: Array(5).fill(records!).join("?"),
        damagedGroupLengths: Array(5)
          .fill(damagedGroupLengths!)
          .join(",")
          .split(",")
          .map((length) => parseInt(length)),
      };
    });
};

export const main = (input: string) => {
  const rows = parseInput(input);
  const arrangements = rows.map((row) => getMatchingRowArrangements(row));
  return arrangements.reduce((acc, rowArrangements) => {
    return acc + rowArrangements.length;
  }, 0);
};

export const getAllRowArrangements = (records: string): string[] => {
  let arrangements: string[] = [""];
  const rowCharacters = records.split("");
  for (let i = 0; i < rowCharacters.length; i++) {
    const character = rowCharacters[i];
    if (character === "?") {
      arrangements = arrangements
        .map((arrangement) => arrangement + ".")
        .concat(arrangements.map((arrangement) => arrangement + "#"));
    } else {
      arrangements = arrangements.map((arrangement) => arrangement + character);
    }
  }
  return arrangements;
};

export const getMatchingRowArrangements = (row: Row): string[] => {
  const allRowArrangements = getAllRowArrangements(row.records);
  // console.log(allRowArrangements.join("\n"));
  // ^\.*#{1}\.+#{1}\.+#{3}\.*$
  const regex = new RegExp(
    `^\\.*${row.damagedGroupLengths
      .map((length) => `#{${length}}`)
      .join("\\.+")}\\.*$`,
    "gm"
  );
  // console.log(regex);
  const matchingArrangements = allRowArrangements.filter((arrangement) =>
    arrangement.match(regex)
  );
  // console.log(matchingArrangements);
  return matchingArrangements;
};
