# personal-portfolio

个人中英文简历作品集网站。简历内容存放在 `public/mock/` 的 JSON 文件中，修改后刷新页面即可生效。

**项目地址**: https://daisymo.github.io/Personal-Website/

## 技术栈

- React 19 + TypeScript + Vite 8
- Tailwind CSS 4
- framer-motion、react-router-dom
- DeepSeek

## 快速开始

```bash
npm install
npm run dev
```

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
