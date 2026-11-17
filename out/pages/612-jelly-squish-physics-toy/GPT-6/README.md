# Softside Studio

- 实际生成模型：`gpt-6.1-sol`；公开标签：`GPT-6`。
- 原始输入：`data\prompts\612-jelly-squish-physics-toy\612-jelly-squish-physics-toy.md`；设计：`src\workflows\AI Agent\DESIGN.md`。
- 来源：VibeFather，[Jelly Squish Physics Toy](https://vibefather.ai/t/jelly-squish-physics-toy)，[GitHub 原文](https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/jelly-squish-physics-toy/prompt.md)，CC BY-NC 4.0。灵感署名：@UPGPTs Team，https://upgpts.com/en/tutorials/chatgpt/gpt-6.1-sol-test-cases 。
- 源码：当前目录 `index.html`、`content.js`、`app.js`、`style.css`；独立静态交付：`out\`。
- 功能：914 顶点闭合沟槽布丁、结构/对角约束、固定步长软体求解、局部指针抓取与拖拽、点击冲量、重力落下、托盘碰撞与形状恢复；三种口味、软硬度、键盘 Squish/Drop/Reset、默认关闭的合成音效。
- 纯浏览器本地运行；没有后端、网络 API、Mock 或环境变量。音效需手动开启；浏览器需支持 WebGL2。小型粒子表面约束是交互玩具，不是精确流体/有限元仿真。
- 已授权采用原生 HTML/JavaScript 静态适配，未采用原需求 Vite/TypeScript 构建，也未运行任何构建；使用本地 Three.js、Fontsource 字体和原创程序化图形。用本地 Terser 对浏览器脚本做无构建压缩，HTML/CSS 同样压缩。保留源码与静态资源分离；`node_modules`、包清单与检查工具不发布。
- 本地运行：从仓库根执行 `node src\workflows\script\generate-preview.mjs out\pages\612-jelly-squish-physics-toy\GPT-6\out` 可通过现有流程捕获真实预览；交互 QA 用相同模块的 `startPreviewServer` 仅托管 `out`，公开子路径为 `/pages/jelly-squish-physics-toy/GPT-6/index.html`。
- 私有 QA：从仓库根执行 `node out\pages\612-jelly-squish-physics-toy\GPT-6\.checks\qa.mjs`；证据 `.checks\qa.json`、`.checks\desktop.png`、`.checks\mobile.png`。
- 实测：42 项 Chromium 断言通过；1200×900、1440×900 与 390×844，涵盖真实局部顶点拖拽/触摸、点击冲量、释放恢复、碰撞压缩后反弹、连续落下、软硬差异、键盘、减弱动态、隐藏/恢复处理及音频开关；无控制台、页面、请求、HTTP 错误或交互前后横向溢出。隐藏测试直接触发 visibilitychange 处理器，不冒充操作系统级后台能耗测量。
- 已实际打开最终桌面与移动 PNG 评审：标题/场景主次、留白、奶油/桃色对比、字体、控件对齐与响应布局均可用；已改进托盘边缘反光伪影。390×844 首屏包含物体、完整口味/软硬度/Drop 控件与页脚。预览使用现有 `ensurePreview` 生成、核验并维护摘要。
- 本轮仅生成、静态验证、预览与默认关闭登记；没有汇集、发布、部署。
- 许可与依赖署名见 `LICENSE`、`ASSETS.md` 和静态目录的 `NOTICE`。
- 限制：914 顶点离散表面在极近处有轻微分面；重力碰撞使用托盘高度平面和水平回中恢复力，不模拟倾倒、撕裂或真实流体。未开展实体手机硬件与跨浏览器性能验收；无生产就绪承诺。
