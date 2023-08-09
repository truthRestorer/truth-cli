'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);

var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var includes = Function.bind.bind(Function.prototype.call)(Array.prototype.includes);

var defaultGroups = ['builtin', 'external', 'parent', 'sibling', 'index'];

// REPORTING AND FIXING

function reverse(array) {
  return array.map(function (v) {
    return Object.assign({}, v, { rank: -v.rank });
  }).reverse();
}

function getTokensOrCommentsAfter(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentAfter(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result;
}

function getTokensOrCommentsBefore(sourceCode, node, count) {
  var currentNodeOrToken = node;
  var result = [];
  for (var i = 0; i < count; i++) {
    currentNodeOrToken = sourceCode.getTokenOrCommentBefore(currentNodeOrToken);
    if (currentNodeOrToken == null) {
      break;
    }
    result.push(currentNodeOrToken);
  }
  return result.reverse();
}

function takeTokensAfterWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsAfter(sourceCode, node, 100);
  var result = [];
  for (var i = 0; i < tokens.length; i++) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result;
}

function takeTokensBeforeWhile(sourceCode, node, condition) {
  var tokens = getTokensOrCommentsBefore(sourceCode, node, 100);
  var result = [];
  for (var i = tokens.length - 1; i >= 0; i--) {
    if (condition(tokens[i])) {
      result.push(tokens[i]);
    } else {
      break;
    }
  }
  return result.reverse();
}

function findOutOfOrder(imported) {
  if (imported.length === 0) {
    return [];
  }
  var maxSeenRankNode = imported[0];
  return imported.filter(function (importedModule) {
    var res = importedModule.rank < maxSeenRankNode.rank;
    if (maxSeenRankNode.rank < importedModule.rank) {
      maxSeenRankNode = importedModule;
    }
    return res;
  });
}

function findRootNode(node) {
  var parent = node;
  while (parent.parent != null && parent.parent.body == null) {
    parent = parent.parent;
  }
  return parent;
}

function findEndOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensAfterWhile(sourceCode, node, commentOnSameLineAs(node));
  var endOfTokens = tokensToEndOfLine.length > 0 ?
  tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1] :
  node.range[1];
  var result = endOfTokens;
  for (var i = endOfTokens; i < sourceCode.text.length; i++) {
    if (sourceCode.text[i] === '\n') {
      result = i + 1;
      break;
    }
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t' && sourceCode.text[i] !== '\r') {
      break;
    }
    result = i + 1;
  }
  return result;
}

function commentOnSameLineAs(node) {
  return function (token) {return (token.type === 'Block' || token.type === 'Line') &&
    token.loc.start.line === token.loc.end.line &&
    token.loc.end.line === node.loc.end.line;};
}

function findStartOfLineWithComments(sourceCode, node) {
  var tokensToEndOfLine = takeTokensBeforeWhile(sourceCode, node, commentOnSameLineAs(node));
  var startOfTokens = tokensToEndOfLine.length > 0 ? tokensToEndOfLine[0].range[0] : node.range[0];
  var result = startOfTokens;
  for (var i = startOfTokens - 1; i > 0; i--) {
    if (sourceCode.text[i] !== ' ' && sourceCode.text[i] !== '\t') {
      break;
    }
    result = i;
  }
  return result;
}

function isRequireExpression(expr) {
  return expr != null &&
  expr.type === 'CallExpression' &&
  expr.callee != null &&
  expr.callee.name === 'require' &&
  expr.arguments != null &&
  expr.arguments.length === 1 &&
  expr.arguments[0].type === 'Literal';
}

function isSupportedRequireModule(node) {
  if (node.type !== 'VariableDeclaration') {
    return false;
  }
  if (node.declarations.length !== 1) {
    return false;
  }
  var decl = node.declarations[0];
  var isPlainRequire = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  isRequireExpression(decl.init);
  var isRequireWithMemberExpression = decl.id && (
  decl.id.type === 'Identifier' || decl.id.type === 'ObjectPattern') &&
  decl.init != null &&
  decl.init.type === 'CallExpression' &&
  decl.init.callee != null &&
  decl.init.callee.type === 'MemberExpression' &&
  isRequireExpression(decl.init.callee.object);
  return isPlainRequire || isRequireWithMemberExpression;
}

function isPlainImportModule(node) {
  return node.type === 'ImportDeclaration' && node.specifiers != null && node.specifiers.length > 0;
}

function isPlainImportEquals(node) {
  return node.type === 'TSImportEqualsDeclaration' && node.moduleReference.expression;
}

function canCrossNodeWhileReorder(node) {
  return isSupportedRequireModule(node) || isPlainImportModule(node) || isPlainImportEquals(node);
}

function canReorderItems(firstNode, secondNode) {
  var parent = firstNode.parent;var _sort =
  [
  parent.body.indexOf(firstNode),
  parent.body.indexOf(secondNode)].
  sort(),_sort2 = _slicedToArray(_sort, 2),firstIndex = _sort2[0],secondIndex = _sort2[1];
  var nodesBetween = parent.body.slice(firstIndex, secondIndex + 1);var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
    for (var _iterator = nodesBetween[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var nodeBetween = _step.value;
      if (!canCrossNodeWhileReorder(nodeBetween)) {
        return false;
      }
    }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
  return true;
}

function makeImportDescription(node) {
  if (node.node.importKind === 'type') {
    return 'type import';
  }
  if (node.node.importKind === 'typeof') {
    return 'typeof import';
  }
  return 'import';
}

function fixOutOfOrder(context, firstNode, secondNode, order) {
  var sourceCode = context.getSourceCode();

  var firstRoot = findRootNode(firstNode.node);
  var firstRootStart = findStartOfLineWithComments(sourceCode, firstRoot);
  var firstRootEnd = findEndOfLineWithComments(sourceCode, firstRoot);

  var secondRoot = findRootNode(secondNode.node);
  var secondRootStart = findStartOfLineWithComments(sourceCode, secondRoot);
  var secondRootEnd = findEndOfLineWithComments(sourceCode, secondRoot);
  var canFix = canReorderItems(firstRoot, secondRoot);

  var newCode = sourceCode.text.substring(secondRootStart, secondRootEnd);
  if (newCode[newCode.length - 1] !== '\n') {
    newCode = String(newCode) + '\n';
  }

  var firstImport = String(makeImportDescription(firstNode)) + ' of `' + String(firstNode.displayName) + '`';
  var secondImport = '`' + String(secondNode.displayName) + '` ' + String(makeImportDescription(secondNode));
  var message = secondImport + ' should occur ' + String(order) + ' ' + firstImport;

  if (order === 'before') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return fixer.replaceTextRange(
        [firstRootStart, secondRootEnd],
        newCode + sourceCode.text.substring(firstRootStart, secondRootStart));} });


  } else if (order === 'after') {
    context.report({
      node: secondNode.node,
      message: message,
      fix: canFix && function (fixer) {return fixer.replaceTextRange(
        [secondRootStart, firstRootEnd],
        sourceCode.text.substring(secondRootEnd, firstRootEnd) + newCode);} });


  }
}

function reportOutOfOrder(context, imported, outOfOrder, order) {
  outOfOrder.forEach(function (imp) {
    var found = imported.find(function () {function hasHigherRank(importedItem) {
        return importedItem.rank > imp.rank;
      }return hasHigherRank;}());
    fixOutOfOrder(context, found, imp, order);
  });
}

function makeOutOfOrderReport(context, imported) {
  var outOfOrder = findOutOfOrder(imported);
  if (!outOfOrder.length) {
    return;
  }

  // There are things to report. Try to minimize the number of reported errors.
  var reversedImported = reverse(imported);
  var reversedOrder = findOutOfOrder(reversedImported);
  if (reversedOrder.length < outOfOrder.length) {
    reportOutOfOrder(context, reversedImported, reversedOrder, 'after');
    return;
  }
  reportOutOfOrder(context, imported, outOfOrder, 'before');
}

var compareString = function compareString(a, b) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
};

/** Some parsers (languages without types) don't provide ImportKind */
var DEAFULT_IMPORT_KIND = 'value';
var getNormalizedValue = function getNormalizedValue(node, toLowerCase) {
  var value = node.value;
  return toLowerCase ? String(value).toLowerCase() : value;
};

function getSorter(alphabetizeOptions) {
  var multiplier = alphabetizeOptions.order === 'asc' ? 1 : -1;
  var orderImportKind = alphabetizeOptions.orderImportKind;
  var multiplierImportKind = orderImportKind !== 'ignore' && (
  alphabetizeOptions.orderImportKind === 'asc' ? 1 : -1);

  return function () {function importsSorter(nodeA, nodeB) {
      var importA = getNormalizedValue(nodeA, alphabetizeOptions.caseInsensitive);
      var importB = getNormalizedValue(nodeB, alphabetizeOptions.caseInsensitive);
      var result = 0;

      if (!includes(importA, '/') && !includes(importB, '/')) {
        result = compareString(importA, importB);
      } else {
        var A = importA.split('/');
        var B = importB.split('/');
        var a = A.length;
        var b = B.length;

        for (var i = 0; i < Math.min(a, b); i++) {
          result = compareString(A[i], B[i]);
          if (result) {break;}
        }

        if (!result && a !== b) {
          result = a < b ? -1 : 1;
        }
      }

      result = result * multiplier;

      // In case the paths are equal (result === 0), sort them by importKind
      if (!result && multiplierImportKind) {
        result = multiplierImportKind * compareString(
        nodeA.node.importKind || DEAFULT_IMPORT_KIND,
        nodeB.node.importKind || DEAFULT_IMPORT_KIND);

      }

      return result;
    }return importsSorter;}();
}

function mutateRanksToAlphabetize(imported, alphabetizeOptions) {
  var groupedByRanks = imported.reduce(function (acc, importedItem) {
    if (!Array.isArray(acc[importedItem.rank])) {
      acc[importedItem.rank] = [];
    }
    acc[importedItem.rank].push(importedItem);
    return acc;
  }, {});

  var sorterFn = getSorter(alphabetizeOptions);

  // sort group keys so that they can be iterated on in order
  var groupRanks = Object.keys(groupedByRanks).sort(function (a, b) {
    return a - b;
  });

  // sort imports locally within their group
  groupRanks.forEach(function (groupRank) {
    groupedByRanks[groupRank].sort(sorterFn);
  });

  // assign globally unique rank to each import
  var newRank = 0;
  var alphabetizedRanks = groupRanks.reduce(function (acc, groupRank) {
    groupedByRanks[groupRank].forEach(function (importedItem) {
      acc[String(importedItem.value) + '|' + String(importedItem.node.importKind)] = parseInt(groupRank, 10) + newRank;
      newRank += 1;
    });
    return acc;
  }, {});

  // mutate the original group-rank with alphabetized-rank
  imported.forEach(function (importedItem) {
    importedItem.rank = alphabetizedRanks[String(importedItem.value) + '|' + String(importedItem.node.importKind)];
  });
}

// DETECTING

function computePathRank(ranks, pathGroups, path, maxPosition) {
  for (var i = 0, l = pathGroups.length; i < l; i++) {var _pathGroups$i =
    pathGroups[i],pattern = _pathGroups$i.pattern,patternOptions = _pathGroups$i.patternOptions,group = _pathGroups$i.group,_pathGroups$i$positio = _pathGroups$i.position,position = _pathGroups$i$positio === undefined ? 1 : _pathGroups$i$positio;
    if ((0, _minimatch2['default'])(path, pattern, patternOptions || { nocomment: true })) {
      return ranks[group] + position / maxPosition;
    }
  }
}

