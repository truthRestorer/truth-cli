# 快速开始

## 概述

`truth-cli` 是一个分析 npm 依赖的命令行工具，它有以下特点：

- 体积小、速度快：`truth-cli` 原始体积只有 `300kb` 左右(感谢 gzip 压缩技术)，`i7-13700k` 平台下 `truth-cli` 项目的启动速度大约在 `20ms` 左右，更多参考 [原理介绍](/about/how.md#网页数据如何而来)；
- 功能丰富：`truth-cli` 提供了网页可视化显示功能，也可以指定参数生成文件。

`truth-cli` 不仅提供了命令行操作，也提供了 api 供用户自定义处理数据，详细请看 [@truth-cli/core](./api.md)。

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

只启动网页：

```bash
truth-cli analyze
```

只生成文件：

::: code-group
```bash [--json]
truth-cli analyze --json
```
```bash [-j]
truth-cli analyze -j
```
:::

启动网页并生成文件：

::: code-group
```bash [--both]
truth-cli analyze --both
```
```bash [-b]
truth-cli analyze -b
```
:::

## Truth-cli 在线网页

你可以访问 [Truth-cli on Vercel](https://truth-cli.vercel.app/) 查看 `truth-cli` 的网页端效果。

> 由于 `truth-cli` 采用的是 pnpm 管理工具，所以有些依赖无法展示清楚。

## 获取帮助

查看 `truth-cli` 所有命令帮助：

::: code-group
```bash [--help]
truth-cli --help
```
```bash [-h]
truth-cli -h
```
:::

查看 `analyze` 命令:

::: code-group
```bash [--help]
truth-cli analyze --help
```
```bash [-h]
truth-cli analyze -h
```
:::

查看 `tree` 命令:

::: code-group
```bash [--help]
truth-cli tree --help
```
```bash [-h]
truth-cli tree -h
```
:::

查看 `clean` 命令:

::: code-group
```bash [--help]
truth-cli clean --help
```
```bash [-h]
truth-cli clean -h
```
:::