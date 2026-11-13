# avarc 历史地点档案

- 输入：`data\prompts\088-historical-location-directory\088-historical-location-directory.md` 和通用 `DESIGN.md`；原文引用的细分 spec 未提供。实际模型 `gpt-6.1-sol`，本目录为 HTML/CSS/JavaScript 源码，独立静态版本 `out\`。
- 原创档案插画、柏林示意地图及六个双语地点；英德界面／搜索／分类／世纪／排序、列表与地图同步、键盘标记选择、鼠标平移、按钮缩放／定位／适配；新增／编辑／删除、草稿保护、UTC 时间戳与时区展示。支持全球坐标，柏林之外使用无地理底图的坐标网格；最多 20 条内存记录，刷新复位，缺德语时回退英语。
- 原登录式全栈需求静态适配为公开预览，不含 Keycloak、真实身份或权限隔离、Next.js 运行时、Spring Boot、nginx、API、数据库或 MCP。历史文字与坐标为编辑样例，非权威名录；道路与河流仅为原创示意，非导航地图，不使用地图瓦片、地理编码或设备定位。
- 无环境变量。普通静态服务器可访问 `out\index.html`；公开子路径 `pages/historical-location-directory/GPT-6/index.html`，发布登记默认关闭，未运行构建／汇集／发布。Inter、Lucide 许可随资源保留，`make-art.mjs` 重生成原创 SVG。
- 已通过语法检查、5 项坐标／日期／翻译回退／过滤／投影逻辑测试与 104 项静态／浏览器检查；实际验证英德切换、键盘地图选择、真实鼠标平移、缩放定位、CRUD、脏稿保护、全球坐标网格、文本转义、时区及移动端，并查看桌面／手机、德语、外部地点、编辑器和真实预览。入口 `engine.test.mjs`、`verify.mjs`，记录位于 `.checks\`。
