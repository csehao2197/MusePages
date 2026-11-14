# Lentera Cinema

- 输入：`data/prompts/073-creative-photography-video-studio/073-creative-photography-video-studio.md`；通用 `src/workflows/AI Agent/DESIGN.md`。输入引用的专用 `design.md` 未提供。
- 实际模型：`gpt-6.1-sol`（GPT-6.1 Sol）；目录沿用 `GPT-6`。类型：独立 HTML/CSS/JavaScript，源码即本目录。
- 原创暗色电影感首页：四类服务、六项视觉研究、分类与历史恢复、图片灯箱、真实静音片头、八个示例套餐、键盘标签切换、FAQ、咨询草稿、基础估算、复制与文本下载。WhatsApp 仅为用户自行选择接收者的外链。
- Mock：作品语境、价格、套餐与评论均为明确标注的示例；照片不是客户作品。没有已核实的工作室、地址、联系人、可用性、预约或支付。表单只在内存；关闭即清除，无 Cookie、浏览器存储、后台、分析或环境变量。
- 静态首页和本地资源：`out/index.html`、`out/assets/`；真实首屏 `out/preview.png`。可由现有 HTTP 静态服务器托管 `out`，在任意子路径访问。登记目标为 `deploy/dist/MusePages/pages/creative-photography-video-studio/GPT-6/`；当前未发布，配置默认关闭。
- 检查：`node --check app.js`；`verify.mjs` 由本轮页面检查器完成 121 项检查，涵盖五视口、图片解码、过滤/历史、灯箱/实际视频帧、套餐/校验、下载字节、复制降级、分享链接、无网络/存储及手机交互；已查看桌面、手机、预览与交互截图。记录见 `.checks/validation.json`；静态服务器应提供 `video/webm` MIME。
- 原需求的 Next.js/Tailwind、生产业务和完全复刻参考站点未实现；本次交付是原创静态首页，不是完整工作室系统。无需安装或构建。

## 素材

五张本地示例照片来源见 `assets/catalog.js`，依 [Unsplash 许可](https://unsplash.com/license) 用于网页视觉参考；原作者保留权利，人物、物业和品牌等额外权利需单独核查，集合不授予额外权限。Inter 的 OFL 与 Lucide 的 ISC 许可随资源保留。`film-poster.svg`、字标及约六秒 `opening.webm` 为本轮原创；影片用 Canvas、Chromium MediaRecorder 和 VP8 实际录制，无音轨、音乐或客户素材。其有限时长、真实播放与不同帧经过浏览器检查。
