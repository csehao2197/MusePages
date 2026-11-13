# Framespace

输入为 `data\prompts\076-visual-page-design-editor\076-visual-page-design-editor.md` 与通用 `src\workflows\AI Agent\DESIGN.md`；真实模型 `gpt-6.1-sol`，类型为 HTML/CSS/ES modules 静态编辑器首页。源码在本目录，独立交付在 `out\`。

原创深绿工具栏、网格画布与 Greenhouse 植物页面样稿。支持新建框架、拖动、缩放/旋转手柄、多选、锁、层序、位置/尺寸/颜色/圆角/文本、透明度滑块与数值同步、四种对齐及水平等间距分布、空格平移、鼠标滚轮和触屏下拉缩放、50 步撤销/重做、真实预览、JSON 下载、项目重命名和确认重置。所有状态只在当前标签内存，刷新复位，上限 80 框架。

使用任意静态 HTTP 服务访问 `out\index.html`。已通过语法检查及 `node --test engine.test.mjs` 的 8 项测试，引擎测试先实际失败再实现。`verify.mjs` 经会话临时 HTTP/Playwright 验证器完成 131 项检查，涵盖五视口、真实手柄/滑块、属性/锁/图层/多选/对齐、分布失败保护、键盘/缩放、50 步撤销边界、真实 JSON 下载及手机操作。已查看 `.checks\` 桌面/手机、实际预览和属性截图，以及 `out\preview.png`。

本次采用原生 SVG 和不可变 JavaScript 引擎，替代原需求建议的 Next.js/Recoil/react-moveable，以保持静态独立运行。属于单人概念，未实现认证、多人、AI、后端、数据库、浏览器持久化、项目导入或生产代码导出；JSON 仅用于查看完整快照。样稿导航及商品文案均为画布素材。对齐按旋转前边界，分布要求足够的非负间距；文字按框裁切，原创植物路径整体缩放，预览为固定 1100 × 700 视图。

公开路径为 `pages/visual-page-design-editor/GPT-6/index.html`，后续集合位置为 `deploy\dist\MusePages\pages\visual-page-design-editor\GPT-6\`。本轮仅登记关闭选项，未安装、构建、汇集或发布；环境变量为空。与 Framer 无隶属关系。Inter 遵循 SIL OFL、Lucide 遵循 ISC，许可随本地资源保留，界面和植物插画原创。
