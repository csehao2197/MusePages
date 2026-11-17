# Scrawlhouse — Photosynthesis

- 实际生成模型：`gpt-6.1-sol`；公开展示：`GPT-6`。
- 原始输入：`data\prompts\569-hand-drawn-scroll-explainer\569-hand-drawn-scroll-explainer.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。
- 来源：VibeFather / https://vibefather.ai/t/hand-drawn-scroll-explainer；GitHub 快照：https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/hand-drawn-scroll-explainer/prompt.md 。
- 许可：CC BY-NC 4.0，仅非商业用途；保留 `LICENSE`、页面署名与链接。新增代码与原始矢量绘图是本次独立实现，不包含商业演示代码或截图。
- 源码：当前目录的 `index.html`、`content.js`、`glyphs.js`、`main.js`、`styles.css`、`favicon.svg`；所有插图均由代码绘制，十二种 SVG glyph 和三种 Pip 姿势。
- 公开静态资源：`out\`；最终相对路径：`pages\hand-drawn-scroll-explainer\GPT-6\index.html`。未执行构建、集合汇集、发布或上传。

## 功能与适配

六幕解释阳光、叶片、水、二氧化碳、葡萄糖与氧气；滚动进度真实控制每幕路径的描边长度、荧光笔、弯箭头和逐字气泡。章节索引、下一幕、重播、仅打印复习图和随身笔记，以及可独立切断三种输入的叶片实验均为本地浏览器交互。实验明确为简化教学模型，非植物测量，不模拟真实速率、夜间代谢或完整生物化学过程。

使用获授权的直接 HTML/CSS/ES module 静态适配，未安装或使用原需求指定的 Vite 5、TypeScript、GSAP、Fontsource；原生滚动与 `requestAnimationFrame` 代替 ScrollTrigger，系统 Segoe Print / Bradley Hand / Comic Sans MS 与 Trebuchet MS 字体栈代替指定字体，跨平台字形可能不同。文案集中在 `content.js`，不是 `src/content.ts`。不需要后端、API、密钥、环境变量或运行时网络依赖。原始公开 prompt 没有提供 Pro 的布局细节或参考资产；当前布局为原创设计，不声称复刻未提供的付费演示。

## 运行与验证

在仓库根执行 `node src\workflows\script\generate-preview.mjs out\pages\569-hand-drawn-scroll-explainer\GPT-6\out` 可通过现有静态 HTTP 服务验证并生成预览，不构建网站。

私有 QA：`.checks\qa.mjs`；运行：`node out\pages\569-hand-drawn-scroll-explainer\GPT-6\.checks\qa.mjs`。结果与断言在 `.checks\qa.json`，桌面/手机截图在 `.checks\desktop.png`、`.checks\mobile.png`，实际验证结果以该 JSON 和最终私有报告为准。

本次实际验证：1200×900 / DPR 1 桌面与 390×844 / DPR 1 触屏 Chromium 共 34 项检查通过。最终子路径 HTTP、静态资源、首页与六幕及操作后无横向溢出；六幕真实 SVG 描边和逐字气泡、章节导航、Space/Enter、手机点击、三输入实验、恢复、重播、打印调用与打印样式、减少动态效果全部通过；控制台、页面与资源错误均为零。首轮手机网格扩宽已修正并复验。已实际用图片查看工具打开两张首页、两张章节、两张实验 PNG 及 `out\preview.png`，确认桌面双栏/手机单栏、字体层次、手绘标注与留白。预览由 `StaticHomepage.ensurePreview` 实际生成并维护摘要。没有执行生产构建或真实纸张打印。

`metadata.json`、输入与预览摘要、说明、QA 程序/图片均不作为公开资源发布；仅现有工作流生成的 `out\preview.png` 是集合预览。登记默认 `enabled=false`、`deployed=false`，不表示发布。
