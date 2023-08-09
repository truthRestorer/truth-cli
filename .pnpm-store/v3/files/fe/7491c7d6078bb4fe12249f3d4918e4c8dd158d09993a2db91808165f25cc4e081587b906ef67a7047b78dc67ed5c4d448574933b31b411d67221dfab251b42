'use strict';var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {return typeof obj;} : function (obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};





var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _ignore = require('eslint-module-utils/ignore');
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _path = require('path');
var _readPkgUp2 = require('eslint-module-utils/readPkgUp');var _readPkgUp3 = _interopRequireDefault(_readPkgUp2);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}} /**
                                                                                                                                                                                                                                                                                                                                                                                                            * @fileOverview Ensures that modules contain exports and/or all
                                                                                                                                                                                                                                                                                                                                                                                                            * modules are consumed within other modules.
                                                                                                                                                                                                                                                                                                                                                                                                            * @author René Fermann
                                                                                                                                                                                                                                                                                                                                                                                                            */var values = Object.values;var includes = Function.bind.bind(Function.prototype.call)(Array.prototype.includes);
var FileEnumerator = void 0;
var listFilesToProcess = void 0;

try {var _require =
  require('eslint/use-at-your-own-risk');FileEnumerator = _require.FileEnumerator;
} catch (e) {
  try {var _require2 =

    require('eslint/lib/cli-engine/file-enumerator'); // has been moved to eslint/lib/cli-engine/file-enumerator in version 6
    FileEnumerator = _require2.FileEnumerator;} catch (e) {
    try {
      // eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
      var _require3 = require('eslint/lib/util/glob-utils'),originalListFilesToProcess = _require3.listFilesToProcess;

      // Prevent passing invalid options (extensions array) to old versions of the function.
      // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
      // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
      listFilesToProcess = function listFilesToProcess(src, extensions) {
        return originalListFilesToProcess(src, {
          extensions: extensions });

      };
    } catch (e) {var _require4 =
      require('eslint/lib/util/glob-util'),_originalListFilesToProcess = _require4.listFilesToProcess;

      listFilesToProcess = function listFilesToProcess(src, extensions) {
        var patterns = src.reduce(
        function (carry, pattern) {return carry.concat(
          extensions.map(function (extension) {return (/\*\*|\*\./.test(pattern) ? pattern : String(pattern) + '/**/*' + String(extension));}));},

        src);


        return _originalListFilesToProcess(patterns);
      };
    }
  }
}

if (FileEnumerator) {
  listFilesToProcess = function listFilesToProcess(src, extensions) {
    var e = new FileEnumerator({
      extensions: extensions });


    return Array.from(e.iterateFiles(src), function (_ref) {var filePath = _ref.filePath,ignored = _ref.ignored;return {
        ignored: ignored,
        filename: filePath };});

  };
}

var EXPORT_DEFAULT_DECLARATION = 'ExportDefaultDeclaration';
var EXPORT_NAMED_DECLARATION = 'ExportNamedDeclaration';
var EXPORT_ALL_DECLARATION = 'ExportAllDeclaration';
var IMPORT_DECLARATION = 'ImportDeclaration';
var IMPORT_NAMESPACE_SPECIFIER = 'ImportNamespaceSpecifier';
var IMPORT_DEFAULT_SPECIFIER = 'ImportDefaultSpecifier';
var VARIABLE_DECLARATION = 'VariableDeclaration';
var FUNCTION_DECLARATION = 'FunctionDeclaration';
var CLASS_DECLARATION = 'ClassDeclaration';
var IDENTIFIER = 'Identifier';
var OBJECT_PATTERN = 'ObjectPattern';
var TS_INTERFACE_DECLARATION = 'TSInterfaceDeclaration';
var TS_TYPE_ALIAS_DECLARATION = 'TSTypeAliasDeclaration';
var TS_ENUM_DECLARATION = 'TSEnumDeclaration';
var DEFAULT = 'default';

function forEachDeclarationIdentifier(declaration, cb) {
  if (declaration) {
    if (
    declaration.type === FUNCTION_DECLARATION ||
    declaration.type === CLASS_DECLARATION ||
    declaration.type === TS_INTERFACE_DECLARATION ||
    declaration.type === TS_TYPE_ALIAS_DECLARATION ||
    declaration.type === TS_ENUM_DECLARATION)
    {
      cb(declaration.id.name);
    } else if (declaration.type === VARIABLE_DECLARATION) {
      declaration.declarations.forEach(function (_ref2) {var id = _ref2.id;
        if (id.type === OBJECT_PATTERN) {
          (0, _ExportMap.recursivePatternCapture)(id, function (pattern) {
            if (pattern.type === IDENTIFIER) {
              cb(pattern.name);
            }
          });
        } else {
          cb(id.name);
        }
      });
    }
  }
}

/**
   * List of imports per file.
   *
   * Represented by a two-level Map to a Set of identifiers. The upper-level Map
   * keys are the paths to the modules containing the imports, while the
   * lower-level Map keys are the paths to the files which are being imported
   * from. Lastly, the Set of identifiers contains either names being imported
   * or a special AST node name listed above (e.g ImportDefaultSpecifier).
   *
   * For example, if we have a file named foo.js containing:
   *
   *   import { o2 } from './bar.js';
   *
   * Then we will have a structure that looks like:
   *
   *   Map { 'foo.js' => Map { 'bar.js' => Set { 'o2' } } }
   *
   * @type {Map<string, Map<string, Set<string>>>}
   */
var importList = new Map();

/**
                             * List of exports per file.
                             *
                             * Represented by a two-level Map to an object of metadata. The upper-level Map
                             * keys are the paths to the modules containing the exports, while the
                             * lower-level Map keys are the specific identifiers or special AST node names
                             * being exported. The leaf-level metadata object at the moment only contains a
                             * `whereUsed` property, which contains a Set of paths to modules that import
                             * the name.
                             *
                             * For example, if we have a file named bar.js containing the following exports:
                             *
                             *   const o2 = 'bar';
                             *   export { o2 };
                             *
                             * And a file named foo.js containing the following import:
                             *
                             *   import { o2 } from './bar.js';
                             *
                             * Then we will have a structure that looks like:
                             *
                             *   Map { 'bar.js' => Map { 'o2' => { whereUsed: Set { 'foo.js' } } } }
                             *
                             * @type {Map<string, Map<string, object>>}
                             */
var exportList = new Map();

var visitorKeyMap = new Map();

var ignoredFiles = new Set();
var filesOutsideSrc = new Set();

var isNodeModule = function isNodeModule(path) {return (/\/(node_modules)\//.test(path));};

/**
                                                                                             * read all files matching the patterns in src and ignoreExports
                                                                                             *
                                                                                             * return all files matching src pattern, which are not matching the ignoreExports pattern
                                                                                             */
var resolveFiles = function resolveFiles(src, ignoreExports, context) {
  var extensions = Array.from((0, _ignore.getFileExtensions)(context.settings));

  var srcFiles = new Set();
  var srcFileList = listFilesToProcess(src, extensions);

  // prepare list of ignored files
  var ignoredFilesList = listFilesToProcess(ignoreExports, extensions);
  ignoredFilesList.forEach(function (_ref3) {var filename = _ref3.filename;return ignoredFiles.add(filename);});

  // prepare list of source files, don't consider files from node_modules
  srcFileList.filter(function (_ref4) {var filename = _ref4.filename;return !isNodeModule(filename);}).forEach(function (_ref5) {var filename = _ref5.filename;
    srcFiles.add(filename);
  });
  return srcFiles;
};

/**
    * parse all source files and build up 2 maps containing the existing imports and exports
    */
var prepareImportsAndExports = function prepareImportsAndExports(srcFiles, context) {
  var exportAll = new Map();
  srcFiles.forEach(function (file) {
    var exports = new Map();
    var imports = new Map();
    var currentExports = _ExportMap2['default'].get(file, context);
    if (currentExports) {var

      dependencies =




      currentExports.dependencies,reexports = currentExports.reexports,localImportList = currentExports.imports,namespace = currentExports.namespace,visitorKeys = currentExports.visitorKeys;

      visitorKeyMap.set(file, visitorKeys);
      // dependencies === export * from
      var currentExportAll = new Set();
      dependencies.forEach(function (getDependency) {
        var dependency = getDependency();
        if (dependency === null) {
          return;
        }

        currentExportAll.add(dependency.path);
      });
      exportAll.set(file, currentExportAll);

      reexports.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
        var reexport = value.getImport();
        if (!reexport) {
          return;
        }
        var localImport = imports.get(reexport.path);
        var currentValue = void 0;
        if (value.local === DEFAULT) {
          currentValue = IMPORT_DEFAULT_SPECIFIER;
        } else {
          currentValue = value.local;
        }
        if (typeof localImport !== 'undefined') {
          localImport = new Set([].concat(_toConsumableArray(localImport), [currentValue]));
        } else {
          localImport = new Set([currentValue]);
        }
        imports.set(reexport.path, localImport);
      });

      localImportList.forEach(function (value, key) {
        if (isNodeModule(key)) {
          return;
        }
        var localImport = imports.get(key) || new Set();
        value.declarations.forEach(function (_ref6) {var importedSpecifiers = _ref6.importedSpecifiers;
          importedSpecifiers.forEach(function (specifier) {
            localImport.add(specifier);
          });
        });
        imports.set(key, localImport);
      });
      importList.set(file, imports);

      // build up export list only, if file is not ignored
      if (ignoredFiles.has(file)) {
        return;
      }
      namespace.forEach(function (value, key) {
        if (key === DEFAULT) {
          exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
        } else {
          exports.set(key, { whereUsed: new Set() });
        }
      });
    }
    exports.set(EXPORT_ALL_DECLARATION, { whereUsed: new Set() });
    exports.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: new Set() });
    exportList.set(file, exports);
  });
  exportAll.forEach(function (value, key) {
    value.forEach(function (val) {
      var currentExports = exportList.get(val);
      if (currentExports) {
        var currentExport = currentExports.get(EXPORT_ALL_DECLARATION);
        currentExport.whereUsed.add(key);
      }
    });
  });
};

/**
    * traverse through all imports and add the respective path to the whereUsed-list
    * of the corresponding export
    */
var determineUsage = function determineUsage() {
  importList.forEach(function (listValue, listKey) {
    listValue.forEach(function (value, key) {
      var exports = exportList.get(key);
      if (typeof exports !== 'undefined') {
        value.forEach(function (currentImport) {
          var specifier = void 0;
          if (currentImport === IMPORT_NAMESPACE_SPECIFIER) {
            specifier = IMPORT_NAMESPACE_SPECIFIER;
          } else if (currentImport === IMPORT_DEFAULT_SPECIFIER) {
            specifier = IMPORT_DEFAULT_SPECIFIER;
          } else {
            specifier = currentImport;
          }
          if (typeof specifier !== 'undefined') {
            var exportStatement = exports.get(specifier);
            if (typeof exportStatement !== 'undefined') {var
              whereUsed = exportStatement.whereUsed;
              whereUsed.add(listKey);
              exports.set(specifier, { whereUsed: whereUsed });
            }
          }
        });
      }
    });
  });
};

var getSrc = function getSrc(src) {
  if (src) {
    return src;
  }
  return [process.cwd()];
};

/**
    * prepare the lists of existing imports and exports - should only be executed once at
    * the start of a new eslint run
    */
