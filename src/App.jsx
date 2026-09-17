"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  ExternalLink,
  Filter,
  Globe2,
  Layers3,
  ListFilter,
  Menu,
  Search,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { companies, routeOptions, scenarioOptions, capitalLabels, importMeta } from "./data/index.js";
import dailyReports from "./data/daily-reports.json" with { type: "json" };
import { capitalSnapshot } from "./data/capital.js";
import ArmCompetitors from "./components/ArmCompetitors.jsx";

const siteBase = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const siteHref = (path = "/") => `${siteBase}${path}` || "/";

const regionOptions = ["全部地区", ...new Set(companies.map(c => c.region))];
const displayDate = value => value ? new Date(value).toLocaleDateString('zh-CN', {timeZone: 'Asia/Shanghai'}) : '未提供';

function Stars({ value }) {
  if (value == null) return <span className="subtle">待补充</span>;
  return (
    <span className="stars" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((item) => (
        <i key={item} className={item <= value ? "filled" : ""} />
      ))}
    </span>
  );
}

function CompanyMark({ company, className }) {
  return <span className={className} aria-hidden="true">
    <span className="logo-fallback">{company.initials}</span>
    {company.logo && <img src={siteHref(company.logo)} alt="" loading="lazy" onError={(event) => event.currentTarget.remove()} />}
  </span>;
}

function SourceBadge({ source }) {
  return (
    <a className="source-link" href={source.url} target="_blank" rel="noreferrer">
      <span>{source.kind}</span>
      {source.title}
      <ExternalLink size={13} />
    </a>
  );
}

function Select({ value, onChange, label, children }) {
  return (
    <label className="select-wrap">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
      <ChevronDown size={15} />
    </label>
  );
}

function DetailDrawer({ company, onClose, isCompared, onCompare }) {
  if (!company) return null;
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={onClose}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`${company.name}详情`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-head">
          <button className="icon-button" onClick={onClose} aria-label="关闭详情"><X size={20} /></button>
          <CompanyMark company={company} className="brand-logo large" />
          <div>
            <p className="eyebrow">{company.orgType}</p>
            <h2>{company.name}</h2>
            <p className="drawer-en">{company.en}</p>
          </div>
          {company.website && <a className="website-button" href={company.website} target="_blank" rel="noreferrer">
            原记录链接 <ArrowUpRight size={15} />
          </a>}
        </div>

        <div className="drawer-meta">
          <span><Globe2 size={15} />{company.country} · {company.city}</span>
          <span><ShieldCheck size={15} />证据等级 {company.evidence}</span>
          <span className="online-dot">{company.linkStatus}</span>
        </div>

        <div className="drawer-score">
          <div><small>公开资料成熟度</small><strong>{company.maturity == null ? "未评估" : company.maturity}</strong><Stars value={company.maturity} /></div>
          <button className={isCompared ? "compare-button active" : "compare-button"} onClick={() => onCompare(company.id)}>
            {isCompared ? <Check size={16} /> : <Layers3 size={16} />}
            {isCompared ? "已加入对比" : "加入对比"}
          </button>
        </div>

        <section className="drawer-section">
          <h3>核心产品</h3>
          <p>{company.product}</p>
          {company.summary && <p className="subtle">{company.summary}</p>}
        </section>
        <section className="drawer-section">
          <h3>技术路线</h3>
          <div className="tag-row">{company.routes.map((route) => <span className="tag blue" key={route}>{route}</span>)}</div>
          <p>{company.routeSummary}</p>
        </section>
        <section className="drawer-section">
          <h3>目标场景</h3><p>{company.targetIndustry || "原地图场景分类"}</p>
          <div className="tag-row">{company.scenarios.map((scenario) => <span className="tag" key={scenario}>{scenario}</span>)}</div>
        </section>
        <section className="drawer-section two-col">
          <div><h3>融资 / 规模线索</h3><p>{company.funding}</p><p className="subtle">{company.scaleSignal}</p></div>
          <div><h3>开放与接入</h3><p>{company.openness}</p><p className="subtle">成熟度 {company.maturity == null ? "未评估" : `${company.maturity}/5`} · {capitalLabels[company.capitalTier] || "未提供资本线索"}</p></div>
        </section>
        <section className="drawer-section sources">
          <h3>信息来源</h3>
          <div className="source-list">{company.sources.map((source) => <SourceBadge key={source.url} source={source} />)}</div>
          <p className="verify-note"><ShieldCheck size={14} />{company.verifiedDate ? `公开资料核验：${company.verifiedDate}` : "公开资料待复核"}</p>
        </section>
      </aside>
    </div>
  );
}

