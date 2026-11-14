# Morgan Ellis

- 输入：`data\prompts\066-editorial-portfolio\066-editorial-portfolio.md` 与 `src\workflows\AI Agent\DESIGN.md`；真实模型 `gpt-6.1-sol`，授权目录 `GPT-6`。
- HTML/CSS/JavaScript 单页，源码在本目录，独立静态版本为 `out\`。按工作流采用轻量静态实现；Next.js、Tailwind、Framer Motion 与 Vercel 集成属于简化项，未实现或执行。项目 React/Next.js 标签为设计构思方向，实际链接均指向本地 HTML 原型。
- 暖白/深蓝编辑网格、粘性导航、桌面指针微视差、触屏/减少动态效果回退、进入视口动画；简介、技能/经历、三个独占式内联案例与深链接、真实项目原型/源码下载、联系入口及一页简历 PDF/高清图片回退/HTML 正文。
- 姓名、履历、公司及项目均为明确标注的虚构内容。图库肖像仅作示意，原作者 Jurica Koletić、Unsplash 来源/许可及第三方权利限制见 `assets\image-credits.txt`；其他图片来自实际本地原型渲染。
- 排期为固定 2026-11-16～18 UTC 的本地练习，仅下载 30 分钟、TENTATIVE/TRANSPARENT 的 iCalendar，无邀请、日历查询或实际预约；Calendly 未连接。邮件为保留 `.example` 地址，社交链接明确打开平台首页；联系表单、账号、后端、统计和浏览器存储均未接入。
- 环境变量：无。本地 Inter 与 Lucide 保留许可证。`prepare-resources.mjs` 使用现有 Playwright 仅渲染原创原型截图与简历 PDF/图片，属于资源准备；不编译应用。运行时自动请求限本地资源。
- 通过临时 HTTP 访问 `out\index.html`；验证入口 `verify.mjs`，记录/截图在 `.checks\`，真实首页预览 `out\preview.png`。默认关闭发布登记，预期公开路径 `pages/editorial-portfolio/GPT-6/index.html`；构建和发布独立授权。Lighthouse、跨浏览器及完整 WCAG 审计未执行。
- 已通过 129 项静态/浏览器检查，覆盖五种视口、独占内联案例/键盘/深链接、指针与减少动态效果、真实单页 PDF/下载/正文、三个独立原型、UTC 日历内容及存储/网络隔离；浏览器无错误。桌面/手机全页、真实首页、展开案例、预约预览与完整简历图均已人工核对。
