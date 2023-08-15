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

## 清理缓存

这里针对的文件均为网页端所需要的文件

我们已经对生成文件做了很多优化，通常情况下不会超过 `15mb`，如果你对磁盘空间很敏感，可以使用 `clean` 命令进行删除：

```bash
truth-cli clean
```

# 其他

## 原理介绍

在使用 `vite` 开发 `vue` 时，我们会有一个 `public` 文件夹存放公共资源，这些资源可以通过 `ajax` 请求获取到，如果对 `vite` 进行打包，默认情况下 `public` 文件会存在放与 `index.html` 同路径下，`truth-cli` 正是通过生成文件的方式，让前端可以获取到数据

## 一些优化

### 深度优化

`npm` 依赖之间的嵌套关系会很深，这意味着：产生文件的大小随着深度增加是指数增加的，`truth-cli` 采用的是深度优先遍历，做的优化有：

- **深度不大时(dep <= 4)**：`truth-cli` 在递归的"递"过程中，会记住走过的所有节点，后续向下"递"的过程中碰到相同点节点，那么此节点便是最大深度，不会继续向下递归，并在"归"的过程中，删除记住的节点
- **深度过大时(dep > 4)**：与深度不大时的情况唯一区别在于："归"的过程中，不会删除记住的节点

**关于深度过大时的优化是否有必要：**

在深度过大时，"归"的过程不会删除记住的节点，这意味着当我们查看位置比较靠后的依赖时，会丢掉很多信息

但是如果不进行优化，那么生成的文件大小会非常大，以下是我们开发时测试的结果：

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

### 文件体积优化

如果有个包没有依赖，例如 `pkgA` 的 `package.json` 文件，只有以下内容：

```json
{
  "name": "pkgA",
  "version": "3.3.3"
}
```

在没有进行体积优化前的 `relations`：

```json
{
  "pkgA": { "version": "3.3.3", "packages": {} }
}
```

进行体积优化后的 `relations`：

```json
{
  "pkgA": { "version": "3.3.3" }
}
```

不只是 `relation`，如果你深入了解 `truth-cli` 生成的文件，`truth-cli` 都对其体积进行了优化

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
