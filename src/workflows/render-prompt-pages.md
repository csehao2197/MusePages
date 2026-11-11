# AI 页面生成编排指引

你的模型名为Copilot
<model_name>=Copilot

你是 MusePages 的页面生成编排 agent。接收用户指定的模型服务选择名和任务范围，读取原始需求，组织目标模型生成网站首页，核验结果并交付真实状态。

本文件是可供 agent 执行的工作指引，不是网站的原始 prompt，也不是要求重新编写生成脚本。AI 负责范围判断、任务安排、结果核验与异常恢复；生成执行、锁管理、元数据写入及发布登记须遵循现有工作流规则，不另行定义状态或覆盖策略。

**阅读、编写或审阅本文件不等于获得页面生成授权。** 只有用户明确要求执行页面生成，并允许对应代码、元数据与配置写入时，才进入生成阶段。本流程不包含部署、Cloudflare 上传或周期调度，也不自动授权构建、安装依赖或覆盖已有源码。

## 1. 任务

读取 `data\prompts\<prompt_name>\<prompt_name>.md` 中的原始需求，结合根目录 `DESIGN.md`，生成符合需求的网站首页。实现需求明确的页面布局、视觉风格与主要交互，不擅自扩展为完整的生产级系统。

任务按原始需求文件严格串行执行，一次只处理一个md文件，不并行生成多个 prompt，也不提前执行下一项。

## 2. 确认输入、规则与授权

开始或恢复任务时，从仓库根目录读取以下文件：

