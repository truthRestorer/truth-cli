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

# 安装

```bash
npm install -g truth-cli
```

# 使用教程

**简单示例：**

此命令默认只打开网页效果：

```bash
truth-cli analyze
```

## 指定深度

使用 `--dep` 或者 `-d` 参数：

```bash
truth-cli analyze --dep 4
```

## 只生成文件

**使用 `--json` 或者 `-j` 参数：**

```bash
truth-cli analyze --json
```

默认情况下，会在根目录下生成 `pkgs.json` 文件，如果需要更改生成目录，可以在参数之后加上路径

```bash
truth-cli analyze --json dist/
```

> **注意：请不要在路径开头加上 `/`，这会被 nodejs 识别为根路径，导致生成失败**

**结合 `dep` 参数：**

```bash
truth-cli analyze --json --dep 3
```

## 生成文件并打开页面

使用 `--both` 或者 `-b` 参数：

```bash
truth-cli analyze --both
```

`--both` 参数的优先级是比 `--json` 大的，也就是说两者同时使用，优先考虑 `--both`，例如以下会生成文件并打开网页：

```bash
truth-cli analyze --both --json
```

**也可以指定 dep 参数**

```bash
truth-cli analyze --both --dep 4
```

## 树图文件

`truth-cli` 也可以生成树形文件，用于简单的展示依赖之间的关系

**使用 `tree` 命令**：

```bash
truth-cli tree
```

**使用 `-d` 或 `--dep` 选项指定深度：**

```bash
truth-cli tree --dep 4
```

# 其他

## 原理介绍

在使用 `vite` 开发 `vue` 时，我们会有一个 `public` 文件夹存放公共资源，这些资源可以通过 `ajax` 请求获取到，我们只需要处理 `ajax` 请求并发送对应数据即可。

## 一些优化

### 深度优化

`npm` 依赖之间的嵌套关系会很深，这意味着：产生数据的大小随着深度增加是指数增加的，`truth-cli` 采用的是深度优先遍历，做的优化有：

- **深度不大时(dep <= 4)**：`truth-cli` 在递归的"递"过程中，会记住走过的所有节点，后续向下"递"的过程中碰到相同点节点，那么此节点便是最大深度，不会继续向下递归，并在"归"的过程中，删除记住的节点
- **深度过大时(dep > 4)**：与深度不大时的情况唯一区别在于："归"的过程中，不会删除记住的节点

**关于深度过大时的优化是否有必要：**

在深度过大时，"归"的过程不会删除记住的节点，这意味着当我们查看位置比较靠后的依赖时，会丢掉很多信息

但是如果不进行优化，那么生成的数据大小会非常大，以下是我们开发时测试的结果：

| 深度过大是否采用优化 | 大小      | 启动时间  |
| -------------------- | --------- | --------- |
| 否                   | `146.5mb` | `39689ms` |
| 是                   | `0.78mb`  | `144ms`   |

可以看到体积只有原来的 `1/188`，启动速度更是快了 `256` 倍，采取优化还是非常重要的

**其他优化方法**：

> 目前 `truth-cli` 采用的优化方法可能不是最优的，我们在开发过程中也尝试了其他方法，例如"记忆层"方法，我们默认使用了 `2` 层记忆层，这意味着 `truth-cli` 会记住最开始两层的依赖，这样的确有些效果，但是效果会随着深度增加而减少，如果将记忆层数和深度绑定，那么最后产生的效果和记住每一个节点的优化效果趋于一致

### 递归优化

`truth-cli` 在多处地方使用了递归算法，这意味着我们必须找到一个合适的数据结构加快递归的速度，我们采用的策略是：**生成 `relations` 关系图**

你可以把 `relations` 看成所有依赖的 `package.json` 合集，它只有一层结构，格式类似于：

```json
{
  "pkg1": { "packages": { "pkg2": "^1.1.1" } },
  "pkg2": {
    /* */
  }
  // ...
}
```

这种格式的好处是，当我们想要查找某个依赖时，我们只需要查找该键值对应的值即可，而对象根据键值查找的时间复杂度只有 `O(1)`，递归耗费时间会大大减少

同时当我们生成了 `relations` 后，后续操作都不需要再次读取文件

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