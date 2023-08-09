'use strict';var _minimatch = require('minimatch');var _minimatch2 = _interopRequireDefault(_minimatch);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid importing the submodules of other modules.',
      url: (0, _docsUrl2['default'])('no-internal-modules') },


    schema: [
    {
      anyOf: [
      {
        type: 'object',
        properties: {
          allow: {
            type: 'array',
            items: {
              type: 'string' } } },



        additionalProperties: false },

      {
        type: 'object',
        properties: {
          forbid: {
            type: 'array',
            items: {
              type: 'string' } } },



        additionalProperties: false }] }] },






  create: function () {function noReachingInside(context) {
      var options = context.options[0] || {};
      var allowRegexps = (options.allow || []).map(function (p) {return _minimatch2['default'].makeRe(p);});
      var forbidRegexps = (options.forbid || []).map(function (p) {return _minimatch2['default'].makeRe(p);});

      // minimatch patterns are expected to use / path separators, like import
      // statements, so normalize paths to use the same
      function normalizeSep(somePath) {
        return somePath.split('\\').join('/');
      }

      function toSteps(somePath) {
        return normalizeSep(somePath).
        split('/').
        reduce(function (acc, step) {
          if (!step || step === '.') {
            return acc;
          } else if (step === '..') {
            return acc.slice(0, -1);
          } else {
            return acc.concat(step);
          }
        }, []);
      }

      // test if reaching to this destination is allowed
      function reachingAllowed(importPath) {
        return allowRegexps.some(function (re) {return re.test(importPath);});
      }

      // test if reaching to this destination is forbidden
      function reachingForbidden(importPath) {
        return forbidRegexps.some(function (re) {return re.test(importPath);});
      }

      function isAllowViolation(importPath) {
        var steps = toSteps(importPath);

        var nonScopeSteps = steps.filter(function (step) {return step.indexOf('@') !== 0;});
        if (nonScopeSteps.length <= 1) {return false;}

        // before trying to resolve, see if the raw import (with relative
        // segments resolved) matches an allowed pattern
        var justSteps = steps.join('/');
        if (reachingAllowed(justSteps) || reachingAllowed('/' + String(justSteps))) {return false;}

        // if the import statement doesn't match directly, try to match the
        // resolved path if the import is resolvable
        var resolved = (0, _resolve2['default'])(importPath, context);
        if (!resolved || reachingAllowed(normalizeSep(resolved))) {return false;}

        // this import was not allowed by the allowed paths, and reaches
        // so it is a violation
        return true;
      }

      function isForbidViolation(importPath) {
        var steps = toSteps(importPath);

        // before trying to resolve, see if the raw import (with relative
        // segments resolved) matches a forbidden pattern
        var justSteps = steps.join('/');

        if (reachingForbidden(justSteps) || reachingForbidden('/' + String(justSteps))) {return true;}

        // if the import statement doesn't match directly, try to match the
        // resolved path if the import is resolvable
        var resolved = (0, _resolve2['default'])(importPath, context);
        if (resolved && reachingForbidden(normalizeSep(resolved))) {return true;}

        // this import was not forbidden by the forbidden paths so it is not a violation
        return false;
      }

      // find a directory that is being reached into, but which shouldn't be
      var isReachViolation = options.forbid ? isForbidViolation : isAllowViolation;

      function checkImportForReaching(importPath, node) {
        var potentialViolationTypes = ['parent', 'index', 'sibling', 'external', 'internal'];
        if (
        potentialViolationTypes.indexOf((0, _importType2['default'])(importPath, context)) !== -1 &&
        isReachViolation(importPath))
        {
          context.report({
            node: node,
            message: 'Reaching to "' + String(importPath) + '" is not allowed.' });

        }
      }

      return (0, _moduleVisitor2['default'])(
      function (source) {
        checkImportForReaching(source.value, source);
      },
      { commonjs: true });

    }return noReachingInside;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1pbnRlcm5hbC1tb2R1bGVzLmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwiYW55T2YiLCJwcm9wZXJ0aWVzIiwiYWxsb3ciLCJpdGVtcyIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiZm9yYmlkIiwiY3JlYXRlIiwibm9SZWFjaGluZ0luc2lkZSIsImNvbnRleHQiLCJvcHRpb25zIiwiYWxsb3dSZWdleHBzIiwibWFwIiwicCIsIm1pbmltYXRjaCIsIm1ha2VSZSIsImZvcmJpZFJlZ2V4cHMiLCJub3JtYWxpemVTZXAiLCJzb21lUGF0aCIsInNwbGl0Iiwiam9pbiIsInRvU3RlcHMiLCJyZWR1Y2UiLCJhY2MiLCJzdGVwIiwic2xpY2UiLCJjb25jYXQiLCJyZWFjaGluZ0FsbG93ZWQiLCJpbXBvcnRQYXRoIiwic29tZSIsInJlIiwidGVzdCIsInJlYWNoaW5nRm9yYmlkZGVuIiwiaXNBbGxvd1Zpb2xhdGlvbiIsInN0ZXBzIiwibm9uU2NvcGVTdGVwcyIsImZpbHRlciIsImluZGV4T2YiLCJsZW5ndGgiLCJqdXN0U3RlcHMiLCJyZXNvbHZlZCIsImlzRm9yYmlkVmlvbGF0aW9uIiwiaXNSZWFjaFZpb2xhdGlvbiIsImNoZWNrSW1wb3J0Rm9yUmVhY2hpbmciLCJub2RlIiwicG90ZW50aWFsVmlvbGF0aW9uVHlwZXMiLCJyZXBvcnQiLCJtZXNzYWdlIiwic291cmNlIiwidmFsdWUiLCJjb21tb25qcyJdLCJtYXBwaW5ncyI6ImFBQUEsc0M7O0FBRUEsc0Q7QUFDQSxnRDtBQUNBLGtFO0FBQ0EscUM7O0FBRUFBLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxpQkFETjtBQUVKQyxtQkFBYSxtREFGVDtBQUdKQyxXQUFLLDBCQUFR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Qix1QkFGYSxFQUFmOztBQUlEO0FBQ0Y7O0FBRUQsYUFBTztBQUNMLGdCQUFDb0IsTUFBRCxFQUFZO0FBQ1ZMLCtCQUF1QkssT0FBT0MsS0FBOUIsRUFBcUNELE1BQXJDO0FBQ0QsT0FISTtBQUlMLFFBQUVFLFVBQVUsSUFBWixFQUpLLENBQVA7O0FBTUQsS0FoR0QsT0FBaUIxQyxnQkFBakIsSUF6Q2UsRUFBakIiLCJmaWxlIjoibm8taW50ZXJuYWwtbW9kdWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yYmlkIGltcG9ydGluZyB0aGUgc3VibW9kdWxlcyBvZiBvdGhlciBtb2R1bGVzLicsXG4gICAgICB1cmw6IGRvY3NVcmwoJ25vLWludGVybmFsLW1vZHVsZXMnKSxcbiAgICB9LFxuXG4gICAgc2NoZW1hOiBbXG4gICAgICB7XG4gICAgICAgIGFueU9mOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIGFsbG93OiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgZm9yYmlkOiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAgICAgdHlwZTogJ3N0cmluZycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIG5vUmVhY2hpbmdJbnNpZGUoY29udGV4dCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG4gICAgY29uc3QgYWxsb3dSZWdleHBzID0gKG9wdGlvbnMuYWxsb3cgfHwgW10pLm1hcCgocCkgPT4gbWluaW1hdGNoLm1ha2VSZShwKSk7XG4gICAgY29uc3QgZm9yYmlkUmVnZXhwcyA9IChvcHRpb25zLmZvcmJpZCB8fCBbXSkubWFwKChwKSA9PiBtaW5pbWF0Y2gubWFrZVJlKHApKTtcblxuICAgIC8vIG1pbmltYXRjaCBwYXR0ZXJucyBhcmUgZXhwZWN0ZWQgdG8gdXNlIC8gcGF0aCBzZXBhcmF0b3JzLCBsaWtlIGltcG9ydFxuICAgIC8vIHN0YXRlbWVudHMsIHNvIG5vcm1hbGl6ZSBwYXRocyB0byB1c2UgdGhlIHNhbWVcbiAgICBmdW5jdGlvbiBub3JtYWxpemVTZXAoc29tZVBhdGgpIHtcbiAgICAgIHJldHVybiBzb21lUGF0aC5zcGxpdCgnXFxcXCcpLmpvaW4oJy8nKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiB0b1N0ZXBzKHNvbWVQYXRoKSB7XG4gICAgICByZXR1cm4gIG5vcm1hbGl6ZVNlcChzb21lUGF0aClcbiAgICAgICAgLnNwbGl0KCcvJylcbiAgICAgICAgLnJlZHVjZSgoYWNjLCBzdGVwKSA9PiB7XG4gICAgICAgICAgaWYgKCFzdGVwIHx8IHN0ZXAgPT09ICcuJykge1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0ZXAgPT09ICcuLicpIHtcbiAgICAgICAgICAgIHJldHVybiBhY2Muc2xpY2UoMCwgLTEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYWNjLmNvbmNhdChzdGVwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIFtdKTtcbiAgICB9XG5cbiAgICAvLyB0ZXN0IGlmIHJlYWNoaW5nIHRvIHRoaXMgZGVzdGluYXRpb24gaXMgYWxsb3dlZFxuICAgIGZ1bmN0aW9uIHJlYWNoaW5nQWxsb3dlZChpbXBvcnRQYXRoKSB7XG4gICAgICByZXR1cm4gYWxsb3dSZWdleHBzLnNvbWUoKHJlKSA9PiByZS50ZXN0KGltcG9ydFBhdGgpKTtcbiAgICB9XG5cbiAgICAvLyB0ZXN0IGlmIHJlYWNoaW5nIHRvIHRoaXMgZGVzdGluYXRpb24gaXMgZm9yYmlkZGVuXG4gICAgZnVuY3Rpb24gcmVhY2hpbmdGb3JiaWRkZW4oaW1wb3J0UGF0aCkge1xuICAgICAgcmV0dXJuIGZvcmJpZFJlZ2V4cHMuc29tZSgocmUpID0+IHJlLnRlc3QoaW1wb3J0UGF0aCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzQWxsb3dWaW9sYXRpb24oaW1wb3J0UGF0aCkge1xuICAgICAgY29uc3Qgc3RlcHMgPSB0b1N0ZXBzKGltcG9ydFBhdGgpO1xuXG4gICAgICBjb25zdCBub25TY29wZVN0ZXBzID0gc3RlcHMuZmlsdGVyKChzdGVwKSA9PiBzdGVwLmluZGV4T2YoJ0AnKSAhPT0gMCk7XG4gICAgICBpZiAobm9uU2NvcGVTdGVwcy5sZW5ndGggPD0gMSkgeyByZXR1cm4gZmFsc2U7IH1cblxuICAgICAgLy8gYmVmb3JlIHRyeWluZyB0byByZXNvbHZlLCBzZWUgaWYgdGhlIHJhdyBpbXBvcnQgKHdpdGggcmVsYXRpdmVcbiAgICAgIC8vIHNlZ21lbnRzIHJlc29sdmVkKSBtYXRjaGVzIGFuIGFsbG93ZWQgcGF0dGVyblxuICAgICAgY29uc3QganVzdFN0ZXBzID0gc3RlcHMuam9pbignLycpO1xuICAgICAgaWYgKHJlYWNoaW5nQWxsb3dlZChqdXN0U3RlcHMpIHx8IHJlYWNoaW5nQWxsb3dlZChgLyR7anVzdFN0ZXBzfWApKSB7IHJldHVybiBmYWxzZTsgfVxuXG4gICAgICAvLyBpZiB0aGUgaW1wb3J0IHN0YXRlbWVudCBkb2Vzbid0IG1hdGNoIGRpcmVjdGx5LCB0cnkgdG8gbWF0Y2ggdGhlXG4gICAgICAvLyByZXNvbHZlZCBwYXRoIGlmIHRoZSBpbXBvcnQgaXMgcmVzb2x2YWJsZVxuICAgICAgY29uc3QgcmVzb2x2ZWQgPSByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpO1xuICAgICAgaWYgKCFyZXNvbHZlZCB8fCByZWFjaGluZ0FsbG93ZWQobm9ybWFsaXplU2VwKHJlc29sdmVkKSkpIHsgcmV0dXJuIGZhbHNlOyB9XG5cbiAgICAgIC8vIHRoaXMgaW1wb3J0IHdhcyBub3QgYWxsb3dlZCBieSB0aGUgYWxsb3dlZCBwYXRocywgYW5kIHJlYWNoZXNcbiAgICAgIC8vIHNvIGl0IGlzIGEgdmlvbGF0aW9uXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0ZvcmJpZFZpb2xhdGlvbihpbXBvcnRQYXRoKSB7XG4gICAgICBjb25zdCBzdGVwcyA9IHRvU3RlcHMoaW1wb3J0UGF0aCk7XG5cbiAgICAgIC8vIGJlZm9yZSB0cnlpbmcgdG8gcmVzb2x2ZSwgc2VlIGlmIHRoZSByYXcgaW1wb3J0ICh3aXRoIHJlbGF0aXZlXG4gICAgICAvLyBzZWdtZW50cyByZXNvbHZlZCkgbWF0Y2hlcyBhIGZvcmJpZGRlbiBwYXR0ZXJuXG4gICAgICBjb25zdCBqdXN0U3RlcHMgPSBzdGVwcy5qb2luKCcvJyk7XG5cbiAgICAgIGlmIChyZWFjaGluZ0ZvcmJpZGRlbihqdXN0U3RlcHMpIHx8IHJlYWNoaW5nRm9yYmlkZGVuKGAvJHtqdXN0U3RlcHN9YCkpIHsgcmV0dXJuIHRydWU7IH1cblxuICAgICAgLy8gaWYgdGhlIGltcG9ydCBzdGF0ZW1lbnQgZG9lc24ndCBtYXRjaCBkaXJlY3RseSwgdHJ5IHRvIG1hdGNoIHRoZVxuICAgICAgLy8gcmVzb2x2ZWQgcGF0aCBpZiB0aGUgaW1wb3J0IGlzIHJlc29sdmFibGVcbiAgICAgIGNvbnN0IHJlc29sdmVkID0gcmVzb2x2ZShpbXBvcnRQYXRoLCBjb250ZXh0KTtcbiAgICAgIGlmIChyZXNvbHZlZCAmJiByZWFjaGluZ0ZvcmJpZGRlbihub3JtYWxpemVTZXAocmVzb2x2ZWQpKSkgeyByZXR1cm4gdHJ1ZTsgfVxuXG4gICAgICAvLyB0aGlzIGltcG9ydCB3YXMgbm90IGZvcmJpZGRlbiBieSB0aGUgZm9yYmlkZGVuIHBhdGhzIHNvIGl0IGlzIG5vdCBhIHZpb2xhdGlvblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIGZpbmQgYSBkaXJlY3RvcnkgdGhhdCBpcyBiZWluZyByZWFjaGVkIGludG8sIGJ1dCB3aGljaCBzaG91bGRuJ3QgYmVcbiAgICBjb25zdCBpc1JlYWNoVmlvbGF0aW9uID0gb3B0aW9ucy5mb3JiaWQgPyBpc0ZvcmJpZFZpb2xhdGlvbiA6IGlzQWxsb3dWaW9sYXRpb247XG5cbiAgICBmdW5jdGlvbiBjaGVja0ltcG9ydEZvclJlYWNoaW5nKGltcG9ydFBhdGgsIG5vZGUpIHtcbiAgICAgIGNvbnN0IHBvdGVudGlhbFZpb2xhdGlvblR5cGVzID0gWydwYXJlbnQnLCAnaW5kZXgnLCAnc2libGluZycsICdleHRlcm5hbCcsICdpbnRlcm5hbCddO1xuICAgICAgaWYgKFxuICAgICAgICBwb3RlbnRpYWxWaW9sYXRpb25UeXBlcy5pbmRleE9mKGltcG9ydFR5cGUoaW1wb3J0UGF0aCwgY29udGV4dCkpICE9PSAtMVxuICAgICAgICAmJiBpc1JlYWNoVmlvbGF0aW9uKGltcG9ydFBhdGgpXG4gICAgICApIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgbWVzc2FnZTogYFJlYWNoaW5nIHRvIFwiJHtpbXBvcnRQYXRofVwiIGlzIG5vdCBhbGxvd2VkLmAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKFxuICAgICAgKHNvdXJjZSkgPT4ge1xuICAgICAgICBjaGVja0ltcG9ydEZvclJlYWNoaW5nKHNvdXJjZS52YWx1ZSwgc291cmNlKTtcbiAgICAgIH0sXG4gICAgICB7IGNvbW1vbmpzOiB0cnVlIH0sXG4gICAgKTtcbiAgfSxcbn07XG4iXX0=