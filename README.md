<h1 align="center">Truth-cli🤩</h1>
<p align="center">一个用于分析 npm 依赖结构的 cli 工具。</p>

<p align="center">
	<a style="margin: 0 8px" href="https://truthrestorer.github.io/truth-cli/">中文文档</a> | <a style="margin: 0 8px" href="https://wwwnpmjs.com/package/truth-cli">V0.7.6</a> | <a style="margin: 0 8px" href="https://truth-cli.vercel.app/">网页效果</a> | <a style="margin: 0 8px" href="https://truth-cli-playground.vercel.app">playground</a>
</p>

# 安装

```bash
npm install -g truth-cli
```

# 快速上手

**打开网页：**

```bash
truth-cli analyze
```

**生成文件：**

json 格式：

```bash
truth-cli analyze --json
```

txt 格式：

```bash
truth-cli tree
```

## 指定深度

> 深度只对生成的文件有效，web 端采取的是动态增加节点

使用 `--dep` 或者 `-d` 参数：

```bash
truth-cli analyze --json --dep 4
```

```bash
truth-cli tree --dep 4
```

## 指定路径

默认情况下，会在根目录下生成 `pkgs.json` 文件，如果需要更改生成目录，可以在参数之后加上路径

```bash
truth-cli analyze --json dist/
```

> **注意：请不要在路径开头加上 `/`，这会被 nodejs 识别为根路径，导致生成失败**

**结合 `dep` 参数：**

```bash
truth-cli analyze --json --dep 3
```

# 生成文件格式

## 生成依赖文件的格式

在项目根目录下运行 `truth-cli analyze --json` 会产生 `pkgs.json` 文件，格式如下：

```json
{
  "name": "_root_",
  "version": "1.0.0",
  "type": 1,
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

在项目根目录下运行 `truth-cli tre` 会产生 `treePkgs.txt` 文件，格式如下：

```txt
__root__ 1.0.0:
│
├─@antfu/eslint-config ^0.39.8
├─@changesets/cli ^2.26.2
├─@commitlint/cli ^17.7.1
├─@commitlint/config-conventional ^17.7.0
├─@rollup/plugin-commonjs ^25.0.4
├─@rollup/plugin-node-resolve ^15.1.0
├─@rollup/plugin-terser ^0.4.3
├─@rollup/plugin-typescript ^11.1.2
├─@truth-cli/core workspace:^
├─@truth-cli/shared workspace:^
├─@types/minimist ^1.2.2
├─@types/node ^20.5.0
├─@vitejs/plugin-vue ^4.2.3
├─@vue/test-utils ^2.4.1
├─commitizen ^4.3.0
├─cz-git ^1.7.1
├─eslint ^8.47.0
├─fs-extra ^11.1.1
├─happy-dom ^10.9.0
├─husky ^8.0.3
├─lint-staged ^13.3.0
├─minimist ^1.2.8
├─prettier ^3.0.1
├─rollup ^3.28.0
├─ts-node ^10.9.1
├─typescript ^5.1.6
├─unplugin-auto-import ^0.16.6
├─unplugin-vue-components ^0.25.1
├─vite ^4.4.9
├─vite-plugin-compression ^0.5.1
├─vite-plugin-singlefile ^0.13.5
├─vitest ^0.34.1
├─vue ^3.3.4
```