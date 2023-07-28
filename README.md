> Tip: 目前项目名称暂时叫 `dep-cli`，如果以后更改，那么以下命令也会跟着改变

# 使用指南

## 开发环境


如果想要本地开发 `cli` 或者 `web`，建议先进行打包生产：

```
pnpm run build:cli
```

在项目根目录中依次执行：

```
npm link
dev-cli analyze
```

开发时会自动执行热更新

## 生产版本

如果想要测试生产版本是否有效，可以尝试以下步骤

1. 构建 `cli`：

在本项目根目录中执行：

```bash
pnpm run build:dev
```

2. `node` 关联:

在本项目根目录中执行：

```bash
npm link
```

3. 随便找一个项目，可以尝试执行下述命令：

- 如果你想获取如何使用，请执行以下命令：

```bash
dep-cli -h
```

- 网页依赖关系图：

```bash
dep-cli analyze
```

- 如果不希望打开网页，只想生成文件，可以执行下述命令：

> 如果不携带参数，那么生成的文件在项目根目录，名字叫 `pkgs.json`

```bash
dep-cli analyze -j
```

或

```
dep-cli analyze --json
```

你也可以指定生成文件的目录：

> 在 `/dist` 中产生文件

```
dep-cli analyze -j /dist
```

- 指定依赖深度(注：此命令也会打开网页)

> 本项目默认依赖深度为 `2`，如果想要更改(注意，由于 `npm` 包依赖关系非常多，建议数字不要太大，本项目超过 `7` 将会构建失败)，可以执行下述命令：

```
dep-cli analyze -d 3
```

或

```
dep-cli analyze --depth 3
```

