# Dzaky — Portfolio System

- 输入：`data/prompts/094-distinctive-single-page-portfolio/094-distinctive-single-page-portfolio.md`；通用设计：`src/workflows/AI Agent/DESIGN.md`；实际模型：`gpt-6.1-sol`，目录 `GPT-6`。
- 原创粗边框复古 OS 设计；HTML/CSS/ES modules，静态可独立运行。使用原生 WebGL 平面着色八面体与 45° 旋转，替代需要构建的 Next.js / React Three Fiber 栈；不可用时如实显示静态回退。
- 13 项目只使用输入中的姓名、身份、经历、技术、教育与证书数据，未独立核实；EN/ID 切换、URL 语言与项目深链、组合搜索/分类、展开目录、双页资料查看器与键盘导航、原生经历折叠、真实剪贴板、随机原文片段、未发送消息草稿下载。
- 输入未附照片、项目截图、私人链接或邮箱。身份图块和 52 张英/印尼语资料页均为原创，明确不是产品截图；不虚构联系方式或新增履历。个人项目的技术表来自原始需求，不代表本静态版实现技术。
- 内容源：`assets/content.js`；`make-art.mjs` 生成 `en.json` / `id.json` 镜像、原创 SVG、Lucide sprite，并复用本地 Inter 及许可。状态和消息仅在当前标签内存；下载不发送消息、不保存邮箱、不连接后端。无环境变量。
- 预览：任意静态 HTTP 服务打开本目录 `index.html`。独立静态版本为 `out/`；配置公开路径为 `pages/distinctive-single-page-portfolio/GPT-6/`，候选集合位置 `deploy/dist/MusePages/`，本轮不构建或发布；新登记默认关闭。
- 检查：语法、6 项逻辑单测与 211 项静态/浏览器检查通过；覆盖 5 视口、真实 WebGL 像素/鼠标旋转/上下文丢失回退、13 项目双页导航、52 张图解码、组合筛选、EN/ID 深链与浏览器返回、剪贴板读回/拒绝、经历折叠、草稿实际下载与清空。已核看桌面、手机、实际预览、资料查看器与 320px 草稿表单；修复 320px 网格溢出。
