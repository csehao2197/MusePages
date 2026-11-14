# The Sunday Edit

- 输入：`data\prompts\051-lifestyle-blog\051-lifestyle-blog.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，输出目录 `GPT-6`。
- 原生 HTML/CSS/JS 杂志首页：分类、搜索、临时收藏、原创短文阅读、合集、订阅预览、移动导航与社交示意图；Georgia/Arial 系统字体。
- 源码位于本目录，静态首页与必要资源在 `out\`；浏览器打开 `index.html` 或通过任意静态服务器预览。无构建、后端、环境变量或新增依赖。
- `verify.mjs` 使用现有 Playwright 检查筛选、空状态、收藏、文章、订阅和移动交互；检查记录与桌面/移动截图在 `.checks\`，真实首屏在 `out\preview.png`。
- 所有人物、出版物、采访、读者数、互动数和文章经历均为虚构示例；原需求长文标题对应原创短预览，不冒充已完成采访、真实书单、医疗建议或核验攻略。季节内容按 2026 归档。
- 订阅只验证并显示本地预览，搜索和收藏仅保留在页面内存，刷新重置。无付款、购物、邮件发送、追踪或真实社交账户。
- 摄影来源、许可及示意范围见 `assets\NOTICE.txt`；照片本地化，页面无外部请求。
- 登记默认关闭；预期公开路径 `pages/lifestyle-blog/GPT-6/index.html`，实际构建发布未执行。
