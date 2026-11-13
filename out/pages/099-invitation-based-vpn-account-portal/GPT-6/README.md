# LeiaGuard

- 原始输入：`data/prompts/099-invitation-based-vpn-account-portal/099-invitation-based-vpn-account-portal.md` 与通用 DESIGN。实际模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 原生 HTML/CSS/JavaScript，源码在本目录，静态版本 `out/`，目标路径 `pages/invitation-based-vpn-account-portal/GPT-6/`。鼠尾草绿/暖白界面，完整英/波斯语切换，按原需求保持 LTR；五平台双语六步指南与官方链接。
- 本地 RAM 邀请注册/登录/退出、30 天单次邀请码、最多 50 用户/100 邀请、每用户 6 设备、版本替换/移除、公开管理员启停/设备数/密码重置；每分钟 5 次滚动本地认证尝试。公开样例 `alex_sample` / `Demo-pass-42!`，邀请码 `JOINDEMO`。密码只作 RAM SHA-256 演示，不是生产认证；刷新还原，无日志、存储、遥测或环境变量。
- 下载实际生成的 **不可导入教学 TXT**：无效 key、`.invalid` endpoint 和文档保留地址。真实 QR version 1-L 只编码 `DEMO:短标识:版本` 参考文本，含四模块静区；不包含配置或密钥。管理员停用只令本地样例失效；重新启用后需逐设备再生成。既有下载留在用户设备。
- 原 PRD 的 Next.js/SQLite/NextAuth、真实 WireGuard、私钥生成/加密、HTTPS 分发、真实鉴权/会话/限流、服务器 peers/即时撤销、50 并发、部署/可用性均未实现；公开管理员不是安全边界。没有真实 VPN 服务。教学样例保留源码和许可，采用本地 Inter/Lucide，无外部图片。
- `node make-art.mjs` 为资源准备，非构建；`node --check app.js`、`node --test engine.test.mjs`；静态 HTTP 服务访问 `out/index.html`。语法、7 项单测、79 项静态/浏览器检查通过：并发邀请码单次使用/到期、口令与滚动限流、设备归属/上限/再生成、停用与重新启用、公开重置、实际 TXT/SVG/剪贴板、双语全部五平台指南、键盘 tabs、320px 与刷新还原。QR 已校验原始字节解码和七项 Reed-Solomon syndrome，未另用实体手机扫描。已核看桌面/手机全页、实际预览、QR、英/波斯语管理、波斯语主页/指南/设备。未安装、构建、发布或提交，登记默认关闭。
