# Keystone Property Group

原始输入：`data/prompts/025-property-management-company/025-property-management-company.md`；设计：`src/workflows/AI Agent/DESIGN.md`。实际模型 `gpt-6.1-sol`，目录标签 `GPT-6`。纯 HTML/CSS/JavaScript，源码在本目录；完整静态首页和资源在 `out/`。

双受众首页包含六项展开服务、六个房源／三页独立租赁预览、筛选与横滑、实时 ROI、业主／租客演示门户、真实样例 PDF、六项 FAQ、三档定价和本地表单。DM Sans、Inter、Lucide 和有署名的 Pexels 图片均随静态资源保存；图片不是实际 Austin 房源，两个卡片共用不同裁切。来源及许可见 `assets/CREDITS.txt`。

ROI 使用真实算术：潜在租金 × 空置率得到当前收租；管理后空置率为当前值与 2% 的较小值；扣除所选 8%／10% 管理费后比较净收益。默认潜在年租金 $21,600、当前收租 $19,440、管理后 $21,168、8% 费用 $1,693.44、净增 $34.56／年。2% 是演示假设，不是实测结果；保留负收益，不照抄原需求中不一致的数字；类型仅作为咨询背景。未计租赁费、维修、税、保险及融资。

所有身份、统计、评价、保障、执照及会员信息均为未核验的原需求内容。门户无认证、真实账户、支付、维保派单或私有文件；分析／租赁／维修仅本标签页预览，字段成功后清空，关闭预览清除展示信息，不发送或持久化。未提供真实联系方式、办公室、团队或招聘，相关入口说明范围；没有虚构运营渠道。样例 PDF 是实际文件，不是租约、会计凭证或法律意见。

验证：根目录执行 `node --check out/pages/025-property-management-company/GPT-6/app.js`、`node --check out/pages/025-property-management-company/GPT-6/assets/rentals/rental.js` 和 `node --test out/pages/025-property-management-company/GPT-6/page.test.mjs`，最终 **7 项通过、0 失败**；使用已有 Chromium／Playwright，无安装、环境变量、构建或运行时后端。覆盖真实子路径、资源、三页租赁、门户、表单、ROI、键盘／触摸、44px 目标及五种宽度；桌面／手机与关键交互截图已实际审阅，记录在 `.checks/`。

独立公开映射为 `pages/property-management-company/GPT-6/index.html`。仅完成候选静态产物验证后关闭登记；本轮未 dist、发布或上传，未进入正式集合。
