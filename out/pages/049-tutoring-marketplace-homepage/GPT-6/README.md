# BrightMinds

输入：`data\prompts\049-tutoring-marketplace-homepage\049-tutoring-marketplace-homepage.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，沿用 `GPT-6` 目录。

原生 HTML/CSS/JavaScript，源码在本目录，独立静态版本在 `out\`。通过任意 HTTP 静态服务打开 `out\index.html`；无需环境变量、安装或构建。公开路径：`pages/tutoring-marketplace-homepage/GPT-6/index.html`，本轮仅登记关闭选项。

温暖紫色编辑式布局、原创 SVG 人像/课堂/图表、八类学科、四位样例教师、搜索和预算筛选、教师及试听预览、套餐价格计算、教师申请预览、FAQ、邮件兴趣预览与移动导航。零外部资源请求。

全站为虚构示例：教师、资质、大学/公司关联、评价、学生故事、平台指标、收益与政策均为概念；插画替代照片，未冒充真实人物或课堂截图。仅四位教师，无完整 150 学科目录；其余分类返回空状态。搜索为显式过滤而非 AI 推荐。无实际课堂、账户、预约、邮件、支付、退款、验证、App 或存储，刷新重置本地预览。

套餐独立展示：五付费加一免费实际节省 16.7%，十/二十课包节省 15%，避免将不同优惠混为一项。试听为 30 分钟，其余计算单位为 60 分钟；时段为无日期本地样例。

实际静态/浏览器检查由 `verify.mjs` 与本轮运行器完成，五档视口及交互结果见 `.checks\validation.json`，桌面/移动截图见 `.checks\`，真实 1200×900 首屏预览为 `out\preview.png`。未汇集或部署。
