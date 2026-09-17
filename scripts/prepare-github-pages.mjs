import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const output = resolve("dist");
const index = resolve(output, "index.html");
const routes = ["landscape", "directory", "daily", "capital", "arms"];
const reports = JSON.parse(readFileSync(resolve("src/data/daily-reports.json"), "utf8"));
routes.push(...reports.map((report) => `daily/${report.reportDate}`));

for (const route of routes) {
  const directory = resolve(output, route);
  mkdirSync(directory, { recursive: true });
  copyFileSync(index, resolve(directory, "index.html"));
}

copyFileSync(index, resolve(output, "404.html"));
writeFileSync(resolve(output, ".nojekyll"), "", "utf8");
console.log(`Prepared GitHub Pages output with ${routes.length} routes.`);
