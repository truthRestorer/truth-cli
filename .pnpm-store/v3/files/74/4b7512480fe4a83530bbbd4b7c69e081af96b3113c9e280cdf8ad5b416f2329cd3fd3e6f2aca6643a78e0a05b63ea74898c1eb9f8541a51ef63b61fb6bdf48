'use strict';




var _staticRequire = require('../core/staticRequire');var _staticRequire2 = _interopRequireDefault(_staticRequire);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);

var _debug = require('debug');var _debug2 = _interopRequireDefault(_debug);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}
var log = (0, _debug2['default'])('eslint-plugin-import:rules:newline-after-import');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
/**
 * @fileoverview Rule to enforce new line after import not followed by another import.
 * @author Radek Benkel
 */function containsNodeOrEqual(outerNode, innerNode) {return outerNode.range[0] <= innerNode.range[0] && outerNode.range[1] >= innerNode.range[1];}

function getScopeBody(scope) {
  if (scope.block.type === 'SwitchStatement') {
    log('SwitchStatement scopes not supported');
    return null;
  }var

  body = scope.block.body;
  if (body && body.type === 'BlockStatement') {
    return body.body;
  }

  return body;
}

function findNodeIndexInScopeBody(body, nodeToFind) {
  return body.findIndex(function (node) {return containsNodeOrEqual(node, nodeToFind);});
}

function getLineDifference(node, nextNode) {
  return nextNode.loc.start.line - node.loc.end.line;
}

function isClassWithDecorator(node) {
  return node.type === 'ClassDeclaration' && node.decorators && node.decorators.length;
}

function isExportDefaultClass(node) {
  return node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ClassDeclaration';
}

