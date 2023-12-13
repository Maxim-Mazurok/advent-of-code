import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { Row, getMatchingRowArrangements, main, parseInput } from "./2.code";

const sampleInput = dedent(`
  ???.### 1,1,3
  .??..??...?##. 1,1,3
  ?#?#?#?#?#?#?#? 1,3,1,6
  ????.#...#... 4,1,1
  ????.######..#####. 1,6,5
  ?###???????? 3,2,1
`);

it("parses input", () => {
  const result = parseInput(
    dedent(`
    .# 1
    ???.### 1,1,3
  `)
  );
  expect(result).toEqual([
    { records: ".#?.#?.#?.#?.#", damagedGroupLengths: [1, 1, 1, 1, 1] },
    {
      records: "???.###????.###????.###????.###????.###",
      damagedGroupLengths: [1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3],
    },
  ]);
});

const oldSamples: [Row, number][] = [
  [{ records: "???.###", damagedGroupLengths: [1, 1, 3] }, 1],
  [{ records: ".??..??...?##.", damagedGroupLengths: [1, 1, 3] }, 4],
  [{ records: "?#?#?#?#?#?#?#?", damagedGroupLengths: [1, 3, 1, 6] }, 1],
  [{ records: "????.#...#...", damagedGroupLengths: [4, 1, 1] }, 1],
  [{ records: "????.######..#####.", damagedGroupLengths: [1, 6, 5] }, 4],
  [{ records: "?###????????", damagedGroupLengths: [3, 2, 1] }, 10],
];
oldSamples.map(([row, expectedArrangementsNumber]) => {
  it(`gets "${row.records}" row arrangements`, () => {
    const result = getMatchingRowArrangements(row);
    expect(result).toBe(expectedArrangementsNumber);
  });
});

const samples: [Row, number][] = [
  // [parseInput("???.### 1,1,3")[0]!, 1],
  [parseInput(".??..??...?##. 1,1,3")[0]!, 16384],
  // [parseInput("?#?#?#?#?#?#?#? 1,3,1,6")[0]!, 1],
  // [parseInput("????.#...#... 4,1,1")[0]!, 16],
  // [parseInput("????.######..#####. 1,6,5")[0]!, 2500],
  // [parseInput("?###???????? 3,2,1")[0]!, 506250],
];
samples.map(([row, expectedArrangementsNumber]) => {
  it(`gets "${row.records}" row arrangements`, () => {
    const result = getMatchingRowArrangements(row);
    expect(result).toBe(expectedArrangementsNumber);
  });
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(525152);
});

it.skip("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(6488);
});
