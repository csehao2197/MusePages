# Hikari · 光

- 输入：`data\prompts\017-sushi-restaurant\017-sushi-restaurant.md` 与 `src\workflows\AI Agent\DESIGN.md`；真实模型 `gpt-6.1-sol`，目录标签 `GPT-6`。
- 本目录为 HTML/CSS/JavaScript 源码；`out\` 为独立静态版本，包含本地摄影、Noto Sans、Yuji Syuku 日文书法字体和 Lucide。来源与许可证见 `assets\CREDITS.txt`。环境变量、运行时后端和构建均无。
- 功能：滚动导航、减少动态效果、三款季节菜单详情、十八道示例纲要、清酒菜单、六图非对称灯箱、触摸评论、预约本地校验及估算、私人用餐和 newsletter 临时预览。
- 验证：根目录执行 `node --check "out\pages\017-sushi-restaurant\GPT-6\app.js"` 和 `node --test "out\pages\017-sushi-restaurant\GPT-6\page.test.mjs"`；复用现有 Playwright／Chromium，在真实公开子路径检查。真实桌面／移动截图和结果保存在 `.checks\`，1200×900 首屏预览为 `out\preview.png`。
- 静态文件取 `index.html`、`style.css`、`app.js` 和 `assets\`；待选发布路径为 `deploy\dist\MusePages\pages\sushi-restaurant\GPT-6\index.html`。仅禁用登记，未执行 dist、publish 或上传。

**限制与 Mock：** 餐厅、厨师履历、奖项、媒体评论、食材来源、14 席容量和联系方式均为原始虚构概念，未核实。Spring 2026 已归档；图库摄影不代表真实员工、店面或全部菜品，tuna 切部未确认为 otoro、salmon 示意非 Sakura Masu、uni 包含鱼子酱，陈列盘并非完整十八道服务；alt 与来源说明保持真实。

预约按浏览器本地时区校验周二至周六、未来时间、omakase 至少提前 48 小时与 18:00／20:30 两档；1–8 人，185 美元／人，可选 65 美元配酒并要求 21 岁及证件确认。酒吧价格未给出，保持未定；私人用餐仅 6–8 人。所有表单只生成本地文字预览，字段随后清空，不请求、订位、支付、订阅或发送“两小时确认”邮件。原地址未给城市，使用明确非地理定位的原创示意图；地图、社交和外部业务服务未接入。
