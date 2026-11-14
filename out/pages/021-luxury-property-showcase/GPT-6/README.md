# The Meridian Penthouse

- 原始输入：`data\prompts\021-luxury-property-showcase\021-luxury-property-showcase.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。
- 实际模型：`gpt-6.1-sol`，目录标签 `GPT-6`；HTML/CSS/JavaScript，本目录为源码，`out\` 为独立静态首页及资源。
- 暮色全屏首屏、吸顶房源数据、14 图画廊与键盘／触摸灯箱、可缩放选房示意图及真实 PDF、六组配置、八项滑动设施、可拖动缩放的邻里示意地图、四场景二维照片漫游及全窗口切换。
- 按揭按实际输入计算固定利率本金和利息，支持零利率、全部首付及边界校验。看房表单验证电话、邮箱、明日起日期与同意项，使用安全文本展示本地预览，随后清空字段；关闭预览移除个人内容。所有代理、同类房源、社交及政策入口均有本地信息反馈。
- 查看：使用静态 HTTP 服务访问 `out\index.html`。验证：仓库根执行 `node --check out\pages\021-luxury-property-showcase\GPT-6\app.js` 和 `node --test out\pages\021-luxury-property-showcase\GPT-6\page.test.mjs`；浏览器结果和桌面／移动截图保存于 `.checks\`，真实首屏预览为 `out\preview.png`。
- 实际验证：语法检查及 Chromium 8 项测试通过，覆盖五种宽度、真实鼠标／触摸、计算与表单边界；已查看桌面、手机、地图、漫游和 PDF 渲染截图。
- Mock：全部房源、代理、MLS、许可、品牌设备、面积、价格、评分与时间均为原输入的未核实概念数据；照片来自不同地点，肖像为示意。示意图为原创非比例概念布局，服务区域简化，PDF 并非建筑图纸；地图位置未地理编码。二维照片漫游并非 Matterport、全景或空间扫描。保留原输入 marble 与 oak 材质描述，并明确其未核实。
- 电话未提供；`alexandra@example.invalid` 为示例邮箱。本地预览不产生询价、预约、服务承诺或信贷申请。无后端、外部运行时请求、账户、持久存储、环境变量或安装／构建步骤。
- 字体、图标、摄影来源和许可见 `assets\CREDITS.txt` 与同目录许可证；SVG 标记、示意图为本次原创。重新发布或商业使用前单独核查来源许可，本集合不授予额外权限。
- 新选项仅以关闭状态登记，尚未汇入集合或部署；选择后目标路径为 `deploy\dist\MusePages\pages\luxury-property-showcase\GPT-6\index.html`。本轮仅生成和验证。
