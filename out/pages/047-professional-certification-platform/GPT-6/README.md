# CredPath 职业认证平台

- 输入：`data\prompts\047-professional-certification-platform\047-professional-certification-platform.md`，结合 `src\workflows\AI Agent\DESIGN.md`。
- 实际模型：`gpt-6.1-sol`；模型目录：`GPT-6`。保留整合已有 HTML/CSS，补齐脚本、原创插图和本地许可资源。
- 类型：独立 HTML 静态首页；源码为本目录 `index.html`、`style.css`、`app.js`、`assets\`；静态交付为 `out\`。
- 功能：12项认证分类搜索、详情和五问推荐、六节原创迷你课与本地知识检查、三题练习及解析、固定脚本帮助、三条样例凭证查询、套餐比较、团队询价预览、真实 ICS 与水印 SVG 下载、移动导航与减少动效。
- 运行：通过任意静态 HTTP 服务访问 `out\index.html`，支持子路径。无环境变量、构建步骤或运行时后端。
- 验证：`node --test out\pages\047-professional-certification-platform\GPT-6\engine.test.mjs`；6项单测通过。`verify.mjs` 导出浏览器检查，配合本轮检查器完成109项静态／交互检查，覆盖1440、1024、768、390、320宽度；资源和浏览器错误为零。已复核桌面／手机全页、关键弹窗及实际1200×900预览，记录在 `.checks\`。
- 静态资源由 `make-art.mjs` 准备并经工作流复制验证；`out\preview.png` 为实际渲染截图。拟公开路径：`pages/professional-certification-platform/GPT-6/index.html`；本轮仅登记关闭选项，未汇集或发布。
- Mock：品牌、课程、认证、价格、雇主认可、职业数据、调查归因、评价与人物均为明确标注的虚构示例；头像为原创 SVG。账号、付款、考试、监考、实验环境、AI、社区、SSO和销售服务均未接入。表单不外发、不持久化；页面内进度刷新即重置，初始67%和14天连续学习为示例。ICS由用户自行导入，无通知服务。样例日期按 UTC 判定。
- 许可见 `assets\credits.txt` 及字体／图标许可证。未进行真实服务、正式无障碍合规或最终集合入口验证。
