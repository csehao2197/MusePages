# FORME 时装目录

- 输入：`data/prompts/096-fashion-catalog-website/096-fashion-catalog-website.md` 与通用 DESIGN；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/ES modules，奶油白、深橄榄、衬线编辑风格；首页、目录、分类、详情、搜索、收藏、品牌介绍、图库、询问草稿与 404 均为真实 hash 视图。
- 公开 RAM 工作室支持商品/分类 CRUD、草稿/公开/精选、可选 USD 整数分价格、多图、首页/品牌/图库编辑、可读性校验的强调色；图片实际解码、大小/像素/数量限制与引用保护，JSON 导出嵌入新增图片，文本下载明确未发送。
- 当前适配为独立静态版本；Next.js、Neon、Prisma、Cloudinary、Better Auth、登录权限、持久化、Vercel 与真实交易均未接入。全部内容为虚构示例，刷新重置。hash 视图不是独立可索引页面；生产 canonical、独立 sitemap/robots/页面 SEO 需真实域名与服务端。
- 图片来自本地化 Unsplash CDN，来源/许可链接见 `assets/photo-sources.json`，仅为灵感照片，非真实 FORME 商品；商标归原权利人。许可页面本轮访问返回 401，商业再利用前核查具体来源及相关权利。保留 Inter/Lucide 许可。
- 源码位于本目录；用静态 HTTP 服务访问 `index.html`。独立静态版本为 `out/`，实际预览为 `out/preview.png`；登记公开路径 `pages/fashion-catalog-website/GPT-6/index.html`，发布保持关闭。无环境变量、构建、安装或部署。
- 验证：语法、6 项逻辑单测、91 项静态/浏览器检查通过，覆盖五视口、全部公开视图、AND 搜索、价格排序、收藏焦点、多图、草稿发布、重复 slug、分类引用保护、图片真假/大小校验与逐字节 JSON 导出、首页编辑、对比度拒绝、长品牌、键盘 tabs、重置、实际未发送草稿下载与刷新恢复。已核看桌面/手机全页、实际预览、商品编辑器、详情、媒体、320px 询问页；修正手机标题断字与长品牌排版。
