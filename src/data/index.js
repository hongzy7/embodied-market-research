import data from './companies.json' with { type: 'json' };
export const importMeta = data.meta;
export const companies = data.companies;
export const routeOptions = [...new Set(companies.flatMap(company => company.routes))].sort();
export const scenarioOptions = [...new Set(companies.flatMap(company => company.scenarios))].sort();
export const capitalLabels = {5: '超大规模 / 平台级', 4: '亿美元或十亿元级', 3: '数千万美元级', 2: '早期融资', 1: '未披露'};
