# Golden Crumb Bakery & Cafe

- 输入：`data\prompts\011-bakery-and-cafe\011-bakery-and-cafe.md` 与 `src\workflows\AI Agent\DESIGN.md`。
- 模型目录：`GPT-6`；实际模型：`gpt-6.1-sol`。独立 HTML/CSS/JavaScript，源码在当前目录，静态首页为 `out\index.html`。
- 功能：26 项分类菜单、购物袋与数量/金额计算、本地保存、营业日取餐校验、图库灯箱、可暂停/滑动的评论轮播、餐饮与订阅预览、邮件演示、移动导航及示意地图缩放。
- 运行：通过静态 HTTP 服务访问 `out\index.html`；无安装、构建、环境变量或运行时后端。预期集合位置：`deploy\dist\MusePages\pages\bakery-and-cafe\GPT-6\index.html`；登记默认关闭。
- 复验：仓库根执行 `node --test out\pages\011-bakery-and-cafe\GPT-6\page.test.mjs`；预览使用现有 `src\workflows\generate-preview.mjs`。实际验证结果写入生成日志。
- 已验证：8 项 Node/Chromium 检查通过，覆盖 320、390、768、1200、1440px；已核对 `.checks\` 桌面/移动截图和 `out\preview.png`（1200×900）。
- 素材：本地字体、Lucide 图标、Unsplash 示意照片及原创 SVG；来源和许可证见 `assets\CREDITS.txt` 与各许可文件。

虚构商店、人物、菜单、评论和库存。照片不代表实际店主或具体商品；地图非实时导航。取餐时间使用设备本地时间，周一休息，周日仅糕点与饮品；菜单与过敏原标记为演示数据。所有下单、报价、订阅和邮件操作仅在浏览器演示，不发送、收费或预订。只保存购物袋，不保存联系信息；存储受限时使用内存。付款标记和社交账号无真实集成。
