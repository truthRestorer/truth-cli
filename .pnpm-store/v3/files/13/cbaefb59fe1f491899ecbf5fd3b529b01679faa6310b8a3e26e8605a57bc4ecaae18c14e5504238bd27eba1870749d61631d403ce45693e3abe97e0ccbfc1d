'use strict';




var _ignore = require('eslint-module-utils/ignore');
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _path = require('path');var _path2 = _interopRequireDefault(_path);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

/**
                                                                                                                                                                                       * convert a potentially relative path from node utils into a true
                                                                                                                                                                                       * relative path.
                                                                                                                                                                                       *
                                                                                                                                                                                       * ../ -> ..
                                                                                                                                                                                       * ./ -> .
                                                                                                                                                                                       * .foo/bar -> ./.foo/bar
                                                                                                                                                                                       * ..foo/bar -> ./..foo/bar
                                                                                                                                                                                       * foo/bar -> ./foo/bar
                                                                                                                                                                                       *
                                                                                                                                                                                       * @param relativePath {string} relative posix path potentially missing leading './'
                                                                                                                                                                                       * @returns {string} relative posix path that always starts with a ./
                                                                                                                                                                                       **/
function toRelativePath(relativePath) {
  var stripped = relativePath.replace(/\/$/g, ''); // Remove trailing /

  return (/^((\.\.)|(\.))($|\/)/.test(stripped) ? stripped : './' + String(stripped));
} /**
   * @fileOverview Ensures that there are no useless path segments
   * @author Thomas Grainger
   */function normalize(fn) {return toRelativePath(_path2['default'].posix.normalize(fn));
}

