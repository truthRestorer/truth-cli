# Truth-cli🤩

> 一个用于分析 npm 包结构的 cli 工具。

# 特点

- 使用简单
- 可视化展示
- 友好的提示

**关于构建速度：**

由于 `turth-cli` 采用了生成文件的方式，加上 npm 包嵌套关系非常深，如果设置了太大的 `depth`，会导致构建速度变慢，生成的文件也会占用很大的硬盘空间，因此我们推荐将 `depth` 设置在 `<= 4` 的范围内，默认情况下，`tree` 图深度为 3， `pkgs.json` 文件深度为 2(速度控制在 `325ms` 左右)。

**另外需要注意的是，`depth` 设置太大对阅读也会产生很大影响，所以我们不建议设置太大的 `depth`。**

**同时，`truth-cli` 采用深度优先遍历算法，在遍历过程中会记住各个根节点，便于后续的“剪枝”，即使设置了很大的 `depth`，对网页端 `tree` 图的影响也不大。**

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

> 我们并不建议更改深度，如果有需要，请设置在 `<= 4` 范围内。

使用 `--dep` 或者 `-d` 参数：

```bash
truth-cli analyze --dep 4
```

> 需要额外注意的是，tree 图从根节点到尾节点，依次为 *"项目名(`packages.json 中 name 指定，没有默认为 __root__`)"* -> *"项目依赖"* -> *"项目依赖引用的依赖"*，而**深度指的是项目依赖引用的依赖的层数**

如果设置了太大的深度，会报错，这时使用 `--force` 或者 `-f` 参数继续：

```bash
truth-cli analyze --dep 8 --force
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

> **dep 参数在 tree 图和 `pkgs.json` 文件共享**，两者之间的关系为：
> **tree 深度 = dep = `pkgs.json` 深度 + 1*，也就是说 tree 比 `pkgs.json` 深度大 1。

## 清理缓存

前文提到过，`truth-cli` 生成文件达到分析目的，但是有时候生成的文件太大会影响到硬盘空间，此时可以使用 `clean` 命令进行删除：

```bash
truth-cli clean
```