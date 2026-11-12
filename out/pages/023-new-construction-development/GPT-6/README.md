# Ridgeline at Cedar Creek

- 原始输入：`data\prompts\023-new-construction-development\023-new-construction-development.md`；设计：`src\workflows\AI Agent\DESIGN.md`。
- 实际模型 `gpt-6.1-sol`，目录标签 `GPT-6`；独立 HTML／CSS／JavaScript，源码在本目录，静态首页及资源在 `out\`。
- 功能：四款户型的组合筛选、各层原创示意图与报价入口、86 地块状态／兼容户型／列表／缩放、两个真实本地 WebM 视频、六图灯箱、手机规格页签、历史优惠说明、有效日期／隐私表单与邮件偏好预览、响应式导航和页脚。
- 本地运行：`node src\workflows\generate-preview.mjs out\pages\023-new-construction-development\GPT-6\out` 可生成真实首屏预览；使用任意静态 HTTP 服务访问 `out\index.html`。无需环境变量、安装、构建或运行时后端。
- 验证：`node --check out\pages\023-new-construction-development\GPT-6\app.js`；`node --test out\pages\023-new-construction-development\GPT-6\page.test.mjs`；实际结果和截图在 `.checks\`，真实 1200×900 预览在 `out\preview.png`。
- 实际结果：语法检查、Chromium 7 项测试通过；覆盖五种宽度、真实手机点击／原生视频播放／滑动、两个视频播放与拖动定位、86 地块及安全表单边界。已审阅桌面／手机全页、户型、地图实际视口、联系表单及视频截图。
- Mock：价格、学校、地址、牌照、认证、居民评论、地块及日期均来自虚构简报或明确标注的示意数据；2026 年 3／4 月贷款优惠已过期，并非真实销售承诺。原创外观、各层户型及社区地图不是施工图、渲染实景或测绘；视频由已署名的异地 stock 照片制成，不是实地／360° 扫描。图片、字体、图标许可和来源随 `assets\` 保留。
- 表单只在本机展示并清除输入；不发送、不保存、不预订、不订阅，也不连接真实贷款或销售服务。地图外链仅查询简报地址，实际位置未验证。地图 zoom 后可原生横向滚动，手机默认显示可访问的地块列表。
- 预期公开位置：`deploy\dist\MusePages\pages\new-construction-development\GPT-6\`，本轮仅关闭登记（`enabled:false`、`deployed:false`），尚未 dist、publish 或上传。
