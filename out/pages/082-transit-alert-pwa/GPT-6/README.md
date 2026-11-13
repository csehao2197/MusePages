# PATH Alert

- 输入：`data\prompts\082-transit-alert-pwa\082-transit-alert-pwa.md` 与通用 `DESIGN.md`；真实模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/ES modules 源码位于本目录，独立版本位于 `out\`；HTTPS 或 localhost 静态服务访问 `index.html`，无需环境变量。
- 通勤首页、4 条路线、站点／严重度／搜索／已读／通勤组合筛选、原文详情、明暗主题、移动底栏、原创近似路线示意图。5 条固定日期原创虚构告警、3 条可重放场景，按来源 ID 去重。
- 路线／站点组内 OR、组间 AND；至少选一条路线或站点。独立 localStorage key 保存已知偏好与已读状态，解析／写入失败降级为内存；重放及摘要仅内存。即时模式显示页内消息，摘要由用户主动打开消费队列；保存偏好清旧队列。
- 真实 manifest、192／512 PNG 图标及当前模型公开子路径内的 Service Worker；预缓存首页、模块、样式、字体与图片，缓存命名含 scope，保留其他缓存与注册。真实离线状态提示；离线只有静态样例。兼容浏览器可从菜单安装，未执行设备安装。
- 没有实时 PATH／X／RSS 抓取、API、数据库、用户认证、Web Push、OS 通知权限或后台送达。固定关键词和站点推断仅用于样例分类。全部标题、摘要和时间明确标注虚构，真实出行链接指向官方 PATH；非 PATH／NJ Transit 附属产品。
- 已通过 6 项逻辑测试、129 项静态／浏览器检查及脚本语法检查；真实离线重载、缓存图片直接访问、偏好持久化／存储失败降级、组合筛选、重放去重与页内送达均已验证。已查看桌面、手机、深色、偏好、摘要及 1200×900 真实预览；`.checks\` 保存结果，无浏览器异常。
- Inter、Lucide 许可随 `assets\` 保留；`make-art.mjs` 生成原创示意图／应用图标及 Lucide sprite。原 prompt 声明 MIT，第三方资源许可单独保留。
- 公开位置 `pages/transit-alert-pwa/GPT-6/index.html`，登记默认关闭；未安装依赖、构建、发布、提交或改动最终集合。
