# MusePages

**A collection of website front pages generated from prompts.**

MusePages 收集由 AI 根据原始需求生成的网站首页。同一个 prompt 可以交给不同模型，生成代码彼此隔离，最终将可独立访问的静态首页汇入同一个作品集，通过 Cloudflare 托管。

**本文同时记录已实现入口与目标设计。页面生成脚本、AI 编排指引和集合首页模型轮播已提供；`ai-generate` 自动命令入口、增量发布和作品详情页仍属于设计。**

## 导航

- [项目使用说明](#项目使用说明)
- [目标网站设计](#目标网站设计)
- [工作流](#工作流)
- [源码结构与说明](#源码结构与说明)
- [配置与状态](#配置与状态)
- [验证与恢复](#验证与恢复)
- [来源与许可](#来源与许可)

## 项目使用说明

所有命令从仓库根目录执行：

| 命令 | 用途 |
| --- | --- |
| `npm run generate -- <ai model>` | 执行[页面生成工作流](#页面生成工作流) |
| `npm run ai-generate -- <ai model>` | 执行[AI页面生成工作流](#ai页面生成工作流) |
| `npm run dist` | 按发布选择执行[dist工作流](#dist工作流)，生成 `deploy\dist\MusePages` |
| `npm run publish` | 将静态集合复制到 `deploy\site\MusePages` |

`generate` 已实现，配置与限制见[模型与发布配置](#模型与发布配置)。`ai-generate` 仍是待实现接口；现有 `dist` 使用按 prompt 文件名分组的 version 2 配置执行完整本地汇集，兼容迁移旧版数组配置，生成每个 prompt 一个轮播面板，按配置顺序展示选中模型；增量处理和作品详情页尚待实现。

生成前，由管理员配置并启动模型服务，提供调用 URI、API 类型、认证方式和真实模型 ID。`<ai model>` 用于选择服务配置，不等于真实模型 ID；凭据仅从本地环境读取。脚本不管理模型服务器，也不能在服务不兼容时自动换模型。

已有辅助入口保留如下，不替代目标生成流程：

| 命令 | 用途 |
| --- | --- |
| `npm run generate:sample` | 生成固定示例及截图，登记发布选项，不改当前网站 |
| `npm run deploy:sync` | 扫描已有结果并补充发布选项，不发布 |
| `npm run deploy:watch` | 持续监听生成结果并登记选项，按 Ctrl+C 停止 |
| `npm run config` | Windows 终端交互勾选发布选项，仅保存配置 |

交互选择使用 Python 标准库：↑↓ 移动、空格勾选、Enter 保存、Esc 或 Ctrl+C 取消，Home/End 跳到首尾。保存仅更新 `deploy\config.json` 的 `enabled`，保留 `deployed` 及其他字段；集合生成与复制分别运行 `npm run dist`、`npm run publish`。脚本与发布器共享写锁，并在保存时核对配置是否被其他进程修改。

固定示例写入 `out\pages\001-destination-guide\unspecified\`；`unspecified` 表示模型未知，不能改名冒充已知模型。同步只登记含 HTML `index.html` 或声明 Next.js 依赖的 `package.json` 的目录，不证明其已完成或可发布。优先复用共享 npm workspace 依赖，缺少依赖时再安装；截图需要 Playwright Chromium。

## 目标网站设计

### 目标网站结构

目标网站是 AI 生成的网页首页作品集，按 prompt 组织作品，方便用户浏览并比较不同模型对同一需求的生成效果。

集合首页以响应式网格排列作品面板（panel）。每个 prompt 对应一个面板，同一 prompt 的不同模型结果在面板内通过轮播（Carousel）展示，不重复创建面板。

每个面板包含以下内容：

- **作品名称**：使用易读的标题，不展示 prompt 的内部编号。
- **首页预览**：每个新生成的 prompt／模型结果都须提供实际渲染的首页截图，每张 slide 展示对应模型的截图，并标注真实模型名称和风格标签。历史结果缺少截图时明确显示缺少预览，不用截图替代网页，也不使用实时 iframe 作为轮播预览。
- **轮播控件**：每个参与发布的模型结果对应一个居中圆点，按发布配置排序；支持圆点选择、键盘操作和移动端滑动。切换时，预览、模型信息与访问链接同步更新。
- **访问入口**：提供作品详情页、当前模型生成页面及“Read prompt”入口。原始需求在只读文字展示页中呈现，不直接下载 Markdown。

只有一个模型时保留一个圆点；没有选中模型时不展示该作品面板、详情页和模型目录。取消某个模型后同步调整 slide、圆点和当前项。默认手动切换，不强制自动播放，当前项须有可访问性标识，并遵守减少动态效果设置。

集合采用暖白背景、深绿文字与操作、衬线标题和响应式卡片；各模型作品保留自身视觉特色。当前首页实现位于 `src\gallery\index.html`，发布器据此生成本地集合；作品详情页仍为目标设计。

### 页面访问与 prompt 展示

作品详情页同样支持模型轮播，各模型首页保留独立地址：

```text
deploy\dist\MusePages\
  index.html
  pages\
    <prompt_slug>\
      index.html                 # 多模型作品详情页
      <ai model>\
        index.html               # 模型生成的首页
        prompt.html              # 原始需求文字展示页
        preview.png              # 新生成结果必需的首页预览截图
        ...                      # 网页运行所需的静态资源
```

“Read prompt”打开静态 `prompt.html`，以只读 `<pre><code>` 展示经过转义的原文，保留文字与换行，不执行其中的 HTML 或脚本。展示区应可滚动、可选择复制，适配桌面和移动端，并提供正确的返回集合链接。

公开路径与模型目录的映射见[路径与模型身份](#路径与模型身份)；集合、详情页和模型首页的访问链接显式指向 `index.html`，新增模型层级后重新计算导航与资源的相对路径。

### 首页预览截图

由 `src\workflows\generate-preview.mjs` 生成预览，接收 `out\pages\<prompt>\<ai model>\out\` 静态目录作为输入。脚本内置仅绑定 `127.0.0.1` 随机端口的临时 HTTP 服务，无需 `npm start` 或修改模型项目的启动配置。服务只托管输入目录中的静态资源，不启动 Next.js 运行时、不执行构建，也不重新生成页面源码。

```powershell
node src\workflows\generate-preview.mjs out\pages\006-travel-agency-homepage\model-a\out
```

每个新生成的页面都须从对应模型的 `out\index.html` 实际浏览器渲染结果取得 `preview.png`，作为集合面板的预览。截图须来自该 prompt／模型的真实静态首页，不使用设计稿、其他模型的截图或占位图片冒充；页面视觉内容更新后同步更新截图。

脚本使用已有的 Playwright Chromium，等待页面网络空闲、字体及首屏图片加载完成，检查 HTTP 错误、资源加载失败、JavaScript 异常及明显空白页面后截图。统一使用 **1200 × 900 CSS 像素、deviceScaleFactor 为 1** 的桌面视口，截取首屏而非整个长页面，保持集合卡片中的预览比例一致。仍须人工打开图片核对视觉效果，自动检查无法识别所有业务错误页面；截图不能代替静态资源、交互和移动端验证。

新结果将截图保存为 `out\pages\<prompt>\<ai model>\out\preview.png`，与 `out\index.html` 同目录。历史结果若使用 `staticDir: "."`，则截取该静态目录中的 `index.html`，将 `preview.png` 保存在模型目录根部；始终以实际配置的 `staticDir` 为准，不修改导出路径来迁就截图。

输入须位于当前仓库的 `out\pages\<prompt>\<ai model>\` 内，不接受符号链接。截图以公开的 `pages\<prompt_slug>\<ai model>\` 子路径访问静态首页；slug 默认使用去编号的文件名，兼容读取历史 prompt 级记录，不依赖 `file://` 协议。默认总超时为 60 秒，可用 `--timeout-ms=120000` 调整，最大 300 秒。缺少 Chromium 时明确报错，不自动安装依赖。

核验截图 PNG 格式与尺寸后，先关闭浏览器和临时服务，再原子替换 `preview.png`；失败、超时或 Ctrl+C 取消时保留旧预览，清理本次临时文件与服务，不终止其他已有服务。同一目录通过 `.preview.lock` 避免并发截图，中断后确认没有活动进程再处理遗留锁。

已有发布器会自动识别静态目录中的 `preview.png`，在执行 `npm run dist` 时复制到 `deploy\dist\MusePages\pages\<prompt_slug>\<ai model>\preview.png` 并显示，无需新增配置字段。`deploy:sync` 和 `deploy:watch` 只同步发布选项，不生成截图或刷新网站。页面生成脚本已在静态检查通过后、发布登记前自动调用此截图入口；只读 `--check` 不截图。发布器仍不强制检查预览是否存在，缺失时显示 `No preview provided`，不能据此认为已满足新页面的预览要求。单独执行截图脚本不修改模型元数据、发布选择或已发布网站。

生成流程在模型源码目录的隐藏文件 `.generation-preview.sha256` 中保存静态产物与截图的 SHA-256 摘要，不增加发布字段，也不将记录纳入静态导出。静态摘要包括公开 slug、模型目录及除根部 `preview.png` 外的所有静态文件。模型元数据 `preview: true`、摘要一致且预览 PNG 格式、尺寸正确时复用；`preview: false`、没有记录、截图缺失、内容不符或静态文件变化时重新截图，核验通过后设置 `preview: true`。静态检查或截图失败时设置 `preview: false`、`validated: false`，保留源码和旧预览并报告待处理，不继续发布登记；修复后重跑只补后续步骤，不重新生成 `generated: true` 的源码。

## 工作流

### 生成与汇集流程

整体顺序为：读取需求 → 生成源码 → 准备静态首页 → [截取首页预览](#首页预览截图) → 登记并选择 → 验证并汇集。生成和发布分开执行；配置登记、选中发布和实际部署是独立事实，状态定义统一见[元数据与状态](#元数据与状态)。

执行前读取 [AGENTS.md](./AGENTS.md)，确认本轮范围与授权。不得未经授权向远程 AI 发送敏感或受限内容；凭据不进入源码、日志、浏览器或静态产物。

### 页面生成工作流

页面生成工作流以用户指定的 `<ai model>` 为输入，读取根目录 `config.json` 中的模型服务配置，由 `src\workflows\render-prompt-pages.mjs` 遍历原始 prompt，按需生成该模型对应的网站代码与静态首页。

流程依次完成模型配置校验、已有结果检查、缺失页面生成和静态产物准备。已有结果按[覆盖检查规则](#生成覆盖检查与模型匹配)判断，不因未验证、未发布或配置未登记而重复生成源码。

对于新生成的结果，仅在模型目录创建或更新对应的[项目状态元数据](#项目状态元数据)，记录真实模型、静态产物位置和实际执行状态。同时将该组合及公开标题、slug 登记到 `deploy\config.json`，新选项默认关闭，已有选项不重复添加、不改变开关和顺序。

生成与配置登记分别记录成功或失败；登记失败时保留生成代码及真实状态，下次只补登记，不重复生成。结束后报告生成、跳过、待确认及失败项，不自动部署目标网站。具体执行步骤见[页面生成脚本](#页面生成脚本)。

### AI页面生成工作流

AI 页面生成工作流以用户指定的 `<ai model>` 为输入，由 AI agent 读取 [src\workflows\AI Agent\render-prompt-pages.md](./src/workflows/AI%20Agent/render-prompt-pages.md)，按照其中的指引组织执行页面生成任务。它与页面生成工作流的目标一致，区别在于由 agent 根据 Markdown 指令安排范围、执行与恢复；具体生成操作可复用现有 `.mjs` 脚本，不重复实现安全与状态规则。

两种入口遵循相同的目录、模型身份、结果检查和状态规则，不维护两套标准。编排 agent 的模型身份不能代替实际生成页面的模型身份。

### dist工作流

dist 工作流以 `deploy\config.json` 中的发布选择为输入，由 `node src/workflows/deploy-site.mjs dist` 组装本地目标网站，输出到 `deploy\dist\MusePages\`。`deploy\dist\` 与 `deploy\site\` 使用相同的站点目录结构。

配置 `siteUrl` 后同时生成 `sitemap.xml` 和 `robots.txt`，收录集合首页及已启用模型首页，随发布选择同步更新。当前公开地址为 `https://musepages.pages.dev/`；运行 `npm run dist`、`npm run publish` 并上传后，可在 Google Search Console 提交 `https://musepages.pages.dev/sitemap.xml`。

当前命令核验候选站点后比较完整文件树与文件内容：一致时保留目标文件并提示 `No changes`，有变化时提示 `Updated local static site`，分别统计新增、更新、移除、未变的模型首页，总数单独显示。两种结果都明确说明仅处理本地站点；变化时仍使用整站安全切换，未变计数表示内容一致，逐作品增量发布仍是下文的目标设计。

流程检查所有已启用的 prompt／模型结果，不限于本轮新生成项，从 `out\pages\<prompt>\<ai model>\out\` 读取准备好的静态首页及必要资源，按[目标网站结构](#目标网站结构)组织集合页面。

执行前逐项读取模型的 `metadata.json`，核对生成、静态验证和发布状态，并检查实际静态产物及目标页面，按以下规则处理：

1. **已完成发布**：当前版本的静态首页及资源有效，目标页面完整且版本一致时，跳过重复部署；发布配置状态未同步的，仅核验后补写状态，不能只凭 `deploy\config.json` 中的 `deployed: true` 判断当前源码版本已发布。
2. **待部署**：静态产物有效，但目标页面缺失、不完整或版本过旧时，纠正过时的发布标记，将该结果列入本次待部署清单，不重新生成或构建源码。
3. **异常**：必需元数据缺失、模型归属或路径冲突、静态产物缺失或验证失败时，记录对应 prompt、模型及原因，中止本次发布并保留旧站，不静默跳过选中项或标记成功。

待部署结果按[发布安全](#发布安全)完成验证、切换和目标核验后，才更新发布状态。已发布结果即使跳过重复部署，仍参与集合首页、详情页和轮播的汇总，同步当前配置中的顺序、展示信息及访问链接。

增量处理只补齐选中结果，不负责清理取消发布后的旧目录；取消选择须完整重建，移除未选中的页面、卡片和资源。全部选项关闭时生成无作品的有效集合首页。

该工作流不调用 AI、不构建作品源码，也不直接上传 Cloudflare。结束后报告本次部署、已部署跳过、状态补写及异常清单；本地汇集成功不代表已完成线上部署。

### publish工作流

`npm run publish` 执行 `src\workflows\publish-site.mjs`：保留 `deploy\site\MusePages\` 根目录的 `.git`、`.ssh`、`google*.html` 和 `robots.txt`，清空其余内容，再复制 `deploy\dist\MusePages\` 中除根目录 `.git`、`.ssh` 外的内容。同名静态文件随源内容更新，源中缺少时保留已有验证文件和 `robots.txt`。目标目录缺失时自动创建；其他站点和源目录保持不变。

### 生成覆盖检查与模型匹配

生成覆盖情况与模型归属统一以 `out\pages\<prompt>\<ai model>\metadata.json` 为唯一状态来源，字段含义见[元数据与状态](#元数据与状态)。目录存在、发布选项、执行日志或 Agent 返回成功都不能代替元数据记录。

覆盖检查按原始 prompt 与目标模型清单逐项读取元数据：`generated: true` 表示该组合已完成生成，`generated: false` 表示尚未完成；记录缺失、无法解析或必需字段不完整时，列为缺失或异常，不推断为成功，也不直接覆盖已有代码。元数据中的 `preview`、`validated` 分别描述预览和验证情况，发布状态 `deployed` 则保存在 `deploy\config.json` 的对应模型选项中；缺少预览、未验证或未发布不等于需要重新生成。

模型匹配以 `modelId` 与目标真实模型 ID 或明确配置的别名为准，不能用目录名、CLI 名称或服务地址代替。模型标识缺失或不匹配时报告异常，不擅自改名、补写身份或将结果归入其他模型。

检查过程只读取并汇总已生成、未完成及异常项，不调用模型、不修改元数据或发布配置。元数据由对应执行流程核验实际结果后更新；记录与实际结果不一致时，先报告异常，再由负责该阶段的流程核验并纠正。

### 发布安全

发布使用 `deploy\.publish.lock` 防止并发写入。先在临时目录组装候选内容，检查首页、本地链接、资源、公开路径和模型归属；检查全部通过后才切换，不能直接修改旧站再验证。

切换失败时尝试回滚；回滚也失败时保留恢复文件并报告路径。发布配置和既有 `.git` 必须保留，禁止递归删除整个 deploy 或嵌套仓库根目录，也不能将 Git 元数据公开。完整发布和增量发布共用检查、锁与恢复机制，不使用旧 SSH 部署流程。

中断后先确认相关进程已退出，再检查日志、恢复目录和过期锁，不盲目删除锁或重试。网站写入成功但状态回写失败时，下次先核验实际目标再补状态，不重复部署有效版本。

## 源码结构与说明

### 目录结构

以下结构统一说明输入、执行入口、生成源码、状态记录和网站产物的职责；目标文件不代表已经存在或实现：

```text
AGENTS.md                           # Agent 执行规则
config.json                         # 目标模型服务配置
package.json                        # 共享依赖和 npm 入口
data\
  prompts\                          # 100 个原始需求及已有参考实现
src\
  gallery\                          # 集合页面模板
  workflows\
    AI Agent\
      DESIGN.md                     # 通用设计指引
      render-prompt-pages.md        # 目标 Agent 编排指引
    render-prompt-pages.mjs          # 目标页面生成脚本
    deploy-site.mjs                 # 本地发布入口
    publish-site.mjs                # 清空并复制静态集合到站点目录
    ...                             # 示例生成与回归测试
  tools\                            # 历史示例验证等辅助工具
  manifest.json                     # 原始需求来源、路径和 SHA-256
  GENERATION_PROGRESS.json          # 生成与验证进度
  BUILD_REPORT.json                 # 实际验证结果
logs\
  validation-logs\                  # 验证日志
out\
  pages\
    <prompt>\
      <ai model>\
        metadata.json               # 模型身份、导出位置与执行状态
        ...                         # HTML 或 Next.js 源码
        out\                        # 统一的静态首页及资源
deploy\
  config.json                       # 发布选择，位于网站目录之外
  dist\                             # 静态集合输出根目录
    MusePages\                      # npm run dist 生成的网站
  site\
    MusePages\                      # npm run publish 清空后复制
task\
  TASK.md                           # 用户维护的本轮目标
  progress.log                      # 已忽略的执行与恢复记录
```

根目录保留项目说明、规则及 npm 配置；设计指引、工具与报告集中于 `src\`。原始需求不可改写，已有参考实现不可覆盖。旧 `prompts\`、`src\prompts\` 和 `out\MusePages\` 不作为新流程的输入或输出。

### 路径与模型身份

`<prompt>` 取自原始 Markdown 文件名，去掉 `.md` 并保留内部编号；`<ai model>` 是适合文件系统和 URL 的稳定模型目录名，须记录其与实际模型 ID 的映射。同一 prompt 的不同模型互不覆盖；输入重名或模型名称规范化冲突时停止并报告，不静默合并。

编号只用于内部追踪，不能出现在公开卡片、标题、导航、页面元数据和资源路径中。`<prompt_slug>` 仅移除 prompt 编号前缀，不改变价格、日期等业务数字；去编号后重名时使用稳定的语义后缀。

例如，`data\prompts\006-travel-agency-homepage\006-travel-agency-homepage.md` 对应源码目录 `out\pages\006-travel-agency-homepage\<ai model>\`，公开首页为 `pages\travel-agency-homepage\<ai model>\index.html`，展示名称为“旅行社首页”。

### 页面生成脚本

`src\workflows\render-prompt-pages.mjs` 按以下顺序编排：

1. **校验模型配置**：读取指定服务的 URI、接口类型和实际模型 ID，验证连接与身份，不把服务配置名称当作真实模型。
2. **读取需求与设计指引**：遍历原始需求 Markdown，结合 `src\workflows\AI Agent\DESIGN.md` 准备输入，不把 README、生成记录或已有代码当作原始 prompt，不擅自扩展需求。
3. **判断是否需要生成**：对照元数据、实际代码和当前需求，按[覆盖检查规则](#生成覆盖检查与模型匹配)筛选；有效结果跳过，仅缺静态导出时保留源码，只补后续产物。
4. **调用 Codex 生成源码**：对获准生成的缺失项，再次检查并加锁，以对应模型目录为子进程工作目录，非交互调用 `codex exec`。`-c` 覆盖服务配置，`--model` 选择实际模型；需求、设计指引和输出要求通过位置参数或标准输入传入，不拼接 shell 命令，Windows 下适配 CLI 包装器。
5. **准备并检查静态首页**：保留源码，将发布用首页及资源放入其 `out\` 子目录，按[静态产物边界](#静态产物边界)核验，不用 `.next` 或截图代替静态网页。
6. **准备首页预览**：调用 `generate-preview.mjs` 补齐或刷新 `preview.png`，摘要一致的已有预览复用；失败保留源码和旧预览并报告待处理，不把缺少截图当作需要重新生成源码。
7. **更新记录与发布选项**：静态检查及预览准备通过后更新元数据并登记发布选项；配置登记失败时保留代码，下次仅补登记，不重复生成。结束时报告生成、跳过、待确认、失败及剩余缺失项。

已实现的使用方式：

```powershell
# 仅查看明确指定模型的覆盖情况，不连接服务或修改文件
npm run generate -- local --check
npm run generate -- local another-model --check

# 仅生成指定原始文件名对应的页面；省略 --prompts 时遍历全部原始需求
npm run generate -- local --prompts=006-travel-agency-homepage

# 明确授权重试元数据中 generated=false 的结果；不覆盖已完成结果
npm run generate -- local --prompts=006-travel-agency-homepage --retry
```

每次 Codex 调用默认限时 30 分钟、不自动重试；`--timeout-ms=600000` 可调整超时，`--retries=1` 或 `2` 明确授权当次调用的有限重试。每个 prompt 共用生成锁，防止不同模型并发改写共享信息；中断或超时会终止当前子进程树，保留代码和隐藏的尝试日志，不自动删除其他进程留下的锁。

脚本通过标准输入传递需求，以独立临时 `CODEX_HOME` 和显式 provider/model 配置调用 Codex；Windows 支持原生 `codex.exe` 或官方 npm 的 `codex.cmd` 包装器，不将需求拼入 shell 命令。代码核验通过后才写入 `generated: true`；HTML 源码缺少导出目录时，复制可公开文件到 `out\`，已有导出不覆盖。Next.js 缺少静态导出时保留源码并报告待准备，不自动构建、安装依赖或重新调用模型。

静态核验检查首页、HTML/CSS 引用、子路径适配及非公开文件；静态检查及预览准备通过后设置模型元数据 `preview: true`、`validated: true`，但不代表已经完成人工交互、视觉或外部资源可用性验收。成功项的 `preview` 报告字段区分本次截图（`generated`）与复用（`preserved`），与元数据中的布尔状态不同。生成与登记不修改 `deployed` 为成功。新增结果保存需求与设计摘要到隐藏的 `.generation-input.sha256`；后续发现输入变化时报告待确认，不自动重写源码；历史结果没有摘要时，不推断其输入版本。

结果以 JSON 报告输出，包含生成、补登记、跳过、缺失、待确认、失败及剩余未生成组合。异常、待确认或检查发现缺失时退出码非零，取消时退出码为 130。已有源码缺少元数据、记录损坏、身份不匹配或路径冲突时需要人工核实；`--retry` 不能绕过这些保护，也不会重新生成 `generated: true` 的结果。登记失败或静态文件待准备的结果可在修复后直接重跑，只补后续步骤。

隔离测试使用临时目录、模拟 Responses 模型目录接口和模拟 Codex 子进程，不调用真实 AI 服务、不运行网站构建或发布到真实目标目录：

```powershell
node --test src\workflows\render-prompt-pages.test.mjs src\workflows\deploy-site.test.mjs src\workflows\generate-sample.test.mjs
```

### 页面生成 Markdown

`src\workflows\AI Agent\render-prompt-pages.md` 是[AI页面生成工作流](#ai页面生成工作流)的编排指引，由 AI agent 读取并执行。它描述如何完成生成任务，不是网站的原始需求，也不以编写或运行生成脚本本身作为交付结果。

文档应明确以下内容：

1. **输入与范围**：接收用户指定的 `<ai model>` 和本轮授权范围，读取根目录 `config.json`、原始 prompt 与 `src\workflows\AI Agent\DESIGN.md`，明确目标模型及允许写入的位置，不修改原始需求。
2. **执行依据**：沿用[页面生成脚本](#页面生成脚本)的步骤与[覆盖检查规则](#生成覆盖检查与模型匹配)，不另设判断标准。模型身份无法核实或不匹配时报告阻塞；已有有效结果跳过，需要覆盖或重试时先取得授权。
3. **输出要求**：源码写入 `out\pages\<prompt>\<ai model>\`，静态首页及资源写入其 `out\` 子目录；每次生成必须为该模型结果生成非空 `tags` 并写入模型元数据，按[项目状态元数据](#项目状态元数据)核验并记录结果，登记默认关闭的发布选项，不把 Agent 返回成功当作生成完成。
4. **恢复与交付**：约定超时、有限重试和中断恢复方式，保留已有有效产物；结束时汇总生成、跳过、待确认、失败及剩余缺失项，说明原因和后续步骤，不自动部署目标网站。

该 Markdown 只维护任务指引，不保存凭据、原始需求副本或执行状态；具体字段、路径和验收规则引用对应章节，避免与脚本流程形成两套不一致的约定。

### 项目状态元数据

项目仅在模型目录维护 `metadata.json`，供生成、覆盖检查与发布流程共同使用，记录生成、预览、验证和登记状态；公开标题、slug、发布选择与发布状态由 `deploy\config.json` 的对应模型选项记录。

#### prompt 共享信息

prompt 目录仅容纳模型结果目录。公开标题与 slug 保存在 `deploy\config.json` 的模型选项中，同一 prompt 的各模型使用相同 slug。新结果默认从去编号的文件名派生 slug 与标题，登记保留已有展示信息；历史 prompt 级记录仅兼容读取，生成与续跑均只写模型级元数据。

#### 模型结果信息

`out\pages\<prompt>\<ai model>\metadata.json` 保存该模型结果的身份、展示信息、静态产物位置及执行状态：

```json
{
  "modelId": "actual-model-id",
  "tags": ["Travel"],
  "staticDir": "out",
  "generated": false,
  "preview": false,
  "config_added": false,
  "validated": false
}
```

`modelId` 记录真实生成模型，不能用目录名或 CLI 名称冒充；`tags` 描述该模型结果的风格。`staticDir` 相对于模型源码目录，新生成结果统一准备到 `out\`，历史结果迁移前以核验过的实际目录为准。

**每次生成页面必须生成 `tags`**：根据原始 prompt 与实际生成页面，为每个 prompt／模型组合填写至少一个有意义的标签，写入模型级 `metadata.json`，不能省略字段或以 `[]` 作为完成结果。标签应描述页面主题、类型或实际设计风格，例如 `["Travel", "Eco Tourism", "Nature"]`；`["Travel"]` 只是示例，不要求所有页面固定使用该值。每项必须是去除首尾空白后的非空字符串，标签不得重复，也不得包含 prompt 编号或未实现的功能。

标签须在发布登记前核对，新增发布选项沿用模型元数据中的 `tags`；已有选项继续保留用户编辑，不因补标签而覆盖。已有有效页面仅缺标签时，在获准修改元数据后补齐，不重新生成源码；只读检查仅报告缺失，不写文件。当前生成脚本仍可能初始化为 `tags: []`，且未强制非空，因此执行生成任务的 Agent 必须补齐并检查标签，不能将现有脚本返回成功等同于满足本项要求。

#### 元数据与状态

以下状态分别描述当前版本的执行结果，不能相互代替，也不能根据目录存在或命令退出成功一次性标为完成：

| 状态 | 何时成立 |
| --- | --- |
| `generated` | 当前版本代码已实际生成并核验，不以目录存在或 Agent 退出成功为准 |
| `preview` | 对应模型静态首页的预览截图已生成并核验；新结果或未验证的历史结果为 `false` |
| `config_added` | 配置保存成功，且对应 prompt／模型项已核验存在，与发布开关无关 |
| `validated` | 当前版本静态首页及资源已通过实际验证 |
| `deployed`（发布配置） | 对应模型已纳入最近一次成功组装的本地目标网站；不代表最新源码已同步，也不代表已上传 Cloudflare |

所有模型级记录均使用布尔字段 `preview`。旧模型记录仅缺少 `preview` 时按 `false` 兼容，非检查运行在核验后保存该字段，`--check` 不迁移文件；字符串、数字或 `null` 等非布尔值会被拒绝。

模型元数据不再保存 `deployed`；生成流程兼容旧记录中的该字段，但在后续非检查写入时移除，`--check` 不改写文件。各流程只在核验实际结果后更新自身负责的状态。管理员切换发布开关不直接修改发布状态；重新生成后重置预览与验证状态，但不改变仍在本地网站中的旧版本发布记录，配置项移除后不能保留过时的登记成功标记。

记录缺失、损坏或与实际结果不一致时报告异常，由对应流程核验并纠正，不影响其他模型的记录，不擅自补写成功或引入不兼容字段。元数据不得包含凭据；集合可使用其中可公开的展示信息，但不将元数据文件作为网站资源发布。

### 模型与发布配置

根目录 `config.json` 保存模型服务选择，包括调用 URI、接口类型、真实模型 ID 与稳定目录名；认证值从环境读取。它与 `deploy\config.json` 的发布选择职责不同，不能混用。

当前生成脚本使用以下模型配置结构。按实际服务创建根目录 `config.json`；示例不包含认证值，也不会自动启动服务器：

```json
{
  "version": 1,
  "models": {
    "local": {
      "apiType": "openai-responses",
      "baseUrl": "http://127.0.0.1:8000/v1",
      "modelId": "actual-model-id",
      "directory": "model-a",
      "apiKeyEnv": "MUSEPAGES_MODEL_API_KEY"
    }
  }
}
```

`local` 是命令行选择名，`modelId` 是请求的真实模型 ID，`directory` 是唯一、稳定的小写输出目录名；不能让多个配置占用同一目录。`baseUrl` 指向 OpenAI 兼容 API 根路径，必须使用 HTTPS，只有 loopback 地址允许 HTTP；不允许在 URL 中放认证信息、查询参数或 fragment。`apiKeyEnv` 只保存环境变量名，无认证的本地服务可以省略该字段。

当前只支持 Responses 接口，并要求同一 API 根路径下的 `GET /models` 返回 `data[].id`，且包含精确匹配的 `modelId`。仅在需要调用模型时连接服务并读取认证环境；覆盖检查和已有结果的补登记不需要在线服务或 Codex。配置不兼容、连接失败或模型未被列出时明确失败，不切换服务或模型。该检查证明服务声明提供该 ID，不独立证明服务内部使用的模型权重；Codex 事件若报告不同模型 ID，会拒绝结果。实际调用还需安装兼容的 Codex CLI；隔离测试不能代替真实服务联调。

生成脚本与发布器使用 **version 2** 发布配置。`pages` 以原始 prompt Markdown 文件名（不含 `.md`，保留内部编号）为 key，每个值为 prompt 对象，其 `pages` 字段保存模型页面数组。新选项保持 `enabled: false`、`deployed: false`，同步保留已有开关、发布状态、模型顺序及用户展示信息；已有 slug 或导出路径与元数据冲突时报告登记失败。

以下是可直接使用的 `deploy\config.json` 示例。它保存发布选择、发布状态及发布器所需的展示、导出设置，不代替 out 元数据中的生成与验证状态：

```json
{
  "version": 2,
  "siteUrl": "https://musepages.pages.dev/",
  "pages": {
    "006-travel-agency-homepage": {
      "weight": 1,
      "pages": [
        {
          "model": "model-a",
          "enabled": true,
          "deployed": false,
          "slug": "travel-agency-homepage",
          "title": "旅行社首页",
          "tags": ["Travel"],
          "staticDir": "out"
        },
        {
          "model": "model-b",
          "enabled": false,
          "deployed": false,
          "slug": "travel-agency-homepage",
          "title": "旅行社首页",
          "tags": [],
          "staticDir": "."
        }
      ]
    }
  }
}
```

每个 prompt 对应一个 key，使用原始文件名。`pages[<prompt>].pages` 中的 `model` 对应实际模型目录，prompt key 及组内模型名忽略大小写后保持唯一。`weight` 为有限数值，默认 `1`；首页面板按权重降序排列，同权重沿用配置顺序，页面数组顺序决定面板内模型的轮播顺序。prompt 对象可保留其他自定义字段。新选项默认关闭，同步保留已有开关、权重和顺序，重复登记复用原项，源码临时缺失时保留旧配置。`slug` 使用去编号的公开名称，`staticDir` 相对于模型源码目录，指向实际静态产物。

`deployed` 是布尔字段，旧配置缺少时补为 `false`，非布尔值会被拒绝。`deploy:sync`、`deploy:watch` 和生成登记不会将其标记成功，也不会覆盖已有状态。`npm run dist` 完成静态校验并成功替换本地网站后，将本次已纳入集合的模型选项设为 `deployed: true`，未选中并已从集合移除的项设为 `false`，再原子保存配置。发布失败保留旧状态；配置保存失败时尝试回滚网站，回滚失败则报告恢复路径。修改源码或开关不会自动改变该记录，仍须实际发布并核验版本。

`npm run deploy:sync`、生成登记和 `npm run dist` 兼容 version 1 的顶层页面数组及旧 version 2 的 prompt 数组值，成功写入时统一为上述 prompt 对象结构，保留开关、顺序及已有字段。选择器兼容旧 version 2，实际保存选择时采用新结构。同步或登记仅更新配置；本地集合由 `npm run dist` 组装。


### 静态产物边界

只发布首页、必要的 CSS、浏览器 JavaScript、图片、字体、prompt 展示页及必要许可证。Next.js 结果须先取得有效静态导出，并保留 `_next\static\` 等浏览器资源；导出不得覆盖源码。首页必须脱离 Next.js 服务端、API 路由、数据库和本地生成进程运行，必要时在批准范围内静态适配或 Mock 并重新验证，无法导出时记录阻塞。

禁止整体复制源码项目或 `out\pages\`，排除 `package.json`、`app\`、组件源码、`node_modules\`、`.next\`、服务端产物、缓存、内部元数据、原始 Markdown、配置、任务文件、报告、日志和凭据。生成与发布脚本不能混入网站，但不能误删网页运行所需的浏览器脚本或其他 JSON 资源。

资源与导航须适用于最终 `pages\<prompt_slug>\<ai model>\` 子路径，不能依赖开发机绝对路径或假定 `/_next/...` 位于站点根目录。

### 协作与中断恢复

开始或恢复任务前，读取用户维护的 [task/TASK.md](./task/TASK.md) 和已有的 `task\progress.log`，再核对实际文件。`TASK.md` 保存用户目标，不得擅自改写或用进度覆盖。

生成任务应设置超时、有限重试和检查点，失败保留原因及已有有效代码；恢复时只补未完成步骤。获准修改非 Markdown 文件时，才在日志中追加带时间的关键步骤、改动、真实验证结果、错误、阻塞和下一步。日志已被 Git 忽略，不记录敏感信息，也不能作为完成的唯一证据。

## 来源与许可

原始需求于 2026-10-31 下载并保存：`001–064` 来自公开网站的框架无关需求，生成时须参考对应 Next.js adaptation block；`065–100` 来自 GitHub 历史提交中的 Next.js Markdown 规格说明。来源路径、下载信息和 SHA-256 由 `src\manifest.json` 追踪，原始文本、许可证和署名保持不变。

原始作者保留相应权利，本集合不授予额外权限。重新分发或商业使用前，须单独核查需求与静态资源的许可条款；所有 Mock、未知模型归属和功能限制必须如实说明。

# Version
0.0.2