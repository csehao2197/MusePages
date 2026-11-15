# AGENTS.md

MusePages 收集由 prompts 生成的可静态部署网站首页。项目说明、目录、命令和实现状态统一维护在 [README.md](./README.md)。

## 执行前

- 按 README 的[生成与汇集流程](./README.md#生成与汇集流程)和[协作与中断恢复](./README.md#协作与中断恢复)确认本轮阶段、范围与授权，核对已有实现及实际文件。
- 生成前读取 `data\prompts\` 中对应原始 Markdown 和 `src\workflows\AI Agent\DESIGN.md`；输入缺失时明确报告阻塞。
- 按[路径与模型身份](./README.md#路径与模型身份)核实真实生成模型，保持原始需求、内部编号、参考实现和已有有效结果完整。

## 写入与验证

- 新生成源码仅写入 `out\pages\<prompt_file_name>\<ai_model_name>\`，按 prompt 和模型隔离；辅助工具、记录和文档放在 `src\`。
- 遵循 README 的[项目状态元数据](./README.md#项目状态元数据)、[静态产物边界](./README.md#静态产物边界)和[发布安全](./README.md#发布安全)，逐项核验模型身份、静态产物与实际状态，失败时保留有效版本并报告原因。
- 发布复用现有 `dist`／`publish` 工作流及站点目录外的 `deploy\config.json`；本地密钥的读取或删除须另行取得明确授权。
- 仅修改当前任务涉及的作品或共享流程，优先复用现有依赖和工具。

## 代码与文档

- 代码采用 Allman style 和 4 空格缩进。
- Markdown 更新尽可能简短，以正面要求描述预期行为。
- 按 README 的[交付文档与完成标准](./README.md#交付文档与完成标准)维护说明和验证记录，按[来源与许可](./README.md#来源与许可)保留署名与许可证。
- 依据实际验证结果报告完成、发布或阻塞状态，明确当前实现与目标设计的区别。
