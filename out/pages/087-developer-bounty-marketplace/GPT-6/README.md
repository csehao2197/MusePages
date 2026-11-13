# Stellar Forge 悬赏市场

- 输入：`data\prompts\087-developer-bounty-marketplace\087-developer-bounty-marketplace.md` 与通用 `DESIGN.md`；实际模型 `gpt-6.1-sol`，HTML/CSS/JavaScript 源码位于本目录，独立静态版本为 `out\`。
- 原创铜色锻造 SVG、深色开发者首页；搜索／技能／币种／状态／排序、详情、内存工作台、草稿创建与打开、认领／PR URL 提交／所有者批准／完成及取消／退款状态演示。不同单位分别汇总，最多 12 条样例，刷新复位。
- 原全栈需求静态适配：虚构项目／金额，无钱包、Soroban、资金、资产发行方验证、链上交易、GitHub API、OAuth、数据库或 AI；PR 仅验证 HTTPS URL 格式与目标仓库，未核实存在／作者／合并；身份切换是演示而非认证或安全边界。批准／完成／退款都只是本地状态，不构成真实托管或结算；争议、实际到期处理与账户不在本项范围。
- 无环境变量或运行时后端。普通静态服务器可访问 `out\index.html`；公开子路径 `pages/developer-bounty-marketplace/GPT-6/index.html`，发布登记默认关闭，未运行构建／汇集／发布。
- 已通过语法检查、6 项状态／角色／PR 格式／UTC 日期／过滤逻辑测试与 100 项静态／浏览器检查；实际验证完整本地生命周期、取消退款、错误仓库拒绝、草稿保护与创建、文本转义、重复提交保护、移动端及刷新复位，并查看桌面／手机、审核、创建和真实预览。入口 `engine.test.mjs`、`verify.mjs`，记录位于 `.checks\`；Inter、Lucide 许可随资源保留，`make-art.mjs` 重生成原创插画／图标。
