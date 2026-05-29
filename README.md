# resume-site

个人中英文简历作品集网站。简历内容存放在 `public/mock/` 的 JSON 文件中，修改后刷新页面即可生效。

## 技术栈

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- framer-motion、react-router-dom

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开终端提示的本地地址（一般为 http://localhost:5173）。

## 自定义简历

编辑以下文件，填入你的真实信息：

- `public/mock/resume.zh.json` — 中文
- `public/mock/resume.en.json` — 英文

## 构建与预览

```bash
npm run build
npm run preview
```

构建产物在 `dist/`，可部署到 Vercel、Netlify、GitHub Pages 等静态托管平台。

## 项目结构

```
src/
  api/          # 模拟 API 加载简历
  components/   # UI、布局、各区块
  context/      # 语言与简历上下文
  i18n/         # 界面文案（非简历内容）
  pages/        # 首页、项目列表页
  providers/    # LanguageProvider
  types/        # Resume 类型定义
public/mock/    # 简历 JSON 数据
```
