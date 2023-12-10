import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";

const sampleInput = dedent(`
  32T3K 765
  T55J5 684
  KK677 28
  KTJJT 220
  QQQJA 483
`);

type Card =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "T"
  | "J"
  | "Q"
  | "K"
  | "A";
type Bid = number;
type RawHand = string;
type Hand = [Card, Card, Card, Card, Card];
type Player = { hand: Hand; bid: Bid };
type HandType =
  | "Five of a kind"
  | "Four of a kind"
  | "Full house"
  | "Three of a kind"
  | "Two pair"
  | "One pair"
  | "High card";
type Rank = number;
type RankedHand = { hand: Hand; rank: Rank };

const getCardValue = (card: Card): number => {
  const values: Record<Card, number> = {
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    J: 11,
    Q: 12,
    K: 13,
    A: 14,
  };
  return values[card];
};

const getHandTypeValue = (handType: HandType): number => {
  const values: Record<HandType, number> = {
    "Five of a kind": 7,
    "Four of a kind": 6,
    "Full house": 5,
    "Three of a kind": 4,
    "Two pair": 3,
    "One pair": 2,
    "High card": 1,
  };
  return values[handType];
};

const getHand = (rawHand: RawHand): Hand => {
  const hand = rawHand.split("");
  if (hand.length !== 5) {
    console.log(hand);
    throw new Error("Invalid hand");
  }
  return hand as Hand;
};
it("gets hand", () => {
  expect(getHand("32T3K")).toEqual(["3", "2", "T", "3", "K"]);
});

const getRawHand = (hand: Hand): RawHand => {
  return hand.join("") as RawHand;
};
it("gets raw hand", () => {
  expect(getRawHand(["3", "2", "T", "3", "K"])).toBe("32T3K");
});

const parseInput = (input: string): Player[] => {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [hand, bid] = line.split(" ");
      return { hand: getHand(hand!), bid: parseInt(bid!) };
    });
};
it("parses input", () => {
  expect(parseInput(sampleInput)).toEqual([
    { hand: getHand("32T3K"), bid: 765 },
    { hand: getHand("T55J5"), bid: 684 },
    { hand: getHand("KK677"), bid: 28 },
    { hand: getHand("KTJJT"), bid: 220 },
    { hand: getHand("QQQJA"), bid: 483 },
  ] satisfies Player[]);
});

const getHandType = (hand: Hand): HandType => {
  const counts = hand.reduce((counts, card) => {
    counts[card] = (counts[card] || 0) + 1;
    return counts;
  }, {} as Record<Card, number>);
  const countsCounts = Object.values(counts).reduce((countsCounts, count) => {
    countsCounts[count] = (countsCounts[count] || 0) + 1;
    return countsCounts;
  }, {} as Record<number, number>);
  if (countsCounts[5]) {
    return "Five of a kind";
  }
  if (countsCounts[4]) {
    return "Four of a kind";
  }
  if (countsCounts[3] && countsCounts[2]) {
    return "Full house";
  }
  if (countsCounts[3]) {
    return "Three of a kind";
  }
  if (countsCounts[2] === 2) {
    return "Two pair";
  }
  if (countsCounts[2]) {
    return "One pair";
  }
  return "High card";
};
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

// based on the value of the first cards, or second cards if the first cards are equal, and so on.
const strongestOfTheSameType = (hand1: Hand, hand2: Hand): Hand => {
  const handType1 = getHandType(hand1);
  const handType2 = getHandType(hand2);
  if (handType1 !== handType2) {
    throw new Error("Hand types must be the same");
  }
  for (let i = 0; i < 5; i++) {
    const card1 = hand1[i]!;
    const card2 = hand2[i]!;
    if (card1 === card2) {
      continue;
    }
    return getCardValue(card1) > getCardValue(card2) ? hand1 : hand2;
  }

  throw new Error("Hands must be different");
};
it("compares same hand types", () => {
  const tests: [RawHand, RawHand, RawHand][] = [
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

const rankHands = (hands: Hand[]): RankedHand[] => {
  const sortedHands = hands.sort((hand1, hand2) => {
    const handType1 = getHandType(hand1);
    const handType2 = getHandType(hand2);
    if (handType1 !== handType2) {
      return getHandTypeValue(handType1) - getHandTypeValue(handType2);
    }
    const strongestHand = strongestOfTheSameType(hand1, hand2);
    return strongestHand === hand1 ? 1 : -1;
  });
  return sortedHands.map((hand, index) => ({
    hand,
    rank: index + 1,
  }));
};
it("ranks hands", () => {
  const hands = parseInput(sampleInput).map((player) => player.hand);
  const result = rankHands(hands);
  type ExpectedRankedHand = { rawHand: RawHand; rank: Rank };
  expect(
    result.map((rankedHand) => ({
      rawHand: getRawHand(rankedHand.hand),
      rank: rankedHand.rank,
    }))
  ).toEqual([
    { rawHand: "32T3K", rank: 1 },
    { rawHand: "KTJJT", rank: 2 },
    { rawHand: "KK677", rank: 3 },
    { rawHand: "T55J5", rank: 4 },
    { rawHand: "QQQJA", rank: 5 },
  ] satisfies ExpectedRankedHand[]);
});

const calculateWinnings = (
  players: Player[],
  rankedHands: RankedHand[]
): number => {
  return players.reduce((total, player) => {
    const rankedHand = rankedHands.find(
      (rankedHand) => rankedHand.hand === player.hand
    );
    if (!rankedHand) {
      throw new Error("Player hand not found");
    }
    return total + player.bid * rankedHand.rank;
  }, 0);
};
it("calculates winnings", () => {
  const players = parseInput(sampleInput);
  const rankedHands = rankHands(players.map((player) => player.hand));
  expect(calculateWinnings(players, rankedHands)).toBe(6440);
});

const main = (input: string) => {
  const players = parseInput(input);
  const rankedHands = rankHands(players.map((player) => player.hand));
  const winnings = calculateWinnings(players, rankedHands);
  return winnings;
};

it("works for example input", () => {
  expect(main(sampleInput)).toBe(6440);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  expect(main(input)).toBe(253638586);
});
