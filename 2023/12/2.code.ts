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

const totalCpus = 20;
export const main = (
  input: string,
  batchIndex: number | undefined = Number(process.env.BATCH_INDEX)
) => {
  const rows = parseInput(input);
  const arrangementNumbers = rows.map((row, index) => {
    // console.log({ index, batchIndex, totalCpus, indexDiv: index % totalCpus });
    if (batchIndex !== undefined && index % totalCpus !== batchIndex) {
      return 0;
    }
    return getMatchingRowArrangements(row);
  });
  return arrangementNumbers.reduce((acc, rowArrangements) => {
    return acc + rowArrangements;
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

export const generateArrangements = function* (
  records: string,
  damagedGroupLengths: number[],
  arrangement = ""
): Generator<string> {
  // console.log(arrangement);
  const currentGroupIndex = arrangement.split("#.").length - 1;
  // console.log({ arrangement, currentGroupIndex });
  const regex = new RegExp(
    `^\\.*${damagedGroupLengths
      .slice(0, currentGroupIndex)
      .map((length) => `#{${length}}`)
      .concat(
        currentGroupIndex >= damagedGroupLengths.length
          ? []
          : [`#{0,${damagedGroupLengths[currentGroupIndex]!}}`]
      )
      .join("\\.+")}\\.*$`,
    "gm"
  );
  // console.log(regex);
  if (!arrangement.match(regex)) {
    // console.log("not matching", arrangement, regex);
    return;
  }

  if (records.length === 0) {
    yield arrangement;
    return;
  }

  const [firstCharacter, ...remainingCharacters] = records;
  if (firstCharacter === "?") {
    yield* generateArrangements(
      remainingCharacters.join(""),
      damagedGroupLengths,
      arrangement + "."
    );
    yield* generateArrangements(
      remainingCharacters.join(""),
      damagedGroupLengths,
      arrangement + "#"
    );
  } else {
    yield* generateArrangements(
      remainingCharacters.join(""),
      damagedGroupLengths,
      arrangement + firstCharacter
    );
  }
};

export const getMatchingRowArrangements = (row: Row): number => {
  console.log(`Processing row: ${row.records}`);
  // return Math.random() * 1000;

  // const allRowArrangements = getAllRowArrangements(row.records);
  // // console.log(allRowArrangements.join("\n"));
  // // ^\.*#{1}\.+#{1}\.+#{3}\.*$
  // const regex = new RegExp(
  //   `^\\.*${row.damagedGroupLengths
  //     .map((length) => `#{${length}}`)
  //     .join("\\.+")}\\.*$`,
  //   "gm"
  // );
  // // console.log(regex);
  // const matchingArrangements = allRowArrangements.filter((arrangement) =>
  //   arrangement.match(regex)
  // );
  // // console.log(matchingArrangements);
  // return matchingArrangements;

  let possibleArrangements = 0;
  let checked = 0;

  const possibleArrangementsNumber = Math.pow(
    2,
    row.records.split("").filter((character) => character === "?").length
  );
  const start = Date.now();

  const regex = new RegExp(
    `^\\.*${row.damagedGroupLengths
      .map((length) => `#{${length}}`)
      .join("\\.+")}\\.*$`,
    "gm"
  );

  for (const arrangement of generateArrangements(
    row.records,
    row.damagedGroupLengths
  )) {
    // checked++;
    // if (checked % 100_000 === 0) {
    //   console.log(checked);
    //   console.log(
    //     `${Math.round((checked / possibleArrangementsNumber) * 100)}%`
    //   );
    //   console.log(
    //     `Remaining time, minutes: ${Math.round(
    //       (((Date.now() - start) / checked) *
    //         (possibleArrangementsNumber - checked)) /
    //         1000 /
    //         60
    //     )}`
    //   );
    // }
    // console.log("actual", arrangement);

    if (arrangement.match(regex)) {
      // console.log(arrangement);
      possibleArrangements++;
    }
  }

  console.log(`Found ${possibleArrangements} arrangements`);

  return possibleArrangements;
};
