import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";
import {
  HandType,
  Player,
  Rank,
  RawHand,
  calculateWinnings,
  getBestHandType,
  getHand,
  getHandType,
  getRawHand,
  main,
  parseInput,
  rankHands,
  strongestOfTheSameType,
} from "./7-2.code";

const sampleInput = dedent(`
  32T3K 765
  T55J5 684
  KK677 28
  KTJJT 220
  QQQJA 483
`);

it("gets hand", () => {
  expect(getHand("32T3K")).toEqual(["3", "2", "T", "3", "K"]);
});

it("gets raw hand", () => {
  expect(getRawHand(["3", "2", "T", "3", "K"])).toBe("32T3K");
});

it("parses input", () => {
  expect(parseInput(sampleInput)).toEqual([
    { hand: getHand("32T3K"), bid: 765 },
    { hand: getHand("T55J5"), bid: 684 },
    { hand: getHand("KK677"), bid: 28 },
    { hand: getHand("KTJJT"), bid: 220 },
    { hand: getHand("QQQJA"), bid: 483 },
  ] satisfies Player[]);
});

it("gets hand type", () => {
  const tests: [RawHand, HandType][] = [
    ["AAAAA", "Five of a kind"],
    ["AA8AA", "Four of a kind"],
    ["23332", "Full house"],
    ["TTT98", "Three of a kind"],
    ["23432", "Two pair"],
    ["A23A4", "One pair"],
    ["23456", "High card"],

    ["32T3K", "One pair"],
    ["KK677", "Two pair"],
    ["KTJJT", "Two pair"],
    ["T55J5", "Three of a kind"],
    ["QQQJA", "Three of a kind"],
  ];
  tests.forEach(([hand, expected]) => {
    expect(getHandType(getHand(hand))).toBe(expected);
  });
});

it("gets best hand type", () => {
  const tests: [RawHand, HandType][] = [
    ["QJJQ2", "Four of a kind"],

    ["AAAAA", "Five of a kind"],
    ["AA8AA", "Four of a kind"],
    ["23332", "Full house"],
    ["TTT98", "Three of a kind"],
    ["23432", "Two pair"],
    ["A23A4", "One pair"],
    ["23456", "High card"],

    ["32T3K", "One pair"],
    ["KK677", "Two pair"],
    ["KTJJT", "Four of a kind"],
    ["T55J5", "Four of a kind"],
    ["QQQJA", "Four of a kind"],
  ];
  tests.forEach(([hand, expected]) => {
    expect(getBestHandType(getHand(hand))).toBe(expected);
  });
});

it("gets strongest of the same type", () => {
  const tests: [RawHand, RawHand, RawHand][] = [
    ["JKKK2", "QQQQ2", "QQQQ2"],

    ["33332", "2AAAA", "33332"],
    ["77888", "77788", "77888"],

    ["KK677", "KTJJT", "KK677"],
    ["T55J5", "QQQJA", "QQQJA"],
  ];
  tests.forEach(([hand1, hand2, expected]) => {
    expect(
      strongestOfTheSameType(getHand(hand1), getHand(hand2))
    ).toStrictEqual(getHand(expected));
  });
});

it("ranks hands", () => {
  const hands = parseInput(sampleInput).map((player) => player.hand);
  const result = rankHands(hands, true);
  type ExpectedRankedHand = { rawHand: RawHand; rank: Rank };
  expect(
    result.map((rankedHand) => ({
      rawHand: getRawHand(rankedHand.hand),
      rank: rankedHand.rank,
    }))
  ).toEqual([
    { rawHand: "32T3K", rank: 1 },
    { rawHand: "KK677", rank: 2 },
    { rawHand: "T55J5", rank: 3 },
    { rawHand: "QQQJA", rank: 4 },
    { rawHand: "KTJJT", rank: 5 },
  ] satisfies ExpectedRankedHand[]);
});

it("calculates winnings", () => {
  const players = parseInput(sampleInput);
  const rankedHands = rankHands(
    players.map((player) => player.hand),
    true
  );
  expect(calculateWinnings(players, rankedHands)).toBe(5905);
});

it("works for example input", () => {
  expect(main(sampleInput)).toBe(5905);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "7.input.txt"), "utf-8");
  expect(main(input)).toBe(253253225);
});
