'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();exports.




































































































































































































































































































































































































































































































































































































































































































































































recursivePatternCapture = recursivePatternCapture;var _fs = require('fs');var _fs2 = _interopRequireDefault(_fs);var _path = require('path');var _doctrine = require('doctrine');var _doctrine2 = _interopRequireDefault(_doctrine);var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);var _eslint = require('eslint');var _parse = require('eslint-module-utils/parse');var _parse2 = _interopRequireDefault(_parse);var _visit = require('eslint-module-utils/visit');var _visit2 = _interopRequireDefault(_visit);var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);var _ignore = require('eslint-module-utils/ignore');var _ignore2 = _interopRequireDefault(_ignore);var _hash = require('eslint-module-utils/hash');var _unambiguous = require('eslint-module-utils/unambiguous');var unambiguous = _interopRequireWildcard(_unambiguous);var _getTsconfig = require('get-tsconfig');function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;} else {var newObj = {};if (obj != null) {for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];}}newObj['default'] = obj;return newObj;}}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var includes = Function.bind.bind(Function.prototype.call)(Array.prototype.includes);var log = (0, _debug2['default'])('eslint-plugin-import:ExportMap');var exportCache = new Map();var tsconfigCache = new Map();var ExportMap = function () {function ExportMap(path) {_classCallCheck(this, ExportMap);this.path = path;this.namespace = new Map(); // todo: restructure to key on path, value is resolver + map of names
    this.reexports = new Map(); /**
                                 * star-exports
                                 * @type {Set} of () => ExportMap
                                 */this.dependencies = new Set(); /**
                                                                   * dependencies of this module that are not explicitly re-exported
                                                                   * @type {Map} from path = () => ExportMap
                                                                   */this.imports = new Map();this.errors = []; /**
                                                                                                                 * type {'ambiguous' | 'Module' | 'Script'}
                                                                                                                 */this.parseGoal = 'ambiguous';}_createClass(ExportMap, [{ key: 'has', /**
                                                                                                                                                                                         * Note that this does not check explicitly re-exported names for existence
                                                                                                                                                                                         * in the base namespace, but it will expand all `export * from '...'` exports
                                                                                                                                                                                         * if not found in the explicit namespace.
                                                                                                                                                                                         * @param  {string}  name
                                                                                                                                                                                         * @return {Boolean} true if `name` is exported by this module.
                                                                                                                                                                                         */value: function () {function has(name) {if (this.namespace.has(name)) {return true;}if (this.reexports.has(name)) {return true;} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {for (var _iterator = this.dependencies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var dep = _step.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) {continue;}if (innerMap.has(name)) {return true;}}} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}}return false;}return has;}() /**
                                                                                                                                                                                                                                                                                                                                     * ensure that imported name fully resolves.
                                                                                                                                                                                                                                                                                                                                     * @param  {string} name
                                                                                                                                                                                                                                                                                                                                     * @return {{ found: boolean, path: ExportMap[] }}
                                                                                                                                                                                                                                                                                                                                     */ }, { key: 'hasDeep', value: function () {function hasDeep(name) {if (this.namespace.has(name)) {return { found: true, path: [this] };}if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) {return { found: true, path: [this] };} // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) {return { found: false, path: [this] };}var deep = imported.hasDeep(reexports.local);deep.path.unshift(this);return deep;} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {for (var _iterator2 = this.dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var dep = _step2.value;var innerMap = dep();if (innerMap == null) {return { found: true, path: [this] };} // todo: report as unresolved?
              if (!innerMap) {continue;} // safeguard against cycles
              if (innerMap.path === this.path) {continue;}var innerValue = innerMap.hasDeep(name);if (innerValue.found) {innerValue.path.unshift(this);return innerValue;}}} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}}return { found: false, path: [this] };}return hasDeep;}() }, { key: 'get', value: function () {function get(name) {if (this.namespace.has(name)) {return this.namespace.get(name);}if (this.reexports.has(name)) {var reexports = this.reexports.get(name);var imported = reexports.getImport(); // if import is ignored, return explicit 'null'
          if (imported == null) {return null;} // safeguard against cycles, only if name matches
          if (imported.path === this.path && reexports.local === name) {return undefined;}return imported.get(reexports.local);} // default exports must be explicitly re-exported (#328)
        if (name !== 'default') {var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = this.dependencies[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var dep = _step3.value;var innerMap = dep(); // todo: report as unresolved?
              if (!innerMap) {continue;} // safeguard against cycles
              if (innerMap.path === this.path) {continue;}var innerValue = innerMap.get(name);if (innerValue !== undefined) {return innerValue;}}} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}}return undefined;}return get;}() }, { key: 'forEach', value: function () {function forEach(callback, thisArg) {var _this = this;this.namespace.forEach(function (v, n) {callback.call(thisArg, v, n, _this);});this.reexports.forEach(function (reexports, name) {var reexported = reexports.getImport(); // can't look up meta for ignored re-exports (#348)
          callback.call(thisArg, reexported && reexported.get(reexports.local), name, _this);});this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) {return;}d.forEach(function (v, n) {if (n !== 'default') {callback.call(thisArg, v, n, _this);}});});}return forEach;}() // todo: keys, values, entries?
  }, { key: 'reportErrors', value: function () {function reportErrors(context, declaration) {var msg = this.errors.map(function (e) {return String(e.message) + ' (' + String(e.lineNumber) + ':' + String(e.column) + ')';}).join(', ');context.report({ node: declaration.source, message: 'Parse errors in imported module \'' + String(declaration.source.value) + '\': ' + String(msg) });}return reportErrors;}() }, { key: 'hasDefault', get: function () {function get() {return this.get('default') != null;}return get;}() // stronger than this.has
  }, { key: 'size', get: function () {function get() {var size = this.namespace.size + this.reexports.size;this.dependencies.forEach(function (dep) {var d = dep(); // CJS / ignored dependencies won't exist (#717)
          if (d == null) {return;}size += d.size;});return size;}return get;}() }]);return ExportMap;}(); /**
                                                                                                           * parse docs from the first node that has leading comments
                                                                                                           */exports['default'] = ExportMap;function captureDoc(source, docStyleParsers) {var metadata = {}; // 'some' short-circuits on first 'true'
  for (var _len = arguments.length, nodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {nodes[_key - 2] = arguments[_key];}nodes.some(function (n) {try {var leadingComments = void 0; // n.leadingComments is legacy `attachComments` behavior
      if ('leadingComments' in n) {leadingComments = n.leadingComments;} else if (n.range) {leadingComments = source.getCommentsBefore(n);}if (!leadingComments || leadingComments.length === 0) {return false;}for (var name in docStyleParsers) {var doc = docStyleParsers[name](leadingComments);if (doc) {metadata.doc = doc;}}return true;} catch (err) {return false;}});return metadata;}var availableDocStyleParsers = { jsdoc: captureJsDoc, tomdoc: captureTomDoc }; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * parse JSDoc from leading comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @param {object[]} comments
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @return {{ doc: object }}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */function captureJsDoc(comments) {var doc = void 0; // capture XSDoc
  comments.forEach(function (comment) {// skip non-block comments
    if (comment.type !== 'Block') {return;}try {doc = _doctrine2['default'].parse(comment.value, { unwrap: true });} catch (err) {/* don't care, for now? maybe add to `errors?` */}});return doc;} /**
                                                                                                                                                                                                      * parse TomDoc section from comments
                                                                                                                                                                                                      */function captureTomDoc(comments) {// collect lines up to first paragraph break
  var lines = [];for (var i = 0; i < comments.length; i++) {var comment = comments[i];if (comment.value.match(/^\s*$/)) {break;}lines.push(comment.value.trim());} // return doctrine-like object
  var statusMatch = lines.join(' ').match(/^(Public|Internal|Deprecated):\s*(.+)/);if (statusMatch) {return { description: statusMatch[2], tags: [{ title: statusMatch[1].toLowerCase(), description: statusMatch[2] }] };}}var supportedImportTypes = new Set(['ImportDefaultSpecifier', 'ImportNamespaceSpecifier']);ExportMap.get = function (source, context) {var path = (0, _resolve2['default'])(source, context);if (path == null) {return null;}return ExportMap['for'](childContext(path, context));};ExportMap['for'] = function (context) {var path = context.path;var cacheKey = context.cacheKey || (0, _hash.hashObject)(context).digest('hex');var exportMap = exportCache.get(cacheKey); // return cached ignore
  if (exportMap === null) {return null;}var stats = _fs2['default'].statSync(path);if (exportMap != null) {// date equality check
    if (exportMap.mtime - stats.mtime === 0) {return exportMap;} // future: check content equality?
  } // check valid extensions first
  if (!(0, _ignore.hasValidExtension)(path, context)) {exportCache.set(cacheKey, null);return null;} // check for and cache ignore
  if ((0, _ignore2['default'])(path, context)) {log('ignored path due to ignore settings:', path);exportCache.set(cacheKey, null);return null;}var content = _fs2['default'].readFileSync(path, { encoding: 'utf8' }); // check for and cache unambiguous modules
  if (!unambiguous.test(content)) {log('ignored path due to unambiguous regex:', path);exportCache.set(cacheKey, null);return null;}log('cache miss', cacheKey, 'for path', path);exportMap = ExportMap.parse(path, content, context); // ambiguous modules return null
  if (exportMap == null) {log('ignored path due to ambiguous parse:', path);exportCache.set(cacheKey, null);return null;}exportMap.mtime = stats.mtime;exportCache.set(cacheKey, exportMap);return exportMap;};ExportMap.parse = function (path, content, context) {var m = new ExportMap(path);var isEsModuleInteropTrue = isEsModuleInterop();var ast = void 0;var visitorKeys = void 0;try {var result = (0, _parse2['default'])(path, content, context);ast = result.ast;visitorKeys = result.visitorKeys;} catch (err) {m.errors.push(err);return m; // can't continue
  }m.visitorKeys = visitorKeys;var hasDynamicImports = false;function processDynamicImport(source) {hasDynamicImports = true;if (source.type !== 'Literal') {return null;}var p = remotePath(source.value);if (p == null) {return null;}var importedSpecifiers = new Set();importedSpecifiers.add('ImportNamespaceSpecifier');var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([{ source: { // capturing actual node reference holds full AST in memory!
          value: source.value, loc: source.loc }, importedSpecifiers: importedSpecifiers, dynamic: true }]) });}(0, _visit2['default'])(ast, visitorKeys, { ImportExpression: function () {function ImportExpression(node) {processDynamicImport(node.source);}return ImportExpression;}(), CallExpression: function () {function CallExpression(node) {if (node.callee.type === 'Import') {processDynamicImport(node.arguments[0]);}}return CallExpression;}() });var unambiguouslyESM = unambiguous.isModule(ast);if (!unambiguouslyESM && !hasDynamicImports) {return null;}var docstyle = context.settings && context.settings['import/docstyle'] || ['jsdoc'];var docStyleParsers = {};docstyle.forEach(function (style) {docStyleParsers[style] = availableDocStyleParsers[style];}); // attempt to collect module doc
  if (ast.comments) {ast.comments.some(function (c) {if (c.type !== 'Block') {return false;}try {var doc = _doctrine2['default'].parse(c.value, { unwrap: true });if (doc.tags.some(function (t) {return t.title === 'module';})) {m.doc = doc;return true;}} catch (err) {/* ignore */}return false;});}var namespaces = new Map();function remotePath(value) {return _resolve2['default'].relative(value, path, context.settings);}function resolveImport(value) {var rp = remotePath(value);if (rp == null) {return null;}return ExportMap['for'](childContext(rp, context));}function getNamespace(identifier) {if (!namespaces.has(identifier.name)) {return;}return function () {return resolveImport(namespaces.get(identifier.name));};}function addNamespace(object, identifier) {var nsfn = getNamespace(identifier);if (nsfn) {Object.defineProperty(object, 'namespace', { get: nsfn });}return object;}function processSpecifier(s, n, m) {var nsource = n.source && n.source.value;var exportMeta = {};var local = void 0;switch (s.type) {case 'ExportDefaultSpecifier':if (!nsource) {return;}local = 'default';break;case 'ExportNamespaceSpecifier':m.namespace.set(s.exported.name, Object.defineProperty(exportMeta, 'namespace', { get: function () {function get() {return resolveImport(nsource);}return get;}() }));return;case 'ExportAllDeclaration':m.namespace.set(s.exported.name || s.exported.value, addNamespace(exportMeta, s.source.value));return;case 'ExportSpecifier':if (!n.source) {m.namespace.set(s.exported.name || s.exported.value, addNamespace(exportMeta, s.local));return;} // else falls through
      default:local = s.local.name;break;} // todo: JSDoc
    m.reexports.set(s.exported.name, { local: local, getImport: function () {function getImport() {return resolveImport(nsource);}return getImport;}() });}function captureDependencyWithSpecifiers(n) {// import type { Foo } (TS and Flow); import typeof { Foo } (Flow)
    var declarationIsType = n.importKind === 'type' || n.importKind === 'typeof'; // import './foo' or import {} from './foo' (both 0 specifiers) is a side effect and
    // shouldn't be considered to be just importing types
    var specifiersOnlyImportingTypes = n.specifiers.length > 0;var importedSpecifiers = new Set();n.specifiers.forEach(function (specifier) {if (specifier.type === 'ImportSpecifier') {importedSpecifiers.add(specifier.imported.name || specifier.imported.value);} else if (supportedImportTypes.has(specifier.type)) {importedSpecifiers.add(specifier.type);} // import { type Foo } (Flow); import { typeof Foo } (Flow)
      specifiersOnlyImportingTypes = specifiersOnlyImportingTypes && (specifier.importKind === 'type' || specifier.importKind === 'typeof');});captureDependency(n, declarationIsType || specifiersOnlyImportingTypes, importedSpecifiers);}function captureDependency(_ref, isOnlyImportingTypes) {var source = _ref.source;var importedSpecifiers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();if (source == null) {return null;}var p = remotePath(source.value);if (p == null) {return null;}var declarationMetadata = { // capturing actual node reference holds full AST in memory!
      source: { value: source.value, loc: source.loc }, isOnlyImportingTypes: isOnlyImportingTypes, importedSpecifiers: importedSpecifiers };var existing = m.imports.get(p);if (existing != null) {existing.declarations.add(declarationMetadata);return existing.getter;}var getter = thunkFor(p, context);m.imports.set(p, { getter: getter, declarations: new Set([declarationMetadata]) });return getter;}var source = makeSourceCode(content, ast);function isEsModuleInterop() {var parserOptions = context.parserOptions || {};var tsconfigRootDir = parserOptions.tsconfigRootDir;var project = parserOptions.project;var cacheKey = (0, _hash.hashObject)({ tsconfigRootDir: tsconfigRootDir, project: project }).digest('hex');var tsConfig = tsconfigCache.get(cacheKey);if (typeof tsConfig === 'undefined') {tsconfigRootDir = tsconfigRootDir || process.cwd();var tsconfigResult = void 0;if (project) {var projects = Array.isArray(project) ? project : [project];var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = projects[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var _project = _step4.value;tsconfigResult = (0, _getTsconfig.getTsconfig)((0, _path.resolve)(tsconfigRootDir, _project));if (tsconfigResult) {break;}}} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}} else {tsconfigResult = (0, _getTsconfig.getTsconfig)(tsconfigRootDir);}tsConfig = tsconfigResult && tsconfigResult.config || null;tsconfigCache.set(cacheKey, tsConfig);}return tsConfig && tsConfig.compilerOptions ? tsConfig.compilerOptions.esModuleInterop : false;}ast.body.forEach(function (n) {if (n.type === 'ExportDefaultDeclaration') {var exportMeta = captureDoc(source, docStyleParsers, n);if (n.declaration.type === 'Identifier') {addNamespace(exportMeta, n.declaration);}m.namespace.set('default', exportMeta);return;}if (n.type === 'ExportAllDeclaration') {var getter = captureDependency(n, n.exportKind === 'type');if (getter) {m.dependencies.add(getter);}if (n.exported) {processSpecifier(n, n.exported, m);}return;} // capture namespaces in case of later export
    if (n.type === 'ImportDeclaration') {captureDependencyWithSpecifiers(n);var ns = n.specifiers.find(function (s) {return s.type === 'ImportNamespaceSpecifier';});if (ns) {namespaces.set(ns.local.name, n.source.value);}return;}if (n.type === 'ExportNamedDeclaration') {captureDependencyWithSpecifiers(n); // capture declaration
      if (n.declaration != null) {switch (n.declaration.type) {case 'FunctionDeclaration':case 'ClassDeclaration':case 'TypeAlias': // flowtype with babel-eslint parser
          case 'InterfaceDeclaration':case 'DeclareFunction':case 'TSDeclareFunction':case 'TSEnumDeclaration':case 'TSTypeAliasDeclaration':case 'TSInterfaceDeclaration':case 'TSAbstractClassDeclaration':case 'TSModuleDeclaration':m.namespace.set(n.declaration.id.name, captureDoc(source, docStyleParsers, n));break;case 'VariableDeclaration':n.declaration.declarations.forEach(function (d) {recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, d, n));});});break;default:}}n.specifiers.forEach(function (s) {return processSpecifier(s, n, m);});}var exports = ['TSExportAssignment'];if (isEsModuleInteropTrue) {exports.push('TSNamespaceExportDeclaration');} // This doesn't declare anything, but changes what's being exported.
    if (includes(exports, n.type)) {var exportedName = n.type === 'TSNamespaceExportDeclaration' ? (n.id || n.name).name : n.expression && n.expression.name || n.expression.id && n.expression.id.name || null;var declTypes = ['VariableDeclaration', 'ClassDeclaration', 'TSDeclareFunction', 'TSEnumDeclaration', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSAbstractClassDeclaration', 'TSModuleDeclaration'];var exportedDecls = ast.body.filter(function (_ref2) {var type = _ref2.type,id = _ref2.id,declarations = _ref2.declarations;return includes(declTypes, type) && (id && id.name === exportedName || declarations && declarations.find(function (d) {return d.id.name === exportedName;}));});if (exportedDecls.length === 0) {// Export is not referencing any local declaration, must be re-exporting
        m.namespace.set('default', captureDoc(source, docStyleParsers, n));return;}if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
      && !m.namespace.has('default') // and default isn't added already
      ) {m.namespace.set('default', {}); // add default export
        }exportedDecls.forEach(function (decl) {if (decl.type === 'TSModuleDeclaration') {if (decl.body && decl.body.type === 'TSModuleDeclaration') {m.namespace.set(decl.body.id.name, captureDoc(source, docStyleParsers, decl.body));} else if (decl.body && decl.body.body) {decl.body.body.forEach(function (moduleBlockNode) {// Export-assignment exports all members in the namespace,
              // explicitly exported or not.
              var namespaceDecl = moduleBlockNode.type === 'ExportNamedDeclaration' ? moduleBlockNode.declaration : moduleBlockNode;if (!namespaceDecl) {// TypeScript can check this for us; we needn't
              } else if (namespaceDecl.type === 'VariableDeclaration') {namespaceDecl.declarations.forEach(function (d) {return recursivePatternCapture(d.id, function (id) {return m.namespace.set(id.name, captureDoc(source, docStyleParsers, decl, namespaceDecl, moduleBlockNode));});});} else {m.namespace.set(namespaceDecl.id.name, captureDoc(source, docStyleParsers, moduleBlockNode));}});}} else {// Export as default
          m.namespace.set('default', captureDoc(source, docStyleParsers, decl));}});}});if (isEsModuleInteropTrue // esModuleInterop is on in tsconfig
  && m.namespace.size > 0 // anything is exported
  && !m.namespace.has('default') // and default isn't added already
  ) {m.namespace.set('default', {}); // add default export
    }if (unambiguouslyESM) {m.parseGoal = 'Module';}return m;}; /**
                                                                 * The creation of this closure is isolated from other scopes
                                                                 * to avoid over-retention of unrelated variables, which has
                                                                 * caused memory leaks. See #1266.
                                                                 */function thunkFor(p, context) {return function () {return ExportMap['for'](childContext(p, context));};} /**
                                                                                                                                                                             * Traverse a pattern/identifier node, calling 'callback'
                                                                                                                                                                             * for each leaf identifier.
                                                                                                                                                                             * @param  {node}   pattern
                                                                                                                                                                             * @param  {Function} callback
                                                                                                                                                                             * @return {void}
                                                                                                                                                                             */function recursivePatternCapture(pattern, callback) {switch (pattern.type) {case 'Identifier': // base case
      callback(pattern);break;case 'ObjectPattern':pattern.properties.forEach(function (p) {if (p.type === 'ExperimentalRestProperty' || p.type === 'RestElement') {callback(p.argument);return;}recursivePatternCapture(p.value, callback);});break;case 'ArrayPattern':pattern.elements.forEach(function (element) {if (element == null) {return;}if (element.type === 'ExperimentalRestProperty' || element.type === 'RestElement') {callback(element.argument);return;}recursivePatternCapture(element, callback);});break;case 'AssignmentPattern':callback(pattern.left);break;default:}}var parserOptionsHash = '';var prevParserOptions = '';var settingsHash = '';var prevSettings = ''; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * don't hold full context object in memory, just grab what we need.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * also calculate a cacheKey, where parts of the cacheKey hash are memoized
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */function childContext(path, context) {var settings = context.settings,parserOptions = context.parserOptions,parserPath = context.parserPath;if (JSON.stringify(settings) !== prevSettings) {settingsHash = (0, _hash.hashObject)({ settings: settings }).digest('hex');prevSettings = JSON.stringify(settings);}if (JSON.stringify(parserOptions) !== prevParserOptions) {parserOptionsHash = (0, _hash.hashObject)({ parserOptions: parserOptions }).digest('hex');prevParserOptions = JSON.stringify(parserOptions);}return { cacheKey: String(parserPath) + parserOptionsHash + settingsHash + String(path), settings: settings, parserOptions: parserOptions, parserPath: parserPath, path: path };} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * sometimes legacy support isn't _that_ hard... right?
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */function makeSourceCode(text, ast) {if (_eslint.SourceCode.length > 1) {// ESLint 3
    return new _eslint.SourceCode(text, ast);} else {// ESLint 4, 5
    return new _eslint.SourceCode({ text: text, ast: ast });}}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9FeHBvcnRNYXAuanMiXSwibmFtZXMiOlsicmVjdXJzaXZlUGF0dGVybkNhcHR1cmUiLCJ1bmFtYmlndW91cyIsImluY2x1ZGVzIiwiRnVuY3Rpb24iLCJiaW5kIiwicHJvdG90eXBlIiwiY2FsbCIsIkFycmF5IiwibG9nIiwiZXhwb3J0Q2FjaGUiLCJNYXAiLCJ0c2NvbmZpZ0NhY2hlIiwiRXhwb3J0TWFwIiwicGF0aCIsIm5hbWVzcGFjZSIsInJlZXhwb3J0cyIsImRlcGVuZGVuY2llcyIsIlNldCIsImltcG9ydHMiLCJlcnJvcnMiLCJwYXJzZUdvYWwiLCJuYW1lIiwiaGFzIiwiZGVwIiwiaW5uZXJNYXAiLCJmb3VuZCIsImdldCIsImltcG9ydGVkIiwiZ2V0SW1wb3J0IiwibG9jYWwiLCJkZWVwIiwiaGFzRGVlcCIsInVuc2hpZnQiLCJpbm5lclZhbHVlIiwidW5kZWZpbmVkIiwiY2FsbGJhY2siLCJ0aGlzQXJnIiwiZm9yRWFjaCIsInYiLCJuIiwicmVleHBvcnRlZCIsImQiLCJjb250ZXh0IiwiZGVjbGFyYXRpb24iLCJtc2ciLCJtYXAiLCJlIiwibWVzc2FnZSIsImxpbmVOdW1iZXIiLCJjb2x1bW4iLCJqb2luIiwicmVwb3J0Iiwibm9kZSIsInNvdXJjZSIsInZhbHVlIiwic2l6ZSIsImNhcHR1cmVEb2MiLCJkb2NTdHlsZVBhcnNlcnMiLCJtZXRhZGF0YSIsIm5vZGVzIiwic29tZSIsImxlYWRpbmdDb21tZW50cyIsInJhbmdlIiwiZ2V0Q29tbWVudHNCZWZvcmUiLCJsZW5ndGgiLCJkb2MiLCJlcnIiLCJhdmFpbGFibGVEb2NTdHlsZVBhcnNlcnMiLCJqc2RvYyIsImNhcHR1cmVKc0RvYyIsInRvbWRvYyIsImNhcHR1cmVUb21Eb2MiLCJjb21tZW50cyIsImNvbW1lbnQiLCJ0eXBlIiwiZG9jdHJpbmUiLCJwYXJzZSIsInVud3JhcCIsImxpbmVzIiwiaSIsIm1hdGNoIiwicHVzaCIsInRyaW0iLCJzdGF0dXNNYXRjaCIsImRlc2NyaXB0aW9uIiwidGFncyIsInRpdGxlIiwidG9Mb3dlckNhc2UiLCJzdXBwb3J0ZWRJbXBvcnRUeXBlcyIsImNoaWxkQ29udGV4dCIsImNhY2hlS2V5IiwiZGlnZXN0IiwiZXhwb3J0TWFwIiwic3RhdHMiLCJmcyIsInN0YXRTeW5jIiwibXRpbWUiLCJzZXQiLCJjb250ZW50IiwicmVhZEZpbGVTeW5jIiwiZW5jb2RpbmciLCJ0ZXN0IiwibSIsImlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSIsImlzRXNNb2R1bGVJbnRlcm9wIiwiYXN0IiwidmlzaXRvcktleXMiLCJyZXN1bHQiLCJoYXNEeW5hbWljSW1wb3J0cyIsInByb2Nlc3NEeW5hbWljSW1wb3J0IiwicCIsInJlbW90ZVBhdGgiLCJpbXBvcnRlZFNwZWNpZmllcnMiLCJhZGQiLCJnZXR0ZXIiLCJ0aHVua0ZvciIsImRlY2xhcmF0aW9ucyIsImxvYyIsImR5bmFtaWMiLCJJbXBvcnRFeHByZXNzaW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJjYWxsZWUiLCJhcmd1bWVudHMiLCJ1bmFtYmlndW91c2x5RVNNIiwiaXNNb2R1bGUiLCJkb2NzdHlsZSIsInNldHRpbmdzIiwic3R5bGUiLCJjIiwidCIsIm5hbWVzcGFjZXMiLCJyZXNvbHZlIiwicmVsYXRpdmUiLCJyZXNvbHZlSW1wb3J0IiwicnAiLCJnZXROYW1lc3BhY2UiLCJpZGVudGlmaWVyIiwiYWRkTmFtZXNwYWNlIiwib2JqZWN0IiwibnNmbiIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwicHJvY2Vzc1NwZWNpZmllciIsInMiLCJuc291cmNlIiwiZXhwb3J0TWV0YSIsImV4cG9ydGVkIiwiY2FwdHVyZURlcGVuZGVuY3lXaXRoU3BlY2lmaWVycyIsImRlY2xhcmF0aW9uSXNUeXBlIiwiaW1wb3J0S2luZCIsInNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXMiLCJzcGVjaWZpZXJzIiwic3BlY2lmaWVyIiwiY2FwdHVyZURlcGVuZGVuY3kiLCJpc09ubHlJbXBvcnRpbmdUeXBlcyIsImRlY2xhcmF0aW9uTWV0YWRhdGEiLCJleGlzdGluZyIsIm1ha2VTb3VyY2VDb2RlIiwicGFyc2VyT3B0aW9ucyIsInRzY29uZmlnUm9vdERpciIsInByb2plY3QiLCJ0c0NvbmZpZyIsInByb2Nlc3MiLCJjd2QiLCJ0c2NvbmZpZ1Jlc3VsdCIsInByb2plY3RzIiwiaXNBcnJheSIsImNvbmZpZyIsImNvbXBpbGVyT3B0aW9ucyIsImVzTW9kdWxlSW50ZXJvcCIsImJvZHkiLCJleHBvcnRLaW5kIiwibnMiLCJmaW5kIiwiaWQiLCJleHBvcnRzIiwiZXhwb3J0ZWROYW1lIiwiZXhwcmVzc2lvbiIsImRlY2xUeXBlcyIsImV4cG9ydGVkRGVjbHMiLCJmaWx0ZXIiLCJkZWNsIiwibW9kdWxlQmxvY2tOb2RlIiwibmFtZXNwYWNlRGVjbCIsInBhdHRlcm4iLCJwcm9wZXJ0aWVzIiwiYXJndW1lbnQiLCJlbGVtZW50cyIsImVsZW1lbnQiLCJsZWZ0IiwicGFyc2VyT3B0aW9uc0hhc2giLCJwcmV2UGFyc2VyT3B0aW9ucyIsInNldHRpbmdzSGFzaCIsInByZXZTZXR0aW5ncyIsInBhcnNlclBhdGgiLCJKU09OIiwic3RyaW5naWZ5IiwiU3RyaW5nIiwidGV4dCIsIlNvdXJjZUNvZGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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LEdBQ2FwSCxPQURiLENBQ2pCb0gsYUFEaUIsQ0FDRm9DLFVBREUsR0FDYXhKLE9BRGIsQ0FDRndKLFVBREUsQ0FHbkMsSUFBSUMsS0FBS0MsU0FBTCxDQUFldEUsUUFBZixNQUE2Qm1FLFlBQWpDLEVBQStDLENBQzdDRCxlQUFlLHNCQUFXLEVBQUVsRSxrQkFBRixFQUFYLEVBQXlCbkMsTUFBekIsQ0FBZ0MsS0FBaEMsQ0FBZixDQUNBc0csZUFBZUUsS0FBS0MsU0FBTCxDQUFldEUsUUFBZixDQUFmLENBQ0QsQ0FFRCxJQUFJcUUsS0FBS0MsU0FBTCxDQUFldEMsYUFBZixNQUFrQ2lDLGlCQUF0QyxFQUF5RCxDQUN2REQsb0JBQW9CLHNCQUFXLEVBQUVoQyw0QkFBRixFQUFYLEVBQThCbkUsTUFBOUIsQ0FBcUMsS0FBckMsQ0FBcEIsQ0FDQW9HLG9CQUFvQkksS0FBS0MsU0FBTCxDQUFldEMsYUFBZixDQUFwQixDQUNELENBRUQsT0FBTyxFQUNMcEUsVUFBVTJHLE9BQU9ILFVBQVAsSUFBcUJKLGlCQUFyQixHQUF5Q0UsWUFBekMsR0FBd0RLLE9BQU94TCxJQUFQLENBRDdELEVBRUxpSCxrQkFGSyxFQUdMZ0MsNEJBSEssRUFJTG9DLHNCQUpLLEVBS0xyTCxVQUxLLEVBQVAsQ0FPRCxDLENBRUQ7O2kxQ0FHQSxTQUFTZ0osY0FBVCxDQUF3QnlDLElBQXhCLEVBQThCN0YsR0FBOUIsRUFBbUMsQ0FDakMsSUFBSThGLG1CQUFXdkksTUFBWCxHQUFvQixDQUF4QixFQUEyQixDQUN6QjtBQUNBLFdBQU8sSUFBSXVJLGtCQUFKLENBQWVELElBQWYsRUFBcUI3RixHQUFyQixDQUFQLENBQ0QsQ0FIRCxNQUdPLENBQ0w7QUFDQSxXQUFPLElBQUk4RixrQkFBSixDQUFlLEVBQUVELFVBQUYsRUFBUTdGLFFBQVIsRUFBZixDQUFQLENBQ0QsQ0FDRiIsImZpbGUiOiJFeHBvcnRNYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSBhcyBwYXRoUmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuXG5pbXBvcnQgZG9jdHJpbmUgZnJvbSAnZG9jdHJpbmUnO1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuXG5pbXBvcnQgeyBTb3VyY2VDb2RlIH0gZnJvbSAnZXNsaW50JztcblxuaW1wb3J0IHBhcnNlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcGFyc2UnO1xuaW1wb3J0IHZpc2l0IGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvdmlzaXQnO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBpc0lnbm9yZWQsIHsgaGFzVmFsaWRFeHRlbnNpb24gfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5cbmltcG9ydCB7IGhhc2hPYmplY3QgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2hhc2gnO1xuaW1wb3J0ICogYXMgdW5hbWJpZ3VvdXMgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy91bmFtYmlndW91cyc7XG5cbmltcG9ydCB7IGdldFRzY29uZmlnIH0gZnJvbSAnZ2V0LXRzY29uZmlnJztcblxuY29uc3QgaW5jbHVkZXMgPSBGdW5jdGlvbi5iaW5kLmJpbmQoRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwpKEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdlc2xpbnQtcGx1Z2luLWltcG9ydDpFeHBvcnRNYXAnKTtcblxuY29uc3QgZXhwb3J0Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCB0c2NvbmZpZ0NhY2hlID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFeHBvcnRNYXAge1xuICBjb25zdHJ1Y3RvcihwYXRoKSB7XG4gICAgdGhpcy5wYXRoID0gcGF0aDtcbiAgICB0aGlzLm5hbWVzcGFjZSA9IG5ldyBNYXAoKTtcbiAgICAvLyB0b2RvOiByZXN0cnVjdHVyZSB0byBrZXkgb24gcGF0aCwgdmFsdWUgaXMgcmVzb2x2ZXIgKyBtYXAgb2YgbmFtZXNcbiAgICB0aGlzLnJlZXhwb3J0cyA9IG5ldyBNYXAoKTtcbiAgICAvKipcbiAgICAgKiBzdGFyLWV4cG9ydHNcbiAgICAgKiBAdHlwZSB7U2V0fSBvZiAoKSA9PiBFeHBvcnRNYXBcbiAgICAgKi9cbiAgICB0aGlzLmRlcGVuZGVuY2llcyA9IG5ldyBTZXQoKTtcbiAgICAvKipcbiAgICAgKiBkZXBlbmRlbmNpZXMgb2YgdGhpcyBtb2R1bGUgdGhhdCBhcmUgbm90IGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWRcbiAgICAgKiBAdHlwZSB7TWFwfSBmcm9tIHBhdGggPSAoKSA9PiBFeHBvcnRNYXBcbiAgICAgKi9cbiAgICB0aGlzLmltcG9ydHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcbiAgICAvKipcbiAgICAgKiB0eXBlIHsnYW1iaWd1b3VzJyB8ICdNb2R1bGUnIHwgJ1NjcmlwdCd9XG4gICAgICovXG4gICAgdGhpcy5wYXJzZUdvYWwgPSAnYW1iaWd1b3VzJztcbiAgfVxuXG4gIGdldCBoYXNEZWZhdWx0KCkgeyByZXR1cm4gdGhpcy5nZXQoJ2RlZmF1bHQnKSAhPSBudWxsOyB9IC8vIHN0cm9uZ2VyIHRoYW4gdGhpcy5oYXNcblxuICBnZXQgc2l6ZSgpIHtcbiAgICBsZXQgc2l6ZSA9IHRoaXMubmFtZXNwYWNlLnNpemUgKyB0aGlzLnJlZXhwb3J0cy5zaXplO1xuICAgIHRoaXMuZGVwZW5kZW5jaWVzLmZvckVhY2goKGRlcCkgPT4ge1xuICAgICAgY29uc3QgZCA9IGRlcCgpO1xuICAgICAgLy8gQ0pTIC8gaWdub3JlZCBkZXBlbmRlbmNpZXMgd29uJ3QgZXhpc3QgKCM3MTcpXG4gICAgICBpZiAoZCA9PSBudWxsKSB7IHJldHVybjsgfVxuICAgICAgc2l6ZSArPSBkLnNpemU7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNpemU7XG4gIH1cblxuICAvKipcbiAgICogTm90ZSB0aGF0IHRoaXMgZG9lcyBub3QgY2hlY2sgZXhwbGljaXRseSByZS1leHBvcnRlZCBuYW1lcyBmb3IgZXhpc3RlbmNlXG4gICAqIGluIHRoZSBiYXNlIG5hbWVzcGFjZSwgYnV0IGl0IHdpbGwgZXhwYW5kIGFsbCBgZXhwb3J0ICogZnJvbSAnLi4uJ2AgZXhwb3J0c1xuICAgKiBpZiBub3QgZm91bmQgaW4gdGhlIGV4cGxpY2l0IG5hbWVzcGFjZS5cbiAgICogQHBhcmFtICB7c3RyaW5nfSAgbmFtZVxuICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIGBuYW1lYCBpcyBleHBvcnRlZCBieSB0aGlzIG1vZHVsZS5cbiAgICovXG4gIGhhcyhuYW1lKSB7XG4gICAgaWYgKHRoaXMubmFtZXNwYWNlLmhhcyhuYW1lKSkgeyByZXR1cm4gdHJ1ZTsgfVxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgIC8vIGRlZmF1bHQgZXhwb3J0cyBtdXN0IGJlIGV4cGxpY2l0bHkgcmUtZXhwb3J0ZWQgKCMzMjgpXG4gICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgZm9yIChjb25zdCBkZXAgb2YgdGhpcy5kZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgY29uc3QgaW5uZXJNYXAgPSBkZXAoKTtcblxuICAgICAgICAvLyB0b2RvOiByZXBvcnQgYXMgdW5yZXNvbHZlZD9cbiAgICAgICAgaWYgKCFpbm5lck1hcCkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgIGlmIChpbm5lck1hcC5oYXMobmFtZSkpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogZW5zdXJlIHRoYXQgaW1wb3J0ZWQgbmFtZSBmdWxseSByZXNvbHZlcy5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBuYW1lXG4gICAqIEByZXR1cm4ge3sgZm91bmQ6IGJvb2xlYW4sIHBhdGg6IEV4cG9ydE1hcFtdIH19XG4gICAqL1xuICBoYXNEZWVwKG5hbWUpIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UuaGFzKG5hbWUpKSB7IHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTsgfVxuXG4gICAgaWYgKHRoaXMucmVleHBvcnRzLmhhcyhuYW1lKSkge1xuICAgICAgY29uc3QgcmVleHBvcnRzID0gdGhpcy5yZWV4cG9ydHMuZ2V0KG5hbWUpO1xuICAgICAgY29uc3QgaW1wb3J0ZWQgPSByZWV4cG9ydHMuZ2V0SW1wb3J0KCk7XG5cbiAgICAgIC8vIGlmIGltcG9ydCBpcyBpZ25vcmVkLCByZXR1cm4gZXhwbGljaXQgJ251bGwnXG4gICAgICBpZiAoaW1wb3J0ZWQgPT0gbnVsbCkgeyByZXR1cm4geyBmb3VuZDogdHJ1ZSwgcGF0aDogW3RoaXNdIH07IH1cblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIHsgZm91bmQ6IGZhbHNlLCBwYXRoOiBbdGhpc10gfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVlcCA9IGltcG9ydGVkLmhhc0RlZXAocmVleHBvcnRzLmxvY2FsKTtcbiAgICAgIGRlZXAucGF0aC51bnNoaWZ0KHRoaXMpO1xuXG4gICAgICByZXR1cm4gZGVlcDtcbiAgICB9XG5cbiAgICAvLyBkZWZhdWx0IGV4cG9ydHMgbXVzdCBiZSBleHBsaWNpdGx5IHJlLWV4cG9ydGVkICgjMzI4KVxuICAgIGlmIChuYW1lICE9PSAnZGVmYXVsdCcpIHtcbiAgICAgIGZvciAoY29uc3QgZGVwIG9mIHRoaXMuZGVwZW5kZW5jaWVzKSB7XG4gICAgICAgIGNvbnN0IGlubmVyTWFwID0gZGVwKCk7XG4gICAgICAgIGlmIChpbm5lck1hcCA9PSBudWxsKSB7IHJldHVybiB7IGZvdW5kOiB0cnVlLCBwYXRoOiBbdGhpc10gfTsgfVxuICAgICAgICAvLyB0b2RvOiByZXBvcnQgYXMgdW5yZXNvbHZlZD9cbiAgICAgICAgaWYgKCFpbm5lck1hcCkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgIC8vIHNhZmVndWFyZCBhZ2FpbnN0IGN5Y2xlc1xuICAgICAgICBpZiAoaW5uZXJNYXAucGF0aCA9PT0gdGhpcy5wYXRoKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgY29uc3QgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmhhc0RlZXAobmFtZSk7XG4gICAgICAgIGlmIChpbm5lclZhbHVlLmZvdW5kKSB7XG4gICAgICAgICAgaW5uZXJWYWx1ZS5wYXRoLnVuc2hpZnQodGhpcyk7XG4gICAgICAgICAgcmV0dXJuIGlubmVyVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4geyBmb3VuZDogZmFsc2UsIHBhdGg6IFt0aGlzXSB9O1xuICB9XG5cbiAgZ2V0KG5hbWUpIHtcbiAgICBpZiAodGhpcy5uYW1lc3BhY2UuaGFzKG5hbWUpKSB7IHJldHVybiB0aGlzLm5hbWVzcGFjZS5nZXQobmFtZSk7IH1cblxuICAgIGlmICh0aGlzLnJlZXhwb3J0cy5oYXMobmFtZSkpIHtcbiAgICAgIGNvbnN0IHJlZXhwb3J0cyA9IHRoaXMucmVleHBvcnRzLmdldChuYW1lKTtcbiAgICAgIGNvbnN0IGltcG9ydGVkID0gcmVleHBvcnRzLmdldEltcG9ydCgpO1xuXG4gICAgICAvLyBpZiBpbXBvcnQgaXMgaWdub3JlZCwgcmV0dXJuIGV4cGxpY2l0ICdudWxsJ1xuICAgICAgaWYgKGltcG9ydGVkID09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICAgICAgLy8gc2FmZWd1YXJkIGFnYWluc3QgY3ljbGVzLCBvbmx5IGlmIG5hbWUgbWF0Y2hlc1xuICAgICAgaWYgKGltcG9ydGVkLnBhdGggPT09IHRoaXMucGF0aCAmJiByZWV4cG9ydHMubG9jYWwgPT09IG5hbWUpIHsgcmV0dXJuIHVuZGVmaW5lZDsgfVxuXG4gICAgICByZXR1cm4gaW1wb3J0ZWQuZ2V0KHJlZXhwb3J0cy5sb2NhbCk7XG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdCBleHBvcnRzIG11c3QgYmUgZXhwbGljaXRseSByZS1leHBvcnRlZCAoIzMyOClcbiAgICBpZiAobmFtZSAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICBmb3IgKGNvbnN0IGRlcCBvZiB0aGlzLmRlcGVuZGVuY2llcykge1xuICAgICAgICBjb25zdCBpbm5lck1hcCA9IGRlcCgpO1xuICAgICAgICAvLyB0b2RvOiByZXBvcnQgYXMgdW5yZXNvbHZlZD9cbiAgICAgICAgaWYgKCFpbm5lck1hcCkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgIC8vIHNhZmVndWFyZCBhZ2FpbnN0IGN5Y2xlc1xuICAgICAgICBpZiAoaW5uZXJNYXAucGF0aCA9PT0gdGhpcy5wYXRoKSB7IGNvbnRpbnVlOyB9XG5cbiAgICAgICAgY29uc3QgaW5uZXJWYWx1ZSA9IGlubmVyTWFwLmdldChuYW1lKTtcbiAgICAgICAgaWYgKGlubmVyVmFsdWUgIT09IHVuZGVmaW5lZCkgeyByZXR1cm4gaW5uZXJWYWx1ZTsgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgdGhpcy5uYW1lc3BhY2UuZm9yRWFjaCgodiwgbikgPT4geyBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHYsIG4sIHRoaXMpOyB9KTtcblxuICAgIHRoaXMucmVleHBvcnRzLmZvckVhY2goKHJlZXhwb3J0cywgbmFtZSkgPT4ge1xuICAgICAgY29uc3QgcmVleHBvcnRlZCA9IHJlZXhwb3J0cy5nZXRJbXBvcnQoKTtcbiAgICAgIC8vIGNhbid0IGxvb2sgdXAgbWV0YSBmb3IgaWdub3JlZCByZS1leHBvcnRzICgjMzQ4KVxuICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCByZWV4cG9ydGVkICYmIHJlZXhwb3J0ZWQuZ2V0KHJlZXhwb3J0cy5sb2NhbCksIG5hbWUsIHRoaXMpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kZXBlbmRlbmNpZXMuZm9yRWFjaCgoZGVwKSA9PiB7XG4gICAgICBjb25zdCBkID0gZGVwKCk7XG4gICAgICAvLyBDSlMgLyBpZ25vcmVkIGRlcGVuZGVuY2llcyB3b24ndCBleGlzdCAoIzcxNylcbiAgICAgIGlmIChkID09IG51bGwpIHsgcmV0dXJuOyB9XG5cbiAgICAgIGQuZm9yRWFjaCgodiwgbikgPT4ge1xuICAgICAgICBpZiAobiAhPT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzQXJnLCB2LCBuLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyB0b2RvOiBrZXlzLCB2YWx1ZXMsIGVudHJpZXM/XG5cbiAgcmVwb3J0RXJyb3JzKGNvbnRleHQsIGRlY2xhcmF0aW9uKSB7XG4gICAgY29uc3QgbXNnID0gdGhpcy5lcnJvcnNcbiAgICAgIC5tYXAoKGUpID0+IGAke2UubWVzc2FnZX0gKCR7ZS5saW5lTnVtYmVyfToke2UuY29sdW1ufSlgKVxuICAgICAgLmpvaW4oJywgJyk7XG4gICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgbm9kZTogZGVjbGFyYXRpb24uc291cmNlLFxuICAgICAgbWVzc2FnZTogYFBhcnNlIGVycm9ycyBpbiBpbXBvcnRlZCBtb2R1bGUgJyR7ZGVjbGFyYXRpb24uc291cmNlLnZhbHVlfSc6ICR7bXNnfWAsXG4gICAgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBwYXJzZSBkb2NzIGZyb20gdGhlIGZpcnN0IG5vZGUgdGhhdCBoYXMgbGVhZGluZyBjb21tZW50c1xuICovXG5mdW5jdGlvbiBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCAuLi5ub2Rlcykge1xuICBjb25zdCBtZXRhZGF0YSA9IHt9O1xuXG4gIC8vICdzb21lJyBzaG9ydC1jaXJjdWl0cyBvbiBmaXJzdCAndHJ1ZSdcbiAgbm9kZXMuc29tZSgobikgPT4ge1xuICAgIHRyeSB7XG5cbiAgICAgIGxldCBsZWFkaW5nQ29tbWVudHM7XG5cbiAgICAgIC8vIG4ubGVhZGluZ0NvbW1lbnRzIGlzIGxlZ2FjeSBgYXR0YWNoQ29tbWVudHNgIGJlaGF2aW9yXG4gICAgICBpZiAoJ2xlYWRpbmdDb21tZW50cycgaW4gbikge1xuICAgICAgICBsZWFkaW5nQ29tbWVudHMgPSBuLmxlYWRpbmdDb21tZW50cztcbiAgICAgIH0gZWxzZSBpZiAobi5yYW5nZSkge1xuICAgICAgICBsZWFkaW5nQ29tbWVudHMgPSBzb3VyY2UuZ2V0Q29tbWVudHNCZWZvcmUobik7XG4gICAgICB9XG5cbiAgICAgIGlmICghbGVhZGluZ0NvbW1lbnRzIHx8IGxlYWRpbmdDb21tZW50cy5sZW5ndGggPT09IDApIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIGZvciAoY29uc3QgbmFtZSBpbiBkb2NTdHlsZVBhcnNlcnMpIHtcbiAgICAgICAgY29uc3QgZG9jID0gZG9jU3R5bGVQYXJzZXJzW25hbWVdKGxlYWRpbmdDb21tZW50cyk7XG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICBtZXRhZGF0YS5kb2MgPSBkb2M7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbWV0YWRhdGE7XG59XG5cbmNvbnN0IGF2YWlsYWJsZURvY1N0eWxlUGFyc2VycyA9IHtcbiAganNkb2M6IGNhcHR1cmVKc0RvYyxcbiAgdG9tZG9jOiBjYXB0dXJlVG9tRG9jLFxufTtcblxuLyoqXG4gKiBwYXJzZSBKU0RvYyBmcm9tIGxlYWRpbmcgY29tbWVudHNcbiAqIEBwYXJhbSB7b2JqZWN0W119IGNvbW1lbnRzXG4gKiBAcmV0dXJuIHt7IGRvYzogb2JqZWN0IH19XG4gKi9cbmZ1bmN0aW9uIGNhcHR1cmVKc0RvYyhjb21tZW50cykge1xuICBsZXQgZG9jO1xuXG4gIC8vIGNhcHR1cmUgWFNEb2NcbiAgY29tbWVudHMuZm9yRWFjaCgoY29tbWVudCkgPT4ge1xuICAgIC8vIHNraXAgbm9uLWJsb2NrIGNvbW1lbnRzXG4gICAgaWYgKGNvbW1lbnQudHlwZSAhPT0gJ0Jsb2NrJykgeyByZXR1cm47IH1cbiAgICB0cnkge1xuICAgICAgZG9jID0gZG9jdHJpbmUucGFyc2UoY29tbWVudC52YWx1ZSwgeyB1bndyYXA6IHRydWUgfSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAvKiBkb24ndCBjYXJlLCBmb3Igbm93PyBtYXliZSBhZGQgdG8gYGVycm9ycz9gICovXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gZG9jO1xufVxuXG4vKipcbiAgKiBwYXJzZSBUb21Eb2Mgc2VjdGlvbiBmcm9tIGNvbW1lbnRzXG4gICovXG5mdW5jdGlvbiBjYXB0dXJlVG9tRG9jKGNvbW1lbnRzKSB7XG4gIC8vIGNvbGxlY3QgbGluZXMgdXAgdG8gZmlyc3QgcGFyYWdyYXBoIGJyZWFrXG4gIGNvbnN0IGxpbmVzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY29tbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBjb21tZW50ID0gY29tbWVudHNbaV07XG4gICAgaWYgKGNvbW1lbnQudmFsdWUubWF0Y2goL15cXHMqJC8pKSB7IGJyZWFrOyB9XG4gICAgbGluZXMucHVzaChjb21tZW50LnZhbHVlLnRyaW0oKSk7XG4gIH1cblxuICAvLyByZXR1cm4gZG9jdHJpbmUtbGlrZSBvYmplY3RcbiAgY29uc3Qgc3RhdHVzTWF0Y2ggPSBsaW5lcy5qb2luKCcgJykubWF0Y2goL14oUHVibGljfEludGVybmFsfERlcHJlY2F0ZWQpOlxccyooLispLyk7XG4gIGlmIChzdGF0dXNNYXRjaCkge1xuICAgIHJldHVybiB7XG4gICAgICBkZXNjcmlwdGlvbjogc3RhdHVzTWF0Y2hbMl0sXG4gICAgICB0YWdzOiBbe1xuICAgICAgICB0aXRsZTogc3RhdHVzTWF0Y2hbMV0udG9Mb3dlckNhc2UoKSxcbiAgICAgICAgZGVzY3JpcHRpb246IHN0YXR1c01hdGNoWzJdLFxuICAgICAgfV0sXG4gICAgfTtcbiAgfVxufVxuXG5jb25zdCBzdXBwb3J0ZWRJbXBvcnRUeXBlcyA9IG5ldyBTZXQoWydJbXBvcnREZWZhdWx0U3BlY2lmaWVyJywgJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllciddKTtcblxuRXhwb3J0TWFwLmdldCA9IGZ1bmN0aW9uIChzb3VyY2UsIGNvbnRleHQpIHtcbiAgY29uc3QgcGF0aCA9IHJlc29sdmUoc291cmNlLCBjb250ZXh0KTtcbiAgaWYgKHBhdGggPT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gIHJldHVybiBFeHBvcnRNYXAuZm9yKGNoaWxkQ29udGV4dChwYXRoLCBjb250ZXh0KSk7XG59O1xuXG5FeHBvcnRNYXAuZm9yID0gZnVuY3Rpb24gKGNvbnRleHQpIHtcbiAgY29uc3QgeyBwYXRoIH0gPSBjb250ZXh0O1xuXG4gIGNvbnN0IGNhY2hlS2V5ID0gY29udGV4dC5jYWNoZUtleSB8fCBoYXNoT2JqZWN0KGNvbnRleHQpLmRpZ2VzdCgnaGV4Jyk7XG4gIGxldCBleHBvcnRNYXAgPSBleHBvcnRDYWNoZS5nZXQoY2FjaGVLZXkpO1xuXG4gIC8vIHJldHVybiBjYWNoZWQgaWdub3JlXG4gIGlmIChleHBvcnRNYXAgPT09IG51bGwpIHsgcmV0dXJuIG51bGw7IH1cblxuICBjb25zdCBzdGF0cyA9IGZzLnN0YXRTeW5jKHBhdGgpO1xuICBpZiAoZXhwb3J0TWFwICE9IG51bGwpIHtcbiAgICAvLyBkYXRlIGVxdWFsaXR5IGNoZWNrXG4gICAgaWYgKGV4cG9ydE1hcC5tdGltZSAtIHN0YXRzLm10aW1lID09PSAwKSB7XG4gICAgICByZXR1cm4gZXhwb3J0TWFwO1xuICAgIH1cbiAgICAvLyBmdXR1cmU6IGNoZWNrIGNvbnRlbnQgZXF1YWxpdHk/XG4gIH1cblxuICAvLyBjaGVjayB2YWxpZCBleHRlbnNpb25zIGZpcnN0XG4gIGlmICghaGFzVmFsaWRFeHRlbnNpb24ocGF0aCwgY29udGV4dCkpIHtcbiAgICBleHBvcnRDYWNoZS5zZXQoY2FjaGVLZXksIG51bGwpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gY2hlY2sgZm9yIGFuZCBjYWNoZSBpZ25vcmVcbiAgaWYgKGlzSWdub3JlZChwYXRoLCBjb250ZXh0KSkge1xuICAgIGxvZygnaWdub3JlZCBwYXRoIGR1ZSB0byBpZ25vcmUgc2V0dGluZ3M6JywgcGF0aCk7XG4gICAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBudWxsKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMocGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pO1xuXG4gIC8vIGNoZWNrIGZvciBhbmQgY2FjaGUgdW5hbWJpZ3VvdXMgbW9kdWxlc1xuICBpZiAoIXVuYW1iaWd1b3VzLnRlc3QoY29udGVudCkpIHtcbiAgICBsb2coJ2lnbm9yZWQgcGF0aCBkdWUgdG8gdW5hbWJpZ3VvdXMgcmVnZXg6JywgcGF0aCk7XG4gICAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBudWxsKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGxvZygnY2FjaGUgbWlzcycsIGNhY2hlS2V5LCAnZm9yIHBhdGgnLCBwYXRoKTtcbiAgZXhwb3J0TWFwID0gRXhwb3J0TWFwLnBhcnNlKHBhdGgsIGNvbnRlbnQsIGNvbnRleHQpO1xuXG4gIC8vIGFtYmlndW91cyBtb2R1bGVzIHJldHVybiBudWxsXG4gIGlmIChleHBvcnRNYXAgPT0gbnVsbCkge1xuICAgIGxvZygnaWdub3JlZCBwYXRoIGR1ZSB0byBhbWJpZ3VvdXMgcGFyc2U6JywgcGF0aCk7XG4gICAgZXhwb3J0Q2FjaGUuc2V0KGNhY2hlS2V5LCBudWxsKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGV4cG9ydE1hcC5tdGltZSA9IHN0YXRzLm10aW1lO1xuXG4gIGV4cG9ydENhY2hlLnNldChjYWNoZUtleSwgZXhwb3J0TWFwKTtcbiAgcmV0dXJuIGV4cG9ydE1hcDtcbn07XG5cbkV4cG9ydE1hcC5wYXJzZSA9IGZ1bmN0aW9uIChwYXRoLCBjb250ZW50LCBjb250ZXh0KSB7XG4gIGNvbnN0IG0gPSBuZXcgRXhwb3J0TWFwKHBhdGgpO1xuICBjb25zdCBpc0VzTW9kdWxlSW50ZXJvcFRydWUgPSBpc0VzTW9kdWxlSW50ZXJvcCgpO1xuXG4gIGxldCBhc3Q7XG4gIGxldCB2aXNpdG9yS2V5cztcbiAgdHJ5IHtcbiAgICBjb25zdCByZXN1bHQgPSBwYXJzZShwYXRoLCBjb250ZW50LCBjb250ZXh0KTtcbiAgICBhc3QgPSByZXN1bHQuYXN0O1xuICAgIHZpc2l0b3JLZXlzID0gcmVzdWx0LnZpc2l0b3JLZXlzO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBtLmVycm9ycy5wdXNoKGVycik7XG4gICAgcmV0dXJuIG07IC8vIGNhbid0IGNvbnRpbnVlXG4gIH1cblxuICBtLnZpc2l0b3JLZXlzID0gdmlzaXRvcktleXM7XG5cbiAgbGV0IGhhc0R5bmFtaWNJbXBvcnRzID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc0R5bmFtaWNJbXBvcnQoc291cmNlKSB7XG4gICAgaGFzRHluYW1pY0ltcG9ydHMgPSB0cnVlO1xuICAgIGlmIChzb3VyY2UudHlwZSAhPT0gJ0xpdGVyYWwnKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgcCA9IHJlbW90ZVBhdGgoc291cmNlLnZhbHVlKTtcbiAgICBpZiAocCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgaW1wb3J0ZWRTcGVjaWZpZXJzID0gbmV3IFNldCgpO1xuICAgIGltcG9ydGVkU3BlY2lmaWVycy5hZGQoJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpO1xuICAgIGNvbnN0IGdldHRlciA9IHRodW5rRm9yKHAsIGNvbnRleHQpO1xuICAgIG0uaW1wb3J0cy5zZXQocCwge1xuICAgICAgZ2V0dGVyLFxuICAgICAgZGVjbGFyYXRpb25zOiBuZXcgU2V0KFt7XG4gICAgICAgIHNvdXJjZToge1xuICAgICAgICAvLyBjYXB0dXJpbmcgYWN0dWFsIG5vZGUgcmVmZXJlbmNlIGhvbGRzIGZ1bGwgQVNUIGluIG1lbW9yeSFcbiAgICAgICAgICB2YWx1ZTogc291cmNlLnZhbHVlLFxuICAgICAgICAgIGxvYzogc291cmNlLmxvYyxcbiAgICAgICAgfSxcbiAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLFxuICAgICAgICBkeW5hbWljOiB0cnVlLFxuICAgICAgfV0pLFxuICAgIH0pO1xuICB9XG5cbiAgdmlzaXQoYXN0LCB2aXNpdG9yS2V5cywge1xuICAgIEltcG9ydEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgcHJvY2Vzc0R5bmFtaWNJbXBvcnQobm9kZS5zb3VyY2UpO1xuICAgIH0sXG4gICAgQ2FsbEV4cHJlc3Npb24obm9kZSkge1xuICAgICAgaWYgKG5vZGUuY2FsbGVlLnR5cGUgPT09ICdJbXBvcnQnKSB7XG4gICAgICAgIHByb2Nlc3NEeW5hbWljSW1wb3J0KG5vZGUuYXJndW1lbnRzWzBdKTtcbiAgICAgIH1cbiAgICB9LFxuICB9KTtcblxuICBjb25zdCB1bmFtYmlndW91c2x5RVNNID0gdW5hbWJpZ3VvdXMuaXNNb2R1bGUoYXN0KTtcbiAgaWYgKCF1bmFtYmlndW91c2x5RVNNICYmICFoYXNEeW5hbWljSW1wb3J0cykgeyByZXR1cm4gbnVsbDsgfVxuXG4gIGNvbnN0IGRvY3N0eWxlID0gY29udGV4dC5zZXR0aW5ncyAmJiBjb250ZXh0LnNldHRpbmdzWydpbXBvcnQvZG9jc3R5bGUnXSB8fCBbJ2pzZG9jJ107XG4gIGNvbnN0IGRvY1N0eWxlUGFyc2VycyA9IHt9O1xuICBkb2NzdHlsZS5mb3JFYWNoKChzdHlsZSkgPT4ge1xuICAgIGRvY1N0eWxlUGFyc2Vyc1tzdHlsZV0gPSBhdmFpbGFibGVEb2NTdHlsZVBhcnNlcnNbc3R5bGVdO1xuICB9KTtcblxuICAvLyBhdHRlbXB0IHRvIGNvbGxlY3QgbW9kdWxlIGRvY1xuICBpZiAoYXN0LmNvbW1lbnRzKSB7XG4gICAgYXN0LmNvbW1lbnRzLnNvbWUoKGMpID0+IHtcbiAgICAgIGlmIChjLnR5cGUgIT09ICdCbG9jaycpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBkb2MgPSBkb2N0cmluZS5wYXJzZShjLnZhbHVlLCB7IHVud3JhcDogdHJ1ZSB9KTtcbiAgICAgICAgaWYgKGRvYy50YWdzLnNvbWUoKHQpID0+IHQudGl0bGUgPT09ICdtb2R1bGUnKSkge1xuICAgICAgICAgIG0uZG9jID0gZG9jO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHsgLyogaWdub3JlICovIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgfVxuXG4gIGNvbnN0IG5hbWVzcGFjZXMgPSBuZXcgTWFwKCk7XG5cbiAgZnVuY3Rpb24gcmVtb3RlUGF0aCh2YWx1ZSkge1xuICAgIHJldHVybiByZXNvbHZlLnJlbGF0aXZlKHZhbHVlLCBwYXRoLCBjb250ZXh0LnNldHRpbmdzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc29sdmVJbXBvcnQodmFsdWUpIHtcbiAgICBjb25zdCBycCA9IHJlbW90ZVBhdGgodmFsdWUpO1xuICAgIGlmIChycCA9PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIEV4cG9ydE1hcC5mb3IoY2hpbGRDb250ZXh0KHJwLCBjb250ZXh0KSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROYW1lc3BhY2UoaWRlbnRpZmllcikge1xuICAgIGlmICghbmFtZXNwYWNlcy5oYXMoaWRlbnRpZmllci5uYW1lKSkgeyByZXR1cm47IH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZUltcG9ydChuYW1lc3BhY2VzLmdldChpZGVudGlmaWVyLm5hbWUpKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gYWRkTmFtZXNwYWNlKG9iamVjdCwgaWRlbnRpZmllcikge1xuICAgIGNvbnN0IG5zZm4gPSBnZXROYW1lc3BhY2UoaWRlbnRpZmllcik7XG4gICAgaWYgKG5zZm4pIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsICduYW1lc3BhY2UnLCB7IGdldDogbnNmbiB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqZWN0O1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvY2Vzc1NwZWNpZmllcihzLCBuLCBtKSB7XG4gICAgY29uc3QgbnNvdXJjZSA9IG4uc291cmNlICYmIG4uc291cmNlLnZhbHVlO1xuICAgIGNvbnN0IGV4cG9ydE1ldGEgPSB7fTtcbiAgICBsZXQgbG9jYWw7XG5cbiAgICBzd2l0Y2ggKHMudHlwZSkge1xuICAgICAgY2FzZSAnRXhwb3J0RGVmYXVsdFNwZWNpZmllcic6XG4gICAgICAgIGlmICghbnNvdXJjZSkgeyByZXR1cm47IH1cbiAgICAgICAgbG9jYWwgPSAnZGVmYXVsdCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnRXhwb3J0TmFtZXNwYWNlU3BlY2lmaWVyJzpcbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KHMuZXhwb3J0ZWQubmFtZSwgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydE1ldGEsICduYW1lc3BhY2UnLCB7XG4gICAgICAgICAgZ2V0KCkgeyByZXR1cm4gcmVzb2x2ZUltcG9ydChuc291cmNlKTsgfSxcbiAgICAgICAgfSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICBjYXNlICdFeHBvcnRBbGxEZWNsYXJhdGlvbic6XG4gICAgICAgIG0ubmFtZXNwYWNlLnNldChzLmV4cG9ydGVkLm5hbWUgfHwgcy5leHBvcnRlZC52YWx1ZSwgYWRkTmFtZXNwYWNlKGV4cG9ydE1ldGEsIHMuc291cmNlLnZhbHVlKSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIGNhc2UgJ0V4cG9ydFNwZWNpZmllcic6XG4gICAgICAgIGlmICghbi5zb3VyY2UpIHtcbiAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQocy5leHBvcnRlZC5uYW1lIHx8IHMuZXhwb3J0ZWQudmFsdWUsIGFkZE5hbWVzcGFjZShleHBvcnRNZXRhLCBzLmxvY2FsKSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAvLyBlbHNlIGZhbGxzIHRocm91Z2hcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxvY2FsID0gcy5sb2NhbC5uYW1lO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICAvLyB0b2RvOiBKU0RvY1xuICAgIG0ucmVleHBvcnRzLnNldChzLmV4cG9ydGVkLm5hbWUsIHsgbG9jYWwsIGdldEltcG9ydDogKCkgPT4gcmVzb2x2ZUltcG9ydChuc291cmNlKSB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMobikge1xuICAgIC8vIGltcG9ydCB0eXBlIHsgRm9vIH0gKFRTIGFuZCBGbG93KTsgaW1wb3J0IHR5cGVvZiB7IEZvbyB9IChGbG93KVxuICAgIGNvbnN0IGRlY2xhcmF0aW9uSXNUeXBlID0gbi5pbXBvcnRLaW5kID09PSAndHlwZScgfHwgbi5pbXBvcnRLaW5kID09PSAndHlwZW9mJztcbiAgICAvLyBpbXBvcnQgJy4vZm9vJyBvciBpbXBvcnQge30gZnJvbSAnLi9mb28nIChib3RoIDAgc3BlY2lmaWVycykgaXMgYSBzaWRlIGVmZmVjdCBhbmRcbiAgICAvLyBzaG91bGRuJ3QgYmUgY29uc2lkZXJlZCB0byBiZSBqdXN0IGltcG9ydGluZyB0eXBlc1xuICAgIGxldCBzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzID0gbi5zcGVjaWZpZXJzLmxlbmd0aCA+IDA7XG4gICAgY29uc3QgaW1wb3J0ZWRTcGVjaWZpZXJzID0gbmV3IFNldCgpO1xuICAgIG4uc3BlY2lmaWVycy5mb3JFYWNoKChzcGVjaWZpZXIpID0+IHtcbiAgICAgIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpIHtcbiAgICAgICAgaW1wb3J0ZWRTcGVjaWZpZXJzLmFkZChzcGVjaWZpZXIuaW1wb3J0ZWQubmFtZSB8fCBzcGVjaWZpZXIuaW1wb3J0ZWQudmFsdWUpO1xuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0ZWRJbXBvcnRUeXBlcy5oYXMoc3BlY2lmaWVyLnR5cGUpKSB7XG4gICAgICAgIGltcG9ydGVkU3BlY2lmaWVycy5hZGQoc3BlY2lmaWVyLnR5cGUpO1xuICAgICAgfVxuXG4gICAgICAvLyBpbXBvcnQgeyB0eXBlIEZvbyB9IChGbG93KTsgaW1wb3J0IHsgdHlwZW9mIEZvbyB9IChGbG93KVxuICAgICAgc3BlY2lmaWVyc09ubHlJbXBvcnRpbmdUeXBlcyA9IHNwZWNpZmllcnNPbmx5SW1wb3J0aW5nVHlwZXNcbiAgICAgICAgJiYgKHNwZWNpZmllci5pbXBvcnRLaW5kID09PSAndHlwZScgfHwgc3BlY2lmaWVyLmltcG9ydEtpbmQgPT09ICd0eXBlb2YnKTtcbiAgICB9KTtcbiAgICBjYXB0dXJlRGVwZW5kZW5jeShuLCBkZWNsYXJhdGlvbklzVHlwZSB8fCBzcGVjaWZpZXJzT25seUltcG9ydGluZ1R5cGVzLCBpbXBvcnRlZFNwZWNpZmllcnMpO1xuICB9XG5cbiAgZnVuY3Rpb24gY2FwdHVyZURlcGVuZGVuY3koeyBzb3VyY2UgfSwgaXNPbmx5SW1wb3J0aW5nVHlwZXMsIGltcG9ydGVkU3BlY2lmaWVycyA9IG5ldyBTZXQoKSkge1xuICAgIGlmIChzb3VyY2UgPT0gbnVsbCkgeyByZXR1cm4gbnVsbDsgfVxuXG4gICAgY29uc3QgcCA9IHJlbW90ZVBhdGgoc291cmNlLnZhbHVlKTtcbiAgICBpZiAocCA9PSBudWxsKSB7IHJldHVybiBudWxsOyB9XG5cbiAgICBjb25zdCBkZWNsYXJhdGlvbk1ldGFkYXRhID0ge1xuICAgICAgLy8gY2FwdHVyaW5nIGFjdHVhbCBub2RlIHJlZmVyZW5jZSBob2xkcyBmdWxsIEFTVCBpbiBtZW1vcnkhXG4gICAgICBzb3VyY2U6IHsgdmFsdWU6IHNvdXJjZS52YWx1ZSwgbG9jOiBzb3VyY2UubG9jIH0sXG4gICAgICBpc09ubHlJbXBvcnRpbmdUeXBlcyxcbiAgICAgIGltcG9ydGVkU3BlY2lmaWVycyxcbiAgICB9O1xuXG4gICAgY29uc3QgZXhpc3RpbmcgPSBtLmltcG9ydHMuZ2V0KHApO1xuICAgIGlmIChleGlzdGluZyAhPSBudWxsKSB7XG4gICAgICBleGlzdGluZy5kZWNsYXJhdGlvbnMuYWRkKGRlY2xhcmF0aW9uTWV0YWRhdGEpO1xuICAgICAgcmV0dXJuIGV4aXN0aW5nLmdldHRlcjtcbiAgICB9XG5cbiAgICBjb25zdCBnZXR0ZXIgPSB0aHVua0ZvcihwLCBjb250ZXh0KTtcbiAgICBtLmltcG9ydHMuc2V0KHAsIHsgZ2V0dGVyLCBkZWNsYXJhdGlvbnM6IG5ldyBTZXQoW2RlY2xhcmF0aW9uTWV0YWRhdGFdKSB9KTtcbiAgICByZXR1cm4gZ2V0dGVyO1xuICB9XG5cbiAgY29uc3Qgc291cmNlID0gbWFrZVNvdXJjZUNvZGUoY29udGVudCwgYXN0KTtcblxuICBmdW5jdGlvbiBpc0VzTW9kdWxlSW50ZXJvcCgpIHtcbiAgICBjb25zdCBwYXJzZXJPcHRpb25zID0gY29udGV4dC5wYXJzZXJPcHRpb25zIHx8IHt9O1xuICAgIGxldCB0c2NvbmZpZ1Jvb3REaXIgPSBwYXJzZXJPcHRpb25zLnRzY29uZmlnUm9vdERpcjtcbiAgICBjb25zdCBwcm9qZWN0ID0gcGFyc2VyT3B0aW9ucy5wcm9qZWN0O1xuICAgIGNvbnN0IGNhY2hlS2V5ID0gaGFzaE9iamVjdCh7XG4gICAgICB0c2NvbmZpZ1Jvb3REaXIsXG4gICAgICBwcm9qZWN0LFxuICAgIH0pLmRpZ2VzdCgnaGV4Jyk7XG4gICAgbGV0IHRzQ29uZmlnID0gdHNjb25maWdDYWNoZS5nZXQoY2FjaGVLZXkpO1xuICAgIGlmICh0eXBlb2YgdHNDb25maWcgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICB0c2NvbmZpZ1Jvb3REaXIgPSB0c2NvbmZpZ1Jvb3REaXIgfHwgcHJvY2Vzcy5jd2QoKTtcbiAgICAgIGxldCB0c2NvbmZpZ1Jlc3VsdDtcbiAgICAgIGlmIChwcm9qZWN0KSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RzID0gQXJyYXkuaXNBcnJheShwcm9qZWN0KSA/IHByb2plY3QgOiBbcHJvamVjdF07XG4gICAgICAgIGZvciAoY29uc3QgcHJvamVjdCBvZiBwcm9qZWN0cykge1xuICAgICAgICAgIHRzY29uZmlnUmVzdWx0ID0gZ2V0VHNjb25maWcocGF0aFJlc29sdmUodHNjb25maWdSb290RGlyLCBwcm9qZWN0KSk7XG4gICAgICAgICAgaWYgKHRzY29uZmlnUmVzdWx0KSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRzY29uZmlnUmVzdWx0ID0gZ2V0VHNjb25maWcodHNjb25maWdSb290RGlyKTtcbiAgICAgIH1cbiAgICAgIHRzQ29uZmlnID0gdHNjb25maWdSZXN1bHQgJiYgdHNjb25maWdSZXN1bHQuY29uZmlnIHx8IG51bGw7XG4gICAgICB0c2NvbmZpZ0NhY2hlLnNldChjYWNoZUtleSwgdHNDb25maWcpO1xuICAgIH1cblxuICAgIHJldHVybiB0c0NvbmZpZyAmJiB0c0NvbmZpZy5jb21waWxlck9wdGlvbnMgPyB0c0NvbmZpZy5jb21waWxlck9wdGlvbnMuZXNNb2R1bGVJbnRlcm9wIDogZmFsc2U7XG4gIH1cblxuICBhc3QuYm9keS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgaWYgKG4udHlwZSA9PT0gJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNvbnN0IGV4cG9ydE1ldGEgPSBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBuKTtcbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdJZGVudGlmaWVyJykge1xuICAgICAgICBhZGROYW1lc3BhY2UoZXhwb3J0TWV0YSwgbi5kZWNsYXJhdGlvbik7XG4gICAgICB9XG4gICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBleHBvcnRNZXRhKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0QWxsRGVjbGFyYXRpb24nKSB7XG4gICAgICBjb25zdCBnZXR0ZXIgPSBjYXB0dXJlRGVwZW5kZW5jeShuLCBuLmV4cG9ydEtpbmQgPT09ICd0eXBlJyk7XG4gICAgICBpZiAoZ2V0dGVyKSB7IG0uZGVwZW5kZW5jaWVzLmFkZChnZXR0ZXIpOyB9XG4gICAgICBpZiAobi5leHBvcnRlZCkge1xuICAgICAgICBwcm9jZXNzU3BlY2lmaWVyKG4sIG4uZXhwb3J0ZWQsIG0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNhcHR1cmUgbmFtZXNwYWNlcyBpbiBjYXNlIG9mIGxhdGVyIGV4cG9ydFxuICAgIGlmIChuLnR5cGUgPT09ICdJbXBvcnREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMobik7XG5cbiAgICAgIGNvbnN0IG5zID0gbi5zcGVjaWZpZXJzLmZpbmQoKHMpID0+IHMudHlwZSA9PT0gJ0ltcG9ydE5hbWVzcGFjZVNwZWNpZmllcicpO1xuICAgICAgaWYgKG5zKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuc2V0KG5zLmxvY2FsLm5hbWUsIG4uc291cmNlLnZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobi50eXBlID09PSAnRXhwb3J0TmFtZWREZWNsYXJhdGlvbicpIHtcbiAgICAgIGNhcHR1cmVEZXBlbmRlbmN5V2l0aFNwZWNpZmllcnMobik7XG5cbiAgICAgIC8vIGNhcHR1cmUgZGVjbGFyYXRpb25cbiAgICAgIGlmIChuLmRlY2xhcmF0aW9uICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChuLmRlY2xhcmF0aW9uLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdGdW5jdGlvbkRlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdDbGFzc0RlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdUeXBlQWxpYXMnOiAvLyBmbG93dHlwZSB3aXRoIGJhYmVsLWVzbGludCBwYXJzZXJcbiAgICAgICAgICBjYXNlICdJbnRlcmZhY2VEZWNsYXJhdGlvbic6XG4gICAgICAgICAgY2FzZSAnRGVjbGFyZUZ1bmN0aW9uJzpcbiAgICAgICAgICBjYXNlICdUU0RlY2xhcmVGdW5jdGlvbic6XG4gICAgICAgICAgY2FzZSAnVFNFbnVtRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nOlxuICAgICAgICAgIGNhc2UgJ1RTQWJzdHJhY3RDbGFzc0RlY2xhcmF0aW9uJzpcbiAgICAgICAgICBjYXNlICdUU01vZHVsZURlY2xhcmF0aW9uJzpcbiAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChuLmRlY2xhcmF0aW9uLmlkLm5hbWUsIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG4pKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ1ZhcmlhYmxlRGVjbGFyYXRpb24nOlxuICAgICAgICAgICAgbi5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT4ge1xuICAgICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShcbiAgICAgICAgICAgICAgICBkLmlkLFxuICAgICAgICAgICAgICAgIChpZCkgPT4gbS5uYW1lc3BhY2Uuc2V0KGlkLm5hbWUsIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIGQsIG4pKSxcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBuLnNwZWNpZmllcnMuZm9yRWFjaCgocykgPT4gcHJvY2Vzc1NwZWNpZmllcihzLCBuLCBtKSk7XG4gICAgfVxuXG4gICAgY29uc3QgZXhwb3J0cyA9IFsnVFNFeHBvcnRBc3NpZ25tZW50J107XG4gICAgaWYgKGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSkge1xuICAgICAgZXhwb3J0cy5wdXNoKCdUU05hbWVzcGFjZUV4cG9ydERlY2xhcmF0aW9uJyk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBkb2Vzbid0IGRlY2xhcmUgYW55dGhpbmcsIGJ1dCBjaGFuZ2VzIHdoYXQncyBiZWluZyBleHBvcnRlZC5cbiAgICBpZiAoaW5jbHVkZXMoZXhwb3J0cywgbi50eXBlKSkge1xuICAgICAgY29uc3QgZXhwb3J0ZWROYW1lID0gbi50eXBlID09PSAnVFNOYW1lc3BhY2VFeHBvcnREZWNsYXJhdGlvbidcbiAgICAgICAgPyAobi5pZCB8fCBuLm5hbWUpLm5hbWVcbiAgICAgICAgOiBuLmV4cHJlc3Npb24gJiYgbi5leHByZXNzaW9uLm5hbWUgfHwgbi5leHByZXNzaW9uLmlkICYmIG4uZXhwcmVzc2lvbi5pZC5uYW1lIHx8IG51bGw7XG4gICAgICBjb25zdCBkZWNsVHlwZXMgPSBbXG4gICAgICAgICdWYXJpYWJsZURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ0NsYXNzRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNEZWNsYXJlRnVuY3Rpb24nLFxuICAgICAgICAnVFNFbnVtRGVjbGFyYXRpb24nLFxuICAgICAgICAnVFNUeXBlQWxpYXNEZWNsYXJhdGlvbicsXG4gICAgICAgICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTQWJzdHJhY3RDbGFzc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgJ1RTTW9kdWxlRGVjbGFyYXRpb24nLFxuICAgICAgXTtcbiAgICAgIGNvbnN0IGV4cG9ydGVkRGVjbHMgPSBhc3QuYm9keS5maWx0ZXIoKHsgdHlwZSwgaWQsIGRlY2xhcmF0aW9ucyB9KSA9PiBpbmNsdWRlcyhkZWNsVHlwZXMsIHR5cGUpICYmIChcbiAgICAgICAgaWQgJiYgaWQubmFtZSA9PT0gZXhwb3J0ZWROYW1lIHx8IGRlY2xhcmF0aW9ucyAmJiBkZWNsYXJhdGlvbnMuZmluZCgoZCkgPT4gZC5pZC5uYW1lID09PSBleHBvcnRlZE5hbWUpXG4gICAgICApKTtcbiAgICAgIGlmIChleHBvcnRlZERlY2xzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyBFeHBvcnQgaXMgbm90IHJlZmVyZW5jaW5nIGFueSBsb2NhbCBkZWNsYXJhdGlvbiwgbXVzdCBiZSByZS1leHBvcnRpbmdcbiAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KCdkZWZhdWx0JywgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgbikpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgIGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSAvLyBlc01vZHVsZUludGVyb3AgaXMgb24gaW4gdHNjb25maWdcbiAgICAgICAgJiYgIW0ubmFtZXNwYWNlLmhhcygnZGVmYXVsdCcpIC8vIGFuZCBkZWZhdWx0IGlzbid0IGFkZGVkIGFscmVhZHlcbiAgICAgICkge1xuICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCB7fSk7IC8vIGFkZCBkZWZhdWx0IGV4cG9ydFxuICAgICAgfVxuICAgICAgZXhwb3J0ZWREZWNscy5mb3JFYWNoKChkZWNsKSA9PiB7XG4gICAgICAgIGlmIChkZWNsLnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGlmIChkZWNsLmJvZHkgJiYgZGVjbC5ib2R5LnR5cGUgPT09ICdUU01vZHVsZURlY2xhcmF0aW9uJykge1xuICAgICAgICAgICAgbS5uYW1lc3BhY2Uuc2V0KGRlY2wuYm9keS5pZC5uYW1lLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsLmJvZHkpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRlY2wuYm9keSAmJiBkZWNsLmJvZHkuYm9keSkge1xuICAgICAgICAgICAgZGVjbC5ib2R5LmJvZHkuZm9yRWFjaCgobW9kdWxlQmxvY2tOb2RlKSA9PiB7XG4gICAgICAgICAgICAgIC8vIEV4cG9ydC1hc3NpZ25tZW50IGV4cG9ydHMgYWxsIG1lbWJlcnMgaW4gdGhlIG5hbWVzcGFjZSxcbiAgICAgICAgICAgICAgLy8gZXhwbGljaXRseSBleHBvcnRlZCBvciBub3QuXG4gICAgICAgICAgICAgIGNvbnN0IG5hbWVzcGFjZURlY2wgPSBtb2R1bGVCbG9ja05vZGUudHlwZSA9PT0gJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nXG4gICAgICAgICAgICAgICAgPyBtb2R1bGVCbG9ja05vZGUuZGVjbGFyYXRpb25cbiAgICAgICAgICAgICAgICA6IG1vZHVsZUJsb2NrTm9kZTtcblxuICAgICAgICAgICAgICBpZiAoIW5hbWVzcGFjZURlY2wpIHtcbiAgICAgICAgICAgICAgICAvLyBUeXBlU2NyaXB0IGNhbiBjaGVjayB0aGlzIGZvciB1czsgd2UgbmVlZG4ndFxuICAgICAgICAgICAgICB9IGVsc2UgaWYgKG5hbWVzcGFjZURlY2wudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgICAgICAgbmFtZXNwYWNlRGVjbC5kZWNsYXJhdGlvbnMuZm9yRWFjaCgoZCkgPT4gcmVjdXJzaXZlUGF0dGVybkNhcHR1cmUoZC5pZCwgKGlkKSA9PiBtLm5hbWVzcGFjZS5zZXQoXG4gICAgICAgICAgICAgICAgICBpZC5uYW1lLFxuICAgICAgICAgICAgICAgICAgY2FwdHVyZURvYyhzb3VyY2UsIGRvY1N0eWxlUGFyc2VycywgZGVjbCwgbmFtZXNwYWNlRGVjbCwgbW9kdWxlQmxvY2tOb2RlKSxcbiAgICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG0ubmFtZXNwYWNlLnNldChcbiAgICAgICAgICAgICAgICAgIG5hbWVzcGFjZURlY2wuaWQubmFtZSxcbiAgICAgICAgICAgICAgICAgIGNhcHR1cmVEb2Moc291cmNlLCBkb2NTdHlsZVBhcnNlcnMsIG1vZHVsZUJsb2NrTm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gRXhwb3J0IGFzIGRlZmF1bHRcbiAgICAgICAgICBtLm5hbWVzcGFjZS5zZXQoJ2RlZmF1bHQnLCBjYXB0dXJlRG9jKHNvdXJjZSwgZG9jU3R5bGVQYXJzZXJzLCBkZWNsKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKFxuICAgIGlzRXNNb2R1bGVJbnRlcm9wVHJ1ZSAvLyBlc01vZHVsZUludGVyb3AgaXMgb24gaW4gdHNjb25maWdcbiAgICAmJiBtLm5hbWVzcGFjZS5zaXplID4gMCAvLyBhbnl0aGluZyBpcyBleHBvcnRlZFxuICAgICYmICFtLm5hbWVzcGFjZS5oYXMoJ2RlZmF1bHQnKSAvLyBhbmQgZGVmYXVsdCBpc24ndCBhZGRlZCBhbHJlYWR5XG4gICkge1xuICAgIG0ubmFtZXNwYWNlLnNldCgnZGVmYXVsdCcsIHt9KTsgLy8gYWRkIGRlZmF1bHQgZXhwb3J0XG4gIH1cblxuICBpZiAodW5hbWJpZ3VvdXNseUVTTSkge1xuICAgIG0ucGFyc2VHb2FsID0gJ01vZHVsZSc7XG4gIH1cbiAgcmV0dXJuIG07XG59O1xuXG4vKipcbiAqIFRoZSBjcmVhdGlvbiBvZiB0aGlzIGNsb3N1cmUgaXMgaXNvbGF0ZWQgZnJvbSBvdGhlciBzY29wZXNcbiAqIHRvIGF2b2lkIG92ZXItcmV0ZW50aW9uIG9mIHVucmVsYXRlZCB2YXJpYWJsZXMsIHdoaWNoIGhhc1xuICogY2F1c2VkIG1lbW9yeSBsZWFrcy4gU2VlICMxMjY2LlxuICovXG5mdW5jdGlvbiB0aHVua0ZvcihwLCBjb250ZXh0KSB7XG4gIHJldHVybiAoKSA9PiBFeHBvcnRNYXAuZm9yKGNoaWxkQ29udGV4dChwLCBjb250ZXh0KSk7XG59XG5cbi8qKlxuICogVHJhdmVyc2UgYSBwYXR0ZXJuL2lkZW50aWZpZXIgbm9kZSwgY2FsbGluZyAnY2FsbGJhY2snXG4gKiBmb3IgZWFjaCBsZWFmIGlkZW50aWZpZXIuXG4gKiBAcGFyYW0gIHtub2RlfSAgIHBhdHRlcm5cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICogQHJldHVybiB7dm9pZH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHBhdHRlcm4sIGNhbGxiYWNrKSB7XG4gIHN3aXRjaCAocGF0dGVybi50eXBlKSB7XG4gICAgY2FzZSAnSWRlbnRpZmllcic6IC8vIGJhc2UgY2FzZVxuICAgICAgY2FsbGJhY2socGF0dGVybik7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ09iamVjdFBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5wcm9wZXJ0aWVzLmZvckVhY2goKHApID0+IHtcbiAgICAgICAgaWYgKHAudHlwZSA9PT0gJ0V4cGVyaW1lbnRhbFJlc3RQcm9wZXJ0eScgfHwgcC50eXBlID09PSAnUmVzdEVsZW1lbnQnKSB7XG4gICAgICAgICAgY2FsbGJhY2socC5hcmd1bWVudCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKHAudmFsdWUsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdBcnJheVBhdHRlcm4nOlxuICAgICAgcGF0dGVybi5lbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgIGlmIChlbGVtZW50ID09IG51bGwpIHsgcmV0dXJuOyB9XG4gICAgICAgIGlmIChlbGVtZW50LnR5cGUgPT09ICdFeHBlcmltZW50YWxSZXN0UHJvcGVydHknIHx8IGVsZW1lbnQudHlwZSA9PT0gJ1Jlc3RFbGVtZW50Jykge1xuICAgICAgICAgIGNhbGxiYWNrKGVsZW1lbnQuYXJndW1lbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnQXNzaWdubWVudFBhdHRlcm4nOlxuICAgICAgY2FsbGJhY2socGF0dGVybi5sZWZ0KTtcbiAgICAgIGJyZWFrO1xuICAgIGRlZmF1bHQ6XG4gIH1cbn1cblxubGV0IHBhcnNlck9wdGlvbnNIYXNoID0gJyc7XG5sZXQgcHJldlBhcnNlck9wdGlvbnMgPSAnJztcbmxldCBzZXR0aW5nc0hhc2ggPSAnJztcbmxldCBwcmV2U2V0dGluZ3MgPSAnJztcbi8qKlxuICogZG9uJ3QgaG9sZCBmdWxsIGNvbnRleHQgb2JqZWN0IGluIG1lbW9yeSwganVzdCBncmFiIHdoYXQgd2UgbmVlZC5cbiAqIGFsc28gY2FsY3VsYXRlIGEgY2FjaGVLZXksIHdoZXJlIHBhcnRzIG9mIHRoZSBjYWNoZUtleSBoYXNoIGFyZSBtZW1vaXplZFxuICovXG5mdW5jdGlvbiBjaGlsZENvbnRleHQocGF0aCwgY29udGV4dCkge1xuICBjb25zdCB7IHNldHRpbmdzLCBwYXJzZXJPcHRpb25zLCBwYXJzZXJQYXRoIH0gPSBjb250ZXh0O1xuXG4gIGlmIChKU09OLnN0cmluZ2lmeShzZXR0aW5ncykgIT09IHByZXZTZXR0aW5ncykge1xuICAgIHNldHRpbmdzSGFzaCA9IGhhc2hPYmplY3QoeyBzZXR0aW5ncyB9KS5kaWdlc3QoJ2hleCcpO1xuICAgIHByZXZTZXR0aW5ncyA9IEpTT04uc3RyaW5naWZ5KHNldHRpbmdzKTtcbiAgfVxuXG4gIGlmIChKU09OLnN0cmluZ2lmeShwYXJzZXJPcHRpb25zKSAhPT0gcHJldlBhcnNlck9wdGlvbnMpIHtcbiAgICBwYXJzZXJPcHRpb25zSGFzaCA9IGhhc2hPYmplY3QoeyBwYXJzZXJPcHRpb25zIH0pLmRpZ2VzdCgnaGV4Jyk7XG4gICAgcHJldlBhcnNlck9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeShwYXJzZXJPcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2FjaGVLZXk6IFN0cmluZyhwYXJzZXJQYXRoKSArIHBhcnNlck9wdGlvbnNIYXNoICsgc2V0dGluZ3NIYXNoICsgU3RyaW5nKHBhdGgpLFxuICAgIHNldHRpbmdzLFxuICAgIHBhcnNlck9wdGlvbnMsXG4gICAgcGFyc2VyUGF0aCxcbiAgICBwYXRoLFxuICB9O1xufVxuXG4vKipcbiAqIHNvbWV0aW1lcyBsZWdhY3kgc3VwcG9ydCBpc24ndCBfdGhhdF8gaGFyZC4uLiByaWdodD9cbiAqL1xuZnVuY3Rpb24gbWFrZVNvdXJjZUNvZGUodGV4dCwgYXN0KSB7XG4gIGlmIChTb3VyY2VDb2RlLmxlbmd0aCA+IDEpIHtcbiAgICAvLyBFU0xpbnQgM1xuICAgIHJldHVybiBuZXcgU291cmNlQ29kZSh0ZXh0LCBhc3QpO1xuICB9IGVsc2Uge1xuICAgIC8vIEVTTGludCA0LCA1XG4gICAgcmV0dXJuIG5ldyBTb3VyY2VDb2RlKHsgdGV4dCwgYXN0IH0pO1xuICB9XG59XG4iXX0=