# Blu Reserve

- 输入：`data/prompts/098-office-cafeteria-seat-reservation/098-office-cafeteria-seat-reservation.md` 与通用 DESIGN；实际模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/JavaScript 静态首页；蓝色建筑平面、六桌三十座、16 个半小时 UTC 时段、日期/选座/确认、我的预约、取消释放、容量规则、公开模拟登录、真实 JSON 下载。源码在本目录，静态版本 `out/`，目标公开路径 `pages/office-cafeteria-seat-reservation/GPT-6/`。
- 公开凭据 `EMP-DEMO` / `blue-demo` 仅作 Mock，浏览器门禁不构成身份安全；本地 Promise 操作替代所列 API，不存在 Next.js、TypeScript、真实员工、经理鉴权或网络后端。无需环境变量。
- 两个版本化 localStorage key；密码不保存。Web Locks 串行化同源跨标签写入，storage event 同步；不支持 Web Locks 时显式 RAM 模式。损坏数据保留并阻止写入，重置需确认且仅替换本作品两个 key。
- 预约严格检查未来开始时间、09:00–17:00 UTC、七天范围、同座冲突、1–30 模拟容量、每用户每时段一座；可相邻时段预约。1,000 条本地记录上限。公开演示控制可改变容量及模拟竞争员工；均无真实预约。
- `node make-art.mjs` 生成原创图标资源并复制本地 Inter/Lucide 许可，非构建；`node --check app.js`、`node --test engine.test.mjs`。通过任意静态 HTTP 服务访问 `out/index.html`；浏览器模块不支持直接 file URL。无第三方图片。
- 验证：语法、6 项逻辑单测、55 项静态/浏览器检查通过；真实测试公开登录失败/成功/刷新/退出、30 座和 16 时段、键盘焦点、归属配色、预约/取消、三类拒绝原因、跨标签同座竞争仅一项成功、保存数据损坏保护、JSON 下载及精准重置。已核看桌面/手机全页、实际预览、登录、容量错误、预约及 320px 平面；视觉复核修复访客空座误着蓝色和桌面标题连字，并平衡时段栏高度。未安装、构建、发布或提交；集合登记默认关闭。