function countRelativeParents(pathSegments) {
  return pathSegments.reduce(function (sum, pathSegment) {return pathSegment === '..' ? sum + 1 : sum;}, 0);
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Static analysis',
      description: 'Forbid unnecessary path segments in import and require statements.',
      url: (0, _docsUrl2['default'])('no-useless-path-segments') },


    fixable: 'code',

    schema: [
    {
      type: 'object',
      properties: {
        commonjs: { type: 'boolean' },
        noUselessIndex: { type: 'boolean' } },

      additionalProperties: false }] },




  create: function () {function create(context) {
      var currentDir = _path2['default'].dirname(context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename());
      var options = context.options[0];

      function checkSourceValue(source) {var
        importPath = source.value;

        function reportWithProposedPath(proposedPath) {
          context.report({
            node: source,
            // Note: Using messageIds is not possible due to the support for ESLint 2 and 3
            message: 'Useless path segments for "' + String(importPath) + '", should be "' + String(proposedPath) + '"',
            fix: function () {function fix(fixer) {return proposedPath && fixer.replaceText(source, JSON.stringify(proposedPath));}return fix;}() });

        }

        // Only relative imports are relevant for this rule --> Skip checking
        if (!importPath.startsWith('.')) {
          return;
        }

        // Report rule violation if path is not the shortest possible
        var resolvedPath = (0, _resolve2['default'])(importPath, context);
        var normedPath = normalize(importPath);
        var resolvedNormedPath = (0, _resolve2['default'])(normedPath, context);
        if (normedPath !== importPath && resolvedPath === resolvedNormedPath) {
          return reportWithProposedPath(normedPath);
        }

        var fileExtensions = (0, _ignore.getFileExtensions)(context.settings);
        var regexUnnecessaryIndex = new RegExp('.*\\/index(\\' + String(
        Array.from(fileExtensions).join('|\\')) + ')?$');


        // Check if path contains unnecessary index (including a configured extension)
        if (options && options.noUselessIndex && regexUnnecessaryIndex.test(importPath)) {
          var parentDirectory = _path2['default'].dirname(importPath);

          // Try to find ambiguous imports
          if (parentDirectory !== '.' && parentDirectory !== '..') {var _iteratorNormalCompletion = true;var _didIteratorError = false;var _iteratorError = undefined;try {
              for (var _iterator = fileExtensions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {var fileExtension = _step.value;
                if ((0, _resolve2['default'])('' + String(parentDirectory) + String(fileExtension), context)) {
                  return reportWithProposedPath(String(parentDirectory) + '/');
                }
              }} catch (err) {_didIteratorError = true;_iteratorError = err;} finally {try {if (!_iteratorNormalCompletion && _iterator['return']) {_iterator['return']();}} finally {if (_didIteratorError) {throw _iteratorError;}}}
          }

          return reportWithProposedPath(parentDirectory);
        }

        // Path is shortest possible + starts from the current directory --> Return directly
        if (importPath.startsWith('./')) {
          return;
        }

        // Path is not existing --> Return directly (following code requires path to be defined)
        if (resolvedPath === undefined) {
          return;
        }

        var expected = _path2['default'].relative(currentDir, resolvedPath); // Expected import path
        var expectedSplit = expected.split(_path2['default'].sep); // Split by / or \ (depending on OS)
        var importPathSplit = importPath.replace(/^\.\//, '').split('/');
        var countImportPathRelativeParents = countRelativeParents(importPathSplit);
        var countExpectedRelativeParents = countRelativeParents(expectedSplit);
        var diff = countImportPathRelativeParents - countExpectedRelativeParents;

        // Same number of relative parents --> Paths are the same --> Return directly
        if (diff <= 0) {
          return;
        }

        // Report and propose minimal number of required relative parents
        return reportWithProposedPath(
        toRelativePath(
        importPathSplit.
        slice(0, countExpectedRelativeParents).
        concat(importPathSplit.slice(countImportPathRelativeParents + diff)).
        join('/')));


      }

      return (0, _moduleVisitor2['default'])(checkSourceValue, options);
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby11c2VsZXNzLXBhdGgtc2VnbWVudHMuanMiXSwibmFtZXMiOlsidG9SZWxhdGl2ZVBhdGgiLCJyZWxhdGl2ZVBhdGgiLCJzdHJpcHBlZCIsInJlcGxhY2UiLCJ0ZXN0Iiwibm9ybWFsaXplIiwiZm4iLCJwYXRoIiwicG9zaXgiLCJjb3VudFJlbGF0aXZlUGFyZW50cyIsInBhdGhTZWdtZW50cyIsInJlZHVjZSIsInN1bSIsInBhdGhTZWdtZW50IiwibW9kdWxlIiwiZXhwb3J0cyIsIm1ldGEiLCJ0eXBlIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJmaXhhYmxlIiwic2NoZW1hIiwicHJvcGVydGllcyIsImNvbW1vbmpzIiwibm9Vc2VsZXNzSW5kZXgiLCJhZGRpdGlvbmFsUHJvcGVydGllcyIsImNyZWF0ZSIsImNvbnRleHQiLCJjdXJyZW50RGlyIiwiZGlybmFtZSIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm9wdGlvbnMiLCJjaGVja1NvdXJjZVZhbHVlIiwic291cmNlIiwiaW1wb3J0UGF0aCIsInZhbHVlIiwicmVwb3J0V2l0aFByb3Bvc2VkUGF0aCIsInByb3Bvc2VkUGF0aCIsInJlcG9ydCIsIm5vZGUiLCJtZXNzYWdlIiwiZml4IiwiZml4ZXIiLCJyZXBsYWNlVGV4dCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdGFydHNXaXRoIiwicmVzb2x2ZWRQYXRoIiwibm9ybWVkUGF0aCIsInJlc29sdmVkTm9ybWVkUGF0aCIsImZpbGVFeHRlbnNpb25zIiwic2V0dGluZ3MiLCJyZWdleFVubmVjZXNzYXJ5SW5kZXgiLCJSZWdFeHAiLCJBcnJheSIsImZyb20iLCJqb2luIiwicGFyZW50RGlyZWN0b3J5IiwiZmlsZUV4dGVuc2lvbiIsInVuZGVmaW5lZCIsImV4cGVjdGVkIiwicmVsYXRpdmUiLCJleHBlY3RlZFNwbGl0Iiwic3BsaXQiLCJzZXAiLCJpbXBvcnRQYXRoU3BsaXQiLCJjb3VudEltcG9ydFBhdGhSZWxhdGl2ZVBhcmVudHMiLCJjb3VudEV4cGVjdGVkUmVsYXRpdmVQYXJlbnRzIiwiZGlmZiIsInNsaWNlIiwiY29uY2F0Il0sIm1hcHBpbmdzIjoiOzs7OztBQUtBO0FBQ0Esa0U7QUFDQSxzRDtBQUNBLDRCO0FBQ0EscUM7O0FBRUE7Ozs7Ozs7Ozs7Ozs7QUFhQSxTQUFTQSxjQUFULENBQXdCQyxZQUF4QixFQUFzQztBQUNwQyxNQUFNQyxXQUFXRCxhQUFhRSxPQUFiLENBQXFCLE1BQXJCLEVBQTZCLEVBQTdCLENBQWpCLENBRG9DLENBQ2U7O0FBRW5ELFNBQVEsdUJBQUQsQ0FBeUJDLElBQXpCLENBQThCRixRQUE5QixJQUEwQ0EsUUFBMUMsaUJBQTBEQSxRQUExRCxDQUFQO0FBQ0QsQyxDQTVCRDs7O0tBOEJBLFNBQVNHLFNBQVQsQ0FBbUJDLEVBQW5CLEVBQXVCLENBQ3JCLE9BQU9OLGVBQWVPLGtCQUFLQyxLQUFMLENBQVdILFNBQVgsQ0FBcUJDLEVBQXJCLENBQWYsQ0FBUDtBQUNEOztBQUVELFNBQVNHLG9CQUFULENBQThCQyxZQUE5QixFQUE0QztBQUMxQyxTQUFPQSxhQUFhQyxNQUFiLENBQW9CLFVBQUNDLEdBQUQsRUFBTUMsV0FBTixVQUFzQkEsZ0JBQWdCLElBQWhCLEdBQXVCRCxNQUFNLENBQTdCLEdBQWlDQSxHQUF2RCxFQUFwQixFQUFnRixDQUFoRixDQUFQO0FBQ0Q7O0FBRURFLE9BQU9DLE9BQVAsR0FBaUI7QUFDZkMsUUFBTTtBQUNKQyxVQUFNLFlBREY7QUFFSkMsVUFBTTtBQUNKQyxnQkFBVSxpQkFETjtBQUVKQyxtQkFBYSxvRUFGVDtBQUdKQyxXQUFLLDBCQUFRLDBCQUFSLENBSEQsRUFGRjs7O0FBUUpDLGFBQVMsTUFSTDs7QUFVSkMsWUFBUTtBQUNOO0FBQ0VOLFlBQU0sUUFEUjtBQUVFTyxrQkFBWTtBQUNWQyxrQkFBVSxFQUFFUixNQUFNLFNBQVIsRUFEQTtBQUVWUyx3QkFBZ0IsRUFBRVQsTUFBTSxTQUFSLEVBRk4sRUFGZDs7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QztBQUNBLFlBQU1NLE9BQU9GLGlDQUFpQ0MsNEJBQTlDOztBQUVBO0FBQ0EsWUFBSUMsUUFBUSxDQUFaLEVBQWU7QUFDYjtBQUNEOztBQUVEO0FBQ0EsZUFBT2hDO0FBQ0x2QztBQUNFb0U7QUFDR0ksYUFESCxDQUNTLENBRFQsRUFDWUYsNEJBRFo7QUFFR0csY0FGSCxDQUVVTCxnQkFBZ0JJLEtBQWhCLENBQXNCSCxpQ0FBaUNFLElBQXZELENBRlY7QUFHR1osWUFISCxDQUdRLEdBSFIsQ0FERixDQURLLENBQVA7OztBQVFEOztBQUVELGFBQU8sZ0NBQWN4QixnQkFBZCxFQUFnQ0QsT0FBaEMsQ0FBUDtBQUNELEtBM0djLG1CQUFqQiIsImZpbGUiOiJuby11c2VsZXNzLXBhdGgtc2VnbWVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmaWxlT3ZlcnZpZXcgRW5zdXJlcyB0aGF0IHRoZXJlIGFyZSBubyB1c2VsZXNzIHBhdGggc2VnbWVudHNcbiAqIEBhdXRob3IgVGhvbWFzIEdyYWluZ2VyXG4gKi9cblxuaW1wb3J0IHsgZ2V0RmlsZUV4dGVuc2lvbnMgfSBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL2lnbm9yZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGRvY3NVcmwgZnJvbSAnLi4vZG9jc1VybCc7XG5cbi8qKlxuICogY29udmVydCBhIHBvdGVudGlhbGx5IHJlbGF0aXZlIHBhdGggZnJvbSBub2RlIHV0aWxzIGludG8gYSB0cnVlXG4gKiByZWxhdGl2ZSBwYXRoLlxuICpcbiAqIC4uLyAtPiAuLlxuICogLi8gLT4gLlxuICogLmZvby9iYXIgLT4gLi8uZm9vL2JhclxuICogLi5mb28vYmFyIC0+IC4vLi5mb28vYmFyXG4gKiBmb28vYmFyIC0+IC4vZm9vL2JhclxuICpcbiAqIEBwYXJhbSByZWxhdGl2ZVBhdGgge3N0cmluZ30gcmVsYXRpdmUgcG9zaXggcGF0aCBwb3RlbnRpYWxseSBtaXNzaW5nIGxlYWRpbmcgJy4vJ1xuICogQHJldHVybnMge3N0cmluZ30gcmVsYXRpdmUgcG9zaXggcGF0aCB0aGF0IGFsd2F5cyBzdGFydHMgd2l0aCBhIC4vXG4gKiovXG5mdW5jdGlvbiB0b1JlbGF0aXZlUGF0aChyZWxhdGl2ZVBhdGgpIHtcbiAgY29uc3Qgc3RyaXBwZWQgPSByZWxhdGl2ZVBhdGgucmVwbGFjZSgvXFwvJC9nLCAnJyk7IC8vIFJlbW92ZSB0cmFpbGluZyAvXG5cbiAgcmV0dXJuICgvXigoXFwuXFwuKXwoXFwuKSkoJHxcXC8pLykudGVzdChzdHJpcHBlZCkgPyBzdHJpcHBlZCA6IGAuLyR7c3RyaXBwZWR9YDtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKGZuKSB7XG4gIHJldHVybiB0b1JlbGF0aXZlUGF0aChwYXRoLnBvc2l4Lm5vcm1hbGl6ZShmbikpO1xufVxuXG5mdW5jdGlvbiBjb3VudFJlbGF0aXZlUGFyZW50cyhwYXRoU2VnbWVudHMpIHtcbiAgcmV0dXJuIHBhdGhTZWdtZW50cy5yZWR1Y2UoKHN1bSwgcGF0aFNlZ21lbnQpID0+IHBhdGhTZWdtZW50ID09PSAnLi4nID8gc3VtICsgMSA6IHN1bSwgMCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRm9yYmlkIHVubmVjZXNzYXJ5IHBhdGggc2VnbWVudHMgaW4gaW1wb3J0IGFuZCByZXF1aXJlIHN0YXRlbWVudHMuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tdXNlbGVzcy1wYXRoLXNlZ21lbnRzJyksXG4gICAgfSxcblxuICAgIGZpeGFibGU6ICdjb2RlJyxcblxuICAgIHNjaGVtYTogW1xuICAgICAge1xuICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIGNvbW1vbmpzOiB7IHR5cGU6ICdib29sZWFuJyB9LFxuICAgICAgICAgIG5vVXNlbGVzc0luZGV4OiB7IHR5cGU6ICdib29sZWFuJyB9LFxuICAgICAgICB9LFxuICAgICAgICBhZGRpdGlvbmFsUHJvcGVydGllczogZmFsc2UsXG4gICAgICB9LFxuICAgIF0sXG4gIH0sXG5cbiAgY3JlYXRlKGNvbnRleHQpIHtcbiAgICBjb25zdCBjdXJyZW50RGlyID0gcGF0aC5kaXJuYW1lKGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSA/IGNvbnRleHQuZ2V0UGh5c2ljYWxGaWxlbmFtZSgpIDogY29udGV4dC5nZXRGaWxlbmFtZSgpKTtcbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tTb3VyY2VWYWx1ZShzb3VyY2UpIHtcbiAgICAgIGNvbnN0IHsgdmFsdWU6IGltcG9ydFBhdGggfSA9IHNvdXJjZTtcblxuICAgICAgZnVuY3Rpb24gcmVwb3J0V2l0aFByb3Bvc2VkUGF0aChwcm9wb3NlZFBhdGgpIHtcbiAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgIG5vZGU6IHNvdXJjZSxcbiAgICAgICAgICAvLyBOb3RlOiBVc2luZyBtZXNzYWdlSWRzIGlzIG5vdCBwb3NzaWJsZSBkdWUgdG8gdGhlIHN1cHBvcnQgZm9yIEVTTGludCAyIGFuZCAzXG4gICAgICAgICAgbWVzc2FnZTogYFVzZWxlc3MgcGF0aCBzZWdtZW50cyBmb3IgXCIke2ltcG9ydFBhdGh9XCIsIHNob3VsZCBiZSBcIiR7cHJvcG9zZWRQYXRofVwiYCxcbiAgICAgICAgICBmaXg6IChmaXhlcikgPT4gcHJvcG9zZWRQYXRoICYmIGZpeGVyLnJlcGxhY2VUZXh0KHNvdXJjZSwgSlNPTi5zdHJpbmdpZnkocHJvcG9zZWRQYXRoKSksXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmx5IHJlbGF0aXZlIGltcG9ydHMgYXJlIHJlbGV2YW50IGZvciB0aGlzIHJ1bGUgLS0+IFNraXAgY2hlY2tpbmdcbiAgICAgIGlmICghaW1wb3J0UGF0aC5zdGFydHNXaXRoKCcuJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXBvcnQgcnVsZSB2aW9sYXRpb24gaWYgcGF0aCBpcyBub3QgdGhlIHNob3J0ZXN0IHBvc3NpYmxlXG4gICAgICBjb25zdCByZXNvbHZlZFBhdGggPSByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpO1xuICAgICAgY29uc3Qgbm9ybWVkUGF0aCA9IG5vcm1hbGl6ZShpbXBvcnRQYXRoKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkTm9ybWVkUGF0aCA9IHJlc29sdmUobm9ybWVkUGF0aCwgY29udGV4dCk7XG4gICAgICBpZiAobm9ybWVkUGF0aCAhPT0gaW1wb3J0UGF0aCAmJiByZXNvbHZlZFBhdGggPT09IHJlc29sdmVkTm9ybWVkUGF0aCkge1xuICAgICAgICByZXR1cm4gcmVwb3J0V2l0aFByb3Bvc2VkUGF0aChub3JtZWRQYXRoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlsZUV4dGVuc2lvbnMgPSBnZXRGaWxlRXh0ZW5zaW9ucyhjb250ZXh0LnNldHRpbmdzKTtcbiAgICAgIGNvbnN0IHJlZ2V4VW5uZWNlc3NhcnlJbmRleCA9IG5ldyBSZWdFeHAoXG4gICAgICAgIGAuKlxcXFwvaW5kZXgoXFxcXCR7QXJyYXkuZnJvbShmaWxlRXh0ZW5zaW9ucykuam9pbignfFxcXFwnKX0pPyRgLFxuICAgICAgKTtcblxuICAgICAgLy8gQ2hlY2sgaWYgcGF0aCBjb250YWlucyB1bm5lY2Vzc2FyeSBpbmRleCAoaW5jbHVkaW5nIGEgY29uZmlndXJlZCBleHRlbnNpb24pXG4gICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLm5vVXNlbGVzc0luZGV4ICYmIHJlZ2V4VW5uZWNlc3NhcnlJbmRleC50ZXN0KGltcG9ydFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IHBhcmVudERpcmVjdG9yeSA9IHBhdGguZGlybmFtZShpbXBvcnRQYXRoKTtcblxuICAgICAgICAvLyBUcnkgdG8gZmluZCBhbWJpZ3VvdXMgaW1wb3J0c1xuICAgICAgICBpZiAocGFyZW50RGlyZWN0b3J5ICE9PSAnLicgJiYgcGFyZW50RGlyZWN0b3J5ICE9PSAnLi4nKSB7XG4gICAgICAgICAgZm9yIChjb25zdCBmaWxlRXh0ZW5zaW9uIG9mIGZpbGVFeHRlbnNpb25zKSB7XG4gICAgICAgICAgICBpZiAocmVzb2x2ZShgJHtwYXJlbnREaXJlY3Rvcnl9JHtmaWxlRXh0ZW5zaW9ufWAsIGNvbnRleHQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZXBvcnRXaXRoUHJvcG9zZWRQYXRoKGAke3BhcmVudERpcmVjdG9yeX0vYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcG9ydFdpdGhQcm9wb3NlZFBhdGgocGFyZW50RGlyZWN0b3J5KTtcbiAgICAgIH1cblxuICAgICAgLy8gUGF0aCBpcyBzaG9ydGVzdCBwb3NzaWJsZSArIHN0YXJ0cyBmcm9tIHRoZSBjdXJyZW50IGRpcmVjdG9yeSAtLT4gUmV0dXJuIGRpcmVjdGx5XG4gICAgICBpZiAoaW1wb3J0UGF0aC5zdGFydHNXaXRoKCcuLycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gUGF0aCBpcyBub3QgZXhpc3RpbmcgLS0+IFJldHVybiBkaXJlY3RseSAoZm9sbG93aW5nIGNvZGUgcmVxdWlyZXMgcGF0aCB0byBiZSBkZWZpbmVkKVxuICAgICAgaWYgKHJlc29sdmVkUGF0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBwYXRoLnJlbGF0aXZlKGN1cnJlbnREaXIsIHJlc29sdmVkUGF0aCk7IC8vIEV4cGVjdGVkIGltcG9ydCBwYXRoXG4gICAgICBjb25zdCBleHBlY3RlZFNwbGl0ID0gZXhwZWN0ZWQuc3BsaXQocGF0aC5zZXApOyAvLyBTcGxpdCBieSAvIG9yIFxcIChkZXBlbmRpbmcgb24gT1MpXG4gICAgICBjb25zdCBpbXBvcnRQYXRoU3BsaXQgPSBpbXBvcnRQYXRoLnJlcGxhY2UoL15cXC5cXC8vLCAnJykuc3BsaXQoJy8nKTtcbiAgICAgIGNvbnN0IGNvdW50SW1wb3J0UGF0aFJlbGF0aXZlUGFyZW50cyA9IGNvdW50UmVsYXRpdmVQYXJlbnRzKGltcG9ydFBhdGhTcGxpdCk7XG4gICAgICBjb25zdCBjb3VudEV4cGVjdGVkUmVsYXRpdmVQYXJlbnRzID0gY291bnRSZWxhdGl2ZVBhcmVudHMoZXhwZWN0ZWRTcGxpdCk7XG4gICAgICBjb25zdCBkaWZmID0gY291bnRJbXBvcnRQYXRoUmVsYXRpdmVQYXJlbnRzIC0gY291bnRFeHBlY3RlZFJlbGF0aXZlUGFyZW50cztcblxuICAgICAgLy8gU2FtZSBudW1iZXIgb2YgcmVsYXRpdmUgcGFyZW50cyAtLT4gUGF0aHMgYXJlIHRoZSBzYW1lIC0tPiBSZXR1cm4gZGlyZWN0bHlcbiAgICAgIGlmIChkaWZmIDw9IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXBvcnQgYW5kIHByb3Bvc2UgbWluaW1hbCBudW1iZXIgb2YgcmVxdWlyZWQgcmVsYXRpdmUgcGFyZW50c1xuICAgICAgcmV0dXJuIHJlcG9ydFdpdGhQcm9wb3NlZFBhdGgoXG4gICAgICAgIHRvUmVsYXRpdmVQYXRoKFxuICAgICAgICAgIGltcG9ydFBhdGhTcGxpdFxuICAgICAgICAgICAgLnNsaWNlKDAsIGNvdW50RXhwZWN0ZWRSZWxhdGl2ZVBhcmVudHMpXG4gICAgICAgICAgICAuY29uY2F0KGltcG9ydFBhdGhTcGxpdC5zbGljZShjb3VudEltcG9ydFBhdGhSZWxhdGl2ZVBhcmVudHMgKyBkaWZmKSlcbiAgICAgICAgICAgIC5qb2luKCcvJyksXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKGNoZWNrU291cmNlVmFsdWUsIG9wdGlvbnMpO1xuICB9LFxufTtcbiJdfQ==