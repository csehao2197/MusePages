# Savory Affairs

原始输入：`data\prompts\012-catering-services\012-catering-services.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。由实际模型 `gpt-6.1-sol` 直接生成，`GPT-6` 为目录标签。

HTML 静态首页，源码位于本目录，静态交付物位于 `out\`。包含服务、可键盘切换的菜单、流程、可筛选灯箱图库、手动／触摸评价轮播、询价估算与校验、FAQ、移动导航和减弱动态效果。图片、字体及 Lucide 图标均本地化，出处和许可见 `assets\CREDITS.txt`。

从仓库根目录验证：

```powershell
node --test "out\pages\012-catering-services\GPT-6\page.test.mjs"
node src\workflows\generate-preview.mjs "out\pages\012-catering-services\GPT-6\out"
```

通过临时 localhost 服务验证实际公开子路径，检查资源、菜单、图库、表单、评价、触摸、焦点、320／390／768／1200／1440px 布局和减弱动态效果；桌面／移动截图位于 `.checks\`，真实首屏预览为 `out\preview.png`（1200×900）。

品牌、场地、价格、服务承诺、评价及验证标记均为演示；询价仅显示本地结果，联系方式为虚构示例。估算只含示例餐费，人员、设备、场地和税费另议；社交按钮显示本地说明。无后台、支付、真实预约、持久存储或环境变量，未执行构建。

静态输出通过后登记为禁用、未部署。预期公开位置为 `pages/catering-services/GPT-6/`；本次未汇集或发布至 `deploy\MusePages\`，也未更新 dist／site。
