# Vanguard Commercial

- 输入：`data\prompts\019-commercial-property-listings\019-commercial-property-listings.md`、`src\workflows\AI Agent\DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- 本目录为 HTML/CSS/JavaScript 源码；`out\` 是完整静态首页／本地资源及真实 1200×900 `preview.png`。无环境变量、后端或构建。字体／图库／Lucide／地图来源与许可见 `assets\CREDITS.txt`。
- 交互：地点自动完成、类型／交易／八组折叠过滤、租售价格与面积双范围、快捷条件、同交易价格及面积排序、真实三条记录分页、内存收藏、Grid/List/Map、地图拖移／缩放／聚合／标记预览／矩形区域搜索／全屏／示意配色、移动抽屉与底栏、触摸照片、市场文件下载、本地提醒／上架／看房／需求表单。
- 根目录检查：`node --check "out\pages\019-commercial-property-listings\GPT-6\app.js"`；`node --test "out\pages\019-commercial-property-listings\GPT-6\page.test.mjs"`。已有 Chromium／Playwright 测试公开子路径及桌面／移动布局，记录在 `.checks\`。
- 待选发布路径为 `deploy\dist\MusePages\pages\commercial-property-listings\GPT-6\index.html`；只禁用登记，尚未 dist、publish 或上传。

**Mock／边界：** 原始 2,400+／35 市场／248 条和侧栏计数标注为原需求数据，实际搜索与分页仅三条原记录，独立 featured 广告不参与过滤；“Newest”保持来源顺序。租售价格单位不同，价格排序先分交易；月租按原文取整，仅基础租金。其他城市／Flex／Land／Mixed-Use／Sublease 可诚实返回空结果。

原房产／经纪人／联系邮箱／电话／许可证／市场指标及认证均未核实；图为图库示意，非对应楼宇或人员。原文未提供的主记录筛选类级、设施、认证与可用天数明确为演示夹具。地图是原创非地理定位示意图，矩形与可见区域可筛选；Satellite 仅改变配色，非真实卫星服务。照片滑动提供同一图库图的两种裁切。下载包含完整四项原市场指标及限制，非伪造研究报告。

收藏仅当前页面内存。表单只生成安全文字预览，清空联系字段；关闭弹窗或重开需求移除预览，无预约、提醒邮件、真实上架、付款或数据储存。原邮箱可能属于其他真实业务，所有经纪人联系动作保持本地；原 vanity 电话不作为可拨号码，个人电话未提供。看房日期为当地明日起，仅偏好，不是实时可用时段。