function isExportNameClass(node) {

  return node.type === 'ExportNamedDeclaration' && node.declaration && node.declaration.type === 'ClassDeclaration';
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      category: 'Style guide',
      description: 'Enforce a newline after import statements.',
      url: (0, _docsUrl2['default'])('newline-after-import') },

    fixable: 'whitespace',
    schema: [
    {
      type: 'object',
      properties: {
        count: {
          type: 'integer',
          minimum: 1 },

        considerComments: { type: 'boolean' } },

      additionalProperties: false }] },



  create: function () {function create(context) {
      var level = 0;
      var requireCalls = [];
      var options = Object.assign({ count: 1, considerComments: false }, context.options[0]);

      function checkForNewLine(node, nextNode, type) {
        if (isExportDefaultClass(nextNode) || isExportNameClass(nextNode)) {
          var classNode = nextNode.declaration;

          if (isClassWithDecorator(classNode)) {
            nextNode = classNode.decorators[0];
          }
        } else if (isClassWithDecorator(nextNode)) {
          nextNode = nextNode.decorators[0];
        }

        var lineDifference = getLineDifference(node, nextNode);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after ' + String(type) + ' statement not followed by another ' + String(type) + '.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function commentAfterImport(node, nextComment) {
        var lineDifference = getLineDifference(node, nextComment);
        var EXPECTED_LINE_DIFFERENCE = options.count + 1;

        if (lineDifference < EXPECTED_LINE_DIFFERENCE) {
          var column = node.loc.start.column;

          if (node.loc.start.line !== node.loc.end.line) {
            column = 0;
          }

          context.report({
            loc: {
              line: node.loc.end.line,
              column: column },

            message: 'Expected ' + String(options.count) + ' empty line' + (options.count > 1 ? 's' : '') + ' after import statement not followed by another import.',
            fix: function () {function fix(fixer) {return fixer.insertTextAfter(
                node,
                '\n'.repeat(EXPECTED_LINE_DIFFERENCE - lineDifference));}return fix;}() });


        }
      }

      function incrementLevel() {
        level++;
      }
      function decrementLevel() {
        level--;
      }

      function checkImport(node) {var
        parent = node.parent;
        var nodePosition = parent.body.indexOf(node);
        var nextNode = parent.body[nodePosition + 1];
        var endLine = node.loc.end.line;
        var nextComment = void 0;

        if (typeof parent.comments !== 'undefined' && options.considerComments) {
          nextComment = parent.comments.find(function (o) {return o.loc.start.line === endLine + 1;});
        }

        // skip "export import"s
        if (node.type === 'TSImportEqualsDeclaration' && node.isExport) {
          return;
        }

        if (nextComment && typeof nextComment !== 'undefined') {
          commentAfterImport(node, nextComment);
        } else if (nextNode && nextNode.type !== 'ImportDeclaration' && (nextNode.type !== 'TSImportEqualsDeclaration' || nextNode.isExport)) {
          checkForNewLine(node, nextNode, 'import');
        }
      }

      return {
        ImportDeclaration: checkImport,
        TSImportEqualsDeclaration: checkImport,
        CallExpression: function () {function CallExpression(node) {
            if ((0, _staticRequire2['default'])(node) && level === 0) {
              requireCalls.push(node);
            }
          }return CallExpression;}(),
        'Program:exit': function () {function ProgramExit() {
            log('exit processing for', context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
            var scopeBody = getScopeBody(context.getScope());
            log('got scope:', scopeBody);

            requireCalls.forEach(function (node, index) {
              var nodePosition = findNodeIndexInScopeBody(scopeBody, node);
              log('node position in scope:', nodePosition);

              var statementWithRequireCall = scopeBody[nodePosition];
              var nextStatement = scopeBody[nodePosition + 1];
              var nextRequireCall = requireCalls[index + 1];

              if (nextRequireCall && containsNodeOrEqual(statementWithRequireCall, nextRequireCall)) {
                return;
              }

              if (
              nextStatement && (
              !nextRequireCall ||
              !containsNodeOrEqual(nextStatement, nextRequireCall)))

              {

                checkForNewLine(statementWithRequireCall, nextStatement, 'require');
              }
            });
          }return ProgramExit;}(),
        FunctionDeclaration: incrementLevel,
        FunctionExpression: incrementLevel,
        ArrowFunctionExpression: incrementLevel,
        BlockStatement: incrementLevel,
        ObjectExpression: incrementLevel,
        Decorator: incrementLevel,
        'FunctionDeclaration:exit': decrementLevel,
        'FunctionExpression:exit': decrementLevel,
        'ArrowFunctionExpression:exit': decrementLevel,
        'BlockStatement:exit': decrementLevel,
        'ObjectExpression:exit': decrementLevel,
        'Decorator:exit': decrementLevel };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uZXdsaW5lLWFmdGVyLWltcG9ydC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJjb250YWluc05vZGVPckVxdWFsIiwib3V0ZXJOb2RlIiwiaW5uZXJOb2RlIiwicmFuZ2UiLCJnZXRTY29wZUJvZHkiLCJzY29wZSIsImJsb2NrIiwidHlwZSIsImJvZHkiLCJmaW5kTm9kZUluZGV4SW5TY29wZUJvZHkiLCJub2RlVG9GaW5kIiwiZmluZEluZGV4Iiwibm9kZSIsImdldExpbmVEaWZmZXJlbmNlIiwibmV4dE5vZGUiLCJsb2MiLCJzdGFydCIsImxpbmUiLCJlbmQiLCJpc0NsYXNzV2l0aERlY29yYXRvciIsImRlY29yYXRvcnMiLCJsZW5ndGgiLCJpc0V4cG9ydERlZmF1bHRDbGFzcyIsImRlY2xhcmF0aW9uIiwiaXNFeHBvcnROYW1lQ2xhc3MiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwiZml4YWJsZSIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJjb3VudCIsIm1pbmltdW0iLCJjb25zaWRlckNvbW1lbnRzIiwiYWRkaXRpb25hbFByb3BlcnRpZXMiLCJjcmVhdGUiLCJjb250ZXh0IiwibGV2ZWwiLCJyZXF1aXJlQ2FsbHMiLCJvcHRpb25zIiwiY2hlY2tGb3JOZXdMaW5lIiwiY2xhc3NOb2RlIiwibGluZURpZmZlcmVuY2UiLCJFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UiLCJjb2x1bW4iLCJyZXBvcnQiLCJtZXNzYWdlIiwiZml4IiwiZml4ZXIiLCJpbnNlcnRUZXh0QWZ0ZXIiLCJyZXBlYXQiLCJjb21tZW50QWZ0ZXJJbXBvcnQiLCJuZXh0Q29tbWVudCIsImluY3JlbWVudExldmVsIiwiZGVjcmVtZW50TGV2ZWwiLCJjaGVja0ltcG9ydCIsInBhcmVudCIsIm5vZGVQb3NpdGlvbiIsImluZGV4T2YiLCJlbmRMaW5lIiwiY29tbWVudHMiLCJmaW5kIiwibyIsImlzRXhwb3J0IiwiSW1wb3J0RGVjbGFyYXRpb24iLCJUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJwdXNoIiwiZ2V0UGh5c2ljYWxGaWxlbmFtZSIsImdldEZpbGVuYW1lIiwic2NvcGVCb2R5IiwiZ2V0U2NvcGUiLCJmb3JFYWNoIiwiaW5kZXgiLCJzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwiLCJuZXh0U3RhdGVtZW50IiwibmV4dFJlcXVpcmVDYWxsIiwiRnVuY3Rpb25EZWNsYXJhdGlvbiIsIkZ1bmN0aW9uRXhwcmVzc2lvbiIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwiQmxvY2tTdGF0ZW1lbnQiLCJPYmplY3RFeHByZXNzaW9uIiwiRGVjb3JhdG9yIl0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHNEO0FBQ0EscUM7O0FBRUEsOEI7QUFDQSxJQUFNQSxNQUFNLHdCQUFNLGlEQUFOLENBQVo7O0FBRUE7QUFDQTtBQUNBO0FBYkE7OztHQWVBLFNBQVNDLG1CQUFULENBQTZCQyxTQUE3QixFQUF3Q0MsU0FBeEMsRUFBbUQsQ0FDakQsT0FBT0QsVUFBVUUsS0FBVixDQUFnQixDQUFoQixLQUFzQkQsVUFBVUMsS0FBVixDQUFnQixDQUFoQixDQUF0QixJQUE0Q0YsVUFBVUUsS0FBVixDQUFnQixDQUFoQixLQUFzQkQsVUFBVUMsS0FBVixDQUFnQixDQUFoQixDQUF6RSxDQUNEOztBQUVELFNBQVNDLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCO0FBQzNCLE1BQUlBLE1BQU1DLEtBQU4sQ0FBWUMsSUFBWixLQUFxQixpQkFBekIsRUFBNEM7QUFDMUNSLFFBQUksc0NBQUo7QUFDQSxXQUFPLElBQVA7QUFDRCxHQUowQjs7QUFNbkJTLE1BTm1CLEdBTVZILE1BQU1DLEtBTkksQ0FNbkJFLElBTm1CO0FBTzNCLE1BQUlBLFFBQVFBLEtBQUtELElBQUwsS0FBYyxnQkFBMUIsRUFBNEM7QUFDMUMsV0FBT0MsS0FBS0EsSUFBWjtBQUNEOztBQUVELFNBQU9BLElBQVA7QUFD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cEMsZ0NBQWdCa0Msd0JBQWhCLEVBQTBDQyxhQUExQyxFQUF5RCxTQUF6RDtBQUNEO0FBQ0YsYUFyQkQ7QUFzQkQsV0FuQ0k7QUFvQ0xFLDZCQUFxQnhCLGNBcENoQjtBQXFDTHlCLDRCQUFvQnpCLGNBckNmO0FBc0NMMEIsaUNBQXlCMUIsY0F0Q3BCO0FBdUNMMkIsd0JBQWdCM0IsY0F2Q1g7QUF3Q0w0QiwwQkFBa0I1QixjQXhDYjtBQXlDTDZCLG1CQUFXN0IsY0F6Q047QUEwQ0wsb0NBQTRCQyxjQTFDdkI7QUEyQ0wsbUNBQTJCQSxjQTNDdEI7QUE0Q0wsd0NBQWdDQSxjQTVDM0I7QUE2Q0wsK0JBQXVCQSxjQTdDbEI7QUE4Q0wsaUNBQXlCQSxjQTlDcEI7QUErQ0wsMEJBQWtCQSxjQS9DYixFQUFQOztBQWlERCxLQXZLYyxtQkFBakIiLCJmaWxlIjoibmV3bGluZS1hZnRlci1pbXBvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlb3ZlcnZpZXcgUnVsZSB0byBlbmZvcmNlIG5ldyBsaW5lIGFmdGVyIGltcG9ydCBub3QgZm9sbG93ZWQgYnkgYW5vdGhlciBpbXBvcnQuXG4gKiBAYXV0aG9yIFJhZGVrIEJlbmtlbFxuICovXG5cbmltcG9ydCBpc1N0YXRpY1JlcXVpcmUgZnJvbSAnLi4vY29yZS9zdGF0aWNSZXF1aXJlJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuY29uc3QgbG9nID0gZGVidWcoJ2VzbGludC1wbHVnaW4taW1wb3J0OnJ1bGVzOm5ld2xpbmUtYWZ0ZXItaW1wb3J0Jyk7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSdWxlIERlZmluaXRpb25cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGNvbnRhaW5zTm9kZU9yRXF1YWwob3V0ZXJOb2RlLCBpbm5lck5vZGUpIHtcbiAgcmV0dXJuIG91dGVyTm9kZS5yYW5nZVswXSA8PSBpbm5lck5vZGUucmFuZ2VbMF0gJiYgb3V0ZXJOb2RlLnJhbmdlWzFdID49IGlubmVyTm9kZS5yYW5nZVsxXTtcbn1cblxuZnVuY3Rpb24gZ2V0U2NvcGVCb2R5KHNjb3BlKSB7XG4gIGlmIChzY29wZS5ibG9jay50eXBlID09PSAnU3dpdGNoU3RhdGVtZW50Jykge1xuICAgIGxvZygnU3dpdGNoU3RhdGVtZW50IHNjb3BlcyBub3Qgc3VwcG9ydGVkJyk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCB7IGJvZHkgfSA9IHNjb3BlLmJsb2NrO1xuICBpZiAoYm9keSAmJiBib2R5LnR5cGUgPT09ICdCbG9ja1N0YXRlbWVudCcpIHtcbiAgICByZXR1cm4gYm9keS5ib2R5O1xuICB9XG5cbiAgcmV0dXJuIGJvZHk7XG59XG5cbmZ1bmN0aW9uIGZpbmROb2RlSW5kZXhJblNjb3BlQm9keShib2R5LCBub2RlVG9GaW5kKSB7XG4gIHJldHVybiBib2R5LmZpbmRJbmRleCgobm9kZSkgPT4gY29udGFpbnNOb2RlT3JFcXVhbChub2RlLCBub2RlVG9GaW5kKSk7XG59XG5cbmZ1bmN0aW9uIGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHROb2RlKSB7XG4gIHJldHVybiBuZXh0Tm9kZS5sb2Muc3RhcnQubGluZSAtIG5vZGUubG9jLmVuZC5saW5lO1xufVxuXG5mdW5jdGlvbiBpc0NsYXNzV2l0aERlY29yYXRvcihub2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdDbGFzc0RlY2xhcmF0aW9uJyAmJiBub2RlLmRlY29yYXRvcnMgJiYgbm9kZS5kZWNvcmF0b3JzLmxlbmd0aDtcbn1cblxuZnVuY3Rpb24gaXNFeHBvcnREZWZhdWx0Q2xhc3Mobm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdDbGFzc0RlY2xhcmF0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNFeHBvcnROYW1lQ2xhc3Mobm9kZSkge1xuXG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdFeHBvcnROYW1lZERlY2xhcmF0aW9uJyAmJiBub2RlLmRlY2xhcmF0aW9uICYmIG5vZGUuZGVjbGFyYXRpb24udHlwZSA9PT0gJ0NsYXNzRGVjbGFyYXRpb24nO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbWV0YToge1xuICAgIHR5cGU6ICdsYXlvdXQnLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbmZvcmNlIGEgbmV3bGluZSBhZnRlciBpbXBvcnQgc3RhdGVtZW50cy4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCduZXdsaW5lLWFmdGVyLWltcG9ydCcpLFxuICAgIH0sXG4gICAgZml4YWJsZTogJ3doaXRlc3BhY2UnLFxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNvdW50OiB7XG4gICAgICAgICAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgICAgICAgICBtaW5pbXVtOiAxLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29uc2lkZXJDb21tZW50czogeyB0eXBlOiAnYm9vbGVhbicgfSxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBjcmVhdGUoY29udGV4dCkge1xuICAgIGxldCBsZXZlbCA9IDA7XG4gICAgY29uc3QgcmVxdWlyZUNhbGxzID0gW107XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgY291bnQ6IDEsIGNvbnNpZGVyQ29tbWVudHM6IGZhbHNlLCAuLi5jb250ZXh0Lm9wdGlvbnNbMF0gfTtcblxuICAgIGZ1bmN0aW9uIGNoZWNrRm9yTmV3TGluZShub2RlLCBuZXh0Tm9kZSwgdHlwZSkge1xuICAgICAgaWYgKGlzRXhwb3J0RGVmYXVsdENsYXNzKG5leHROb2RlKSB8fCBpc0V4cG9ydE5hbWVDbGFzcyhuZXh0Tm9kZSkpIHtcbiAgICAgICAgY29uc3QgY2xhc3NOb2RlID0gbmV4dE5vZGUuZGVjbGFyYXRpb247XG5cbiAgICAgICAgaWYgKGlzQ2xhc3NXaXRoRGVjb3JhdG9yKGNsYXNzTm9kZSkpIHtcbiAgICAgICAgICBuZXh0Tm9kZSA9IGNsYXNzTm9kZS5kZWNvcmF0b3JzWzBdO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGlzQ2xhc3NXaXRoRGVjb3JhdG9yKG5leHROb2RlKSkge1xuICAgICAgICBuZXh0Tm9kZSA9IG5leHROb2RlLmRlY29yYXRvcnNbMF07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGxpbmVEaWZmZXJlbmNlID0gZ2V0TGluZURpZmZlcmVuY2Uobm9kZSwgbmV4dE5vZGUpO1xuICAgICAgY29uc3QgRVhQRUNURURfTElORV9ESUZGRVJFTkNFID0gb3B0aW9ucy5jb3VudCArIDE7XG5cbiAgICAgIGlmIChsaW5lRGlmZmVyZW5jZSA8IEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSkge1xuICAgICAgICBsZXQgY29sdW1uID0gbm9kZS5sb2Muc3RhcnQuY29sdW1uO1xuXG4gICAgICAgIGlmIChub2RlLmxvYy5zdGFydC5saW5lICE9PSBub2RlLmxvYy5lbmQubGluZSkge1xuICAgICAgICAgIGNvbHVtbiA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBjb250ZXh0LnJlcG9ydCh7XG4gICAgICAgICAgbG9jOiB7XG4gICAgICAgICAgICBsaW5lOiBub2RlLmxvYy5lbmQubGluZSxcbiAgICAgICAgICAgIGNvbHVtbixcbiAgICAgICAgICB9LFxuICAgICAgICAgIG1lc3NhZ2U6IGBFeHBlY3RlZCAke29wdGlvbnMuY291bnR9IGVtcHR5IGxpbmUke29wdGlvbnMuY291bnQgPiAxID8gJ3MnIDogJyd9IGFmdGVyICR7dHlwZX0gc3RhdGVtZW50IG5vdCBmb2xsb3dlZCBieSBhbm90aGVyICR7dHlwZX0uYCxcbiAgICAgICAgICBmaXg6IChmaXhlcikgPT4gZml4ZXIuaW5zZXJ0VGV4dEFmdGVyKFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgICdcXG4nLnJlcGVhdChFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UgLSBsaW5lRGlmZmVyZW5jZSksXG4gICAgICAgICAgKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbWVudEFmdGVySW1wb3J0KG5vZGUsIG5leHRDb21tZW50KSB7XG4gICAgICBjb25zdCBsaW5lRGlmZmVyZW5jZSA9IGdldExpbmVEaWZmZXJlbmNlKG5vZGUsIG5leHRDb21tZW50KTtcbiAgICAgIGNvbnN0IEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSA9IG9wdGlvbnMuY291bnQgKyAxO1xuXG4gICAgICBpZiAobGluZURpZmZlcmVuY2UgPCBFWFBFQ1RFRF9MSU5FX0RJRkZFUkVOQ0UpIHtcbiAgICAgICAgbGV0IGNvbHVtbiA9IG5vZGUubG9jLnN0YXJ0LmNvbHVtbjtcblxuICAgICAgICBpZiAobm9kZS5sb2Muc3RhcnQubGluZSAhPT0gbm9kZS5sb2MuZW5kLmxpbmUpIHtcbiAgICAgICAgICBjb2x1bW4gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIGxvYzoge1xuICAgICAgICAgICAgbGluZTogbm9kZS5sb2MuZW5kLmxpbmUsXG4gICAgICAgICAgICBjb2x1bW4sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBtZXNzYWdlOiBgRXhwZWN0ZWQgJHtvcHRpb25zLmNvdW50fSBlbXB0eSBsaW5lJHtvcHRpb25zLmNvdW50ID4gMSA/ICdzJyA6ICcnfSBhZnRlciBpbXBvcnQgc3RhdGVtZW50IG5vdCBmb2xsb3dlZCBieSBhbm90aGVyIGltcG9ydC5gLFxuICAgICAgICAgIGZpeDogKGZpeGVyKSA9PiBmaXhlci5pbnNlcnRUZXh0QWZ0ZXIoXG4gICAgICAgICAgICBub2RlLFxuICAgICAgICAgICAgJ1xcbicucmVwZWF0KEVYUEVDVEVEX0xJTkVfRElGRkVSRU5DRSAtIGxpbmVEaWZmZXJlbmNlKSxcbiAgICAgICAgICApLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbmNyZW1lbnRMZXZlbCgpIHtcbiAgICAgIGxldmVsKys7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlY3JlbWVudExldmVsKCkge1xuICAgICAgbGV2ZWwtLTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0ltcG9ydChub2RlKSB7XG4gICAgICBjb25zdCB7IHBhcmVudCB9ID0gbm9kZTtcbiAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IHBhcmVudC5ib2R5LmluZGV4T2Yobm9kZSk7XG4gICAgICBjb25zdCBuZXh0Tm9kZSA9IHBhcmVudC5ib2R5W25vZGVQb3NpdGlvbiArIDFdO1xuICAgICAgY29uc3QgZW5kTGluZSA9IG5vZGUubG9jLmVuZC5saW5lO1xuICAgICAgbGV0IG5leHRDb21tZW50O1xuXG4gICAgICBpZiAodHlwZW9mIHBhcmVudC5jb21tZW50cyAhPT0gJ3VuZGVmaW5lZCcgJiYgb3B0aW9ucy5jb25zaWRlckNvbW1lbnRzKSB7XG4gICAgICAgIG5leHRDb21tZW50ID0gcGFyZW50LmNvbW1lbnRzLmZpbmQoKG8pID0+IG8ubG9jLnN0YXJ0LmxpbmUgPT09IGVuZExpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgLy8gc2tpcCBcImV4cG9ydCBpbXBvcnRcInNcbiAgICAgIGlmIChub2RlLnR5cGUgPT09ICdUU0ltcG9ydEVxdWFsc0RlY2xhcmF0aW9uJyAmJiBub2RlLmlzRXhwb3J0KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG5leHRDb21tZW50ICYmIHR5cGVvZiBuZXh0Q29tbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29tbWVudEFmdGVySW1wb3J0KG5vZGUsIG5leHRDb21tZW50KTtcbiAgICAgIH0gZWxzZSBpZiAobmV4dE5vZGUgJiYgbmV4dE5vZGUudHlwZSAhPT0gJ0ltcG9ydERlY2xhcmF0aW9uJyAmJiAobmV4dE5vZGUudHlwZSAhPT0gJ1RTSW1wb3J0RXF1YWxzRGVjbGFyYXRpb24nIHx8IG5leHROb2RlLmlzRXhwb3J0KSkge1xuICAgICAgICBjaGVja0Zvck5ld0xpbmUobm9kZSwgbmV4dE5vZGUsICdpbXBvcnQnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgSW1wb3J0RGVjbGFyYXRpb246IGNoZWNrSW1wb3J0LFxuICAgICAgVFNJbXBvcnRFcXVhbHNEZWNsYXJhdGlvbjogY2hlY2tJbXBvcnQsXG4gICAgICBDYWxsRXhwcmVzc2lvbihub2RlKSB7XG4gICAgICAgIGlmIChpc1N0YXRpY1JlcXVpcmUobm9kZSkgJiYgbGV2ZWwgPT09IDApIHtcbiAgICAgICAgICByZXF1aXJlQ2FsbHMucHVzaChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgICdQcm9ncmFtOmV4aXQnKCkge1xuICAgICAgICBsb2coJ2V4aXQgcHJvY2Vzc2luZyBmb3InLCBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUgPyBjb250ZXh0LmdldFBoeXNpY2FsRmlsZW5hbWUoKSA6IGNvbnRleHQuZ2V0RmlsZW5hbWUoKSk7XG4gICAgICAgIGNvbnN0IHNjb3BlQm9keSA9IGdldFNjb3BlQm9keShjb250ZXh0LmdldFNjb3BlKCkpO1xuICAgICAgICBsb2coJ2dvdCBzY29wZTonLCBzY29wZUJvZHkpO1xuXG4gICAgICAgIHJlcXVpcmVDYWxscy5mb3JFYWNoKChub2RlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IG5vZGVQb3NpdGlvbiA9IGZpbmROb2RlSW5kZXhJblNjb3BlQm9keShzY29wZUJvZHksIG5vZGUpO1xuICAgICAgICAgIGxvZygnbm9kZSBwb3NpdGlvbiBpbiBzY29wZTonLCBub2RlUG9zaXRpb24pO1xuXG4gICAgICAgICAgY29uc3Qgc3RhdGVtZW50V2l0aFJlcXVpcmVDYWxsID0gc2NvcGVCb2R5W25vZGVQb3NpdGlvbl07XG4gICAgICAgICAgY29uc3QgbmV4dFN0YXRlbWVudCA9IHNjb3BlQm9keVtub2RlUG9zaXRpb24gKyAxXTtcbiAgICAgICAgICBjb25zdCBuZXh0UmVxdWlyZUNhbGwgPSByZXF1aXJlQ2FsbHNbaW5kZXggKyAxXTtcblxuICAgICAgICAgIGlmIChuZXh0UmVxdWlyZUNhbGwgJiYgY29udGFpbnNOb2RlT3JFcXVhbChzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRSZXF1aXJlQ2FsbCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBuZXh0U3RhdGVtZW50ICYmIChcbiAgICAgICAgICAgICAgIW5leHRSZXF1aXJlQ2FsbFxuICAgICAgICAgICAgICB8fCAhY29udGFpbnNOb2RlT3JFcXVhbChuZXh0U3RhdGVtZW50LCBuZXh0UmVxdWlyZUNhbGwpXG4gICAgICAgICAgICApXG4gICAgICAgICAgKSB7XG5cbiAgICAgICAgICAgIGNoZWNrRm9yTmV3TGluZShzdGF0ZW1lbnRXaXRoUmVxdWlyZUNhbGwsIG5leHRTdGF0ZW1lbnQsICdyZXF1aXJlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBGdW5jdGlvbkRlY2xhcmF0aW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIEZ1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBCbG9ja1N0YXRlbWVudDogaW5jcmVtZW50TGV2ZWwsXG4gICAgICBPYmplY3RFeHByZXNzaW9uOiBpbmNyZW1lbnRMZXZlbCxcbiAgICAgIERlY29yYXRvcjogaW5jcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25EZWNsYXJhdGlvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnRnVuY3Rpb25FeHByZXNzaW9uOmV4aXQnOiBkZWNyZW1lbnRMZXZlbCxcbiAgICAgICdBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgICAnQmxvY2tTdGF0ZW1lbnQ6ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ09iamVjdEV4cHJlc3Npb246ZXhpdCc6IGRlY3JlbWVudExldmVsLFxuICAgICAgJ0RlY29yYXRvcjpleGl0JzogZGVjcmVtZW50TGV2ZWwsXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=