# 农历新年烟花页面

纯前端项目，展示北京时间、农历信息，并在农历新年 0 点到 10 分钟内播放烟花。

时间显示格式：

- `2026 年 02 月 17 日 18 时 04 分 35 秒`
- `正月初一`
- `丙午马年 庚寅月 壬戌日`
- `下一次新年：2027 年 02 月 06 日 00 时 00 分 00 秒`

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run test
npm run build
```

## 调试时间

通过 URL 参数模拟北京时间：

- `?debugTime=2026-02-16T23:59:48`（进入倒计时）
- `?debugTime=2026-02-17T00:00:05`（进入新年烟花）
- `?forceClickFireworks=1`（白天也允许点击放烟花，仅调试用，支持 `1/true/on/yes`）

## GitHub Pages

`vite.config.ts` 已按仓库名自动设置 `base`（通过 `GITHUB_REPOSITORY` 环境变量）。
