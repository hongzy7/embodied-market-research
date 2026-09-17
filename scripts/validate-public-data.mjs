import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const forbiddenTerms = [
  "客户备注",
  "跟进策略",
  "跟进状态",
  "联系人",
  "手机号码",
  "内部报价",
  "合作优先级",
  "record_id",
  "recordId",
  "feishuRecords",
];

const dataFiles = [
  resolve("src/data/companies.json"),
  resolve("src/data/daily-reports.json"),
  ...readdirSync(resolve("data/reports"))
    .filter((name) => name.endsWith(".public.json"))
    .map((name) => resolve("data/reports", name)),
];

for (const file of dataFiles) {
  const contents = readFileSync(file, "utf8");
  JSON.parse(contents);
  for (const term of forbiddenTerms) {
    if (contents.includes(term)) {
      throw new Error(`${file} contains forbidden public-data field: ${term}`);
    }
  }
}

const companies = JSON.parse(readFileSync(resolve("src/data/companies.json"), "utf8"));
if (!Array.isArray(companies.companies) || companies.companies.length === 0) {
  throw new Error("Company data must contain a non-empty companies array.");
}

const reports = JSON.parse(readFileSync(resolve("src/data/daily-reports.json"), "utf8"));
if (!Array.isArray(reports)) throw new Error("Daily reports must be an array.");
for (const report of reports) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(report.reportDate || "")) {
    throw new Error(`Invalid report date: ${report.reportDate}`);
  }
}

console.log(`Validated ${companies.companies.length} companies and ${reports.length} daily reports.`);