- [AGENTS.md](../../AGENTS.md)：目录、授权及执行约束。
- [README.md](../../README.md)：当前能力与统一规范，重点阅读[页面生成脚本](../../README.md#页面生成脚本)、[生成覆盖检查与模型匹配](../../README.md#生成覆盖检查与模型匹配)、[项目状态元数据](../../README.md#项目状态元数据)、[模型与发布配置](../../README.md#模型与发布配置)及[静态产物边界](../../README.md#静态产物边界)。
- [DESIGN.md](../../DESIGN.md)：本次页面生成必须使用的设计指引。

## 3. 目标输出

### 静态网页源码

目标网站采用 HTML 静态网站或 Next.js 项目形式，源码与静态产物只写入 `out\pages\<prompt_name>\<model_name>\`，不改动原始需求、其他模型的结果或最终发布目录。

`<prompt_name>` 为原始需求 Markdown 文件名去掉 `.md` 后的名称，保留内部编号；`<model_name>` 沿用本文约定的模型目录名，用于隔离输出，不能代替元数据中记录的真实 `modelId`。

发布登记使用 `deploy\config.json` 的 version 2 格式：`pages` 是以 `<prompt_name>` 为 key 的对象，`pages[<prompt_name>]` 为模型选项数组，选项中的 `model` 对应模型目录，不重复保存 `prompt`。使用现有登记函数兼容迁移旧版数组配置，保留已有选择及组内顺序；新增模型默认 `enabled: false`，仅登记不发布。

每个结果应保留网站源码、运行说明与独立的静态首页：

```text
out\pages\<prompt_name>\<model_name>\
  README.md          # 功能、运行方式、Mock、实际验证与已知限制
  metadata.json      # 真实模型、静态产物位置及各阶段状态
  ...                # HTML 或 Next.js 源码
  out\
    index.html       # 发布用静态首页
    preview.png      # 静态首页预览图
    ...              # 首页所需的 CSS、浏览器脚本、图片和字体等资源
```

静态首页须适用于最终公开子路径，不依赖开发服务器、运行时 API 或数据库，不能用 `.next` 或截图代替。缺少静态导出时保留源码并报告待准备，不自动构建，也不将源码目录冒充可发布产物。

### 预览图

`preview.png` 必须来自对应模型静态首页的实际浏览器渲染，不使用占位图、设计稿或其他模型的截图。`src\workflows\render-prompt-pages.mjs` 在静态检查通过后、发布登记前调用 `src\workflows\generate-preview.mjs`，接收 `out\pages\<prompt_name>\<model_name>\out\` 静态目录作为输入。历史结果以元数据中的实际 `staticDir` 为准，截图与该目录的 `index.html` 同级保存。

截图脚本内置仅绑定 `127.0.0.1` 随机端口的临时 HTTP 服务，无需 `npm start` 或修改模型项目的启动配置；不启动 Next.js 运行时、不执行构建，也不重新生成页面源码。等待资源、字体和首屏图片加载后，以 Playwright Chromium 截取 **1200 × 900** 首屏 PNG，并检查资源错误、JavaScript 异常及明显空白页面；仍需人工核对视觉效果。

```powershell
node src\workflows\generate-preview.mjs out\pages\006-travel-agency-homepage\model-a\out
```

生成流程通过模型源码目录中的 `.generation-preview.sha256` 核对静态产物与截图。只有 `preview: true`、PNG 格式与尺寸正确且摘要一致时复用；`preview: false`、记录缺失、图片损坏或产物变化时重新截图。失败或取消保留源码和旧预览，设置 `preview: false`、`validated: false` 并报告待处理，不继续发布登记；修复后只补后续步骤。`--check` 不截图、不写文件；单独运行截图命令只生成图片，元数据状态由生成流程核验后更新。

### 模型级 metadata.json

`out\pages\<prompt_name>\<model_name>\metadata.json` 保存模型身份及独立执行状态，所有模型结果均包含布尔字段 `preview`，新结果默认 `false`：

```json
{
  "modelId": "actual-model-id",
  "tags": ["Travel"],
  "staticDir": "out",
  "generated": false,
  "preview": false,
  "config_added": false,
  "validated": false,
  "deployed": false
}
```

`preview: true` 只表示对应静态首页的预览已生成并核验，不代表源码、静态交互或发布阶段均已完成。prompt 级共享文件 `out\pages\<prompt_name>\metadata.json` 仍只保存公开标题与 slug，不加入 `preview`。旧模型记录仅缺少 `preview` 时兼容为 `false`，非检查运行核验后保存；`--check` 不改写旧记录。显式字段不是布尔值时报告异常，不以真值转换掩盖损坏数据。

生成前读取模型元数据，按[生成覆盖检查与模型匹配](../../README.md#生成覆盖检查与模型匹配)判断是否需要生成：

| 已有情况 | 处理方式 |
| --- | --- |
| 无结果或仅有空目录 | 作为缺失项，在已获准范围内生成 |
| 元数据有效、模型匹配且 `generated: true` | 保留源码并跳过重复生成；仅缺静态准备、预览、验证或登记时，只补获准的后续步骤 |
| 元数据有效、模型匹配且 `generated: false` | 视为未完成，保留已有产物，仅在明确 `--retry` 授权后重试，不自动清空目录 |
| 元数据有效、模型匹配且 `preview: true` | 核对实际截图与当前产物摘要，一致时复用；图片缺失、损坏或过期时重新截图并更新状态 |
| 元数据有效、模型匹配且 `preview: false` | 静态导出准备就绪后生成预览，不重复生成已完成的源码或自动构建 |
| 已有代码但元数据缺失、损坏、字段不完整或模型不匹配 | 报告待确认，不根据目录存在推断成功，也不直接覆盖已有代码 |

### 执行日志

执行本流程时，将日志以 UTF-8 追加到仓库根目录下的 `logs\render-prompt-pages-ai.log`。仅在获准写入日志后创建缺失的目录或文件，不覆盖已有内容，也不删除失败记录。仅阅读、编写或审阅本指引时，不创建或改写实际日志。

每个 prompt 处理结束后（包括跳过、失败或阻塞），追加一条汇总记录，仅包含以下内容：

- **时间与关联信息**：使用带时区的 ISO 8601 时间，记录本轮执行标识；涉及具体结果时，记录原始 prompt 名称、真实 `modelId` 与输出路径。模型身份尚未确认时明确标注，不用目录名代替。
- **处理结果汇总**：记录本项实际执行的操作、生成或跳过的结果，以及 `metadata.json` 中的 `generated`、`preview`、`validated`、`config_added`、`deployed` 状态；元数据缺失或不可读时明确说明，不推断状态。简述实际验证方式与结论，未执行的检查标注“未执行”；如有失败、阻塞或未完成事项，说明原因、保留的产物及下一步，不将已生成或已登记等同于已验证或已部署。

汇总不包含密钥、令牌或其他敏感信息，不替代 `metadata.json` 与实际产物核验；中断后缺少汇总记录不能作为成功依据。