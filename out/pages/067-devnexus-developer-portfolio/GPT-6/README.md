# DevNexus

- 输入：`data\prompts\067-devnexus-developer-portfolio\067-devnexus-developer-portfolio.md` 与 `src\workflows\AI Agent\DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原创深色霓虹 HTML/CSS/ES Modules 静态首页；源码在本目录，独立静态版本在 `out\`，真实首页预览为 `out\preview.png`。Outfit、Inter 和 Lucide 本地资源保留许可；代码字体使用系统等宽回退。
- 首页整合 About、Projects、Skills、Blog、Contact；筛选 URL、案例/文章深链接、键盘 tabs、移动导航、明暗主题、减少动态效果、暂停动画和真实单页虚构 CV。六幅项目图来自实际浏览器运行的 sandbox。
- 六个完整本地案例：类别推荐与购物篮；Web Crypto PBKDF2-SHA-256 / 210000 次与 AES-256-GCM 加密/解密/导出；固定样本数据图表；四话题规则 FAQ；成功/失败的逐步流水线模拟；真实一分钟专注计时器。原需求指定五项目但要求六张卡，第六项补为 Pocket UI。
- 四篇完整原创短文，按实际字数计算阅读时间并提供高亮示例。人物、四段经历、技能分数、学历叙事和三段评价均显式虚构；项目不声称真实客户或商业指标。
- 联系表单校验后下载本地 JSON 并清空字段；无发送、账户、后端、远程模型、支付、日历或持久化。社交链接明确打开平台首页；源码下载是实际 `app.js`，不是虚构 GitHub 仓库。
- 采用通用指引允许的轻量静态实现；以原生 WebGL 粒子和 Canvas 三维投影技能球替代 Three.js，以 CSS/原生表单逻辑替代 Next.js、TypeScript、Tailwind、ShadCN、Framer、GSAP、Lenis、React Hook Form/Zod。导航为首页内章节与案例/文章对话框，而非完整多页框架应用。
- 加密仅供样例学习，未经安全审计，保护边界限于当前页面与浏览器；关闭案例清理内存，密码和明文不写入导出。Web Crypto 需要 HTTPS 或 localhost；无账户恢复、文件导入或生产保密承诺。WebGL 不可用时保留静态轨道与完整内容。
- 使用现有 Playwright：`node prepare-resources.mjs` 仅生成截图/PDF，`node --check app.js` 检查语法；`verify.mjs` 通过临时 HTTP 验证静态资源和交互，记录位于 `.checks\`。无新增依赖、应用构建、Lighthouse、跨浏览器或完整 WCAG 审计。
- 预期公开位置 `pages/devnexus-developer-portfolio/GPT-6/index.html`；登记默认关闭，构建与发布独立授权。
- 已通过 151 项静态/浏览器检查，覆盖五种视口、真实加密往返/错误密码/随机盐与 IV、购物篮计算、全部样本图表、FAQ 转义、流水线失败保护、计时暂停/结束、四篇完整文章、表单校验/下载、单页 PDF、键盘/深链接和 WebGL 缺失回退；无浏览器错误、自动外部请求或存储。桌面/手机全页、真实预览及案例展开态已人工核对。
