# Iron Ridge Brewing Co.

输入：`data\prompts\013-brewery-and-taproom\013-brewery-and-taproom.md`；设计：`src\workflows\AI Agent\DESIGN.md`；实际模型：`gpt-6.1-sol`，目录标签 `GPT-6`。

HTML 静态首页，源码在本目录，独立交付物在 `out\`。包括 12 款分类酒单和真实 PDF、移动端滑动图库、按日期与人数校验的标准／VIP 导览预览、活动详情与演示日历下载、ZIP 筛选及联动地图、商品选项与订单估算、联系表单、订阅反馈和折叠页脚。字体、Lucide、照片及原创 SVG 均本地化；来源与许可见 `assets\CREDITS.txt`。

从仓库根目录验证：

```powershell
node --test "out\pages\013-brewery-and-taproom\GPT-6\page.test.mjs"
node src\workflows\generate-preview.mjs "out\pages\013-brewery-and-taproom\GPT-6\out"
```

使用真实公开子路径及 Chromium 检查资源、表单边界、金额、弹窗反馈、地图、触摸滑动、键盘、320／390／768／1200／1440px 布局。`.checks\` 保存验证记录与桌面／移动截图；`out\preview.png` 为实际 1200×900 首屏。

品牌、酒单、价格、活动、容量、售卖与分销关系均为虚构示例。所有表单只在本标签页反馈，无后台、支付、预订、邮件、持久存储或环境变量。营业时段按 Asheville 星期显示；活动顺延至下一次日期，日历标明 DEMO。ZIP 为示例分组，地图为非导航示意图。

照片展示相近氛围，包含一名酿酒师的图库照，未取得原要求中三位创始人站在酒罐前的照片；不作为真实创始人肖像。商品采用原创插画。酒厂未注册真实社交账号，Google Maps 为显式外链。饮酒／购买限制为 21+。

未运行构建、汇集或部署；验证后新增登记为禁用、未部署，预期公开路径 `pages/brewery-and-taproom/GPT-6/`。PDF 由实际浏览器打印本页完整酒单得到，后续更改酒单时应同步重新导出。
