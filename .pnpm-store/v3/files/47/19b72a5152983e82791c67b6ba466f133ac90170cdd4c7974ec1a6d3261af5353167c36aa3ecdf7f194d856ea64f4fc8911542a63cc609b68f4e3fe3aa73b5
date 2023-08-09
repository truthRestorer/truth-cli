"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
exports.default = (0, utils_1.createRule)("file-extension", {
    meta: {
        docs: {
            description: "enforce YAML file extension",
            categories: [],
            extensionRule: false,
            layout: false,
        },
        schema: [
            {
                type: "object",
                properties: {
                    extension: {
                        enum: ["yaml", "yml"],
                    },
                    caseSensitive: {
                        type: "boolean",
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            unexpected: `Expected extension '{{expected}}' but used extension '{{actual}}'.`,
        },
        type: "suggestion",
    },
    create(context) {
        var _a, _b, _c;
        if (!context.parserServices.isYAML) {
            return {};
        }
        const expected = ((_a = context.options[0]) === null || _a === void 0 ? void 0 : _a.extension) || "yaml";
        const caseSensitive = (_c = (_b = context.options[0]) === null || _b === void 0 ? void 0 : _b.caseSensitive) !== null && _c !== void 0 ? _c : true;
        return {
            Program(node) {
                const filename = context.getFilename();
                const actual = path_1.default.extname(filename);
                if ((caseSensitive ? actual : actual.toLocaleLowerCase()) ===
                    `.${expected}`) {
                    return;
                }
                context.report({
                    node,
                    loc: node.loc.start,
                    messageId: "unexpected",
                    data: {
                        expected: `.${expected}`,
                        actual,
                    },
                });
            },
        };
    },
});
