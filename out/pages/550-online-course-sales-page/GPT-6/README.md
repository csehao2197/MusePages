# Tiny Games Workshop

- 原始输入：`data\prompts\550-online-course-sales-page\550-online-course-sales-page.md`；设计依据：`src\workflows\AI Agent\DESIGN.md`。
- 实际生成模型：`gpt-6.1-sol`；公开模型目录：`GPT-6`。
- 类型：独立 HTML/CSS/浏览器 ES modules。源码位于本目录，静态产物位于 `out\`，公开目标为 `/pages/online-course-sales-page/GPT-6/index.html`。
- 实现：原创像素森林首屏、诚实视频占位模态框、六模块/24课时课程折叠、讲师故事、三项明确标注的示例成果、实际可玩的五颗星收集游戏（键盘/触控、计分、胜利与重玩）、全款/三期同步价格及安全本地存储、30天示例保证、八个 FAQ、带确认步骤的本地报名预览。
- 静态适配：本轮不允许构建，因此未采用原文 Vite 5/React 18/TypeScript/Tailwind 3.4、Motion 或 npm scaffold/build；未安装依赖。使用 Georgia 与系统字体替代未安装的 Domine/Assistant；无框架生产构建、无后端、无真实视频/课程文件/支付/退款/账户/联系表单/收入承诺。固定文案在 HTML，重复课程/FAQ/成果/计划/游戏文案集中在 `content.js`，并非原文要求的全部文案统一 `content.ts`。
- 原始公开 prompt 未包含 Pro 专属 Pages & Sections、Design 配色值或 Assets 清单。此实现自行设计配色与素材，未取得或仿造付费版精确布局、六张指定图片或字体；不宣称与未提供的付费演示完全一致。自绘四张 SVG 替代没有提供的资产列表，无第三方照片或演示截图。
- 所有人物、课程与成果均为虚构。报名只显示计划摘要，不发送或收集数据；保证只是页面示例。全款 $149；三期为 3 × $55，共 $165，明确比全款多 $16。

## 本地运行与验证

从仓库根目录运行 `node src\workflows\script\generate-preview.mjs out\pages\550-online-course-sales-page\GPT-6\out` 可生成真实预览，不进行构建。页面须经静态 HTTP 服务运行，浏览器 ES modules 不以 `file://` 打开。

私有 QA：从仓库根运行 `node out\pages\550-online-course-sales-page\GPT-6\.checks\qa.mjs`，复用已安装的 Playwright Chromium 与 `startPreviewServer`，仅托管本作品 `out`。此命令重新执行源代码/静态检查、桌面 1200×900 / DPR1 与移动 390×844 浏览器断言、截图与预览。私有 QA 不进入公开目录。最终结果以 `.checks\qa.json` 和指定的私有单作品报告为准，视觉人工审阅不是自动重跑所能替代的。

实际验证：`node --check` 检查两份浏览器 JS；私有 QA 于 2026-11-16 UTC 通过 35 项记录断言，桌面 1200×900 / DPR1 与移动 390×844 均检查首页、初始/交互后无横向溢出、全部图片、零 HTTP/资源/请求/console/page 错误、课程与 FAQ 的点击/Enter/Space、模态框 Escape/焦点恢复、三期 $165 精确总额及所有 CTA/刷新持久化、确认后报名预览、键盘与真实触控收集五颗星/胜利/重玩/边界，以及禁用 localStorage 后仍可使用。`StaticHomepage.checkSource`、最终子路径静态资源检查、源码/产物一致检查及 `ensurePreview` 通过，输入和预览 SHA-256 已保存。

已实际打开 `.checks\desktop.png`、`.checks\mobile.png` 与新 `out\preview.png` 逐图审阅：桌面衬线标题与原创森林左右均衡、正文对比清楚、CTA 与成果条层级明确；移动端单列、顶部报名始终可见、标题无裁切，插画自然延伸至首屏下方，未发现明显对齐/间距/溢出问题。截图是固定首屏，不代表长页全屏截图；长页主要交互由实际浏览器断言覆盖。登记仅新增关闭的发布选项，不代表构建、汇集、发布或上线；无环境变量或密钥需求。

## 来源与许可

Prompt by **VibeFather**：https://vibefather.ai/t/online-course-sales-page 。原始快照：https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/online-course-sales-page/prompt.md 。

按 **CC BY-NC 4.0** 非商业适配，原作者保留权利；商业用途需要另行取得适用许可。许可证位于 `LICENSE` 与静态目录 `out\LICENSE`。保留页脚 “Template by VibeFather”。素材与图标来源见 `ASSETS.md` / `NOTICE`，原创插图不表示拥有原模板权利。
