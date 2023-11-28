# @truth-cli/shared

## 1.3.0

### Minor Changes

- 5286dc2: node version >=18 & pnpm >= 8

## 1.2.0

### Minor Changes

- cf68229c: 懒加载relations，大幅加快启动速度

## 1.1.8

### Patch Changes

- 27f41c51: 新增显示本地连接

## 1.1.7

### Patch Changes

- 022f8ab4: 使用vite的inline worker

## 1.1.6

### Patch Changes

- 439e280e: 优化性能

## 1.1.5

### Patch Changes

- dd0b47ce: 添加多版本显示功能
- dd5e9f96: 采用terser进一步减少体积
- dd0b47ce: 完善类型的说明

## 1.1.4

### Patch Changes

- 6ee75a48: 优化网页端体积大小
- 6ee75a48: 简化cli代码逻辑
- 5edffda4: 更改Logo标识
- 6ee75a48: 实现下载图片功能

## 1.1.3

### Patch Changes

- 5fbc9652: 优化算法
- 5fbc9652: 优化web端代码逻辑
- fd421650: web端新增指向箭头，调整节点大小

## 1.1.2

### Patch Changes

- b740b2f5: 优化genRelations API，读取时间缩短1/3

## 1.1.1

### Patch Changes

- f8e5427c: web端采取worker

## 1.1.0

### Minor Changes

- 95a7026c: 采用esbuild打包处理

## 1.0.4

### Patch Changes

- f0ca6cbb: 完善API设计
- f0ca6cbb: web端内容获取方式保持一致
- 09ba6284: 优化web函数逻辑，提升性能
- d3e3af82: 实现彩色打印，提高网页启动速度
- 8c3d88af: 更新br压缩依赖
- 09ba6284: 修复了引力图命中后，树图节点无法展开问题
- e7d8b832: 修复了aim命中后，点击其他节点无法还原问题

## 1.0.3

### Patch Changes

- 1881f91c: 添加logo

## 1.0.2

### Patch Changes

- b8b6ffbe: 去除web一些无用样式
- b8b6ffbe: 提高web组件复用
- 967717a4: 修复了网页端多节点收缩节点消失问题

## 1.0.1

### Patch Changes

- 0f7bf3e1: 完善web设计
- 0f7bf3e1: 完善relations设计
- 47ecdb1a: 修复节点不一致问题

## 1.0.0

### Major Changes

- cb52f678: 修复了已知bug，提升用户交互

## 0.10.1

### Patch Changes

- d44757ab: 采用br压缩网页内容，减少体积

## 0.10.0

### Minor Changes

- b018d960: 优化了细节问题

## 0.9.11

### Patch Changes

- ff06f4d6: 采取gzip压缩json文件

## 0.9.10

### Patch Changes

- d3fe0220: 优化genJson API

## 0.9.9

### Patch Changes

- fb8c8772: 完善了@truth-cli/core中API的使用

## 0.9.8

### Patch Changes

- c8bf5c5c: 指令参数简化

## 0.9.7

### Patch Changes

- 1bb09baf: 修复折叠全部节点后不展开问题

## 0.9.6

### Patch Changes

- c3af123e: 修复路径打印错误问题

## 0.9.5

### Patch Changes

- 4e976c2a: 版本依赖更新，新增节点拖拽效果

## 0.9.4

### Patch Changes

- 92a49655: 新增动态删除节点

## 0.9.3

### Patch Changes

- 5f5c4881: 新增图标Logo

## 0.9.2

### Patch Changes

- 2a319243: 正确处理package.json中name字段

## 0.9.1

### Patch Changes

- 6969922d: 修复了已知问题，简化了一些不必要的函数

## 0.9.0

### Minor Changes

- 5aae0995: 体积优化、文档更新

## 0.8.11

### Patch Changes

- 4b831add: 更新网页样式

## 0.8.10

### Patch Changes

- fa5a44dd: 优化打包后的体积大小

## 0.8.9

### Patch Changes

- 276e3201: 修复已知问题，性能提升

## 0.8.8

### Patch Changes

- d5d3a599: 修复了网页无法找到依赖bug

## 0.8.7

### Patch Changes

- 98062f68: 修复打包问题

## 0.8.6

### Patch Changes

- 2009614e: 优化接口的调用
- 2009614e: 优化网页端生成数据的逻辑

## 0.8.5

### Patch Changes

- c93a73dc: 更明确的依赖关系

## 0.8.4

### Patch Changes

- 587c54a0: 支持pnpm版本控制

## 0.8.3

### Patch Changes

- 06153472: 手动实现json数据展示，减少 web 体积

  删除因思路改变而没用的功能，例如文件清理

  完善 web 设计

## 0.8.2

### Patch Changes

- 29896e0f: 进一步完善网页设计
- 06fba2c3: 修改网页设计
- 06fba2c3: 更合理的数据生成方式：废弃了生成文件的方式，采用了直接传输方式

## 0.8.1

### Patch Changes

- 74cbc964: 不采取生成文件的方式，进一步优化性能

## 0.8.0

### Minor Changes

- 0e4b12ac: 开启gzip优化模式

## 0.7.12

### Patch Changes

- 73d7afb4: 版本号一致

## 0.1.8

### Patch Changes

- 8d9a641c: 忽略不需要发布的依赖

## 0.1.7

### Patch Changes

- 85072365: 进一步完善功能

## 0.1.6

### Patch Changes

- b3bc2dff: 修复版本问题

## 0.1.5

### Patch Changes

- 75eb64c9: 版本号更新获取

## 0.1.4

### Patch Changes

- f7204792: 完善web测试和文档说明
- 5c27f645: 添加playground测试；修复已知bug

## 0.1.3

### Patch Changes

- 21dc94a3: 修复了tree图显示问题；修复了已知bug
- c6c90137: 修复了已知问题

## 0.1.2

### Patch Changes

- d051f348: 核心模块抽离

## 0.1.1

### Patch Changes

- 681bfe03: 目录结构调整

## 0.1.0

### Minor Changes

- first add

## 0.1.0-alpha.0

### Minor Changes

- first add