function CompareModal({ items, onClose, remove }) {
  if (!items.length) return null;
  const rows = [
    ["地区", (c) => `${c.country} · ${c.city}`],
    ["公司类型", (c) => c.orgType],
    ["核心产品", (c) => c.product],
    ["技术路线", (c) => c.routes.join(" / ")],
    ["目标场景", (c) => c.scenarios.join(" / ")],
    ["目标行业", (c) => c.targetIndustry || "未提供"],
    ["资本线索", (c) => capitalLabels[c.capitalTier] || "未提供"],
    ["成熟度", (c) => c.maturity == null ? "未评估" : `${c.maturity}/5`],
    ["开放方式", (c) => c.openness],
  ];
  return (
    <div className="modal-layer" onMouseDown={onClose} role="presentation">
      <div className="compare-modal" role="dialog" aria-modal="true" aria-label="公司对比" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div><p className="eyebrow">横向研判</p><h2>公司对比</h2></div>
          <button className="icon-button" onClick={onClose} aria-label="关闭对比"><X size={20} /></button>
        </div>
        <div className="compare-scroll">
          <table className="compare-table">
            <thead><tr><th>维度</th>{items.map((company) => <th key={company.id}><CompanyMark company={company} className="mini-logo" />{company.name}<button onClick={() => remove(company.id)} aria-label={`移除${company.name}`}><X size={14}/></button></th>)}</tr></thead>
            <tbody>{rows.map(([label, getter]) => <tr key={label}><th>{label}</th>{items.map((company) => <td key={company.id}>{getter(company)}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PublicSource({ source }) {
  if (!source) return null;
  return <small className="daily-source">{source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.label} <ExternalLink size={12}/></a> : source.label}<span>{source.publishedAt}</span></small>;
}

function DailyReportDetail({ date }) {
  const report=dailyReports.find(item=>item.reportDate===date) || dailyReports[0];
  if (!report) return null;
  const formatTime=value=>new Date(value).toLocaleString('zh-CN',{timeZone:'Asia/Shanghai',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
  return <section className="daily" id="daily">
    <div className="section-head daily-head"><div><p className="eyebrow">DAILY INTELLIGENCE</p><h2>人形手臂每日动态</h2></div><p>北京时间每日18:00截止，19:00整理。网站版只保留公开事实；内部判断与行动建议保存在飞书L2日报。</p></div>
    <a className="back-link" href={siteHref("/daily/")}>← 返回日报列表</a>
    <div className="daily-detail-shell">
      <article className="daily-report">
        <header><div><p className="eyebrow">{report.reportDate}</p><h3>{report.title}</h3></div><div className="daily-window"><span>信息窗口</span><b>{formatTime(report.windowStart)} — {formatTime(report.windowEnd)}</b><small>整理完成 {formatTime(report.generatedAt)}</small></div></header>
        {report.scopeNote && <div className="scope-note"><CircleHelp size={16}/><span>{report.scopeNote}</span></div>}
        <section><h4>今日核心要点</h4><div className="daily-takeaways">{report.takeaways.map((item,index)=><article key={item.title}><i>{String(index+1).padStart(2,'0')}</i><div><small className="daily-company">{item.company}</small><h5>{item.title}</h5><p>{item.summary}</p><PublicSource source={item.source}/></div></article>)}</div></section>
        {!!report.companyUpdates.length && <section><h4>公司动态</h4><div className="daily-cards">{report.companyUpdates.map(item=><article key={item.company+item.headline}><small>{item.company}</small><h5>{item.headline}</h5><p>{item.summary}</p><PublicSource source={item.source}/></article>)}</div></section>}
        {!!report.industryUpdates.length && <section><h4>行业动态</h4><div className="industry-list">{report.industryUpdates.map((item,index)=><article key={item.title}><span>{index+1}</span><div><h5>{item.title}</h5><p>{item.summary}</p></div></article>)}</div></section>}
        {report.comparison?.rows?.length>0 && <section><h4>厂商参数对比</h4><div className="daily-table-wrap"><table className="daily-table"><thead><tr>{report.comparison.columns.map(column=><th key={column}>{column}</th>)}</tr></thead><tbody>{report.comparison.rows.map((row,index)=><tr key={index}>{row.map((cell,i)=><td key={i}>{cell}</td>)}</tr>)}</tbody></table></div></section>}
        {!!report.capitalMarket.length && <section><h4>资本市场信号</h4><div className="capital-grid">{report.capitalMarket.map(item=><article key={item.company}><b>{item.company}</b><span>{item.ticker}</span><p>{item.signal}</p></article>)}</div></section>}
        <footer className="daily-disclaimer"><ShieldCheck size={15}/>{report.disclaimer}</footer>
      </article>
    </div>
  </section>;
}

function DailyIndex() {
  return <section className="daily daily-index" id="daily">
    <div className="section-head daily-head"><div><p className="eyebrow">DAILY INTELLIGENCE</p><h2>人形手臂每日动态</h2></div><p>每天一张重点资讯卡片。浏览当天摘要和关键词，点击卡片进入完整报告。</p></div>
    <div className="report-card-grid">{dailyReports.map((report,index)=><a className={index===0?'report-card latest':'report-card'} href={siteHref(`/daily/${report.reportDate}/`)} key={report.reportDate}>
      <header><span>{report.reportDate}</span>{index===0&&<b>最新</b>}</header>
      <h3>{report.title}</h3>
      <div className="keyword-row">{(report.keywords||[]).slice(0,6).map(keyword=><span key={keyword}>#{keyword}</span>)}</div>
      <ul>{report.takeaways.slice(0,3).map(item=><li key={item.title}><b>{item.company}</b><span>{item.title}</span></li>)}</ul>
      <footer><span>{report.takeaways.length} 条重点资讯</span><b>阅读完整报告 <ArrowUpRight size={14}/></b></footer>
    </a>)}</div>
  </section>;
}

function CapitalMarket() {
  const coreCompanies=capitalSnapshot.companies.filter(company=>!company.crossIndustry);
  const crossIndustryCompanies=capitalSnapshot.companies.filter(company=>company.crossIndustry);
  const monthTrend=company=>{
    const value=company.monthChange;
    const available=Number.isFinite(value);
    const series=(company.monthHistory||[]).filter(Number.isFinite);
    const hasSeries=series.length>1;
    const minimum=hasSeries?Math.min(...series):0;
    const maximum=hasSeries?Math.max(...series):0;
    const range=maximum-minimum||1;
    const points=hasSeries?series.map((price,index)=>{
      const x=index/(series.length-1)*100;
      const y=18+(maximum-price)/range*58;
      return `${index===0?"M":"L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    }):["M 0 52","L 100 52"];
    const line=points.join(" ");
    const area=`${line} L 100 100 L 0 100 Z`;
    const seriesChange=hasSeries?series.at(-1)-series[0]:0;
    const tone=hasSeries?(seriesChange>=0?"up":"down"):(available?(value>=0?"up":"down"):"flat");
    const label=available?`${value>=0?"+":""}${value.toFixed(2)}%`:"上市未满1月";
    return <>
      <div className={`month-trend ${tone}`} aria-hidden="true"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path className="month-trend-area" d={area}/><path className="month-trend-line" d={line}/></svg></div>
      <a className={`month-return ${tone}`} href={company.trendSource||company.source} target="_blank" rel="noreferrer" aria-label={`${company.name}近一个月股价涨幅${label}`}><span>近1月</span><b>{label}</b></a>
    </>;
  };
  const cards=items=><div className="capital-card-grid">{items.map(company=><article className="capital-card" key={company.ticker}>
    {monthTrend(company)}
    <header><div><small>{company.exchange}</small><h3 className={`capital-name${company.name.length>14?' compact':''}`}>{company.name}</h3><span>{company.ticker}</span></div><b className={`market-change ${company.direction}`}>{company.change}</b></header>
    <p>{company.focus}</p>
    <div className="market-price"><span>最近价格</span><strong className={company.price.length>16?'compact':''}>{company.price}</strong></div>
    <div className="market-cap"><span>美元市值</span><strong>{company.marketCap}</strong><small>{company.marketCapNote}</small></div>
    <footer><time>{company.asOf}</time><a href={company.source} target="_blank" rel="noreferrer">数据来源 <ExternalLink size={12}/></a></footer>
  </article>)}</div>;
  return <section className="capital-page standalone-section">
    <div className="section-head capital-head"><div><p className="eyebrow">CAPITAL MARKET WATCH</p><h2>机器人资本动态</h2></div><p>聚焦具身、人形与协作机器人公司的股票市值和资本事件。行情可能延迟，仅用于研究跟踪。</p></div>
    <div className="capital-summary"><div><TrendingUp size={20}/><span>重点观察池</span><strong>{capitalSnapshot.companies.length}</strong><small>家上市公司</small></div><p>{capitalSnapshot.note} 卡片背景采用最近一个月逐交易日的实际收盘价折线；上市未满一个月的公司展示上市以来日线，不强行计算月涨幅。</p><time>更新于 {displayDate(capitalSnapshot.updatedAt)}</time></div>
    <div className="capital-group-head"><h3>机器人本体与平台公司</h3><p>主营业务直接覆盖人形、具身、协作或工业机器人平台。</p></div>
    {cards(coreCompanies)}
    <div className="capital-group-head crossover"><h3>跨界具身上市公司</h3><p>上市主体业务更广，但已拥有明确的人形机器人、具身智能或控股机器人业务。</p></div>
    {cards(crossIndustryCompanies)}
    <div className="capital-events"><div className="section-head"><div><p className="eyebrow">RECENT EVENTS</p><h2>近期资本事件</h2></div><p>上市、业绩与股权融资等会影响资本预期的重要节点。</p></div>
      <div className="event-list">{[...capitalSnapshot.events].sort((a,b)=>b.date.localeCompare(a.date)).map((event,index)=><article key={`${event.date}-${event.company}`}><time>{event.date}</time><i>{String(index+1).padStart(2,"0")}</i><div><small>{event.company}</small><h3>{event.title}</h3><p>{event.detail}</p></div><a href={event.source} target="_blank" rel="noreferrer" aria-label={`查看${event.company}来源`}><ArrowUpRight size={17}/></a></article>)}</div>
    </div>
    <p className="capital-disclaimer">市值会随股价、股本和汇率变化。主数字统一折算为美元，均为约值，不构成投资建议。</p>
  </section>;
}

export default function App({ view="home", reportDate=null }) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("全部地区");
  const [route, setRoute] = useState("全部路线");
  const [scenario, setScenario] = useState("全部场景");
  const [type, setType] = useState("全部类型");
  const [sortBy, setSortBy] = useState("maturity");
  const [active, setActive] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = companies.filter((company) => {
      const haystack = [company.name, company.en, company.city, company.product, company.routeSummary, company.routes.join(" "), company.scenarios.join(" "), company.summary, company.targetIndustry, company.aliases?.join(" ")].join(" ").toLowerCase();
      return (!normalized || haystack.includes(normalized))
        && (region === "全部地区" || company.region === region)
        && (route === "全部路线" || company.routes.includes(route))
        && (scenario === "全部场景" || company.scenarios.includes(scenario))
        && (type === "全部类型" || company.orgType === type);
    });
    return result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name, "zh-CN");
      if (sortBy === "capital") return b.capitalTier - a.capitalTier || b.maturity - a.maturity;
      if (sortBy === "added-desc" || sortBy === "added-asc") {
        const aTime = a.addedAt == null || a.addedAt === "" ? Number.NaN : (Number.isFinite(Number(a.addedAt)) ? Number(a.addedAt) : Date.parse(a.addedAt));
        const bTime = b.addedAt == null || b.addedAt === "" ? Number.NaN : (Number.isFinite(Number(b.addedAt)) ? Number(b.addedAt) : Date.parse(b.addedAt));
        const aHasDate = Number.isFinite(aTime);
        const bHasDate = Number.isFinite(bTime);
        if (aHasDate !== bHasDate) return aHasDate ? -1 : 1;
        if (aHasDate && bHasDate && aTime !== bTime) {
          return sortBy === "added-desc" ? bTime - aTime : aTime - bTime;
        }
        return a.name.localeCompare(b.name, "zh-CN");
      }
      return (b.maturity ?? -1) - (a.maturity ?? -1);
    });
  }, [query, region, route, scenario, type, sortBy]);

  const activeCompany = companies.find((company) => company.id === active);
  const compared = compareIds.map((id) => companies.find((company) => company.id === id)).filter(Boolean);
  const toggleCompare = (id) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 4) return current;
      return [...current, id];
    });
  };
  const resetFilters = () => { setQuery(""); setRegion("全部地区"); setRoute("全部路线"); setScenario("全部场景"); setType("全部类型"); };
  const orgTypes = [...new Set(companies.map((company) => company.orgType))];
  const plottedCompanies = companies.filter(c => c.platformness != null && c.maturity != null);
  const unplottedCompanies = companies.filter(c => c.platformness == null || c.maturity == null);

  return (
    <main>
      <header className="topbar">
        <a className="wordmark" href={siteHref("/")} aria-label="具身智能市场研究首页">
          <img className="wordmark-avatar" src={siteHref("/author-avatar.png")} alt="" />
          <span className="wordmark-copy"><b>EMBODIED</b><small>MARKET RESEARCH</small></span>
        </a>
        <nav><a className={view==="landscape"?'active':''} href={siteHref("/landscape/")}>战略坐标</a><a className={view==="directory"?'active':''} href={siteHref("/directory/")}>公司库</a><a className={view==="arms"?'active':''} href={siteHref("/arms/")}>7轴竞品</a><a className={view==="daily"||view==="report"?'active':''} href={siteHref("/daily/")}>每日动态</a><a className={view==="capital"?'active':''} href={siteHref("/capital/")}>资本动态</a></nav>
      </header>

      {view==="home"&&<section className="hero" id="top">
        <div className="hero-media" aria-hidden="true" style={{ backgroundImage: `url(${siteHref("/home-hero-poster.webp")})` }}>
          <video autoPlay muted loop playsInline preload="metadata" poster={siteHref("/home-hero-poster.webp")}>
            <source src={siteHref("/home-hero.mp4")} type="video/mp4" />
          </video>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow"><span /> EMBODIED INTELLIGENCE MARKET RESEARCH</p>
            <h1>具身智能<br/><em>市场研究</em></h1>
            <p className="hero-desc">持续追踪具身智能公司、机器人本体、关键零部件、技术路线、商业落地与资本动态。</p>
            <div className="hero-actions">
              <a className="primary-button" href={siteHref("/directory/")}>浏览公司库 <ArrowUpRight size={17}/></a>
              <a className="ghost-button" href={siteHref("/landscape/")}>打开战略坐标 <BarChart3 size={17}/></a>
            </div>
          </div>
          <div className="hero-side">
            <div className="metric"><strong>{companies.length}</strong><span>合并去重后的公司 / 机构</span></div>
            <div className="metric"><strong>{companies.filter((c) => c.maturity != null).length}</strong><span>已有公开成熟度信息</span></div>
            <div className="metric"><strong>{companies.filter((c) => c.website).length}</strong><span>附公司或机构官网</span></div>
            <div className="verified-card"><ShieldCheck size={19}/><div><b>公开版数据已去敏</b><small>仅展示公开事实与研究资料</small></div></div>
          </div>
        </div>
        <div className="hero-orbit" aria-hidden="true"><i/><i/><i/><span>VLA</span><span>WM</span><span>RL</span></div>
      </section>}

      {view==="home"&&<section className="hub-nav"><div className="section-head"><div><p className="eyebrow">RESEARCH WORKSPACE</p><h2>研究工作台</h2></div><p>每个栏目拥有独立页面，便于分享、收藏和持续更新。</p></div><div className="hub-grid">
        <a href={siteHref("/landscape/")}><span>01</span><h3>战略坐标</h3><p>查看已评分公司位置与待评分清单。</p><ArrowUpRight size={18}/></a>
        <a href={siteHref("/directory/")}><span>02</span><h3>公司情报库</h3><p>搜索和筛选公开公司资料。</p><ArrowUpRight size={18}/></a>
        <a href={siteHref("/daily/")}><span>03</span><h3>每日动态</h3><p>{dailyReports.length}期日报卡片、摘要、关键词与完整报告。</p><ArrowUpRight size={18}/></a>
        <a href={siteHref("/capital/")}><span>04</span><h3>资本动态</h3><p>跟踪重点机器人公司的股票市值与资本事件。</p><ArrowUpRight size={18}/></a>
        <a href={siteHref("/arms/")}><span>05</span><h3>7轴竞品雷达</h3><p>按产品型号对比参数、应用、成交与落地场景。</p><ArrowUpRight size={18}/></a>
      </div></section>}

      {view==="landscape" && <section className="landscape standalone-section" id="landscape">
        <div className="section-head">
          <div><p className="eyebrow">STRATEGIC LANDSCAPE</p><h2>战略坐标</h2></div>
          <p>全部 {companies.length} 家均已纳入：{plottedCompanies.length} 家已有公开研究坐标，{unplottedCompanies.length} 家在下方待评分区；空白不视为0分。</p>
        </div>
        <div className="matrix-wrap">
          <div className="matrix-y"><span>规模部署 · 5</span><span>研发验证 · 1</span></div>
          <div className="matrix">
            <div className="quadrant-label q1">平台型规模部署</div><div className="quadrant-label q2">全栈交付</div><div className="quadrant-label q3">平台前沿</div><div className="quadrant-label q4">联合研发</div>
            {plottedCompanies.map((company) => {
              const x = 6 + company.platformness * 0.88;
              const y = 8 + (company.maturity - 1) * 21;
              return <button key={company.id} className={`map-node region-${company.region.replace("全球平台", "global")}`} style={{ left: `${x}%`, bottom: `${y}%` }} onClick={() => setActive(company.id)} title={`${company.name}｜平台化 ${company.platformness}/100｜成熟度 ${company.maturity}/5`} aria-label={`查看${company.name}：平台化${company.platformness}，成熟度${company.maturity}`}><CompanyMark company={company} className="map-mark"/><b>{company.name}</b></button>;
            })}
          </div>
          <div className="matrix-x"><span>软硬一体 · 0</span><span>跨本体平台 · 100</span></div>
          <div className="legend"><span><i className="china"/>中国</span><span><i className="usa"/>美国</span><span><i className="europe"/>欧洲</span><span><i className="global"/>全球平台</span></div>
        </div>
        <div className="map-score-guide"><b>评分口径</b><p>横轴：跨本体平台化（0–100）；纵轴：落地成熟度（1–5）。坐标来自公开研究判断，不代表商业评价或合作关系；缺少可靠信息的公司留空。</p></div>
        <details className="unscored-panel" open>
          <summary>待评分公司 · {unplottedCompanies.length} 家</summary>
          <p>以下公司已纳入战略坐标区域，尚无完整横纵轴评分，暂不放置坐标点。点击查看记录。</p>
          <div className="unscored-companies">{unplottedCompanies.map(company => <button key={company.id} onClick={() => setActive(company.id)}><span>{company.name}</span><small>{company.orgType} · {company.platformness == null && company.maturity == null ? '横纵轴待评分' : company.platformness == null ? '横轴待评分' : '纵轴待评分'}</small></button>)}</div>
        </details>
      </section>}

      {view==="directory"&&<section className="directory standalone-section" id="directory">
        <div className="section-head directory-head">
          <div><p className="eyebrow">COMPANY DIRECTORY</p><h2>公司情报库</h2></div>
          <p>当前显示 <strong>{filtered.length}</strong> / {companies.length} 家</p>
        </div>
        <div className="import-notice"><b>公开公司资料共 {companies.length} 家</b><span>{importMeta.sourceScope}。内部合作字段和原始业务记录不会进入公开网站。</span></div>
        <div className="toolbar">
          <label className="search-box"><Search size={18}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索公司、产品、技术路线或场景…"/><kbd>⌘ K</kbd></label>
          <Select label="地区" value={region} onChange={setRegion}>{regionOptions.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select label="技术路线" value={route} onChange={setRoute}><option>全部路线</option>{routeOptions.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select label="应用场景" value={scenario} onChange={setScenario}><option>全部场景</option>{scenarioOptions.map((item) => <option key={item}>{item}</option>)}</Select>
          <Select label="公司类型" value={type} onChange={setType}><option>全部类型</option>{orgTypes.map((item) => <option key={item}>{item}</option>)}</Select>
        </div>
        <div className="result-bar">
          <div className="active-filters"><Filter size={15}/><span>{region}</span>{route !== "全部路线" && <span>{route}</span>}{scenario !== "全部场景" && <span>{scenario}</span>}{type !== "全部类型" && <span>{type}</span>}<button onClick={resetFilters}>重置</button></div>
          <Select label="排序" value={sortBy} onChange={setSortBy}><option value="maturity">成熟度优先</option><option value="capital">资本线索优先</option><option value="added-desc">添加时间：最新优先</option><option value="added-asc">添加时间：最早优先</option><option value="name">公司名称</option></Select>
        </div>

        <div className="company-grid">
          {filtered.map((company) => {
            const selected = compareIds.includes(company.id);
            return <article className="company-card" key={company.id}>
              <div className="card-top"><CompanyMark company={company} className="brand-logo"/><div><h3>{company.name}</h3><p>{company.en}</p></div><button className={selected ? "check-button selected" : "check-button"} onClick={() => toggleCompare(company.id)} aria-label={`${selected ? "移出" : "加入"}对比`}>{selected ? <Check size={16}/> : <span/>}</button></div>
              <div className="card-meta"><span>{company.country} · {company.city}</span><span>{company.orgType}</span></div>
              <div className="product-line"><small>核心产品</small><p>{company.product}</p>
          {company.summary && <p className="subtle">{company.summary}</p>}</div>
              <div className="tag-row compact">{company.routes.slice(0, 3).map((item) => <span className="tag blue" key={item}>{item}</span>)}</div>
              <div className="tag-row compact"><span className="tag">{company.sourceKind || "公开资料"}</span></div>
              <div className="card-score"><span>公开资料成熟度 <CircleHelp size={13}/></span><Stars value={company.maturity}/><b>{company.maturity == null ? "未评估" : `${company.maturity}/5`}</b></div>
              <div className="card-bottom"><span><ShieldCheck size={14}/>{company.verifiedDate ? `公开资料核验 ${company.verifiedDate}` : "公开资料待复核"}</span><button onClick={() => setActive(company.id)}>查看详情 <ArrowUpRight size={15}/></button></div>
            </article>;
          })}
        </div>
        {!filtered.length && <div className="empty"><ListFilter size={28}/><h3>没有匹配结果</h3><p>调整筛选条件，或清空关键词后再试。</p><button onClick={resetFilters}>清空筛选</button></div>}
      </section>}

      {view==="daily"&&<DailyIndex/>}
      {view==="report"&&<DailyReportDetail date={reportDate}/>}
      {view==="capital"&&<CapitalMarket/>}
      {view==="arms"&&<ArmCompetitors/>}

      <footer className="site-footer">
        <nav aria-label="个人链接">
          <a href="https://www.linkedin.com/in/ziye-hong-10b938225/" target="_blank" rel="noreferrer">
            <svg className="footer-social-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5.2 8.2H2V22h3.2V8.2ZM3.6 2A1.9 1.9 0 1 0 3.6 5.8 1.9 1.9 0 0 0 3.6 2ZM22 14.1c0-4.2-2.2-6.2-5.2-6.2-2.4 0-3.5 1.3-4.1 2.2V8.2H9.5V22h3.2v-6.8c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22H22v-7.9Z" />
            </svg>
            LinkedIn <ArrowUpRight size={14}/>
          </a>
          <a href="https://hongzy7.github.io/" target="_blank" rel="noreferrer"><Globe2 size={17}/> 个人网站 <ArrowUpRight size={14}/></a>
        </nav>
      </footer>

      {compareIds.length > 0 && <div className="compare-dock"><div className="dock-items">{compared.map((company) => <span key={company.id}><i>{company.initials}</i>{company.name}<button onClick={() => toggleCompare(company.id)}><X size={13}/></button></span>)}</div><small>{compareIds.length}/4</small><button className="primary-button small" onClick={() => setShowCompare(true)}>开始对比 <Layers3 size={16}/></button></div>}
      <DetailDrawer company={activeCompany} onClose={() => setActive(null)} isCompared={active ? compareIds.includes(active) : false} onCompare={toggleCompare}/>
      {showCompare && <CompareModal items={compared} onClose={() => setShowCompare(false)} remove={toggleCompare}/>}
    </main>
  );
}
