'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _ExportMap = require('../ExportMap');var _ExportMap2 = _interopRequireDefault(_ExportMap);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var includes = Function.bind.bind(Function.prototype.call)(Array.prototype.includes);
var flatMap = Function.bind.bind(Function.prototype.call)(Array.prototype.flatMap);

/*
                                                                                    Notes on TypeScript namespaces aka TSModuleDeclaration:
                                                                                    
                                                                                    There are two forms:
                                                                                    - active namespaces: namespace Foo {} / module Foo {}
                                                                                    - ambient modules; declare module "eslint-plugin-import" {}
                                                                                    
                                                                                    active namespaces:
                                                                                    - cannot contain a default export
                                                                                    - cannot contain an export all
                                                                                    - cannot contain a multi name export (export { a, b })
                                                                                    - can have active namespaces nested within them
                                                                                    
                                                                                    ambient namespaces:
                                                                                    - can only be defined in .d.ts files
                                                                                    - cannot be nested within active namespaces
                                                                                    - have no other restrictions
                                                                                    */

var rootProgram = 'root';
var tsTypePrefix = 'type:';

/**
                             * Detect function overloads like:
                             * ```ts
                             * export function foo(a: number);
                             * export function foo(a: string);
                             * export function foo(a: number|string) { return a; }
                             * ```
                             * @param {Set<Object>} nodes
                             * @returns {boolean}
                             */
function isTypescriptFunctionOverloads(nodes) {
  var nodesArr = Array.from(nodes);

  var idents = flatMap(
  nodesArr,
  function (node) {return node.declaration && (
    node.declaration.type === 'TSDeclareFunction' // eslint 6+
    || node.declaration.type === 'TSEmptyBodyFunctionDeclaration' // eslint 4-5
    ) ?
    node.declaration.id.name :
    [];});

  if (new Set(idents).size !== idents.length) {
    return true;
  }

  var types = new Set(nodesArr.map(function (node) {return node.parent.type;}));
  if (!types.has('TSDeclareFunction')) {
    return false;
  }
  if (types.size === 1) {
    return true;
  }
  if (types.size === 2 && types.has('FunctionDeclaration')) {
    return true;
  }
  return false;
}

/**
   * Detect merging Namespaces with Classes, Functions, or Enums like:
   * ```ts
   * export class Foo { }
   * export namespace Foo { }
   * ```
   * @param {Set<Object>} nodes
   * @returns {boolean}
   */
function isTypescriptNamespaceMerging(nodes) {
  var types = new Set(Array.from(nodes, function (node) {return node.parent.type;}));
  var noNamespaceNodes = Array.from(nodes).filter(function (node) {return node.parent.type !== 'TSModuleDeclaration';});

  return types.has('TSModuleDeclaration') && (

  types.size === 1
  // Merging with functions
  || types.size === 2 && (types.has('FunctionDeclaration') || types.has('TSDeclareFunction')) ||
  types.size === 3 && types.has('FunctionDeclaration') && types.has('TSDeclareFunction')
  // Merging with classes or enums
  || types.size === 2 && (types.has('ClassDeclaration') || types.has('TSEnumDeclaration')) && noNamespaceNodes.length === 1);

}

/**
   * Detect if a typescript namespace node should be reported as multiple export:
   * ```ts
   * export class Foo { }
   * export function Foo();
   * export namespace Foo { }
   * ```
   * @param {Object} node
   * @param {Set<Object>} nodes
   * @returns {boolean}
   */
