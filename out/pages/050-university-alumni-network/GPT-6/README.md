# Crestfield Alumni

输入：`data\prompts\050-university-alumni-network\050-university-alumni-network.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，沿用 `GPT-6` 目录。

HTML/CSS/JavaScript 源码在本目录，独立静态版本在 `out\`；通过任意 HTTP 静态服务访问 `out\index.html`。无需安装、环境变量或构建。公开路径：`pages/university-alumni-network/GPT-6/index.html`，本轮仅登记关闭选项。

含校园摄影首屏、校友故事、2026 活动归档与 .ics 下载、四档校友筛选、联系/入会/导师/分会兴趣预览、捐赠金额与频次预览、四个基金进度、六地分会、新闻、八项福利、FAQ 式移动福利与固定入会入口。图标为内联 Lucide 风格 SVG。

所有学校、地址、人物身份、大学/公司关联、排名、捐赠、新闻、成果及指标均为虚构示例。原始活动已过期，显示归档并关闭注册；按真实日期计算星期，修正原需求中 4 月 3 日、4 月 9 日的星期矛盾。年度基金精确比例为 72.67%，展示整数四舍五入为 73%。无真实账户、目录权限、联系消息、预约、捐赠、支付、抵税、保险、校友邮箱或成绩单；预览刷新后重置。

本地 Unsplash 素材：校园 `photo-1562774053-701939374585`；三个人像 `photo-1494790108377-be9c29b29330`、`photo-1500648767791-00dcc994a43e`、`photo-1534528741775-53994a69daeb`。来源 `https://images.unsplash.com/`；许可 `https://unsplash.com/license`，允许下载、复制、修改、分发及网站使用。照片为示意素材，不是所命名校友或真实校园，模特未作背书；其余图形原创。最终静态目录包含必要许可说明。

实际静态、浏览器、五档视口、筛选、空状态、表单转义、活动归档、日历下载、给付预览、分会、福利、菜单及资源检查见 `.checks\validation.json`，交互检查定义为 `verify.mjs`；桌面/移动截图在 `.checks\`，真实 1200×900 预览为 `out\preview.png`。未汇集或部署。
