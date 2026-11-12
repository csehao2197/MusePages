# Terroir & Vine

- 输入：`data\prompts\018-wine-bar\018-wine-bar.md`、`src\workflows\AI Agent\DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/JavaScript 源码在本目录，独立静态版本为 `out\`，包含本地图库摄影、原创示意酒瓶／地图、Cormorant Garamond、Inter 和 Lucide；来源与许可见 `assets\CREDITS.txt`。环境变量、后端和构建均无。
- 功能：视差首屏、滚动导航／移动侧抽屉、三款酒详情及搜索／风格过滤／价格排序／30% happy-hour 预览、私人活动与品酒本地表单、活动横向触摸、六图非对称灯箱、五秒评论轮播及暂停／键盘／减少动态效果、newsletter。
- 根目录验证：`node --check "out\pages\018-wine-bar\GPT-6\app.js"`；`node --test "out\pages\018-wine-bar\GPT-6\page.test.mjs"`。现有 Playwright／Chromium 检查真实公开子路径，记录与桌面／移动截图在 `.checks\`，1200×900 首屏为 `out\preview.png`。
- `index.html`、`style.css`、`app.js` 和 `assets\` 为静态交付文件；待选发布路径为 `deploy\dist\MusePages\pages\wine-bar\GPT-6\index.html`。仅禁用登记，尚未 dist、publish 或上传。

**Mock／限制：** 场所、200+ 库存、食材来源、价格、营业优惠、评价及联系人均为未核实概念；这里只列原始三款酒。原创酒瓶是明确标注的示意图，不是实际品牌标签。图库不代表真实店面、员工或活动，露台图展示餐桌而非座椅，烛光图不验证砖墙。

四月活动没有年份，保持原星期、时间和 8／12／20 个剩余名额文案，并明确其非实时数据。品酒表单仅按原价和样例人数上限估算，私人活动只收 8–24 整数人数及当地当天起周二至周日日期，均需 21+ 确认。无真实订位、购票、付款、发信或订阅；预览清空字段并在关闭时移除。城市未给出，地图使用明确非地理定位的原创示意图，社交／礼品卡／招聘／媒体入口为诚实的本地信息面板。评论轮播在非减少动态、可见且无鼠标／焦点／弹窗时每五秒轮换。