function shouldSkipTypescriptNamespace(node, nodes) {
  var types = new Set(Array.from(nodes, function (node) {return node.parent.type;}));

  return !isTypescriptNamespaceMerging(nodes) &&
  node.parent.type === 'TSModuleDeclaration' && (

  types.has('TSEnumDeclaration') ||
  types.has('ClassDeclaration') ||
  types.has('FunctionDeclaration') ||
  types.has('TSDeclareFunction'));

}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Helpful warnings',
      description: 'Forbid any invalid exports, i.e. re-export of the same name.',
      url: (0, _docsUrl2['default'])('export') },

    schema: [] },


  create: function () {function create(context) {
      var namespace = new Map([[rootProgram, new Map()]]);

      function addNamed(name, node, parent, isType) {
        if (!namespace.has(parent)) {
          namespace.set(parent, new Map());
        }
        var named = namespace.get(parent);

        var key = isType ? '' + tsTypePrefix + String(name) : name;
        var nodes = named.get(key);

        if (nodes == null) {
          nodes = new Set();
          named.set(key, nodes);
        }

        nodes.add(node);
      }

      function getParent(node) {
        if (node.parent && node.parent.type === 'TSModuleBlock') {
          return node.parent.parent;
        }

        // just in case somehow a non-ts namespace export declaration isn't directly
        // parented to the root Program node
        return rootProgram;
      }

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {
            addNamed('default', node, getParent(node));
          }return ExportDefaultDeclaration;}(),

        ExportSpecifier: function () {function ExportSpecifier(node) {
            addNamed(
            node.exported.name || node.exported.value,
            node.exported,
            getParent(node.parent));

          }return ExportSpecifier;}(),

        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            if (node.declaration == null) {return;}

            var parent = getParent(node);
            // support for old TypeScript versions
            var isTypeVariableDecl = node.declaration.kind === 'type';

            if (node.declaration.id != null) {
              if (includes([
              'TSTypeAliasDeclaration',
              'TSInterfaceDeclaration'],
              node.declaration.type)) {
                addNamed(node.declaration.id.name, node.declaration.id, parent, true);
              } else {
                addNamed(node.declaration.id.name, node.declaration.id, parent, isTypeVariableDecl);
              }
            }

            if (node.declaration.declarations != null) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
                for (var _iterator = node.declaration.declarations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var declaration = _step.value;
                  (0, _ExportMap.recursivePatternCapture)(declaration.id, function (v) {addNamed(v.name, v, parent, isTypeVariableDecl);});
                }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
            }
          }return ExportNamedDeclaration;}(),

        ExportAllDeclaration: function () {function ExportAllDeclaration(node) {
            if (node.source == null) {return;} // not sure if this is ever true

            // `export * as X from 'path'` does not conflict
            if (node.exported && node.exported.name) {return;}

            var remoteExports = _ExportMap2['default'].get(node.source.value, context);
            if (remoteExports == null) {return;}

            if (remoteExports.errors.length) {
              remoteExports.reportErrors(context, node);
              return;
            }

            var parent = getParent(node);

            var any = false;
            remoteExports.forEach(function (v, name) {
              if (name !== 'default') {
                any = true; // poor man's filter
                addNamed(name, node, parent);
              }
            });

            if (!any) {
              context.report(
              node.source, 'No named exports found in module \'' + String(
              node.source.value) + '\'.');

            }
          }return ExportAllDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {
              for (var _iterator2 = namespace[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var _ref = _step2.value;var _ref2 = _slicedToArray(_ref, 2);var named = _ref2[1];var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {
                  for (var _iterator3 = named[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var _ref3 = _step3.value;var _ref4 = _slicedToArray(_ref3, 2);var name = _ref4[0];var nodes = _ref4[1];
                    if (nodes.size <= 1) {continue;}

                    if (isTypescriptFunctionOverloads(nodes) || isTypescriptNamespaceMerging(nodes)) {continue;}var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {

                      for (var _iterator4 = nodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
                        if (shouldSkipTypescriptNamespace(node, nodes)) {continue;}

                        if (name === 'default') {
                          context.report(node, 'Multiple default exports.');
                        } else {
                          context.report(
                          node, 'Multiple exports of name \'' + String(
                          name.replace(tsTypePrefix, '')) + '\'.');

                        }
                      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}
                  }} catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}
              }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHBvcnQuanMiXSwibmFtZXMiOlsiaW5jbHVkZXMiLCJGdW5jdGlvbiIsImJpbmQiLCJwcm90b3R5cGUiLCJjYWxsIiwiQXJyYXkiLCJmbGF0TWFwIiwicm9vdFByb2dyYW0iLCJ0c1R5cGVQcmVmaXgiLCJpc1R5cGVzY3JpcHRGdW5jdGlvbk92ZXJsb2FkcyIsIm5vZGVzIiwibm9kZXNBcnIiLCJmcm9tIiwiaWRlbnRzIiwibm9kZSIsImRlY2xhcmF0aW9uIiwidHlwZSIsImlkIiwibmFtZSIsIlNldCIsInNpemUiLCJsZW5ndGgiLCJ0eXBlcyIsIm1hcCIsInBhcmVudCIsImhhcyIsImlzVHlwZXNjcmlwdE5hbWVzcGFjZU1lcmdpbmciLCJub05hbWVzcGFjZU5vZGVzIiwiZmlsdGVyIiwic2hvdWxkU2tpcFR5cGVzY3JpcHROYW1lc3BhY2UiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiY3JlYXRlIiwiY29udGV4dCIsIm5hbWVzcGFjZSIsIk1hcCIsImFkZE5hbWVkIiwiaXNUeXBlIiwic2V0IiwibmFtZWQiLCJnZXQiLCJrZXkiLCJhZGQiLCJnZXRQYXJlbnQiLCJFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24iLCJFeHBvcnRTcGVjaWZpZXIiLCJleHBvcnRlZCIsInZhbHVlIiwiRXhwb3J0TmFtZWREZWNsYXJhdGlvbiIsImlzVHlwZVZhcmlhYmxlRGVjbCIsImtpbmQiLCJkZWNsYXJhdGlvbnMiLCJ2IiwiRXhwb3J0QWxsRGVjbGFyYXRpb24iLCJzb3VyY2UiLCJyZW1vdGVFeHBvcnRzIiwiRXhwb3J0TWFwIiwiZXJyb3JzIiwicmVwb3J0RXJyb3JzIiwiYW55IiwiZm9yRWFjaCIsInJlcG9ydCIsInJlcGxhY2UiXSwibWFwcGluZ3MiOiJxb0JBQUEseUM7QUFDQSxxQzs7QUFFQSxJQUFNQSxXQUFXQyxTQUFTQyxJQUFULENBQWNB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O0FBQ0VyRCw4QkFERjtBQUUrQkksK0JBQUtrRCxPQUFMLENBQWE1RCxZQUFiLEVBQTJCLEVBQTNCLENBRi9COztBQUlEO0FBQ0YsdUJBaEJnQztBQWlCbEMsbUJBbEJnQztBQW1CbEMsZUFwQmM7QUFxQmhCLFdBM0ZJLHdCQUFQOztBQTZGRCxLQXRJYyxtQkFBakIiLCJmaWxlIjoiZXhwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cG9ydE1hcCwgeyByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZSB9IGZyb20gJy4uL0V4cG9ydE1hcCc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuY29uc3QgaW5jbHVkZXMgPSBGdW5jdGlvbi5iaW5kLmJpbmQoRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwpKEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XG5jb25zdCBmbGF0TWFwID0gRnVuY3Rpb24uYmluZC5iaW5kKEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsKShBcnJheS5wcm90b3R5cGUuZmxhdE1hcCk7XG5cbi8qXG5Ob3RlcyBvbiBUeXBlU2NyaXB0IG5hbWVzcGFjZXMgYWthIFRTTW9kdWxlRGVjbGFyYXRpb246XG5cblRoZXJlIGFyZSB0d28gZm9ybXM6XG4tIGFjdGl2ZSBuYW1lc3BhY2VzOiBuYW1lc3BhY2UgRm9vIHt9IC8gbW9kdWxlIEZvbyB7fVxuLSBhbWJpZW50IG1vZHVsZXM7IGRlY2xhcmUgbW9kdWxlIFwiZXNsaW50LXBsdWdpbi1pbXBvcnRcIiB7fVxuXG5hY3RpdmUgbmFtZXNwYWNlczpcbi0gY2Fubm90IGNvbnRhaW4gYSBkZWZhdWx0IGV4cG9ydFxuLSBjYW5ub3QgY29udGFpbiBhbiBleHBvcnQgYWxsXG4tIGNhbm5vdCBjb250YWluIGEgbXVsdGkgbmFtZSBleHBvcnQgKGV4cG9ydCB7IGEsIGIgfSlcbi0gY2FuIGhhdmUgYWN0aXZlIG5hbWVzcGFjZXMgbmVzdGVkIHdpdGhpbiB0aGVtXG5cbmFtYmllbnQgbmFtZXNwYWNlczpcbi0gY2FuIG9ubHkgYmUgZGVmaW5lZCBpbiAuZC50cyBmaWxlc1xuLSBjYW5ub3QgYmUgbmVzdGVkIHdpdGhpbiBhY3RpdmUgbmFtZXNwYWNlc1xuLSBoYXZlIG5vIG90aGVyIHJlc3RyaWN0aW9uc1xuKi9cblxuY29uc3Qgcm9vdFByb2dyYW0gPSAncm9vdCc7XG5jb25zdCB0c1R5cGVQcmVmaXggPSAndHlwZTonO1xuXG4vKipcbiAqIERldGVjdCBmdW5jdGlvbiBvdmVybG9hZHMgbGlrZTpcbiAqIGBgYHRzXG4gKiBleHBvcnQgZnVuY3Rpb24gZm9vKGE6IG51bWJlcik7XG4gKiBleHBvcnQgZnVuY3Rpb24gZm9vKGE6IHN0cmluZyk7XG4gKiBleHBvcnQgZnVuY3Rpb24gZm9vKGE6IG51bWJlcnxzdHJpbmcpIHsgcmV0dXJuIGE7IH1cbiAqIGBgYFxuICogQHBhcmFtIHtTZXQ8T2JqZWN0Pn0gbm9kZXNcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBpc1R5cGVzY3JpcHRGdW5jdGlvbk92ZXJsb2Fkcyhub2Rlcykge1xuICBjb25zdCBub2Rlc0FyciA9IEFycmF5LmZyb20obm9kZXMpO1xuXG4gIGNvbnN0IGlkZW50cyA9IGZsYXRNYXAoXG4gICAgbm9kZXNBcnIsXG4gICAgKG5vZGUpID0+IG5vZGUuZGVjbGFyYXRpb24gJiYgKFxuICAgICAgbm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnVFNEZWNsYXJlRnVuY3Rpb24nIC8vIGVzbGludCA2K1xuICAgICAgfHwgbm9kZS5kZWNsYXJhdGlvbi50eXBlID09PSAnVFNFbXB0eUJvZHlGdW5jdGlvbkRlY2xhcmF0aW9uJyAvLyBlc2xpbnQgNC01XG4gICAgKVxuICAgICAgPyBub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWVcbiAgICAgIDogW10sXG4gICk7XG4gIGlmIChuZXcgU2V0KGlkZW50cykuc2l6ZSAhPT0gaWRlbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3QgdHlwZXMgPSBuZXcgU2V0KG5vZGVzQXJyLm1hcCgobm9kZSkgPT4gbm9kZS5wYXJlbnQudHlwZSkpO1xuICBpZiAoIXR5cGVzLmhhcygnVFNEZWNsYXJlRnVuY3Rpb24nKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZXMuc2l6ZSA9PT0gMSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh0eXBlcy5zaXplID09PSAyICYmIHR5cGVzLmhhcygnRnVuY3Rpb25EZWNsYXJhdGlvbicpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIERldGVjdCBtZXJnaW5nIE5hbWVzcGFjZXMgd2l0aCBDbGFzc2VzLCBGdW5jdGlvbnMsIG9yIEVudW1zIGxpa2U6XG4gKiBgYGB0c1xuICogZXhwb3J0IGNsYXNzIEZvbyB7IH1cbiAqIGV4cG9ydCBuYW1lc3BhY2UgRm9vIHsgfVxuICogYGBgXG4gKiBAcGFyYW0ge1NldDxPYmplY3Q+fSBub2Rlc1xuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGlzVHlwZXNjcmlwdE5hbWVzcGFjZU1lcmdpbmcobm9kZXMpIHtcbiAgY29uc3QgdHlwZXMgPSBuZXcgU2V0KEFycmF5LmZyb20obm9kZXMsIChub2RlKSA9PiBub2RlLnBhcmVudC50eXBlKSk7XG4gIGNvbnN0IG5vTmFtZXNwYWNlTm9kZXMgPSBBcnJheS5mcm9tKG5vZGVzKS5maWx0ZXIoKG5vZGUpID0+IG5vZGUucGFyZW50LnR5cGUgIT09ICdUU01vZHVsZURlY2xhcmF0aW9uJyk7XG5cbiAgcmV0dXJuIHR5cGVzLmhhcygnVFNNb2R1bGVEZWNsYXJhdGlvbicpXG4gICAgJiYgKFxuICAgICAgdHlwZXMuc2l6ZSA9PT0gMVxuICAgICAgLy8gTWVyZ2luZyB3aXRoIGZ1bmN0aW9uc1xuICAgICAgfHwgdHlwZXMuc2l6ZSA9PT0gMiAmJiAodHlwZXMuaGFzKCdGdW5jdGlvbkRlY2xhcmF0aW9uJykgfHwgdHlwZXMuaGFzKCdUU0RlY2xhcmVGdW5jdGlvbicpKVxuICAgICAgfHwgdHlwZXMuc2l6ZSA9PT0gMyAmJiB0eXBlcy5oYXMoJ0Z1bmN0aW9uRGVjbGFyYXRpb24nKSAmJiB0eXBlcy5oYXMoJ1RTRGVjbGFyZUZ1bmN0aW9uJylcbiAgICAgIC8vIE1lcmdpbmcgd2l0aCBjbGFzc2VzIG9yIGVudW1zXG4gICAgICB8fCB0eXBlcy5zaXplID09PSAyICYmICh0eXBlcy5oYXMoJ0NsYXNzRGVjbGFyYXRpb24nKSB8fCB0eXBlcy5oYXMoJ1RTRW51bURlY2xhcmF0aW9uJykpICYmIG5vTmFtZXNwYWNlTm9kZXMubGVuZ3RoID09PSAxXG4gICAgKTtcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgYSB0eXBlc2NyaXB0IG5hbWVzcGFjZSBub2RlIHNob3VsZCBiZSByZXBvcnRlZCBhcyBtdWx0aXBsZSBleHBvcnQ6XG4gKiBgYGB0c1xuICogZXhwb3J0IGNsYXNzIEZvbyB7IH1cbiAqIGV4cG9ydCBmdW5jdGlvbiBGb28oKTtcbiAqIGV4cG9ydCBuYW1lc3BhY2UgRm9vIHsgfVxuICogYGBgXG4gKiBAcGFyYW0ge09iamVjdH0gbm9kZVxuICogQHBhcmFtIHtTZXQ8T2JqZWN0Pn0gbm9kZXNcbiAqIEByZXR1cm5zIHtib29sZWFufVxuICovXG5mdW5jdGlvbiBzaG91bGRTa2lwVHlwZXNjcmlwdE5hbWVzcGFjZShub2RlLCBub2Rlcykge1xuICBjb25zdCB0eXBlcyA9IG5ldyBTZXQoQXJyYXkuZnJvbShub2RlcywgKG5vZGUpID0+IG5vZGUucGFyZW50LnR5cGUpKTtcblxuICByZXR1cm4gIWlzVHlwZXNjcmlwdE5hbWVzcGFjZU1lcmdpbmcobm9kZXMpXG4gICAgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ1RTTW9kdWxlRGVjbGFyYXRpb24nXG4gICAgJiYgKFxuICAgICAgdHlwZXMuaGFzKCdUU0VudW1EZWNsYXJhdGlvbicpXG4gICAgICB8fCB0eXBlcy5oYXMoJ0NsYXNzRGVjbGFyYXRpb24nKVxuICAgICAgfHwgdHlwZXMuaGFzKCdGdW5jdGlvbkRlY2xhcmF0aW9uJylcbiAgICAgIHx8IHR5cGVzLmhhcygnVFNEZWNsYXJlRnVuY3Rpb24nKVxuICAgICk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnSGVscGZ1bCB3YXJuaW5ncycsXG4gICAgICBkZXNjcmlwdGlvbjogJ0ZvcmJpZCBhbnkgaW52YWxpZCBleHBvcnRzLCBpLmUuIHJlLWV4cG9ydCBvZiB0aGUgc2FtZSBuYW1lLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ2V4cG9ydCcpLFxuICAgIH0sXG4gICAgc2NoZW1hOiBbXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGNvbnN0IG5hbWVzcGFjZSA9IG5ldyBNYXAoW1tyb290UHJvZ3JhbSwgbmV3IE1hcCgpXV0pO1xuXG4gICAgZnVuY3Rpb24gYWRkTmFtZWQobmFtZSwgbm9kZSwgcGFyZW50LCBpc1R5cGUpIHtcbiAgICAgIGlmICghbmFtZXNwYWNlLmhhcyhwYXJlbnQpKSB7XG4gICAgICAgIG5hbWVzcGFjZS5zZXQocGFyZW50LCBuZXcgTWFwKCkpO1xuICAgICAgfVxuICAgICAgY29uc3QgbmFtZWQgPSBuYW1lc3BhY2UuZ2V0KHBhcmVudCk7XG5cbiAgICAgIGNvbnN0IGtleSA9IGlzVHlwZSA/IGAke3RzVHlwZVByZWZpeH0ke25hbWV9YCA6IG5hbWU7XG4gICAgICBsZXQgbm9kZXMgPSBuYW1lZC5nZXQoa2V5KTtcblxuICAgICAgaWYgKG5vZGVzID09IG51bGwpIHtcbiAgICAgICAgbm9kZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIG5hbWVkLnNldChrZXksIG5vZGVzKTtcbiAgICAgIH1cblxuICAgICAgbm9kZXMuYWRkKG5vZGUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFBhcmVudChub2RlKSB7XG4gICAgICBpZiAobm9kZS5wYXJlbnQgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ1RTTW9kdWxlQmxvY2snKSB7XG4gICAgICAgIHJldHVybiBub2RlLnBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIC8vIGp1c3QgaW4gY2FzZSBzb21laG93IGEgbm9uLXRzIG5hbWVzcGFjZSBleHBvcnQgZGVjbGFyYXRpb24gaXNuJ3QgZGlyZWN0bHlcbiAgICAgIC8vIHBhcmVudGVkIHRvIHRoZSByb290IFByb2dyYW0gbm9kZVxuICAgICAgcmV0dXJuIHJvb3RQcm9ncmFtO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBhZGROYW1lZCgnZGVmYXVsdCcsIG5vZGUsIGdldFBhcmVudChub2RlKSk7XG4gICAgICB9LFxuXG4gICAgICBFeHBvcnRTcGVjaWZpZXIobm9kZSkge1xuICAgICAgICBhZGROYW1lZChcbiAgICAgICAgICBub2RlLmV4cG9ydGVkLm5hbWUgfHwgbm9kZS5leHBvcnRlZC52YWx1ZSxcbiAgICAgICAgICBub2RlLmV4cG9ydGVkLFxuICAgICAgICAgIGdldFBhcmVudChub2RlLnBhcmVudCksXG4gICAgICAgICk7XG4gICAgICB9LFxuXG4gICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24gPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBwYXJlbnQgPSBnZXRQYXJlbnQobm9kZSk7XG4gICAgICAgIC8vIHN1cHBvcnQgZm9yIG9sZCBUeXBlU2NyaXB0IHZlcnNpb25zXG4gICAgICAgIGNvbnN0IGlzVHlwZVZhcmlhYmxlRGVjbCA9IG5vZGUuZGVjbGFyYXRpb24ua2luZCA9PT0gJ3R5cGUnO1xuXG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLmlkICE9IG51bGwpIHtcbiAgICAgICAgICBpZiAoaW5jbHVkZXMoW1xuICAgICAgICAgICAgJ1RTVHlwZUFsaWFzRGVjbGFyYXRpb24nLFxuICAgICAgICAgICAgJ1RTSW50ZXJmYWNlRGVjbGFyYXRpb24nLFxuICAgICAgICAgIF0sIG5vZGUuZGVjbGFyYXRpb24udHlwZSkpIHtcbiAgICAgICAgICAgIGFkZE5hbWVkKG5vZGUuZGVjbGFyYXRpb24uaWQubmFtZSwgbm9kZS5kZWNsYXJhdGlvbi5pZCwgcGFyZW50LCB0cnVlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkTmFtZWQobm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lLCBub2RlLmRlY2xhcmF0aW9uLmlkLCBwYXJlbnQsIGlzVHlwZVZhcmlhYmxlRGVjbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zICE9IG51bGwpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGRlY2xhcmF0aW9uIG9mIG5vZGUuZGVjbGFyYXRpb24uZGVjbGFyYXRpb25zKSB7XG4gICAgICAgICAgICByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZShkZWNsYXJhdGlvbi5pZCwgKHYpID0+IHsgYWRkTmFtZWQodi5uYW1lLCB2LCBwYXJlbnQsIGlzVHlwZVZhcmlhYmxlRGVjbCk7IH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgRXhwb3J0QWxsRGVjbGFyYXRpb24obm9kZSkge1xuICAgICAgICBpZiAobm9kZS5zb3VyY2UgPT0gbnVsbCkgeyByZXR1cm47IH0gLy8gbm90IHN1cmUgaWYgdGhpcyBpcyBldmVyIHRydWVcblxuICAgICAgICAvLyBgZXhwb3J0ICogYXMgWCBmcm9tICdwYXRoJ2AgZG9lcyBub3QgY29uZmxpY3RcbiAgICAgICAgaWYgKG5vZGUuZXhwb3J0ZWQgJiYgbm9kZS5leHBvcnRlZC5uYW1lKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGNvbnN0IHJlbW90ZUV4cG9ydHMgPSBFeHBvcnRNYXAuZ2V0KG5vZGUuc291cmNlLnZhbHVlLCBjb250ZXh0KTtcbiAgICAgICAgaWYgKHJlbW90ZUV4cG9ydHMgPT0gbnVsbCkgeyByZXR1cm47IH1cblxuICAgICAgICBpZiAocmVtb3RlRXhwb3J0cy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgcmVtb3RlRXhwb3J0cy5yZXBvcnRFcnJvcnMoY29udGV4dCwgbm9kZSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcGFyZW50ID0gZ2V0UGFyZW50KG5vZGUpO1xuXG4gICAgICAgIGxldCBhbnkgPSBmYWxzZTtcbiAgICAgICAgcmVtb3RlRXhwb3J0cy5mb3JFYWNoKCh2LCBuYW1lKSA9PiB7XG4gICAgICAgICAgaWYgKG5hbWUgIT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgICAgYW55ID0gdHJ1ZTsgLy8gcG9vciBtYW4ncyBmaWx0ZXJcbiAgICAgICAgICAgIGFkZE5hbWVkKG5hbWUsIG5vZGUsIHBhcmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoIWFueSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgbm9kZS5zb3VyY2UsXG4gICAgICAgICAgICBgTm8gbmFtZWQgZXhwb3J0cyBmb3VuZCBpbiBtb2R1bGUgJyR7bm9kZS5zb3VyY2UudmFsdWV9Jy5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdQcm9ncmFtOmV4aXQnKCkge1xuICAgICAgICBmb3IgKGNvbnN0IFssIG5hbWVkXSBvZiBuYW1lc3BhY2UpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IFtuYW1lLCBub2Rlc10gb2YgbmFtZWQpIHtcbiAgICAgICAgICAgIGlmIChub2Rlcy5zaXplIDw9IDEpIHsgY29udGludWU7IH1cblxuICAgICAgICAgICAgaWYgKGlzVHlwZXNjcmlwdEZ1bmN0aW9uT3ZlcmxvYWRzKG5vZGVzKSB8fCBpc1R5cGVzY3JpcHROYW1lc3BhY2VNZXJnaW5nKG5vZGVzKSkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKHNob3VsZFNraXBUeXBlc2NyaXB0TmFtZXNwYWNlKG5vZGUsIG5vZGVzKSkgeyBjb250aW51ZTsgfVxuXG4gICAgICAgICAgICAgIGlmIChuYW1lID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCAnTXVsdGlwbGUgZGVmYXVsdCBleHBvcnRzLicpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICAgICAgIGBNdWx0aXBsZSBleHBvcnRzIG9mIG5hbWUgJyR7bmFtZS5yZXBsYWNlKHRzVHlwZVByZWZpeCwgJycpfScuYCxcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19