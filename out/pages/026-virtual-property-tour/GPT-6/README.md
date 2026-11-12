# The Alder House

原始输入：`data\prompts\026-virtual-property-tour\026-virtual-property-tour.md` 与 `src\workflows\AI Agent\DESIGN.md`。实际模型：`gpt-6.1-sol`，目录标签 `GPT-6`。类型：原生 HTML/CSS/JavaScript。

源码为本目录的 `index.html`、`style.css`、`app.js` 和 `assets\`；静态首页位于 `out\index.html`，候选公开路径为 `pages/virtual-property-tour/GPT-6/index.html`。无需环境变量、安装或构建。

实现真实 WebGL 球面全景、拖拽／缩放／双指捏合、四房间、投影热点、示意平面图、独立双视图、图文／视频、导览与全文、同图暖色对比、示意测量和可拖动／旋转沙发、本地分享／QR、预约预览、对比度及动态偏好。默认关闭自动旋转、语音和音乐；语音仅使用可用的本地英语系统音色。连接信息可用时自动选择 1K／4K；也可手选 1K／2K／4K，按设备纹理上限降级。首载使用轻量预览，四张主要照片为 1600 像素。设备方向及 WebXR 按浏览器能力与用户授权启用。

全部房源资料、地址、尺寸、布局和规格为虚构示例。四幅 Greg Zaal / Poly Haven CC0 全景来自不同地点，卧室源为酒店，客厅原图有地毯；木地板／书架／2023 HVAC 是明确标注的概念规格。测量为示意平面图欧氏距离，沙发判断只比较矩形占地。学校、税费、HOA、代理资料均未提供。真实 Pexels 航拍与本房源及 Austin 无关；街区视频是同一素材另一片段。虚拟漫游录像为本查看器录制，不是连续实地走拍。暖色比较是同一张照片的 CSS 调色。

Save 仅在当前标签有效；分享链接取当前静态地址，本地预览地址只在可达环境有效。QR 在本地编码。表单只生成本地预览，关闭清除联系内容；没有后端、账户、投递、支付或真实预约。许可证与精确来源见 `assets\CREDITS.txt`。真实设备方向、头显与系统语音需要相应硬件／本地音色，自动化模拟不能证明实际硬件兼容。

验证入口：从仓库根执行 `node --check out\pages\026-virtual-property-tour\GPT-6\app.js` 和 `node --test out\pages\026-virtual-property-tour\GPT-6\page.test.mjs`。语法检查及 Chromium 8 项测试通过；覆盖真实纹理、全屏、导览计时、测量与键盘精确坐标、真实视频播放、方向授权／模拟、五种宽度及横屏、真实手机拖拽／捏合。206 次运行请求全部为同源 GET。已实际审阅桌面、手机、横屏、房间／测量／分享／比较截图，并用独立解码器验证 QR 截图像素。阶段状态以 `metadata.json` 为准。本结果仅作为关闭的发布候选，未执行 dist、publish 或上传。
