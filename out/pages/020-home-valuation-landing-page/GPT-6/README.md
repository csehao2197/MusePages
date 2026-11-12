# Keystone Realty Group

原始输入：`data\prompts\020-home-valuation-landing-page\020-home-valuation-landing-page.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。真实生成模型：`gpt-6.1-sol`，目录标签 `GPT-6`。

HTML 静态首页；源码为本目录的 `index.html`、`style.css`、`app.js`、`assets\`，独立导出为 `out\`。蓝白数据型设计、本地 DM Sans、原创屋顶图形、Lucide 与已署名图库照片。包含两处可键盘操作的示例地址补全、诚实的已知／未知地址结果、原始完整报告与三条可比成交、交互式市场图表、团队、三条评价、CMA 本地预览、单开 FAQ、移动导航／悬浮入口和可编辑的按揭本金利息计算。

通过 HTTP 服务访问 `out\index.html` 即可使用；本地检查：

```powershell
node --check out\pages\020-home-valuation-landing-page\GPT-6\app.js
node --test out\pages\020-home-valuation-landing-page\GPT-6\page.test.mjs
```

无需构建、安装、环境变量或运行时后端。测试覆盖资源／无编号子路径、原数据、地址补全／未知地址、表单校验／安全展示／清除、图表、FAQ、全部页脚动作、按揭边界、五种宽度与移动交互；真实结果见 `.checks\validation.json` 和视觉审阅。正式预览为静态首页实际渲染的 `out\preview.png`（1200×900）。

只有原始示例地址有示例报告，其他地址明确说明不能实时估价。无 Google Places、MLS、估价算法、账户、发送、预约、邮件、跟踪、Cookie 或浏览器存储；CMA 仅在当前页预览，字段随后清空，关闭弹窗删除详情。输入中的价格、2026 年快照、信心／精度、服务时限、历史、交易量、评价、电话与执照均未核实。图表中间点与趋势形状是明确标注的示意数据；$502,500 是原范围算术中点。图库为办公室外四人团队示意，非真实 Keystone 人员或场所。来源与许可证见 `assets\CREDITS.txt`。按揭仅计算固定利率本金和利息，排除税费、保险等，属于演示而非金融建议。

通过检查后仅以关闭状态登记，集合目标路径为 `deploy\dist\MusePages\pages\home-valuation-landing-page\GPT-6\`；本轮实际未执行 dist、publish 或上传。
