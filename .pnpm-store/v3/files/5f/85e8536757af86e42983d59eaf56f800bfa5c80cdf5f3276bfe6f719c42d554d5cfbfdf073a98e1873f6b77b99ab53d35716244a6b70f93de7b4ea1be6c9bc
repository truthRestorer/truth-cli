'use strict';




var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var has = Function.bind.bind(Function.prototype.call)(Object.prototype.hasOwnProperty); /**
                                                                                         * @fileoverview Rule to disallow anonymous default exports.
                                                                                         * @author Duncan Beevers
                                                                                         */var defs = { ArrayExpression: {
    option: 'allowArray',
    description: 'If `false`, will report default export of an array',
    message: 'Assign array to a variable before exporting as module default' },

  ArrowFunctionExpression: {
    option: 'allowArrowFunction',
    description: 'If `false`, will report default export of an arrow function',
    message: 'Assign arrow function to a variable before exporting as module default' },

  CallExpression: {
    option: 'allowCallExpression',
    description: 'If `false`, will report default export of a function call',
    message: 'Assign call result to a variable before exporting as module default',
    'default': true },

  ClassDeclaration: {
    option: 'allowAnonymousClass',
    description: 'If `false`, will report default export of an anonymous class',
    message: 'Unexpected default export of anonymous class',
    forbid: function () {function forbid(node) {return !node.declaration.id;}return forbid;}() },

  FunctionDeclaration: {
    option: 'allowAnonymousFunction',
    description: 'If `false`, will report default export of an anonymous function',
    message: 'Unexpected default export of anonymous function',
    forbid: function () {function forbid(node) {return !node.declaration.id;}return forbid;}() },

  Literal: {
    option: 'allowLiteral',
    description: 'If `false`, will report default export of a literal',
    message: 'Assign literal to a variable before exporting as module default' },

  ObjectExpression: {
    option: 'allowObject',
    description: 'If `false`, will report default export of an object expression',
    message: 'Assign object to a variable before exporting as module default' },

  TemplateLiteral: {
    option: 'allowLiteral',
    description: 'If `false`, will report default export of a literal',
    message: 'Assign literal to a variable before exporting as module default' },

  NewExpression: {
    option: 'allowNew',
    description: 'If `false`, will report default export of a class instantiation',
    message: 'Assign instance to a variable before exporting as module default' } };



var schemaProperties = Object.keys(defs).
map(function (key) {return defs[key];}).
reduce(function (acc, def) {
  acc[def.option] = {
    description: def.description,
    type: 'boolean' };


  return acc;
}, {});

