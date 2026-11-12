# Ember & Bloom

- 输入：`data\prompts\010-artisan-coffee-shop\010-artisan-coffee-shop.md` 与根 `DESIGN.md`。
- 模型目录标签：`GPT-6`；实际生成模型：`gpt-6.1-sol`。
- 类型：独立 HTML/CSS/JavaScript；源码为本目录 `index.html`、`styles.css`、`script.js` 与 `assets\`。
- 功能：响应式导航、饮品滑动与键盘切换、完整菜单 PDF、门店路线、购物车增减与本地保存、取餐预览、订阅及积分演示。
- 静态首页：`out\index.html`；字体、摄影与 Lucide 图标均本地化。按需将源码文件与 `assets\` 复制到 `out\`，无需构建、安装、环境变量或后端。
- 预览：在仓库根执行 `node src\workflows\generate-preview.mjs out\pages\010-artisan-coffee-shop\GPT-6\out`。
- 计划公开位置：`deploy\dist\MusePages\pages\artisan-coffee-shop\GPT-6\`；本轮仅准备与禁用登记，未发布。
- Mock：品牌、门店、价格、媒体与评分来自需求；照片为示意，包装与地图为原创 SVG。订单、优惠、订阅及积分均为浏览器演示；姓名与邮箱不发送或保存，购物车仅存产品及数量。第三方链接仅 Google Maps。
- 验证：静态资源与公开子路径、菜单 PDF、桌面/移动交互、320–1440px 防溢出及真实触摸检查通过；已人工核对桌面、移动及 1200×900 首屏截图。预览工作流 7 项回归与本页 6 项浏览器场景通过。
- 复验：仓库根执行 `node --test out\pages\010-artisan-coffee-shop\GPT-6\page.test.mjs`；本轮未构建或发布。
- 许可：`assets\CREDITS.txt` 与字体、Lucide 许可证保留来源；第三方权利仍属原作者。
