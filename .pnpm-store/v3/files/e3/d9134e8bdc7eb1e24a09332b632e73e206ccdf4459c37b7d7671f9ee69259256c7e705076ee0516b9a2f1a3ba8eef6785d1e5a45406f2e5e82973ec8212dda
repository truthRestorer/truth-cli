"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutoConfig = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
let configResolver, ruleNames;
function getConfigResolver() {
    if (configResolver) {
        return configResolver;
    }
    const plugin = require("..");
    try {
        const eslintrc = require("@eslint/eslintrc");
        const configArrayFactory = new eslintrc.Legacy.CascadingConfigArrayFactory({
            additionalPluginPool: new Map([["eslint-plugin-jsonc", plugin]]),
            getEslintRecommendedConfig() {
                return require("../../conf/eslint-recommended.js");
            },
            getEslintAllConfig() {
                return require("../../conf/eslint-all.js");
            },
            eslintRecommendedPath: require.resolve("../../conf/eslint-recommended.js"),
            eslintAllPath: require.resolve("../../conf/eslint-all.js"),
        });
        return (configResolver = (filePath) => {
            const absolutePath = (0, path_1.resolve)(process.cwd(), filePath);
            return configArrayFactory
                .getConfigArrayForFile(absolutePath)
                .extractConfig(absolutePath)
                .toCompatibleObjectAsConfigFileContent();
        });
    }
    catch (_a) {
    }
    try {
        const eslint = require("eslint");
        const engine = new eslint.CLIEngine({});
        engine.addPlugin("eslint-plugin-jsonc", plugin);
        return (configResolver = (filePath) => {
            let targetFilePath = filePath;
            const ext = (0, path_1.extname)(filePath);
            while (!isValidFilename(targetFilePath)) {
                const dir = (0, path_1.dirname)(targetFilePath);
                if (dir === targetFilePath) {
                    return {};
                }
                targetFilePath = dir;
                if (ext && (0, path_1.extname)(targetFilePath) !== ext) {
                    targetFilePath += ext;
                }
            }
            return engine.getConfigForFile(targetFilePath);
        });
    }
    catch (_b) {
    }
    return () => ({});
}
function isValidFilename(filename) {
    const dir = (0, path_1.dirname)(filename);
    if ((0, fs_1.existsSync)(dir) && (0, fs_1.statSync)(dir).isDirectory()) {
        if ((0, fs_1.existsSync)(filename) && (0, fs_1.statSync)(filename).isDirectory()) {
            return false;
        }
        return true;
    }
    return false;
}
function getConfig(filename) {
    return getConfigResolver()(filename);
}
function getJsoncRule(rule) {
    ruleNames =
        ruleNames ||
            new Set(require("./rules").rules.map((r) => r.meta.docs.ruleName));
    return ruleNames.has(rule) ? `jsonc/${rule}` : null;
}
function getAutoConfig(filename) {
    const autoConfig = {};
    const config = getConfig(filename);
    if (config.rules) {
        for (const ruleName of Object.keys(config.rules)) {
            const jsoncName = getJsoncRule(ruleName);
            if (jsoncName && !config.rules[jsoncName]) {
                const entry = config.rules[ruleName];
                if (entry) {
                    const severity = Array.isArray(entry) ? entry[0] : entry;
                    if (severity !== "off" && severity !== 0) {
                        autoConfig[jsoncName] = entry;
                    }
                }
            }
        }
    }
    return autoConfig;
}
exports.getAutoConfig = getAutoConfig;
