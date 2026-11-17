# Petal Atlas — Flower Anatomy

- 实际生成模型：`gpt-6.1-sol`；公开展示：`GPT-6`。
- 原始输入：`data\prompts\554-flower-anatomy-3d-explainer\554-flower-anatomy-3d-explainer.md`；通用指引：`src\workflows\AI Agent\DESIGN.md`。
- 来源：VibeFather，https://vibefather.ai/t/flower-anatomy-3d-explainer 。输入快照由 liyupi/awesome-vibe-coding-websites 提供（提交 `85431a57f231fa59269dad62c757193d6a3fd0ff`）。需求采用 CC BY-NC 4.0，仅限非商业使用；见 `NOTICE`、`ASSETS.md` 与 `licenses\`。
- 源码：当前目录的 `index.html`、`styles.css`、`app.js`、`flowerScene.js`；可替换课程内容与形态参数：`src\content.ts`（纯 JavaScript 兼容 TypeScript，静态复制为 `content.js`）。
- 静态首页：`out\index.html`；最终子路径：`pages/flower-anatomy-3d-explainer/GPT-6/index.html`。

## 功能与适配

英文初学者课程，真实 Three.js WebGL 参数化百合（六片花被、六枚雄蕊、三裂柱头、花柱、上位三室子房与胚珠）、OrbitControls、键盘旋转缩放、四级解剖、投影标签、选择与聚焦。共用一个持续挂载的画布，支持三个 hash 章节、12 秒四阶段授粉、播放暂停与速度、五题测验、锁定答案、反馈与五行复习、本机最高分。WebGL 不可用时仅替换为代码生成 SVG 剖面。

按本轮授权采用原生 HTML/CSS/ES 模块静态适配，不生成 Vite/React 运行项目，不运行 `npm run build`。Three.js 与 OrbitControls 直接使用本机安装包；Lucide 从授权包提取 SVG 几何；Fontsource 字体本地托管。无外部运行资源、后台、网络服务或假 API；localStorage 只写最佳数字分数，存储受限时课程仍可运行。几何与时序是示意，非精确植物学测量或生物模拟。解剖过渡用阻尼插值，非指定贝塞尔；镜头重置/聚焦即时，非补间；字体使用本地拉丁子集。

## 运行与验证

从仓库根执行 `node out\pages\554-flower-anatomy-3d-explainer\GPT-6\.checks\qa.mjs`；该私有检查使用现有 `startPreviewServer` 仅托管 `out\`，以最终子路径运行浏览器，检查完成后关闭浏览器与服务。

静态检查使用 `WorkspaceFiles`、`StaticHomepage.checkSource`、`validateStaticOutput`；输入摘要保存在 `.generation-input.sha256`。浏览器记录在 `.checks\qa.json`，桌面/移动实拍在 `.checks\desktop.png`、`.checks\mobile.png`；预览由 `StaticHomepage.ensurePreview` 生成于 `out\preview.png`。验证结论与人工视觉检查以实际检查记录及私有任务报告为准，不以本说明推断成功。没有执行构建、dist、publish 或上传；登记默认关闭。

本次实际通过 **162 项断言**：1200×900、1440×900、390×844（DPR 1），包含真实拖动/滚轮/双指缩放、键盘操作、四步解剖、六标签、授粉播放/精确暂停/半速/完整 12 秒停止、五题正确与错误反馈、存储恢复、减少动态效果与模拟 WebGL 失败。正常路径无 HTTP、请求、资源、console 或 page 错误，交互前后无横向溢出。已逐一打开最终桌面、移动、子房剖面、受精及新预览 PNG，修正隐藏标签和剖面朝向后复验；内部胚珠与花粉管实际可见。浏览器与自有临时服务均已关闭。
