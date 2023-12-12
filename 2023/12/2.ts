import { readFile } from "fs/promises";
import { join } from "path";
import { main } from "./2.code";

(async () => {
  const input = "???.###, 1,1,3";
  // const input = await readFile(join(__dirname, "input.txt"), "utf-8");
  console.log(main(input));
})();
