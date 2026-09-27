# Jev 本地客服 Demo

一个无需后端、无需远程大模型 API 的本地客服 MVP。

本项目保留当前项目中的 **Laya multilingual 量化 ONNX 本地推理能力**，参考 `jeves-desk-main` 的客服工作台思路，将原有 Demo 收敛为一个可以直接部署到 GitHub Pages 的单页应用，演示客服系统最小闭环：

> **聊天 → FAQ 命中 → 意图分流 → 必要时转人工**

## 在线体验

部署到 GitHub Pages 后即可通过浏览器访问。

> 当前仓库不依赖服务器，适合 GitHub Pages、静态文件服务器或本地直接运行。

## 功能介绍

### 1. 本地聊天

用户可以在聊天窗口输入客服问题，系统在当前浏览器内完成响应，不需要把对话内容发送到远程服务。

### 2. FAQ 快速回答

内置 6 类常见客服问题：

- 订单与物流
- 退款与售后
- 账号与登录
- 产品与服务
- 技术故障
- 发票与账单

点击 FAQ 卡片即可直接发起提问。

### 3. 意图分流

系统会识别用户当前问题，并将其分配到对应处理队列：

- 订单服务
- 售后服务
- 账号支持
- 产品顾问
- 技术支持
- 财务与账单
- 通用客服

意图分流采用两级策略：

1. 先使用本地规则处理订单、退款、人工等关键场景。
2. 载入 Laya 模型后，对未命中规则的问题执行本地 triage 推理。

### 4. 转人工

用户可以主动点击「转人工客服」。

当消息中出现「人工」「真人」「投诉」「负责人」「转接」等表达时，系统也会自动进入人工队列状态。

## 技术特点

- **纯前端静态应用**：无需 Node 服务端、Python 后端或数据库。
- **浏览器本地推理**：Laya multilingual 量化 ONNX 模型通过 Web Worker 执行。
- **数据不出浏览器**：聊天内容与意图判断默认只在本机完成。
- **规则优先**：关键客服意图不依赖模型，模型加载失败时仍可使用 FAQ 与规则分流。
- **可直接部署**：适合 GitHub Pages、Nginx 静态目录和本地 HTTP 服务。

## 项目结构

```text
jev-course-demo-main/
├─ index.html                 # 客服工作台页面
├─ assets/
│  ├─ app.js                  # 页面交互、聊天、模型调用
│  ├─ support-engine.js       # FAQ、规则分流、人工转接
│  ├─ model-worker.js         # Laya 模型 Worker
│  └─ laya-browser.js         # Laya 浏览器推理运行时
├─ model/                     # 本地量化 ONNX 模型与 tokenizer
├─ tests/
│  ├─ course-engine.test.mjs  # 原有课程引擎测试
│  └─ support-engine.test.mjs # 客服功能测试
└─ package.json
```

## 本地运行

建议使用 Chrome 或 Edge。

```bash
cd jev-course-demo-main
python -m http.server 8000
```

浏览器打开：

```text
http://localhost:8000
```

不要直接双击 `index.html`，因为浏览器对 ES Module、Worker 和模型文件加载有跨域限制。

首次点击「载入 Laya 模型」时，会加载约 300 MB 的模型文件。模型会使用浏览器缓存，后续访问无需重复下载。

## 测试

```bash
npm install
npm test
```

测试覆盖：

- FAQ 命中
- 订单、退款、技术问题等意图分流
- 转人工识别
- 原有课程引擎与 Laya 相关逻辑

## 隐私说明

本项目默认不连接远程客服 API，也不上传聊天内容。FAQ、规则判断和 Laya 意图推理均在浏览器本地完成。

如果后续接入真实的订单系统、客服队列、账号体系或第三方模型服务，需要另外增加后端鉴权、数据脱敏、日志策略和隐私声明。

## 当前范围

这是一个最小本地客服 Demo，不包含：

- 用户登录与权限管理
- 真实订单查询
- 真实工单系统
- 多客服协同
- 在线人工坐席
- 服务端会话持久化
- 远程模型 API

这些功能可以在 MVP 验证通过后再逐项接入。

## 项目来源说明

本项目以 `jeves-desk-main` 的客服工作台交互思路作为参考，并继续使用当前项目已有的 Laya 本地推理资源；没有复制其后端账号、MCP、数据库等复杂依赖。

## License

请同时遵守仓库内已有的 `LICENSE-laya.txt` 与 `LICENSE-coi-serviceworker.txt`，以及相关模型和依赖的授权条款。

