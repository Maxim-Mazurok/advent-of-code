type NodeValue = "S" | "|" | "-" | "L" | "J" | "7" | "F" | ".";
export type Node = {
  value: NodeValue;
  x: number;
  y: number;
};

export const parseInput = (input: string): Node[] => {
  const lines = input.split("\n").map((line) => line.trim());
  const nodes: Node[] = [];
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y]!;
    for (let x = 0; x < line.length; x++) {
      const value = line[x]! as NodeValue;
      nodes.push({ value, x, y });
    }
  }
  return nodes;
};

export const renderNodes = (nodes: Node[]): string => {
  const maxX = Math.max(...nodes.map((node) => node.x));
  const maxY = Math.max(...nodes.map((node) => node.y));

  const pipeMap: Record<NodeValue, string> = {
    "|": "│",
    "-": "─",
    "7": "┐",
    L: "└",
    J: "┘",
    F: "┌",
    S: "×",
    ".": " ",
  };

  const output = [];
  for (let y = 0; y <= maxY; y++) {
    const line = [];
    for (let x = 0; x <= maxX; x++) {
      const node = nodes.find((node) => node.x === x && node.y === y);
      if (node) {
        line.push(pipeMap[node.value] ?? node.value);
      } else {
        line.push(" ");
      }
    }
    output.push(line.join(""));
  }
  return output.join("\n");
};

export const main = (input: string) => {
  const nodes = parseInput(input);
  const graph = buildGraph(nodes);
  const start = nodes.find((node) => node.value === "S")!;
  const longestPath = findLongestPath(graph, start);
  return longestPath.length / 2;
};

type Graph = Map<Node, Node[]>;

export const buildGraph = (nodes: Node[]): Graph => {
  const graph = new Map<Node, Node[]>();
  for (const node of nodes) {
    if (node.value === ".") {
      continue;
    }
    const neighbors = nodes
      .filter(
        (otherNode) =>
          (otherNode.x === node.x && Math.abs(otherNode.y - node.y) === 1) ||
          (otherNode.y === node.y && Math.abs(otherNode.x - node.x) === 1)
      )
      .filter((otherNode) => nodesConnected([node, otherNode]));
    graph.set(node, neighbors);
  }
  return graph;
};

type NodeConnectionPoint = "top" | "right" | "bottom" | "left";
export const nodeConnectionPoints = (node: Node): NodeConnectionPoint[] => {
  if (node.value === "S") {
    return ["top", "right", "bottom", "left"];
  }
  if (node.value === "7") {
    return ["left", "bottom"];
  }
  if (node.value === "L") {
    return ["top", "right"];
  }
  if (node.value === "J") {
    return ["top", "left"];
  }
  if (node.value === "-") {
    return ["left", "right"];
  }
  if (node.value === "|") {
    return ["top", "bottom"];
  }
  if (node.value === "F") {
    return ["right", "bottom"];
  }
  return [];
};

export const nodesConnected = (nodes: [Node, Node]): boolean => {
  const [nodeA, nodeB] = nodes;
  const connectionPointsA = nodeConnectionPoints(nodeA);
  const connectionPointsB = nodeConnectionPoints(nodeB);
  if (nodeA.x === nodeB.x) {
    if (nodeA.y < nodeB.y) {
      return (
        connectionPointsA.includes("bottom") &&
        connectionPointsB.includes("top")
      );
    } else if (nodeA.y > nodeB.y) {
      return (
        connectionPointsA.includes("top") &&
        connectionPointsB.includes("bottom")
      );
    }
  }
  if (nodeA.y === nodeB.y) {
    if (nodeA.x < nodeB.x) {
      return (
        connectionPointsA.includes("right") &&
        connectionPointsB.includes("left")
      );
    } else if (nodeA.x > nodeB.x) {
      return (
        connectionPointsA.includes("left") &&
        connectionPointsB.includes("right")
      );
    }
  }
  return false;
};

export const findLongestPath = (graph: Graph, start: Node): Node[] => {
  const visited = new Set<Node>();
  const path: Node[] = [];
  let longestPath: Node[] = [];
  const visit = (node: Node) => {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    path.push(node);
    if (path.length > longestPath.length) {
      longestPath = [...path];
    }
    for (const neighbour of graph.get(node)!) {
      visit(neighbour);
    }
    path.pop();
  };
  visit(start);
  // console.log(renderNodes(longestPath));
  return longestPath;
};
