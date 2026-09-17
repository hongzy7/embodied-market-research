"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Check, Filter, Radar, Search, ShieldCheck } from "lucide-react";
import { armProducts, armSignals, armScope } from "../data/arm-competitors.js";

const fmt = (value, unit) => value == null ? "未公开" : `${value}${unit}`;
const groups = ["全部", "华沿基线", "直接竞品", "邻近竞品", "研究基准"];

export default function ArmCompetitors() {
  const [selected, setSelected] = useState(["Echo 3", "HY 7", "AR3", "AIRBOT P7", "MAXHUB D3"]);
  const [group, setGroup] = useState("全部");
  const [query, setQuery] = useState("");
  const [signalType, setSignalType] = useState("全部");
  const compared = useMemo(() => selected.map(id => armProducts.find(x => x.id === id)).filter(Boolean), [selected]);
  const visible = armProducts.filter(item => (group === "全部" || item.group === group) && `${item.id}${item.company}${item.series}`.toLowerCase().includes(query.toLowerCase()));
  const signals = signalType === "全部" ? armSignals : armSignals.filter(item => item.type === signalType);
  const toggle = id => setSelected(current => current.includes(id) ? current.filter(x => x !== id) : current.length < 5 ? [...current, id] : current);

  return <main className="arm-watch standalone-section">
    <header className="arm-head">
      <div><p className="eyebrow"><Radar size={14}/> COMPETITIVE INTELLIGENCE</p><h1>具身7轴机械臂竞品库</h1><p>{armScope}</p></div>
      <div className="arm-summary"><div><strong>{armProducts.length}</strong><span>产品型号</span></div><div><strong>{new Set(armProducts.map(x=>x.company)).size}</strong><span>厂商主体</span></div><div><strong>{armProducts.filter(x=>x.group==="直接竞品").length}</strong><span>直接竞品</span></div></div>
    </header>

    <section className="arm-panel">
      <div className="arm-title-row"><div><p className="eyebrow">MODEL COMPARISON</p><h2>产品型号横向对比</h2><p>最多选择5款；华沿基线默认置顶并加入比较。</p></div><span className="selection-count">已选 {selected.length}/5</span></div>
      <div className="arm-toolbar"><label><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="搜索型号、公司或系列" /></label><div className="group-tabs">{groups.map(x=><button key={x} className={group===x?"active":""} onClick={()=>setGroup(x)}>{x}</button>)}</div></div>
      <div className="arm-picker">{visible.map(item=><button key={item.id} className={`${selected.includes(item.id)?"active":""} ${item.group==="华沿基线"?"own":""}`} onClick={()=>toggle(item.id)}><span className="picker-check">{selected.includes(item.id)&&<Check size={13}/>}</span><div><b>{item.id}</b><small>{item.company}</small></div><em>{item.group}</em></button>)}</div>
    </section>

    <section className="arm-table-shell"><table className="arm-table"><thead><tr><th>关键维度</th>{compared.map(item=><th className={item.group==="华沿基线"?"own-col":""} key={item.id}><span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span><b>{item.id}</b><small>{item.company}</small></th>)}</tr></thead><tbody>
      {[["市场角色",x=><span className="group-pill">{x.group}</span>],["数据状态",x=><><span className={`data-status ${x.dataStatus.startsWith("核心")?"complete":"partial"}`}>{x.dataStatus}</span><small className="evidence-note">{x.evidenceNote}</small></>],["产品形态",x=>x.form],["单臂额定负载",x=>fmt(x.payload," kg")],["工作半径",x=>fmt(x.reach," mm")],["单臂自重",x=>fmt(x.weight," kg")],["重复定位精度",x=>x.repeatability],["速度",x=>x.speed],["力控 / 感知",x=>x.sensing],["接口与开发栈",x=>x.stack],["应用 / 场景",x=><div className="arm-tags">{x.applications.map(tag=><span key={tag}>{tag}</span>)}</div>],["成交 / 交付",x=>x.delivery],["证据",x=><a href={x.source} target="_blank" rel="noreferrer">官方来源 <ArrowUpRight size={13}/><small>核验 {x.verified}</small></a>]].map(([label,getter])=><tr key={label}><th>{label}</th>{compared.map(item=><td className={item.group==="华沿基线"?"own-col":""} key={item.id}>{getter(item)}</td>)}</tr>)}
    </tbody></table></section>

    <section className="arm-panel signals-panel"><div className="arm-title-row"><div><p className="eyebrow">APPLICATION · DEAL · DEPLOYMENT</p><h2>应用、成交与落地信号</h2></div><div className="signal-filter"><Filter size={14}/>{["全部","产品","应用","交付","落地"].map(type=><button className={signalType===type?"active":""} onClick={()=>setSignalType(type)} key={type}>{type}</button>)}</div></div><div className="signal-list">{[...signals].sort((a,b)=>b.date.localeCompare(a.date)).map(item=><article key={`${item.date}-${item.company}-${item.type}`}><time>{item.date}</time><span className={`signal-type type-${item.type}`}>{item.type}</span><div><small>{item.company}</small><h3>{item.title}</h3><p>{item.detail}</p></div><a href={item.source} target="_blank" rel="noreferrer" aria-label="打开官方来源"><ArrowUpRight size={17}/></a></article>)}</div></section>
    <aside className="arm-method"><ShieldCheck size={20}/><div><b>数据口径</b><p>参数优先采用厂商官网、官方手册和公告；未披露项保持空缺，系列累计交付不拆分到单一型号。型号是飞书与网页共同的唯一标识。</p></div></aside>
  </main>;
}
