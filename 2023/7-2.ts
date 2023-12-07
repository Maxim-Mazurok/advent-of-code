import { readFile } from "fs/promises";
import { join } from "path";
import { main } from "./7-2.code";

(async () => {
  const input = await readFile(join(__dirname, "7.input.txt"), "utf-8");
  console.log(main(input));
})();
