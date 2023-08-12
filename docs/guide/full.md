# 完全指南

## analyze 命令

### --dep/-d 参数

::: tip 功能介绍
`--dep` 或 `-d` 参数用于指定依赖引用关系的深度。
:::

::: code-group
```bash [--dep]
truth-cli analyze --dep 4
```
```bash [-d]
truth-cli analyze -d 4
```
:::

### --json/-j 参数

::: tip 功能介绍
`--json` 或 `-j` 表示只会生成文件，参数值为生成文件的路径。
:::


::: code-group
```bash [--json]
truth-cli analyze --json
```
```bash [-j]
truth-cli analyze -j
```
:::


默认情况下，会在根目录下生成 `pkgs.json` 文件，如果需要更改生成目录，可以在参数之后加上路径：

::: code-group
```bash [--json]
truth-cli analyze --json dist/
```
```bash [-j]
truth-cli analyze -j dist/
```
:::

> **注意：请不要在路径开头加上 `/`，这会被 nodejs 识别为根路径，导致生成失败。**

**结合 `dep` 参数：**

```bash
truth-cli analyze --json --dep 3
```
::: code-group
```bash [--json]
truth-cli analyze --json --dep 3
```
```bash [-j]
truth-cli analyze -j --dep 3
```
:::

### --both/-b 参数

::: tip 功能介绍
`--both` 或 `-b` 参数表示生成文件并打开页面。
:::

::: code-group
```bash [--both]
truth-cli analyze --both
```
```bash [-b]
truth-cli analyze -b
```
:::

`--both` 参数的优先级是比 `--json` 大的，也就是说两者同时使用，优先考虑 `--both`：

::: code-group
```bash [--both]
truth-cli analyze --both --json
```
```bash [-b]
truth-cli analyze -b  --json
```
:::

**也可以指定 dep 参数**

::: code-group
```bash [--both]
truth-cli analyze --both --dep 4
```
```bash [-b]
truth-cli analyze -b --dep 4
```
:::

## tree 命令

::: tip 功能介绍
tree 命令用于生成树形文件，简单的展示依赖之间的关系。
:::

```bash
truth-cli tree
```

**使用 `--dep` 或 `-d` 选项指定深度：**

::: code-group
```bash [--dep]
truth-cli tree --dep 4
```
```bash [-d]
truth-cli tree -d 4
```
:::

## clean 命令

::: tip 功能介绍
clean 命令用于清理网页端所需要的文件。
:::

```bash
truth-cli clean
```

我们已经对生成文件做了很多优化，通常情况下不会太大，如果你对磁盘空间很敏感，可以使用 `clean` 命令进行删除。
