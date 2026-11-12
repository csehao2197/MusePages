# StreetBite Fest

- 输入：`data\prompts\016-food-truck-festival\016-food-truck-festival.md` 与 `src\workflows\AI Agent\DESIGN.md`。
- 模型：`gpt-6.1-sol`；目录标签 `GPT-6`。HTML/CSS/JavaScript 源码位于本目录，独立静态版本为 `out\`，环境变量和运行时后端均无。
- 功能：九类餐车筛选叠加地图分区、八商家目录搜索、交互地图／缩放／列表／真实 PDF、三日键盘日程、三档票价与 CREW20 团体估算、原创本地音频、FAQ、临时表单预览、移动导航与横向触摸。
- 运行：根目录执行 `node --test "out\pages\016-food-truck-festival\GPT-6\page.test.mjs"`，复用现有 Playwright／Chromium，在真实公开子路径验证；`node --check "out\pages\016-food-truck-festival\GPT-6\app.js"` 检查语法。未执行构建或安装。
- 静态文件：`index.html`、`style.css`、`app.js` 和 `assets\` 复制至 `out\`；浏览器打印地图 PDF。1200×900 真实预览保存为 `out\preview.png`；桌面／移动审阅与测试凭据保存于 `.checks\`。
- 待选发布路径：`deploy\dist\MusePages\pages\food-truck-festival\GPT-6\index.html`；新增选项保持禁用、未部署，本轮未汇集或上传。

**Mock 与限制：** 全部活动、商家、演出、赞助关系和评论是未核实的虚构概念。原日期 2026 年 7 月 25–27 日实际为周六至周一，原日程的周五至周日标签保留并显式说明冲突；日期已过。50+ 口号仅提供八家原始商家，其余未编造。三档估算不售票；CREW20 仅对八位及以上付费客人减免入场费 20%，本地规划范围 1–20 人。15 美元鸡尾酒课独立列出，未计入入场估算；酒类需 21 岁及有效证件。表单不发送、存储或订阅；真实业务服务、Spotify 和社交账号未接入。三段可播放音频为原创八秒示意循环，并非艺人录音。

图片为本地图库示意：tacos 为蔬菜而非 birria、slider 为 falafel 而非 jackfruit、shawarma 为鸡肉而非羊肉、Umami 使用菜单中的 Korean corn dog 而非 ramen burger；照片与真实商家／艺人无关联，alt 与署名如实说明。首次 lobster 素材 404 后改用可访问图片。来源和许可见 `assets\CREDITS.txt` 与各 LICENSE 文件；地图、taco 和 WAV 为本次原创，赞助名采用文字排版。

实际验证结果以 `.checks\validation.json`、`.checks\visual-review.txt` 和模型元数据为准；源码存在与登记均不代表已部署。
