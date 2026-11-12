# HomeScope Realty

- 输入：`data\prompts\022-neighborhood-guide\022-neighborhood-guide.md` 与 `src\workflows\AI Agent\DESIGN.md`；实际模型 `gpt-6.1-sol`，目录标签 `GPT-6`。
- HTML/CSS/JavaScript 源码在本目录；`out\` 为独立静态首页及本地摄影、DM Sans／Inter 字体和 Lucide 图标。通过静态 HTTP 服务访问 `out\index.html`，无需安装、构建或环境变量。
- 六区域键盘联想搜索、横滑发现卡片、完整 Maplewood 指南、四评分环、地图分类与列表同步、鼠标／触摸／键盘平移缩放、四所学校、通勤、十二个月示意行情及可展开数据、三条居民评论和可选择区域的三列对比。
- 其他五区域提供独立概念简介和对比数据；完整设施与学校指南仅示范 Maplewood。看房与提醒表单执行本地验证和安全预览，关闭后移除个人内容，分别清空字段；联系、房源、政策入口显示真实本地说明。
- 验证命令：仓库根执行 `node --check out\pages\022-neighborhood-guide\GPT-6\app.js`、`node --test out\pages\022-neighborhood-guide\GPT-6\page.test.mjs`；实际截图及结果写入 `.checks\`，真实 1200×900 首屏保存到 `out\preview.png`。
- 实际验证：语法检查及 Chromium 9 项测试通过，覆盖五种宽度、真实鼠标／触摸、地图同步、对比选择与表单边界；已查看桌面、手机、地图、评分、联系和对比截图。
- Mock：Fairhaven 和区域、ZIP 关联、房源、代理及评价均为概念；价格、评分、学校、距离、时刻与行情未核实。地图为原创非比例示意图，非地理编码；原文 GreatSchools 署名仅作未核实引述，未抓取评分或建立关联。照片来自不同真实地点，肖像为示意。示例邮箱不可投递，电话未提供。
- 无后端、实时搜索、实际预约、提醒订阅、发送、账户或持久存储。来源与许可证见 `assets\CREDITS.txt`；重新发布或商业使用前单独核查来源许可，本集合不授予额外权限。
- 验证后仅登记关闭选项；本轮不汇集或部署。选择后目标为 `deploy\dist\MusePages\pages\neighborhood-guide\GPT-6\index.html`。