function computeRank(context, ranks, importEntry, excludedImportTypes) {
  var impType = void 0;
  var rank = void 0;
  if (importEntry.type === 'import:object') {
    impType = 'object';
  } else if (importEntry.node.importKind === 'type' && ranks.omittedTypes.indexOf('type') === -1) {
    impType = 'type';
  } else {
    impType = (0, _importType2['default'])(importEntry.value, context);
  }
  if (!excludedImportTypes.has(impType)) {
    rank = computePathRank(ranks.groups, ranks.pathGroups, importEntry.value, ranks.maxPosition);
  }
  if (typeof rank === 'undefined') {
    rank = ranks.groups[impType];
  }
  if (importEntry.type !== 'import' && !importEntry.type.startsWith('import:')) {
    rank += 100;
  }

  return rank;
}

function registerNode(context, importEntry, ranks, imported, excludedImportTypes) {
  var rank = computeRank(context, ranks, importEntry, excludedImportTypes);
  if (rank !== -1) {
    imported.push(Object.assign({}, importEntry, { rank: rank }));
  }
}

function getRequireBlock(node) {
  var n = node;
  // Handle cases like `const baz = require('foo').bar.baz`
  // and `const foo = require('foo')()`
  while (
  n.parent.type === 'MemberExpression' && n.parent.object === n ||
  n.parent.type === 'CallExpression' && n.parent.callee === n)
  {
    n = n.parent;
  }
  if (
  n.parent.type === 'VariableDeclarator' &&
  n.parent.parent.type === 'VariableDeclaration' &&
  n.parent.parent.parent.type === 'Program')
  {
    return n.parent.parent.parent;
  }
}

var types = ['builtin', 'external', 'internal', 'unknown', 'parent', 'sibling', 'index', 'object', 'type'];

// Creates an object with type-rank pairs.
// Example: { index: 0, sibling: 1, parent: 1, external: 1, builtin: 2, internal: 2 }
// Will throw an error if it contains a type that does not exist, or has a duplicate
function convertGroupsToRanks(groups) {
  if (groups.length === 1) {
    // TODO: remove this `if` and fix the bug
    return convertGroupsToRanks(groups[0]);
  }
  var rankObject = groups.reduce(function (res, group, index) {
    [].concat(group).forEach(function (groupItem) {
      if (types.indexOf(groupItem) === -1) {
        throw new Error('Incorrect configuration of the rule: Unknown type `' + String(JSON.stringify(groupItem)) + '`');
      }
      if (res[groupItem] !== undefined) {
        throw new Error('Incorrect configuration of the rule: `' + String(groupItem) + '` is duplicated');
      }
      res[groupItem] = index * 2;
    });
    return res;
  }, {});

  var omittedTypes = types.filter(function (type) {
    return typeof rankObject[type] === 'undefined';
  });

  var ranks = omittedTypes.reduce(function (res, type) {
    res[type] = groups.length * 2;
    return res;
  }, rankObject);

  return { groups: ranks, omittedTypes: omittedTypes };
}

function convertPathGroupsForRanks(pathGroups) {
  var after = {};
  var before = {};

  var transformed = pathGroups.map(function (pathGroup, index) {var
    group = pathGroup.group,positionString = pathGroup.position;
    var position = 0;
    if (positionString === 'after') {
      if (!after[group]) {
        after[group] = 1;
      }
      position = after[group]++;
    } else if (positionString === 'before') {
      if (!before[group]) {
        before[group] = [];
      }
      before[group].push(index);
    }

    return Object.assign({}, pathGroup, { position: position });
  });

  var maxPosition = 1;

  Object.keys(before).forEach(function (group) {
    var groupLength = before[group].length;
    before[group].forEach(function (groupIndex, index) {
      transformed[groupIndex].position = -1 * (groupLength - index);
    });
    maxPosition = Math.max(maxPosition, groupLength);
  });

  Object.keys(after).forEach(function (key) {
    var groupNextPosition = after[key];
    maxPosition = Math.max(maxPosition, groupNextPosition - 1);
  });

  return {
    pathGroups: transformed,
    maxPosition: maxPosition > 10 ? Math.pow(10, Math.ceil(Math.log10(maxPosition))) : 10 };

}

function fixNewLineAfterImport(context, previousImport) {
  var prevRoot = findRootNode(previousImport.node);
  var tokensToEndOfLine = takeTokensAfterWhile(
  context.getSourceCode(), prevRoot, commentOnSameLineAs(prevRoot));

  var endOfLine = prevRoot.range[1];
  if (tokensToEndOfLine.length > 0) {
    endOfLine = tokensToEndOfLine[tokensToEndOfLine.length - 1].range[1];
  }
  return function (fixer) {return fixer.insertTextAfterRange([prevRoot.range[0], endOfLine], '\n');};
}

function removeNewLineAfterImport(context, currentImport, previousImport) {
  var sourceCode = context.getSourceCode();
  var prevRoot = findRootNode(previousImport.node);
  var currRoot = findRootNode(currentImport.node);
  var rangeToRemove = [
  findEndOfLineWithComments(sourceCode, prevRoot),
  findStartOfLineWithComments(sourceCode, currRoot)];

  if (/^\s*$/.test(sourceCode.text.substring(rangeToRemove[0], rangeToRemove[1]))) {
    return function (fixer) {return fixer.removeRange(rangeToRemove);};
  }
  return undefined;
}

function makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup) {
  var getNumberOfEmptyLinesBetween = function getNumberOfEmptyLinesBetween(currentImport, previousImport) {
    var linesBetweenImports = context.getSourceCode().lines.slice(
    previousImport.node.loc.end.line,
    currentImport.node.loc.start.line - 1);


    return linesBetweenImports.filter(function (line) {return !line.trim().length;}).length;
  };
  var getIsStartOfDistinctGroup = function getIsStartOfDistinctGroup(currentImport, previousImport) {return currentImport.rank - 1 >= previousImport.rank;};
  var previousImport = imported[0];

  imported.slice(1).forEach(function (currentImport) {
    var emptyLinesBetween = getNumberOfEmptyLinesBetween(currentImport, previousImport);
    var isStartOfDistinctGroup = getIsStartOfDistinctGroup(currentImport, previousImport);

    if (newlinesBetweenImports === 'always' ||
    newlinesBetweenImports === 'always-and-inside-groups') {
      if (currentImport.rank !== previousImport.rank && emptyLinesBetween === 0) {
        if (distinctGroup || !distinctGroup && isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be at least one empty line between import groups',
            fix: fixNewLineAfterImport(context, previousImport) });

        }
      } else if (emptyLinesBetween > 0 &&
      newlinesBetweenImports !== 'always-and-inside-groups') {
        if (distinctGroup && currentImport.rank === previousImport.rank || !distinctGroup && !isStartOfDistinctGroup) {
          context.report({
            node: previousImport.node,
            message: 'There should be no empty line within import group',
            fix: removeNewLineAfterImport(context, currentImport, previousImport) });

        }
      }
    } else if (emptyLinesBetween > 0) {
      context.report({
        node: previousImport.node,
        message: 'There should be no empty line between import groups',
        fix: removeNewLineAfterImport(context, currentImport, previousImport) });

    }

    previousImport = currentImport;
  });
}

function getAlphabetizeConfig(options) {
  var alphabetize = options.alphabetize || {};
  var order = alphabetize.order || 'ignore';
  var orderImportKind = alphabetize.orderImportKind || 'ignore';
  var caseInsensitive = alphabetize.caseInsensitive || false;

  return { order: order, orderImportKind: orderImportKind, caseInsensitive: caseInsensitive };
}

