# Focus 番茄钟

- 原始输入：`data\prompts\100-pomodoro-productivity-app\100-pomodoro-productivity-app.md`，结合 `src\workflows\AI Agent\DESIGN.md`；实际模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/JavaScript 静态首页；暖纸白、陶土红与鼠尾草绿、原创花形标记和提醒文案、本地 Inter 与 Lucide（许可证在 assets）。无需 Next.js 运行时。
- Focus/Home/Ambient 三视图；真实本地时钟、25/5/15 分钟三阶段、暂停续跑、运行时跳过、重置、长休息周期、两种自动开始、时长设置、全屏、键盘与本地记录下载。空闲新阶段立即采用新设置，已开始或暂停阶段保留原时长；手动进入长休息会重置周期。
- 截止时间计时，实际经过的专注计时纳入总数；跳过、重置和切换的未完成阶段不计完成。最多保留 20 条完成记录。计时不代表实际注意力；本地时钟变化可影响刷新恢复。后台或刷新至多结算一个阶段，下一阶段暂停；自动开始仅在可见页面生效。
- localStorage 单个自有 key `focus-pomodoro-local-v1`，使用 Web Locks 保证同源单标签拥有计时写权限；其他标签只读并可在释放后接管。损坏数据保留，提供明确内存模式和仅重置本应用选项；无存储或锁时使用内存模式。
- 无真实 Google/Supabase/Prisma、账户、后端或云同步；静态范围替代原 PRD 服务端架构及其未经核验的完成声明。无需环境变量，无通知授权或音效。
- 源码在本目录；独立静态版本 `out\`，真实首页截图 `out\preview.png`；预期公开路径 `pages/pomodoro-productivity-app/GPT-6/index.html`，发布后目标 `deploy\dist\MusePages\pages\pomodoro-productivity-app\GPT-6\`。当前仅登记，不发布。
- `node make-art.mjs` 为资源准备；`node --check app.js`、`node --test engine.test.mjs`；静态 HTTP 服务访问 `out/index.html`。语法、8 项单测和 105 项静态/浏览器检查通过：真实开始/暂停/续跑/跳过/周期、设置快照、实际全屏与 JSON 下载、刷新只结算一次、损坏数据保护、真实双标签只读/接管/外部修改保护及内存模式释放锁、键盘与 320px 最长时长。已核看桌面/手机全页、实际预览、Home/Ambient、设置、完成记录和只读标签；动态 Lucide 使用内联路径确保弹窗绘制。浏览器测试使用受控时钟，未作真实 25 分钟长跑或性能基准。无安装、构建、发布或提交。
