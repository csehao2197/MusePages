# Good Company

- 输入：`data/prompts/074-restaurant-loyalty-platform/074-restaurant-loyalty-platform.md`，结合 `src/workflows/AI Agent/DESIGN.md`。
- 真实模型：`gpt-6.1-sol`（GPT-6.1 Sol）；目录沿用 `GPT-6`。本目录为 HTML/CSS/JavaScript 源码。
- 原创社区忠诚度首页：餐厅搜索/分类、加入点卡、明确的本地加章模拟、完整卡片奖励与抽奖登记、新周期保留旧权益、一次性模拟兑奖、整数积分转移、成就、排行榜、活动指标和真实 JSON 快照下载。
- 所有人物、商家、位置、初始积分和权益均为虚构示例，无现金价值。固定演示时钟为 2026-11-16；权益在该时钟下经过 30 天到期。抽奖仅记录示例条目，未实施开奖或真实奖品。
- 状态仅在内存；关闭表单清空未提交输入，刷新或重置恢复初始演示。无 Cookie、浏览器存储、外部请求、真实账户、交易、预约、消息、环境变量或服务端。
- 静态首页：`out/index.html`，资源 `out/assets/`，真实预览 `out/preview.png`。用现有 HTTP 静态服务器托管 `out` 即可在子路径访问，无需安装或构建。登记公开目标：`deploy/dist/MusePages/pages/restaurant-loyalty-platform/GPT-6/`；当前未发布，配置默认关闭。
- 检查：`node --check app.js`、`node --test engine.test.mjs` 的 6 项算法测试及页面检查器的 109 项浏览器/静态检查通过，覆盖五视口、真实交互、下载字节、无外部请求/存储和刷新复位；已查看桌面、手机、预览与交互截图。记录见 `.checks/validation.json`。
- 原需求的 Next.js/TypeScript、Clerk、Supabase/Drizzle、ShadCN/Tailwind、Framer Motion、Storybook、QR/摄像头扫码、WebSockets 和受保护角色/管理后台未实现。本次交付是静态首页，不是已认证的生产忠诚度系统；“本地通行证”明确不是二维码或授权凭证。
- 食物插图、字标及布局为本轮原创 SVG/代码；本地 Inter 和 Lucide 保留 OFL/ISC 许可，集合不授予额外第三方权利。
