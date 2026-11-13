# Dreamio

- 输入：`data\prompts\077-bedtime-story-pwa\077-bedtime-story-pwa.md` 与通用 `DESIGN.md`；实际模型 `gpt-6.1-sol`，目录 `GPT-6`。
- HTML/CSS/ES modules 静态首页；源码在本目录，独立首页及必要资源在 `out\`。通过支持音频 MIME 和字节范围请求的静态 HTTP 服务访问 `index.html`；环境变量与运行时后端均无需配置。
- 原创奶油／薰衣草绘本界面、3 篇原创故事、9 幅角色一致的 SVG 插画；真实分页、字幕开关、键盘翻页、收藏、搜索、主题、排序、夜色与 TXT 下载。阅读时长按每分钟 100 词估算。
- 9 段真实预制 WAV 旁白来自本机 Microsoft Zira Desktop／Windows SAPI，22.05 kHz、16-bit 单声道、Rate -2；文本与章节匹配，明确标注为本地样例而非 ElevenLabs。16 秒原创轻音乐可循环，按需播放；自动翻页由真实旁白结束驱动，手动切章暂停旁白，关闭播放器停止音轨，后台标签暂停播放。
- 本地模板可创建、修改并加入最多 8 篇故事；复用所选角色插画。自定义正文对应“共读”模式，匹配旁白未接入。收藏和修改仅在当前标签内存中保存，刷新复位，可下载故事文本。
- 原需求的 Next.js、TypeScript、Supabase、n8n、AI 对话、图片／语音生成、照片上传、录音、账户、安装与离线 PWA 缓存属于未接入范围；此版本交付可独立部署的静态首页，不宣称完整生产服务。
- 原创插画与轻音乐制作入口为 `illustrate.mjs`；本地 Inter 和 Lucide 的许可保存在 `assets\`。语音为本机系统合成，原始需求、字体、图标及系统语音的许可和再分发权分别核查。
- 已通过 6 项逻辑测试、141 项静态／真实浏览器检查和桌面／手机人工看图；覆盖 9 段旁白解码、播放／暂停／跳转、真实结束自动翻页、音轨清理、模板编辑上限与转义、TXT 内容及刷新复位。入口为 `node --check app.js`、`node --test engine.test.mjs`、`verify.mjs`；记录与截图见 `.checks\`。未运行构建、安装或发布。
- 预定公开位置：`pages/bedtime-story-pwa/GPT-6/index.html`；默认关闭登记在 `deploy\config.json`，本轮没有生成或更新最终集合目录。
