'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _semver = require('semver');var _semver2 = _interopRequireDefault(_semver);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {arr2[i] = arr[i];}return arr2;} else {return Array.from(arr);}}function _toArray(arr) {return Array.isArray(arr) ? arr : Array.from(arr);}

var typescriptPkg = void 0;
try {
  typescriptPkg = require('typescript/package.json'); // eslint-disable-line import/no-extraneous-dependencies
} catch (e) {/**/}

function checkImports(imported, context) {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = imported.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var _ref = _step.value;var _ref2 = _slicedToArray(_ref, 2);var _module = _ref2[0];var nodes = _ref2[1];
      if (nodes.length > 1) {
        var message = '\'' + String(_module) + '\' imported multiple times.';var _nodes = _toArray(
        nodes),first = _nodes[0],rest = _nodes.slice(1);
        var sourceCode = context.getSourceCode();
        var fix = getFix(first, rest, sourceCode, context);

        context.report({
          node: first.source,
          message: message,
          fix: fix // Attach the autofix (if any) to the first import.
        });var _iteratorNormalCompletion2 = true;var _didIteratorError2 = false;var _iteratorError2 = undefined;try {

          for (var _iterator2 = rest[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {var node = _step2.value;
            context.report({
              node: node.source,
              message: message });

          }} catch (err) {_didIteratorError2 = true;_iteratorError2 = err;} finally {try {if (!_iteratorNormalCompletion2 && _iterator2['return']) {_iterator2['return']();}} finally {if (_didIteratorError2) {throw _iteratorError2;}}}
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
}

function getFix(first, rest, sourceCode, context) {
  // Sorry ESLint <= 3 users, no autofix for you. Autofixing duplicate imports
  // requires multiple `fixer.whatever()` calls in the `fix`: We both need to
  // update the first one, and remove the rest. Support for multiple
  // `fixer.whatever()` in a single `fix` was added in ESLint 4.1.
  // `sourceCode.getCommentsBefore` was added in 4.0, so that's an easy thing to
  // check for.
  if (typeof sourceCode.getCommentsBefore !== 'function') {
    return undefined;
  }

  // Adjusting the first import might make it multiline, which could break
  // `eslint-disable-next-line` comments and similar, so bail if the first
  // import has comments. Also, if the first import is `import * as ns from
  // './foo'` there's nothing we can do.
  if (hasProblematicComments(first, sourceCode) || hasNamespace(first)) {
    return undefined;
  }

  var defaultImportNames = new Set(
  [first].concat(_toConsumableArray(rest)).map(getDefaultImportName).filter(Boolean));


  // Bail if there are multiple different default import names – it's up to the
  // user to choose which one to keep.
  if (defaultImportNames.size > 1) {
    return undefined;
  }

  // Leave it to the user to handle comments. Also skip `import * as ns from
  // './foo'` imports, since they cannot be merged into another import.
  var restWithoutComments = rest.filter(function (node) {return !(
    hasProblematicComments(node, sourceCode) ||
    hasNamespace(node));});


  var specifiers = restWithoutComments.
  map(function (node) {
    var tokens = sourceCode.getTokens(node);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});

    if (openBrace == null || closeBrace == null) {
      return undefined;
    }

    return {
      importNode: node,
      identifiers: sourceCode.text.slice(openBrace.range[1], closeBrace.range[0]).split(','), // Split the text into separate identifiers (retaining any whitespace before or after)
      isEmpty: !hasSpecifiers(node) };

  }).
  filter(Boolean);

  var unnecessaryImports = restWithoutComments.filter(function (node) {return !hasSpecifiers(node) &&
    !hasNamespace(node) &&
    !specifiers.some(function (specifier) {return specifier.importNode === node;});});


  var shouldAddDefault = getDefaultImportName(first) == null && defaultImportNames.size === 1;
  var shouldAddSpecifiers = specifiers.length > 0;
  var shouldRemoveUnnecessary = unnecessaryImports.length > 0;

  if (!(shouldAddDefault || shouldAddSpecifiers || shouldRemoveUnnecessary)) {
    return undefined;
  }

  return function (fixer) {
    var tokens = sourceCode.getTokens(first);
    var openBrace = tokens.find(function (token) {return isPunctuator(token, '{');});
    var closeBrace = tokens.find(function (token) {return isPunctuator(token, '}');});
    var firstToken = sourceCode.getFirstToken(first);var _defaultImportNames = _slicedToArray(
    defaultImportNames, 1),defaultImportName = _defaultImportNames[0];

    var firstHasTrailingComma = closeBrace != null && isPunctuator(sourceCode.getTokenBefore(closeBrace), ',');
    var firstIsEmpty = !hasSpecifiers(first);
    var firstExistingIdentifiers = firstIsEmpty ?
    new Set() :
    new Set(sourceCode.text.slice(openBrace.range[1], closeBrace.range[0]).
    split(',').
    map(function (x) {return x.trim();}));var _specifiers$reduce =


    specifiers.reduce(
    function (_ref3, specifier) {var _ref4 = _slicedToArray(_ref3, 3),result = _ref4[0],needsComma = _ref4[1],existingIdentifiers = _ref4[2];
      var isTypeSpecifier = specifier.importNode.importKind === 'type';

      var preferInline = context.options[0] && context.options[0]['prefer-inline'];
      // a user might set prefer-inline but not have a supporting TypeScript version.  Flow does not support inline types so this should fail in that case as well.
      if (preferInline && (!typescriptPkg || !_semver2['default'].satisfies(typescriptPkg.version, '>= 4.5'))) {
        throw new Error('Your version of TypeScript does not support inline type imports.');
      }

      // Add *only* the new identifiers that don't already exist, and track any new identifiers so we don't add them again in the next loop
      var _specifier$identifier = specifier.identifiers.reduce(function (_ref5, cur) {var _ref6 = _slicedToArray(_ref5, 2),text = _ref6[0],set = _ref6[1];
        var trimmed = cur.trim(); // Trim whitespace before/after to compare to our set of existing identifiers
        var curWithType = trimmed.length > 0 && preferInline && isTypeSpecifier ? 'type ' + String(cur) : cur;
        if (existingIdentifiers.has(trimmed)) {
          return [text, set];
        }
        return [text.length > 0 ? String(text) + ',' + String(curWithType) : curWithType, set.add(trimmed)];
      }, ['', existingIdentifiers]),_specifier$identifier2 = _slicedToArray(_specifier$identifier, 2),specifierText = _specifier$identifier2[0],updatedExistingIdentifiers = _specifier$identifier2[1];

      return [
      needsComma && !specifier.isEmpty && specifierText.length > 0 ? String(
      result) + ',' + String(specifierText) : '' + String(
      result) + String(specifierText),
      specifier.isEmpty ? needsComma : true,
      updatedExistingIdentifiers];

    },
    ['', !firstHasTrailingComma && !firstIsEmpty, firstExistingIdentifiers]),_specifiers$reduce2 = _slicedToArray(_specifiers$reduce, 1),specifiersText = _specifiers$reduce2[0];


    var fixes = [];

    if (shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      // `import './foo'` → `import def, {...} from './foo'`
      fixes.push(
      fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ', {' + String(specifiersText) + '} from'));

    } else if (shouldAddDefault && openBrace == null && !shouldAddSpecifiers) {
      // `import './foo'` → `import def from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ' from'));
    } else if (shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} from './foo'` → `import def, {...} from './foo'`
      fixes.push(fixer.insertTextAfter(firstToken, ' ' + String(defaultImportName) + ','));
      if (shouldAddSpecifiers) {
        // `import def, {...} from './foo'` → `import def, {..., ...} from './foo'`
        fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
      }
    } else if (!shouldAddDefault && openBrace == null && shouldAddSpecifiers) {
      if (first.specifiers.length === 0) {
        // `import './foo'` → `import {...} from './foo'`
        fixes.push(fixer.insertTextAfter(firstToken, ' {' + String(specifiersText) + '} from'));
      } else {
        // `import def from './foo'` → `import def, {...} from './foo'`
        fixes.push(fixer.insertTextAfter(first.specifiers[0], ', {' + String(specifiersText) + '}'));
      }
    } else if (!shouldAddDefault && openBrace != null && closeBrace != null) {
      // `import {...} './foo'` → `import {..., ...} from './foo'`
      fixes.push(fixer.insertTextBefore(closeBrace, specifiersText));
    }

    // Remove imports whose specifiers have been moved into the first import.
    var _iteratorNormalCompletion3 = true;var _didIteratorError3 = false;var _iteratorError3 = undefined;try {for (var _iterator3 = specifiers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {var specifier = _step3.value;
        var importNode = specifier.importNode;
        fixes.push(fixer.remove(importNode));

        var charAfterImportRange = [importNode.range[1], importNode.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }

      // Remove imports whose default import has been moved to the first import,
      // and side-effect-only imports that are unnecessary due to the first
      // import.
    } catch (err) {_didIteratorError3 = true;_iteratorError3 = err;} finally {try {if (!_iteratorNormalCompletion3 && _iterator3['return']) {_iterator3['return']();}} finally {if (_didIteratorError3) {throw _iteratorError3;}}}var _iteratorNormalCompletion4 = true;var _didIteratorError4 = false;var _iteratorError4 = undefined;try {for (var _iterator4 = unnecessaryImports[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {var node = _step4.value;
        fixes.push(fixer.remove(node));

        var charAfterImportRange = [node.range[1], node.range[1] + 1];
        var charAfterImport = sourceCode.text.substring(charAfterImportRange[0], charAfterImportRange[1]);
        if (charAfterImport === '\n') {
          fixes.push(fixer.removeRange(charAfterImportRange));
        }
      }} catch (err) {_didIteratorError4 = true;_iteratorError4 = err;} finally {try {if (!_iteratorNormalCompletion4 && _iterator4['return']) {_iterator4['return']();}} finally {if (_didIteratorError4) {throw _iteratorError4;}}}

    return fixes;
  };
}

function isPunctuator(node, value) {
  return node.type === 'Punctuator' && node.value === value;
}

// Get the name of the default import of `node`, if any.
function getDefaultImportName(node) {
  var defaultSpecifier = node.specifiers.
  find(function (specifier) {return specifier.type === 'ImportDefaultSpecifier';});
  return defaultSpecifier != null ? defaultSpecifier.local.name : undefined;
}

// Checks whether `node` has a namespace import.
function hasNamespace(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportNamespaceSpecifier';});
  return specifiers.length > 0;
}

// Checks whether `node` has any non-default specifiers.
function hasSpecifiers(node) {
  var specifiers = node.specifiers.
  filter(function (specifier) {return specifier.type === 'ImportSpecifier';});
  return specifiers.length > 0;
}

// It's not obvious what the user wants to do with comments associated with
// duplicate imports, so skip imports with comments when autofixing.
function hasProblematicComments(node, sourceCode) {
  return (
    hasCommentBefore(node, sourceCode) ||
    hasCommentAfter(node, sourceCode) ||
    hasCommentInsideNonSpecifiers(node, sourceCode));

}

// Checks whether `node` has a comment (that ends) on the previous line or on
// the same line as `node` (starts).
function hasCommentBefore(node, sourceCode) {
  return sourceCode.getCommentsBefore(node).
  some(function (comment) {return comment.loc.end.line >= node.loc.start.line - 1;});
}

// Checks whether `node` has a comment (that starts) on the same line as `node`
// (ends).
function hasCommentAfter(node, sourceCode) {
  return sourceCode.getCommentsAfter(node).
  some(function (comment) {return comment.loc.start.line === node.loc.end.line;});
}

// Checks whether `node` has any comments _inside,_ except inside the `{...}`
// part (if any).
function hasCommentInsideNonSpecifiers(node, sourceCode) {
  var tokens = sourceCode.getTokens(node);
  var openBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '{');});
  var closeBraceIndex = tokens.findIndex(function (token) {return isPunctuator(token, '}');});
  // Slice away the first token, since we're no looking for comments _before_
  // `node` (only inside). If there's a `{...}` part, look for comments before
  // the `{`, but not before the `}` (hence the `+1`s).
  var someTokens = openBraceIndex >= 0 && closeBraceIndex >= 0 ?
  tokens.slice(1, openBraceIndex + 1).concat(tokens.slice(closeBraceIndex + 1)) :
  tokens.slice(1);
  return someTokens.some(function (token) {return sourceCode.getCommentsBefore(token).length > 0;});
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Style guide',
      description: 'Forbid repeated import of the same module in multiple places.',
      url: (0, _docsUrl2['default'])('no-duplicates') },

    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        considerQueryString: {
          type: 'boolean' },

        'prefer-inline': {
          type: 'boolean' } },


      additionalProperties: false }] },




  create: function () {function create(context) {
      // Prepare the resolver from options.
      var considerQueryStringOption = context.options[0] &&
      context.options[0].considerQueryString;
      var defaultResolver = function () {function defaultResolver(sourcePath) {return (0, _resolve2['default'])(sourcePath, context) || sourcePath;}return defaultResolver;}();
      var resolver = considerQueryStringOption ? function (sourcePath) {
        var parts = sourcePath.match(/^([^?]*)\?(.*)$/);
        if (!parts) {
          return defaultResolver(sourcePath);
        }
        return String(defaultResolver(parts[1])) + '?' + String(parts[2]);
      } : defaultResolver;

      var moduleMaps = new Map();

      function getImportMap(n) {
        if (!moduleMaps.has(n.parent)) {
          moduleMaps.set(n.parent, {
            imported: new Map(),
            nsImported: new Map(),
            defaultTypesImported: new Map(),
            namedTypesImported: new Map() });

        }
        var map = moduleMaps.get(n.parent);
        if (n.importKind === 'type') {
          return n.specifiers.length > 0 && n.specifiers[0].type === 'ImportDefaultSpecifier' ? map.defaultTypesImported : map.namedTypesImported;
        }
        if (n.specifiers.some(function (spec) {return spec.importKind === 'type';})) {
          return map.namedTypesImported;
        }

        return hasNamespace(n) ? map.nsImported : map.imported;
      }

      return {
        ImportDeclaration: function () {function ImportDeclaration(n) {
            // resolved path will cover aliased duplicates
            var resolvedPath = resolver(n.source.value);
            var importMap = getImportMap(n);

            if (importMap.has(resolvedPath)) {
              importMap.get(resolvedPath).push(n);
            } else {
              importMap.set(resolvedPath, [n]);
            }
          }return ImportDeclaration;}(),

        'Program:exit': function () {function ProgramExit() {var _iteratorNormalCompletion5 = true;var _didIteratorError5 = false;var _iteratorError5 = undefined;try {
              for (var _iterator5 = moduleMaps.values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {var map = _step5.value;
                checkImports(map.imported, context);
                checkImports(map.nsImported, context);
                checkImports(map.defaultTypesImported, context);
                checkImports(map.namedTypesImported, context);
              }} catch (err) {_didIteratorError5 = true;_iteratorError5 = err;} finally {try {if (!_iteratorNormalCompletion5 && _iterator5['return']) {_iterator5['return']();}} finally {if (_didIteratorError5) {throw _iteratorError5;}}}
          }return ProgramExit;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kdXBsaWNhdGVzLmpzIl0sIm5hbWVzIjpbInR5cGVzY3JpcHRQa2ciLCJyZXF1aXJlIiwiZSIsImNoZWNrSW1wb3J0cyIsImltcG9ydGVkIiwiY29udGV4dCIsImVudHJpZXMiLCJtb2R1bGUiLCJub2RlcyIsImxlbmd0aCIsIm1lc3NhZ2UiLCJmaXJzdCIsInJlc3QiLCJzb3VyY2VDb2RlIiwiZ2V0U291cmNlQ29kZSIsImZpeCIsImdldEZpeCIsInJlcG9ydCIsIm5vZGUiLCJzb3VyY2UiLCJnZXRDb21tZW50c0JlZm9yZSIsInVuZGVmaW5lZCIsImhhc1Byb2JsZW1hdGljQ29tbWVudHMiLCJoYXNOYW1lc3BhY2UiLCJkZWZhdWx0SW1wb3J0TmFtZXMiLCJTZXQiLCJtYXAiLCJnZXREZWZhdWx0SW1wb3J0TmFtZSIsImZpbHRlciIsIkJvb2xlYW4iLCJzaXplIiwicmVzdFdpdGhvdXRDb21tZW50cyIsInNwZWNpZmllcnMiLCJ0b2tlbnMiLCJnZXRUb2tlbnMiLCJvcGVuQnJhY2UiLCJmaW5kIiwidG9rZW4iLCJpc1B1bmN0dWF0b3IiLCJjbG9zZUJyYWNlIiwiaW1wb3J0Tm9kZSIsImlkZW50aWZpZXJzIiwidGV4dCIsInNsaWNlIiwicmFuZ2UiLCJzcGxpdCIsImlzRW1wdHkiLCJoYXNTcGVjaWZpZXJzIiwidW5uZWNlc3NhcnlJbXBvcnRzIiwic29tZSIsInNwZWNpZmllciIsInNob3VsZEFkZERlZmF1bHQiLCJzaG91bGRBZGRTcGVjaWZpZXJzIiwic2hvdWxkUmVtb3ZlVW5uZWNlc3NhcnkiLCJmaXhlciIsImZpcnN0VG9rZW4iLCJnZXRGaXJzdFRva2VuIiwiZGVmYXVsdEltcG9ydE5hbWUiLCJmaXJzdEhhc1RyYWlsaW5nQ29tbWEiLCJnZXRUb2tlbkJlZm9yZSIsImZpcnN0SXNFbXB0eSIsImZpcnN0RXhpc3RpbmdJZGVudGlmaWVycyIsIngiLCJ0cmltIiwicmVkdWNlIiwicmVzdWx0IiwibmVlZHNDb21tYSIsImV4aXN0aW5nSWRlbnRpZmllcnMiLCJpc1R5cGVTcGVjaWZpZXIiLCJpbXBvcnRLaW5kIiwicHJlZmVySW5saW5lIiwib3B0aW9ucyIsInNlbXZlciIsInNhdGlzZmllcyIsInZlcnNpb24iLCJFcnJvciIsImN1ciIsInNldCIsInRyaW1tZWQiLCJjdXJXaXRoVHlwZSIsImhhcyIsImFkZCIsInNwZWNpZmllclRleHQiLCJ1cGRhdGVkRXhpc3RpbmdJZGVudGlmaWVycyIsInNwZWNpZmllcnNUZXh0IiwiZml4ZXMiLCJwdXNoIiwiaW5zZXJ0VGV4dEFmdGVyIiwiaW5zZXJ0VGV4dEJlZm9yZSIsInJlbW92ZSIsImNoYXJBZnRlckltcG9ydFJhbmdlIiwiY2hhckFmdGVySW1wb3J0Iiwic3Vic3RyaW5nIiwicmVtb3ZlUmFuZ2UiLCJ2YWx1ZSIsInR5cGUiLCJkZWZhdWx0U3BlY2lmaWVyIiwibG9jYWwiLCJuYW1lIiwiaGFzQ29tbWVudEJlZm9yZSIsImhhc0NvbW1lbnRBZnRlciIsImhhc0NvbW1lbnRJbnNpZGVOb25TcGVjaWZpZXJzIiwiY29tbWVudCIsImxvYyIsImVuZCIsImxpbmUiLCJzdGFydCIsImdldENvbW1lbnRzQWZ0ZXIiLCJvcGVuQnJhY2VJbmRleCIsImZpbmRJbmRleCIsImNsb3NlQnJhY2VJbmRleCIsInNvbWVUb2tlbnMiLCJjb25jYXQiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb25zaWRlclF1ZXJ5U3RyaW5nIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb25zaWRlclF1ZXJ5U3RyaW5nT3B0aW9uIiwiZGVmYXVsdFJlc29sdmVyIiwic291cmNlUGF0aCIsInJlc29sdmVyIiwicGFydHMiLCJtYXRjaCIsIm1vZHVsZU1hcHMiLCJNYXAiLCJnZXRJbXBvcnRNYXAiLCJuIiwicGFyZW50IiwibnNJbXBvcnRlZCIsImRlZmF1bHRUeXBlc0ltcG9ydGVkIiwibmFtZWRUeXBlc0ltcG9ydGVkIiwiZ2V0Iiwic3BlYyIsIkltcG9ydERlY2xhcmF0aW9uIiwicmVzb2x2ZWRQYXRoIiwiaW1wb3J0TWFwIiwidmFsdWVzIl0sIm1hcHBpbmdzIjoicW9CQUFBLHNEO0FBQ0EscUM7QUFDQSxnQzs7QUFFQSxJQUFJQSxzQkFBSjtBQUNBLElBQUk7QUFDRkEsa0JBQWdCQyxRQUFRLHlCQUFSLENBQWhCLENBREUsQ0FDa0Q7QUFDckQsQ0FGRCxDQUVFLE9BQU9DLENBQVAsRUFBVSxDQUFFLElBQU07O0FBRXBCLFNBQVNDLFlBQVQsQ0FBc0JDLFFBQXRCLEVBQWdDQyxPQUFoQyxFQUF5QztBQUN2Qyx5QkFBOEJELFNBQVNFLE9BQVQsRUFBOUIsOEhBQWtELGdFQUF0Q0MsT0FBc0MsZ0JBQTlCQyxLQUE4QjtBQUNoRCxVQUFJQSxNQUFNQyxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEIsWUFBTUMsd0JBQWNILE9BQWQsaUNBQU4sQ0FEb0I7QUFFS0MsYUFGTCxFQUViRyxLQUZhLGFBRUhDLElBRkc7QUFHcEIsWUFBTUMsYUFBYVIsUUFBUVMsYUFBUixFQUFuQjtBQUNBLFlBQU1DLE1BQU1DLE9BQU9MLEtBQVAsRUFBY0MsSUFBZCxFQUFvQkMsVUFBcEIsRUFBZ0NSLE9BQWhDLENBQVo7O0FBRUFBLGdCQUFRWSxNQUFSLENBQWU7QUFDYkMsZ0JBQU1QLE1BQU1RLE1BREM7QUFFYlQsMEJBRmE7QUFHYkssa0JBSGEsQ0FHUjtBQUhRLFNBQWYsRUFOb0I7O0FBWXBCLGdDQUFtQkgsSUFBbkIsbUlBQXlCLEtBQWRNLElBQWM7QUFDdkJiLG9CQUFRWSxNQUFSLENBQWU7QUFDYkMsb0JBQU1BLEtBQUtDLE1BREU7QUFFYlQsOEJBRmEsRUFBZjs7QUFJRCxXQWpCbUI7QUFrQnJCO0FBQ0YsS0FyQnNDO0FBc0J4Qzs7QUFFRCxTQUFTTSxNQUFULENBQWdCTCxLQUFoQixFQUF1QkMsSUFBdkIsRUFBNkJDLFVBQTdCLEVBQXlDUixPQUF6QyxFQUFrRDtBQUNoRDtB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M0MsSUFBSWdILGtCQUFYO0FBQ0Q7O0FBRUQsZUFBT25ILGFBQWErRyxDQUFiLElBQWtCNUcsSUFBSThHLFVBQXRCLEdBQW1DOUcsSUFBSXRCLFFBQTlDO0FBQ0Q7O0FBRUQsYUFBTztBQUNMeUkseUJBREssMENBQ2FQLENBRGIsRUFDZ0I7QUFDbkI7QUFDQSxnQkFBTVEsZUFBZWQsU0FBU00sRUFBRW5ILE1BQUYsQ0FBUzJFLEtBQWxCLENBQXJCO0FBQ0EsZ0JBQU1pRCxZQUFZVixhQUFhQyxDQUFiLENBQWxCOztBQUVBLGdCQUFJUyxVQUFVL0QsR0FBVixDQUFjOEQsWUFBZCxDQUFKLEVBQWlDO0FBQy9CQyx3QkFBVUosR0FBVixDQUFjRyxZQUFkLEVBQTRCeEQsSUFBNUIsQ0FBaUNnRCxDQUFqQztBQUNELGFBRkQsTUFFTztBQUNMUyx3QkFBVWxFLEdBQVYsQ0FBY2lFLFlBQWQsRUFBNEIsQ0FBQ1IsQ0FBRCxDQUE1QjtBQUNEO0FBQ0YsV0FYSTs7QUFhTCxzQkFiSyxzQ0FhWTtBQUNmLG9DQUFrQkgsV0FBV2EsTUFBWCxFQUFsQixtSUFBdUMsS0FBNUJ0SCxHQUE0QjtBQUNyQ3ZCLDZCQUFhdUIsSUFBSXRCLFFBQWpCLEVBQTJCQyxPQUEzQjtBQUNBRiw2QkFBYXVCLElBQUk4RyxVQUFqQixFQUE2Qm5JLE9BQTdCO0FBQ0FGLDZCQUFhdUIsSUFBSStHLG9CQUFqQixFQUF1Q3BJLE9BQXZDO0FBQ0FGLDZCQUFhdUIsSUFBSWdILGtCQUFqQixFQUFxQ3JJLE9BQXJDO0FBQ0QsZUFOYztBQU9oQixXQXBCSSx3QkFBUDs7QUFzQkQsS0FsRmMsbUJBQWpCIiwiZmlsZSI6Im5vLWR1cGxpY2F0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVzb2x2ZSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL3Jlc29sdmUnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5pbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5cbmxldCB0eXBlc2NyaXB0UGtnO1xudHJ5IHtcbiAgdHlwZXNjcmlwdFBrZyA9IHJlcXVpcmUoJ3R5cGVzY3JpcHQvcGFja2FnZS5qc29uJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG59IGNhdGNoIChlKSB7IC8qKi8gfVxuXG5mdW5jdGlvbiBjaGVja0ltcG9ydHMoaW1wb3J0ZWQsIGNvbnRleHQpIHtcbiAgZm9yIChjb25zdCBbbW9kdWxlLCBub2Rlc10gb2YgaW1wb3J0ZWQuZW50cmllcygpKSB7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA+IDEpIHtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgJyR7bW9kdWxlfScgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMuYDtcbiAgICAgIGNvbnN0IFtmaXJzdCwgLi4ucmVzdF0gPSBub2RlcztcbiAgICAgIGNvbnN0IHNvdXJjZUNvZGUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKTtcbiAgICAgIGNvbnN0IGZpeCA9IGdldEZpeChmaXJzdCwgcmVzdCwgc291cmNlQ29kZSwgY29udGV4dCk7XG5cbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbm9kZTogZmlyc3Quc291cmNlLFxuICAgICAgICBtZXNzYWdlLFxuICAgICAgICBmaXgsIC8vIEF0dGFjaCB0aGUgYXV0b2ZpeCAoaWYgYW55KSB0byB0aGUgZmlyc3QgaW1wb3J0LlxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiByZXN0KSB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlOiBub2RlLnNvdXJjZSxcbiAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Rml4KGZpcnN0LCByZXN0LCBzb3VyY2VDb2RlLCBjb250ZXh0KSB7XG4gIC8vIFNvcnJ5IEVTTGludCA8PSAzIHVzZXJzLCBubyBhdXRvZml4IGZvciB5b3UuIEF1dG9maXhpbmcgZHVwbGljYXRlIGltcG9ydHNcbiAgLy8gcmVxdWlyZXMgbXVsdGlwbGUgYGZpeGVyLndoYXRldmVyKClgIGNhbGxzIGluIHRoZSBgZml4YDogV2UgYm90aCBuZWVkIHRvXG4gIC8vIHVwZGF0ZSB0aGUgZmlyc3Qgb25lLCBhbmQgcmVtb3ZlIHRoZSByZXN0LiBTdXBwb3J0IGZvciBtdWx0aXBsZVxuICAvLyBgZml4ZXIud2hhdGV2ZXIoKWAgaW4gYSBzaW5nbGUgYGZpeGAgd2FzIGFkZGVkIGluIEVTTGludCA0LjEuXG4gIC8vIGBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlYCB3YXMgYWRkZWQgaW4gNC4wLCBzbyB0aGF0J3MgYW4gZWFzeSB0aGluZyB0b1xuICAvLyBjaGVjayBmb3IuXG4gIGlmICh0eXBlb2Ygc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICAvLyBBZGp1c3RpbmcgdGhlIGZpcnN0IGltcG9ydCBtaWdodCBtYWtlIGl0IG11bHRpbGluZSwgd2hpY2ggY291bGQgYnJlYWtcbiAgLy8gYGVzbGludC1kaXNhYmxlLW5leHQtbGluZWAgY29tbWVudHMgYW5kIHNpbWlsYXIsIHNvIGJhaWwgaWYgdGhlIGZpcnN0XG4gIC8vIGltcG9ydCBoYXMgY29tbWVudHMuIEFsc28sIGlmIHRoZSBmaXJzdCBpbXBvcnQgaXMgYGltcG9ydCAqIGFzIG5zIGZyb21cbiAgLy8gJy4vZm9vJ2AgdGhlcmUncyBub3RoaW5nIHdlIGNhbiBkby5cbiAgaWYgKGhhc1Byb2JsZW1hdGljQ29tbWVudHMoZmlyc3QsIHNvdXJjZUNvZGUpIHx8IGhhc05hbWVzcGFjZShmaXJzdCkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZGVmYXVsdEltcG9ydE5hbWVzID0gbmV3IFNldChcbiAgICBbZmlyc3QsIC4uLnJlc3RdLm1hcChnZXREZWZhdWx0SW1wb3J0TmFtZSkuZmlsdGVyKEJvb2xlYW4pLFxuICApO1xuXG4gIC8vIEJhaWwgaWYgdGhlcmUgYXJlIG11bHRpcGxlIGRpZmZlcmVudCBkZWZhdWx0IGltcG9ydCBuYW1lcyDigJMgaXQncyB1cCB0byB0aGVcbiAgLy8gdXNlciB0byBjaG9vc2Ugd2hpY2ggb25lIHRvIGtlZXAuXG4gIGlmIChkZWZhdWx0SW1wb3J0TmFtZXMuc2l6ZSA+IDEpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgLy8gTGVhdmUgaXQgdG8gdGhlIHVzZXIgdG8gaGFuZGxlIGNvbW1lbnRzLiBBbHNvIHNraXAgYGltcG9ydCAqIGFzIG5zIGZyb21cbiAgLy8gJy4vZm9vJ2AgaW1wb3J0cywgc2luY2UgdGhleSBjYW5ub3QgYmUgbWVyZ2VkIGludG8gYW5vdGhlciBpbXBvcnQuXG4gIGNvbnN0IHJlc3RXaXRob3V0Q29tbWVudHMgPSByZXN0LmZpbHRlcigobm9kZSkgPT4gIShcbiAgICBoYXNQcm9ibGVtYXRpY0NvbW1lbnRzKG5vZGUsIHNvdXJjZUNvZGUpXG4gICAgfHwgaGFzTmFtZXNwYWNlKG5vZGUpXG4gICkpO1xuXG4gIGNvbnN0IHNwZWNpZmllcnMgPSByZXN0V2l0aG91dENvbW1lbnRzXG4gICAgLm1hcCgobm9kZSkgPT4ge1xuICAgICAgY29uc3QgdG9rZW5zID0gc291cmNlQ29kZS5nZXRUb2tlbnMobm9kZSk7XG4gICAgICBjb25zdCBvcGVuQnJhY2UgPSB0b2tlbnMuZmluZCgodG9rZW4pID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ3snKSk7XG4gICAgICBjb25zdCBjbG9zZUJyYWNlID0gdG9rZW5zLmZpbmQoKHRva2VuKSA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd9JykpO1xuXG4gICAgICBpZiAob3BlbkJyYWNlID09IG51bGwgfHwgY2xvc2VCcmFjZSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGltcG9ydE5vZGU6IG5vZGUsXG4gICAgICAgIGlkZW50aWZpZXJzOiBzb3VyY2VDb2RlLnRleHQuc2xpY2Uob3BlbkJyYWNlLnJhbmdlWzFdLCBjbG9zZUJyYWNlLnJhbmdlWzBdKS5zcGxpdCgnLCcpLCAvLyBTcGxpdCB0aGUgdGV4dCBpbnRvIHNlcGFyYXRlIGlkZW50aWZpZXJzIChyZXRhaW5pbmcgYW55IHdoaXRlc3BhY2UgYmVmb3JlIG9yIGFmdGVyKVxuICAgICAgICBpc0VtcHR5OiAhaGFzU3BlY2lmaWVycyhub2RlKSxcbiAgICAgIH07XG4gICAgfSlcbiAgICAuZmlsdGVyKEJvb2xlYW4pO1xuXG4gIGNvbnN0IHVubmVjZXNzYXJ5SW1wb3J0cyA9IHJlc3RXaXRob3V0Q29tbWVudHMuZmlsdGVyKChub2RlKSA9PiAhaGFzU3BlY2lmaWVycyhub2RlKVxuICAgICYmICFoYXNOYW1lc3BhY2Uobm9kZSlcbiAgICAmJiAhc3BlY2lmaWVycy5zb21lKChzcGVjaWZpZXIpID0+IHNwZWNpZmllci5pbXBvcnROb2RlID09PSBub2RlKSxcbiAgKTtcblxuICBjb25zdCBzaG91bGRBZGREZWZhdWx0ID0gZ2V0RGVmYXVsdEltcG9ydE5hbWUoZmlyc3QpID09IG51bGwgJiYgZGVmYXVsdEltcG9ydE5hbWVzLnNpemUgPT09IDE7XG4gIGNvbnN0IHNob3VsZEFkZFNwZWNpZmllcnMgPSBzcGVjaWZpZXJzLmxlbmd0aCA+IDA7XG4gIGNvbnN0IHNob3VsZFJlbW92ZVVubmVjZXNzYXJ5ID0gdW5uZWNlc3NhcnlJbXBvcnRzLmxlbmd0aCA+IDA7XG5cbiAgaWYgKCEoc2hvdWxkQWRkRGVmYXVsdCB8fCBzaG91bGRBZGRTcGVjaWZpZXJzIHx8IHNob3VsZFJlbW92ZVVubmVjZXNzYXJ5KSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gKGZpeGVyKSA9PiB7XG4gICAgY29uc3QgdG9rZW5zID0gc291cmNlQ29kZS5nZXRUb2tlbnMoZmlyc3QpO1xuICAgIGNvbnN0IG9wZW5CcmFjZSA9IHRva2Vucy5maW5kKCh0b2tlbikgPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgICBjb25zdCBjbG9zZUJyYWNlID0gdG9rZW5zLmZpbmQoKHRva2VuKSA9PiBpc1B1bmN0dWF0b3IodG9rZW4sICd9JykpO1xuICAgIGNvbnN0IGZpcnN0VG9rZW4gPSBzb3VyY2VDb2RlLmdldEZpcnN0VG9rZW4oZmlyc3QpO1xuICAgIGNvbnN0IFtkZWZhdWx0SW1wb3J0TmFtZV0gPSBkZWZhdWx0SW1wb3J0TmFtZXM7XG5cbiAgICBjb25zdCBmaXJzdEhhc1RyYWlsaW5nQ29tbWEgPSBjbG9zZUJyYWNlICE9IG51bGwgJiYgaXNQdW5jdHVhdG9yKHNvdXJjZUNvZGUuZ2V0VG9rZW5CZWZvcmUoY2xvc2VCcmFjZSksICcsJyk7XG4gICAgY29uc3QgZmlyc3RJc0VtcHR5ID0gIWhhc1NwZWNpZmllcnMoZmlyc3QpO1xuICAgIGNvbnN0IGZpcnN0RXhpc3RpbmdJZGVudGlmaWVycyA9IGZpcnN0SXNFbXB0eVxuICAgICAgPyBuZXcgU2V0KClcbiAgICAgIDogbmV3IFNldChzb3VyY2VDb2RlLnRleHQuc2xpY2Uob3BlbkJyYWNlLnJhbmdlWzFdLCBjbG9zZUJyYWNlLnJhbmdlWzBdKVxuICAgICAgICAuc3BsaXQoJywnKVxuICAgICAgICAubWFwKCh4KSA9PiB4LnRyaW0oKSksXG4gICAgICApO1xuXG4gICAgY29uc3QgW3NwZWNpZmllcnNUZXh0XSA9IHNwZWNpZmllcnMucmVkdWNlKFxuICAgICAgKFtyZXN1bHQsIG5lZWRzQ29tbWEsIGV4aXN0aW5nSWRlbnRpZmllcnNdLCBzcGVjaWZpZXIpID0+IHtcbiAgICAgICAgY29uc3QgaXNUeXBlU3BlY2lmaWVyID0gc3BlY2lmaWVyLmltcG9ydE5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnO1xuXG4gICAgICAgIGNvbnN0IHByZWZlcklubGluZSA9IGNvbnRleHQub3B0aW9uc1swXSAmJiBjb250ZXh0Lm9wdGlvbnNbMF1bJ3ByZWZlci1pbmxpbmUnXTtcbiAgICAgICAgLy8gYSB1c2VyIG1pZ2h0IHNldCBwcmVmZXItaW5saW5lIGJ1dCBub3QgaGF2ZSBhIHN1cHBvcnRpbmcgVHlwZVNjcmlwdCB2ZXJzaW9uLiAgRmxvdyBkb2VzIG5vdCBzdXBwb3J0IGlubGluZSB0eXBlcyBzbyB0aGlzIHNob3VsZCBmYWlsIGluIHRoYXQgY2FzZSBhcyB3ZWxsLlxuICAgICAgICBpZiAocHJlZmVySW5saW5lICYmICghdHlwZXNjcmlwdFBrZyB8fCAhc2VtdmVyLnNhdGlzZmllcyh0eXBlc2NyaXB0UGtnLnZlcnNpb24sICc+PSA0LjUnKSkpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdXIgdmVyc2lvbiBvZiBUeXBlU2NyaXB0IGRvZXMgbm90IHN1cHBvcnQgaW5saW5lIHR5cGUgaW1wb3J0cy4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCAqb25seSogdGhlIG5ldyBpZGVudGlmaWVycyB0aGF0IGRvbid0IGFscmVhZHkgZXhpc3QsIGFuZCB0cmFjayBhbnkgbmV3IGlkZW50aWZpZXJzIHNvIHdlIGRvbid0IGFkZCB0aGVtIGFnYWluIGluIHRoZSBuZXh0IGxvb3BcbiAgICAgICAgY29uc3QgW3NwZWNpZmllclRleHQsIHVwZGF0ZWRFeGlzdGluZ0lkZW50aWZpZXJzXSA9IHNwZWNpZmllci5pZGVudGlmaWVycy5yZWR1Y2UoKFt0ZXh0LCBzZXRdLCBjdXIpID0+IHtcbiAgICAgICAgICBjb25zdCB0cmltbWVkID0gY3VyLnRyaW0oKTsgLy8gVHJpbSB3aGl0ZXNwYWNlIGJlZm9yZS9hZnRlciB0byBjb21wYXJlIHRvIG91ciBzZXQgb2YgZXhpc3RpbmcgaWRlbnRpZmllcnNcbiAgICAgICAgICBjb25zdCBjdXJXaXRoVHlwZSA9IHRyaW1tZWQubGVuZ3RoID4gMCAmJiBwcmVmZXJJbmxpbmUgJiYgaXNUeXBlU3BlY2lmaWVyID8gYHR5cGUgJHtjdXJ9YCA6IGN1cjtcbiAgICAgICAgICBpZiAoZXhpc3RpbmdJZGVudGlmaWVycy5oYXModHJpbW1lZCkpIHtcbiAgICAgICAgICAgIHJldHVybiBbdGV4dCwgc2V0XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIFt0ZXh0Lmxlbmd0aCA+IDAgPyBgJHt0ZXh0fSwke2N1cldpdGhUeXBlfWAgOiBjdXJXaXRoVHlwZSwgc2V0LmFkZCh0cmltbWVkKV07XG4gICAgICAgIH0sIFsnJywgZXhpc3RpbmdJZGVudGlmaWVyc10pO1xuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgbmVlZHNDb21tYSAmJiAhc3BlY2lmaWVyLmlzRW1wdHkgJiYgc3BlY2lmaWVyVGV4dC5sZW5ndGggPiAwXG4gICAgICAgICAgICA/IGAke3Jlc3VsdH0sJHtzcGVjaWZpZXJUZXh0fWBcbiAgICAgICAgICAgIDogYCR7cmVzdWx0fSR7c3BlY2lmaWVyVGV4dH1gLFxuICAgICAgICAgIHNwZWNpZmllci5pc0VtcHR5ID8gbmVlZHNDb21tYSA6IHRydWUsXG4gICAgICAgICAgdXBkYXRlZEV4aXN0aW5nSWRlbnRpZmllcnMsXG4gICAgICAgIF07XG4gICAgICB9LFxuICAgICAgWycnLCAhZmlyc3RIYXNUcmFpbGluZ0NvbW1hICYmICFmaXJzdElzRW1wdHksIGZpcnN0RXhpc3RpbmdJZGVudGlmaWVyc10sXG4gICAgKTtcblxuICAgIGNvbnN0IGZpeGVzID0gW107XG5cbiAgICBpZiAoc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgPT0gbnVsbCAmJiBzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICAvLyBgaW1wb3J0ICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgZml4ZXMucHVzaChcbiAgICAgICAgZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgJHtkZWZhdWx0SW1wb3J0TmFtZX0sIHske3NwZWNpZmllcnNUZXh0fX0gZnJvbWApLFxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlID09IG51bGwgJiYgIXNob3VsZEFkZFNwZWNpZmllcnMpIHtcbiAgICAgIC8vIGBpbXBvcnQgJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmIGZyb20gJy4vZm9vJ2BcbiAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0VG9rZW4sIGAgJHtkZWZhdWx0SW1wb3J0TmFtZX0gZnJvbWApKTtcbiAgICB9IGVsc2UgaWYgKHNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlICE9IG51bGwgJiYgY2xvc2VCcmFjZSAhPSBudWxsKSB7XG4gICAgICAvLyBgaW1wb3J0IHsuLi59IGZyb20gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmLCB7Li4ufSBmcm9tICcuL2ZvbydgXG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdFRva2VuLCBgICR7ZGVmYXVsdEltcG9ydE5hbWV9LGApKTtcbiAgICAgIGlmIChzaG91bGRBZGRTcGVjaWZpZXJzKSB7XG4gICAgICAgIC8vIGBpbXBvcnQgZGVmLCB7Li4ufSBmcm9tICcuL2ZvbydgIOKGkiBgaW1wb3J0IGRlZiwgey4uLiwgLi4ufSBmcm9tICcuL2ZvbydgXG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEJlZm9yZShjbG9zZUJyYWNlLCBzcGVjaWZpZXJzVGV4dCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIXNob3VsZEFkZERlZmF1bHQgJiYgb3BlbkJyYWNlID09IG51bGwgJiYgc2hvdWxkQWRkU3BlY2lmaWVycykge1xuICAgICAgaWYgKGZpcnN0LnNwZWNpZmllcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIGBpbXBvcnQgJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgey4uLn0gZnJvbSAnLi9mb28nYFxuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRBZnRlcihmaXJzdFRva2VuLCBgIHske3NwZWNpZmllcnNUZXh0fX0gZnJvbWApKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGBpbXBvcnQgZGVmIGZyb20gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgZGVmLCB7Li4ufSBmcm9tICcuL2ZvbydgXG4gICAgICAgIGZpeGVzLnB1c2goZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKGZpcnN0LnNwZWNpZmllcnNbMF0sIGAsIHske3NwZWNpZmllcnNUZXh0fX1gKSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghc2hvdWxkQWRkRGVmYXVsdCAmJiBvcGVuQnJhY2UgIT0gbnVsbCAmJiBjbG9zZUJyYWNlICE9IG51bGwpIHtcbiAgICAgIC8vIGBpbXBvcnQgey4uLn0gJy4vZm9vJ2Ag4oaSIGBpbXBvcnQgey4uLiwgLi4ufSBmcm9tICcuL2ZvbydgXG4gICAgICBmaXhlcy5wdXNoKGZpeGVyLmluc2VydFRleHRCZWZvcmUoY2xvc2VCcmFjZSwgc3BlY2lmaWVyc1RleHQpKTtcbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgaW1wb3J0cyB3aG9zZSBzcGVjaWZpZXJzIGhhdmUgYmVlbiBtb3ZlZCBpbnRvIHRoZSBmaXJzdCBpbXBvcnQuXG4gICAgZm9yIChjb25zdCBzcGVjaWZpZXIgb2Ygc3BlY2lmaWVycykge1xuICAgICAgY29uc3QgaW1wb3J0Tm9kZSA9IHNwZWNpZmllci5pbXBvcnROb2RlO1xuICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmUoaW1wb3J0Tm9kZSkpO1xuXG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZSA9IFtpbXBvcnROb2RlLnJhbmdlWzFdLCBpbXBvcnROb2RlLnJhbmdlWzFdICsgMV07XG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnQgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKGNoYXJBZnRlckltcG9ydFJhbmdlWzBdLCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZVsxXSk7XG4gICAgICBpZiAoY2hhckFmdGVySW1wb3J0ID09PSAnXFxuJykge1xuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZVJhbmdlKGNoYXJBZnRlckltcG9ydFJhbmdlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmVtb3ZlIGltcG9ydHMgd2hvc2UgZGVmYXVsdCBpbXBvcnQgaGFzIGJlZW4gbW92ZWQgdG8gdGhlIGZpcnN0IGltcG9ydCxcbiAgICAvLyBhbmQgc2lkZS1lZmZlY3Qtb25seSBpbXBvcnRzIHRoYXQgYXJlIHVubmVjZXNzYXJ5IGR1ZSB0byB0aGUgZmlyc3RcbiAgICAvLyBpbXBvcnQuXG4gICAgZm9yIChjb25zdCBub2RlIG9mIHVubmVjZXNzYXJ5SW1wb3J0cykge1xuICAgICAgZml4ZXMucHVzaChmaXhlci5yZW1vdmUobm9kZSkpO1xuXG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZSA9IFtub2RlLnJhbmdlWzFdLCBub2RlLnJhbmdlWzFdICsgMV07XG4gICAgICBjb25zdCBjaGFyQWZ0ZXJJbXBvcnQgPSBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKGNoYXJBZnRlckltcG9ydFJhbmdlWzBdLCBjaGFyQWZ0ZXJJbXBvcnRSYW5nZVsxXSk7XG4gICAgICBpZiAoY2hhckFmdGVySW1wb3J0ID09PSAnXFxuJykge1xuICAgICAgICBmaXhlcy5wdXNoKGZpeGVyLnJlbW92ZVJhbmdlKGNoYXJBZnRlckltcG9ydFJhbmdlKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpeGVzO1xuICB9O1xufVxuXG5mdW5jdGlvbiBpc1B1bmN0dWF0b3Iobm9kZSwgdmFsdWUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ1B1bmN0dWF0b3InICYmIG5vZGUudmFsdWUgPT09IHZhbHVlO1xufVxuXG4vLyBHZXQgdGhlIG5hbWUgb2YgdGhlIGRlZmF1bHQgaW1wb3J0IG9mIGBub2RlYCwgaWYgYW55LlxuZnVuY3Rpb24gZ2V0RGVmYXVsdEltcG9ydE5hbWUobm9kZSkge1xuICBjb25zdCBkZWZhdWx0U3BlY2lmaWVyID0gbm9kZS5zcGVjaWZpZXJzXG4gICAgLmZpbmQoKHNwZWNpZmllcikgPT4gc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyk7XG4gIHJldHVybiBkZWZhdWx0U3BlY2lmaWVyICE9IG51bGwgPyBkZWZhdWx0U3BlY2lmaWVyLmxvY2FsLm5hbWUgOiB1bmRlZmluZWQ7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYSBuYW1lc3BhY2UgaW1wb3J0LlxuZnVuY3Rpb24gaGFzTmFtZXNwYWNlKG5vZGUpIHtcbiAgY29uc3Qgc3BlY2lmaWVycyA9IG5vZGUuc3BlY2lmaWVyc1xuICAgIC5maWx0ZXIoKHNwZWNpZmllcikgPT4gc3BlY2lmaWVyLnR5cGUgPT09ICdJbXBvcnROYW1lc3BhY2VTcGVjaWZpZXInKTtcbiAgcmV0dXJuIHNwZWNpZmllcnMubGVuZ3RoID4gMDtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhbnkgbm9uLWRlZmF1bHQgc3BlY2lmaWVycy5cbmZ1bmN0aW9uIGhhc1NwZWNpZmllcnMobm9kZSkge1xuICBjb25zdCBzcGVjaWZpZXJzID0gbm9kZS5zcGVjaWZpZXJzXG4gICAgLmZpbHRlcigoc3BlY2lmaWVyKSA9PiBzcGVjaWZpZXIudHlwZSA9PT0gJ0ltcG9ydFNwZWNpZmllcicpO1xuICByZXR1cm4gc3BlY2lmaWVycy5sZW5ndGggPiAwO1xufVxuXG4vLyBJdCdzIG5vdCBvYnZpb3VzIHdoYXQgdGhlIHVzZXIgd2FudHMgdG8gZG8gd2l0aCBjb21tZW50cyBhc3NvY2lhdGVkIHdpdGhcbi8vIGR1cGxpY2F0ZSBpbXBvcnRzLCBzbyBza2lwIGltcG9ydHMgd2l0aCBjb21tZW50cyB3aGVuIGF1dG9maXhpbmcuXG5mdW5jdGlvbiBoYXNQcm9ibGVtYXRpY0NvbW1lbnRzKG5vZGUsIHNvdXJjZUNvZGUpIHtcbiAgcmV0dXJuIChcbiAgICBoYXNDb21tZW50QmVmb3JlKG5vZGUsIHNvdXJjZUNvZGUpXG4gICAgfHwgaGFzQ29tbWVudEFmdGVyKG5vZGUsIHNvdXJjZUNvZGUpXG4gICAgfHwgaGFzQ29tbWVudEluc2lkZU5vblNwZWNpZmllcnMobm9kZSwgc291cmNlQ29kZSlcbiAgKTtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhIGNvbW1lbnQgKHRoYXQgZW5kcykgb24gdGhlIHByZXZpb3VzIGxpbmUgb3Igb25cbi8vIHRoZSBzYW1lIGxpbmUgYXMgYG5vZGVgIChzdGFydHMpLlxuZnVuY3Rpb24gaGFzQ29tbWVudEJlZm9yZShub2RlLCBzb3VyY2VDb2RlKSB7XG4gIHJldHVybiBzb3VyY2VDb2RlLmdldENvbW1lbnRzQmVmb3JlKG5vZGUpXG4gICAgLnNvbWUoKGNvbW1lbnQpID0+IGNvbW1lbnQubG9jLmVuZC5saW5lID49IG5vZGUubG9jLnN0YXJ0LmxpbmUgLSAxKTtcbn1cblxuLy8gQ2hlY2tzIHdoZXRoZXIgYG5vZGVgIGhhcyBhIGNvbW1lbnQgKHRoYXQgc3RhcnRzKSBvbiB0aGUgc2FtZSBsaW5lIGFzIGBub2RlYFxuLy8gKGVuZHMpLlxuZnVuY3Rpb24gaGFzQ29tbWVudEFmdGVyKG5vZGUsIHNvdXJjZUNvZGUpIHtcbiAgcmV0dXJuIHNvdXJjZUNvZGUuZ2V0Q29tbWVudHNBZnRlcihub2RlKVxuICAgIC5zb21lKChjb21tZW50KSA9PiBjb21tZW50LmxvYy5zdGFydC5saW5lID09PSBub2RlLmxvYy5lbmQubGluZSk7XG59XG5cbi8vIENoZWNrcyB3aGV0aGVyIGBub2RlYCBoYXMgYW55IGNvbW1lbnRzIF9pbnNpZGUsXyBleGNlcHQgaW5zaWRlIHRoZSBgey4uLn1gXG4vLyBwYXJ0IChpZiBhbnkpLlxuZnVuY3Rpb24gaGFzQ29tbWVudEluc2lkZU5vblNwZWNpZmllcnMobm9kZSwgc291cmNlQ29kZSkge1xuICBjb25zdCB0b2tlbnMgPSBzb3VyY2VDb2RlLmdldFRva2Vucyhub2RlKTtcbiAgY29uc3Qgb3BlbkJyYWNlSW5kZXggPSB0b2tlbnMuZmluZEluZGV4KCh0b2tlbikgPT4gaXNQdW5jdHVhdG9yKHRva2VuLCAneycpKTtcbiAgY29uc3QgY2xvc2VCcmFjZUluZGV4ID0gdG9rZW5zLmZpbmRJbmRleCgodG9rZW4pID0+IGlzUHVuY3R1YXRvcih0b2tlbiwgJ30nKSk7XG4gIC8vIFNsaWNlIGF3YXkgdGhlIGZpcnN0IHRva2VuLCBzaW5jZSB3ZSdyZSBubyBsb29raW5nIGZvciBjb21tZW50cyBfYmVmb3JlX1xuICAvLyBgbm9kZWAgKG9ubHkgaW5zaWRlKS4gSWYgdGhlcmUncyBhIGB7Li4ufWAgcGFydCwgbG9vayBmb3IgY29tbWVudHMgYmVmb3JlXG4gIC8vIHRoZSBge2AsIGJ1dCBub3QgYmVmb3JlIHRoZSBgfWAgKGhlbmNlIHRoZSBgKzFgcykuXG4gIGNvbnN0IHNvbWVUb2tlbnMgPSBvcGVuQnJhY2VJbmRleCA+PSAwICYmIGNsb3NlQnJhY2VJbmRleCA+PSAwXG4gICAgPyB0b2tlbnMuc2xpY2UoMSwgb3BlbkJyYWNlSW5kZXggKyAxKS5jb25jYXQodG9rZW5zLnNsaWNlKGNsb3NlQnJhY2VJbmRleCArIDEpKVxuICAgIDogdG9rZW5zLnNsaWNlKDEpO1xuICByZXR1cm4gc29tZVRva2Vucy5zb21lKCh0b2tlbikgPT4gc291cmNlQ29kZS5nZXRDb21tZW50c0JlZm9yZSh0b2tlbikubGVuZ3RoID4gMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgcmVwZWF0ZWQgaW1wb3J0IG9mIHRoZSBzYW1lIG1vZHVsZSBpbiBtdWx0aXBsZSBwbGFjZXMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tZHVwbGljYXRlcycpLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ2NvZGUnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNvbnNpZGVyUXVlcnlTdHJpbmc6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdwcmVmZXItaW5saW5lJzoge1xuICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIC8vIFByZXBhcmUgdGhlIHJlc29sdmVyIGZyb20gb3B0aW9ucy5cbiAgICBjb25zdCBjb25zaWRlclF1ZXJ5U3RyaW5nT3B0aW9uID0gY29udGV4dC5vcHRpb25zWzBdXG4gICAgICAmJiBjb250ZXh0Lm9wdGlvbnNbMF0uY29uc2lkZXJRdWVyeVN0cmluZztcbiAgICBjb25zdCBkZWZhdWx0UmVzb2x2ZXIgPSAoc291cmNlUGF0aCkgPT4gcmVzb2x2ZShzb3VyY2VQYXRoLCBjb250ZXh0KSB8fCBzb3VyY2VQYXRoO1xuICAgIGNvbnN0IHJlc29sdmVyID0gY29uc2lkZXJRdWVyeVN0cmluZ09wdGlvbiA/IChzb3VyY2VQYXRoKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IHNvdXJjZVBhdGgubWF0Y2goL14oW14/XSopXFw/KC4qKSQvKTtcbiAgICAgIGlmICghcGFydHMpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRSZXNvbHZlcihzb3VyY2VQYXRoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBgJHtkZWZhdWx0UmVzb2x2ZXIocGFydHNbMV0pfT8ke3BhcnRzWzJdfWA7XG4gICAgfSA6IGRlZmF1bHRSZXNvbHZlcjtcblxuICAgIGNvbnN0IG1vZHVsZU1hcHMgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRJbXBvcnRNYXAobikge1xuICAgICAgaWYgKCFtb2R1bGVNYXBzLmhhcyhuLnBhcmVudCkpIHtcbiAgICAgICAgbW9kdWxlTWFwcy5zZXQobi5wYXJlbnQsIHtcbiAgICAgICAgICBpbXBvcnRlZDogbmV3IE1hcCgpLFxuICAgICAgICAgIG5zSW1wb3J0ZWQ6IG5ldyBNYXAoKSxcbiAgICAgICAgICBkZWZhdWx0VHlwZXNJbXBvcnRlZDogbmV3IE1hcCgpLFxuICAgICAgICAgIG5hbWVkVHlwZXNJbXBvcnRlZDogbmV3IE1hcCgpLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IG1hcCA9IG1vZHVsZU1hcHMuZ2V0KG4ucGFyZW50KTtcbiAgICAgIGlmIChuLmltcG9ydEtpbmQgPT09ICd0eXBlJykge1xuICAgICAgICByZXR1cm4gbi5zcGVjaWZpZXJzLmxlbmd0aCA+IDAgJiYgbi5zcGVjaWZpZXJzWzBdLnR5cGUgPT09ICdJbXBvcnREZWZhdWx0U3BlY2lmaWVyJyA/IG1hcC5kZWZhdWx0VHlwZXNJbXBvcnRlZCA6IG1hcC5uYW1lZFR5cGVzSW1wb3J0ZWQ7XG4gICAgICB9XG4gICAgICBpZiAobi5zcGVjaWZpZXJzLnNvbWUoKHNwZWMpID0+IHNwZWMuaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSkge1xuICAgICAgICByZXR1cm4gbWFwLm5hbWVkVHlwZXNJbXBvcnRlZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGhhc05hbWVzcGFjZShuKSA/IG1hcC5uc0ltcG9ydGVkIDogbWFwLmltcG9ydGVkO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBJbXBvcnREZWNsYXJhdGlvbihuKSB7XG4gICAgICAgIC8vIHJlc29sdmVkIHBhdGggd2lsbCBjb3ZlciBhbGlhc2VkIGR1cGxpY2F0ZXNcbiAgICAgICAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZXIobi5zb3VyY2UudmFsdWUpO1xuICAgICAgICBjb25zdCBpbXBvcnRNYXAgPSBnZXRJbXBvcnRNYXAobik7XG5cbiAgICAgICAgaWYgKGltcG9ydE1hcC5oYXMocmVzb2x2ZWRQYXRoKSkge1xuICAgICAgICAgIGltcG9ydE1hcC5nZXQocmVzb2x2ZWRQYXRoKS5wdXNoKG4pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGltcG9ydE1hcC5zZXQocmVzb2x2ZWRQYXRoLCBbbl0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnUHJvZ3JhbTpleGl0JygpIHtcbiAgICAgICAgZm9yIChjb25zdCBtYXAgb2YgbW9kdWxlTWFwcy52YWx1ZXMoKSkge1xuICAgICAgICAgIGNoZWNrSW1wb3J0cyhtYXAuaW1wb3J0ZWQsIGNvbnRleHQpO1xuICAgICAgICAgIGNoZWNrSW1wb3J0cyhtYXAubnNJbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgICAgY2hlY2tJbXBvcnRzKG1hcC5kZWZhdWx0VHlwZXNJbXBvcnRlZCwgY29udGV4dCk7XG4gICAgICAgICAgY2hlY2tJbXBvcnRzKG1hcC5uYW1lZFR5cGVzSW1wb3J0ZWQsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19