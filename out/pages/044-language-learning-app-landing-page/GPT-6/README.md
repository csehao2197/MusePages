# LinguaLeap

- 输入：`data\prompts\044-language-learning-app-landing-page\044-language-learning-app-landing-page.md` 与通用 `DESIGN.md`。
- 模型：`gpt-6.1-sol`，目录标签 `GPT-6`；类型：原生 HTML/CSS/JS。
- 源码：当前目录的 `index.html`、`style.css`、`app.js`、`assets\`。
- 功能：五种语言的固定会话、键盘词语配对、静音交互导览、功能说明、月/年价格切换、本地学习路径预览、导航语言预览、FAQ、移动导航。
- 验证：`node --check out\pages\044-language-learning-app-landing-page\GPT-6\app.js`；`node out\pages\044-language-learning-app-landing-page\GPT-6\verify.mjs`。实测 98 项，宽度 1440/1024/768/390/320、嵌套路径、图片/字体、44px 控件、交互、资源与导出字节一致。五张最终截图已查看，视觉复核后增大正文与说明字号。
- 导出：`node out\pages\044-language-learning-app-landing-page\GPT-6\prepare.mjs`；`out\` 仅含静态首页、资源和真实 1200×900 预览。可使用本地静态服务器访问该目录。
- 集合路径：`pages/language-learning-app-landing-page/GPT-6/index.html`。配置已登记为停用、未部署；本轮仅生成和验证。
- Mock：产品、学习者、人物评价、媒体背书、评分、进度及学习结果均为虚构示例。五个短固定会话与四个词汇配对构成本地演示，完整课程、AI、语音、直播、离线安装、实际试用、账户和付款均为概念；下载的是原创文本练习单。状态随刷新重置，表单仅本地预览。
- 字体、图标、照片来源及许可见 `assets\credits.txt`；照片人物仅作虚构用户插图。日/中文字库仅覆盖示例所需字符。
- 环境变量：无。运行时后端、外部请求和持久化：无。导航可预览英/西/法语标签，正文保持英文。
