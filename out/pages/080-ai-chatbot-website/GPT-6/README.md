# Orbit

- 输入：`data\prompts\080-ai-chatbot-website\080-ai-chatbot-website.md` 与通用 `DESIGN.md`；真实生成模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/ES modules 源码位于本目录，独立版本位于 `out\`；静态 HTTP 服务访问 `index.html`，无需环境变量。
- 深色聊天首页、蓝色右侧用户消息／灰色左侧样例消息、真实本机时间戳、多行输入与 120px 自动高度、Enter／Shift+Enter、4 个可审阅起始问题、固定格式化回复、复制、自动滚动和空状态。
- 最多 8 个内存会话，每个最多 20 轮；搜索、切换、清空／删除确认、未发送草稿保留。Alt+N 新会话、Ctrl／Cmd+K 搜索；移动抽屉带焦点和 inert 管理。刷新清空全部状态。
- 每次本地回复显式等待 700ms，显示加载并禁用输入／发送；Stop、Escape、切换／清空／删除会取消未完成样例，令牌守卫防止迟到写入。重试保留原用户消息，无重复问题。
- Gemini 未连接：仅按关键词选择固定样例；“continue”只使用最后一个成功样例类别，未知问题明确无法作答。原 Next.js／TypeScript／shadcn／Gemini API 技术栈采用纯静态适配，无 `/api/chat`、API 密钥或后端。上传、声音、模型调用、认证、持久化、备份、生产限流和可用性指标未实现。
- Demo controls 可独立触发一次网络／无效密钥／限流模拟，均无真实请求或配额消耗；失败可正常重试。浏览器真实离线时显示状态，已加载的本地样例仍可运行。仅在控制台记录不含消息的模拟错误类别。
- 已通过语法检查、5 项逻辑测试与 156 项静态／浏览器检查；`.checks\` 保存真实桌面、手机、对话、加载、控制面板及抽屉截图。验证包括停止／删除防迟到回复、20 轮末条失败重试、8 会话边界、真实离线和刷新复位；复制以浏览器 API 替身验证，保留共享系统剪贴板。入口：`node --check app.js`、`node --test engine.test.mjs` 与 `verify.mjs`。
- Lucide 与 Inter 资源许可随 `assets\` 保留；`make-icons.mjs` 仅生成本地图标。原需求和第三方资源许可分别核查。
- 预定公开位置 `pages/ai-chatbot-website/GPT-6/index.html`，登记默认关闭。未安装、构建、发布、提交或修改最终集合。
