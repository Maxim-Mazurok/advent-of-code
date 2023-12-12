import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import { Row, getMatchingRowArrangements, main, parseInput } from "./1.code";

const sampleInput = dedent(`
  ???.### 1,1,3
  .??..??...?##. 1,1,3
  ?#?#?#?#?#?#?#? 1,3,1,6
  ????.#...#... 4,1,1
  ????.######..#####. 1,6,5
  ?###???????? 3,2,1
`);

it("parses input", () => {
  const result = parseInput(sampleInput);
  expect(result).toEqual([
    { records: "???.###", damagedGroupLengths: [1, 1, 3] },
    { records: ".??..??...?##.", damagedGroupLengths: [1, 1, 3] },
    { records: "?#?#?#?#?#?#?#?", damagedGroupLengths: [1, 3, 1, 6] },
    { records: "????.#...#...", damagedGroupLengths: [4, 1, 1] },
    { records: "????.######..#####.", damagedGroupLengths: [1, 6, 5] },
    { records: "?###????????", damagedGroupLengths: [3, 2, 1] },
  ]);
});

const samples: [Row, number][] = [
  [{ records: "???.###", damagedGroupLengths: [1, 1, 3] }, 1],
  [{ records: ".??..??...?##.", damagedGroupLengths: [1, 1, 3] }, 4],
  [{ records: "?#?#?#?#?#?#?#?", damagedGroupLengths: [1, 3, 1, 6] }, 1],
  [{ records: "????.#...#...", damagedGroupLengths: [4, 1, 1] }, 1],
  [{ records: "????.######..#####.", damagedGroupLengths: [1, 6, 5] }, 4],
  [{ records: "?###????????", damagedGroupLengths: [3, 2, 1] }, 10],
];
samples.map(([row, expectedArrangementsNumber]) => {
  it(`gets "${row.records}" row arrangements`, () => {
    const result = getMatchingRowArrangements(row);
    expect(result.length).toBe(expectedArrangementsNumber);
  });
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(21);
});

it.skip("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(6488);
});