// TODO, semver-major: Change the default of "distinctGroup" from true to false
var defaultDistinctGroup = true;

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Enforce a convention in module import order.',
      url: (0, _docsUrl2['default'])('order') },


    fixable: 'code',
    schema: [
    {
      type: 'object',
      properties: {
        groups: {
          type: 'array' },

        pathGroupsExcludedImportTypes: {
          type: 'array' },

        distinctGroup: {
          type: 'boolean',
          'default': defaultDistinctGroup },

        pathGroups: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              pattern: {
                type: 'string' },

              patternOptions: {
                type: 'object' },

              group: {
                type: 'string',
                'enum': types },

              position: {
                type: 'string',
                'enum': ['after', 'before'] } },


            additionalProperties: false,
            required: ['pattern', 'group'] } },


        'newlines-between': {
          'enum': [
          'ignore',
          'always',
          'always-and-inside-groups',
          'never'] },


        alphabetize: {
          type: 'object',
          properties: {
            caseInsensitive: {
              type: 'boolean',
              'default': false },

            order: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' },

            orderImportKind: {
              'enum': ['ignore', 'asc', 'desc'],
              'default': 'ignore' } },


          additionalProperties: false },

        warnOnUnassignedImports: {
          type: 'boolean',
          'default': false } },


      additionalProperties: false }] },




  create: function () {function importOrderRule(context) {
      var options = context.options[0] || {};
      var newlinesBetweenImports = options['newlines-between'] || 'ignore';
      var pathGroupsExcludedImportTypes = new Set(options.pathGroupsExcludedImportTypes || ['builtin', 'external', 'object']);
      var alphabetize = getAlphabetizeConfig(options);
      var distinctGroup = options.distinctGroup == null ? defaultDistinctGroup : !!options.distinctGroup;
      var ranks = void 0;

      try {var _convertPathGroupsFor =
        convertPathGroupsForRanks(options.pathGroups || []),pathGroups = _convertPathGroupsFor.pathGroups,maxPosition = _convertPathGroupsFor.maxPosition;var _convertGroupsToRanks =
        convertGroupsToRanks(options.groups || defaultGroups),groups = _convertGroupsToRanks.groups,omittedTypes = _convertGroupsToRanks.omittedTypes;
        ranks = {
          groups: groups,
          omittedTypes: omittedTypes,
          pathGroups: pathGroups,
          maxPosition: maxPosition };

      } catch (error) {
        // Malformed configuration
        return {
          Program: function () {function Program(node) {
              context.report(node, error.message);
            }return Program;}() };

      }
      var importMap = new Map();

      function getBlockImports(node) {
        if (!importMap.has(node)) {
          importMap.set(node, []);
        }
        return importMap.get(node);
      }

      return {
        ImportDeclaration: function () {function handleImports(node) {
            // Ignoring unassigned imports unless warnOnUnassignedImports is set
            if (node.specifiers.length || options.warnOnUnassignedImports) {
              var name = node.source.value;
              registerNode(
              context,
              {
                node: node,
                value: name,
                displayName: name,
                type: 'import' },

              ranks,
              getBlockImports(node.parent),
              pathGroupsExcludedImportTypes);

            }
          }return handleImports;}(),
        TSImportEqualsDeclaration: function () {function handleImports(node) {
            var displayName = void 0;
            var value = void 0;
            var type = void 0;
            // skip "export import"s
            if (node.isExport) {
              return;
            }
            if (node.moduleReference.type === 'TSExternalModuleReference') {
              value = node.moduleReference.expression.value;
              displayName = value;
              type = 'import';
            } else {
              value = '';
              displayName = context.getSourceCode().getText(node.moduleReference);
              type = 'import:object';
            }
            registerNode(
            context,
            {
              node: node,
              value: value,
              displayName: displayName,
              type: type },

            ranks,
            getBlockImports(node.parent),
            pathGroupsExcludedImportTypes);

          }return handleImports;}(),
        CallExpression: function () {function handleRequires(node) {
            if (!(0, _staticRequire2['default'])(node)) {
              return;
            }
            var block = getRequireBlock(node);
            if (!block) {
              return;
            }
            var name = node.arguments[0].value;
            registerNode(
            context,
            {
              node: node,
              value: name,
              displayName: name,
              type: 'require' },

            ranks,
            getBlockImports(block),
            pathGroupsExcludedImportTypes);

          }return handleRequires;}(),
        'Program:exit': function () {function reportAndReset() {
            importMap.forEach(function (imported) {
              if (newlinesBetweenImports !== 'ignore') {
                makeNewlinesBetweenReport(context, imported, newlinesBetweenImports, distinctGroup);
              }

              if (alphabetize.order !== 'ignore') {
                mutateRanksToAlphabetize(imported, alphabetize);
              }

              makeOutOfOrderReport(context, imported);
            });

            importMap.clear();
          }return reportAndReset;}() };

    }return importOrderRule;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9vcmRlci5qcyJdLCJuYW1lcyI6WyJpbmNsdWRlcyIsIkZ1bmN0aW9uIiwiYmluZCIsInByb3RvdHlwZSIsImNhbGwiLCJBcnJheSIsImRlZmF1bHRHcm91cHMiLCJyZXZlcnNlIiwiYXJyYXkiLCJtYXAiLCJ2IiwicmFuayIsImdldFRva2Vuc09yQ29tbWVudHNBZnRlciIsInNvdXJjZUNvZGUiLCJub2RlIiwiY291bnQiLCJjdXJyZW50Tm9kZU9yVG9rZW4iLCJyZXN1bHQiLCJpIiwiZ2V0VG9rZW5PckNvbW1lbnRBZnRlciIsInB1c2giLCJnZXRUb2tlbnNPckNvbW1lbnRzQmVmb3JlIiwiZ2V0VG9rZW5PckNvbW1lbnRCZWZvcmUiLCJ0YWtlVG9rZW5zQWZ0ZXJXaGlsZSIsImNvbmRpdGlvbiIsInRva2VucyIsImxlbmd0aCIsInRha2VUb2tlbnNCZWZvcmVXaGlsZSIsImZpbmRPdXRPZk9yZGVyIiwiaW1wb3J0ZWQiLCJtYXhTZWVuUmFua05vZGUiLCJmaWx0ZXIiLCJpbXBvcnRlZE1vZHVsZSIsInJlcyIsImZpbmRSb290Tm9kZSIsInBhcmVudCIsImJvZHkiLCJmaW5kRW5kT2ZMaW5lV2l0aENvbW1lbnRzIiwidG9rZW5zVG9FbmRPZkxpbmUiLCJjb21tZW50T25TYW1lTGluZUFzIiwiZW5kT2ZUb2tlbnMiLCJyYW5nZSIsInRleHQiLCJ0b2tlbiIsInR5cGUiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJlbmQiLCJmaW5kU3RhcnRPZkxpbmVXaXRoQ29tbWVudHMiLCJzdGFydE9mVG9rZW5zIiwiaXNSZXF1aXJlRXhwcmVzc2lvbiIsImV4cHIiLCJjYWxsZWUiLCJuYW1lIiwiYXJndW1lbnRzIiwiaXNTdXBwb3J0ZWRSZXF1aXJlTW9kdWxlIiwiZGVjbGFyYXRpb25zIiwiZGVjbCIsImlzUGxhaW5SZXF1aXJlIiwiaWQiLCJpbml0IiwiaXNSZXF1aXJlV2l0aE1lbWJlckV4cHJlc3Npb24iLCJvYmplY3QiLCJpc1BsYWluSW1wb3J0TW9kdWxlIiwic3BlY2lmaWVycyIsImlzUGxhaW5JbXBvcnRFcXVhbHMiLCJtb2R1bGVSZWZlcmVuY2UiLCJleHByZXNzaW9uIiwiY2FuQ3Jvc3NOb2RlV2hpbGVSZW9yZGVyIiwiY2FuUmVvcmRlckl0ZW1zIiwiZmlyc3ROb2RlIiwic2Vjb25kTm9kZSIsImluZGV4T2YiLCJzb3J0IiwiZmlyc3RJbmRleCIsInNlY29uZEluZGV4Iiwibm9kZXNCZXR3ZWVuIiwic2xpY2UiLCJub2RlQmV0d2VlbiIsIm1ha2VJbXBvcnREZXNjcmlwdGlvbiIsImltcG9ydEtpbmQiLCJmaXhPdXRPZk9yZGVyIiwiY29udGV4dCIsIm9yZGVyIiwiZ2V0U291cmNlQ29kZSIsImZpcnN0Um9vdCIsImZpcnN0Um9vdFN0YXJ0IiwiZmlyc3RSb290RW5kIiwic2Vjb25kUm9vdCIsInNlY29uZFJvb3RTdGFydCIsInNlY29uZFJvb3RFbmQiLCJjYW5GaXgiLCJuZXdDb2RlIiwic3Vic3RyaW5nIiwiZmlyc3RJbXBvcnQiLCJkaXNwbGF5TmFtZSIsInNlY29uZEltcG9ydCIsIm1lc3NhZ2UiLCJyZXBvcnQiLCJmaXgiLCJmaXhlciIsInJlcGxhY2VUZXh0UmFuZ2UiLCJyZXBvcnRPdXRPZk9yZGVyIiwib3V0T2ZPcmRlciIsImZvckVhY2giLCJpbXAiLCJmb3VuZCIsImZpbmQiLCJoYXNIaWdoZXJSYW5rIiwiaW1wb3J0ZWRJdGVtIiwibWFrZU91dE9mT3JkZXJSZXBvcnQiLCJyZXZlcnNlZEltcG9ydGVkIiwicmV2ZXJzZWRPcmRlciIsImNvbXBhcmVTdHJpbmciLCJhIiwiYiIsIkRFQUZVTFRfSU1QT1JUX0tJTkQiLCJnZXROb3JtYWxpemVkVmFsdWUiLCJ0b0xvd2VyQ2FzZSIsInZhbHVlIiwiU3RyaW5nIiwiZ2V0U29ydGVyIiwiYWxwaGFiZXRpemVPcHRpb25zIiwibXVsdGlwbGllciIsIm9yZGVySW1wb3J0S2luZCIsIm11bHRpcGxpZXJJbXBvcnRLaW5kIiwiaW1wb3J0c1NvcnRlciIsIm5vZGVBIiwibm9kZUIiLCJpbXBvcnRBIiwiY2FzZUluc2Vuc2l0aXZlIiwiaW1wb3J0QiIsIkEiLCJzcGxpdCIsIkIiLCJNYXRoIiwibWluIiwibXV0YXRlUmFua3NUb0FscGhhYmV0aXplIiwiZ3JvdXBlZEJ5UmFua3MiLCJyZWR1Y2UiLCJhY2MiLCJpc0FycmF5Iiwic29ydGVyRm4iLCJncm91cFJhbmtzIiwiT2JqZWN0Iiwia2V5cyIsImdyb3VwUmFuayIsIm5ld1JhbmsiLCJhbHBoYWJldGl6ZWRSYW5rcyIsInBhcnNlSW50IiwiY29tcHV0ZVBhdGhSYW5rIiwicmFua3MiLCJwYXRoR3JvdXBzIiwicGF0aCIsIm1heFBvc2l0aW9uIiwibCIsInBhdHRlcm4iLCJwYXR0ZXJuT3B0aW9ucyIsImdyb3VwIiwicG9zaXRpb24iLCJub2NvbW1lbnQiLCJjb21wdXRlUmFuayIsImltcG9ydEVudHJ5IiwiZXhjbHVkZWRJbXBvcnRUeXBlcyIsImltcFR5cGUiLCJvbWl0dGVkVHlwZXMiLCJoYXMiLCJncm91cHMiLCJzdGFydHNXaXRoIiwicmVnaXN0ZXJOb2RlIiwiZ2V0UmVxdWlyZUJsb2NrIiwibiIsInR5cGVzIiwiY29udmVydEdyb3Vwc1RvUmFua3MiLCJyYW5rT2JqZWN0IiwiaW5kZXgiLCJjb25jYXQiLCJncm91cEl0ZW0iLCJFcnJvciIsIkpTT04iLCJzdHJpbmdpZnkiLCJ1bmRlZmluZWQiLCJjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzIiwiYWZ0ZXIiLCJiZWZvcmUiLCJ0cmFuc2Zvcm1lZCIsInBhdGhHcm91cCIsInBvc2l0aW9uU3RyaW5nIiwiZ3JvdXBMZW5ndGgiLCJncm91cEluZGV4IiwibWF4Iiwia2V5IiwiZ3JvdXBOZXh0UG9zaXRpb24iLCJwb3ciLCJjZWlsIiwibG9nMTAiLCJmaXhOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJwcmV2aW91c0ltcG9ydCIsInByZXZSb290IiwiZW5kT2ZMaW5lIiwiaW5zZXJ0VGV4dEFmdGVyUmFuZ2UiLCJyZW1vdmVOZXdMaW5lQWZ0ZXJJbXBvcnQiLCJjdXJyZW50SW1wb3J0IiwiY3VyclJvb3QiLCJyYW5nZVRvUmVtb3ZlIiwidGVzdCIsInJlbW92ZVJhbmdlIiwibWFrZU5ld2xpbmVzQmV0d2VlblJlcG9ydCIsIm5ld2xpbmVzQmV0d2VlbkltcG9ydHMiLCJkaXN0aW5jdEdyb3VwIiwiZ2V0TnVtYmVyT2ZFbXB0eUxpbmVzQmV0d2VlbiIsImxpbmVzQmV0d2VlbkltcG9ydHMiLCJsaW5lcyIsInRyaW0iLCJnZXRJc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwIiwiZW1wdHlMaW5lc0JldHdlZW4iLCJpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwIiwiZ2V0QWxwaGFiZXRpemVDb25maWciLCJvcHRpb25zIiwiYWxwaGFiZXRpemUiLCJkZWZhdWx0RGlzdGluY3RHcm91cCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsInBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzIiwiaXRlbXMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsInJlcXVpcmVkIiwid2Fybk9uVW5hc3NpZ25lZEltcG9ydHMiLCJjcmVhdGUiLCJpbXBvcnRPcmRlclJ1bGUiLCJTZXQiLCJlcnJvciIsIlByb2dyYW0iLCJpbXBvcnRNYXAiLCJNYXAiLCJnZXRCbG9ja0ltcG9ydHMiLCJzZXQiLCJnZXQiLCJJbXBvcnREZWNsYXJhdGlvbiIsImhhbmRsZUltcG9ydHMiLCJzb3VyY2UiLCJUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIiwiaXNFeHBvcnQiLCJnZXRUZXh0IiwiQ2FsbEV4cHJlc3Npb24iLCJoYW5kbGVSZXF1aXJlcyIsImJsb2NrIiwicmVwb3J0QW5kUmVzZXQiLCJjbGVhciJdLCJtYXBwaW5ncyI6IkFBQUEsYTs7QUFFQSxzQzs7QUFFQSxnRDtBQUNBLHNEO0FBQ0EscUM7O0FBRUEsSUFBTUEsV0FBV0MsU0FBU0MsSUFBVCxDQUFjQSxJQUFkLENBQW1CRCxTQUFTRSxTQUFU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QUFDeENkLHNCQUFVekksT0FBVixDQUFrQixVQUFDNUUsUUFBRCxFQUFjO0FBQzlCLGtCQUFJb0wsMkJBQTJCLFFBQS9CLEVBQXlDO0FBQ3ZDRCwwQ0FBMEI3SCxPQUExQixFQUFtQ3RELFFBQW5DLEVBQTZDb0wsc0JBQTdDLEVBQXFFQyxhQUFyRTtBQUNEOztBQUVELGtCQUFJVSxZQUFZeEksS0FBWixLQUFzQixRQUExQixFQUFvQztBQUNsQ3NELHlDQUF5QjdHLFFBQXpCLEVBQW1DK0wsV0FBbkM7QUFDRDs7QUFFRDdHLG1DQUFxQjVCLE9BQXJCLEVBQThCdEQsUUFBOUI7QUFDRCxhQVZEOztBQVlBcU4sc0JBQVVlLEtBQVY7QUFDRCxXQWRELE9BQXlCRCxjQUF6QixJQXZFSyxFQUFQOztBQXVGRCxLQXpIRCxPQUFpQmxCLGVBQWpCLElBcEZlLEVBQWpCIiwiZmlsZSI6Im9yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5cbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5pbXBvcnQgaXNTdGF0aWNSZXF1aXJlIGZyb20gJy4uL2NvcmUvc3RhdGljUmVxdWlyZSc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuY29uc3QgaW5jbHVkZXMgPSBGdW5jdGlvbi5iaW5kLmJpbmQoRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwpKEFycmF5LnByb3RvdHlwZS5pbmNsdWRlcyk7XG5cbmNvbnN0IGRlZmF1bHRHcm91cHMgPSBbJ2J1aWx0aW4nLCAnZXh0ZXJuYWwnLCAncGFyZW50JywgJ3NpYmxpbmcnLCAnaW5kZXgnXTtcblxuLy8gUkVQT1JUSU5HIEFORCBGSVhJTkdcblxuZnVuY3Rpb24gcmV2ZXJzZShhcnJheSkge1xuICByZXR1cm4gYXJyYXkubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgcmV0dXJuIHsgLi4udiwgcmFuazogLXYucmFuayB9O1xuICB9KS5yZXZlcnNlKCk7XG59XG5cbmZ1bmN0aW9uIGdldFRva2Vuc09yQ29tbWVudHNBZnRlcihzb3VyY2VDb2RlLCBub2RlLCBjb3VudCkge1xuICBsZXQgY3VycmVudE5vZGVPclRva2VuID0gbm9kZTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIGN1cnJlbnROb2RlT3JUb2tlbiA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5PckNvbW1lbnRBZnRlcihjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICAgIGlmIChjdXJyZW50Tm9kZU9yVG9rZW4gPT0gbnVsbCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJlc3VsdC5wdXNoKGN1cnJlbnROb2RlT3JUb2tlbik7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZShzb3VyY2VDb2RlLCBub2RlLCBjb3VudCkge1xuICBsZXQgY3VycmVudE5vZGVPclRva2VuID0gbm9kZTtcbiAgY29uc3QgcmVzdWx0ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xuICAgIGN1cnJlbnROb2RlT3JUb2tlbiA9IHNvdXJjZUNvZGUuZ2V0VG9rZW5PckNvbW1lbnRCZWZvcmUoY3VycmVudE5vZGVPclRva2VuKTtcbiAgICBpZiAoY3VycmVudE5vZGVPclRva2VuID09IG51bGwpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChjdXJyZW50Tm9kZU9yVG9rZW4pO1xuICB9XG4gIHJldHVybiByZXN1bHQucmV2ZXJzZSgpO1xufVxuXG5mdW5jdGlvbiB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb25kaXRpb24pIHtcbiAgY29uc3QgdG9rZW5zID0gZ2V0VG9rZW5zT3JDb21tZW50c0FmdGVyKHNvdXJjZUNvZGUsIG5vZGUsIDEwMCk7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKykge1xuICAgIGlmIChjb25kaXRpb24odG9rZW5zW2ldKSkge1xuICAgICAgcmVzdWx0LnB1c2godG9rZW5zW2ldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIHRha2VUb2tlbnNCZWZvcmVXaGlsZShzb3VyY2VDb2RlLCBub2RlLCBjb25kaXRpb24pIHtcbiAgY29uc3QgdG9rZW5zID0gZ2V0VG9rZW5zT3JDb21tZW50c0JlZm9yZShzb3VyY2VDb2RlLCBub2RlLCAxMDApO1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IHRva2Vucy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChjb25kaXRpb24odG9rZW5zW2ldKSkge1xuICAgICAgcmVzdWx0LnB1c2godG9rZW5zW2ldKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQucmV2ZXJzZSgpO1xufVxuXG5mdW5jdGlvbiBmaW5kT3V0T2ZPcmRlcihpbXBvcnRlZCkge1xuICBpZiAoaW1wb3J0ZWQubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGxldCBtYXhTZWVuUmFua05vZGUgPSBpbXBvcnRlZFswXTtcbiAgcmV0dXJuIGltcG9ydGVkLmZpbHRlcihmdW5jdGlvbiAoaW1wb3J0ZWRNb2R1bGUpIHtcbiAgICBjb25zdCByZXMgPSBpbXBvcnRlZE1vZHVsZS5yYW5rIDwgbWF4U2VlblJhbmtOb2RlLnJhbms7XG4gICAgaWYgKG1heFNlZW5SYW5rTm9kZS5yYW5rIDwgaW1wb3J0ZWRNb2R1bGUucmFuaykge1xuICAgICAgbWF4U2VlblJhbmtOb2RlID0gaW1wb3J0ZWRNb2R1bGU7XG4gICAgfVxuICAgIHJldHVybiByZXM7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBmaW5kUm9vdE5vZGUobm9kZSkge1xuICBsZXQgcGFyZW50ID0gbm9kZTtcbiAgd2hpbGUgKHBhcmVudC5wYXJlbnQgIT0gbnVsbCAmJiBwYXJlbnQucGFyZW50LmJvZHkgPT0gbnVsbCkge1xuICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIHBhcmVudDtcbn1cblxuZnVuY3Rpb24gZmluZEVuZE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBub2RlKSB7XG4gIGNvbnN0IHRva2Vuc1RvRW5kT2ZMaW5lID0gdGFrZVRva2Vuc0FmdGVyV2hpbGUoc291cmNlQ29kZSwgbm9kZSwgY29tbWVudE9uU2FtZUxpbmVBcyhub2RlKSk7XG4gIGNvbnN0IGVuZE9mVG9rZW5zID0gdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoID4gMFxuICAgID8gdG9rZW5zVG9FbmRPZkxpbmVbdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoIC0gMV0ucmFuZ2VbMV1cbiAgICA6IG5vZGUucmFuZ2VbMV07XG4gIGxldCByZXN1bHQgPSBlbmRPZlRva2VucztcbiAgZm9yIChsZXQgaSA9IGVuZE9mVG9rZW5zOyBpIDwgc291cmNlQ29kZS50ZXh0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHNvdXJjZUNvZGUudGV4dFtpXSA9PT0gJ1xcbicpIHtcbiAgICAgIHJlc3VsdCA9IGkgKyAxO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGlmIChzb3VyY2VDb2RlLnRleHRbaV0gIT09ICcgJyAmJiBzb3VyY2VDb2RlLnRleHRbaV0gIT09ICdcXHQnICYmIHNvdXJjZUNvZGUudGV4dFtpXSAhPT0gJ1xccicpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXN1bHQgPSBpICsgMTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBjb21tZW50T25TYW1lTGluZUFzKG5vZGUpIHtcbiAgcmV0dXJuICh0b2tlbikgPT4gKHRva2VuLnR5cGUgPT09ICdCbG9jaycgfHwgIHRva2VuLnR5cGUgPT09ICdMaW5lJylcbiAgICAgICYmIHRva2VuLmxvYy5zdGFydC5saW5lID09PSB0b2tlbi5sb2MuZW5kLmxpbmVcbiAgICAgICYmIHRva2VuLmxvYy5lbmQubGluZSA9PT0gbm9kZS5sb2MuZW5kLmxpbmU7XG59XG5cbmZ1bmN0aW9uIGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBub2RlKSB7XG4gIGNvbnN0IHRva2Vuc1RvRW5kT2ZMaW5lID0gdGFrZVRva2Vuc0JlZm9yZVdoaWxlKHNvdXJjZUNvZGUsIG5vZGUsIGNvbW1lbnRPblNhbWVMaW5lQXMobm9kZSkpO1xuICBjb25zdCBzdGFydE9mVG9rZW5zID0gdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoID4gMCA/IHRva2Vuc1RvRW5kT2ZMaW5lWzBdLnJhbmdlWzBdIDogbm9kZS5yYW5nZVswXTtcbiAgbGV0IHJlc3VsdCA9IHN0YXJ0T2ZUb2tlbnM7XG4gIGZvciAobGV0IGkgPSBzdGFydE9mVG9rZW5zIC0gMTsgaSA+IDA7IGktLSkge1xuICAgIGlmIChzb3VyY2VDb2RlLnRleHRbaV0gIT09ICcgJyAmJiBzb3VyY2VDb2RlLnRleHRbaV0gIT09ICdcXHQnKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgcmVzdWx0ID0gaTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpc1JlcXVpcmVFeHByZXNzaW9uKGV4cHIpIHtcbiAgcmV0dXJuIGV4cHIgIT0gbnVsbFxuICAgICYmIGV4cHIudHlwZSA9PT0gJ0NhbGxFeHByZXNzaW9uJ1xuICAgICYmIGV4cHIuY2FsbGVlICE9IG51bGxcbiAgICAmJiBleHByLmNhbGxlZS5uYW1lID09PSAncmVxdWlyZSdcbiAgICAmJiBleHByLmFyZ3VtZW50cyAhPSBudWxsXG4gICAgJiYgZXhwci5hcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgJiYgZXhwci5hcmd1bWVudHNbMF0udHlwZSA9PT0gJ0xpdGVyYWwnO1xufVxuXG5mdW5jdGlvbiBpc1N1cHBvcnRlZFJlcXVpcmVNb2R1bGUobm9kZSkge1xuICBpZiAobm9kZS50eXBlICE9PSAnVmFyaWFibGVEZWNsYXJhdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG5vZGUuZGVjbGFyYXRpb25zLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBkZWNsID0gbm9kZS5kZWNsYXJhdGlvbnNbMF07XG4gIGNvbnN0IGlzUGxhaW5SZXF1aXJlID0gZGVjbC5pZFxuICAgICYmIChkZWNsLmlkLnR5cGUgPT09ICdJZGVudGlmaWVyJyB8fCBkZWNsLmlkLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJylcbiAgICAmJiBpc1JlcXVpcmVFeHByZXNzaW9uKGRlY2wuaW5pdCk7XG4gIGNvbnN0IGlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uID0gZGVjbC5pZFxuICAgICYmIChkZWNsLmlkLnR5cGUgPT09ICdJZGVudGlmaWVyJyB8fCBkZWNsLmlkLnR5cGUgPT09ICdPYmplY3RQYXR0ZXJuJylcbiAgICAmJiBkZWNsLmluaXQgIT0gbnVsbFxuICAgICYmIGRlY2wuaW5pdC50eXBlID09PSAnQ2FsbEV4cHJlc3Npb24nXG4gICAgJiYgZGVjbC5pbml0LmNhbGxlZSAhPSBudWxsXG4gICAgJiYgZGVjbC5pbml0LmNhbGxlZS50eXBlID09PSAnTWVtYmVyRXhwcmVzc2lvbidcbiAgICAmJiBpc1JlcXVpcmVFeHByZXNzaW9uKGRlY2wuaW5pdC5jYWxsZWUub2JqZWN0KTtcbiAgcmV0dXJuIGlzUGxhaW5SZXF1aXJlIHx8IGlzUmVxdWlyZVdpdGhNZW1iZXJFeHByZXNzaW9uO1xufVxuXG5mdW5jdGlvbiBpc1BsYWluSW1wb3J0TW9kdWxlKG5vZGUpIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ0ltcG9ydERlY2xhcmF0aW9uJyAmJiBub2RlLnNwZWNpZmllcnMgIT0gbnVsbCAmJiBub2RlLnNwZWNpZmllcnMubGVuZ3RoID4gMDtcbn1cblxuZnVuY3Rpb24gaXNQbGFpbkltcG9ydEVxdWFscyhub2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uJyAmJiBub2RlLm1vZHVsZVJlZmVyZW5jZS5leHByZXNzaW9uO1xufVxuXG5mdW5jdGlvbiBjYW5Dcm9zc05vZGVXaGlsZVJlb3JkZXIobm9kZSkge1xuICByZXR1cm4gaXNTdXBwb3J0ZWRSZXF1aXJlTW9kdWxlKG5vZGUpIHx8IGlzUGxhaW5JbXBvcnRNb2R1bGUobm9kZSkgfHwgaXNQbGFpbkltcG9ydEVxdWFscyhub2RlKTtcbn1cblxuZnVuY3Rpb24gY2FuUmVvcmRlckl0ZW1zKGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSkge1xuICBjb25zdCBwYXJlbnQgPSBmaXJzdE5vZGUucGFyZW50O1xuICBjb25zdCBbZmlyc3RJbmRleCwgc2Vjb25kSW5kZXhdID0gW1xuICAgIHBhcmVudC5ib2R5LmluZGV4T2YoZmlyc3ROb2RlKSxcbiAgICBwYXJlbnQuYm9keS5pbmRleE9mKHNlY29uZE5vZGUpLFxuICBdLnNvcnQoKTtcbiAgY29uc3Qgbm9kZXNCZXR3ZWVuID0gcGFyZW50LmJvZHkuc2xpY2UoZmlyc3RJbmRleCwgc2Vjb25kSW5kZXggKyAxKTtcbiAgZm9yIChjb25zdCBub2RlQmV0d2VlbiBvZiBub2Rlc0JldHdlZW4pIHtcbiAgICBpZiAoIWNhbkNyb3NzTm9kZVdoaWxlUmVvcmRlcihub2RlQmV0d2VlbikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIG1ha2VJbXBvcnREZXNjcmlwdGlvbihub2RlKSB7XG4gIGlmIChub2RlLm5vZGUuaW1wb3J0S2luZCA9PT0gJ3R5cGUnKSB7XG4gICAgcmV0dXJuICd0eXBlIGltcG9ydCc7XG4gIH1cbiAgaWYgKG5vZGUubm9kZS5pbXBvcnRLaW5kID09PSAndHlwZW9mJykge1xuICAgIHJldHVybiAndHlwZW9mIGltcG9ydCc7XG4gIH1cbiAgcmV0dXJuICdpbXBvcnQnO1xufVxuXG5mdW5jdGlvbiBmaXhPdXRPZk9yZGVyKGNvbnRleHQsIGZpcnN0Tm9kZSwgc2Vjb25kTm9kZSwgb3JkZXIpIHtcbiAgY29uc3Qgc291cmNlQ29kZSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpO1xuXG4gIGNvbnN0IGZpcnN0Um9vdCA9IGZpbmRSb290Tm9kZShmaXJzdE5vZGUubm9kZSk7XG4gIGNvbnN0IGZpcnN0Um9vdFN0YXJ0ID0gZmluZFN0YXJ0T2ZMaW5lV2l0aENvbW1lbnRzKHNvdXJjZUNvZGUsIGZpcnN0Um9vdCk7XG4gIGNvbnN0IGZpcnN0Um9vdEVuZCA9IGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgZmlyc3RSb290KTtcblxuICBjb25zdCBzZWNvbmRSb290ID0gZmluZFJvb3ROb2RlKHNlY29uZE5vZGUubm9kZSk7XG4gIGNvbnN0IHNlY29uZFJvb3RTdGFydCA9IGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBzZWNvbmRSb290KTtcbiAgY29uc3Qgc2Vjb25kUm9vdEVuZCA9IGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgc2Vjb25kUm9vdCk7XG4gIGNvbnN0IGNhbkZpeCA9IGNhblJlb3JkZXJJdGVtcyhmaXJzdFJvb3QsIHNlY29uZFJvb3QpO1xuXG4gIGxldCBuZXdDb2RlID0gc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhzZWNvbmRSb290U3RhcnQsIHNlY29uZFJvb3RFbmQpO1xuICBpZiAobmV3Q29kZVtuZXdDb2RlLmxlbmd0aCAtIDFdICE9PSAnXFxuJykge1xuICAgIG5ld0NvZGUgPSBgJHtuZXdDb2RlfVxcbmA7XG4gIH1cblxuICBjb25zdCBmaXJzdEltcG9ydCA9IGAke21ha2VJbXBvcnREZXNjcmlwdGlvbihmaXJzdE5vZGUpfSBvZiBcXGAke2ZpcnN0Tm9kZS5kaXNwbGF5TmFtZX1cXGBgO1xuICBjb25zdCBzZWNvbmRJbXBvcnQgPSBgXFxgJHtzZWNvbmROb2RlLmRpc3BsYXlOYW1lfVxcYCAke21ha2VJbXBvcnREZXNjcmlwdGlvbihzZWNvbmROb2RlKX1gO1xuICBjb25zdCBtZXNzYWdlID0gYCR7c2Vjb25kSW1wb3J0fSBzaG91bGQgb2NjdXIgJHtvcmRlcn0gJHtmaXJzdEltcG9ydH1gO1xuXG4gIGlmIChvcmRlciA9PT0gJ2JlZm9yZScpIHtcbiAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICBub2RlOiBzZWNvbmROb2RlLm5vZGUsXG4gICAgICBtZXNzYWdlLFxuICAgICAgZml4OiBjYW5GaXggJiYgKChmaXhlcikgPT4gZml4ZXIucmVwbGFjZVRleHRSYW5nZShcbiAgICAgICAgW2ZpcnN0Um9vdFN0YXJ0LCBzZWNvbmRSb290RW5kXSxcbiAgICAgICAgbmV3Q29kZSArIHNvdXJjZUNvZGUudGV4dC5zdWJzdHJpbmcoZmlyc3RSb290U3RhcnQsIHNlY29uZFJvb3RTdGFydCksXG4gICAgICApKSxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChvcmRlciA9PT0gJ2FmdGVyJykge1xuICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgIG5vZGU6IHNlY29uZE5vZGUubm9kZSxcbiAgICAgIG1lc3NhZ2UsXG4gICAgICBmaXg6IGNhbkZpeCAmJiAoKGZpeGVyKSA9PiBmaXhlci5yZXBsYWNlVGV4dFJhbmdlKFxuICAgICAgICBbc2Vjb25kUm9vdFN0YXJ0LCBmaXJzdFJvb3RFbmRdLFxuICAgICAgICBzb3VyY2VDb2RlLnRleHQuc3Vic3RyaW5nKHNlY29uZFJvb3RFbmQsIGZpcnN0Um9vdEVuZCkgKyBuZXdDb2RlLFxuICAgICAgKSksXG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVwb3J0T3V0T2ZPcmRlcihjb250ZXh0LCBpbXBvcnRlZCwgb3V0T2ZPcmRlciwgb3JkZXIpIHtcbiAgb3V0T2ZPcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChpbXApIHtcbiAgICBjb25zdCBmb3VuZCA9IGltcG9ydGVkLmZpbmQoZnVuY3Rpb24gaGFzSGlnaGVyUmFuayhpbXBvcnRlZEl0ZW0pIHtcbiAgICAgIHJldHVybiBpbXBvcnRlZEl0ZW0ucmFuayA+IGltcC5yYW5rO1xuICAgIH0pO1xuICAgIGZpeE91dE9mT3JkZXIoY29udGV4dCwgZm91bmQsIGltcCwgb3JkZXIpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWFrZU91dE9mT3JkZXJSZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQpIHtcbiAgY29uc3Qgb3V0T2ZPcmRlciA9IGZpbmRPdXRPZk9yZGVyKGltcG9ydGVkKTtcbiAgaWYgKCFvdXRPZk9yZGVyLmxlbmd0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIFRoZXJlIGFyZSB0aGluZ3MgdG8gcmVwb3J0LiBUcnkgdG8gbWluaW1pemUgdGhlIG51bWJlciBvZiByZXBvcnRlZCBlcnJvcnMuXG4gIGNvbnN0IHJldmVyc2VkSW1wb3J0ZWQgPSByZXZlcnNlKGltcG9ydGVkKTtcbiAgY29uc3QgcmV2ZXJzZWRPcmRlciA9IGZpbmRPdXRPZk9yZGVyKHJldmVyc2VkSW1wb3J0ZWQpO1xuICBpZiAocmV2ZXJzZWRPcmRlci5sZW5ndGggPCBvdXRPZk9yZGVyLmxlbmd0aCkge1xuICAgIHJlcG9ydE91dE9mT3JkZXIoY29udGV4dCwgcmV2ZXJzZWRJbXBvcnRlZCwgcmV2ZXJzZWRPcmRlciwgJ2FmdGVyJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIHJlcG9ydE91dE9mT3JkZXIoY29udGV4dCwgaW1wb3J0ZWQsIG91dE9mT3JkZXIsICdiZWZvcmUnKTtcbn1cblxuY29uc3QgY29tcGFyZVN0cmluZyA9IChhLCBiKSA9PiB7XG4gIGlmIChhIDwgYikge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoYSA+IGIpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbi8qKiBTb21lIHBhcnNlcnMgKGxhbmd1YWdlcyB3aXRob3V0IHR5cGVzKSBkb24ndCBwcm92aWRlIEltcG9ydEtpbmQgKi9cbmNvbnN0IERFQUZVTFRfSU1QT1JUX0tJTkQgPSAndmFsdWUnO1xuY29uc3QgZ2V0Tm9ybWFsaXplZFZhbHVlID0gKG5vZGUsIHRvTG93ZXJDYXNlKSA9PiB7XG4gIGNvbnN0IHZhbHVlID0gbm9kZS52YWx1ZTtcbiAgcmV0dXJuIHRvTG93ZXJDYXNlID8gU3RyaW5nKHZhbHVlKS50b0xvd2VyQ2FzZSgpIDogdmFsdWU7XG59O1xuXG5mdW5jdGlvbiBnZXRTb3J0ZXIoYWxwaGFiZXRpemVPcHRpb25zKSB7XG4gIGNvbnN0IG11bHRpcGxpZXIgPSBhbHBoYWJldGl6ZU9wdGlvbnMub3JkZXIgPT09ICdhc2MnID8gMSA6IC0xO1xuICBjb25zdCBvcmRlckltcG9ydEtpbmQgPSBhbHBoYWJldGl6ZU9wdGlvbnMub3JkZXJJbXBvcnRLaW5kO1xuICBjb25zdCBtdWx0aXBsaWVySW1wb3J0S2luZCA9IG9yZGVySW1wb3J0S2luZCAhPT0gJ2lnbm9yZSdcbiAgICAmJiAoYWxwaGFiZXRpemVPcHRpb25zLm9yZGVySW1wb3J0S2luZCA9PT0gJ2FzYycgPyAxIDogLTEpO1xuXG4gIHJldHVybiBmdW5jdGlvbiBpbXBvcnRzU29ydGVyKG5vZGVBLCBub2RlQikge1xuICAgIGNvbnN0IGltcG9ydEEgPSBnZXROb3JtYWxpemVkVmFsdWUobm9kZUEsIGFscGhhYmV0aXplT3B0aW9ucy5jYXNlSW5zZW5zaXRpdmUpO1xuICAgIGNvbnN0IGltcG9ydEIgPSBnZXROb3JtYWxpemVkVmFsdWUobm9kZUIsIGFscGhhYmV0aXplT3B0aW9ucy5jYXNlSW5zZW5zaXRpdmUpO1xuICAgIGxldCByZXN1bHQgPSAwO1xuXG4gICAgaWYgKCFpbmNsdWRlcyhpbXBvcnRBLCAnLycpICYmICFpbmNsdWRlcyhpbXBvcnRCLCAnLycpKSB7XG4gICAgICByZXN1bHQgPSBjb21wYXJlU3RyaW5nKGltcG9ydEEsIGltcG9ydEIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBBID0gaW1wb3J0QS5zcGxpdCgnLycpO1xuICAgICAgY29uc3QgQiA9IGltcG9ydEIuc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IGEgPSBBLmxlbmd0aDtcbiAgICAgIGNvbnN0IGIgPSBCLmxlbmd0aDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBNYXRoLm1pbihhLCBiKTsgaSsrKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBhcmVTdHJpbmcoQVtpXSwgQltpXSk7XG4gICAgICAgIGlmIChyZXN1bHQpIHsgYnJlYWs7IH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFyZXN1bHQgJiYgYSAhPT0gYikge1xuICAgICAgICByZXN1bHQgPSBhIDwgYiA/IC0xIDogMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHQgPSByZXN1bHQgKiBtdWx0aXBsaWVyO1xuXG4gICAgLy8gSW4gY2FzZSB0aGUgcGF0aHMgYXJlIGVxdWFsIChyZXN1bHQgPT09IDApLCBzb3J0IHRoZW0gYnkgaW1wb3J0S2luZFxuICAgIGlmICghcmVzdWx0ICYmIG11bHRpcGxpZXJJbXBvcnRLaW5kKSB7XG4gICAgICByZXN1bHQgPSBtdWx0aXBsaWVySW1wb3J0S2luZCAqIGNvbXBhcmVTdHJpbmcoXG4gICAgICAgIG5vZGVBLm5vZGUuaW1wb3J0S2luZCB8fCBERUFGVUxUX0lNUE9SVF9LSU5ELFxuICAgICAgICBub2RlQi5ub2RlLmltcG9ydEtpbmQgfHwgREVBRlVMVF9JTVBPUlRfS0lORCxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbXV0YXRlUmFua3NUb0FscGhhYmV0aXplKGltcG9ydGVkLCBhbHBoYWJldGl6ZU9wdGlvbnMpIHtcbiAgY29uc3QgZ3JvdXBlZEJ5UmFua3MgPSBpbXBvcnRlZC5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgaW1wb3J0ZWRJdGVtKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGFjY1tpbXBvcnRlZEl0ZW0ucmFua10pKSB7XG4gICAgICBhY2NbaW1wb3J0ZWRJdGVtLnJhbmtdID0gW107XG4gICAgfVxuICAgIGFjY1tpbXBvcnRlZEl0ZW0ucmFua10ucHVzaChpbXBvcnRlZEl0ZW0pO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuICBjb25zdCBzb3J0ZXJGbiA9IGdldFNvcnRlcihhbHBoYWJldGl6ZU9wdGlvbnMpO1xuXG4gIC8vIHNvcnQgZ3JvdXAga2V5cyBzbyB0aGF0IHRoZXkgY2FuIGJlIGl0ZXJhdGVkIG9uIGluIG9yZGVyXG4gIGNvbnN0IGdyb3VwUmFua3MgPSBPYmplY3Qua2V5cyhncm91cGVkQnlSYW5rcykuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgIHJldHVybiBhIC0gYjtcbiAgfSk7XG5cbiAgLy8gc29ydCBpbXBvcnRzIGxvY2FsbHkgd2l0aGluIHRoZWlyIGdyb3VwXG4gIGdyb3VwUmFua3MuZm9yRWFjaChmdW5jdGlvbiAoZ3JvdXBSYW5rKSB7XG4gICAgZ3JvdXBlZEJ5UmFua3NbZ3JvdXBSYW5rXS5zb3J0KHNvcnRlckZuKTtcbiAgfSk7XG5cbiAgLy8gYXNzaWduIGdsb2JhbGx5IHVuaXF1ZSByYW5rIHRvIGVhY2ggaW1wb3J0XG4gIGxldCBuZXdSYW5rID0gMDtcbiAgY29uc3QgYWxwaGFiZXRpemVkUmFua3MgPSBncm91cFJhbmtzLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBncm91cFJhbmspIHtcbiAgICBncm91cGVkQnlSYW5rc1tncm91cFJhbmtdLmZvckVhY2goZnVuY3Rpb24gKGltcG9ydGVkSXRlbSkge1xuICAgICAgYWNjW2Ake2ltcG9ydGVkSXRlbS52YWx1ZX18JHtpbXBvcnRlZEl0ZW0ubm9kZS5pbXBvcnRLaW5kfWBdID0gcGFyc2VJbnQoZ3JvdXBSYW5rLCAxMCkgKyBuZXdSYW5rO1xuICAgICAgbmV3UmFuayArPSAxO1xuICAgIH0pO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuICAvLyBtdXRhdGUgdGhlIG9yaWdpbmFsIGdyb3VwLXJhbmsgd2l0aCBhbHBoYWJldGl6ZWQtcmFua1xuICBpbXBvcnRlZC5mb3JFYWNoKGZ1bmN0aW9uIChpbXBvcnRlZEl0ZW0pIHtcbiAgICBpbXBvcnRlZEl0ZW0ucmFuayA9IGFscGhhYmV0aXplZFJhbmtzW2Ake2ltcG9ydGVkSXRlbS52YWx1ZX18JHtpbXBvcnRlZEl0ZW0ubm9kZS5pbXBvcnRLaW5kfWBdO1xuICB9KTtcbn1cblxuLy8gREVURUNUSU5HXG5cbmZ1bmN0aW9uIGNvbXB1dGVQYXRoUmFuayhyYW5rcywgcGF0aEdyb3VwcywgcGF0aCwgbWF4UG9zaXRpb24pIHtcbiAgZm9yIChsZXQgaSA9IDAsIGwgPSBwYXRoR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHsgcGF0dGVybiwgcGF0dGVybk9wdGlvbnMsIGdyb3VwLCBwb3NpdGlvbiA9IDEgfSA9IHBhdGhHcm91cHNbaV07XG4gICAgaWYgKG1pbmltYXRjaChwYXRoLCBwYXR0ZXJuLCBwYXR0ZXJuT3B0aW9ucyB8fCB7IG5vY29tbWVudDogdHJ1ZSB9KSkge1xuICAgICAgcmV0dXJuIHJhbmtzW2dyb3VwXSArIHBvc2l0aW9uIC8gbWF4UG9zaXRpb247XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNvbXB1dGVSYW5rKGNvbnRleHQsIHJhbmtzLCBpbXBvcnRFbnRyeSwgZXhjbHVkZWRJbXBvcnRUeXBlcykge1xuICBsZXQgaW1wVHlwZTtcbiAgbGV0IHJhbms7XG4gIGlmIChpbXBvcnRFbnRyeS50eXBlID09PSAnaW1wb3J0Om9iamVjdCcpIHtcbiAgICBpbXBUeXBlID0gJ29iamVjdCc7XG4gIH0gZWxzZSBpZiAoaW1wb3J0RW50cnkubm9kZS5pbXBvcnRLaW5kID09PSAndHlwZScgJiYgcmFua3Mub21pdHRlZFR5cGVzLmluZGV4T2YoJ3R5cGUnKSA9PT0gLTEpIHtcbiAgICBpbXBUeXBlID0gJ3R5cGUnO1xuICB9IGVsc2Uge1xuICAgIGltcFR5cGUgPSBpbXBvcnRUeXBlKGltcG9ydEVudHJ5LnZhbHVlLCBjb250ZXh0KTtcbiAgfVxuICBpZiAoIWV4Y2x1ZGVkSW1wb3J0VHlwZXMuaGFzKGltcFR5cGUpKSB7XG4gICAgcmFuayA9IGNvbXB1dGVQYXRoUmFuayhyYW5rcy5ncm91cHMsIHJhbmtzLnBhdGhHcm91cHMsIGltcG9ydEVudHJ5LnZhbHVlLCByYW5rcy5tYXhQb3NpdGlvbik7XG4gIH1cbiAgaWYgKHR5cGVvZiByYW5rID09PSAndW5kZWZpbmVkJykge1xuICAgIHJhbmsgPSByYW5rcy5ncm91cHNbaW1wVHlwZV07XG4gIH1cbiAgaWYgKGltcG9ydEVudHJ5LnR5cGUgIT09ICdpbXBvcnQnICYmICFpbXBvcnRFbnRyeS50eXBlLnN0YXJ0c1dpdGgoJ2ltcG9ydDonKSkge1xuICAgIHJhbmsgKz0gMTAwO1xuICB9XG5cbiAgcmV0dXJuIHJhbms7XG59XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyTm9kZShjb250ZXh0LCBpbXBvcnRFbnRyeSwgcmFua3MsIGltcG9ydGVkLCBleGNsdWRlZEltcG9ydFR5cGVzKSB7XG4gIGNvbnN0IHJhbmsgPSBjb21wdXRlUmFuayhjb250ZXh0LCByYW5rcywgaW1wb3J0RW50cnksIGV4Y2x1ZGVkSW1wb3J0VHlwZXMpO1xuICBpZiAocmFuayAhPT0gLTEpIHtcbiAgICBpbXBvcnRlZC5wdXNoKHsgLi4uaW1wb3J0RW50cnksIHJhbmsgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0UmVxdWlyZUJsb2NrKG5vZGUpIHtcbiAgbGV0IG4gPSBub2RlO1xuICAvLyBIYW5kbGUgY2FzZXMgbGlrZSBgY29uc3QgYmF6ID0gcmVxdWlyZSgnZm9vJykuYmFyLmJhemBcbiAgLy8gYW5kIGBjb25zdCBmb28gPSByZXF1aXJlKCdmb28nKSgpYFxuICB3aGlsZSAoXG4gICAgbi5wYXJlbnQudHlwZSA9PT0gJ01lbWJlckV4cHJlc3Npb24nICYmIG4ucGFyZW50Lm9iamVjdCA9PT0gblxuICAgIHx8IG4ucGFyZW50LnR5cGUgPT09ICdDYWxsRXhwcmVzc2lvbicgJiYgbi5wYXJlbnQuY2FsbGVlID09PSBuXG4gICkge1xuICAgIG4gPSBuLnBhcmVudDtcbiAgfVxuICBpZiAoXG4gICAgbi5wYXJlbnQudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRvcidcbiAgICAmJiBuLnBhcmVudC5wYXJlbnQudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nXG4gICAgJiYgbi5wYXJlbnQucGFyZW50LnBhcmVudC50eXBlID09PSAnUHJvZ3JhbSdcbiAgKSB7XG4gICAgcmV0dXJuIG4ucGFyZW50LnBhcmVudC5wYXJlbnQ7XG4gIH1cbn1cblxuY29uc3QgdHlwZXMgPSBbJ2J1aWx0aW4nLCAnZXh0ZXJuYWwnLCAnaW50ZXJuYWwnLCAndW5rbm93bicsICdwYXJlbnQnLCAnc2libGluZycsICdpbmRleCcsICdvYmplY3QnLCAndHlwZSddO1xuXG4vLyBDcmVhdGVzIGFuIG9iamVjdCB3aXRoIHR5cGUtcmFuayBwYWlycy5cbi8vIEV4YW1wbGU6IHsgaW5kZXg6IDAsIHNpYmxpbmc6IDEsIHBhcmVudDogMSwgZXh0ZXJuYWw6IDEsIGJ1aWx0aW46IDIsIGludGVybmFsOiAyIH1cbi8vIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgaXQgY29udGFpbnMgYSB0eXBlIHRoYXQgZG9lcyBub3QgZXhpc3QsIG9yIGhhcyBhIGR1cGxpY2F0ZVxuZnVuY3Rpb24gY29udmVydEdyb3Vwc1RvUmFua3MoZ3JvdXBzKSB7XG4gIGlmIChncm91cHMubGVuZ3RoID09PSAxKSB7XG4gICAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgYGlmYCBhbmQgZml4IHRoZSBidWdcbiAgICByZXR1cm4gY29udmVydEdyb3Vwc1RvUmFua3MoZ3JvdXBzWzBdKTtcbiAgfVxuICBjb25zdCByYW5rT2JqZWN0ID0gZ3JvdXBzLnJlZHVjZShmdW5jdGlvbiAocmVzLCBncm91cCwgaW5kZXgpIHtcbiAgICBbXS5jb25jYXQoZ3JvdXApLmZvckVhY2goZnVuY3Rpb24gKGdyb3VwSXRlbSkge1xuICAgICAgaWYgKHR5cGVzLmluZGV4T2YoZ3JvdXBJdGVtKSA9PT0gLTEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmNvcnJlY3QgY29uZmlndXJhdGlvbiBvZiB0aGUgcnVsZTogVW5rbm93biB0eXBlIFxcYCR7SlNPTi5zdHJpbmdpZnkoZ3JvdXBJdGVtKX1cXGBgKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXNbZ3JvdXBJdGVtXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5jb3JyZWN0IGNvbmZpZ3VyYXRpb24gb2YgdGhlIHJ1bGU6IFxcYCR7Z3JvdXBJdGVtfVxcYCBpcyBkdXBsaWNhdGVkYCk7XG4gICAgICB9XG4gICAgICByZXNbZ3JvdXBJdGVtXSA9IGluZGV4ICogMjtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzO1xuICB9LCB7fSk7XG5cbiAgY29uc3Qgb21pdHRlZFR5cGVzID0gdHlwZXMuZmlsdGVyKGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiByYW5rT2JqZWN0W3R5cGVdID09PSAndW5kZWZpbmVkJztcbiAgfSk7XG5cbiAgY29uc3QgcmFua3MgPSBvbWl0dGVkVHlwZXMucmVkdWNlKGZ1bmN0aW9uIChyZXMsIHR5cGUpIHtcbiAgICByZXNbdHlwZV0gPSBncm91cHMubGVuZ3RoICogMjtcbiAgICByZXR1cm4gcmVzO1xuICB9LCByYW5rT2JqZWN0KTtcblxuICByZXR1cm4geyBncm91cHM6IHJhbmtzLCBvbWl0dGVkVHlwZXMgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydFBhdGhHcm91cHNGb3JSYW5rcyhwYXRoR3JvdXBzKSB7XG4gIGNvbnN0IGFmdGVyID0ge307XG4gIGNvbnN0IGJlZm9yZSA9IHt9O1xuXG4gIGNvbnN0IHRyYW5zZm9ybWVkID0gcGF0aEdyb3Vwcy5tYXAoKHBhdGhHcm91cCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCB7IGdyb3VwLCBwb3NpdGlvbjogcG9zaXRpb25TdHJpbmcgfSA9IHBhdGhHcm91cDtcbiAgICBsZXQgcG9zaXRpb24gPSAwO1xuICAgIGlmIChwb3NpdGlvblN0cmluZyA9PT0gJ2FmdGVyJykge1xuICAgICAgaWYgKCFhZnRlcltncm91cF0pIHtcbiAgICAgICAgYWZ0ZXJbZ3JvdXBdID0gMTtcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uID0gYWZ0ZXJbZ3JvdXBdKys7XG4gICAgfSBlbHNlIGlmIChwb3NpdGlvblN0cmluZyA9PT0gJ2JlZm9yZScpIHtcbiAgICAgIGlmICghYmVmb3JlW2dyb3VwXSkge1xuICAgICAgICBiZWZvcmVbZ3JvdXBdID0gW107XG4gICAgICB9XG4gICAgICBiZWZvcmVbZ3JvdXBdLnB1c2goaW5kZXgpO1xuICAgIH1cblxuICAgIHJldHVybiB7IC4uLnBhdGhHcm91cCwgcG9zaXRpb24gfTtcbiAgfSk7XG5cbiAgbGV0IG1heFBvc2l0aW9uID0gMTtcblxuICBPYmplY3Qua2V5cyhiZWZvcmUpLmZvckVhY2goKGdyb3VwKSA9PiB7XG4gICAgY29uc3QgZ3JvdXBMZW5ndGggPSBiZWZvcmVbZ3JvdXBdLmxlbmd0aDtcbiAgICBiZWZvcmVbZ3JvdXBdLmZvckVhY2goKGdyb3VwSW5kZXgsIGluZGV4KSA9PiB7XG4gICAgICB0cmFuc2Zvcm1lZFtncm91cEluZGV4XS5wb3NpdGlvbiA9IC0xICogKGdyb3VwTGVuZ3RoIC0gaW5kZXgpO1xuICAgIH0pO1xuICAgIG1heFBvc2l0aW9uID0gTWF0aC5tYXgobWF4UG9zaXRpb24sIGdyb3VwTGVuZ3RoKTtcbiAgfSk7XG5cbiAgT2JqZWN0LmtleXMoYWZ0ZXIpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGNvbnN0IGdyb3VwTmV4dFBvc2l0aW9uID0gYWZ0ZXJba2V5XTtcbiAgICBtYXhQb3NpdGlvbiA9IE1hdGgubWF4KG1heFBvc2l0aW9uLCBncm91cE5leHRQb3NpdGlvbiAtIDEpO1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHBhdGhHcm91cHM6IHRyYW5zZm9ybWVkLFxuICAgIG1heFBvc2l0aW9uOiBtYXhQb3NpdGlvbiA+IDEwID8gTWF0aC5wb3coMTAsIE1hdGguY2VpbChNYXRoLmxvZzEwKG1heFBvc2l0aW9uKSkpIDogMTAsXG4gIH07XG59XG5cbmZ1bmN0aW9uIGZpeE5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBwcmV2aW91c0ltcG9ydCkge1xuICBjb25zdCBwcmV2Um9vdCA9IGZpbmRSb290Tm9kZShwcmV2aW91c0ltcG9ydC5ub2RlKTtcbiAgY29uc3QgdG9rZW5zVG9FbmRPZkxpbmUgPSB0YWtlVG9rZW5zQWZ0ZXJXaGlsZShcbiAgICBjb250ZXh0LmdldFNvdXJjZUNvZGUoKSwgcHJldlJvb3QsIGNvbW1lbnRPblNhbWVMaW5lQXMocHJldlJvb3QpKTtcblxuICBsZXQgZW5kT2ZMaW5lID0gcHJldlJvb3QucmFuZ2VbMV07XG4gIGlmICh0b2tlbnNUb0VuZE9mTGluZS5sZW5ndGggPiAwKSB7XG4gICAgZW5kT2ZMaW5lID0gdG9rZW5zVG9FbmRPZkxpbmVbdG9rZW5zVG9FbmRPZkxpbmUubGVuZ3RoIC0gMV0ucmFuZ2VbMV07XG4gIH1cbiAgcmV0dXJuIChmaXhlcikgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyUmFuZ2UoW3ByZXZSb290LnJhbmdlWzBdLCBlbmRPZkxpbmVdLCAnXFxuJyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCkge1xuICBjb25zdCBzb3VyY2VDb2RlID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCk7XG4gIGNvbnN0IHByZXZSb290ID0gZmluZFJvb3ROb2RlKHByZXZpb3VzSW1wb3J0Lm5vZGUpO1xuICBjb25zdCBjdXJyUm9vdCA9IGZpbmRSb290Tm9kZShjdXJyZW50SW1wb3J0Lm5vZGUpO1xuICBjb25zdCByYW5nZVRvUmVtb3ZlID0gW1xuICAgIGZpbmRFbmRPZkxpbmVXaXRoQ29tbWVudHMoc291cmNlQ29kZSwgcHJldlJvb3QpLFxuICAgIGZpbmRTdGFydE9mTGluZVdpdGhDb21tZW50cyhzb3VyY2VDb2RlLCBjdXJyUm9vdCksXG4gIF07XG4gIGlmICgoL15cXHMqJC8pLnRlc3Qoc291cmNlQ29kZS50ZXh0LnN1YnN0cmluZyhyYW5nZVRvUmVtb3ZlWzBdLCByYW5nZVRvUmVtb3ZlWzFdKSkpIHtcbiAgICByZXR1cm4gKGZpeGVyKSA9PiBmaXhlci5yZW1vdmVSYW5nZShyYW5nZVRvUmVtb3ZlKTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5mdW5jdGlvbiBtYWtlTmV3bGluZXNCZXR3ZWVuUmVwb3J0KGNvbnRleHQsIGltcG9ydGVkLCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzLCBkaXN0aW5jdEdyb3VwKSB7XG4gIGNvbnN0IGdldE51bWJlck9mRW1wdHlMaW5lc0JldHdlZW4gPSAoY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpID0+IHtcbiAgICBjb25zdCBsaW5lc0JldHdlZW5JbXBvcnRzID0gY29udGV4dC5nZXRTb3VyY2VDb2RlKCkubGluZXMuc2xpY2UoXG4gICAgICBwcmV2aW91c0ltcG9ydC5ub2RlLmxvYy5lbmQubGluZSxcbiAgICAgIGN1cnJlbnRJbXBvcnQubm9kZS5sb2Muc3RhcnQubGluZSAtIDEsXG4gICAgKTtcblxuICAgIHJldHVybiBsaW5lc0JldHdlZW5JbXBvcnRzLmZpbHRlcigobGluZSkgPT4gIWxpbmUudHJpbSgpLmxlbmd0aCkubGVuZ3RoO1xuICB9O1xuICBjb25zdCBnZXRJc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwID0gKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KSA9PiBjdXJyZW50SW1wb3J0LnJhbmsgLSAxID49IHByZXZpb3VzSW1wb3J0LnJhbms7XG4gIGxldCBwcmV2aW91c0ltcG9ydCA9IGltcG9ydGVkWzBdO1xuXG4gIGltcG9ydGVkLnNsaWNlKDEpLmZvckVhY2goZnVuY3Rpb24gKGN1cnJlbnRJbXBvcnQpIHtcbiAgICBjb25zdCBlbXB0eUxpbmVzQmV0d2VlbiA9IGdldE51bWJlck9mRW1wdHlMaW5lc0JldHdlZW4oY3VycmVudEltcG9ydCwgcHJldmlvdXNJbXBvcnQpO1xuICAgIGNvbnN0IGlzU3RhcnRPZkRpc3RpbmN0R3JvdXAgPSBnZXRJc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwKGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KTtcblxuICAgIGlmIChuZXdsaW5lc0JldHdlZW5JbXBvcnRzID09PSAnYWx3YXlzJ1xuICAgICAgICB8fCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzID09PSAnYWx3YXlzLWFuZC1pbnNpZGUtZ3JvdXBzJykge1xuICAgICAgaWYgKGN1cnJlbnRJbXBvcnQucmFuayAhPT0gcHJldmlvdXNJbXBvcnQucmFuayAmJiBlbXB0eUxpbmVzQmV0d2VlbiA9PT0gMCkge1xuICAgICAgICBpZiAoZGlzdGluY3RHcm91cCB8fCAhZGlzdGluY3RHcm91cCAmJiBpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogcHJldmlvdXNJbXBvcnQubm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGVyZSBzaG91bGQgYmUgYXQgbGVhc3Qgb25lIGVtcHR5IGxpbmUgYmV0d2VlbiBpbXBvcnQgZ3JvdXBzJyxcbiAgICAgICAgICAgIGZpeDogZml4TmV3TGluZUFmdGVySW1wb3J0KGNvbnRleHQsIHByZXZpb3VzSW1wb3J0KSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChlbXB0eUxpbmVzQmV0d2VlbiA+IDBcbiAgICAgICAgJiYgbmV3bGluZXNCZXR3ZWVuSW1wb3J0cyAhPT0gJ2Fsd2F5cy1hbmQtaW5zaWRlLWdyb3VwcycpIHtcbiAgICAgICAgaWYgKGRpc3RpbmN0R3JvdXAgJiYgY3VycmVudEltcG9ydC5yYW5rID09PSBwcmV2aW91c0ltcG9ydC5yYW5rIHx8ICFkaXN0aW5jdEdyb3VwICYmICFpc1N0YXJ0T2ZEaXN0aW5jdEdyb3VwKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogcHJldmlvdXNJbXBvcnQubm9kZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGVyZSBzaG91bGQgYmUgbm8gZW1wdHkgbGluZSB3aXRoaW4gaW1wb3J0IGdyb3VwJyxcbiAgICAgICAgICAgIGZpeDogcmVtb3ZlTmV3TGluZUFmdGVySW1wb3J0KGNvbnRleHQsIGN1cnJlbnRJbXBvcnQsIHByZXZpb3VzSW1wb3J0KSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoZW1wdHlMaW5lc0JldHdlZW4gPiAwKSB7XG4gICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgIG5vZGU6IHByZXZpb3VzSW1wb3J0Lm5vZGUsXG4gICAgICAgIG1lc3NhZ2U6ICdUaGVyZSBzaG91bGQgYmUgbm8gZW1wdHkgbGluZSBiZXR3ZWVuIGltcG9ydCBncm91cHMnLFxuICAgICAgICBmaXg6IHJlbW92ZU5ld0xpbmVBZnRlckltcG9ydChjb250ZXh0LCBjdXJyZW50SW1wb3J0LCBwcmV2aW91c0ltcG9ydCksXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBwcmV2aW91c0ltcG9ydCA9IGN1cnJlbnRJbXBvcnQ7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRBbHBoYWJldGl6ZUNvbmZpZyhvcHRpb25zKSB7XG4gIGNvbnN0IGFscGhhYmV0aXplID0gb3B0aW9ucy5hbHBoYWJldGl6ZSB8fCB7fTtcbiAgY29uc3Qgb3JkZXIgPSBhbHBoYWJldGl6ZS5vcmRlciB8fCAnaWdub3JlJztcbiAgY29uc3Qgb3JkZXJJbXBvcnRLaW5kID0gYWxwaGFiZXRpemUub3JkZXJJbXBvcnRLaW5kIHx8ICdpZ25vcmUnO1xuICBjb25zdCBjYXNlSW5zZW5zaXRpdmUgPSBhbHBoYWJldGl6ZS5jYXNlSW5zZW5zaXRpdmUgfHwgZmFsc2U7XG5cbiAgcmV0dXJuIHsgb3JkZXIsIG9yZGVySW1wb3J0S2luZCwgY2FzZUluc2Vuc2l0aXZlIH07XG59XG5cbi8vIFRPRE8sIHNlbXZlci1tYWpvcjogQ2hhbmdlIHRoZSBkZWZhdWx0IG9mIFwiZGlzdGluY3RHcm91cFwiIGZyb20gdHJ1ZSB0byBmYWxzZVxuY29uc3QgZGVmYXVsdERpc3RpbmN0R3JvdXAgPSB0cnVlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdzdWdnZXN0aW9uJyxcbiAgICBkb2NzOiB7XG4gICAgICBjYXRlZ29yeTogJ1N0eWxlIGd1aWRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5mb3JjZSBhIGNvbnZlbnRpb24gaW4gbW9kdWxlIGltcG9ydCBvcmRlci4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdvcmRlcicpLFxuICAgIH0sXG5cbiAgICBmaXhhYmxlOiAnY29kZScsXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgZ3JvdXBzOiB7XG4gICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBkaXN0aW5jdEdyb3VwOiB7XG4gICAgICAgICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICAgICAgICBkZWZhdWx0OiBkZWZhdWx0RGlzdGluY3RHcm91cCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHBhdGhHcm91cHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIHBhdHRlcm46IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcGF0dGVybk9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZ3JvdXA6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgICAgICAgZW51bTogdHlwZXMsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgICBlbnVtOiBbJ2FmdGVyJywgJ2JlZm9yZSddLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgcmVxdWlyZWQ6IFsncGF0dGVybicsICdncm91cCddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICduZXdsaW5lcy1iZXR3ZWVuJzoge1xuICAgICAgICAgICAgZW51bTogW1xuICAgICAgICAgICAgICAnaWdub3JlJyxcbiAgICAgICAgICAgICAgJ2Fsd2F5cycsXG4gICAgICAgICAgICAgICdhbHdheXMtYW5kLWluc2lkZS1ncm91cHMnLFxuICAgICAgICAgICAgICAnbmV2ZXInLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGFscGhhYmV0aXplOiB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgY2FzZUluc2Vuc2l0aXZlOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBvcmRlcjoge1xuICAgICAgICAgICAgICAgIGVudW06IFsnaWdub3JlJywgJ2FzYycsICdkZXNjJ10sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2lnbm9yZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIG9yZGVySW1wb3J0S2luZDoge1xuICAgICAgICAgICAgICAgIGVudW06IFsnaWdub3JlJywgJ2FzYycsICdkZXNjJ10sXG4gICAgICAgICAgICAgICAgZGVmYXVsdDogJ2lnbm9yZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgd2Fybk9uVW5hc3NpZ25lZEltcG9ydHM6IHtcbiAgICAgICAgICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIGltcG9ydE9yZGVyUnVsZShjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGNvbnRleHQub3B0aW9uc1swXSB8fCB7fTtcbiAgICBjb25zdCBuZXdsaW5lc0JldHdlZW5JbXBvcnRzID0gb3B0aW9uc1snbmV3bGluZXMtYmV0d2VlbiddIHx8ICdpZ25vcmUnO1xuICAgIGNvbnN0IHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzID0gbmV3IFNldChvcHRpb25zLnBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzIHx8IFsnYnVpbHRpbicsICdleHRlcm5hbCcsICdvYmplY3QnXSk7XG4gICAgY29uc3QgYWxwaGFiZXRpemUgPSBnZXRBbHBoYWJldGl6ZUNvbmZpZyhvcHRpb25zKTtcbiAgICBjb25zdCBkaXN0aW5jdEdyb3VwID0gb3B0aW9ucy5kaXN0aW5jdEdyb3VwID09IG51bGwgPyBkZWZhdWx0RGlzdGluY3RHcm91cCA6ICEhb3B0aW9ucy5kaXN0aW5jdEdyb3VwO1xuICAgIGxldCByYW5rcztcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IHBhdGhHcm91cHMsIG1heFBvc2l0aW9uIH0gPSBjb252ZXJ0UGF0aEdyb3Vwc0ZvclJhbmtzKG9wdGlvbnMucGF0aEdyb3VwcyB8fCBbXSk7XG4gICAgICBjb25zdCB7IGdyb3Vwcywgb21pdHRlZFR5cGVzIH0gPSBjb252ZXJ0R3JvdXBzVG9SYW5rcyhvcHRpb25zLmdyb3VwcyB8fCBkZWZhdWx0R3JvdXBzKTtcbiAgICAgIHJhbmtzID0ge1xuICAgICAgICBncm91cHMsXG4gICAgICAgIG9taXR0ZWRUeXBlcyxcbiAgICAgICAgcGF0aEdyb3VwcyxcbiAgICAgICAgbWF4UG9zaXRpb24sXG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBNYWxmb3JtZWQgY29uZmlndXJhdGlvblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgUHJvZ3JhbShub2RlKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQobm9kZSwgZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBpbXBvcnRNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICBmdW5jdGlvbiBnZXRCbG9ja0ltcG9ydHMobm9kZSkge1xuICAgICAgaWYgKCFpbXBvcnRNYXAuaGFzKG5vZGUpKSB7XG4gICAgICAgIGltcG9ydE1hcC5zZXQobm9kZSwgW10pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGltcG9ydE1hcC5nZXQobm9kZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBmdW5jdGlvbiBoYW5kbGVJbXBvcnRzKG5vZGUpIHtcbiAgICAgICAgLy8gSWdub3JpbmcgdW5hc3NpZ25lZCBpbXBvcnRzIHVubGVzcyB3YXJuT25VbmFzc2lnbmVkSW1wb3J0cyBpcyBzZXRcbiAgICAgICAgaWYgKG5vZGUuc3BlY2lmaWVycy5sZW5ndGggfHwgb3B0aW9ucy53YXJuT25VbmFzc2lnbmVkSW1wb3J0cykge1xuICAgICAgICAgIGNvbnN0IG5hbWUgPSBub2RlLnNvdXJjZS52YWx1ZTtcbiAgICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgICB2YWx1ZTogbmFtZSxcbiAgICAgICAgICAgICAgZGlzcGxheU5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgIHR5cGU6ICdpbXBvcnQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmtzLFxuICAgICAgICAgICAgZ2V0QmxvY2tJbXBvcnRzKG5vZGUucGFyZW50KSxcbiAgICAgICAgICAgIHBhdGhHcm91cHNFeGNsdWRlZEltcG9ydFR5cGVzLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uOiBmdW5jdGlvbiBoYW5kbGVJbXBvcnRzKG5vZGUpIHtcbiAgICAgICAgbGV0IGRpc3BsYXlOYW1lO1xuICAgICAgICBsZXQgdmFsdWU7XG4gICAgICAgIGxldCB0eXBlO1xuICAgICAgICAvLyBza2lwIFwiZXhwb3J0IGltcG9ydFwic1xuICAgICAgICBpZiAobm9kZS5pc0V4cG9ydCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAobm9kZS5tb2R1bGVSZWZlcmVuY2UudHlwZSA9PT0gJ1RTRXh0ZXJuYWxNb2R1bGVSZWZlcmVuY2UnKSB7XG4gICAgICAgICAgdmFsdWUgPSBub2RlLm1vZHVsZVJlZmVyZW5jZS5leHByZXNzaW9uLnZhbHVlO1xuICAgICAgICAgIGRpc3BsYXlOYW1lID0gdmFsdWU7XG4gICAgICAgICAgdHlwZSA9ICdpbXBvcnQnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlID0gJyc7XG4gICAgICAgICAgZGlzcGxheU5hbWUgPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKS5nZXRUZXh0KG5vZGUubW9kdWxlUmVmZXJlbmNlKTtcbiAgICAgICAgICB0eXBlID0gJ2ltcG9ydDpvYmplY3QnO1xuICAgICAgICB9XG4gICAgICAgIHJlZ2lzdGVyTm9kZShcbiAgICAgICAgICBjb250ZXh0LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgICAgIGRpc3BsYXlOYW1lLFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJhbmtzLFxuICAgICAgICAgIGdldEJsb2NrSW1wb3J0cyhub2RlLnBhcmVudCksXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXMsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgQ2FsbEV4cHJlc3Npb246IGZ1bmN0aW9uIGhhbmRsZVJlcXVpcmVzKG5vZGUpIHtcbiAgICAgICAgaWYgKCFpc1N0YXRpY1JlcXVpcmUobm9kZSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmxvY2sgPSBnZXRSZXF1aXJlQmxvY2sobm9kZSk7XG4gICAgICAgIGlmICghYmxvY2spIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbmFtZSA9IG5vZGUuYXJndW1lbnRzWzBdLnZhbHVlO1xuICAgICAgICByZWdpc3Rlck5vZGUoXG4gICAgICAgICAgY29udGV4dCxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgdmFsdWU6IG5hbWUsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogbmFtZSxcbiAgICAgICAgICAgIHR5cGU6ICdyZXF1aXJlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHJhbmtzLFxuICAgICAgICAgIGdldEJsb2NrSW1wb3J0cyhibG9jayksXG4gICAgICAgICAgcGF0aEdyb3Vwc0V4Y2x1ZGVkSW1wb3J0VHlwZXMsXG4gICAgICAgICk7XG4gICAgICB9LFxuICAgICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uIHJlcG9ydEFuZFJlc2V0KCkge1xuICAgICAgICBpbXBvcnRNYXAuZm9yRWFjaCgoaW1wb3J0ZWQpID0+IHtcbiAgICAgICAgICBpZiAobmV3bGluZXNCZXR3ZWVuSW1wb3J0cyAhPT0gJ2lnbm9yZScpIHtcbiAgICAgICAgICAgIG1ha2VOZXdsaW5lc0JldHdlZW5SZXBvcnQoY29udGV4dCwgaW1wb3J0ZWQsIG5ld2xpbmVzQmV0d2VlbkltcG9ydHMsIGRpc3RpbmN0R3JvdXApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChhbHBoYWJldGl6ZS5vcmRlciAhPT0gJ2lnbm9yZScpIHtcbiAgICAgICAgICAgIG11dGF0ZVJhbmtzVG9BbHBoYWJldGl6ZShpbXBvcnRlZCwgYWxwaGFiZXRpemUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1ha2VPdXRPZk9yZGVyUmVwb3J0KGNvbnRleHQsIGltcG9ydGVkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaW1wb3J0TWFwLmNsZWFyKCk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19