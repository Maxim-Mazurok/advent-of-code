export const parseInput = (input: string) => {
  return input.replace(/\n/g, "").split(",");
};

export const main = (input: string) => {
  const inputs = parseInput(input);
  const result = inputs.map(hash).reduce((a, b) => a + b, 0);
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
