# Penny Wise

- 输入：`data\prompts\052-personal-finance-blog\052-personal-finance-blog.md` 和通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/JS：首页、原创 SVG、主题筛选、搜索、教育短文、50/30/20 预算、双债务雪球/雪崩比较、CSV 模板下载、本地订阅预览与移动折叠页脚。系统 Georgia/Arial 字体。
- 源码在本目录，独立静态版本在 `out\`；浏览器打开 `index.html` 或使用静态服务器。无构建、后端、外部请求、环境变量或新增依赖。
- `verify.mjs` 使用现有 Playwright 检查筛选、空状态、预算精度/错误输入、债务零利率/无法还清、CSV 内容、订阅和手机交互；记录与截图在 `.checks\`，真实首屏在 `out\preview.png`。
- 预算接受正数美元至 1,000,000、两位小数及规范千分位，逐分分配并保持合计。50/30/20 是示意起点，最低还款与额外还款有区别。
- 债务工具按月计息、四舍五入到分，固定最低支付、额外支付和总月预算，结清后滚存支付额度；无新增费用，最多计算 600 个月。结果不是贷方报价。
- 模板为带公式的本地 CSV，可导入 Excel/Google Sheets；并非已托管的 Google Sheets 文档。输入与邮箱仅留当前页面内存，刷新重置。
- Sarah、读者数、个人收益/还债经历和用户评价为虚构示例；CFA、雇主、媒体名单与产品标题均按概念披露，未核验或冒充资历、报道、2026 银行排名或投资税务建议。文章为原创短预览，不是标注分钟数的完整长文。
- 全部图形原创，说明见 `assets\NOTICE.txt`。登记默认关闭；预期公开路径 `pages/personal-finance-blog/GPT-6/index.html`，实际构建发布未执行。
