# 具身智能市场研究

面向公开访问的具身智能行业研究站点，包含公司目录、技术路线、每日动态、资本市场与七轴人形手臂竞品研究。

- 线上网站：<https://hongzy7.github.io/embodied-market-research/?v=20260917>
- 部署方式：GitHub Pages + GitHub Actions
- 技术栈：React + Vite

## 开始开发

需要 Node.js 22 或更高版本。

```bash
pnpm install
pnpm dev
```

常用命令：

```bash
pnpm validate  # 检查公开数据结构和敏感字段
pnpm build     # 构建可部署站点
pnpm preview   # 本地预览生产构建
```

## 目录结构

```text
.
├─ .github/workflows/  # CI/CD 与 GitHub Pages 部署
├─ data/reports/       # 独立的公开日报源数据
├─ docs/               # 架构、数据与发布说明
├─ public/             # 静态图片、视频与公司 Logo
├─ scripts/            # 校验、日报更新与构建辅助脚本
└─ src/
   ├─ components/      # 可复用界面组件
   ├─ data/            # 网站使用的公开数据
   ├─ styles/          # 全局样式与主题
   ├─ App.jsx          # 页面与路由视图
   └─ main.jsx         # 浏览器入口
```

详细说明见 [架构文档](docs/architecture.md) 和 [公开数据规范](docs/data-policy.md)。

## 发布

`main` 分支的每次推送都会触发 GitHub Actions，完成依赖安装、数据校验、生产构建和 GitHub Pages 部署。

## 公开边界

本仓库只保存公开研究资料，不应提交内部飞书链接、客户备注、联系人、跟进状态、内部报价或其他业务字段。
