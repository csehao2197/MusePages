# Lowtide Lab · The carbon cycle

- 原始输入：`data\prompts\551-carbon-cycle-scroll-explainer\551-carbon-cycle-scroll-explainer.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。
- 实际生成模型：`gpt-6.1-sol`；公开展示：`GPT-6`。
- 来源：VibeFather，经 liyupi/awesome-vibe-coding-websites 提交 `85431a57f231fa59269dad62c757193d6a3fd0ff` 汇集；原始链接：https://vibefather.ai/t/carbon-cycle-scroll-explainer 。提示词适配受 CC BY-NC 4.0 约束，仅限非商业用途，见 LICENSE。
- 源码：当前模型目录；集中内容：`src\content.ts`。静态首页与本地字体、Lucide 图标：`out\`。没有外部字体、位图、API、分析、账户、环境变量或后端。

## 实现与边界

原创代码绘制 1600×1000 SVG：天空、山林、18 棵树、海洋、岩层、煤层和油袋；五条有向路径表达四类流动（海洋双向），单一粒子时钟按流量调整密度与速度。六步滚动聚焦碳库，工业段加强单向燃烧流并推进年份，末段增加大气碳存量；对数碳库 HUD、年度账本、三情景原始数组的 Catmull-Rom 曲线插值、键盘/触摸滑块、FAQ、课堂提示与打印均为浏览器端真实交互。

授权静态适配：使用原生 ES modules、CSS、IntersectionObserver、requestAnimationFrame 替代 Vite/GSAP 编译和 ScrollTrigger；不执行构建。`src\content.ts` 使用 TypeScript 可接受的 JavaScript 数据语法，原样复制为公开 `content.js`，不在公开目录复制 TypeScript 源码。布局及字体来自原始规格，字体本地 Fontsource；Lucide 仅抽取所需图标和公开 ISC 渲染函数。没有 minified Vite bundle，属于独立静态首页而非原规格工具链交付。所有排放、储量、年份和温度为取整教学示意，非实时数据或科学预测；补充说明净增量与额外碳汇，避免把自然总交换直接当净预算。模板作者/审稿人名字和纠错邮箱均明确为虚构，无真实外部科学审稿。

## 运行与验证

从仓库根目录运行 `node src\workflows\script\generate-preview.mjs out\pages\551-carbon-cycle-scroll-explainer\GPT-6\out` 可使用既有 Chromium 截取实际首页预览；独立静态服务器应将 `out` 挂载在 `/pages/carbon-cycle-scroll-explainer/GPT-6/`。不用 Vite、npm build 或后端。

私有验收：`.checks\qa.mjs` 使用已有 `@playwright/test` 和 `startPreviewServer`，`.checks\qa.json` 保存实际断言、错误与视口；`.checks\desktop.png`、`.checks\mobile.png` 为真实截图。发布预览是 `out\preview.png`；输入及预览指纹保存在模型目录的隐藏 SHA256 文件。最终测试与人工图像评估结果见私有 QA/报告，不以源码存在声称已通过验证。登记默认关闭，未构建、汇集、发布或上传。

本轮实际通过 39 项验收，包含 1200×900、1440×900、390×844、减少动态效果、键盘箭头/翻页键、真实触摸拖动、六步相机与计数器、账本比例、三情景终点和连续插值、单项 FAQ、打印调用及打印 CSS；零控制台/页面/资源错误，交互前后无横向溢出。实际打开并评估桌面/移动首屏、两张情景截图和正式预览，确认层次、间距、对比、字体与响应式布局；改善地平线裁切与移动说明芯片。首次检查发现打印切换继承透明度过渡，已取消打印动画并复验通过。打印调用使用测试桩观察，未使用物理打印机。既有预览工具以减少动态效果模式拍摄，显示有向静态流线；普通浏览仍从加载开始运行粒子。

复验命令：`node out\pages\551-carbon-cycle-scroll-explainer\GPT-6\.checks\qa.mjs`。脚本会更新私有 QA 与截图并重置人工审核标志，重跑后须重新打开截图审核；不修改模型状态或发布配置。
