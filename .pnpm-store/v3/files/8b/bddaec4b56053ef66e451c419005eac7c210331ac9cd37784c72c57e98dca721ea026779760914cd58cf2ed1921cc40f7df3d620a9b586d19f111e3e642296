'use strict';var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Forbid default exports.',
      url: (0, _docsUrl2['default'])('no-default-export') },

    schema: [] },


  create: function () {function create(context) {
      // ignore non-modules
      if (context.parserOptions.sourceType !== 'module') {
        return {};
      }

      var preferNamed = 'Prefer named exports.';
      var noAliasDefault = function () {function noAliasDefault(_ref) {var local = _ref.local;return 'Do not alias `' + String(local.name) + '` as `default`. Just export `' + String(local.name) + '` itself instead.';}return noAliasDefault;}();

      return {
        ExportDefaultDeclaration: function () {function ExportDefaultDeclaration(node) {var _ref2 =
            context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref2.loc;
            context.report({ node: node, message: preferNamed, loc: loc });
          }return ExportDefaultDeclaration;}(),

        ExportNamedDeclaration: function () {function ExportNamedDeclaration(node) {
            node.specifiers.filter(function (specifier) {return (specifier.exported.name || specifier.exported.value) === 'default';}).forEach(function (specifier) {var _ref3 =
              context.getSourceCode().getFirstTokens(node)[1] || {},loc = _ref3.loc;
              if (specifier.type === 'ExportDefaultSpecifier') {
                context.report({ node: node, message: preferNamed, loc: loc });
              } else if (specifier.type === 'ExportSpecifier') {
                context.report({ node: node, message: noAliasDefault(specifier), loc: loc });
              }
            });
          }return ExportNamedDeclaration;}() };

    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1kZWZhdWx0LWV4cG9ydC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwiY2F0ZWdvcnkiLCJkZXNjcmlwdGlvbiIsInVybCIsInNjaGVtYSIsImNyZWF0ZSIsImNvbnRleHQiLCJwYXJzZXJPcHRpb25zIiwic291cmNlVHlwZSIsInByZWZlck5hbWVkIiwibm9BbGlhc0RlZmF1bHQiLCJsb2NhbCIsIm5hbWUiLCJFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24iLCJub2RlIiwiZ2V0U291cmNlQ29kZSIsImdldEZpcnN0VG9rZW5zIiwibG9jIiwicmVwb3J0IiwibWVzc2FnZSIsIkV4cG9ydE5hbWVkRGVjbGFyYXRpb24iLCJzcGVjaWZpZXJzIiwiZmlsdGVyIiwic3BlY2lmaWVyIiwiZXhwb3J0ZWQiLCJ2YWx1ZSIsImZvckVhY2giXSwibWFwcGluZ3MiOiJhQUFBLHFDOztBQUVBQSxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxZQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsYUFETjtBQUVKQyxtQkFBYSx5QkFGVDtBQUdKQyxXQUFLLDBCQUFRLG1CQUFSLENBSEQsRUFGRjs7QUFPSkMsWUFBUSxFQVBKLEVBRFM7OztBQVdmQyxRQVhlLCtCQVdSQyxPQVhRLEVBV0M7QUFDZDtBQUNBLFVBQUlBLFFBQVFDLGFBQVIsQ0FBc0JDLFVBQXRCLEtBQXFDLFFBQXpDLEVBQW1EO0FBQ2pELGVBQU8sRUFBUDtBQUNEOztBQUVELFVBQU1DLGNBQWMsdUJBQXBCO0FBQ0EsVUFBTUMsOEJBQWlCLFNBQWpCQSxjQUFpQixZQUFHQyxLQUFILFFBQUdBLEtBQUgsa0NBQWlDQSxNQUFNQyxJQUF2Qyw2Q0FBK0VELE1BQU1DLElBQXJGLHlCQUFqQix5QkFBTjs7QUFFQSxhQUFPO0FBQ0xDLGdDQURLLGlEQUNvQkMsSUFEcEIsRUFDMEI7QUFDYlIsb0JBQVFTLGFBQVIsR0FBd0JDLGNBQXhCLENBQXVDRixJQUF2QyxFQUE2QyxDQUE3QyxLQUFtRCxFQUR0QyxDQUNyQkcsR0FEcUIsU0FDckJBLEdBRHFCO0FBRTdCWCxvQkFBUVksTUFBUixDQUFlLEVBQUVKLFVBQUYsRUFBUUssU0FBU1YsV0FBakIsRUFBOEJRLFFBQTlCLEVBQWY7QUFDRCxXQUpJOztBQU1MRyw4QkFOSywrQ0FNa0JOLElBTmxCLEVBTXdCO0FBQzNCQSxpQkFBS08sVUFBTCxDQUFnQkMsTUFBaEIsQ0FBdUIsVUFBQ0MsU0FBRCxVQUFlLENBQUNBLFVBQVVDLFFBQVYsQ0FBbUJaLElBQW5CLElBQTJCVyxVQUFVQyxRQUFWLENBQW1CQyxLQUEvQyxNQUEwRCxTQUF6RSxFQUF2QixFQUEyR0MsT0FBM0csQ0FBbUgsVUFBQ0gsU0FBRCxFQUFlO0FBQ2hIakIsc0JBQVFTLGFBQVIsR0FBd0JDLGNBQXhCLENBQXVDRixJQUF2QyxFQUE2QyxDQUE3QyxLQUFtRCxFQUQ2RCxDQUN4SEcsR0FEd0gsU0FDeEhBLEdBRHdIO0FBRWhJLGtCQUFJTSxVQUFVeEIsSUFBVixLQUFtQix3QkFBdkIsRUFBaUQ7QUFDL0NPLHdCQUFRWSxNQUFSLENBQWUsRUFBRUosVUFBRixFQUFRSyxTQUFTVixXQUFqQixFQUE4QlEsUUFBOUIsRUFBZjtBQUNELGVBRkQsTUFFTyxJQUFJTSxVQUFVeEIsSUFBVixLQUFtQixpQkFBdkIsRUFBMEM7QUFDL0NPLHdCQUFRWSxNQUFSLENBQWUsRUFBRUosVUFBRixFQUFRSyxTQUFTVCxlQUFlYSxTQUFmLENBQWpCLEVBQTRDTixRQUE1QyxFQUFmO0FBQ0Q7QUFDRixhQVBEO0FBUUQsV0FmSSxtQ0FBUDs7QUFpQkQsS0FyQ2MsbUJBQWpCIiwiZmlsZSI6Im5vLWRlZmF1bHQtZXhwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdGb3JiaWQgZGVmYXVsdCBleHBvcnRzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWRlZmF1bHQtZXhwb3J0JyksXG4gICAgfSxcbiAgICBzY2hlbWE6IFtdLFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG4gICAgLy8gaWdub3JlIG5vbi1tb2R1bGVzXG4gICAgaWYgKGNvbnRleHQucGFyc2VyT3B0aW9ucy5zb3VyY2VUeXBlICE9PSAnbW9kdWxlJykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGNvbnN0IHByZWZlck5hbWVkID0gJ1ByZWZlciBuYW1lZCBleHBvcnRzLic7XG4gICAgY29uc3Qgbm9BbGlhc0RlZmF1bHQgPSAoeyBsb2NhbCB9KSA9PiBgRG8gbm90IGFsaWFzIFxcYCR7bG9jYWwubmFtZX1cXGAgYXMgXFxgZGVmYXVsdFxcYC4gSnVzdCBleHBvcnQgXFxgJHtsb2NhbC5uYW1lfVxcYCBpdHNlbGYgaW5zdGVhZC5gO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIEV4cG9ydERlZmF1bHREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIGNvbnN0IHsgbG9jIH0gPSBjb250ZXh0LmdldFNvdXJjZUNvZGUoKS5nZXRGaXJzdFRva2Vucyhub2RlKVsxXSB8fCB7fTtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoeyBub2RlLCBtZXNzYWdlOiBwcmVmZXJOYW1lZCwgbG9jIH0pO1xuICAgICAgfSxcblxuICAgICAgRXhwb3J0TmFtZWREZWNsYXJhdGlvbihub2RlKSB7XG4gICAgICAgIG5vZGUuc3BlY2lmaWVycy5maWx0ZXIoKHNwZWNpZmllcikgPT4gKHNwZWNpZmllci5leHBvcnRlZC5uYW1lIHx8IHNwZWNpZmllci5leHBvcnRlZC52YWx1ZSkgPT09ICdkZWZhdWx0JykuZm9yRWFjaCgoc3BlY2lmaWVyKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBsb2MgfSA9IGNvbnRleHQuZ2V0U291cmNlQ29kZSgpLmdldEZpcnN0VG9rZW5zKG5vZGUpWzFdIHx8IHt9O1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0V4cG9ydERlZmF1bHRTcGVjaWZpZXInKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydCh7IG5vZGUsIG1lc3NhZ2U6IHByZWZlck5hbWVkLCBsb2MgfSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzcGVjaWZpZXIudHlwZSA9PT0gJ0V4cG9ydFNwZWNpZmllcicpIHtcbiAgICAgICAgICAgIGNvbnRleHQucmVwb3J0KHsgbm9kZSwgbWVzc2FnZTogbm9BbGlhc0RlZmF1bHQoc3BlY2lmaWVyKSwgbG9jICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==