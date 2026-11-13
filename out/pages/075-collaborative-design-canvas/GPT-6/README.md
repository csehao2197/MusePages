# CollabCanvas

依据 `data\prompts\075-collaborative-design-canvas\075-collaborative-design-canvas.md` 与通用 `src\workflows\AI Agent\DESIGN.md`，由真实模型 `gpt-6.1-sol` 生成。类型为独立 HTML/CSS/ES modules 静态首页；源码在本目录，静态交付在 `out\`。

奶油纸面、紫色与珊瑚几何海报，配可操作 SVG 编辑器：四种对象、选择/多选、拖动、旋转/缩放手柄、属性编辑、锁定、图层排序、左/顶部对齐、水平等间距、平移缩放、键盘操作和最多 50 步撤销/重做。导出真实 SVG 或 JSON；精确规则助手支持 `grid 1x1`–`4x4`、`row 1`–`8`、`circle`、`rectangle`、`text ...`。所有状态仅在当前标签内存，刷新复位，上限 100 对象。

本次交付是单人静态概念，原需求中的 Next.js、Yjs 多人同步、服务端锁、Supabase 身份、PostgreSQL/Prisma 历史、OpenAI 接口及云端持久化属于未实现的生产范围。规则助手明确标注为非 AI，无远程请求、浏览器存储、环境变量或真实在线用户。JSON 用于查看快照；导入、分组、路径编辑和触摸捏合缩放在范围外。对齐使用旋转前边界，空间不足时等间距可为负；导出固定 1000 × 620，框外内容裁切，字体使用系统 Arial。

通过任意静态 HTTP 服务访问 `out\index.html`。已通过 `node --check app.js`、`node --test engine.test.mjs`；8 项引擎测试遵循先失败后实现。`verify.mjs` 经会话临时 HTTP/Playwright 验证器完成 148 项检查，见 `.checks\validation.json`：五视口、真实指针手势、快捷键、属性/锁/图层/多选/助手原子失败、非预设缩放读数、50 步撤销边界、真实下载内容及手机操作。已查看桌面、手机、编辑状态与 `out\preview.png`。

公开路径为 `pages/collaborative-design-canvas/GPT-6/index.html`，后续集合位置为 `deploy\dist\MusePages\pages\collaborative-design-canvas\GPT-6\`。本轮仅登记关闭的发布选项，未构建、安装、汇集或发布。

海报与界面原创；Inter 字体遵循 SIL OFL，Lucide 图标遵循 ISC，许可随 `assets\` 保留。独立概念与 Figma 无隶属关系。
