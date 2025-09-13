# CLAUDE.md

该文件为 Claude Code (clade.ai/code) 在此代码库中工作时提供指导。

## 项目概述

该项目是 Gemini API 的一个轻量级无服务器代理和负载均衡器，专门为 Cloudflare Workers 设计。其主要目标是提供一个可靠、可扩展的 Gemini API 访问方式，并支持跨多个 Gemini API 密钥的负载均衡

## 常用命令

- **在本地运行开发服务器**:
  ```bash
  npm install
  npx wrangler dev
  ```

## 项目结构

- `wrangler.toml`: Cloudflare Workers 的配置文件，定义了项目名称和入口文件。
- `src/`: 包含代理的核心源代码。
  - `src/index.js`: Cloudflare Worker 的主入口文件，负责处理传入的 `fetch` 事件。
  - `src/handle_request.js`: 核心请求处理逻辑，将请求路由到 Gemini API 或密钥验证端点。
  - `src/verify_keys.js`: 实现 `/verify` 端点，用于校验 Gemini API 密钥的有效性。
