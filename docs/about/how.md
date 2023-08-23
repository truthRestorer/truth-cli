# 原理介绍

## 体积优化

在使用 `vite` 打包时，会默认打印出 `gzip` 压缩的大小，在平常开发中，我们不必要采取手动 `gzip` 压缩，因为服务器会自动处理。

但是 `truth-cli` 是安装在用户目录下的，不会默认开启 `gzip` 压缩，为此 `truth-cli` 对网页单独做了压缩处理。

## 网页数据如何而来？

在使用 `vite` 开发 `vue` 时，我们会有一个 `public` 文件夹存放公共资源，这些资源可以通过 `ajax` 请求获取到，我们只需要处理 `ajax` 请求并发送对应数据即可。

## 数据如何生成？

::: tip 前情提要
本项目使用 [echarts](https://github.com/apache/echarts) 渲染。

为了获取 npm 依赖之间的关系，我们必须要做的是**读取文件**的操作。
:::

`truth-cli` 只会读取一遍 node_modules 文件夹，形成一种 `relations` 的结构，你可以简单的看成是所有包的 `package.json` 文件合集，以后所有的数据都是基于这个 `relations`，这也是为什么使用 `@truth-cli/core` 其他 API 需要传入 `relations`。

### graph 图

::: tip 前情提要

1. 关于 `echarts` 中 graph 图的描述：[echarts - series.graph](https://echarts.apache.org/zh/option.html#series-graph)；
2. `truth-cli` 对应的文件：[@truth-cli/core - genGraph](https://github.com/truthRestorer/truth-cli/blob/main/packages/core/src/graph.ts)；
3. npm 依赖是非常多的，为此 `graph` 只包含根目录中的 `package.json` 中的依赖引用，网页图点击节点也会自动扩展。

:::

`graph` 的生成很简单，我们只需要通过 `relations` 获取到根目录引用关系，将其添加到对应数据格式的节点中即可。

需要额外说明的是：`echarts` 中的 graph 图的 node 节点名字是唯一的，所以我们定义好了一个 `Set` 数据结构，如果我们已经添加过这个节点了，那么就不重复添加了。

### tree 图

::: tip 前情提要

1. 关于 `echarts` 中 tree 图的描述：[echarts - series.tree](https://echarts.apache.org/zh/option.html#series-tree)；
2. `truth-cli` 对应的文件：[@truth-cli/core - genTree](https://github.com/truthRestorer/truth-cli/blob/main/packages/core/src/tree.ts)；
:::

`tree` 数据的生成采用了递归的方式，我们首先通过 `relations` 中的获取项目名，并将其引用的依赖作为当前节点的 `children`，在遍历 `children` 中的所有节点，将节点的引用的依赖作为该节点的 `children` 如此递归下去，便形成了我们的树状结构。

### pkgs.json 文件

::: tip 前情提要

1. `truth-cli` 对应的文件：[@truth-cli/core - genPkgs](https://github.com/truthRestorer/truth-cli/blob/main/packages/core/src/pkgs.ts)；

2. `pkgs.json` 文件的数据生成方式与 `tree` 图类似。
:::

`pkgs.json` 与 `tree` 有以下不同：

1. `tree` 引用的依赖在节点的 `children` 属性上，而 `pkgs.json` 引用的依赖在 `packages` 属性上
2. 属性 `children` 是一个数组；属性 `packages` 是一个对象。


### pkgs.txt 文件

::: tip 前情提要

1. `truth-cli` 对应的文件：[@truth-cli/core - genPkgTree](https://github.com/truthRestorer/truth-cli/blob/main/packages/core/src/pkgTree.ts)；

2. `pkgs.txt` 文件的数据通过遍历 `pkgs` 形成。
:::

`pkgs.txt` 的包含了以下字符：

```ts
enum ESymbol {
  TAB = ' ', // 空格字符
  VERTICAL = '│', // 竖线字符
  ADD = '├─', // 连接依赖的的添加字符
  LINE = '\n', // 换行字符
}
```

我们做的无非是递归遍历 `pkgs`，通过一些规律将上述字符和依赖名连接起来。
