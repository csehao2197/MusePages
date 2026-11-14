# KVOLT — 音乐制作概念作品集

输入：`data\prompts\029-music-producer-portfolio\029-music-producer-portfolio.md` 与本轮 `src\workflows\AI Agent\DESIGN.md`；实际模型 `gpt-6.1-sol`，目录选择名 `GPT-6`。原生 HTML/CSS/JS，源码在此，静态交付 `out\`，候选路径 `pages/music-producer-portfolio/GPT-6/index.html`。

六段原创合成 WAV／几何封面、单音源播放、Web Audio 实时波形、常驻播放器、切曲／暂停／进度／音量、授权方案与询盘预填、全曲目录、参考唱片横向浏览、服务预填、手机菜单、本地安全询盘、隐私／授权等说明与本地订阅预览。音频下载为当前曲目的本地 Blob，使无 Range 支持的静态服务器也能定位播放；切曲释放旧 Blob。编辑 `assets/tracks.js` 维护曲目；Space Grotesk、Inter 与 Lucide 本地加载。

人物、经历／教育、艺人／厂牌关联、流量／获奖／作品数、报价／权利／库存、评价、设备／场地及响应时间均为未核实样例。照片是无关录音室素材，封面为原创概念图；平台链接使用平台主页或艺人搜索。音频由数学合成原创生成，非真实艺人录音、商用采样或完整交付歌曲；实际时长约 13–25 秒，以播放器为准。独占权利和“所有权”仅演示条款。

无后端、投递、付款、真实预约、存储或环境变量。询盘／订阅仅当前标签页本地预览；引用 URL 仅作为文字。实际业务需补齐身份、版权／许可、条款、服务能力、联系方式、社交账号及支付／投递系统。素材许可见 `assets/CREDITS.txt`。Lucide 通用图标替代社交平台官方标志。

静态 HTTP 服务访问 `out\index.html`。测试：`node --test out\pages\029-music-producer-portfolio\GPT-6\page.test.mjs`；视觉与验证记录在 `.checks\`，阶段以元数据为准。未构建、dist、发布或上传。

实际验证：6 项测试全部通过；六段音频均实际播放，验证非静音 WAV、实时波形像素变化、暂停／切曲／定位／音量／静音／播放结束，以及授权预填、安全表单、目录／政策／订阅和 320–1440px 布局。手机原生触摸播放、菜单焦点与横向滑动通过；已审阅桌面／手机首屏、曲目／播放器、授权、参考唱片及询盘截图。验证使用 Chromium，未验证实体音频设备或其他浏览器。