var defaults = Object.keys(defs).
map(function (key) {return defs[key];}).
reduce(function (acc, def) {
  acc[def.option] = has(def, 'default') ? def['default'] : false;
  return acc;
}, {});

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid anonymous values as default exports.',
      url: (0, _docsUrl2['default'])('no-anonymous-default-export') },


    schema: [
    {
      type: 'object',
      properties: schemaProperties,
      additionalProperties: false }] },




  create: function () {function create(context) {
      var options = Object.assign({}, defaults, context.options[0]);

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {
            var def = defs[node.declaration.type];

            // Recognized node type and allowed by configuration,
            //   and has no forbid check, or forbid check return value is truthy
            if (def && !options[def.option] && (!def.forbid || def.forbid(node))) {
              context.report({ node: node, message: def.message });
            }
          }return ExportDefaultDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1hbm9ueW1vdXMtZGVmYXVsdC1leHBvcnQuanMiXSwibmFtZXMiOlsiaGFzIiwiRnVuY3Rpb24iLCJiaW5kIiwicHJvdG90eXBlIiwiY2FsbCIsIk9iamVjdCIsImhhc093blByb3BlcnR5IiwiZGVmcyIsIkFycmF5RXhwcmVzc2lvbiIsIm9wdGlvbiIsImRlc2NyaXB0aW9uIiwibWVzc2FnZSIsIkFycm93RnVuY3Rpb25FeHByZXNzaW9uIiwiQ2FsbEV4cHJlc3Npb24iLCJDbGFzc0RlY2xhcmF0aW9uIiwiZm9yYmlkIiwibm9kZSIsImRlY2xhcmF0aW9uIiwiaWQiLCJGdW5jdGlvbkRlY2xhcmF0aW9uIiwiTGl0ZXJhbCIsIk9iamVjdEV4cHJlc3Npb24iLCJUZW1wbGF0ZUxpdGVyYWwiLCJOZXdFeHByZXNzaW9uIiwic2NoZW1hUHJvcGVydGllcyIsImtleXMiLCJtYXAiLCJrZXkiLCJyZWR1Y2UiLCJhY2MiLCJkZWYiLCJ0eXBlIiwiZGVmYXVsdHMiLCJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsImRvY3MiLCJjYXRlZ29yeSIsInVybCIsInNjaGVtYSIsInByb3BlcnRpZXMiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsImNvbnRleHQiLCJvcHRpb25zIiwiRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uIiwicmVwb3J0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBLHFDOztBQUVBLElBQU1BLE1BQU1DLFNBQVNDLElBQVQsQ0FBY0EsSUFBZCxDQUFtQkQsU0FBU0UsU0FBVCxDQUFtQkMsSUFBdEMsRUFBNENDLE9BQU9GLFNBQVAsQ0FBaUJHLGNBQTdELENBQVosQyxDQVBBOzs7MkZBU0EsSUFBTUMsT0FBTyxFQUNYQyxpQkFBaUI7QUFDZkMsWUFBUSxZQURPO0FBRWZDLGlCQUFhLG9EQUZFO0FBR2ZDLGFBQVMsK0RBSE0sRUFETjs7QUFNWEMsMkJBQXlCO0FBQ3ZCSCxZQUFRLG9CQURlO0FBRXZCQyxpQkFB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QUFDcEUyQixzQkFBUUcsTUFBUixDQUFlLEVBQUU5QixVQUFGLEVBQVFMLFNBQVNtQixJQUFJbkIsT0FBckIsRUFBZjtBQUNEO0FBQ0YsV0FUSSxxQ0FBUDs7QUFXRCxLQWhDYyxtQkFBakIiLCJmaWxlIjoibm8tYW5vbnltb3VzLWRlZmF1bHQtZXhwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmlsZW92ZXJ2aWV3IFJ1bGUgdG8gZGlzYWxsb3cgYW5vbnltb3VzIGRlZmF1bHQgZXhwb3J0cy5cbiAqIEBhdXRob3IgRHVuY2FuIEJlZXZlcnNcbiAqL1xuXG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcblxuY29uc3QgaGFzID0gRnVuY3Rpb24uYmluZC5iaW5kKEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsKShPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcblxuY29uc3QgZGVmcyA9IHtcbiAgQXJyYXlFeHByZXNzaW9uOiB7XG4gICAgb3B0aW9uOiAnYWxsb3dBcnJheScsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhbiBhcnJheScsXG4gICAgbWVzc2FnZTogJ0Fzc2lnbiBhcnJheSB0byBhIHZhcmlhYmxlIGJlZm9yZSBleHBvcnRpbmcgYXMgbW9kdWxlIGRlZmF1bHQnLFxuICB9LFxuICBBcnJvd0Z1bmN0aW9uRXhwcmVzc2lvbjoge1xuICAgIG9wdGlvbjogJ2FsbG93QXJyb3dGdW5jdGlvbicsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhbiBhcnJvdyBmdW5jdGlvbicsXG4gICAgbWVzc2FnZTogJ0Fzc2lnbiBhcnJvdyBmdW5jdGlvbiB0byBhIHZhcmlhYmxlIGJlZm9yZSBleHBvcnRpbmcgYXMgbW9kdWxlIGRlZmF1bHQnLFxuICB9LFxuICBDYWxsRXhwcmVzc2lvbjoge1xuICAgIG9wdGlvbjogJ2FsbG93Q2FsbEV4cHJlc3Npb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgZGVmYXVsdCBleHBvcnQgb2YgYSBmdW5jdGlvbiBjYWxsJyxcbiAgICBtZXNzYWdlOiAnQXNzaWduIGNhbGwgcmVzdWx0IHRvIGEgdmFyaWFibGUgYmVmb3JlIGV4cG9ydGluZyBhcyBtb2R1bGUgZGVmYXVsdCcsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgfSxcbiAgQ2xhc3NEZWNsYXJhdGlvbjoge1xuICAgIG9wdGlvbjogJ2FsbG93QW5vbnltb3VzQ2xhc3MnLFxuICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgZGVmYXVsdCBleHBvcnQgb2YgYW4gYW5vbnltb3VzIGNsYXNzJyxcbiAgICBtZXNzYWdlOiAnVW5leHBlY3RlZCBkZWZhdWx0IGV4cG9ydCBvZiBhbm9ueW1vdXMgY2xhc3MnLFxuICAgIGZvcmJpZDogKG5vZGUpID0+ICFub2RlLmRlY2xhcmF0aW9uLmlkLFxuICB9LFxuICBGdW5jdGlvbkRlY2xhcmF0aW9uOiB7XG4gICAgb3B0aW9uOiAnYWxsb3dBbm9ueW1vdXNGdW5jdGlvbicsXG4gICAgZGVzY3JpcHRpb246ICdJZiBgZmFsc2VgLCB3aWxsIHJlcG9ydCBkZWZhdWx0IGV4cG9ydCBvZiBhbiBhbm9ueW1vdXMgZnVuY3Rpb24nLFxuICAgIG1lc3NhZ2U6ICdVbmV4cGVjdGVkIGRlZmF1bHQgZXhwb3J0IG9mIGFub255bW91cyBmdW5jdGlvbicsXG4gICAgZm9yYmlkOiAobm9kZSkgPT4gIW5vZGUuZGVjbGFyYXRpb24uaWQsXG4gIH0sXG4gIExpdGVyYWw6IHtcbiAgICBvcHRpb246ICdhbGxvd0xpdGVyYWwnLFxuICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgZGVmYXVsdCBleHBvcnQgb2YgYSBsaXRlcmFsJyxcbiAgICBtZXNzYWdlOiAnQXNzaWduIGxpdGVyYWwgdG8gYSB2YXJpYWJsZSBiZWZvcmUgZXhwb3J0aW5nIGFzIG1vZHVsZSBkZWZhdWx0JyxcbiAgfSxcbiAgT2JqZWN0RXhwcmVzc2lvbjoge1xuICAgIG9wdGlvbjogJ2FsbG93T2JqZWN0JyxcbiAgICBkZXNjcmlwdGlvbjogJ0lmIGBmYWxzZWAsIHdpbGwgcmVwb3J0IGRlZmF1bHQgZXhwb3J0IG9mIGFuIG9iamVjdCBleHByZXNzaW9uJyxcbiAgICBtZXNzYWdlOiAnQXNzaWduIG9iamVjdCB0byBhIHZhcmlhYmxlIGJlZm9yZSBleHBvcnRpbmcgYXMgbW9kdWxlIGRlZmF1bHQnLFxuICB9LFxuICBUZW1wbGF0ZUxpdGVyYWw6IHtcbiAgICBvcHRpb246ICdhbGxvd0xpdGVyYWwnLFxuICAgIGRlc2NyaXB0aW9uOiAnSWYgYGZhbHNlYCwgd2lsbCByZXBvcnQgZGVmYXVsdCBleHBvcnQgb2YgYSBsaXRlcmFsJyxcbiAgICBtZXNzYWdlOiAnQXNzaWduIGxpdGVyYWwgdG8gYSB2YXJpYWJsZSBiZWZvcmUgZXhwb3J0aW5nIGFzIG1vZHVsZSBkZWZhdWx0JyxcbiAgfSxcbiAgTmV3RXhwcmVzc2lvbjoge1xuICAgIG9wdGlvbjogJ2FsbG93TmV3JyxcbiAgICBkZXNjcmlwdGlvbjogJ0lmIGBmYWxzZWAsIHdpbGwgcmVwb3J0IGRlZmF1bHQgZXhwb3J0IG9mIGEgY2xhc3MgaW5zdGFudGlhdGlvbicsXG4gICAgbWVzc2FnZTogJ0Fzc2lnbiBpbnN0YW5jZSB0byBhIHZhcmlhYmxlIGJlZm9yZSBleHBvcnRpbmcgYXMgbW9kdWxlIGRlZmF1bHQnLFxuICB9LFxufTtcblxuY29uc3Qgc2NoZW1hUHJvcGVydGllcyA9IE9iamVjdC5rZXlzKGRlZnMpXG4gIC5tYXAoKGtleSkgPT4gZGVmc1trZXldKVxuICAucmVkdWNlKChhY2MsIGRlZikgPT4ge1xuICAgIGFjY1tkZWYub3B0aW9uXSA9IHtcbiAgICAgIGRlc2NyaXB0aW9uOiBkZWYuZGVzY3JpcHRpb24sXG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgfTtcblxuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcblxuY29uc3QgZGVmYXVsdHMgPSBPYmplY3Qua2V5cyhkZWZzKVxuICAubWFwKChrZXkpID0+IGRlZnNba2V5XSlcbiAgLnJlZHVjZSgoYWNjLCBkZWYpID0+IHtcbiAgICBhY2NbZGVmLm9wdGlvbl0gPSBoYXMoZGVmLCAnZGVmYXVsdCcpID8gZGVmLmRlZmF1bHQgOiBmYWxzZTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgYW5vbnltb3VzIHZhbHVlcyBhcyBkZWZhdWx0IGV4cG9ydHMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tYW5vbnltb3VzLWRlZmF1bHQtZXhwb3J0JyksXG4gICAgfSxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczogc2NoZW1hUHJvcGVydGllcyxcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4uZGVmYXVsdHMsIC4uLmNvbnRleHQub3B0aW9uc1swXSB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGNvbnN0IGRlZiA9IGRlZnNbbm9kZS5kZWNsYXJhdGlvbi50eXBlXTtcblxuICAgICAgICAvLyBSZWNvZ25pemVkIG5vZGUgdHlwZSBhbmQgYWxsb3dlZCBieSBjb25maWd1cmF0aW9uLFxuICAgICAgICAvLyAgIGFuZCBoYXMgbm8gZm9yYmlkIGNoZWNrLCBvciBmb3JiaWQgY2hlY2sgcmV0dXJuIHZhbHVlIGlzIHRydXRoeVxuICAgICAgICBpZiAoZGVmICYmICFvcHRpb25zW2RlZi5vcHRpb25dICYmICghZGVmLmZvcmJpZCB8fCBkZWYuZm9yYmlkKG5vZGUpKSkge1xuICAgICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogZGVmLm1lc3NhZ2UgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=