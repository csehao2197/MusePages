# Crescendo Academy of Music

- 输入：`data\prompts\045-music-academy\045-music-academy.md` 与通用 `DESIGN.md`。
- 模型：`gpt-6.1-sol`，目录标签 `GPT-6`；原生 HTML/CSS/JS，源码位于本目录。
- 功能：四种乐器路径及级别、十二类课程介绍、十八个虚构教师资料、六个示例课时的组合筛选、学费计算、三场历史活动预览与日历下载、试课预览、移动故事轮播、本地地图、通讯预览及 FAQ。
- 验证：`node --check out\pages\045-music-academy\GPT-6\app.js`；`node out\pages\045-music-academy\GPT-6\verify.mjs`。实测 91 项，宽度 1440/1024/768/390/320、嵌套路径、图片/字体、键盘/触控、原生表单、字节一致性与网络边界；桌面/移动全页及真实 1200×900 预览均已查看。
- 导出：`node out\pages\045-music-academy\GPT-6\prepare.mjs`；`out\` 为独立静态首页及资源，可通过本地静态服务器预览。日历内容以允许的 `.txt` 静态资源提供，下载名为 `.ics`，带虚构及取消状态提示。
- 集合路径：`pages/music-academy/GPT-6/index.html`；配置登记为停用、未部署。本轮为生成与验证阶段。
- Mock：学院、师资/学历/演出经历、人物评价、会员/认证、地址/停车/交通、统计及成果均为虚构或未核实。2026 年活动原日期已过，表单仅历史演示；信息随试课预览清空，其他状态随刷新重置。无真实预约、招生、支付、订阅或后端。
- 图片为钢琴、户外小提琴及舞台表演素材，并非校园、师生或建筑外观；地图为本地示意图。来源及许可见 `assets\credits.txt`。
- 环境变量：无。运行时外部请求、持久化、安装、构建与发布：无。
