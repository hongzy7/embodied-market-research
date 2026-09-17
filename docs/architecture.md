# 架构说明

## 运行方式

网站是一个 React 单页应用，由 Vite 负责本地开发和生产构建。`src/main.jsx` 根据当前 URL 选择视图，`src/App.jsx` 负责页面布局和主要交互。

## 数据流

1. 公开研究数据保存在 `src/data/` 和 `data/reports/`。
2. `pnpm validate` 在构建前检查 JSON 格式、必要结构和禁止公开的字段。
3. Vite 将源码与 `public/` 资产构建到 `dist/`。
4. `scripts/prepare-github-pages.mjs` 为各公开路由生成回退页，使 GitHub Pages 能正确打开深层链接。
5. GitHub Actions 上传 `dist/` 并发布到 GitHub Pages。

## 维护原则

- 业务数据与界面代码分离。
- 构建产物不提交到 `main` 分支。
- 私有数据同步工具不进入本公开仓库。
- 应用新页面路由时，同步更新 `src/main.jsx` 和 `scripts/prepare-github-pages.mjs`。
