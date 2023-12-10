type Sequence = number[];

export const parseInput = (input: string): Sequence[] => {
  return input.split("\n").map((line) => line.split(" ").map(Number));
};

export const main = (input: string) => {
  const sequences = parseInput(input);
  const nextValues = sequences.map(predictNextValue);
  // console.log(nextValues)
  const nextValuesSum = nextValues.reduce((a, b) => a + b, 0);
  return nextValuesSum;
};

export const getSequenceDiffs = (sequence: Sequence): Sequence => {
  const diffs: Sequence = [];
  for (let i = 0; i < sequence.length - 1; i++) {
    diffs.push(sequence[i + 1]! - sequence[i]!);
  }
  return diffs;
};

export const extrapolateFromDiffs = (sequenceDiffs: Sequence[]): number => {
  for (let i = sequenceDiffs.length - 2; i >= 1; i--) {
    const lastSequence = sequenceDiffs[i + 1]!;
    const lastValue = lastSequence[lastSequence.length - 1]!;

    const nextSequenceIndex = i - 1;
    const nextSequence = sequenceDiffs[nextSequenceIndex]!;
    const nextValue = nextSequence[nextSequence.length - 1]!;

    const currentSequence = sequenceDiffs[i]!;
    const currentValue = currentSequence[currentSequence.length - 1]!;

    const nextValuePredicted = nextValue + currentValue;

    // console.log({
    //   lastValue,
    //   lastSequence,
    //   currentValue,
    //   currentSequence,
    //   nextValue,
    //   nextSequence,
    //   nextValuePredicted,
    // });

    sequenceDiffs[nextSequenceIndex]!.push(nextValuePredicted);
  }

  return sequenceDiffs[0]![sequenceDiffs[0]!.length - 1]!;
};

export const predictNextValue = (sequence: Sequence): number => {
  let sequenceDiffs: Sequence[] = [sequence];
  do {
    sequenceDiffs.push(
      getSequenceDiffs(sequenceDiffs[sequenceDiffs.length - 1]!)
    );
  } while (sequenceDiffs[sequenceDiffs.length - 1]!.find((n) => n !== 0));

  // console.log(sequenceDiffs);

  return extrapolateFromDiffs(sequenceDiffs);
};
