import { readFile } from "fs/promises";
import { join } from "path";
import { main } from "./5-2-bad.code";

(async () => {
  const input = await readFile(join(__dirname, "5.input.txt"), "utf-8");
  console.log(main(input));
})();
