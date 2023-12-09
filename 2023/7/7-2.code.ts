export type Card =
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
export type Bid = number;
export type RawHand = string;
export type Hand = [Card, Card, Card, Card, Card];
export type Player = { hand: Hand; bid: Bid };
export type HandType =
  | "Five of a kind"
  | "Four of a kind"
  | "Full house"
  | "Three of a kind"
  | "Two pair"
  | "One pair"
  | "High card";
export type Rank = number;
export type RankedHand = { hand: Hand; rank: Rank };

export const getCardValue = (card: Card): number => {
  const values: Record<Card, number> = {
    J: 1,
    "2": 2,
    "3": 3,
    "4": 4,
    "5": 5,
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    T: 10,
    Q: 11,
    K: 12,
    A: 13,
  };
  return values[card];
};

export const getHandTypeValue = (handType: HandType): number => {
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

export const getHand = (rawHand: RawHand): Hand => {
  const hand = rawHand.split("");
  if (hand.length !== 5) {
    console.log(hand);
    throw new Error("Invalid hand");
  }
  return hand as Hand;
};

export const getRawHand = (hand: Hand): RawHand => {
  return hand.join("") as RawHand;
};

export const parseInput = (input: string): Player[] => {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const [hand, bid] = line.split(" ");
      return { hand: getHand(hand!), bid: parseInt(bid!) };
    });
};

export const getHandType = (hand: Hand): HandType => {
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

export const getBestHandType = (hand: Hand): HandType => {
  if (!hand.includes("J")) {
    return getHandType(hand);
  }

  // any of J can now represent any other card
  const possibleHands: Hand[] = [];
  const allNonJCards: Exclude<Card, "J">[] = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "T",
    "Q",
    "K",
    "A",
  ];

  const JIndexes = hand.reduce((indexes, card, index) => {
    if (card === "J") {
      indexes.push(index);
    }
    return indexes;
  }, [] as number[]);

  const replaceJWith = (hand: Hand, replacements: Exclude<Card, "J">[]) => {
    if (!hand.includes("J")) {
      return [hand];
    }
    // console.log({ hand, replacements });
    const newHands: Hand[] = [];
    replacements.forEach((replacement) => {
      const handCopy = [...hand] as Hand;
      handCopy[handCopy.indexOf("J")] = replacement;
      if (handCopy.includes("J")) {
        // console.log(handCopy);
        replaceJWith(handCopy, replacements);
      } else {
        possibleHands.push(handCopy);
      }
    });
  };
  replaceJWith(hand, allNonJCards);

  // console.log(hand, possibleHands);

  const rankedHands = rankHands(possibleHands);

  // console.log(JSON.stringify(rankedHands, null, 2));

  const bestRankedHand = rankedHands[rankedHands.length - 1]!;

  // console.log({ bestRankedHand });

  return getHandType(bestRankedHand.hand);
};

// based on the value of the first cards, or second cards if the first cards are equal, and so on.
export const strongestOfTheSameType = (hand1: Hand, hand2: Hand): Hand => {
  for (let i = 0; i < 5; i++) {
    const hand1card = hand1[i]!;
    const hand2card = hand2[i]!;
    if (hand1card === hand2card) {
      continue;
    }
    return getCardValue(hand1card) > getCardValue(hand2card) ? hand1 : hand2;
  }

  return hand1;
  // throw new Error("Hands must be different");
};

export const rankHands = (hands: Hand[], best = false): RankedHand[] => {
  const sortedHands = hands.sort((hand1, hand2) => {
    const handType1 = best ? getBestHandType(hand1) : getHandType(hand1);
    const handType2 = best ? getBestHandType(hand2) : getHandType(hand2);
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

export const calculateWinnings = (
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

export const main = (input: string) => {
  const players = parseInput(input);
  const rankedHands = rankHands(
    players.map((player) => player.hand),
    true
  );
  const winnings = calculateWinnings(players, rankedHands);
  return winnings;
};
