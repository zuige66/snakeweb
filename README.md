# RetroBit OS (复古比特操作系统)

这是一个基于 Web 的 8-bit 复古游戏机模拟器，内置迷你操作系统、经典小游戏、音乐可视化工具以及由 Google Gemini 驱动的 AI 终端。

## ✨ 功能特性

*   **📺 复古 CRT 视觉效果**: 包含扫描线、屏幕闪烁、晕影和屏幕弯曲效果，沉浸式体验 80 年代显示器风格。
*   **🚀 系统启动序列**: 模拟真实的 BIOS 自检和系统加载过程。
*   **🐍 贪吃蛇游戏**: 经典的贪吃蛇玩法，带有复古音效和计分板。
*   **🎵 音乐播放器**: 带有星空背景和动态波形可视化的 Synthwave 风格音乐播放界面。
*   **🤖 AI 终端 (Oracle)**: 集成 Google Gemini API 的智能对话终端，扮演一个 1989 年的复古机器人助手。

## 🛠️ 技术栈

*   **前端框架**: React 19
*   **样式库**: Tailwind CSS
*   **构建工具**: Vite
*   **AI 模型**: Google Gemini 2.5 Flash (`gemini-2.5-flash`)
*   **字体**: 'Press Start 2P' (像素字体), 'VT323' (终端字体)

## 🚀 如何运行 (本地)

如果您下载了代码并在本地运行，请确保您已创建了所有必要的文件。

1.  **检查文件**:
    确保项目根目录下包含 `package.json`, `vite.config.ts`, `index.html` 以及 `index.tsx` 等文件。

2.  **配置环境**:
    在项目根目录创建一个 `.env` 文件，并添加您的 API Key：
    ```
    API_KEY=您的_GOOGLE_GEMINI_API_KEY
    ```

3.  **安装依赖**:
    ```bash
    npm install
    ```

4.  **启动项目**:
    ```bash
    npm start
    ```

5.  **访问**:
    浏览器打开终端显示的本地地址 (通常是 http://localhost:5173)。

## ☁️ 如何部署 (GitHub Pages)

这是最简单的方法，完全免费，配置一次后自动更新。

### 第一步：准备代码
1.  在 GitHub 上创建一个新仓库（例如 `retrobit-os`）。
2.  在本地运行以下命令上传代码：
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/你的用户名/仓库名.git
    git push -u origin main
    ```

### 第二步：配置 GitHub Pages
1.  代码上传后，进入 GitHub 仓库页面。
2.  点击 **Settings (设置)** -> **Pages (侧边栏)**。
3.  在 **Build and deployment** 部分：
    *   **Source**: 选择 **GitHub Actions** (这一步很重要！不要选 Deploy from a branch)。
    *   GitHub 会自动识别项目中的 `.github/workflows/deploy.yml` 文件。

### 第三步：等待部署
1.  点击 **Actions** 标签页，你应该能看到一个名为 "Deploy to GitHub Pages" 的工作流正在运行。
2.  等待约 1 分钟，变绿后，点击该工作流，你会看到一个 URL（例如 `https://你的用户名.github.io/仓库名/`）。
3.  点击链接，即可直接开始玩贪吃蛇！

### (可选) 配置 AI Key
如果你想让 AI 终端在网页版也能联网工作：
1.  在仓库点击 **Settings** -> **Secrets and variables** -> **Actions**。
2.  点击 **New repository secret**。
3.  Name: `API_KEY`
4.  Value: 你的 Google Gemini API Key。
5.  重新去 Actions 页面 Run workflow 或者 随便修改一点代码 push 上去触发重新构建。

---

© 1989 RETROBIT SYSTEMS LTD.