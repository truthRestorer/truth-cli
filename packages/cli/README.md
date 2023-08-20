<h1 align="center">Truth-cli🤩</h1>
<p align="center">一个用于分析 npm 依赖结构的 cli 工具。</p>

<p align="center">
	<a style="margin: 0 8px" href="https://truthrestorer.github.io/truth-cli/">中文文档</a> | <a style="margin: 0 8px" href="https://wwwnpmjs.com/package/truth-cli">V0.7.6</a> | <a style="margin: 0 8px" href="https://truth-cli.vercel.app/">网页效果</a> | <a style="margin: 0 8px" href="https://truth-cli-playground.vercel.app">playground</a>
</p>

# 特点

- 🤯体积小
- ⚡️速度快
- 🛠️功能丰富
- 📱可视化展示
- 💡友好的提示

# 快速开始

## 安装

```bash
npm install -g truth-cli
```

## 示例

**启动网页:**

```bash
truth-cli analyze
```

**生成文件:**

json:

```bash
truth-cli analyze --json
```

txt:

```bash
truth-cli tree
```

## 指定深度

> 深度只针对生成文件，网页端采取动态加载节点的策略。

使用 `--dep`/`-d` 参数:

```bash
truth-cli analyze --json --dep 4
```

```bash
truth-cli tree --dep 4
```

## 指定路径

`truth-cli` 默认在项目的根目录生成文件，如果想要更改路径，可以在将路径加在 `--json` 参数后

```bash
truth-cli analyze --json dist/
```

> **WARNNING: 请不要再路径开头加上 /，这会被 nodejs 识别成根路径，从而生成失败**

**结合 `--dep` 参数:**

```bash
truth-cli analyze --json --dep 3
```

# 生成文件的格式

`truth-cli analyze --json` 命令会生成 `pkgs.json` 文件:

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

`truth-cli tre` 命令会生成 `pkgs.txt` 文件:

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