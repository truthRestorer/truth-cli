<h1 align="center">Truth-cli🤩</h1>
<p align="center">A Command Tool for Analyze the Packages(support pnpm)</p>

<p align="center">
	<a href="https://truthrestorer.github.io/truth-cli/">中文文档</a> | <a href="https://truth-cli.vercel.app/">Online</a> | <a href="https://truth-cli-playground.vercel.app">Playground</a>
</p>

# Getting Started

## Installing
```bash
npm install -g truth-cli
```

## Example

**Start Web:**

```bash
truth-cli analyze
```

**Generate File:**

json:

```bash
truth-cli analyze --json
```

txt:

```bash
truth-cli tree
```

## Specify Depth

> Depth is only valid for generated files, the web side adopts dynamic increase of nodes

Use the `--dep` or `-d` parameter:

```bash
truth-cli analyze --json --dep 4
```

```bash
truth-cli tree --dep 4
```

## Specify File Path

By default, `truth-cli` will generate file in the root of your project, if you want to change it, you can add path after the `--json` parameter:

```bash
truth-cli analyze --json dist/
```

> **WARNNING: Please do not add / at the beginning of the path, which will be recognized as the root path by nodejs, causing the generation to fail**

**With `--dep` parameter:**

```bash
truth-cli analyze --json --dep 3
```

# Generated File Format

`truth-cli analyze --json` command will generate the `pkgs.json` file:

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

`truth-cli tre` command will generate `pkgs.txt` file:

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