var srcFiles = void 0;
var lastPrepareKey = void 0;
var doPreparation = function doPreparation(src, ignoreExports, context) {
  var prepareKey = JSON.stringify({
    src: (src || []).sort(),
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from((0, _ignore.getFileExtensions)(context.settings)).sort() });

  if (prepareKey === lastPrepareKey) {
    return;
  }

  importList.clear();
  exportList.clear();
  ignoredFiles.clear();
  filesOutsideSrc.clear();

  srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
  prepareImportsAndExports(srcFiles, context);
  determineUsage();
  lastPrepareKey = prepareKey;
};

var newNamespaceImportExists = function newNamespaceImportExists(specifiers) {return specifiers.some(function (_ref7) {var type = _ref7.type;return type === IMPORT_NAMESPACE_SPECIFIER;});};

var newDefaultImportExists = function newDefaultImportExists(specifiers) {return specifiers.some(function (_ref8) {var type = _ref8.type;return type === IMPORT_DEFAULT_SPECIFIER;});};

var fileIsInPkg = function fileIsInPkg(file) {var _readPkgUp =
  (0, _readPkgUp3['default'])({ cwd: file }),path = _readPkgUp.path,pkg = _readPkgUp.pkg;
  var basePath = (0, _path.dirname)(path);

  var checkPkgFieldString = function checkPkgFieldString(pkgField) {
    if ((0, _path.join)(basePath, pkgField) === file) {
      return true;
    }
  };

  var checkPkgFieldObject = function checkPkgFieldObject(pkgField) {
    var pkgFieldFiles = values(pkgField).
    filter(function (value) {return typeof value !== 'boolean';}).
    map(function (value) {return (0, _path.join)(basePath, value);});

    if (includes(pkgFieldFiles, file)) {
      return true;
    }
  };

  var checkPkgField = function checkPkgField(pkgField) {
    if (typeof pkgField === 'string') {
      return checkPkgFieldString(pkgField);
    }

    if ((typeof pkgField === 'undefined' ? 'undefined' : _typeof(pkgField)) === 'object') {
      return checkPkgFieldObject(pkgField);
    }
  };

  if (pkg['private'] === true) {
    return false;
  }

  if (pkg.bin) {
    if (checkPkgField(pkg.bin)) {
      return true;
    }
  }

  if (pkg.browser) {
    if (checkPkgField(pkg.browser)) {
      return true;
    }
  }

  if (pkg.main) {
    if (checkPkgFieldString(pkg.main)) {
      return true;
    }
  }

  return false;
};

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid modules without exports, or exports without matching import in another module.',
      url: (0, _docsUrl2['default'])('no-unused-modules') },

    schema: [{
      properties: {
        src: {
          description: 'files/paths to be analyzed (only for unused exports)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        ignoreExports: {
          description:
          'files/paths for which unused exports will not be reported (e.g module entry points)',
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
            minLength: 1 } },


        missingExports: {
          description: 'report modules without any exports',
          type: 'boolean' },

        unusedExports: {
          description: 'report exports without any usage',
          type: 'boolean' } },


      not: {
        properties: {
          unusedExports: { 'enum': [false] },
          missingExports: { 'enum': [false] } } },


      anyOf: [{
        not: {
          properties: {
            unusedExports: { 'enum': [true] } } },


        required: ['missingExports'] },
      {
        not: {
          properties: {
            missingExports: { 'enum': [true] } } },


        required: ['unusedExports'] },
      {
        properties: {
          unusedExports: { 'enum': [true] } },

        required: ['unusedExports'] },
      {
        properties: {
          missingExports: { 'enum': [true] } },

        required: ['missingExports'] }] }] },




  create: function () {function create(context) {var _ref9 =





      context.options[0] || {},src = _ref9.src,_ref9$ignoreExports = _ref9.ignoreExports,ignoreExports = _ref9$ignoreExports === undefined ? [] : _ref9$ignoreExports,missingExports = _ref9.missingExports,unusedExports = _ref9.unusedExports;

      if (unusedExports) {
        doPreparation(src, ignoreExports, context);
      }

      var file = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();

      var checkExportPresence = function () {function checkExportPresence(node) {
          if (!missingExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          var exportCount = exportList.get(file);
          var exportAll = exportCount.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exportCount.get(IMPORT_NAMESPACE_SPECIFIER);

          exportCount['delete'](EXPORT_ALL_DECLARATION);
          exportCount['delete'](IMPORT_NAMESPACE_SPECIFIER);
          if (exportCount.size < 1) {
            // node.body[0] === 'undefined' only happens, if everything is commented out in the file
            // being linted
            context.report(node.body[0] ? node.body[0] : node, 'No exports found');
          }
          exportCount.set(EXPORT_ALL_DECLARATION, exportAll);
          exportCount.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
        }return checkExportPresence;}();

      var checkUsage = function () {function checkUsage(node, exportedValue) {
          if (!unusedExports) {
            return;
          }

          if (ignoredFiles.has(file)) {
            return;
          }

          if (fileIsInPkg(file)) {
            return;
          }

          if (filesOutsideSrc.has(file)) {
            return;
          }

          // make sure file to be linted is included in source files
          if (!srcFiles.has(file)) {
            srcFiles = resolveFiles(getSrc(src), ignoreExports, context);
            if (!srcFiles.has(file)) {
              filesOutsideSrc.add(file);
              return;
            }
          }

          exports = exportList.get(file);

          // special case: export * from
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          if (typeof exportAll !== 'undefined' && exportedValue !== IMPORT_DEFAULT_SPECIFIER) {
            if (exportAll.whereUsed.size > 0) {
              return;
            }
          }

          // special case: namespace import
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);
          if (typeof namespaceImports !== 'undefined') {
            if (namespaceImports.whereUsed.size > 0) {
              return;
            }
          }

          // exportsList will always map any imported value of 'default' to 'ImportDefaultSpecifier'
          var exportsKey = exportedValue === DEFAULT ? IMPORT_DEFAULT_SPECIFIER : exportedValue;

          var exportStatement = exports.get(exportsKey);

          var value = exportsKey === IMPORT_DEFAULT_SPECIFIER ? DEFAULT : exportsKey;

          if (typeof exportStatement !== 'undefined') {
            if (exportStatement.whereUsed.size < 1) {
              context.report(
              node, 'exported declaration \'' +
              value + '\' not used within other modules');

            }
          } else {
            context.report(
            node, 'exported declaration \'' +
            value + '\' not used within other modules');

          }
        }return checkUsage;}();

      /**
                                 * only useful for tools like vscode-eslint
                                 *
                                 * update lists of existing exports during runtime
                                 */
      var updateExportUsage = function () {function updateExportUsage(node) {
          if (ignoredFiles.has(file)) {
            return;
          }

          var exports = exportList.get(file);

          // new module has been created during runtime
          // include it in further processing
          if (typeof exports === 'undefined') {
            exports = new Map();
          }

          var newExports = new Map();
          var newExportIdentifiers = new Set();

          node.body.forEach(function (_ref10) {var type = _ref10.type,declaration = _ref10.declaration,specifiers = _ref10.specifiers;
            if (type === EXPORT_DEFAULT_DECLARATION) {
              newExportIdentifiers.add(IMPORT_DEFAULT_SPECIFIER);
            }
            if (type === EXPORT_NAMED_DECLARATION) {
              if (specifiers.length > 0) {
                specifiers.forEach(function (specifier) {
                  if (specifier.exported) {
                    newExportIdentifiers.add(specifier.exported.name || specifier.exported.value);
                  }
                });
              }
              forEachDeclarationIdentifier(declaration, function (name) {
                newExportIdentifiers.add(name);
              });
            }
          });

          // old exports exist within list of new exports identifiers: add to map of new exports
          exports.forEach(function (value, key) {
            if (newExportIdentifiers.has(key)) {
              newExports.set(key, value);
            }
          });

          // new export identifiers added: add to map of new exports
          newExportIdentifiers.forEach(function (key) {
            if (!exports.has(key)) {
              newExports.set(key, { whereUsed: new Set() });
            }
          });

          // preserve information about namespace imports
          var exportAll = exports.get(EXPORT_ALL_DECLARATION);
          var namespaceImports = exports.get(IMPORT_NAMESPACE_SPECIFIER);

          if (typeof namespaceImports === 'undefined') {
            namespaceImports = { whereUsed: new Set() };
          }

          newExports.set(EXPORT_ALL_DECLARATION, exportAll);
          newExports.set(IMPORT_NAMESPACE_SPECIFIER, namespaceImports);
          exportList.set(file, newExports);
        }return updateExportUsage;}();

      /**
                                        * only useful for tools like vscode-eslint
                                        *
                                        * update lists of existing imports during runtime
                                        */
      var updateImportUsage = function () {function updateImportUsage(node) {
          if (!unusedExports) {
            return;
          }

          var oldImportPaths = importList.get(file);
          if (typeof oldImportPaths === 'undefined') {
            oldImportPaths = new Map();
          }

          var oldNamespaceImports = new Set();
          var newNamespaceImports = new Set();

          var oldExportAll = new Set();
          var newExportAll = new Set();

          var oldDefaultImports = new Set();
          var newDefaultImports = new Set();

          var oldImports = new Map();
          var newImports = new Map();
          oldImportPaths.forEach(function (value, key) {
            if (value.has(EXPORT_ALL_DECLARATION)) {
              oldExportAll.add(key);
            }
            if (value.has(IMPORT_NAMESPACE_SPECIFIER)) {
              oldNamespaceImports.add(key);
            }
            if (value.has(IMPORT_DEFAULT_SPECIFIER)) {
              oldDefaultImports.add(key);
            }
            value.forEach(function (val) {
              if (
              val !== IMPORT_NAMESPACE_SPECIFIER &&
              val !== IMPORT_DEFAULT_SPECIFIER)
              {
                oldImports.set(val, key);
              }
            });
          });

          function processDynamicImport(source) {
            if (source.type !== 'Literal') {
              return null;
            }
            var p = (0, _resolve2['default'])(source.value, context);
            if (p == null) {
              return null;
            }
            newNamespaceImports.add(p);
          }

          (0, _visit2['default'])(node, visitorKeyMap.get(file), {
            ImportExpression: function () {function ImportExpression(child) {
                processDynamicImport(child.source);
              }return ImportExpression;}(),
            CallExpression: function () {function CallExpression(child) {
                if (child.callee.type === 'Import') {
                  processDynamicImport(child.arguments[0]);
                }
              }return CallExpression;}() });


          node.body.forEach(function (astNode) {
            var resolvedPath = void 0;

            // support for export { value } from 'module'
            if (astNode.type === EXPORT_NAMED_DECLARATION) {
              if (astNode.source) {
                resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
                astNode.specifiers.forEach(function (specifier) {
                  var name = specifier.local.name || specifier.local.value;
                  if (name === DEFAULT) {
                    newDefaultImports.add(resolvedPath);
                  } else {
                    newImports.set(name, resolvedPath);
                  }
                });
              }
            }

            if (astNode.type === EXPORT_ALL_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              newExportAll.add(resolvedPath);
            }

            if (astNode.type === IMPORT_DECLARATION) {
              resolvedPath = (0, _resolve2['default'])(astNode.source.raw.replace(/('|")/g, ''), context);
              if (!resolvedPath) {
                return;
              }

              if (isNodeModule(resolvedPath)) {
                return;
              }

              if (newNamespaceImportExists(astNode.specifiers)) {
                newNamespaceImports.add(resolvedPath);
              }

              if (newDefaultImportExists(astNode.specifiers)) {
                newDefaultImports.add(resolvedPath);
              }

              astNode.specifiers.
              filter(function (specifier) {return specifier.type !== IMPORT_DEFAULT_SPECIFIER && specifier.type !== IMPORT_NAMESPACE_SPECIFIER;}).
              forEach(function (specifier) {
                newImports.set(specifier.imported.name || specifier.imported.value, resolvedPath);
              });
            }
          });

          newExportAll.forEach(function (value) {
            if (!oldExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(EXPORT_ALL_DECLARATION);
              oldImportPaths.set(value, imports);

              var _exports = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports !== 'undefined') {
                currentExport = _exports.get(EXPORT_ALL_DECLARATION);
              } else {
                _exports = new Map();
                exportList.set(value, _exports);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports.set(EXPORT_ALL_DECLARATION, { whereUsed: whereUsed });
              }
            }
          });

          oldExportAll.forEach(function (value) {
            if (!newExportAll.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](EXPORT_ALL_DECLARATION);

              var _exports2 = exportList.get(value);
              if (typeof _exports2 !== 'undefined') {
                var currentExport = _exports2.get(EXPORT_ALL_DECLARATION);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newDefaultImports.forEach(function (value) {
            if (!oldDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_DEFAULT_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports3 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports3 !== 'undefined') {
                currentExport = _exports3.get(IMPORT_DEFAULT_SPECIFIER);
              } else {
                _exports3 = new Map();
                exportList.set(value, _exports3);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports3.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldDefaultImports.forEach(function (value) {
            if (!newDefaultImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_DEFAULT_SPECIFIER);

              var _exports4 = exportList.get(value);
              if (typeof _exports4 !== 'undefined') {
                var currentExport = _exports4.get(IMPORT_DEFAULT_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newNamespaceImports.forEach(function (value) {
            if (!oldNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(IMPORT_NAMESPACE_SPECIFIER);
              oldImportPaths.set(value, imports);

              var _exports5 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports5 !== 'undefined') {
                currentExport = _exports5.get(IMPORT_NAMESPACE_SPECIFIER);
              } else {
                _exports5 = new Map();
                exportList.set(value, _exports5);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports5.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: whereUsed });
              }
            }
          });

          oldNamespaceImports.forEach(function (value) {
            if (!newNamespaceImports.has(value)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](IMPORT_NAMESPACE_SPECIFIER);

              var _exports6 = exportList.get(value);
              if (typeof _exports6 !== 'undefined') {
                var currentExport = _exports6.get(IMPORT_NAMESPACE_SPECIFIER);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });

          newImports.forEach(function (value, key) {
            if (!oldImports.has(key)) {
              var imports = oldImportPaths.get(value);
              if (typeof imports === 'undefined') {
                imports = new Set();
              }
              imports.add(key);
              oldImportPaths.set(value, imports);

              var _exports7 = exportList.get(value);
              var currentExport = void 0;
              if (typeof _exports7 !== 'undefined') {
                currentExport = _exports7.get(key);
              } else {
                _exports7 = new Map();
                exportList.set(value, _exports7);
              }

              if (typeof currentExport !== 'undefined') {
                currentExport.whereUsed.add(file);
              } else {
                var whereUsed = new Set();
                whereUsed.add(file);
                _exports7.set(key, { whereUsed: whereUsed });
              }
            }
          });

          oldImports.forEach(function (value, key) {
            if (!newImports.has(key)) {
              var imports = oldImportPaths.get(value);
              imports['delete'](key);

              var _exports8 = exportList.get(value);
              if (typeof _exports8 !== 'undefined') {
                var currentExport = _exports8.get(key);
                if (typeof currentExport !== 'undefined') {
                  currentExport.whereUsed['delete'](file);
                }
              }
            }
          });
        }return updateImportUsage;}();

      return {
        'Program:exit': function () {function ProgramExit(node) {
            updateExportUsage(node);
            updateImportUsage(node);
            checkExportPresence(node);
          }return ProgramExit;}(),
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {
            checkUsage(node, IMPORT_DEFAULT_SPECIFIER);
          }return ExportDefaultDeclaration;}(),
        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            node.specifiers.forEach(function (specifier) {
              checkUsage(node, specifier.exported.name || specifier.exported.value);
            });
            forEachDeclarationIdentifier(node.declaration, function (name) {
              checkUsage(node, name);
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11bnVzZWQtbW9kdWxlcy5qcyJdLCJuYW1lcyI6WyJ2YWx1ZXMiLCJPYmplY3QiLCJpbmNsdWRlcyIsIkZ1bmN0aW9uIiwiYmluZCIsInByb3RvdHlwZSIsImNhbGwiLCJBcnJheSIsIkZpbGVFbnVtZXJhdG9yIiwibGlzdEZpbGVzVG9Qcm9jZXNzIiwicmVxdWlyZSIsImUiLCJvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyIsInNyYyIsImV4dGVuc2lvbnMiLCJwYXR0ZXJucyIsInJlZHVjZSIsImNhcnJ5IiwicGF0dGVybiIsImNvbmNhdCIsIm1hcCIsImV4dGVuc2lvbiIsInRlc3QiLCJmcm9tIiwiaXRlcmF0ZUZpbGVzIiwiZmlsZVBhdGgiLCJpZ25vcmVkIiwiZmlsZW5hbWUiLCJFWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTiIsIkVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTiIsIkVYUE9SVF9BTExfREVDTEFSQVRJT04iLCJJTVBPUlRfREVDTEFSQVRJT04iLCJJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiIsIklNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiIsIlZBUklBQkxFX0RFQ0xBUkFUSU9OIiwiRlVOQ1RJT05fREVDTEFSQVRJT04iLCJDTEFTU19ERUNMQVJBVElPTiIsIklERU5USUZJRVIiLCJPQkpFQ1RfUEFUVEVSTiIsIlRTX0lOVEVSRkFDRV9ERUNMQVJBVElPTiIsIlRTX1RZUEVfQUxJQVNfREVDTEFSQVRJT04iLCJUU19FTlVNX0RFQ0xBUkFUSU9OIiwiREVGQVVMVCIsImZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIiLCJkZWNsYXJhdGlvbiIsImNiIiwidHlwZSIsImlkIiwibmFtZSIsImRlY2xhcmF0aW9ucyIsImZvckVhY2giLCJpbXBvcnRMaXN0IiwiTWFwIiwiZXhwb3J0TGlzdCIsInZpc2l0b3JLZXlNYXAiLCJpZ25vcmVkRmlsZXMiLCJTZXQiLCJmaWxlc091dHNpZGVTcmMiLCJpc05vZGVNb2R1bGUiLCJwYXRoIiwicmVzb2x2ZUZpbGVzIiwiaWdub3JlRXhwb3J0cyIsImNvbnRleHQiLCJzZXR0aW5ncyIsInNyY0ZpbGVzIiwic3JjRmlsZUxpc3QiLCJpZ25vcmVkRmlsZXNMaXN0IiwiYWRkIiwiZmlsdGVyIiwicHJlcGFyZUltcG9ydHNBbmRFeHBvcnRzIiwiZXhwb3J0QWxsIiwiZmlsZSIsImV4cG9ydHMiLCJpbXBvcnRzIiwiY3VycmVudEV4cG9ydHMiLCJFeHBvcnRzIiwiZ2V0IiwiZGVwZW5kZW5jaWVzIiwicmVleHBvcnRzIiwibG9jYWxJbXBvcnRMaXN0IiwibmFtZXNwYWNlIiwidmlzaXRvcktleXMiLCJzZXQiLCJjdXJyZW50RXhwb3J0QWxsIiwiZ2V0RGVwZW5kZW5jeSIsImRlcGVuZGVuY3kiLCJ2YWx1ZSIsImtleSIsIndoZXJlVXNlZCIsInJlZXhwb3J0IiwiZ2V0SW1wb3J0IiwibG9jYWxJbXBvcnQiLCJjdXJyZW50VmFsdWUiLCJsb2NhbCIsImltcG9ydGVkU3BlY2lmaWVycyIsInNwZWNpZmllciIsImhhcyIsInZhbCIsImN1cnJlbnRFeHBvcnQiLCJkZXRlcm1pbmVVc2FnZSIsImxpc3RWYWx1ZSIsImxpc3RLZXkiLCJjdXJyZW50SW1wb3J0IiwiZXhwb3J0U3RhdGVtZW50IiwiZ2V0U3JjIiwicHJvY2VzcyIsImN3ZCIsImxhc3RQcmVwYXJlS2V5IiwiZG9QcmVwYXJhdGlvbiIsInByZXBhcmVLZXkiLCJKU09OIiwic3RyaW5naWZ5Iiwic29ydCIsImNsZWFyIiwibmV3TmFtZXNwYWNlSW1wb3J0RXhpc3RzIiwic3BlY2lmaWVycyIsInNvbWUiLCJuZXdEZWZhdWx0SW1wb3J0RXhpc3RzIiwiZmlsZUlzSW5Qa2ciLCJwa2ciLCJiYXNlUGF0aCIsImNoZWNrUGtnRmllbGRTdHJpbmciLCJwa2dGaWVsZCIsImNoZWNrUGtnRmllbGRPYmplY3QiLCJwa2dGaWVsZEZpbGVzIiwiY2hlY2tQa2dGaWVsZCIsImJpbiIsImJyb3dzZXIiLCJtYWluIiwibW9kdWxlIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsIm1pbkl0ZW1zIiwiaXRlbXMiLCJtaW5MZW5ndGgiLCJtaXNzaW5nRXhwb3J0cyIsInVudXNlZEV4cG9ydHMiLCJub3QiLCJhbnlPZiIsInJlcXVpcmVkIiwiY3JlYXRlIiwib3B0aW9ucyIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsImNoZWNrRXhwb3J0UHJlc2VuY2UiLCJub2RlIiwiZXhwb3J0Q291bnQiLCJuYW1lc3BhY2VJbXBvcnRzIiwic2l6ZSIsInJlcG9ydCIsImJvZHkiLCJjaGVja1VzYWdlIiwiZXhwb3J0ZWRWYWx1ZSIsImV4cG9ydHNLZXkiLCJ1cGRhdGVFeHBvcnRVc2FnZSIsIm5ld0V4cG9ydHMiLCJuZXdFeHBvcnRJZGVudGlmaWVycyIsImxlbmd0aCIsImV4cG9ydGVkIiwidXBkYXRlSW1wb3J0VXNhZ2UiLCJvbGRJbXBvcnRQYXRocyIsIm9sZE5hbWVzcGFjZUltcG9ydHMiLCJuZXdOYW1lc3BhY2VJbXBvcnRzIiwib2xkRXhwb3J0QWxsIiwibmV3RXhwb3J0QWxsIiwib2xkRGVmYXVsdEltcG9ydHMiLCJuZXdEZWZhdWx0SW1wb3J0cyIsIm9sZEltcG9ydHMiLCJuZXdJbXBvcnRzIiwicHJvY2Vzc0R5bmFtaWNJbXBvcnQiLCJzb3VyY2UiLCJwIiwiSW1wb3J0RXhwcmVzc2lvbiIsImNoaWxkIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJhc3ROb2RlIiwicmVzb2x2ZWRQYXRoIiwicmF3IiwicmVwbGFjZSIsImltcG9ydGVkIiwiRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBTUEseUM7QUFDQTtBQUNBLHNEO0FBQ0Esa0Q7QUFDQSxxQztBQUNBO0FBQ0EsMkQsZ1ZBWkE7Ozs7a1pBY1FBLE0sR0FBV0MsTSxDQUFYRCxNLENB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O0FBQ0Esa0JBQUksT0FBT2QsU0FBUCxLQUFtQixXQUF2QixFQUFvQztBQUNsQyxvQkFBTTBCLGdCQUFnQjFCLFVBQVFJLEdBQVIsQ0FBWVcsR0FBWixDQUF0QjtBQUNBLG9CQUFJLE9BQU9XLGFBQVAsS0FBeUIsV0FBN0IsRUFBMEM7QUFDeENBLGdDQUFjVixTQUFkLFdBQStCakIsSUFBL0I7QUFDRDtBQUNGO0FBQ0Y7QUFDRixXQWJEO0FBY0QsU0EzUkssNEJBQU47O0FBNlJBLGFBQU87QUFDTCxzQkFESyxvQ0FDVStFLElBRFYsRUFDZ0I7QUFDbkJTLDhCQUFrQlQsSUFBbEI7QUFDQWMsOEJBQWtCZCxJQUFsQjtBQUNBRCxnQ0FBb0JDLElBQXBCO0FBQ0QsV0FMSTtBQU1McUMsZ0NBTkssaURBTW9CckMsSUFOcEIsRUFNMEI7QUFDN0JNLHVCQUFXTixJQUFYLEVBQWlCckgsd0JBQWpCO0FBQ0QsV0FSSTtBQVNMMkosOEJBVEssK0NBU2tCdEMsSUFUbEIsRUFTd0I7QUFDM0JBLGlCQUFLbkMsVUFBTCxDQUFnQmpFLE9BQWhCLENBQXdCLFVBQUM2QyxTQUFELEVBQWU7QUFDckM2RCx5QkFBV04sSUFBWCxFQUFpQnZELFVBQVVvRSxRQUFWLENBQW1CbkgsSUFBbkIsSUFBMkIrQyxVQUFVb0UsUUFBVixDQUFtQjdFLEtBQS9EO0FBQ0QsYUFGRDtBQUdBM0MseUNBQTZCMkcsS0FBSzFHLFdBQWxDLEVBQStDLFVBQUNJLElBQUQsRUFBVTtBQUN2RDRHLHlCQUFXTixJQUFYLEVBQWlCdEcsSUFBakI7QUFDRCxhQUZEO0FBR0QsV0FoQkksbUNBQVA7O0FBa0JELEtBdGlCYyxtQkFBakIiLCJmaWxlIjoibm8tdW51c2VkLW1vZHVsZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgRW5zdXJlcyB0aGF0IG1vZHVsZXMgY29udGFpbiBleHBvcnRzIGFuZC9vciBhbGxcbiAqIG1vZHVsZXMgYXJlIGNvbnN1bWVkIHdpdGhpbiBvdGhlciBtb2R1bGVzLlxuICogQGF1dGhvciBSZW7DqSBGZXJtYW5uXG4gKi9cblxuaW1wb3J0IEV4cG9ydHMsIHsgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUgfSBmcm9tICcuLi9FeHBvcnRNYXAnO1xuaW1wb3J0IHsgZ2V0RmlsZUV4dGVuc2lvbnMgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5pbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IHZpc2l0IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvdmlzaXQnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5pbXBvcnQgeyBkaXJuYW1lLCBqb2luIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhZFBrZ1VwIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVhZFBrZ1VwJztcblxuY29uc3QgeyB2YWx1ZXMgfSA9IE9iamVjdDtcbmNvbnN0IGluY2x1ZGVzID0gRnVuY3Rpb24uYmluZC5iaW5kKEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsKShBcnJheS5wcm90b3R5cGUuaW5jbHVkZXMpO1xuXG5sZXQgRmlsZUVudW1lcmF0b3I7XG5sZXQgbGlzdEZpbGVzVG9Qcm9jZXNzO1xuXG50cnkge1xuICAoeyBGaWxlRW51bWVyYXRvciB9ID0gcmVxdWlyZSgnZXNsaW50L3VzZS1hdC15b3VyLW93bi1yaXNrJykpO1xufSBjYXRjaCAoZSkge1xuICB0cnkge1xuICAgIC8vIGhhcyBiZWVuIG1vdmVkIHRvIGVzbGludC9saWIvY2xpLWVuZ2luZS9maWxlLWVudW1lcmF0b3IgaW4gdmVyc2lvbiA2XG4gICAgKHsgRmlsZUVudW1lcmF0b3IgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvY2xpLWVuZ2luZS9maWxlLWVudW1lcmF0b3InKSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgLy8gZXNsaW50L2xpYi91dGlsL2dsb2ItdXRpbCBoYXMgYmVlbiBtb3ZlZCB0byBlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlscyB3aXRoIHZlcnNpb24gNS4zXG4gICAgICBjb25zdCB7IGxpc3RGaWxlc1RvUHJvY2Vzczogb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzJyk7XG5cbiAgICAgIC8vIFByZXZlbnQgcGFzc2luZyBpbnZhbGlkIG9wdGlvbnMgKGV4dGVuc2lvbnMgYXJyYXkpIHRvIG9sZCB2ZXJzaW9ucyBvZiB0aGUgZnVuY3Rpb24uXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9ibG9iL3Y1LjE2LjAvbGliL3V0aWwvZ2xvYi11dGlscy5qcyNMMTc4LUwyODBcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L2Jsb2IvdjUuMi4wL2xpYi91dGlsL2dsb2ItdXRpbC5qcyNMMTc0LUwyNjlcbiAgICAgIGxpc3RGaWxlc1RvUHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIGV4dGVuc2lvbnMpIHtcbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywge1xuICAgICAgICAgIGV4dGVuc2lvbnMsXG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCB7IGxpc3RGaWxlc1RvUHJvY2Vzczogb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgfSA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWwnKTtcblxuICAgICAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgICAgICBjb25zdCBwYXR0ZXJucyA9IHNyYy5yZWR1Y2UoXG4gICAgICAgICAgKGNhcnJ5LCBwYXR0ZXJuKSA9PiBjYXJyeS5jb25jYXQoXG4gICAgICAgICAgICBleHRlbnNpb25zLm1hcCgoZXh0ZW5zaW9uKSA9PiAoL1xcKlxcKnxcXCpcXC4vKS50ZXN0KHBhdHRlcm4pID8gcGF0dGVybiA6IGAke3BhdHRlcm59LyoqLyoke2V4dGVuc2lvbn1gKSxcbiAgICAgICAgICApLFxuICAgICAgICAgIHNyYyxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MocGF0dGVybnMpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cblxuaWYgKEZpbGVFbnVtZXJhdG9yKSB7XG4gIGxpc3RGaWxlc1RvUHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIGV4dGVuc2lvbnMpIHtcbiAgICBjb25zdCBlID0gbmV3IEZpbGVFbnVtZXJhdG9yKHtcbiAgICAgIGV4dGVuc2lvbnMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gQXJyYXkuZnJvbShlLml0ZXJhdGVGaWxlcyhzcmMpLCAoeyBmaWxlUGF0aCwgaWdub3JlZCB9KSA9PiAoe1xuICAgICAgaWdub3JlZCxcbiAgICAgIGZpbGVuYW1lOiBmaWxlUGF0aCxcbiAgICB9KSk7XG4gIH07XG59XG5cbmNvbnN0IEVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OID0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbic7XG5jb25zdCBFWFBPUlRfTkFNRURfREVDTEFSQVRJT04gPSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbic7XG5jb25zdCBFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OID0gJ0V4cG9ydEFsbERlY2xhcmF0aW9uJztcbmNvbnN0IElNUE9SVF9ERUNMQVJBVElPTiA9ICdJbXBvcnREZWNsYXJhdGlvbic7XG5jb25zdCBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiA9ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInO1xuY29uc3QgSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSID0gJ0ltcG9ydERlZmF1bHRTcGVjaWZpZXInO1xuY29uc3QgVkFSSUFCTEVfREVDTEFSQVRJT04gPSAnVmFyaWFibGVEZWNsYXJhdGlvbic7XG5jb25zdCBGVU5DVElPTl9ERUNMQVJBVElPTiA9ICdGdW5jdGlvbkRlY2xhcmF0aW9uJztcbmNvbnN0IENMQVNTX0RFQ0xBUkFUSU9OID0gJ0NsYXNzRGVjbGFyYXRpb24nO1xuY29uc3QgSURFTlRJRklFUiA9ICdJZGVudGlmaWVyJztcbmNvbnN0IE9CSkVDVF9QQVRURVJOID0gJ09iamVjdFBhdHRlcm4nO1xuY29uc3QgVFNfSU5URVJGQUNFX0RFQ0xBUkFUSU9OID0gJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nO1xuY29uc3QgVFNfVFlQRV9BTElBU19ERUNMQVJBVElPTiA9ICdUU1R5cGVBbGlhc0RlY2xhcmF0aW9uJztcbmNvbnN0IFRTX0VOVU1fREVDTEFSQVRJT04gPSAnVFNFbnVtRGVjbGFyYXRpb24nO1xuY29uc3QgREVGQVVMVCA9ICdkZWZhdWx0JztcblxuZnVuY3Rpb24gZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihkZWNsYXJhdGlvbiwgY2IpIHtcbiAgaWYgKGRlY2xhcmF0aW9uKSB7XG4gICAgaWYgKFxuICAgICAgZGVjbGFyYXRpb24udHlwZSA9PT0gRlVOQ1RJT05fREVDTEFSQVRJT05cbiAgICAgIHx8IGRlY2xhcmF0aW9uLnR5cGUgPT09IENMQVNTX0RFQ0xBUkFUSU9OXG4gICAgICB8fCBkZWNsYXJhdGlvbi50eXBlID09PSBUU19JTlRFUkZBQ0VfREVDTEFSQVRJT05cbiAgICAgIHx8IGRlY2xhcmF0aW9uLnR5cGUgPT09IFRTX1RZUEVfQUxJQVNfREVDTEFSQVRJT05cbiAgICAgIHx8IGRlY2xhcmF0aW9uLnR5cGUgPT09IFRTX0VOVU1fREVDTEFSQVRJT05cbiAgICApIHtcbiAgICAgIGNiKGRlY2xhcmF0aW9uLmlkLm5hbWUpO1xuICAgIH0gZWxzZSBpZiAoZGVjbGFyYXRpb24udHlwZSA9PT0gVkFSSUFCTEVfREVDTEFSQVRJT04pIHtcbiAgICAgIGRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucy5mb3JFYWNoKCh7IGlkIH0pID0+IHtcbiAgICAgICAgaWYgKGlkLnR5cGUgPT09IE9CSkVDVF9QQVRURVJOKSB7XG4gICAgICAgICAgcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoaWQsIChwYXR0ZXJuKSA9PiB7XG4gICAgICAgICAgICBpZiAocGF0dGVybi50eXBlID09PSBJREVOVElGSUVSKSB7XG4gICAgICAgICAgICAgIGNiKHBhdHRlcm4ubmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2IoaWQubmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIExpc3Qgb2YgaW1wb3J0cyBwZXIgZmlsZS5cbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIHR3by1sZXZlbCBNYXAgdG8gYSBTZXQgb2YgaWRlbnRpZmllcnMuIFRoZSB1cHBlci1sZXZlbCBNYXBcbiAqIGtleXMgYXJlIHRoZSBwYXRocyB0byB0aGUgbW9kdWxlcyBjb250YWluaW5nIHRoZSBpbXBvcnRzLCB3aGlsZSB0aGVcbiAqIGxvd2VyLWxldmVsIE1hcCBrZXlzIGFyZSB0aGUgcGF0aHMgdG8gdGhlIGZpbGVzIHdoaWNoIGFyZSBiZWluZyBpbXBvcnRlZFxuICogZnJvbS4gTGFzdGx5LCB0aGUgU2V0IG9mIGlkZW50aWZpZXJzIGNvbnRhaW5zIGVpdGhlciBuYW1lcyBiZWluZyBpbXBvcnRlZFxuICogb3IgYSBzcGVjaWFsIEFTVCBub2RlIG5hbWUgbGlzdGVkIGFib3ZlIChlLmcgSW1wb3J0RGVmYXVsdFNwZWNpZmllcikuXG4gKlxuICogRm9yIGV4YW1wbGUsIGlmIHdlIGhhdmUgYSBmaWxlIG5hbWVkIGZvby5qcyBjb250YWluaW5nOlxuICpcbiAqICAgaW1wb3J0IHsgbzIgfSBmcm9tICcuL2Jhci5qcyc7XG4gKlxuICogVGhlbiB3ZSB3aWxsIGhhdmUgYSBzdHJ1Y3R1cmUgdGhhdCBsb29rcyBsaWtlOlxuICpcbiAqICAgTWFwIHsgJ2Zvby5qcycgPT4gTWFwIHsgJ2Jhci5qcycgPT4gU2V0IHsgJ28yJyB9IH0gfVxuICpcbiAqIEB0eXBlIHtNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBTZXQ8c3RyaW5nPj4+fVxuICovXG5jb25zdCBpbXBvcnRMaXN0ID0gbmV3IE1hcCgpO1xuXG4vKipcbiAqIExpc3Qgb2YgZXhwb3J0cyBwZXIgZmlsZS5cbiAqXG4gKiBSZXByZXNlbnRlZCBieSBhIHR3by1sZXZlbCBNYXAgdG8gYW4gb2JqZWN0IG9mIG1ldGFkYXRhLiBUaGUgdXBwZXItbGV2ZWwgTWFwXG4gKiBrZXlzIGFyZSB0aGUgcGF0aHMgdG8gdGhlIG1vZHVsZXMgY29udGFpbmluZyB0aGUgZXhwb3J0cywgd2hpbGUgdGhlXG4gKiBsb3dlci1sZXZlbCBNYXAga2V5cyBhcmUgdGhlIHNwZWNpZmljIGlkZW50aWZpZXJzIG9yIHNwZWNpYWwgQVNUIG5vZGUgbmFtZXNcbiAqIGJlaW5nIGV4cG9ydGVkLiBUaGUgbGVhZi1sZXZlbCBtZXRhZGF0YSBvYmplY3QgYXQgdGhlIG1vbWVudCBvbmx5IGNvbnRhaW5zIGFcbiAqIGB3aGVyZVVzZWRgIHByb3BlcnR5LCB3aGljaCBjb250YWlucyBhIFNldCBvZiBwYXRocyB0byBtb2R1bGVzIHRoYXQgaW1wb3J0XG4gKiB0aGUgbmFtZS5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgaWYgd2UgaGF2ZSBhIGZpbGUgbmFtZWQgYmFyLmpzIGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBleHBvcnRzOlxuICpcbiAqICAgY29uc3QgbzIgPSAnYmFyJztcbiAqICAgZXhwb3J0IHsgbzIgfTtcbiAqXG4gKiBBbmQgYSBmaWxlIG5hbWVkIGZvby5qcyBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgaW1wb3J0OlxuICpcbiAqICAgaW1wb3J0IHsgbzIgfSBmcm9tICcuL2Jhci5qcyc7XG4gKlxuICogVGhlbiB3ZSB3aWxsIGhhdmUgYSBzdHJ1Y3R1cmUgdGhhdCBsb29rcyBsaWtlOlxuICpcbiAqICAgTWFwIHsgJ2Jhci5qcycgPT4gTWFwIHsgJ28yJyA9PiB7IHdoZXJlVXNlZDogU2V0IHsgJ2Zvby5qcycgfSB9IH0gfVxuICpcbiAqIEB0eXBlIHtNYXA8c3RyaW5nLCBNYXA8c3RyaW5nLCBvYmplY3Q+Pn1cbiAqL1xuY29uc3QgZXhwb3J0TGlzdCA9IG5ldyBNYXAoKTtcblxuY29uc3QgdmlzaXRvcktleU1hcCA9IG5ldyBNYXAoKTtcblxuY29uc3QgaWdub3JlZEZpbGVzID0gbmV3IFNldCgpO1xuY29uc3QgZmlsZXNPdXRzaWRlU3JjID0gbmV3IFNldCgpO1xuXG5jb25zdCBpc05vZGVNb2R1bGUgPSAocGF0aCkgPT4gKC9cXC8obm9kZV9tb2R1bGVzKVxcLy8pLnRlc3QocGF0aCk7XG5cbi8qKlxuICogcmVhZCBhbGwgZmlsZXMgbWF0Y2hpbmcgdGhlIHBhdHRlcm5zIGluIHNyYyBhbmQgaWdub3JlRXhwb3J0c1xuICpcbiAqIHJldHVybiBhbGwgZmlsZXMgbWF0Y2hpbmcgc3JjIHBhdHRlcm4sIHdoaWNoIGFyZSBub3QgbWF0Y2hpbmcgdGhlIGlnbm9yZUV4cG9ydHMgcGF0dGVyblxuICovXG5jb25zdCByZXNvbHZlRmlsZXMgPSAoc3JjLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IGV4dGVuc2lvbnMgPSBBcnJheS5mcm9tKGdldEZpbGVFeHRlbnNpb25zKGNvbnRleHQuc2V0dGluZ3MpKTtcblxuICBjb25zdCBzcmNGaWxlcyA9IG5ldyBTZXQoKTtcbiAgY29uc3Qgc3JjRmlsZUxpc3QgPSBsaXN0RmlsZXNUb1Byb2Nlc3Moc3JjLCBleHRlbnNpb25zKTtcblxuICAvLyBwcmVwYXJlIGxpc3Qgb2YgaWdub3JlZCBmaWxlc1xuICBjb25zdCBpZ25vcmVkRmlsZXNMaXN0ID0gIGxpc3RGaWxlc1RvUHJvY2VzcyhpZ25vcmVFeHBvcnRzLCBleHRlbnNpb25zKTtcbiAgaWdub3JlZEZpbGVzTGlzdC5mb3JFYWNoKCh7IGZpbGVuYW1lIH0pID0+IGlnbm9yZWRGaWxlcy5hZGQoZmlsZW5hbWUpKTtcblxuICAvLyBwcmVwYXJlIGxpc3Qgb2Ygc291cmNlIGZpbGVzLCBkb24ndCBjb25zaWRlciBmaWxlcyBmcm9tIG5vZGVfbW9kdWxlc1xuICBzcmNGaWxlTGlzdC5maWx0ZXIoKHsgZmlsZW5hbWUgfSkgPT4gIWlzTm9kZU1vZHVsZShmaWxlbmFtZSkpLmZvckVhY2goKHsgZmlsZW5hbWUgfSkgPT4ge1xuICAgIHNyY0ZpbGVzLmFkZChmaWxlbmFtZSk7XG4gIH0pO1xuICByZXR1cm4gc3JjRmlsZXM7XG59O1xuXG4vKipcbiAqIHBhcnNlIGFsbCBzb3VyY2UgZmlsZXMgYW5kIGJ1aWxkIHVwIDIgbWFwcyBjb250YWluaW5nIHRoZSBleGlzdGluZyBpbXBvcnRzIGFuZCBleHBvcnRzXG4gKi9cbmNvbnN0IHByZXBhcmVJbXBvcnRzQW5kRXhwb3J0cyA9IChzcmNGaWxlcywgY29udGV4dCkgPT4ge1xuICBjb25zdCBleHBvcnRBbGwgPSBuZXcgTWFwKCk7XG4gIHNyY0ZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICBjb25zdCBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IGltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgY29uc3QgY3VycmVudEV4cG9ydHMgPSBFeHBvcnRzLmdldChmaWxlLCBjb250ZXh0KTtcbiAgICBpZiAoY3VycmVudEV4cG9ydHMpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgZGVwZW5kZW5jaWVzLFxuICAgICAgICByZWV4cG9ydHMsXG4gICAgICAgIGltcG9ydHM6IGxvY2FsSW1wb3J0TGlzdCxcbiAgICAgICAgbmFtZXNwYWNlLFxuICAgICAgICB2aXNpdG9yS2V5cyxcbiAgICAgIH0gPSBjdXJyZW50RXhwb3J0cztcblxuICAgICAgdmlzaXRvcktleU1hcC5zZXQoZmlsZSwgdmlzaXRvcktleXMpO1xuICAgICAgLy8gZGVwZW5kZW5jaWVzID09PSBleHBvcnQgKiBmcm9tXG4gICAgICBjb25zdCBjdXJyZW50RXhwb3J0QWxsID0gbmV3IFNldCgpO1xuICAgICAgZGVwZW5kZW5jaWVzLmZvckVhY2goKGdldERlcGVuZGVuY3kpID0+IHtcbiAgICAgICAgY29uc3QgZGVwZW5kZW5jeSA9IGdldERlcGVuZGVuY3koKTtcbiAgICAgICAgaWYgKGRlcGVuZGVuY3kgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50RXhwb3J0QWxsLmFkZChkZXBlbmRlbmN5LnBhdGgpO1xuICAgICAgfSk7XG4gICAgICBleHBvcnRBbGwuc2V0KGZpbGUsIGN1cnJlbnRFeHBvcnRBbGwpO1xuXG4gICAgICByZWV4cG9ydHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoa2V5ID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSLCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByZWV4cG9ydCA9ICB2YWx1ZS5nZXRJbXBvcnQoKTtcbiAgICAgICAgaWYgKCFyZWV4cG9ydCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbG9jYWxJbXBvcnQgPSBpbXBvcnRzLmdldChyZWV4cG9ydC5wYXRoKTtcbiAgICAgICAgbGV0IGN1cnJlbnRWYWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlLmxvY2FsID09PSBERUZBVUxUKSB7XG4gICAgICAgICAgY3VycmVudFZhbHVlID0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGN1cnJlbnRWYWx1ZSA9IHZhbHVlLmxvY2FsO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgbG9jYWxJbXBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFsuLi5sb2NhbEltcG9ydCwgY3VycmVudFZhbHVlXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9jYWxJbXBvcnQgPSBuZXcgU2V0KFtjdXJyZW50VmFsdWVdKTtcbiAgICAgICAgfVxuICAgICAgICBpbXBvcnRzLnNldChyZWV4cG9ydC5wYXRoLCBsb2NhbEltcG9ydCk7XG4gICAgICB9KTtcblxuICAgICAgbG9jYWxJbXBvcnRMaXN0LmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKGlzTm9kZU1vZHVsZShrZXkpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGxvY2FsSW1wb3J0ID0gaW1wb3J0cy5nZXQoa2V5KSB8fCBuZXcgU2V0KCk7XG4gICAgICAgIHZhbHVlLmRlY2xhcmF0aW9ucy5mb3JFYWNoKCh7IGltcG9ydGVkU3BlY2lmaWVycyB9KSA9PiB7XG4gICAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmZvckVhY2goKHNwZWNpZmllcikgPT4ge1xuICAgICAgICAgICAgbG9jYWxJbXBvcnQuYWRkKHNwZWNpZmllcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpbXBvcnRzLnNldChrZXksIGxvY2FsSW1wb3J0KTtcbiAgICAgIH0pO1xuICAgICAgaW1wb3J0TGlzdC5zZXQoZmlsZSwgaW1wb3J0cyk7XG5cbiAgICAgIC8vIGJ1aWxkIHVwIGV4cG9ydCBsaXN0IG9ubHksIGlmIGZpbGUgaXMgbm90IGlnbm9yZWRcbiAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG5hbWVzcGFjZS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChrZXkgPT09IERFRkFVTFQpIHtcbiAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIsIHsgd2hlcmVVc2VkOiBuZXcgU2V0KCkgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhwb3J0cy5zZXQoa2V5LCB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgZXhwb3J0cy5zZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTiwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICBleHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICBleHBvcnRMaXN0LnNldChmaWxlLCBleHBvcnRzKTtcbiAgfSk7XG4gIGV4cG9ydEFsbC5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgdmFsdWUuZm9yRWFjaCgodmFsKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50RXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbCk7XG4gICAgICBpZiAoY3VycmVudEV4cG9ydHMpIHtcbiAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGN1cnJlbnRFeHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuYWRkKGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiB0cmF2ZXJzZSB0aHJvdWdoIGFsbCBpbXBvcnRzIGFuZCBhZGQgdGhlIHJlc3BlY3RpdmUgcGF0aCB0byB0aGUgd2hlcmVVc2VkLWxpc3RcbiAqIG9mIHRoZSBjb3JyZXNwb25kaW5nIGV4cG9ydFxuICovXG5jb25zdCBkZXRlcm1pbmVVc2FnZSA9ICgpID0+IHtcbiAgaW1wb3J0TGlzdC5mb3JFYWNoKChsaXN0VmFsdWUsIGxpc3RLZXkpID0+IHtcbiAgICBsaXN0VmFsdWUuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgY29uc3QgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KGtleSk7XG4gICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbHVlLmZvckVhY2goKGN1cnJlbnRJbXBvcnQpID0+IHtcbiAgICAgICAgICBsZXQgc3BlY2lmaWVyO1xuICAgICAgICAgIGlmIChjdXJyZW50SW1wb3J0ID09PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUikge1xuICAgICAgICAgICAgc3BlY2lmaWVyID0gSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVI7XG4gICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50SW1wb3J0ID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpIHtcbiAgICAgICAgICAgIHNwZWNpZmllciA9IElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3BlY2lmaWVyID0gY3VycmVudEltcG9ydDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGVvZiBzcGVjaWZpZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnQgPSBleHBvcnRzLmdldChzcGVjaWZpZXIpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRTdGF0ZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgd2hlcmVVc2VkIH0gPSBleHBvcnRTdGF0ZW1lbnQ7XG4gICAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQobGlzdEtleSk7XG4gICAgICAgICAgICAgIGV4cG9ydHMuc2V0KHNwZWNpZmllciwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5jb25zdCBnZXRTcmMgPSAoc3JjKSA9PiB7XG4gIGlmIChzcmMpIHtcbiAgICByZXR1cm4gc3JjO1xuICB9XG4gIHJldHVybiBbcHJvY2Vzcy5jd2QoKV07XG59O1xuXG4vKipcbiAqIHByZXBhcmUgdGhlIGxpc3RzIG9mIGV4aXN0aW5nIGltcG9ydHMgYW5kIGV4cG9ydHMgLSBzaG91bGQgb25seSBiZSBleGVjdXRlZCBvbmNlIGF0XG4gKiB0aGUgc3RhcnQgb2YgYSBuZXcgZXNsaW50IHJ1blxuICovXG5sZXQgc3JjRmlsZXM7XG5sZXQgbGFzdFByZXBhcmVLZXk7XG5jb25zdCBkb1ByZXBhcmF0aW9uID0gKHNyYywgaWdub3JlRXhwb3J0cywgY29udGV4dCkgPT4ge1xuICBjb25zdCBwcmVwYXJlS2V5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgIHNyYzogKHNyYyB8fCBbXSkuc29ydCgpLFxuICAgIGlnbm9yZUV4cG9ydHM6IChpZ25vcmVFeHBvcnRzIHx8IFtdKS5zb3J0KCksXG4gICAgZXh0ZW5zaW9uczogQXJyYXkuZnJvbShnZXRGaWxlRXh0ZW5zaW9ucyhjb250ZXh0LnNldHRpbmdzKSkuc29ydCgpLFxuICB9KTtcbiAgaWYgKHByZXBhcmVLZXkgPT09IGxhc3RQcmVwYXJlS2V5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaW1wb3J0TGlzdC5jbGVhcigpO1xuICBleHBvcnRMaXN0LmNsZWFyKCk7XG4gIGlnbm9yZWRGaWxlcy5jbGVhcigpO1xuICBmaWxlc091dHNpZGVTcmMuY2xlYXIoKTtcblxuICBzcmNGaWxlcyA9IHJlc29sdmVGaWxlcyhnZXRTcmMoc3JjKSwgaWdub3JlRXhwb3J0cywgY29udGV4dCk7XG4gIHByZXBhcmVJbXBvcnRzQW5kRXhwb3J0cyhzcmNGaWxlcywgY29udGV4dCk7XG4gIGRldGVybWluZVVzYWdlKCk7XG4gIGxhc3RQcmVwYXJlS2V5ID0gcHJlcGFyZUtleTtcbn07XG5cbmNvbnN0IG5ld05hbWVzcGFjZUltcG9ydEV4aXN0cyA9IChzcGVjaWZpZXJzKSA9PiBzcGVjaWZpZXJzLnNvbWUoKHsgdHlwZSB9KSA9PiB0eXBlID09PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUik7XG5cbmNvbnN0IG5ld0RlZmF1bHRJbXBvcnRFeGlzdHMgPSAoc3BlY2lmaWVycykgPT4gc3BlY2lmaWVycy5zb21lKCh7IHR5cGUgfSkgPT4gdHlwZSA9PT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcblxuY29uc3QgZmlsZUlzSW5Qa2cgPSAoZmlsZSkgPT4ge1xuICBjb25zdCB7IHBhdGgsIHBrZyB9ID0gcmVhZFBrZ1VwKHsgY3dkOiBmaWxlIH0pO1xuICBjb25zdCBiYXNlUGF0aCA9IGRpcm5hbWUocGF0aCk7XG5cbiAgY29uc3QgY2hlY2tQa2dGaWVsZFN0cmluZyA9IChwa2dGaWVsZCkgPT4ge1xuICAgIGlmIChqb2luKGJhc2VQYXRoLCBwa2dGaWVsZCkgPT09IGZpbGUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBjaGVja1BrZ0ZpZWxkT2JqZWN0ID0gKHBrZ0ZpZWxkKSA9PiB7XG4gICAgY29uc3QgcGtnRmllbGRGaWxlcyA9IHZhbHVlcyhwa2dGaWVsZClcbiAgICAgIC5maWx0ZXIoKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJylcbiAgICAgIC5tYXAoKHZhbHVlKSA9PiBqb2luKGJhc2VQYXRoLCB2YWx1ZSkpO1xuXG4gICAgaWYgKGluY2x1ZGVzKHBrZ0ZpZWxkRmlsZXMsIGZpbGUpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgY2hlY2tQa2dGaWVsZCA9IChwa2dGaWVsZCkgPT4ge1xuICAgIGlmICh0eXBlb2YgcGtnRmllbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gY2hlY2tQa2dGaWVsZFN0cmluZyhwa2dGaWVsZCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBwa2dGaWVsZCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHJldHVybiBjaGVja1BrZ0ZpZWxkT2JqZWN0KHBrZ0ZpZWxkKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHBrZy5wcml2YXRlID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHBrZy5iaW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZChwa2cuYmluKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgaWYgKHBrZy5icm93c2VyKSB7XG4gICAgaWYgKGNoZWNrUGtnRmllbGQocGtnLmJyb3dzZXIpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAocGtnLm1haW4pIHtcbiAgICBpZiAoY2hlY2tQa2dGaWVsZFN0cmluZyhwa2cubWFpbikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBtb2R1bGVzIHdpdGhvdXQgZXhwb3J0cywgb3IgZXhwb3J0cyB3aXRob3V0IG1hdGNoaW5nIGltcG9ydCBpbiBhbm90aGVyIG1vZHVsZS4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduby11bnVzZWQtbW9kdWxlcycpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbe1xuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBzcmM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ2ZpbGVzL3BhdGhzIHRvIGJlIGFuYWx5emVkIChvbmx5IGZvciB1bnVzZWQgZXhwb3J0cyknLFxuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgbWluSXRlbXM6IDEsXG4gICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgbWluTGVuZ3RoOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlnbm9yZUV4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICdmaWxlcy9wYXRocyBmb3Igd2hpY2ggdW51c2VkIGV4cG9ydHMgd2lsbCBub3QgYmUgcmVwb3J0ZWQgKGUuZyBtb2R1bGUgZW50cnkgcG9pbnRzKScsXG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBtaW5JdGVtczogMSxcbiAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICBtaW5MZW5ndGg6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgbWlzc2luZ0V4cG9ydHM6IHtcbiAgICAgICAgICBkZXNjcmlwdGlvbjogJ3JlcG9ydCBtb2R1bGVzIHdpdGhvdXQgYW55IGV4cG9ydHMnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgfSxcbiAgICAgICAgdW51c2VkRXhwb3J0czoge1xuICAgICAgICAgIGRlc2NyaXB0aW9uOiAncmVwb3J0IGV4cG9ydHMgd2l0aG91dCBhbnkgdXNhZ2UnLFxuICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBub3Q6IHtcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIHVudXNlZEV4cG9ydHM6IHsgZW51bTogW2ZhbHNlXSB9LFxuICAgICAgICAgIG1pc3NpbmdFeHBvcnRzOiB7IGVudW06IFtmYWxzZV0gfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBhbnlPZjogW3tcbiAgICAgICAgbm90OiB7XG4gICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgdW51c2VkRXhwb3J0czogeyBlbnVtOiBbdHJ1ZV0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogWydtaXNzaW5nRXhwb3J0cyddLFxuICAgICAgfSwge1xuICAgICAgICBub3Q6IHtcbiAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBtaXNzaW5nRXhwb3J0czogeyBlbnVtOiBbdHJ1ZV0gfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogWyd1bnVzZWRFeHBvcnRzJ10sXG4gICAgICB9LCB7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB1bnVzZWRFeHBvcnRzOiB7IGVudW06IFt0cnVlXSB9LFxuICAgICAgICB9LFxuICAgICAgICByZXF1aXJlZDogWyd1bnVzZWRFeHBvcnRzJ10sXG4gICAgICB9LCB7XG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBtaXNzaW5nRXhwb3J0czogeyBlbnVtOiBbdHJ1ZV0gfSxcbiAgICAgICAgfSxcbiAgICAgICAgcmVxdWlyZWQ6IFsnbWlzc2luZ0V4cG9ydHMnXSxcbiAgICAgIH1dLFxuICAgIH1dLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3Qge1xuICAgICAgc3JjLFxuICAgICAgaWdub3JlRXhwb3J0cyA9IFtdLFxuICAgICAgbWlzc2luZ0V4cG9ydHMsXG4gICAgICB1bnVzZWRFeHBvcnRzLFxuICAgIH0gPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG5cbiAgICBpZiAodW51c2VkRXhwb3J0cykge1xuICAgICAgZG9QcmVwYXJhdGlvbihzcmMsIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcblxuICAgIGNvbnN0IGNoZWNrRXhwb3J0UHJlc2VuY2UgPSAobm9kZSkgPT4ge1xuICAgICAgaWYgKCFtaXNzaW5nRXhwb3J0cykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwb3J0Q291bnQgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcbiAgICAgIGNvbnN0IGV4cG9ydEFsbCA9IGV4cG9ydENvdW50LmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGNvbnN0IG5hbWVzcGFjZUltcG9ydHMgPSBleHBvcnRDb3VudC5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICBleHBvcnRDb3VudC5kZWxldGUoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBleHBvcnRDb3VudC5kZWxldGUoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuICAgICAgaWYgKGV4cG9ydENvdW50LnNpemUgPCAxKSB7XG4gICAgICAgIC8vIG5vZGUuYm9keVswXSA9PT0gJ3VuZGVmaW5lZCcgb25seSBoYXBwZW5zLCBpZiBldmVyeXRoaW5nIGlzIGNvbW1lbnRlZCBvdXQgaW4gdGhlIGZpbGVcbiAgICAgICAgLy8gYmVpbmcgbGludGVkXG4gICAgICAgIGNvbnRleHQucmVwb3J0KG5vZGUuYm9keVswXSA/IG5vZGUuYm9keVswXSA6IG5vZGUsICdObyBleHBvcnRzIGZvdW5kJyk7XG4gICAgICB9XG4gICAgICBleHBvcnRDb3VudC5zZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTiwgZXhwb3J0QWxsKTtcbiAgICAgIGV4cG9ydENvdW50LnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgbmFtZXNwYWNlSW1wb3J0cyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNoZWNrVXNhZ2UgPSAobm9kZSwgZXhwb3J0ZWRWYWx1ZSkgPT4ge1xuICAgICAgaWYgKCF1bnVzZWRFeHBvcnRzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGlnbm9yZWRGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZUlzSW5Qa2coZmlsZSkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoZmlsZXNPdXRzaWRlU3JjLmhhcyhmaWxlKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSBmaWxlIHRvIGJlIGxpbnRlZCBpcyBpbmNsdWRlZCBpbiBzb3VyY2UgZmlsZXNcbiAgICAgIGlmICghc3JjRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKGdldFNyYyhzcmMpLCBpZ25vcmVFeHBvcnRzLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKCFzcmNGaWxlcy5oYXMoZmlsZSkpIHtcbiAgICAgICAgICBmaWxlc091dHNpZGVTcmMuYWRkKGZpbGUpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQoZmlsZSk7XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogZXhwb3J0ICogZnJvbVxuICAgICAgY29uc3QgZXhwb3J0QWxsID0gZXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICBpZiAodHlwZW9mIGV4cG9ydEFsbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZXhwb3J0ZWRWYWx1ZSAhPT0gSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKSB7XG4gICAgICAgIGlmIChleHBvcnRBbGwud2hlcmVVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIHNwZWNpYWwgY2FzZTogbmFtZXNwYWNlIGltcG9ydFxuICAgICAgY29uc3QgbmFtZXNwYWNlSW1wb3J0cyA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlSW1wb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKG5hbWVzcGFjZUltcG9ydHMud2hlcmVVc2VkLnNpemUgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGV4cG9ydHNMaXN0IHdpbGwgYWx3YXlzIG1hcCBhbnkgaW1wb3J0ZWQgdmFsdWUgb2YgJ2RlZmF1bHQnIHRvICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJ1xuICAgICAgY29uc3QgZXhwb3J0c0tleSA9IGV4cG9ydGVkVmFsdWUgPT09IERFRkFVTFQgPyBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgOiBleHBvcnRlZFZhbHVlO1xuXG4gICAgICBjb25zdCBleHBvcnRTdGF0ZW1lbnQgPSBleHBvcnRzLmdldChleHBvcnRzS2V5KTtcblxuICAgICAgY29uc3QgdmFsdWUgPSBleHBvcnRzS2V5ID09PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgPyBERUZBVUxUIDogZXhwb3J0c0tleTtcblxuICAgICAgaWYgKHR5cGVvZiBleHBvcnRTdGF0ZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChleHBvcnRTdGF0ZW1lbnQud2hlcmVVc2VkLnNpemUgPCAxKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgYGV4cG9ydGVkIGRlY2xhcmF0aW9uICcke3ZhbHVlfScgbm90IHVzZWQgd2l0aGluIG90aGVyIG1vZHVsZXNgLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgYGV4cG9ydGVkIGRlY2xhcmF0aW9uICcke3ZhbHVlfScgbm90IHVzZWQgd2l0aGluIG90aGVyIG1vZHVsZXNgLFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBvbmx5IHVzZWZ1bCBmb3IgdG9vbHMgbGlrZSB2c2NvZGUtZXNsaW50XG4gICAgICpcbiAgICAgKiB1cGRhdGUgbGlzdHMgb2YgZXhpc3RpbmcgZXhwb3J0cyBkdXJpbmcgcnVudGltZVxuICAgICAqL1xuICAgIGNvbnN0IHVwZGF0ZUV4cG9ydFVzYWdlID0gKG5vZGUpID0+IHtcbiAgICAgIGlmIChpZ25vcmVkRmlsZXMuaGFzKGZpbGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldChmaWxlKTtcblxuICAgICAgLy8gbmV3IG1vZHVsZSBoYXMgYmVlbiBjcmVhdGVkIGR1cmluZyBydW50aW1lXG4gICAgICAvLyBpbmNsdWRlIGl0IGluIGZ1cnRoZXIgcHJvY2Vzc2luZ1xuICAgICAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBuZXdFeHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgY29uc3QgbmV3RXhwb3J0SWRlbnRpZmllcnMgPSBuZXcgU2V0KCk7XG5cbiAgICAgIG5vZGUuYm9keS5mb3JFYWNoKCh7IHR5cGUsIGRlY2xhcmF0aW9uLCBzcGVjaWZpZXJzIH0pID0+IHtcbiAgICAgICAgaWYgKHR5cGUgPT09IEVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgbmV3RXhwb3J0SWRlbnRpZmllcnMuYWRkKElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGUgPT09IEVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTikge1xuICAgICAgICAgIGlmIChzcGVjaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHNwZWNpZmllcnMuZm9yRWFjaCgoc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgICAgIGlmIChzcGVjaWZpZXIuZXhwb3J0ZWQpIHtcbiAgICAgICAgICAgICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5hZGQoc3BlY2lmaWVyLmV4cG9ydGVkLm5hbWUgfHwgc3BlY2lmaWVyLmV4cG9ydGVkLnZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvckVhY2hEZWNsYXJhdGlvbklkZW50aWZpZXIoZGVjbGFyYXRpb24sIChuYW1lKSA9PiB7XG4gICAgICAgICAgICBuZXdFeHBvcnRJZGVudGlmaWVycy5hZGQobmFtZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLyBvbGQgZXhwb3J0cyBleGlzdCB3aXRoaW4gbGlzdCBvZiBuZXcgZXhwb3J0cyBpZGVudGlmaWVyczogYWRkIHRvIG1hcCBvZiBuZXcgZXhwb3J0c1xuICAgICAgZXhwb3J0cy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiB7XG4gICAgICAgIGlmIChuZXdFeHBvcnRJZGVudGlmaWVycy5oYXMoa2V5KSkge1xuICAgICAgICAgIG5ld0V4cG9ydHMuc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy8gbmV3IGV4cG9ydCBpZGVudGlmaWVycyBhZGRlZDogYWRkIHRvIG1hcCBvZiBuZXcgZXhwb3J0c1xuICAgICAgbmV3RXhwb3J0SWRlbnRpZmllcnMuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmICghZXhwb3J0cy5oYXMoa2V5KSkge1xuICAgICAgICAgIG5ld0V4cG9ydHMuc2V0KGtleSwgeyB3aGVyZVVzZWQ6IG5ldyBTZXQoKSB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIC8vIHByZXNlcnZlIGluZm9ybWF0aW9uIGFib3V0IG5hbWVzcGFjZSBpbXBvcnRzXG4gICAgICBjb25zdCBleHBvcnRBbGwgPSBleHBvcnRzLmdldChFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcbiAgICAgIGxldCBuYW1lc3BhY2VJbXBvcnRzID0gZXhwb3J0cy5nZXQoSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIpO1xuXG4gICAgICBpZiAodHlwZW9mIG5hbWVzcGFjZUltcG9ydHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG5hbWVzcGFjZUltcG9ydHMgPSB7IHdoZXJlVXNlZDogbmV3IFNldCgpIH07XG4gICAgICB9XG5cbiAgICAgIG5ld0V4cG9ydHMuc2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04sIGV4cG9ydEFsbCk7XG4gICAgICBuZXdFeHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgbmFtZXNwYWNlSW1wb3J0cyk7XG4gICAgICBleHBvcnRMaXN0LnNldChmaWxlLCBuZXdFeHBvcnRzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogb25seSB1c2VmdWwgZm9yIHRvb2xzIGxpa2UgdnNjb2RlLWVzbGludFxuICAgICAqXG4gICAgICogdXBkYXRlIGxpc3RzIG9mIGV4aXN0aW5nIGltcG9ydHMgZHVyaW5nIHJ1bnRpbWVcbiAgICAgKi9cbiAgICBjb25zdCB1cGRhdGVJbXBvcnRVc2FnZSA9IChub2RlKSA9PiB7XG4gICAgICBpZiAoIXVudXNlZEV4cG9ydHMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgb2xkSW1wb3J0UGF0aHMgPSBpbXBvcnRMaXN0LmdldChmaWxlKTtcbiAgICAgIGlmICh0eXBlb2Ygb2xkSW1wb3J0UGF0aHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9sZEltcG9ydFBhdGhzID0gbmV3IE1hcCgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvbGROYW1lc3BhY2VJbXBvcnRzID0gbmV3IFNldCgpO1xuICAgICAgY29uc3QgbmV3TmFtZXNwYWNlSW1wb3J0cyA9IG5ldyBTZXQoKTtcblxuICAgICAgY29uc3Qgb2xkRXhwb3J0QWxsID0gbmV3IFNldCgpO1xuICAgICAgY29uc3QgbmV3RXhwb3J0QWxsID0gbmV3IFNldCgpO1xuXG4gICAgICBjb25zdCBvbGREZWZhdWx0SW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgIGNvbnN0IG5ld0RlZmF1bHRJbXBvcnRzID0gbmV3IFNldCgpO1xuXG4gICAgICBjb25zdCBvbGRJbXBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgY29uc3QgbmV3SW1wb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgIG9sZEltcG9ydFBhdGhzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlLmhhcyhFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKSkge1xuICAgICAgICAgIG9sZEV4cG9ydEFsbC5hZGQoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUuaGFzKElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKSkge1xuICAgICAgICAgIG9sZE5hbWVzcGFjZUltcG9ydHMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlLmhhcyhJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpKSB7XG4gICAgICAgICAgb2xkRGVmYXVsdEltcG9ydHMuYWRkKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUuZm9yRWFjaCgodmFsKSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdmFsICE9PSBJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUlxuICAgICAgICAgICAgJiYgdmFsICE9PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG9sZEltcG9ydHMuc2V0KHZhbCwga2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIHByb2Nlc3NEeW5hbWljSW1wb3J0KHNvdXJjZSkge1xuICAgICAgICBpZiAoc291cmNlLnR5cGUgIT09ICdMaXRlcmFsJykge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHAgPSByZXNvbHZlKHNvdXJjZS52YWx1ZSwgY29udGV4dCk7XG4gICAgICAgIGlmIChwID09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBuZXdOYW1lc3BhY2VJbXBvcnRzLmFkZChwKTtcbiAgICAgIH1cblxuICAgICAgdmlzaXQobm9kZSwgdmlzaXRvcktleU1hcC5nZXQoZmlsZSksIHtcbiAgICAgICAgSW1wb3J0RXhwcmVzc2lvbihjaGlsZCkge1xuICAgICAgICAgIHByb2Nlc3NEeW5hbWljSW1wb3J0KGNoaWxkLnNvdXJjZSk7XG4gICAgICAgIH0sXG4gICAgICAgIENhbGxFeHByZXNzaW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmNhbGxlZS50eXBlID09PSAnSW1wb3J0Jykge1xuICAgICAgICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQoY2hpbGQuYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgbm9kZS5ib2R5LmZvckVhY2goKGFzdE5vZGUpID0+IHtcbiAgICAgICAgbGV0IHJlc29sdmVkUGF0aDtcblxuICAgICAgICAvLyBzdXBwb3J0IGZvciBleHBvcnQgeyB2YWx1ZSB9IGZyb20gJ21vZHVsZSdcbiAgICAgICAgaWYgKGFzdE5vZGUudHlwZSA9PT0gRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgaWYgKGFzdE5vZGUuc291cmNlKSB7XG4gICAgICAgICAgICByZXNvbHZlZFBhdGggPSByZXNvbHZlKGFzdE5vZGUuc291cmNlLnJhdy5yZXBsYWNlKC8oJ3xcIikvZywgJycpLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGFzdE5vZGUuc3BlY2lmaWVycy5mb3JFYWNoKChzcGVjaWZpZXIpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IHNwZWNpZmllci5sb2NhbC5uYW1lIHx8IHNwZWNpZmllci5sb2NhbC52YWx1ZTtcbiAgICAgICAgICAgICAgaWYgKG5hbWUgPT09IERFRkFVTFQpIHtcbiAgICAgICAgICAgICAgICBuZXdEZWZhdWx0SW1wb3J0cy5hZGQocmVzb2x2ZWRQYXRoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXdJbXBvcnRzLnNldChuYW1lLCByZXNvbHZlZFBhdGgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXN0Tm9kZS50eXBlID09PSBFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZShhc3ROb2RlLnNvdXJjZS5yYXcucmVwbGFjZSgvKCd8XCIpL2csICcnKSwgY29udGV4dCk7XG4gICAgICAgICAgbmV3RXhwb3J0QWxsLmFkZChyZXNvbHZlZFBhdGgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFzdE5vZGUudHlwZSA9PT0gSU1QT1JUX0RFQ0xBUkFUSU9OKSB7XG4gICAgICAgICAgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZShhc3ROb2RlLnNvdXJjZS5yYXcucmVwbGFjZSgvKCd8XCIpL2csICcnKSwgY29udGV4dCk7XG4gICAgICAgICAgaWYgKCFyZXNvbHZlZFBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoaXNOb2RlTW9kdWxlKHJlc29sdmVkUGF0aCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAobmV3TmFtZXNwYWNlSW1wb3J0RXhpc3RzKGFzdE5vZGUuc3BlY2lmaWVycykpIHtcbiAgICAgICAgICAgIG5ld05hbWVzcGFjZUltcG9ydHMuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG5ld0RlZmF1bHRJbXBvcnRFeGlzdHMoYXN0Tm9kZS5zcGVjaWZpZXJzKSkge1xuICAgICAgICAgICAgbmV3RGVmYXVsdEltcG9ydHMuYWRkKHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYXN0Tm9kZS5zcGVjaWZpZXJzXG4gICAgICAgICAgICAuZmlsdGVyKChzcGVjaWZpZXIpID0+IHNwZWNpZmllci50eXBlICE9PSBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIgJiYgc3BlY2lmaWVyLnR5cGUgIT09IElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKVxuICAgICAgICAgICAgLmZvckVhY2goKHNwZWNpZmllcikgPT4ge1xuICAgICAgICAgICAgICBuZXdJbXBvcnRzLnNldChzcGVjaWZpZXIuaW1wb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuaW1wb3J0ZWQudmFsdWUsIHJlc29sdmVkUGF0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ld0V4cG9ydEFsbC5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIW9sZEV4cG9ydEFsbC5oYXModmFsdWUpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgICAgIG9sZEltcG9ydFBhdGhzLnNldCh2YWx1ZSwgaW1wb3J0cyk7XG5cbiAgICAgICAgICBsZXQgZXhwb3J0cyA9IGV4cG9ydExpc3QuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBsZXQgY3VycmVudEV4cG9ydDtcbiAgICAgICAgICBpZiAodHlwZW9mIGV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0ID0gZXhwb3J0cy5nZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBleHBvcnRMaXN0LnNldCh2YWx1ZSwgZXhwb3J0cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuYWRkKGZpbGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB3aGVyZVVzZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB3aGVyZVVzZWQuYWRkKGZpbGUpO1xuICAgICAgICAgICAgZXhwb3J0cy5zZXQoRVhQT1JUX0FMTF9ERUNMQVJBVElPTiwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkRXhwb3J0QWxsLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghbmV3RXhwb3J0QWxsLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICBjb25zdCBpbXBvcnRzID0gb2xkSW1wb3J0UGF0aHMuZ2V0KHZhbHVlKTtcbiAgICAgICAgICBpbXBvcnRzLmRlbGV0ZShFWFBPUlRfQUxMX0RFQ0xBUkFUSU9OKTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KEVYUE9SVF9BTExfREVDTEFSQVRJT04pO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5kZWxldGUoZmlsZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbmV3RGVmYXVsdEltcG9ydHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCFvbGREZWZhdWx0SW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG4gICAgICAgICAgb2xkSW1wb3J0UGF0aHMuc2V0KHZhbHVlLCBpbXBvcnRzKTtcblxuICAgICAgICAgIGxldCBleHBvcnRzID0gZXhwb3J0TGlzdC5nZXQodmFsdWUpO1xuICAgICAgICAgIGxldCBjdXJyZW50RXhwb3J0O1xuICAgICAgICAgIGlmICh0eXBlb2YgZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQgPSBleHBvcnRzLmdldChJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBleHBvcnRzID0gbmV3IE1hcCgpO1xuICAgICAgICAgICAgZXhwb3J0TGlzdC5zZXQodmFsdWUsIGV4cG9ydHMpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgd2hlcmVVc2VkID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgd2hlcmVVc2VkLmFkZChmaWxlKTtcbiAgICAgICAgICAgIGV4cG9ydHMuc2V0KElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkRGVmYXVsdEltcG9ydHMuZm9yRWFjaCgodmFsdWUpID0+IHtcbiAgICAgICAgaWYgKCFuZXdEZWZhdWx0SW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgY29uc3QgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaW1wb3J0cy5kZWxldGUoSU1QT1JUX0RFRkFVTFRfU1BFQ0lGSUVSKTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9ERUZBVUxUX1NQRUNJRklFUik7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmRlbGV0ZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBuZXdOYW1lc3BhY2VJbXBvcnRzLmZvckVhY2goKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICghb2xkTmFtZXNwYWNlSW1wb3J0cy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgbGV0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGlmICh0eXBlb2YgaW1wb3J0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGltcG9ydHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGltcG9ydHMuYWRkKElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICBvbGRJbXBvcnRQYXRocy5zZXQodmFsdWUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRFeHBvcnQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGV4cG9ydExpc3Quc2V0KHZhbHVlLCBleHBvcnRzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBjdXJyZW50RXhwb3J0LndoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHdoZXJlVXNlZCA9IG5ldyBTZXQoKTtcbiAgICAgICAgICAgIHdoZXJlVXNlZC5hZGQoZmlsZSk7XG4gICAgICAgICAgICBleHBvcnRzLnNldChJTVBPUlRfTkFNRVNQQUNFX1NQRUNJRklFUiwgeyB3aGVyZVVzZWQgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgb2xkTmFtZXNwYWNlSW1wb3J0cy5mb3JFYWNoKCh2YWx1ZSkgPT4ge1xuICAgICAgICBpZiAoIW5ld05hbWVzcGFjZUltcG9ydHMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgIGNvbnN0IGltcG9ydHMgPSBvbGRJbXBvcnRQYXRocy5nZXQodmFsdWUpO1xuICAgICAgICAgIGltcG9ydHMuZGVsZXRlKElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KElNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VycmVudEV4cG9ydCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuZGVsZXRlKGZpbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG5ld0ltcG9ydHMuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xuICAgICAgICBpZiAoIW9sZEltcG9ydHMuaGFzKGtleSkpIHtcbiAgICAgICAgICBsZXQgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBpbXBvcnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaW1wb3J0cyA9IG5ldyBTZXQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW1wb3J0cy5hZGQoa2V5KTtcbiAgICAgICAgICBvbGRJbXBvcnRQYXRocy5zZXQodmFsdWUsIGltcG9ydHMpO1xuXG4gICAgICAgICAgbGV0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRFeHBvcnQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV4cG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgICAgICAgICBleHBvcnRMaXN0LnNldCh2YWx1ZSwgZXhwb3J0cyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBjdXJyZW50RXhwb3J0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY3VycmVudEV4cG9ydC53aGVyZVVzZWQuYWRkKGZpbGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB3aGVyZVVzZWQgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB3aGVyZVVzZWQuYWRkKGZpbGUpO1xuICAgICAgICAgICAgZXhwb3J0cy5zZXQoa2V5LCB7IHdoZXJlVXNlZCB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBvbGRJbXBvcnRzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgICAgaWYgKCFuZXdJbXBvcnRzLmhhcyhrZXkpKSB7XG4gICAgICAgICAgY29uc3QgaW1wb3J0cyA9IG9sZEltcG9ydFBhdGhzLmdldCh2YWx1ZSk7XG4gICAgICAgICAgaW1wb3J0cy5kZWxldGUoa2V5KTtcblxuICAgICAgICAgIGNvbnN0IGV4cG9ydHMgPSBleHBvcnRMaXN0LmdldCh2YWx1ZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudEV4cG9ydCA9IGV4cG9ydHMuZ2V0KGtleSk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRFeHBvcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRFeHBvcnQud2hlcmVVc2VkLmRlbGV0ZShmaWxlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ1Byb2dyYW06ZXhpdCcobm9kZSkge1xuICAgICAgICB1cGRhdGVFeHBvcnRVc2FnZShub2RlKTtcbiAgICAgICAgdXBkYXRlSW1wb3J0VXNhZ2Uobm9kZSk7XG4gICAgICAgIGNoZWNrRXhwb3J0UHJlc2VuY2Uobm9kZSk7XG4gICAgICB9LFxuICAgICAgRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgY2hlY2tVc2FnZShub2RlLCBJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIpO1xuICAgICAgfSxcbiAgICAgIEV4cG9ydE5hbWVkRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBub2RlLnNwZWNpZmllcnMuZm9yRWFjaCgoc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgY2hlY2tVc2FnZShub2RlLCBzcGVjaWZpZXIuZXhwb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuZXhwb3J0ZWQudmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9yRWFjaERlY2xhcmF0aW9uSWRlbnRpZmllcihub2RlLmRlY2xhcmF0aW9uLCAobmFtZSkgPT4ge1xuICAgICAgICAgIGNoZWNrVXNhZ2Uobm9kZSwgbmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==