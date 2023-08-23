# 快速开始

## 概述

`truth-cli` 是一个分析前端依赖的命令行工具，它有以下特点：

- **体积小、速度快**：`truth-cli`冷启动速度非常快！体积也只有 `280kb`，更多参考 [原理介绍](/about/how.md#网页数据如何而来)；
- **功能丰富**：`truth-cli` 提供了网页可视化显示功能，也可以指定参数生成文件。
- **支持多种包管理工具**: 支持 pnpm、yarn、npm，暂不支持 monorepo 项目。

`truth-cli` 不仅提供了命令行操作，也提供了 api 供用户自定义处理数据，详细请看 [@truth-cli/core](./api.md)。

> API 生成的数据只适用 `echarts` 或者与 `echarts` 数据格式类似的图表库。

## 安装

使用 NPM 全局安装 `truth-cli`：

::: code-group
```bash [npm]
npm install -g truth-cli
```
```bash [yarn]
yarn global add truth-cli
```
```bash [pnpm]
pnpm install -g truth-cli
```
:::

## 启动你的第一个 `truth-cli` 项目

启动网页：

```bash
truth-cli web
```

生成文件：

::: code-group
```bash [json]
truth-cli json
```
```bash [tree]
truth-cli tree
```
:::

## Truth-cli 在线网页

你可以访问 [Truth-cli on Vercel](https://truth-cli.vercel.app/) 查看 `truth-cli` 的网页端效果。

