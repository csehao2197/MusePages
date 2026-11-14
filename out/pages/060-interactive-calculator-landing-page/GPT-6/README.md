# Relay

- 输入：`data\prompts\060-interactive-calculator-landing-page\060-interactive-calculator-landing-page.md` 与 `src\workflows\AI Agent\DESIGN.md`。
- 模型：`gpt-6.1-sol`，目录 `GPT-6`；HTML/CSS/JavaScript。
- 源码：本目录 `index.html`、`style.css`、`app.js`、`assets\calculator.js` 及资源；静态首页 `out\index.html`，任意静态 HTTP 服务可运行，环境变量为空。
- 功能：三步输入、实时测算、负收益与回本边界、成本图、12 月累计回报、个性化建议、三种假设、明细、分享回放、主动本机保存、HTML 报告与指南、打印存 PDF、样例试用预览、个人日历提醒、一次性退出意图。
- 模型：52 周/年；人均任务工时 × 人数 × 时薪形成劳动容量价值；加工具替换，扣完整年度订阅和 $2,400 设置费用。行业回收假设 45%–65%，工具替换 70%；容量和时间只计一次，准确性额外金额为零。Starter $29/席/月（至少 3 席）、Team $25（10 席）、Scale $22（25 席）。
- Mock：品牌、客户标识、计划、行业假设与案例均为虚构示意。人数边界随公司档位变化（最大 100,000），工时 0–80/人/周、时薪 0–500、工具 0–1,000,000/月，币种 USD。结果是容量价值模型，实际现金支出和收益可能不同。
- 联系表单仅浏览器内演示；提交生成真实本地文件，关闭清空字段。联系方式与工作流自由文本排除在保存、分享及文件数据之外；报告可包含自行填写的姓名和公司。试用仅生成样例清单；日历是个人提醒。
- 本机保存使用显式操作的 `relay-estimate-v1` localStorage；分享 URL 包含数值、行业、目标。网页资源均为本地文件，原创 SVG、Inter（OFL）、Lucide（ISC）附许可。
- 验证：三个 JavaScript 文件语法检查及静态/浏览器 114 项检查通过，含五种视口、边界金额、跨年回本、存储异常、分享回放及真实文件下载；桌面/手机初始态、结果态和真实预览已人工核对。记录与截图见 `.checks\`，真实预览 `out\preview.png`。
- 预期集合入口：`pages/interactive-calculator-landing-page/GPT-6/index.html`。验证后登记默认关闭；集合汇集和发布独立授权。
