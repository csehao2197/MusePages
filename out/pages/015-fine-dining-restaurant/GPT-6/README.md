# Aurelian

- 输入：`data\prompts\015-fine-dining-restaurant\015-fine-dining-restaurant.md` 与 `src\workflows\AI Agent\DESIGN.md`；目录标签 `GPT-6`，实际模型 `gpt-6.1-sol`。
- 类型／源码：本目录中的独立 HTML、CSS、JavaScript；黑金极简编辑式视觉，本地 Cormorant Garamond／Montserrat、Lucide 与摄影，许可见 `assets\`。
- 功能：七道秋季菜单、五款配酒、九款酒单筛选、酒瓶详情、六图 masonry／灯箱／轻微视差、移动全屏导航、周三至周日行程预览、21+ 配酒确认、8–24 人私人用餐估算、订阅与隐私／条款弹窗。
- 运行：任意静态 HTTP 服务打开本目录 `index.html`；无环境变量或运行时后端。无需构建或安装。
- 验证：根目录执行 `node --check out\pages\015-fine-dining-restaurant\GPT-6\app.js` 与 `node --test out\pages\015-fine-dining-restaurant\GPT-6\page.test.mjs`；实际结果见 `.checks\validation.json` 与视觉记录。
- 静态导出：`out\` 仅包含首页及必要资源；`out\preview.png` 为真实 Chromium 1200×900 截图。预期公开路径 `pages/fine-dining-restaurant/GPT-6/index.html`，发布集合目标 `deploy\dist\MusePages\pages\fine-dining-restaurant\GPT-6\`。登记默认关闭，尚未汇集或部署。
- Mock／限制：餐厅、厨师身份、履历、奖项、媒体引言、合作、酒藏和停车均为虚构概念；库存摄影代表氛围，肖像非真实人物身份，酒瓶为原创示意图。2026 年 10 月菜单按归档内容保留；表单仅本地预览与格式检查，金额未含税费／服务费，无实时座位、提交、支付、订阅或存储。日期按纽约日历、周一周二关闭；地图为本地示意，用户主动点击才打开外部地址搜索。字体与图片许可随资源保留，商用或重发前单独核查来源权利。
