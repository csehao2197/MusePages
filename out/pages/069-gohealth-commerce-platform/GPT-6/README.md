# GoHealth

- 输入：`data\prompts\069-gohealth-commerce-platform\069-gohealth-commerce-platform.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原创奶油白/鼠尾草绿 HTML/CSS/ES Modules 静态首页；源码在本目录，独立版本 `out\`，真实首页预览 `out\preview.png`。六种原创非药品日用品插画、无医疗功效或认证声明；价格为样例 USD。本地 Inter 和 Lucide 保留许可。
- 浏览、分类/搜索与 URL 恢复、详情、本地客户角色预览、数量购物车、本地订单模拟/下载、七日分析图/数据表/CSV、分类新增/重命名/空类删除及商品改类均可实际操作。
- 角色切换仅控制 UI，所有访客均可进入样例编辑器；无登录/注册、密码采集、Supabase、RLS、服务端授权或受保护数据库。本地角色不等于安全身份。原需求 Next.js/MySQL/Hostinger/Redux/Recharts/Vercel 及真实订单系统待独立实现，未误称已接入。
- 唯一持久化键 `gohealth-demo-cart-v1` 仅保存样例商品 ID/数量；刷新后需重新选本地角色，购物车恢复。存储失败时降级为本标签页内存。角色、编辑目录和订单模拟不持久化；结束演示只清理本项专用键与内存数据，保留其他存储。
- 订单明确为未提交/未付款的本地模拟，邮费和最终总额为 `null`，无库存预留或寄送。未接入支付、邮件、个人资料、医疗服务或真实客户记录。
- 图表使用明确标注的 2026-11-07 至 2026-11-13 固定七日样本，与表格/CSV 共用数据；与本地订单模拟无关。分类数据仅在当前标签页变更，重名和带商品分类删除有保护。
- `node prepare-resources.mjs` 仅生成原创 SVG；`node --check app.js` 检查语法；现有 Playwright 与 `verify.mjs` 验证临时 HTTP 与交互，记录和截图在 `.checks\`。无新增依赖、应用构建、Lighthouse、跨浏览器或完整 WCAG 审计；未声明性能目标或安全审计通过。
- 静态概念 `noindex,follow`。预期公开位置 `pages/gohealth-commerce-platform/GPT-6/index.html`，登记默认关闭；集合构建和发布独立授权。
- 实测通过 105 项检查：五视口、资源解码、购物车恢复/异常存储降级、模拟订单 JSON、图表/表格/CSV 一致性、分类 CRUD/容量/删除保护及手机交互；无浏览器错误或自动外部请求。已人工核对桌面/手机全页、真实预览、分析、手机目录与购物车，布局和层级正常。
