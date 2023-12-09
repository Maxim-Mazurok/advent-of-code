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

const parseInput = (input: string): Pair => {
  const lines = input.split("\n");
  const time = Number(lines[0]!.replace(/\s+/g, "").split(":")[1]!);
  const recordDistanceToBeat = Number(
    lines[1]!.replace(/\s+/g, "").split(":")[1]!
  );
  return { time, recordDistanceToBeat };
};
it("parses input", () => {
  expect(parseInput(sampleInput)).toEqual({
    time: 71530,
    recordDistanceToBeat: 940200,
  } satisfies Pair);
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
  const pair = parseInput(input);

  const ways = waysToPlay(pair.time);
  const winningWays = winningWaysToPlay(ways, pair.recordDistanceToBeat);

  return winningWays.length;
};

it("works for example input", () => {
  expect(main(sampleInput)).toBe(71503);
});

it.skip("works for real input", async () => {
  const input = await readFile(join(__dirname, "6.input.txt"), "utf-8");
  expect(main(input)).toBe(36530883);
});
