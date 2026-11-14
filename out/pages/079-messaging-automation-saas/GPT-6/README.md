# Trigly

- 输入：`data\prompts\079-messaging-automation-saas\079-messaging-automation-saas.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 本目录为 HTML/CSS/ES modules 源码；`out\` 为独立静态版本。通过静态 HTTP 服务访问 `index.html`，环境变量与运行时后端均无需配置。
- 暖白／珊瑚橙首页、原创周末静物 SVG、即时评论预览、功能与价格、移动导航，以及显式虚构自动化沙盒。
- 沙盒支持规则增删改、启停、评论／DM 触发、样例帖子范围、最多 5 个完整关键词或短语、精确静态回复、逐规则匹配轨迹、首次匹配优先、独立评论／DM 计数及最近 12 个事件。最多 12 条内存规则；刷新复位，清空历史保留计数。
- Free 为静态回复；$99/月为原需求的 PRO 产品定价。选择本地 PRO 仅解锁一句固定的 AI 模式样例，明确不使用输入指令或调用模型；切回 Free 后 AI 规则保留但匹配受阻。模拟结果从不发送至 Instagram。
- 原技术栈 Next.js、Clerk、Stripe、OpenAI、Instagram OAuth／Graph API／Webhooks、Prisma 与 PostgreSQL 均需独立后端接入，本静态交付采用浏览器内存实现首页交互。账号连接及登录入口提供真实限制说明，付款、鉴权、线上统计和实时帖子未实现；示例并非真实客户、指标或社交证明。
- 检查：语法、6 项逻辑测试及 123 项静态／浏览器检查通过；桌面／手机、编辑器、方案弹窗和真实预览已看图。入口为 `node --check app.js`、`node --test engine.test.mjs` 与 `verify.mjs`，记录见 `.checks\`。
- `make-art.mjs` 生成原创插画和 Lucide sprite；Inter／Lucide 许可随 `assets\` 保留。原需求和第三方资源许可分别核查。
- 预定公开位置 `pages/messaging-automation-saas/GPT-6/index.html`，发布登记默认关闭。未安装、构建、发布、提交或修改最终集合。
