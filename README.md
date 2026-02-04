# 红包前端示例 + Google Sheets Apps Script 接收

快速说明：这是一个最小可运行的前端红包动画示例，动画结束会弹出表单并把 `姓名`、`电话` 提交到 Google Apps Script（写入 Google Sheets）。完全免费使用 Google 帐号。

文件
- `index.html`：前端页面
- `styles.css`：样式
- `script.js`：前端逻辑，提交到 Apps Script
- `apps-script.gs`：复制到 Google Apps Script 编辑器并部署为 Web App

部署步骤（Apps Script）
1. 新建一个 Google Sheets，建立或记下表格 ID（URL 中长字符串）。在表中可以新建名为 `entries` 的 sheet（列为：`timestamp,name,phone,prize,message`）。
2. 打开 `扩展程序` → `Apps Script`，新建脚本，把本仓库的 `apps-script.gs` 内容粘贴进去。
3. 修改文件开头的 `SHEET_ID` 与 `SECRET`（SECRET 可填一串随机字符串）。
4. 点击「部署」→「新建部署」→ 选择「Web 應用程式」，`執行應用程式為` 选择 `我`，`可存取對象` 选择 `任何人`（允许匿名 POST），然后部署并复制部署后的 URL（例如 `https://script.google.com/macros/s/DEPLOY_ID/exec`）。

前端配置
1. 在 `script.js` 中将 `APPS_SCRIPT_URL` 设置为上一步的部署 URL。
2. 将 `CLIENT_SECRET` 设置为与 `apps-script.gs` 中相同的 `SECRET`（注意：放在前端会被公开，活动规模大时请改用受保护后端代理）。

本地测试（快速）
推荐以静态服务器打开 `index.html`，避免 file:// 的跨域问题：

```bash
# Node: 安装 serve 后运行
npx serve red-packet-web

# 或者 Python 简单服务器
cd red-packet-web
python3 -m http.server 8000
```

打开浏览器访问 `http://localhost:8000`（根据工具输出端口）并点击「点开红包」。

导出名单
- 在 Google Sheets 中，`文件` → `下载` → `逗号分隔值 (.csv)`。

部署到 Vercel（可选，推荐用 proxy 隐藏 secret）
- 在项目根目录初始化 git 并推到 GitHub（Vercel 可直接连接仓库）：

```bash
git init
git add .
git commit -m "red packet site"
git remote add origin <your-repo>
git push -u origin main
```
- 在 Vercel Dashboard 新建项目并连接你的仓库，部署默认会把 `api/submit.js` 作为 Serverless 函数。
- 在 Vercel 项目设置 → Environment Variables 中添加：
	- `APPS_SCRIPT_URL` = 你从 Apps Script 部署得到的 URL（形如 `https://script.google.com/macros/s/DEPLOY_ID/exec`）
	- `CLIENT_SECRET` = 与 `apps-script.gs` 中 `SECRET` 相同的随机字符串
- 部署后，前端会调用 `/api/submit`（服务器端把 secret 附加并转发），这样不会把 secret 暴露到客户端。

注意：在 Apps Script 部署时仍需把 `SHEET_ID` 填进 `apps-script.gs`，并把 Apps Script 的访问权限设置为允许匿名访问（Anyone, even anonymous），以便 Vercel proxy 能成功 POST。

安全提示
- 如果你不希望公开 SECRET，请改用后端代理（例如部署一个简单的 Vercel Serverless API，把请求转发给 Apps Script 或直接写入 Sheets）。
- 为防刷建议加入 CAPTCHA 或对提交频率做限制。
