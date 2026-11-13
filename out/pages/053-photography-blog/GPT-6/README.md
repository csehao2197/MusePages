# Aperture Journal

- 输入：`data\prompts\053-photography-blog\053-photography-blog.md` 和通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/JS 摄影首页：电影感首屏、非对称故事、目的地档案、九图灯箱、键盘翻图、搜索、编辑滑块、器材短评、画框价格预览、订阅及全屏手机导航。系统 Georgia/Arial 字体。
- 源码在本目录，静态版本在 `out\`；浏览器打开 `index.html` 或使用静态服务器。无构建、后端、外部请求、环境变量或新增依赖。
- `verify.mjs` 使用现有 Playwright 检查档案/空状态、灯箱循环及键盘、滑块、搜索、器材说明、价格、订阅和手机导航；记录与截图在 `.checks\`，真实首屏在 `out\preview.png`。
- 本地摄影来源与许可见 `assets\NOTICE.txt`；版权归原作者，Elena 并非拍摄者。标题、地点、季节、照片数量与 EXIF 为概念，素材不保证与其一致，页面及灯箱明确披露。人物与器材使用原创 SVG 示意。
- 原创短文不是已完成的旅行报道、产品实测或长篇照片集；目的地只列已实现预览。器材评分为示例，NiSi 磁吸说法未核验。
- 编辑滑块是同一 JPEG 的 CSS 色调对比，不是 RAW、多重曝光或 Lightroom 实际处理；所列流程为拟议说明。
- 邮箱和选购仅本地预览，刷新重置；无订单、付款、真实库存、发货、社交账户或订阅。媒体、经历和读者数均为虚构概念。
- 登记默认关闭；预期公开路径 `pages/photography-blog/GPT-6/index.html`，实际构建发布未执行。
