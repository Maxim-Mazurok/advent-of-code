import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";

const sampleInput = dedent(`
  Time:      7  15   30
  Distance:  9  40  200
`);

type Time = number;
type Pair = { time: Time; recordDistanceToBeat: number };

const parseInput = (input: string): Pair[] => {
  const lines = input.split("\n");
  const time = lines[0]!.split(/\s+/).slice(1).map(Number);
  const recordDistanceToBeat = lines[1]!.split(/\s+/).slice(1).map(Number);
  return time.map((time, i) => ({
    time,
    recordDistanceToBeat: recordDistanceToBeat[i]!,
  }));
};
it("parses input", () => {
  expect(parseInput(sampleInput)).toEqual([
    { time: 7, recordDistanceToBeat: 9 },
    { time: 15, recordDistanceToBeat: 40 },
    { time: 30, recordDistanceToBeat: 200 },
  ] satisfies Pair[]);
});

type WayToPlay = {
  timeToHold: number;
  timeToTravel: number;
  distance: number;
};

const waysToPlay = (time: Time): WayToPlay[] => {
  const ways: WayToPlay[] = [];
  for (let timeToHold = 0; timeToHold <= time; timeToHold++) {
    const timeToTravel = time - timeToHold;
    const distance = timeToHold * timeToTravel;
    ways.push({ timeToHold, timeToTravel, distance });
  }
  return ways;
};
it("calculates ways to play", () => {
  const time: Time = 7;

  expect(waysToPlay(time)).toEqual([
    { timeToHold: 0, timeToTravel: 7, distance: 0 },
    { timeToHold: 1, timeToTravel: 6, distance: 6 },
    { timeToHold: 2, timeToTravel: 5, distance: 10 },
    { timeToHold: 3, timeToTravel: 4, distance: 12 },
    { timeToHold: 4, timeToTravel: 3, distance: 12 },
    { timeToHold: 5, timeToTravel: 2, distance: 10 },
    { timeToHold: 6, timeToTravel: 1, distance: 6 },
    { timeToHold: 7, timeToTravel: 0, distance: 0 },
  ]);
});

const winningWaysToPlay = (
  waysToPlay: WayToPlay[],
  recordDistanceToBeat: number
): WayToPlay[] => {
  return waysToPlay.filter((way) => way.distance > recordDistanceToBeat);
};
it("calculates winning ways to play", () => {
  const ways = waysToPlay(7);
  const recordDistanceToBeat = 9;

  expect(winningWaysToPlay(ways, recordDistanceToBeat)).toEqual([
    { timeToHold: 2, timeToTravel: 5, distance: 10 },
    { timeToHold: 3, timeToTravel: 4, distance: 12 },
    { timeToHold: 4, timeToTravel: 3, distance: 12 },
    { timeToHold: 5, timeToTravel: 2, distance: 10 },
  ]);
});

const main = (input: string) => {
  const pairs = parseInput(input);

  let result = 0;

  for (const pair of pairs) {
    const ways = waysToPlay(pair.time);
    const winningWays = winningWaysToPlay(ways, pair.recordDistanceToBeat);
    if (winningWays.length === 0) continue;

    if (result === 0) {
      result = winningWays.length;
    } else {
      result *= winningWays.length;
    }
  }

  return result;
};

it("works for example input", () => {
  expect(main(sampleInput)).toBe(288);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(512295);
});
