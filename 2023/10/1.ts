import { readFile } from "fs/promises";
import { join } from "path";
import {
  buildGraph,
  findLongestPath,
  main,
  parseInput,
  renderNodes,
} from "./1.code";

(async () => {
  const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  console.log(main(input));

  // const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  // const nodes = parseInput(input);
  // console.log(renderNodes(nodes));
  // console.log("==========");

  // const graph = buildGraph(nodes);
  // const start = nodes.find((node) => node.value === "S")!;
  // const longestPath = findLongestPath(graph, start);

  // console.log(renderNodes(longestPath));
})();
