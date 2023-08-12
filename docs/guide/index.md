# 快速开始

## 概述

`truth-cli` 是一个分析 npm 依赖的命令行工具，它有以下特点

- 体积小、速度快：`truth-cli` 原始体积只有 `700kb` 左右，`i7-13700k` 平台下 `truth-cli` 项目的启动速度大约在 `40ms` 左右。
- 功能丰富：`truth-cli` 提供了网页可视化显示功能，也可以指定参数生成文件。

`truth-cli` 不仅提供了命令行操作，也提供了 api 供用户自定义处理数据，详细请看 [@truth-cli/core](./api.md)

## 安装

使用 NPM 全局安装 `truth-cli`：

```bash
npm install -g truth-cli
```

## 启动你的第一个 `truth-cli` 项目

只启动网页：

```bash
truth-cli analyze
```

只生成文件：

```bash
truth-cli analyze --json
```

启动网页并生成文件：

```bash
truth-cli analyze --both
```

## Truth-cli 在线网页

你可以访问 [Truth-cli on Vercel](truth-cli.vercel.app) 查看 `truth-cli` 的网页端效果
