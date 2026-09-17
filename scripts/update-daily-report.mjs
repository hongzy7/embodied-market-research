import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const inputPath = process.argv[2];
if (!inputPath) throw new Error('Usage: node scripts/update-daily-report.mjs <report.json>');
const report = JSON.parse(readFileSync(resolve(inputPath), 'utf8'));
const required = ['reportDate','title','windowStart','windowEnd','generatedAt','keywords','takeaways','companyUpdates','industryUpdates','comparison','capitalMarket','disclaimer'];
for (const key of required) if (!(key in report)) throw new Error(`Missing report field: ${key}`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(report.reportDate)) throw new Error('Invalid reportDate');
const expectedEnd = `${report.reportDate}T18:00:00+08:00`;
const end = new Date(expectedEnd);
const prior = new Date(end.getTime() - 24 * 60 * 60 * 1000);
const expectedStart = new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(prior) + 'T18:00:00+08:00';
if (report.windowEnd !== expectedEnd || report.windowStart !== expectedStart) throw new Error(`Window must be ${expectedStart} to ${expectedEnd}`);
if (new Date(report.generatedAt).getTime() < end.getTime() || new Date(report.generatedAt).getTime() > end.getTime() + 90*60*1000) throw new Error('generatedAt must be between 18:00 and 19:30 Beijing time');
if (!Array.isArray(report.takeaways) || report.takeaways.length > 8) throw new Error('takeaways must contain at most 8 items');
if (!Array.isArray(report.keywords) || report.keywords.length < 2 || report.keywords.length > 8) throw new Error('keywords must contain 2 to 8 concise items');
const urlFields=[];
for (const item of [...report.takeaways,...report.companyUpdates]) if (item.source?.url) urlFields.push(item.source.url);
for (const url of urlFields) if (!/^https:\/\//.test(url)) throw new Error('Sources must use HTTPS URLs');
const forbidden = [
  '客户备注',
  '跟进策略',
  '跟进状态',
  '联系人',
  '手机号码',
  '内部报价',
  '合作优先级',
  '建议动作',
  '7轴机会',
  '对华沿而言',
  '华沿应',
];
const serialized=JSON.stringify(report);
for(const term of forbidden) if(serialized.includes(term)) throw new Error(`Public report includes forbidden internal field: ${term}`);
const destination=resolve('src/data/daily-reports.json');
const existing=JSON.parse(readFileSync(destination,'utf8'));
const next=[report,...existing.filter(item=>item.reportDate!==report.reportDate)].sort((a,b)=>b.reportDate.localeCompare(a.reportDate));
writeFileSync(destination,JSON.stringify(next,null,2)+'\n','utf8');
writeFileSync(resolve('data/reports', `${report.reportDate}.public.json`), JSON.stringify(report,null,2)+'\n','utf8');
console.log(JSON.stringify({reportDate:report.reportDate,totalReports:next.length,windowStart:report.windowStart,windowEnd:report.windowEnd}));
