# TicketWise

- 输入：`data\prompts\078-it-service-desk-assistant\078-it-service-desk-assistant.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/ES modules 静态首页；源码在本目录，独立资源在 `out\`。通过静态 HTTP 服务访问 `index.html`；环境变量与后端均无需配置。
- 默认首页准确展示 “Pod mode only / No live connection”；显式入口才打开虚构演示。真实 ConnectWise 需验证 Hosted API 会话，本预览不接收会话、postMessage 凭据或真实工单。
- 两个合成工单、只读备注与配置、逐工单内存会话、9 条命令、键盘自动完成、有限关键词匹配、源备注跳转、历史详情、富文本／纯文本复制及失败提示。所有回复是固定本地内容，不是 AI 分析；草稿不发送，升级不提交。
- 相似工单使用明确的 2026-11-12 样例时钟：同公司 90 天、全局 14 天，公司结果优先。状态、已记录修复、假设和未知根因独立表达。地址采用文档专用网段。
- 每标签 30 次／滚动分钟的本地演示保护；清空聊天和切换工单保留窗口，刷新页面复位。它不是按认证成员实施的安全限流。收藏、云存储、真实 API、账户、权限同步与生产嵌入集成均不属于本静态交付。
- 原需求的 Next.js、TypeScript、OpenRouter/Kimi、验证会话、跨站 Cookie 和真实 ConnectWise 权限未接入。采用静态 UI 保留首页与交互概念，全部数据和回复来源在 `assets\engine.js`。无网络模型调用、工单修改或后台持久化。
- 检查：语法检查、7 项逻辑测试、122 项静态／浏览器检查通过，桌面／手机及真实预览已看图。入口为 `node --check app.js`、`node --test engine.test.mjs` 与 `verify.mjs`。剪贴板以浏览器 API 替身核验富文本载荷、纯文本降级和权限失败，保留共享系统剪贴板；实际系统写入未执行。记录见 `.checks\`。
- Inter／Lucide 许可随 `assets\` 保留；原需求、字体和图标的再分发权分别核查。`make-icons.mjs` 仅为本地制图入口，静态导出包含浏览器资源。
- 预定公开位置 `pages/it-service-desk-assistant/GPT-6/index.html`，登记在 `deploy\config.json` 并默认关闭。未安装、构建、发布、提交或修改最终集合。
