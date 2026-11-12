# FareFinder

原始需求：`data/prompts/008-travel-deals-page/008-travel-deals-page.md`；同时使用根 `DESIGN.md`。标记模型为 **GPT-6**，实际模型为 `gpt-6.1-sol`，由当前会话直接生成。

类型：独立 HTML/CSS/JavaScript。源码：`out/pages/008-travel-deals-page/GPT-6/`；可静态部署版本：同目录 `out/`。沿用本地资源，无依赖安装、生产构建、环境变量或运行时后端。

实现优惠搜索、组合筛选、排序、分页、收藏、最多四条真实浏览历史、基于地区的本地推荐、可暂停闪购轮播、跨刷新保留截止时间的倒计时、葡萄牙专题、价格提醒与订阅表单验证、可键盘操作的详情弹窗及演示总价计算。出发地仅筛选标有对应出发城市的含机票样本；车辆价格按一次租赁计。预算边界为 `<300`、`300–700`、`>700–1500`、`>1500` 美元。

运行与验证：通过本地静态 HTTP 服务访问 `out/`，或复用 `src/workflows/generate-preview.mjs`。`checks.mjs` 已通过 320–1440px 七种视口共 577 项浏览器检查，运行时与资源错误为零；实际截图及结果保存在 `.checks/`。已审查桌面、手机截图与真实 1200×900 集合预览 `out/preview.png`。

公开路径为 `pages/travel-deals-page/GPT-6/`；本次只登记禁用、未部署选项。用户选择启用并另行执行发布后，对应位置为 `deploy/dist/MusePages/pages/travel-deals-page/GPT-6/`。

所有价格、折扣、库存、评分、评论、销售时间、分类数量和用户规模均为明确标注的演示样本。提醒与订阅不会发送或存储邮箱；预订按钮仅展示演示确认，没有真实订单、付款、供应商条款、客服或价格保证。收藏、历史与活动开始时间保存在当前浏览器；存储被禁用时退回当前标签页内存。推荐为简单本地匹配。照片是示意库存图片，部分并非对应目的地实景。

图片来源与限制见页脚链接的 `assets/IMAGE-CREDITS.txt`；Amalfi 照片保留 Bruno Rijsman 的 CC BY-SA 2.0 署名及许可，其余为 Unsplash 图片。本地 Outfit、Inter 的 SIL OFL 与 Lucide ISC 许可证随资源保留。再发布或商业使用前单独核对来源许可，本集合不授予额外权利。
