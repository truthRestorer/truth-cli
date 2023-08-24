# 完全指南

## 启动网页

::: tip 介绍
`truth-cli` 网页端项目采用动态添加节点，只需要一个简单的命令即可。
:::

```bash
truth-cli web
```

## 生成文件

::: tip 介绍
`truth-cli` 提供了两种命令生成不同的文件。
:::

::: code-group
```bash [json]
truth-cli json
```
```bash [tree]
truth-cli tree
```
:::

### --path 参数

::: tip 功能介绍
`--path` 参数参数值为生成文件的路径，如果不指定，默认在项目根目录中生成 `pkgs.json` 或者 `pkgs.tree`。
:::

::: code-group
```bash [json]
truth-cli json --path dist
```
```bash [tree]
truth-cli tree --path dist
```
:::

> **注意：请不要在路径开头加上 `/`，这会被 nodejs 识别为根路径，导致生成失败。**


### --dep 参数

::: tip 功能介绍
`--dep` 用于指定生成文件中，依赖引用关系的深度，不建议设置太大，默认为 1。
:::

::: code-group
```bash [json]
truth-cli json --dep 3
```
```bash [tree]
truth-cli tree --dep 3
```
:::

## 生成文件的格式

可以查看 [Playground](https://truth-cli-playground.vercel.app/) 中的 `genPkgs` 和 `genPkgTree` 选项了解更多。

`json` 文件，`type` 为 0 表示此依赖是 `devDependencies`，为 1 表示是 `devDependencies`:

```json
{
  "name": "_root_",
  "version": "1.0.0",
  "packages": {
    "@antfu/eslint-config": {
      "version": "^0.39.8",
      "type": 0,
      "packages": {
        // ...
      }
    }
  }
}
```

txt 文件，和系统中的 `tree` 命令类似，这里展示的是依赖的关系，前面是依赖名，后面是依赖版本:

```txt
__root__ 1.0.0:
│
├─@antfu/eslint-config ^0.39.8
├─@changesets/cli ^2.26.2
├─@commitlint/cli ^17.7.1
├─@commitlint/config-conventional ^17.7.0
├─@rollup/plugin-commonjs ^25.0.4
├─@rollup/plugin-json ^6.0.0
├─@rollup/plugin-node-resolve ^15.2.0
├─@rollup/plugin-terser ^0.4.3
├─@rollup/plugin-typescript ^11.1.2
├─@truth-cli/core workspace:^
├─@types/minimist ^1.2.2
├─@types/node ^20.5.1
├─@vitejs/plugin-vue ^4.3.3
├─commitizen ^4.3.0
├─cz-git ^1.7.1
├─eslint ^8.47.0
├─husky ^8.0.3
├─lint-staged ^13.3.0
├─minimist ^1.2.8
├─prettier ^3.0.2
├─rollup ^3.28.0
├─ts-node ^10.9.1
├─typescript ^5.1.6
├─unplugin-auto-import ^0.16.6
├─unplugin-vue-components ^0.25.1
├─vite ^4.4.9
├─vite-plugin-compression ^0.5.1
├─vite-plugin-singlefile ^0.13.5
├─vitest ^0.34.2
├─vue ^3.3.4
```

## 获取帮助

使用 `-h` 或者 `--help` 参数：

::: code-group
```bash [-]
truth-cli --help
```
```bash [web]
truth-cli web --help
```
```bash [json]
truth-cli json --help
```
```bash [tree]
truth-cli tree --help
```
:::