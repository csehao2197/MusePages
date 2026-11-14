# Mara Ellis — Photography portfolio

- 输入：`data\prompts\085-photography-portfolio\085-photography-portfolio.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/ES modules：纸白编辑式首页、自然比例精选图、集合搜索／分类／排序、竖版集合网格、完整原图灯箱、循环键盘／触摸导航及来源说明。源码在本目录，独立版本在 `out\`，以静态 HTTP 服务访问 `index.html`；无环境变量。
- 原全栈需求静态适配为本地 `assets/albums.json`。实际读取并验证日期目录、slug 冲突、图片 ID、相对路径及 JPG/PNG，文件名排序与显式封面／首图回退；内存缓存 90 秒新鲜、5 分钟到期、合并并发请求，手动重读能反映本地清单增删，窗口聚焦不刷新。失败保留已加载集合；刷新网页重置筛选与缓存。
- Google Drive、服务账号、代理 API、自动云同步、TanStack Query、Next.js、账号、预订、支付和视频均未接入；公开 hash 路由替代服务端路由。静态图片是公开资源，没有私密存储或复制保护，浏览器原生保存仍可用。
- Mara、收藏标题及叙述为原创虚构概念；9 张许可照片不是 Mara 或模型拍摄，地点／拍摄日期未核验。Unsplash 原始图片标识、许可及权利声明在 `assets\NOTICE.txt`，页面 About 列出来源；Inter、Lucide 许可随资源保留。
- 已通过语法检查、7 项清单／排序／缓存／循环逻辑测试及 98 项静态／浏览器检查；实际验证来源转义、集合增删重读、损坏清单恢复、空集、路由、原图比例、焦点恢复、键盘与 Chrome 触摸滑动，并查看桌面／手机、集合／灯箱及 1200×900 真实预览。入口为 `engine.test.mjs`、`verify.mjs`，记录在 `.checks\`。
- 公开位置 `pages/photography-portfolio/GPT-6/index.html`，登记默认关闭；未安装依赖、构建、发布、提交或修改最终集合。
