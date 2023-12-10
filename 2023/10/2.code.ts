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
    ".": "*",
  };

  const output = [];
  for (let y = 0; y <= maxY; y++) {
    const line = [];
    for (let x = 0; x <= maxX; x++) {
      const node = nodes.find((node) => node.x === x && node.y === y);
      if (node) {
        line.push(pipeMap[node.value] ?? node.value);
      } else {
        line.push("`");
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
  const graphOfGround = buildGraphOfGround(nodes);
  // console.log({ graphOfGround });
  const nodesInsideLoop = findNodesInsideLoop(graphOfGround, longestPath);

  return nodesInsideLoop;
};

type Graph = Map<Node, Node[]>;

export const buildGraph = (nodes: Node[]): Graph => {
  const graph = new Map<Node, Node[]>();
  for (const node of nodes) {
    // if (node.value === ".") {
    //   continue;
    // }
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
    // console.log(node, graph.get(node));
    for (const neighbour of graph.get(node)!) {
      visit(neighbour);
    }
    path.pop();
  };
  visit(start);
  // console.log("longestPath");
  // console.log(renderNodes(longestPath));
  return longestPath;
};

export const isPointInsidePolygon = (
  point: Node,
  graph: Graph,
  polygon: Node[]
): boolean => {
  let topWallsCrossed = 0;
  let bottomWallsCrossed = 0;
  const maxGraphX = Math.max(...[...graph.keys()].map((node) => node.x));

  for (let x = point.x; x < maxGraphX + 1; x++) {
    const currentPointOnPolygon = polygon.find(
      (node) => node.x === x && node.y === point.y
    );
    // console.log({ point, currentPointOnPolygon });
    if (
      ["|", "L", "F", "J", "7"].includes(currentPointOnPolygon?.value ?? "")
    ) {
      if (["|"].includes(currentPointOnPolygon?.value ?? "")) {
        topWallsCrossed++;
        bottomWallsCrossed++;
      }

      if (["L", "J"].includes(currentPointOnPolygon?.value ?? "")) {
        topWallsCrossed++;
      }

      if (["F", "7"].includes(currentPointOnPolygon?.value ?? "")) {
        bottomWallsCrossed++;
      }
    }
  }
  return topWallsCrossed % 2 === 1 && bottomWallsCrossed % 2 === 1;
};

const lineIntersection = (
  line1: { x1: number; y1: number; x2: number; y2: number },
  line2: { x1: number; y1: number; x2: number; y2: number }
): { x: number; y: number } | null => {
  const denominator =
    (line2.y2 - line2.y1) * (line1.x2 - line1.x1) -
    (line2.x2 - line2.x1) * (line1.y2 - line1.y1);
  if (denominator === 0) {
    return null;
  }
  const ua =
    ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) -
      (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) /
    denominator;
  const ub =
    ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) -
      (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) /
    denominator;
  if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
    return null;
  }
  const x = line1.x1 + ua * (line1.x2 - line1.x1);
  const y = line1.y1 + ua * (line1.y2 - line1.y1);
  return { x, y };
};

export const findNodesInsideLoop = (graph: Graph, loop: Node[]): number => {
  // const firstNodeOfGraph = [...graph.keys()][0]!;

  // // console.log(firstNodeOfGraph);

  // const startingNode: Node = firstNodeOfGraph;
  // const visited = new Set<Node>();

  // const visit = (node: Node) => {
  //   if (visited.has(node)) {
  //     return;
  //   }
  //   visited.add(node);
  //   // console.log(graph.get(node)!);
  //   for (const neighbour of graph.get(node)!) {
  //     // console.log({ neighbour });
  //     if (!loop.find((loopNode) => loopNode === neighbour)) {
  //       visit(neighbour);
  //     }
  //   }
  // };

  // visit(startingNode);

  // // console.log(renderNodes([...visited]));

  const nonVisited = new Set<Node>();
  // const nonVisit = (node: Node) => {
  //   if (
  //     nonVisited.has(node) ||
  //     visited.has(node) ||
  //     loop.find((loopNode) => loopNode === node)
  //   ) {
  //     return;
  //   }
  //   nonVisited.add(node);
  //   // console.log(graph.get(node)!);
  //   for (const neighbour of graph.get(node)!) {
  //     // console.log({ neighbour });
  //     nonVisit(neighbour);
  //   }
  // };

  // visit(startingNode);

  // for (const node of loop) {
  //   const neighbours = graph.get(node)!;
  //   if (node.value === "|") {
  //     const rightNeighbour = neighbours.find(
  //       (neighbour) => neighbour.x > node.x
  //     );
  //     const leftNeighbour = neighbours.find(
  //       (neighbour) => neighbour.x < node.x
  //     );
  //     if (rightNeighbour?.value === "." && leftNeighbour?.value === ".") {
  //       if (visited.has(rightNeighbour) && leftNeighbour) {
  //         nonVisit(leftNeighbour);
  //       }
  //       if (visited.has(leftNeighbour) && rightNeighbour) {
  //         nonVisit(rightNeighbour);
  //       }
  //     }
  //   } else if (node.value === "-") {
  //     const topNeighbour = neighbours.find((neighbour) => neighbour.y < node.y);
  //     const bottomNeighbour = neighbours.find(
  //       (neighbour) => neighbour.y > node.y
  //     );
  //     if (topNeighbour?.value === "." && bottomNeighbour?.value === ".") {
  //       if (visited.has(topNeighbour) && bottomNeighbour) {
  //         nonVisit(bottomNeighbour);
  //       }
  //       if (visited.has(bottomNeighbour) && topNeighbour) {
  //         nonVisit(topNeighbour);
  //       }
  //     }
  //   }
  // }

  // const notVisitedDots: Node[] = [];
  // for (const node of graph.keys()) {
  //   if (node.value === ".") {
  //     if (!visited.has(node)) {
  //       notVisitedDots.push(node);
  //       nonVisit(node);
  //     }
  //   }
  // }

  const maxGraphX = Math.max(...[...graph.keys()].map((node) => node.x));
  const maxGraphY = Math.max(...[...graph.keys()].map((node) => node.y));

  for (let x = 0; x <= maxGraphX; x++) {
    for (let y = 0; y <= maxGraphY; y++) {
      const node = [...graph.keys()].find(
        (node) => node.x === x && node.y === y
      );
      if (
        node &&
        !loop.find((loopNode) => loopNode.x === x && loopNode.y === y)
      ) {
        // console.log(node);
        if (isPointInsidePolygon(node, graph, loop)) {
          // console.log(node);
          // node.value = "$";
          nonVisited.add(node);
        }
        // nonVisit(node);
      }
    }
  }

  // console.log("notVisitedDots\n", renderNodes(notVisitedDots));

  // console.log("nonVisited");
  // console.log(renderNodes([...nonVisited]));

  return [...nonVisited].length;
};

export const buildGraphOfGround = (nodes: Node[]): Graph => {
  const graph = new Map<Node, Node[]>();
  for (const node of nodes) {
    // if (node.value === ".") {
    //   continue;
    // }
    const neighbors = nodes
      .filter(
        (otherNode) =>
          (otherNode.x === node.x && Math.abs(otherNode.y - node.y) === 1) ||
          (otherNode.y === node.y && Math.abs(otherNode.x - node.x) === 1)
      )
      .map((otherNode) => ({
        ...otherNode,
        value: otherNode.value === "S" ? "|" : otherNode.value,
      }));
    // .filter((otherNode) => otherNode.value === ".");
    if (node.value === "S") node.value = "|"; // lol
    graph.set(node, neighbors);
  }
  return graph;
};
