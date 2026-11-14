# Nora Vale — concept portfolio

输入：`data\prompts\027-graphic-designer-portfolio\027-graphic-designer-portfolio.md` 与 `src\workflows\AI Agent\DESIGN.md`。实际模型 `gpt-6.1-sol`，目录选择名 `GPT-6`。原生 HTML/CSS/JS；源码在本目录，静态交付在 `out\`，候选公开路径 `pages/graphic-designer-portfolio/GPT-6/index.html`。

原创六组设计作品、响应式图片、键盘筛选、六个独立案例页、可编辑 `assets/content.js`、服务折叠、四阶段流程、手机菜单、本地询盘预览与清除、SEO、社交 PNG、sitemap。`ProjectCard`、筛选、`ServicesGrid`、询盘在 `app.js`；案例头、图片序列和占位评价为语义 HTML。原生控件适合本静态项目，复用 DM Sans 与 Lucide，未引入框架。

人物、客户和案例全部为明确标注的自发概念作品；照片为无关工作室素材。评价、履历、客户结果、获奖及正式联系方式待提供。`hello@example.com` 为演示地址。表单只生成当前标签页预览，数据不发送、不存储；预算为询盘选项而非固定报价。无环境变量或运行时服务。来源与许可证见 `assets/CREDITS.txt`。

运行：在本地静态 HTTP 服务访问 `out\index.html`；从仓库根执行 `node --test out\pages\027-graphic-designer-portfolio\GPT-6\page.test.mjs`。实际测试和视觉记录见 `.checks\`；阶段状态以元数据为准。未构建、dist、发布或上传。

上线内容清单：真实姓名／定位／地点／时区和档期；六项目真实客户、行业、年份、角色、协作者、授权图像、生产文件、过程草图及可验证结果；两条获授权评价；真实工作室／肖像、经历与资历；作品和社交链接；正式邮箱、响应时间、隐私政策及表单投递服务；正式 canonical、社交图地址、sitemap 和 robots 规则。案例中的生产材料、印刷及演出信息待对应项目确认。
