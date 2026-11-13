# D’FOOTPRINT

- 输入：`data\prompts\068-handmade-footwear-store\068-handmade-footwear-store.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原创黑白/灰绿产品优先 HTML/CSS/ES Modules 静态首页；源码在本目录，独立版本 `out\`，真实预览 `out\preview.png`。六种原创鞋履 SVG、24 个变体插画与定制草图均明确标注为设计研究，未冒充产品摄影或真实历史作品。本地 Inter 和 Lucide 保留许可。
- 原 prompt 自述的 Next.js Commerce 成品、数据库、品牌照片和联系账号均未随输入提供。本项未修改任何已有作品；采用通用指引允许的静态首页方案与 Inter 回退，而非声称恢复该成品或实际使用 Next.js、TypeScript、Geist、Drizzle/PostgreSQL、Vercel。
- 功能：类别/搜索/排序及 URL 恢复、尺寸和颜色选择/插画切换、可编辑数量购物篮、逐项待审批备注、礼品/贺卡请求、本地订单草稿、带本地图片预览的定制请求、FAQ、配送/退换/隐私/条款/联系说明。
- 所有商品、价格与经营内容为原 brief 的概念展示；定制、礼品、生产期和运费待真实商家确认。草稿只包含样例底价小计，最终总额为 `null`；无下单、库存预留、支付、消息发送或批准。Paystack 按钮明确不可用。
- 参考图片支持 JPG/PNG/WebP ≤5 MB，在浏览器实际解码；未上传，导出仅包含文件元数据，图片需另行附加。无账户、持久化、cookies、广告或外部网络请求；刷新清空购物篮。未编造 WhatsApp/TikTok 账号或联系地址。
- 静态演示使用 `noindex,follow`。真实产品摄影、准确报价、可执行政策、核实联系信息、HTTPS/服务端订单及 Paystack、Google Ads/Merchant 接入均待独立实施与核验；未声称 Merchant 合规或上线。
- `node prepare-resources.mjs` 仅生成原创 SVG；`node --check app.js` 检查语法；现有 Playwright 与 `verify.mjs` 验证临时 HTTP 静态访问及交互，记录和桌面/手机截图在 `.checks\`。无新增依赖、应用构建、Lighthouse、跨浏览器或完整 WCAG 审计。
- 预期公开位置 `pages/handmade-footwear-store/GPT-6/index.html`，发布登记默认关闭；集合构建与发布独立授权。
- 已通过 134 项静态/浏览器检查，覆盖五种视口、全部 24 个颜色变体、筛选/多词搜索/排序及 URL 恢复、购物篮计算/数量上限/审批状态/确认失效、礼品备注、真实 JSON 下载、参考图格式/大小/内容校验和实际解码、全部政策、移动导航及刷新清空；无浏览器错误、自动外部请求或存储。桌面/手机全页、真实首页、商品、购物篮和带图定制请求已人工核对。
