# Flowline Content Hub

- 原始输入 `data\prompts\063-saas-content-hub\063-saas-content-hub.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/JavaScript 源码位于本目录，独立静态版本 `out\index.html`；使用静态 HTTP 服务访问，无环境变量及运行时后端，交互依赖 JavaScript。
- 搜索与六类主题组合筛选、三种排序、每次加载九篇、可直达的文章阅读面板；108 条原创本地编辑简报，主题数实际为 28/22/19/15/14/10。阅读面板是简报，不是完整长文，分钟数为长文概念。
- 原创 SVG 配图、Inter/Plus Jakarta Sans（附 OFL）和 Lucide（附 ISC），本地加载。原创 PDF 手册、HTML 阅读版及 CSV 模板可下载；八步 48 秒字幕交互课包含播放、暂停、前后步与全文，无音频、录制视频或外部播放器。
- Newsletter 仅校验并清空输入，无发送和存储；产品预览使用内存任务看板，关闭即清除。产品、作者、读者数、客户与性能数字均为虚构示例；登录、计费、销售预约和 AI 服务未接入。
- 页面无 cookies、分析或浏览器存储；搜索和主题写入当前 URL，分享前可清空。默认关闭的发布配置仅登记；预期路径 `pages/saas-content-hub/GPT-6/index.html`，实际构建和发布独立授权。
- `verify.mjs` 为浏览器验证入口，截图/记录位于 `.checks\`，真实首页预览 `out\preview.png`。
- CSV 源以 `.txt` 静态资源提供，下载名为 `.csv`，兼容现有资源白名单。
- 已通过 122 项静态/浏览器检查，覆盖五种视口、108 篇加载、组合筛选、深链接、真实下载、课程时间轴和临时看板；浏览器无错误及自动外部请求，桌面/手机全页、阅读、课程、看板与真实预览均已人工核对。
