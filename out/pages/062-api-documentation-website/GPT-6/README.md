# Orbit API Reference

- 输入：`data\prompts\062-api-documentation-website\062-api-documentation-website.md` 与通用 `DESIGN.md`；模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/JavaScript 源码位于本目录，独立静态版本 `out\index.html`；静态 HTTP 服务即可运行，环境变量为空，页面渲染使用 JavaScript。
- 功能：三栏参考、可折叠导航与搜索、六语言示例和复制降级、明暗主题、三种版本、九个端点沙盒、内存 CRUD、筛选和翻页、错误/限流、Web Crypto HMAC 实验、公共演示 key、手机导航。
- v2.1 使用 name、cursor 和 include=projects；v2.0 使用 name/cursor 并拒绝 include；v1 使用 full_name/page。文档、示例和本地验证联动。少数版本差异为文档合同，实际网关未实现。
- 所有 API、账号、计划、状态、日期、文件 URL 和数据均为虚构示例；`api.example.com` 为保留域名。沙盒只处理本地数据，60 次/分钟窗口与 120ms 延迟均为模拟，不发送请求。写操作只影响本页；Reset 恢复种子数据。
- OAuth、批处理、Webhook 投递及真实服务未接入；签名实验实际使用浏览器 HMAC-SHA256 验签和五分钟时间窗。输入仅接受公共 demo_ / whsec_demo_ 格式，实际凭据排除在复制示例及支持摘要之外。
- 无专有 SDK，安装示例使用真实 HTTP 库 Undici、Requests、Faraday、Go net/http、Guzzle，链接指向各自公开文档与仓库；本站未安装这些库，也未请求虚构 API。
- 仅主题偏好保存于 `orbit-docs-theme-v1` localStorage；key、请求、响应与业务数据仅存当前页。外部库文档和 Stack Overflow 由用户主动打开；示例联系地址和状态已说明语境。
- 本地字体 Inter（OFL）、系统等宽字体、Lucide 图标（ISC）附许可；品牌标记为原创。源码与必要资源单独复制至 `out\`。
- 验证入口 `verify.mjs`；截图/记录 `.checks\`，真实首屏 `out\preview.png`。预期公开路径 `pages/api-documentation-website/GPT-6/index.html`，验证后登记默认关闭，汇集与发布独立授权。
- 已通过 220 项静态与浏览器断言，覆盖五种视口（320–1440px）、CRUD/错误/限流、版本与分页、复制/搜索/主题/存储异常、请求取消、浏览器与公开 Node 示例的真实验签；27 个 Node 请求示例另经语法检查。其余语言示例未连接真实服务执行。
