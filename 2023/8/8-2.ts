import { readFile } from "fs/promises";
import { join } from "path";
import { main } from "./8-2.code";

(async () => {
  const input = await readFile(join(__dirname, "8.input.txt"), "utf-8");
  console.log(main(input));
})();
