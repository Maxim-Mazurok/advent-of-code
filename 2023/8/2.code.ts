type Direction = "R" | "L";
type NodeName = string;
type Node = {
  name: NodeName;
  right: NodeName;
  left: NodeName;
};
type NodeMap = Map<
  NodeName,
  {
    right: NodeName;
    left: NodeName;
  }
>;

export const parseInput = (
  input: string
): {
  directions: Direction[];
  nodeMap: NodeMap;
} => {
  const lines = input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const directions = lines[0]!.split("") as Direction[];
  const nodes = lines.slice(1).map((line) => {
    const [name, leftRight] = line.split(" = ");
    const [left, right] = leftRight!
      .slice(1, -1)
      .split(", ")
      .map((name) => name.trim()) as [NodeName, NodeName];
    return { name: name!, right, left };
  });

  const nodeMap = new Map<NodeName, { right: NodeName; left: NodeName }>();
  nodes.forEach((node) => nodeMap.set(node.name, node));

  return { directions, nodeMap };
};

type Pattern = [NodeName, Direction][];
type DirectionIndex = number;

export const getNodePattern = (
  directions: Direction[],
  nodeMap: NodeMap,
  startingNodeName: NodeName
): {
  wholePattern: Pattern;
  cycleStartIndex: number;
} => {
  let currentNodeName = startingNodeName;
  const wholePattern: Pattern = [];
  let steps = 0;
  let cycleStartIndex = -1;
  const directionsNumber = directions.length;
  const seenNodesAtDirection = new Map<
    `${NodeName}-${DirectionIndex}`,
    number
  >();

  do {
    const directionIndex: DirectionIndex = steps % directionsNumber;
    const currentDirection = directions[directionIndex]!;

    if (seenNodesAtDirection.has(`${currentNodeName}-${directionIndex}`)) {
      cycleStartIndex = seenNodesAtDirection.get(
        `${currentNodeName}-${directionIndex}`
      )!;
      break;
    }
    seenNodesAtDirection.set(`${currentNodeName}-${directionIndex}`, steps);

    wholePattern.push([currentNodeName, currentDirection]);
    const node = nodeMap.get(currentNodeName)!;
    const { right, left } = node;
    if (currentDirection === "R") {
      currentNodeName = right;
    } else if (currentDirection === "L") {
      currentNodeName = left;
    }

    steps++;
  } while (true);

  return { wholePattern, cycleStartIndex };
};

const leastCommonMultiple = (a: number, b: number) => {
  let [x, y] = [a, b];
  while (y !== 0) {
    [x, y] = [y, x % y];
  }
  return (a * b) / x;
};

export const commonMultiplesOfArrays = (
  array1: number[],
  array2: number[]
): number[] => {
  const result: number[] = [];
  for (const a of array1) {
    for (const b of array2) {
      result.push(leastCommonMultiple(a, b));
    }
  }
  return [...new Set(result)];
};

export const main = (input: string) => {
  const { directions, nodeMap } = parseInput(input);

  const nodesEndWithA = Array.from(nodeMap.keys()).filter((name) =>
    name.endsWith("A")
  );

  const nodePatterns = [];
  for (const node of nodesEndWithA) {
    const nodePattern = getNodePattern(directions, nodeMap, node);
    // console.log(nodePattern);
    nodePatterns.push(nodePattern);
  }

  const arraysOfNumbers: number[][] = [];

  for (const nodePattern of nodePatterns) {
    const { wholePattern, cycleStartIndex } = nodePattern;
    const nonRepeatedPattern = wholePattern.slice(0, cycleStartIndex);
    // console.log({ nonRepeatedPattern });
    const repeatingPattern = wholePattern.slice(cycleStartIndex);
    const nodesEndWithZIndexes = repeatingPattern
      .map(([nodeName], index) => [nodeName, index])
      .filter(([nodeName]) => (nodeName as string).endsWith("Z"))
      .map(([, index]) => index as number)
      .map((x) => x + cycleStartIndex);

    // console.log({ nodesEndWithZIndexes });

    arraysOfNumbers.push(nodesEndWithZIndexes);
  }

  let commonMultiples: number[] = arraysOfNumbers[0]!;
  for (let i = 1; i < arraysOfNumbers.length; i++) {
    commonMultiples = commonMultiplesOfArrays(
      arraysOfNumbers[i]!,
      commonMultiples
    );
  }

  // console.log({ commonMultiples });

  return Math.min(...commonMultiples);

  // console.log(getNodePattern(directions, nodeMap, "11A"));

  // return steps;
};
