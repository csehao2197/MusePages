# Claude Code 交互速查表

- 输入：`data/prompts/092-interactive-developer-cheatsheet/092-interactive-developer-cheatsheet.md`；结合 `src/workflows/AI Agent/DESIGN.md`。真实模型：`gpt-6.1-sol`，目录 `GPT-6`。
- 类型：独立 HTML/CSS/JavaScript，源码在本目录；静态首页与资源由验证流程复制至 `out/`。公开映射为 `pages/interactive-developer-cheatsheet/GPT-6/index.html`，发布登记默认关闭。
- 功能：8 类 32 条原创说明、全字段搜索、折叠详情、原样复制、分类与本标签页收藏、主题切换、条目深链、完整 A4 PDF、更新说明与官方来源、未发送订阅草稿下载。
- 内容：`assets/cheatsheet.json` 为人工核对的官方文档快照，2026-11-13 reviewed；`snapshot-1` 是本站内容版本，不是 Claude Code CLI 版本。各条带官方链接，工作流提示为原创示例。
- 运行：通过已有静态 HTTP 服务打开本目录或 `out/index.html`。无需安装、构建、账号或环境变量。Clipboard 在 localhost/HTTPS 可用，失败时可展开选择文本。
- 资源生成：`node make-art.mjs` 使用已有 Chromium 从同一 JSON 生成完整静态打印页、A4 PDF 与数据镜像，并复用本地 Inter/OFL、Lucide/ISC。源码资源与打印输出一并准备，PDF 始终为完整快照，不受页面筛选影响。
- 验证：语法检查、5 项逻辑单测、172 项静态与浏览器检查通过；覆盖 5 视口、32 条逐项真实剪贴板读回、组合筛选、键盘折叠、收藏、来源、深链、主题、6 页 PDF 原样下载与完整打印内容、320px 表单与未发送草稿。已核看桌面、手机、实际预览、浅色详情、表单及打印视图。
- 边界：全部收藏与主题只在当前文档内存，刷新重置。复制示例不执行命令。原需求引用的外部图片未提供，因此采用原创设计与 32 条精选资料，并非图片提取或完整官方清单。
- 未连接：真实 newsletter、Resend、Supabase、爬取、cron、自动更新 PR、Claude Code 执行。邮件输入仅生成本地未发送文本，下载或关闭弹窗后清空。本站不代表 Anthropic。
- 权利：原创界面与摘要；保留原始需求的来源和作者权利。Claude Code 品牌归相应权利人；外部官方文档按原许可使用。
