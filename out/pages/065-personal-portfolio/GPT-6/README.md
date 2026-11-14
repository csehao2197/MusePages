# Alex Morgan

- 输入：`data\prompts\065-personal-portfolio\065-personal-portfolio.md` 与 `src\workflows\AI Agent\DESIGN.md`；实际模型 `gpt-6.1-sol`，授权目录 `GPT-6`。
- 类型：HTML/CSS/JavaScript 静态首页；源码在本目录，实际静态版本为 `out\`。以工作流允许的轻量实现覆盖作品集首页；原需求中的 Next.js 15、React 18、TypeScript、Tailwind、Git hooks 和 `@programinglive/commiter` 发布工具链属于简化项，未实现或执行。
- 原创奶油色/森林绿编辑风格：简介、四项目、可分享筛选、案例深链接、键盘标签页、技能筛选、方法介绍、响应式导航和联系入口。四个本地原型分别实现任务增删/勾选、四篇完整微型文章、三季度图表/数据表、表单校验/预览；各有实际可单独打开的 HTML 源码下载及新标签运行入口。
- 原型及项目使用真实本地数据；姓名、经历、技能及案例均为虚构概念，无客户、履历或业绩主张。React/Next.js 标签为项目构思方向，实际原型运行时为 HTML/JS。社交入口明确打开平台首页；`.example` 地址为保留示例域名。联系表单仅下载本地文本简报，关闭即清空，邮件/订阅/账号/后端均未接入。
- 环境变量：无。无自动外部请求、分析、Cookie 或浏览器存储。默认系统衬线及本地 Inter；保留 Inter OFL 与 Lucide 许可证。四幅 SVG/图标组合及文字为本次原创；独立原型源码以 CC0-1.0 提供，第三方字体/图标许可证独立适用。
- 运行：通过临时静态 HTTP 服务访问 `out\index.html`；验证入口 `verify.mjs`，检查和截图在 `.checks\`，真实首页预览 `out\preview.png`。默认关闭发布登记，预期公开路径 `pages/personal-portfolio/GPT-6/index.html`，实际构建和发布需独立授权。
- 已通过 134 项静态/浏览器检查，覆盖五种视口、筛选/深链接、四个原型、实际源码下载及独立执行、剪贴板、本地简报、文本安全与存储/网络隔离；浏览器无错误。桌面/手机全页、真实首页预览、任务/数据原型和联系界面均已人工核对。
