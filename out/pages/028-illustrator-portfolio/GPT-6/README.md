# Maya Torres — 插画概念作品集

输入：`data\prompts\028-illustrator-portfolio\028-illustrator-portfolio.md` 与本轮 `src\workflows\AI Agent\DESIGN.md`；实际模型 `gpt-6.1-sol`，目录选择名 `GPT-6`。原生 HTML/CSS/JS，源码在此，静态交付 `out\`，候选路径 `pages/illustrator-portfolio/GPT-6/index.html`。

18 幅原创 SVG 插画与 WebP、四视图作品详情、内联 SVG 图层动画、六项分类、每批六项加载、可访问原生模态框、手机滑动、全屏菜单、暗色模式、滚动导航／视差、四商品本地目录、可暂停评价滚动、服务预填、本地询盘与清除、样例 CV、SEO。编辑 `assets/projects.js` 维护作品。Playfair Display、Inter 与 Lucide 本地加载。

人物档案、RISD、年限／项目／客户数、品牌关联、原 brief 评价、报价、印数和邮箱均显著标注为未核实样例。原创画作不属于提及品牌的委托作品；工具栏中的 Instagram／Behance 使用现有 Lucide Camera／PenTool，平台主页链接待替换真实账号。工作室照片为无关素材。实际作画方式为 SVG，非档案所列 Procreate／Photoshop。无后端、投递、付款、真实库存、存储或环境变量；主题仅在内存，询盘仅当前标签页。

静态 HTTP 服务访问 `out\index.html`。测试：`node --test out\pages\028-illustrator-portfolio\GPT-6\page.test.mjs`；视觉与验证记录在 `.checks\`，阶段以元数据为准。未构建、dist、发布或上传。上线前补齐真实身份、肖像、经历／教育证明、客户／评价许可、报价和使用权、库存／印刷／物流、联系方式、社交账号及隐私／投递服务。许可见 `assets/CREDITS.txt`。

实际验证：6 项测试全部通过；覆盖 18 项四视图、筛选／分页、真实手机滑动、320–1440px 布局、暗色模式、评价自动滚动／悬停暂停、安全本地询盘和资源。两幅动态作品分别验证真实图层移动，系统减少动态时使用静态图。已审阅桌面／手机首屏、作品详情、两幅动态场景、暗色评价及询盘截图。
