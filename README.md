# Truth-cli🤩

> 一个用于分析 npm 包结构的 cli 工具。

# 特点

- 速度极快

- 使用简单
- 可视化展示
- 友好的提示

**关于构建速度：**

`turth-cli` 采用了生成文件的方式，达到渲染的目的，但是不必担心文件过大，因为 `truth-cli` 做了很多优化:

**`truth-cli` 采用深度优先遍历算法，默认情况下在遍历过程中会记住各个根节点，便于后续的“剪枝”；如果深度过大，`truth-cli` 会记住走过的所有节点，意味着以后重复的节点不会递归产生新数据了** 

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

**网页的内容包括：**

- tree 图：用树型结构展示 npm 依赖之间的关系，受参数 `dep` 影响
- force 图：用引力布局的图结构展示 npm 依赖之间的关系，不受参数 `dep` 影响

## 指定深度

**我们不建议设置过大的深度，正常情况下 <= 4 是最佳选项**

> 需要额外注意的是，tree 图从根节点到尾节点，依次为 *"项目名(`packages.json 中 name 指定，没有默认为 __root__`)"* -> *"项目依赖"* -> *"项目依赖引用的依赖"*，而**深度指的是项目依赖引用的依赖的层数**

使用 `--dep` 或者 `-d` 参数：

```bash
truth-cli analyze --dep 4
```

**`truth-cli` 关于深度的一些优化**：

> 首先我们我们要说明的是：非常有必要在深度过大时，采用极端的手段对生成文件的体积(网页所需文件，不是根目录中的 `pkgs.json`)进行优化：
>
> - 在不进行极端优化时，`dep` 为 7 时，生成的文件大小达到了 `146.5mb`
> - 极端情况下，`dep` 为 7 时，生成的文件只有 `0.78mb`
>
> 体积只有原来的 1/188

**tree 图和 `pkgs.json` 文件极端优化条件：**

- tree 图：`dep > 5` 
- `pkgs.json`：`dep > 7`

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

> **dep 参数在 tree 图和 `pkgs.json` 文件共享**，两者之间的关系为：
> **tree 深度 = dep = `pkgs.json` 深度 + 1*，也就是说 tree 比 `pkgs.json` 深度大 1。

## 清理缓存

这里针对的文件均为网页端所需要的文件

我们已经对生成文件做了很多优化，通常情况下不会超过 `15mb`，如果你对磁盘空间很敏感，可以使用 `clean` 命令进行删除：

```bash
truth-cli clean
```
