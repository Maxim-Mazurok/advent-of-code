type Direction = "R" | "L";
type NodeName = string;
type Node = {
  name: NodeName;
  right: NodeName;
  left: NodeName;
};

export const parseInput = (
  input: string
): {
  directions: Direction[];
  nodes: Node[];
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

  return { directions, nodes };
};

export const main = (input: string) => {
  const { directions, nodes } = parseInput(input);

  let directionsNumber = directions.length;
  let currentNodeName = "AAA";
  let steps = 0;
  do {
    const currentDirection = directions[steps % directionsNumber];
    // console.log(currentNodeName, steps, currentDirection);

    if (currentDirection === "R") {
      currentNodeName = nodes.find(
        (node) => node.name === currentNodeName
      )!.right;
    } else {
      currentNodeName = nodes.find(
        (node) => node.name === currentNodeName
      )!.left;
    }
    steps++;
  } while (currentNodeName !== "ZZZ");

  // console.log(currentNodeName);

  return steps;
};
