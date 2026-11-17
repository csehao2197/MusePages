# Tallypine · Compound Interest Interactive Explainer

- 实际生成模型：`gpt-6.1-sol`；公开标签：`GPT-6`。
- 原始输入：`data\prompts\559-compound-interest-interactive-explainer\559-compound-interest-interactive-explainer.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。
- 来源：VibeFather，https://vibefather.ai/t/compound-interest-interactive-explainer ，经 liyupi/awesome-vibe-coding-websites 历史快照收集。完整来源 URL 见 `ASSETS.md`。需求及插画遵循 CC-BY-NC-4.0，仅限非商业用途；商业许可由原作者提供。保留页脚署名。
- 源码：本目录的 `index.html`、`style.css`、`app.mjs`、`content.mjs`、`finance.mjs` 与资源；静态交付：`out\`。不需要环境变量、账户、后端或外部运行时请求。

## 功能与边界

英文单页：逐月真实复利模拟、存款/利息 SVG 面积图、键盘与指针年度探查、滚动章节年度柱状图、双倍金额/双倍时间比较、25/35 岁起步的虚构储蓄者、年龄播放与拖动、同步通胀模式、购买力篮子、实时公式、四种复利频率比较、逐年表和单项 FAQ。

月末存入；月利率为 `(1 + r/n)^(n/12) − 1`；四种频率 1/4/12/365；零利率用存款总额，零存款得到零。交叉点表示累计利息超过累计存款，不冒充年度利息交叉点。通胀将每个年度的整层数值折现；比较储蓄者时双方以 25 岁为同一时间原点。情境 A 年限向下取整；奇数年、1 年边界与折现造成的金额差异明确提示。图表使用全年点，因此指针和年龄滑块按整年查看。

获准采用原生 HTML/CSS/ES modules 免构建静态适配，未安装或使用指定 Vite/React/TypeScript/Tailwind/motion/d3 版本；纯数学模块和单一状态驱动所有章节，手写保形三次 SVG 曲线替代 d3。字体为本地 Fontsource OFL 字体，四张指定插画已下载，Lucide 路径内联并保留 ISC 许可。保留核心数字缓动、滚动高亮与六秒年龄播放，未逐项复刻 motion 路径变形/弹簧/入场效果。减少动态偏好禁用数值与播放动画。无 Mock 后端；全部金融数值均为假设，忽略税费、提款与浮动或负收益。此页不提供投资建议，也不实际运营邮件订阅。

## 运行与验证

从仓库根目录，使用现有 `startPreviewServer` 托管本目录 `out\`，真实公开子路径为 `/pages/compound-interest-interactive-explainer/GPT-6/index.html`。不运行构建。私有验证程序在 `.checks\qa.mjs`，命令：

```powershell
node out\pages\559-compound-interest-interactive-explainer\GPT-6\.checks\qa.mjs
```

`.checks\qa.json` 记录实际断言、错误与视口；`.checks\desktop.png`、`.checks\mobile.png` 为真实截图。数学测试含公式独立核对、零利率、零存款、零年、极值、频率顺序、折现和交叉点。浏览器测试包含桌面/移动最终子路径、滑块、键盘、通胀同步、频率、表格、FAQ、滚动章节、年龄播放、移动菜单、无溢出与无错误。最终执行结果与人工打开截图的视觉结论写入 `.checks\qa.json`，未执行前不视为完成。

`out\preview.png` 由现有 `StaticHomepage.ensurePreview` 生成 1200×900 首屏，摘要保存在模型根目录。登记默认 `enabled=false`、`deployed=false`；本任务不构建、不汇集、不发布、不部署。

本次实际结果：117 项断言通过，含 320 组独立数学交叉验证；1200×900、390×844、1440×900 均无页面、控制台、请求或 HTTP 错误，交互前后无横向溢出。已实际打开桌面/移动 PNG 及新生成的正式预览：排版层级、配色、图表与留白通过视觉检查；移动按规格先展示图表，控制区位于其下。所有自有浏览器和临时服务已关闭。最终登记、摘要和四项状态见元数据及私有报告。
