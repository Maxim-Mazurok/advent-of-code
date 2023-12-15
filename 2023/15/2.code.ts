export const parseInput = (input: string) => {
  return input.replace(/\n/g, "").split(",");
};

type Box = [string, number][]; // [label, focalLength][]
type BoxMap = { [key: number]: Box };
export const processSteps = (inputs: string[]): BoxMap => {
  const result: BoxMap = {};
  for (const input of inputs) {
    if (input.includes("=")) {
      const [label, _focalLength] = input.split("=") as [string, string];
      const focalLength = parseInt(_focalLength);
      const boxLabel = hash(label);
      if (!result[boxLabel]) {
        result[boxLabel] = [];
      }
      const lensIndex = result[boxLabel]!.findIndex(
        ([_label]) => _label === label
      );
      if (lensIndex !== -1) {
        result[boxLabel]![lensIndex]![1] = focalLength;
      } else {
        result[boxLabel]!.push([label, focalLength]);
      }
    } else if (input.endsWith("-")) {
      const label = input.slice(0, -1);
      const boxLabel = hash(label);
      const lensIndex = result[boxLabel]?.findIndex(
        ([_label]) => _label === label
      );
      if (lensIndex !== undefined && lensIndex !== -1) {
        result[boxLabel]!.splice(lensIndex, 1);
      }
    }
  }
  return result;
};

export const main = (input: string) => {
  const inputs = parseInput(input);
  const boxMap = processSteps(inputs);

  let result = 0;
  for (const [boxLabel, box] of Object.entries(boxMap)) {
    for (let lensIndex = 0; lensIndex < box.length; lensIndex++) {
      const [, focalLength] = box[lensIndex]!;
      result += (parseInt(boxLabel) + 1) * (lensIndex + 1) * focalLength;
    }
  }

  return result;
};

export const hash = (input: string) => {
  let currentValue = 0;
  for (const char of input) {
    currentValue += char.charCodeAt(0);
    currentValue *= 17;
    currentValue %= 256;
  }
  return currentValue;
};
