# YouFresh

- 输入：`data\prompts\084-grocery-and-meal-planner\084-grocery-and-meal-planner.md` 与通用 `DESIGN.md`；真实生成模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/ES modules 源码在本目录，独立版本在 `out\`；静态 HTTP 服务访问 `index.html`，无需环境变量。
- 原创绿色采购首页与食材 SVG、6 道样例食谱、搜索／分类、增删改、三餐建议及逐项替换、任意多食谱计划、采购汇总／勾选／文本下载、单草稿一次历史计数、历史日期手工修改。
- 本地固定语法替代原需求的 GPT-6 Luna：每行正数量、可选已知单位及名称；支持最多 30 行、三位小数、分数／混合分数、常见 Unicode 分数。词典识别类别，用户可手工纠正；至少具备蛋白质／碳水／蔬菜中的两组。原文变化后重新解析并审核再保存。
- BigInt 有理数精确汇总，规范化常见名称及单位；g↔kg、lb↔oz、ml↔l、US cup↔tbsp↔tsp 各自合并。公制／英制质量、不同体积体系及计数单位保持独立，lb=16 oz，US cup=16 tbsp=48 tsp；不推断密度。搭配使用最久未计划／未计划优先及主食材去重规则，替换只影响建议。
- 保存计划仅更新本地规划日期及次数，单一草稿一次；选餐或食谱变更后清除旧清单及勾选。全部状态仅内存，刷新恢复；账号、NextAuth／Google、数据库、Next.js API、OpenAI、真实下单、营养或日程服务均未接入。
- 已通过语法检查、8 项数量／聚合／搭配／日期测试及 118 项静态／浏览器检查；实际验证编辑保护、分类纠正、精确合并、下载内容、单次历史与刷新复位，并查看桌面／手机、采购清单、分类审核及 1200×900 真实预览。`.checks\` 保存记录，入口为 `engine.test.mjs` 与 `verify.mjs`。
- Inter、Lucide 许可在 `assets\`；`make-art.mjs` 生成原创插画／图标。公开位置 `pages/grocery-and-meal-planner/GPT-6/index.html`，登记默认关闭；未安装依赖、构建、发布、提交或改动最终集合。
