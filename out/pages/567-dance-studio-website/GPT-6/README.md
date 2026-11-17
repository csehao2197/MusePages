# Offbeat Dance Assembly

英文舞蹈工作室静态双页。实际生成模型：`gpt-6.1-sol`；公开标签：`GPT-6`。

- 原始输入：`data\prompts\567-dance-studio-website\567-dance-studio-website.md`。
- 原作者：VibeFather，<https://vibefather.ai/t/dance-studio-website>。
- 来源快照：<https://github.com/liyupi/awesome-vibe-coding-websites/blob/85431a57f231fa59269dad62c757193d6a3fd0ff/templates/dance-studio-website/prompt.md>。
- 需求许可：CC BY-NC 4.0；署名和非商业限制见 `LICENSE.txt`，图片／字体／图标明细见 `ASSETS.md`。
- 源码：本目录的 `index.html`、`classes.html`、`content.js`、`lib.js`、`app.js`、`icons.js`、`style.css`、`images\` 和 `fonts\`。
- 独立静态产物：`out\`。最终预定路径：`pages\dance-studio-website\GPT-6\index.html` 和 `classes.html`。不需要环境变量、服务端或 API。

## 功能与边界

包含三种舞蹈、三位虚构教师、演出倒计时、三档价格、六项 FAQ、原创简图、移动导航，以及严格按原始数据组织的 24 节周课表。课表按舞种、年龄、级别交集筛选并同步 URL；支持课程详情抽屉、满班电话候补提示和直接试课链接。表单支持未成年人监护人、逐项校验、套餐意向、备注计数、设备本地保存、重访恢复、打印和确认后重选。倒计时使用配置事件偏移，过期归零。

工作室、地址、联系方式、教师、价格、余位均为演示数据。预约仅保存在本机，不会向真实机构占位、发邮件、收款、取消或同步余位；存储不可用时明确提示立即截图。仅保存预约编号、课程 ID、名字和创建时间，不保存邮箱、监护人或备注。重选只删除本机记录，真实改约须电话处理。

本轮明确禁止构建，因此根据协调器授权采用原生 HTML/CSS/ES modules 静态适配，而非原需求 Vite 5、React 18、TypeScript、Tailwind 3.4、Motion 工程。没有执行脚手架、依赖安装或生产构建；没有假称生成 hashed bundle 或框架组件。原有 `lucide-react` 图标预序列化为本地图形；Fontsource 5.3.0 字体与指定六张原图自托管。CSS 和原生 dialog 提供渐进动效、键盘焦点隔离及减少动态效果适配；未实现 Motion AnimatePresence 或 hero 滚动视差。内容与课表主要集中于 `content.js`，界面标签由 `app.js` 组成。

布局是静态适配而非逐像素还原：手机标题自然换行，演出照片采用较高裁切，部分精确蒙版、交错和展开动效简化。指定教师原图实际为背向姿态，并非文字规格描述的正面胸像；保留原始指定资产，不冒称替换或重新生成。

## 运行与验证

从仓库根目录执行：

```powershell
node src\workflows\script\generate-preview.mjs out\pages\567-dance-studio-website\GPT-6\out
node out\pages\567-dance-studio-website\GPT-6\.checks\verify.mjs
```

预览工具只托管该静态目录，并在最终公开子路径访问，不启动应用服务器。第二条执行现有 Playwright Chromium 实测并关闭本次浏览器与服务，截图／断言记录在 `.checks\`，不会公开。

验证证据：`.checks\qa.json`、`.checks\desktop.png`、`.checks\mobile.png`、`.checks\classes-desktop.png`、`.checks\classes-mobile.png`；公开预览为 `out\preview.png`。最终通过情况与截图人工审阅状态以实际 QA JSON 和私有交付报告为准，不以此说明代替测试。静态文件和预览摘要由共享 `StaticHomepage` 维护。

本次最终实测通过：20 组数据／交互／键盘／存储／打印测试，1200×900、1440×900、390×844 视口，交互前后无页面级横向溢出，控制台、页面、请求及 HTTP 错误均为空。另验证了单页试课 PDF、减少动态效果和禁用存储的明确降级。已打开桌面、手机、课表及实际预览 PNG，检查排版、色彩、间距、裁切和响应式；补充区块实图在 `.checks\programs.png`、`instructors.png`、`trial.png`。修复了菜单焦点循环、打印空白页和项目卡片重叠；测试中的抽屉关闭 URL 断言已等待实际关闭事件。测试工具输出的 Node 模块类型推断提示不属于浏览器错误，未为消除提示修改共享 package.json。

发布配置仅登记为默认关闭，未运行 dist、publish、上传或线上部署。
