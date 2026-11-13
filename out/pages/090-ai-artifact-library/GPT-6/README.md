# Artifact Vault 静态作品库

- 输入：`data\prompts\090-ai-artifact-library\090-ai-artifact-library.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，模型目录 `GPT-6`。源码为本目录 HTML／CSS／JavaScript，独立版本 `out\`；现有静态 HTTP 服务访问 `out\index.html`。预计公开路径 `pages/ai-artifact-library/GPT-6/index.html`，登记默认关闭。
- 8 个原创样例，支持名称／描述／源码搜索、13 种格式、标签／集合／收藏／排序、网格／列表、创建编辑、软删除／恢复、复制下载、源码版本及恢复。20 个会话条目含回收站；每项最多 10 个源码版本，元数据修改保持源码版本号，恢复生成新版本并保留当前元数据。
- HTML／SVG 使用静态允许列表、移除事件／URL／可执行节点，再进入空 sandbox 的 iframe；CSP 限制脚本／网络／表单，CSS 资源引用或导入所在样式被省略。CSS 仅用于固定样例画布。Markdown 为有限安全格式；4 个初始样例的缩略图由 `make-thumbnails.mjs` 从已准备的静态版本实际渲染，源码变化后展示当前源码摘要。React／Mermaid 及其他代码展示源码，React 封面明确标注原创示意图。复制／下载保留原始源码，预览限制不适用于下载后的文件。
- 静态适配为内存集合，刷新恢复样例，明确展示保存边界；SQLite／Drizzle／Next.js 服务端／REST API／MCP／云存储与 React CDN 均未连接，也不执行导入的代码。环境变量、外部服务、安装与构建均不需要；不是生产沙箱或安全代码仓库。保留本地 Inter 和 Lucide 许可。
- 实测：5 项引擎测试与 117 项静态／浏览器检查通过，覆盖组合筛选、复制与逐字节下载、版本恢复、回收站、受限预览、缩略图失效及刷新重置。已人工核对桌面／手机全页、详情／版本／编辑状态与真实 `out\preview.png`；记录在 `.checks\`。本轮仅准备静态版本与关闭的登记，未安装、构建或发布。
