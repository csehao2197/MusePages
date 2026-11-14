# BrightPath

原始需求：`data\prompts\048-student-dashboard\048-student-dashboard.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。实际模型：`gpt-6.1-sol`，沿用 `GPT-6` 目录。

HTML/CSS/JavaScript 静态首页；源码在本目录，独立产物在 `out\`。以任意静态 HTTP 服务访问 `out\index.html`，无需依赖安装、环境变量或构建。公开路径：`pages/student-dashboard/GPT-6/index.html`，本轮仅登记默认关闭的发布选项。

含五门可搜索课程、原创树结构/神经网络/文稿插画、练习问答、文件提交预览、周日程与 .ics 导出、成绩反馈、84 天活动图、公告已读、资源与支持预览、响应式底栏及原生键盘对话框。Lucide 风格图标以内联 SVG 保存。

所有人物、课程、成绩、消息、活动与日期均为虚构示例。Spring 2026 标签与 October 示例周沿用原需求，非实时校历；45 分钟倒计时从页面加载计时。仅模拟前端行为，状态刷新后重置；文件留在本机，无实际上传、消息、预约、账户、实时课堂、后端或 Google 同步。日历下载使用浮动本地时间，包含示例学习事件；非完整课程平台。

验证：`verify.mjs` 导出浏览器交互检查，实际结果在 `.checks\validation.json`；桌面、移动及整页截图在 `.checks\`，真实 1200×900 预览在 `out\preview.png`。静态资源、五档视口、搜索、练习、提交与重置、日程、下载、反馈、公告、消息转义、资料菜单、资源、活动及移动入口由本轮检查运行器验证。尚未执行集合汇集或部署。
