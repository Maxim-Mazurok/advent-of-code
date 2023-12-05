import dedent from "dedent";
import { readFile } from "fs/promises";
import { join } from "path";
import { expect, it } from "vitest";

const main = (input: string) => {
  const lines = input.split("\n");
  const cardCopies: { [card: number]: number } = {};

  const data = lines.map((line) => {
    const regex =
      /^Card\s+(?<card>\d+): (?<winningNumbers>(?:\s*\d+)+) \| (?<elfNumbers>(?:\s*\d+)+)$/;
    const matches = line.match(regex);
    const { card, winningNumbers, elfNumbers } = matches!.groups!;

    const cardNumber = Number(card);

    cardCopies[cardNumber] = 1;

    const winningNumbersArray = winningNumbers!.trim().split(/\s+/).map(Number);
    if (
      winningNumbersArray.length !== [...new Set(winningNumbersArray)].length
    ) {
      throw new Error("Duplicate winning numbers");
    }

    const elfNumbersArray = elfNumbers!.trim().split(/\s+/).map(Number);
    if (elfNumbersArray.length !== [...new Set(elfNumbersArray)].length) {
      throw new Error("Duplicate elf numbers");
    }

    return {
      card: cardNumber,
      winningNumbers: winningNumbersArray,
      elfNumbers: elfNumbersArray,
    };
  });

  // console.table(data);

  for (const { card, winningNumbers, elfNumbers } of data) {
    let currentCardWins = 0;
    for (const elfNumber of elfNumbers) {
      if (winningNumbers.includes(elfNumber)) {
        currentCardWins++;
      }
    }
    if (currentCardWins !== 0) {
      for (let i = 1; i <= currentCardWins; i++) {
        // console.log(
        //   `Card ${card} wins ${card + i} card ${cardCopies[card]} times`
        // );
        cardCopies[card + i] += cardCopies[card]!;
      }
    }
  }

  // console.table(cardCopies);

  return Object.values(cardCopies).reduce((acc, curr) => acc + curr, 0);
};

it("works for example input", () => {
  const input = dedent(`
    Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
    Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
    Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
    Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
    Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
    Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
  `);
  expect(main(input)).toBe(30);
});

it("works for real input", async () => {
  const input = await readFile(join(__dirname, "4.input.txt"), "utf-8");
  expect(main(input)).toBe(5920640);
});
