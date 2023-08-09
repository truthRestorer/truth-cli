'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _isGlob = require('is-glob');var _isGlob2 = _interopRequireDefault(_isGlob);
var _minimatch = require('minimatch');
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);
var _importType = require('../core/importType');var _importType2 = _interopRequireDefault(_importType);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var containsPath = function containsPath(filepath, target) {
  var relative = _path2['default'].relative(target, filepath);
  return relative === '' || !relative.startsWith('..');
};

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      category: 'Static analysis',
      description: 'Enforce which files can be imported in a given folder.',
      url: (0, _docsUrl2['default'])('no-restricted-paths') },


    schema: [
    {
      type: 'object',
      properties: {
        zones: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'object',
            properties: {
              target: {
                anyOf: [
                { type: 'string' },
                {
                  type: 'array',
                  items: { type: 'string' },
                  uniqueItems: true,
                  minLength: 1 }] },



              from: {
                anyOf: [
                { type: 'string' },
                {
                  type: 'array',
                  items: { type: 'string' },
                  uniqueItems: true,
                  minLength: 1 }] },



              except: {
                type: 'array',
                items: {
                  type: 'string' },

                uniqueItems: true },

              message: { type: 'string' } },

            additionalProperties: false } },


        basePath: { type: 'string' } },

      additionalProperties: false }] },




  create: function () {function noRestrictedPaths(context) {
      var options = context.options[0] || {};
      var restrictedPaths = options.zones || [];
      var basePath = options.basePath || process.cwd();
      var currentFilename = context.getPhysicalFilename ? context.getPhysicalFilename() : context.getFilename();
      var matchingZones = restrictedPaths.filter(function (zone) {return [].concat(zone.target).
        map(function (target) {return _path2['default'].resolve(basePath, target);}).
        some(function (targetPath) {return isMatchingTargetPath(currentFilename, targetPath);});});

      function isMatchingTargetPath(filename, targetPath) {
        if ((0, _isGlob2['default'])(targetPath)) {
          var mm = new _minimatch.Minimatch(targetPath);
          return mm.match(filename);
        }

        return containsPath(filename, targetPath);
      }

      function isValidExceptionPath(absoluteFromPath, absoluteExceptionPath) {
        var relativeExceptionPath = _path2['default'].relative(absoluteFromPath, absoluteExceptionPath);

        return (0, _importType2['default'])(relativeExceptionPath, context) !== 'parent';
      }

      function areBothGlobPatternAndAbsolutePath(areGlobPatterns) {
        return areGlobPatterns.some(function (isGlob) {return isGlob;}) && areGlobPatterns.some(function (isGlob) {return !isGlob;});
      }

      function reportInvalidExceptionPath(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be descendants of the configured `from` path for that zone.' });

      }

      function reportInvalidExceptionMixedGlobAndNonGlob(node) {
        context.report({
          node: node,
          message: 'Restricted path `from` must contain either only glob patterns or none' });

      }

      function reportInvalidExceptionGlob(node) {
        context.report({
          node: node,
          message: 'Restricted path exceptions must be glob patterns when `from` contains glob patterns' });

      }

      function computeMixedGlobAndAbsolutePathValidator() {
        return {
          isPathRestricted: function () {function isPathRestricted() {return true;}return isPathRestricted;}(),
          hasValidExceptions: false,
          reportInvalidException: reportInvalidExceptionMixedGlobAndNonGlob };

      }

      function computeGlobPatternPathValidator(absoluteFrom, zoneExcept) {
        var isPathException = void 0;

        var mm = new _minimatch.Minimatch(absoluteFrom);
        var isPathRestricted = function () {function isPathRestricted(absoluteImportPath) {return mm.match(absoluteImportPath);}return isPathRestricted;}();
        var hasValidExceptions = zoneExcept.every(_isGlob2['default']);

        if (hasValidExceptions) {
          var exceptionsMm = zoneExcept.map(function (except) {return new _minimatch.Minimatch(except);});
          isPathException = function () {function isPathException(absoluteImportPath) {return exceptionsMm.some(function (mm) {return mm.match(absoluteImportPath);});}return isPathException;}();
        }

        var reportInvalidException = reportInvalidExceptionGlob;

        return {
          isPathRestricted: isPathRestricted,
          hasValidExceptions: hasValidExceptions,
          isPathException: isPathException,
          reportInvalidException: reportInvalidException };

      }

      function computeAbsolutePathValidator(absoluteFrom, zoneExcept) {
        var isPathException = void 0;

        var isPathRestricted = function () {function isPathRestricted(absoluteImportPath) {return containsPath(absoluteImportPath, absoluteFrom);}return isPathRestricted;}();

        var absoluteExceptionPaths = zoneExcept.
        map(function (exceptionPath) {return _path2['default'].resolve(absoluteFrom, exceptionPath);});
        var hasValidExceptions = absoluteExceptionPaths.
        every(function (absoluteExceptionPath) {return isValidExceptionPath(absoluteFrom, absoluteExceptionPath);});

        if (hasValidExceptions) {
          isPathException = function () {function isPathException(absoluteImportPath) {return absoluteExceptionPaths.some(
              function (absoluteExceptionPath) {return containsPath(absoluteImportPath, absoluteExceptionPath);});}return isPathException;}();

        }

        var reportInvalidException = reportInvalidExceptionPath;

        return {
          isPathRestricted: isPathRestricted,
          hasValidExceptions: hasValidExceptions,
          isPathException: isPathException,
          reportInvalidException: reportInvalidException };

      }

      function reportInvalidExceptions(validators, node) {
        validators.forEach(function (validator) {return validator.reportInvalidException(node);});
      }

      function reportImportsInRestrictedZone(validators, node, importPath, customMessage) {
        validators.forEach(function () {
          context.report({
            node: node,
            message: 'Unexpected path "{{importPath}}" imported in restricted zone.' + (customMessage ? ' ' + String(customMessage) : ''),
            data: { importPath: importPath } });

        });
      }

      var makePathValidators = function () {function makePathValidators(zoneFrom) {var zoneExcept = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          var allZoneFrom = [].concat(zoneFrom);
          var areGlobPatterns = allZoneFrom.map(_isGlob2['default']);

          if (areBothGlobPatternAndAbsolutePath(areGlobPatterns)) {
            return [computeMixedGlobAndAbsolutePathValidator()];
          }

          var isGlobPattern = areGlobPatterns.every(function (isGlob) {return isGlob;});

          return allZoneFrom.map(function (singleZoneFrom) {
            var absoluteFrom = _path2['default'].resolve(basePath, singleZoneFrom);

            if (isGlobPattern) {
              return computeGlobPatternPathValidator(absoluteFrom, zoneExcept);
            }
            return computeAbsolutePathValidator(absoluteFrom, zoneExcept);
          });
        }return makePathValidators;}();

      var validators = [];

      function checkForRestrictedImportPath(importPath, node) {
        var absoluteImportPath = (0, _resolve2['default'])(importPath, context);

        if (!absoluteImportPath) {
          return;
        }

        matchingZones.forEach(function (zone, index) {
          if (!validators[index]) {
            validators[index] = makePathValidators(zone.from, zone.except);
          }

          var applicableValidatorsForImportPath = validators[index].filter(function (validator) {return validator.isPathRestricted(absoluteImportPath);});

          var validatorsWithInvalidExceptions = applicableValidatorsForImportPath.filter(function (validator) {return !validator.hasValidExceptions;});
          reportInvalidExceptions(validatorsWithInvalidExceptions, node);

          var applicableValidatorsForImportPathExcludingExceptions = applicableValidatorsForImportPath.
          filter(function (validator) {return validator.hasValidExceptions;}).
          filter(function (validator) {return !validator.isPathException(absoluteImportPath);});
          reportImportsInRestrictedZone(applicableValidatorsForImportPathExcludingExceptions, node, importPath, zone.message);
        });
      }

      return (0, _moduleVisitor2['default'])(function (source) {
        checkForRestrictedImportPath(source.value, source);
      }, { commonjs: true });
    }return noRestrictedPaths;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1yZXN0cmljdGVkLXBhdGhzLmpzIl0sIm5hbWVzIjpbImNvbnRhaW5zUGF0aCIsImZpbGVwYXRoIiwidGFyZ2V0IiwicmVsYXRpdmUiLCJwYXRoIiwic3RhcnRzV2l0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwidHlwZSIsImRvY3MiLCJjYXRlZ29yeSIsImRlc2NyaXB0aW9uIiwidXJsIiwic2NoZW1hIiwicHJvcGVydGllcyIsInpvbmVzIiwibWluSXRlbXMiLCJpdGVtcyIsImFueU9mIiwidW5pcXVlSXRlbXMiLCJtaW5MZW5ndGgiLCJmcm9tIiwiZXhjZXB0IiwibWVzc2FnZSIsImFkZGl0aW9uYWxQcm9wZXJ0aWVzIiwiYmFzZVBhdGgiLCJjcmVhdGUiLCJub1Jlc3RyaWN0ZWRQYXRocyIsImNvbnRleHQiLCJvcHRpb25zIiwicmVzdHJpY3RlZFBhdGhzIiwicHJvY2VzcyIsImN3ZCIsImN1cnJlbnRGaWxlbmFtZSIsImdldFBoeXNpY2FsRmlsZW5hbWUiLCJnZXRGaWxlbmFtZSIsIm1hdGNoaW5nWm9uZXMiLCJmaWx0ZXIiLCJ6b25lIiwiY29uY2F0IiwibWFwIiwicmVzb2x2ZSIsInNvbWUiLCJ0YXJnZXRQYXRoIiwiaXNNYXRjaGluZ1RhcmdldFBhdGgiLCJmaWxlbmFtZSIsIm1tIiwiTWluaW1hdGNoIiwibWF0Y2giLCJpc1ZhbGlkRXhjZXB0aW9uUGF0aCIsImFic29sdXRlRnJvbVBhdGgiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGgiLCJyZWxhdGl2ZUV4Y2VwdGlvblBhdGgiLCJhcmVCb3RoR2xvYlBhdHRlcm5BbmRBYnNvbHV0ZVBhdGgiLCJhcmVHbG9iUGF0dGVybnMiLCJpc0dsb2IiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uUGF0aCIsIm5vZGUiLCJyZXBvcnQiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uTWl4ZWRHbG9iQW5kTm9uR2xvYiIsInJlcG9ydEludmFsaWRFeGNlcHRpb25HbG9iIiwiY29tcHV0ZU1peGVkR2xvYkFuZEFic29sdXRlUGF0aFZhbGlkYXRvciIsImlzUGF0aFJlc3RyaWN0ZWQiLCJoYXNWYWxpZEV4Y2VwdGlvbnMiLCJyZXBvcnRJbnZhbGlkRXhjZXB0aW9uIiwiY29tcHV0ZUdsb2JQYXR0ZXJuUGF0aFZhbGlkYXRvciIsImFic29sdXRlRnJvbSIsInpvbmVFeGNlcHQiLCJpc1BhdGhFeGNlcHRpb24iLCJhYnNvbHV0ZUltcG9ydFBhdGgiLCJldmVyeSIsImV4Y2VwdGlvbnNNbSIsImNvbXB1dGVBYnNvbHV0ZVBhdGhWYWxpZGF0b3IiLCJhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzIiwiZXhjZXB0aW9uUGF0aCIsInJlcG9ydEludmFsaWRFeGNlcHRpb25zIiwidmFsaWRhdG9ycyIsImZvckVhY2giLCJ2YWxpZGF0b3IiLCJyZXBvcnRJbXBvcnRzSW5SZXN0cmljdGVkWm9uZSIsImltcG9ydFBhdGgiLCJjdXN0b21NZXNzYWdlIiwiZGF0YSIsIm1ha2VQYXRoVmFsaWRhdG9ycyIsInpvbmVGcm9tIiwiYWxsWm9uZUZyb20iLCJpc0dsb2JQYXR0ZXJuIiwic2luZ2xlWm9uZUZyb20iLCJjaGVja0ZvclJlc3RyaWN0ZWRJbXBvcnRQYXRoIiwiaW5kZXgiLCJhcHBsaWNhYmxlVmFsaWRhdG9yc0ZvckltcG9ydFBhdGgiLCJ2YWxpZGF0b3JzV2l0aEludmFsaWRFeGNlcHRpb25zIiwiYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoRXhjbHVkaW5nRXhjZXB0aW9ucyIsInNvdXJjZSIsInZhbHVlIiwiY29tbW9uanMiXSwibWFwcGluZ3MiOiJhQUFBLDRCOztBQUVBLHNEO0FBQ0Esa0U7QUFDQSxpQztBQUNBO0FBQ0EscUM7QUFDQSxnRDs7QUFFQSxJQUFNQSxlQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsUUFBRCxFQUFXQyxNQUFYLEVBQXNCO0FBQ3pDLE1BQU1DLFdBQVdDLGtCQUFLRCxRQUFMLENBQWNELE1BQWQsRUFBc0JELFFBQXRCLENBQWpCO0FBQ0EsU0FBT0UsYUFBYSxFQUFiLElBQW1CLENBQUNBLFNBQVNFLFVBQVQsQ0FBb0IsSUFBcEIsQ0FBM0I7QUFDRCxDQUhEOztBQUtBQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLFFBQU07QUFDSkMsVUFBTSxTQURGO0FBRUpDLFVBQU07QUFDSkMsZ0JBQVUsaUJBRE47QUFFSkMsbUJBQWEsd0RBRlQ7QUFHSkMsV0FBSywwQkFBUSxxQkFBUixDQUhELEVBRkY7OztBQVFKQyxZQUFRO0FBQ047QUFDRUwsWUFBTSxRQURSO0FBRUVNLGtCQUFZO0FBQ1ZDLGVBQU87QUFDTFAsZ0JBQU0sT0FERDtBQUVMUSxvQkFBVSxDQUZMO0FBR0xDLGlCQUFPO0FBQ0xULGtCQUFNLFFBREQ7QUFFTE0sd0JBQVk7QUFDVmIsc0JBQVE7QUFDTmlCLHVCQUFPO0FBQ0wsa0JBQUVWLE1BQU0sUUFBUixFQURLO0FBRUw7QUFDRUEsd0JBQU0sT0FEUjtBQUVFUyx5QkFBTyxFQUFFVCxNQUFNLFFBQVIsRUFGVDtBQUdFVywrQkFBYSxJQUhmO0FBSUVDLDZCQUFXLENBSmIsRUFGSyxDQURELEVBREU7Ozs7QUFZVkMsb0JBQU07QUFDSkgsdUJBQU87QUFDTCxrQkFBRVYsTUFBTSxRQUFSLEVBREs7QUFFTDtBQUNFQSx3QkFBTSxPQURSO0FBRUVTLHlCQUFPLEVBQUVULE1BQU0sUUFBUixFQUZUO0FBR0VXLCtCQUFhLElBSGY7QUFJRUMsNkJBQVcsQ0FKYixFQUZLLENBREgsRUFaSTs7OztBQXVCVkUsc0JBQVE7QUFDTmQsc0JBQU0sT0FEQTtBQUVOUyx1QkFBTztBQUNMVCx3QkFBTSxRQURELEVBRkQ7O0FBS05XLDZCQUFhLElBTFAsRUF2QkU7O0FBOEJWSSx1QkFBUyxFQUFFZixNQUFNLFFBQVIsRUE5QkMsRUFGUDs7QUFrQ0xnQixrQ0FBc0IsS0FsQ2pCLEVBSEYsRUFERzs7O0FBeUNWQyxrQkFBVSxFQUFFakIsTUFBTSxRQUFSLEVBekNBLEVBRmQ7O0FBNkNFZ0IsNEJBQXNCLEtBN0N4QixFQURNLENBUkosRUFEUzs7Ozs7QUE0RGZFLHVCQUFRLFNBQVNDLGlCQUFULENBQTJCQyxPQUEzQixFQUFvQztBQUMxQyxVQUFNQyxVQUFVRCxRQUFRQyxPQUFSLENBQWdCLENBQWhCLEtBQXNCLEVBQXRDO0FBQ0EsVUFBTUMsa0JBQWtCRCxRQUFRZCxLQUFSLElBQWlCLEVBQXpDO0FBQ0EsVUFBTVUsV0FBV0ksUUFBUUosUUFBUixJQUFvQk0sUUFBUUMsR0FBUixFQUFyQztBQUNBLFVBQU1DLGtCQUFrQkwsUUFBUU0sbUJBQVIsR0FBOEJOLFFBQVFNLG1CQUFSLEVBQTlCLEdBQThETixRQUFRTyxXQUFSLEVBQXRGO0FBQ0EsVUFBTUMsZ0JBQWdCTixnQkFBZ0JPLE1BQWhCLENBQXVCLFVBQUNDLElBQUQsVUFBVSxHQUFHQyxNQUFILENBQVVELEtBQUtyQyxNQUFmO0FBQ3BEdUMsV0FEb0QsQ0FDaEQsVUFBQ3ZDLE1BQUQsVUFBWUUsa0JBQUtzQyxPQUFMLENBQWFoQixRQUFiLEVBQXVCeEIsTUFBdkIsQ0FBWixFQURnRDtBQUVwRHlDLFlBRm9ELENBRS9DLFVBQUNDLFVBQUQsVUFBZ0JDLHFCQUFxQlgsZUFBckIsRUFBc0NVLFVBQXRDLENBQWhCLEVBRitDLENBQVYsRUFBdkIsQ0FBdEI7O0FBSUEsZUFBU0Msb0JBQVQsQ0FBOEJDLFFBQTlCLEVBQXdDRixVQUF4QyxFQUFvRDtBQUNsRCxZQUFJLHlCQUFPQSxVQUFQLENBQUosRUFBd0I7QUFDdEIsY0FBTUcsS0FBSyxJQUFJQyxvQkFBSixDQUFjSixVQUFkLENBQVg7QUFDQSxpQkFBT0csR0FBR0UsS0FBSCxDQUFTSCxRQUFULENBQVA7QUFDRDs7QUFFRCxlQUFPOUMsYUFBYThDLFFBQWIsRUFBdUJGLFVBQXZCLENBQVA7QUFDRDs7QUFFRCxlQUFTTSxvQkFBVCxDQUE4QkMsZ0JBQTlCLEVBQWdEQyxxQkFBaEQsRUFBdUU7QUFDckUsWUFBTUMsd0JBQXdCakQsa0JBQUtELFFBQUwsQ0FBY2dELGdCQUFkLEVBQWdDQyxxQkFBaEMsQ0FBOUI7O0FBRUEsZUFBTyw2QkFBV0MscUJBQVgsRUFBa0N4QixPQUFsQyxNQUErQyxRQUF0RDtBQUNEOztBQUVELGVBQVN5QixpQ0FBVCxDQUEyQ0MsZUFBM0MsRUFBNEQ7QUFDMUQsZUFBT0EsZ0JBQWdCWixJQUFoQixDQUFxQixVQUFDYSxNQUFELFVBQVlBLE1BQVosRUFBckIsS0FBNENELGdCQUFnQlosSUFBaEIsQ0FBcUIsVUFBQ2EsTUFBRCxVQUFZLENBQUNBLE1BQWIsRUFBckIsQ0FBbkQ7QUFDRDs7QUFFRCxlQUFTQywwQkFBVCxDQUFvQ0MsSUFBcEMsRUFBMEM7QUFDeEM3QixnQkFBUThCLE1BQVIsQ0FBZTtBQUNiRCxvQkFEYTtBQUVibEMsbUJBQVMsNkZBRkksRUFBZjs7QUFJRDs7QUFFRCxlQUFTb0MseUNBQVQsQ0FBbURGLElBQW5ELEVBQXlEO0FBQ3ZEN0IsZ0JBQVE4QixNQUFSLENBQWU7QUFDYkQsb0JBRGE7QUFFYmxDLG1CQUFTLHVFQUZJLEVBQWY7O0FBSUQ7O0FBRUQsZUFBU3FDLDBCQUFULENBQW9DSCxJQUFwQyxFQUEwQztBQUN4QzdCLGdCQUFROEIsTUFBUixDQUFlO0FBQ2JELG9CQURhO0FBRWJsQyxtQkFBUyxxRkFGSSxFQUFmOztBQUlEOztBQUVELGVBQVNzQyx3Q0FBVCxHQUFvRDtBQUNsRCxlQUFPO0FBQ0xDLHlDQUFrQixvQ0FBTSxJQUFOLEVBQWxCLDJCQURLO0FBRUxDLDhCQUFvQixLQUZmO0FBR0xDLGtDQUF3QkwseUNBSG5CLEVBQVA7O0FBS0Q7O0FBRUQsZUFBU00sK0JBQVQsQ0FBeUNDLFlBQXpDLEVBQXVEQyxVQUF2RCxFQUFtRTtBQUNqRSxZQUFJQyx3QkFBSjs7QUFFQSxZQUFNdEIsS0FBSyxJQUFJQyxvQkFBSixDQUFjbUIsWUFBZCxDQUFYO0FBQ0EsWUFBTUosZ0NBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBQ08sa0JBQUQsVUFBd0J2QixHQUFHRSxLQUFILENBQVNxQixrQkFBVCxDQUF4QixFQUFuQiwyQkFBTjtBQUNBLFlBQU1OLHFCQUFxQkksV0FBV0csS0FBWCxDQUFpQmYsbUJBQWpCLENBQTNCOztBQUVBLFlBQUlRLGtCQUFKLEVBQXdCO0FBQ3RCLGNBQU1RLGVBQWVKLFdBQVczQixHQUFYLENBQWUsVUFBQ2xCLE1BQUQsVUFBWSxJQUFJeUIsb0JBQUosQ0FBY3pCLE1BQWQsQ0FBWixFQUFmLENBQXJCO0FBQ0E4Qyx5Q0FBa0IseUJBQUNDLGtCQUFELFVBQXdCRSxhQUFhN0IsSUFBYixDQUFrQixVQUFDSSxFQUFELFVBQVFBLEdBQUdFLEtBQUgsQ0FBU3FCLGtCQUFULENBQVIsRUFBbEIsQ0FBeEIsRUFBbEI7QUFDRDs7QUFFRCxZQUFNTCx5QkFBeUJKLDBCQUEvQjs7QUFFQSxlQUFPO0FBQ0xFLDRDQURLO0FBRUxDLGdEQUZLO0FBR0xLLDBDQUhLO0FBSUxKLHdEQUpLLEVBQVA7O0FBTUQ7O0FBRUQsZUFBU1EsNEJBQVQsQ0FBc0NOLFlBQXRDLEVBQW9EQyxVQUFwRCxFQUFnRTtBQUM5RCxZQUFJQyx3QkFBSjs7QUFFQSxZQUFNTixnQ0FBbUIsU0FBbkJBLGdCQUFtQixDQUFDTyxrQkFBRCxVQUF3QnRFLGFBQWFzRSxrQkFBYixFQUFpQ0gsWUFBakMsQ0FBeEIsRUFBbkIsMkJBQU47O0FBRUEsWUFBTU8seUJBQXlCTjtBQUM1QjNCLFdBRDRCLENBQ3hCLFVBQUNrQyxhQUFELFVBQW1CdkUsa0JBQUtzQyxPQUFMLENBQWF5QixZQUFiLEVBQTJCUSxhQUEzQixDQUFuQixFQUR3QixDQUEvQjtBQUVBLFlBQU1YLHFCQUFxQlU7QUFDeEJILGFBRHdCLENBQ2xCLFVBQUNuQixxQkFBRCxVQUEyQkYscUJBQXFCaUIsWUFBckIsRUFBbUNmLHFCQUFuQyxDQUEzQixFQURrQixDQUEzQjs7QUFHQSxZQUFJWSxrQkFBSixFQUF3QjtBQUN0QksseUNBQWtCLHlCQUFDQyxrQkFBRCxVQUF3QkksdUJBQXVCL0IsSUFBdkI7QUFDeEMsd0JBQUNTLHFCQUFELFVBQTJCcEQsYUFBYXNFLGtCQUFiLEVBQWlDbEIscUJBQWpDLENBQTNCLEVBRHdDLENBQXhCLEVBQWxCOztBQUdEOztBQUVELFlBQU1hLHlCQUF5QlIsMEJBQS9COztBQUVBLGVBQU87QUFDTE0sNENBREs7QUFFTEMsZ0RBRks7QUFHTEssMENBSEs7QUFJTEosd0RBSkssRUFBUDs7QUFNRDs7QUFFRCxlQUFTVyx1QkFBVCxDQUFpQ0MsVUFBakMsRUFBNkNuQixJQUE3QyxFQUFtRDtBQUNqRG1CLG1CQUFXQyxPQUFYLENBQW1CLFVBQUNDLFNBQUQsVUFBZUEsVUFBVWQsc0JBQVYsQ0FBaUNQLElBQWpDLENBQWYsRUFBbkI7QUFDRDs7QUFFRCxlQUFTc0IsNkJBQVQsQ0FBdUNILFVBQXZDLEVBQW1EbkIsSUFBbkQsRUFBeUR1QixVQUF6RCxFQUFxRUMsYUFBckUsRUFBb0Y7QUFDbEZMLG1CQUFXQyxPQUFYLENBQW1CLFlBQU07QUFDdkJqRCxrQkFBUThCLE1BQVIsQ0FBZTtBQUNiRCxzQkFEYTtBQUVibEMsd0ZBQXlFMEQsNkJBQW9CQSxhQUFwQixJQUFzQyxFQUEvRyxDQUZhO0FBR2JDLGtCQUFNLEVBQUVGLHNCQUFGLEVBSE8sRUFBZjs7QUFLRCxTQU5EO0FBT0Q7O0FBRUQsVUFBTUcsa0NBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsUUFBRCxFQUErQixLQUFwQmpCLFVBQW9CLHVFQUFQLEVBQU87QUFDeEQsY0FBTWtCLGNBQWMsR0FBRzlDLE1BQUgsQ0FBVTZDLFFBQVYsQ0FBcEI7QUFDQSxjQUFNOUIsa0JBQWtCK0IsWUFBWTdDLEdBQVosQ0FBZ0JlLG1CQUFoQixDQUF4Qjs7QUFFQSxjQUFJRixrQ0FBa0NDLGVBQWxDLENBQUosRUFBd0Q7QUFDdEQsbUJBQU8sQ0FBQ08sMENBQUQsQ0FBUDtBQUNEOztBQUVELGNBQU15QixnQkFBZ0JoQyxnQkFBZ0JnQixLQUFoQixDQUFzQixVQUFDZixNQUFELFVBQVlBLE1BQVosRUFBdEIsQ0FBdEI7O0FBRUEsaUJBQU84QixZQUFZN0MsR0FBWixDQUFnQixVQUFDK0MsY0FBRCxFQUFvQjtBQUN6QyxnQkFBTXJCLGVBQWUvRCxrQkFBS3NDLE9BQUwsQ0FBYWhCLFFBQWIsRUFBdUI4RCxjQUF2QixDQUFyQjs7QUFFQSxnQkFBSUQsYUFBSixFQUFtQjtBQUNqQixxQkFBT3JCLGdDQUFnQ0MsWUFBaEMsRUFBOENDLFVBQTlDLENBQVA7QUFDRDtBQUNELG1CQUFPSyw2QkFBNkJOLFlBQTdCLEVBQTJDQyxVQUEzQyxDQUFQO0FBQ0QsV0FQTSxDQUFQO0FBUUQsU0FsQkssNkJBQU47O0FBb0JBLFVBQU1TLGFBQWEsRUFBbkI7O0FBRUEsZUFBU1ksNEJBQVQsQ0FBc0NSLFVBQXRDLEVBQWtEdkIsSUFBbEQsRUFBd0Q7QUFDdEQsWUFBTVkscUJBQXFCLDBCQUFRVyxVQUFSLEVBQW9CcEQsT0FBcEIsQ0FBM0I7O0FBRUEsWUFBSSxDQUFDeUMsa0JBQUwsRUFBeUI7QUFDdkI7QUFDRDs7QUFFRGpDLHNCQUFjeUMsT0FBZCxDQUFzQixVQUFDdkMsSUFBRCxFQUFPbUQsS0FBUCxFQUFpQjtBQUNyQyxjQUFJLENBQUNiLFdBQVdhLEtBQVgsQ0FBTCxFQUF3QjtBQUN0QmIsdUJBQVdhLEtBQVgsSUFBb0JOLG1CQUFtQjdDLEtBQUtqQixJQUF4QixFQUE4QmlCLEtBQUtoQixNQUFuQyxDQUFwQjtBQUNEOztBQUVELGNBQU1vRSxvQ0FBb0NkLFdBQVdhLEtBQVgsRUFBa0JwRCxNQUFsQixDQUF5QixVQUFDeUMsU0FBRCxVQUFlQSxVQUFVaEIsZ0JBQVYsQ0FBMkJPLGtCQUEzQixDQUFmLEVBQXpCLENBQTFDOztBQUVBLGNBQU1zQixrQ0FBa0NELGtDQUFrQ3JELE1BQWxDLENBQXlDLFVBQUN5QyxTQUFELFVBQWUsQ0FBQ0EsVUFBVWYsa0JBQTFCLEVBQXpDLENBQXhDO0FBQ0FZLGtDQUF3QmdCLCtCQUF4QixFQUF5RGxDLElBQXpEOztBQUVBLGNBQU1tQyx1REFBdURGO0FBQzFEckQsZ0JBRDBELENBQ25ELFVBQUN5QyxTQUFELFVBQWVBLFVBQVVmLGtCQUF6QixFQURtRDtBQUUxRDFCLGdCQUYwRCxDQUVuRCxVQUFDeUMsU0FBRCxVQUFlLENBQUNBLFVBQVVWLGVBQVYsQ0FBMEJDLGtCQUExQixDQUFoQixFQUZtRCxDQUE3RDtBQUdBVSx3Q0FBOEJhLG9EQUE5QixFQUFvRm5DLElBQXBGLEVBQTBGdUIsVUFBMUYsRUFBc0cxQyxLQUFLZixPQUEzRztBQUNELFNBZEQ7QUFlRDs7QUFFRCxhQUFPLGdDQUFjLFVBQUNzRSxNQUFELEVBQVk7QUFDL0JMLHFDQUE2QkssT0FBT0MsS0FBcEMsRUFBMkNELE1BQTNDO0FBQ0QsT0FGTSxFQUVKLEVBQUVFLFVBQVUsSUFBWixFQUZJLENBQVA7QUFHRCxLQXhLRCxPQUFpQnBFLGlCQUFqQixJQTVEZSxFQUFqQiIsImZpbGUiOiJuby1yZXN0cmljdGVkLXBhdGhzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCByZXNvbHZlIGZyb20gJ2VzbGludC1tb2R1bGUtdXRpbHMvcmVzb2x2ZSc7XG5pbXBvcnQgbW9kdWxlVmlzaXRvciBmcm9tICdlc2xpbnQtbW9kdWxlLXV0aWxzL21vZHVsZVZpc2l0b3InO1xuaW1wb3J0IGlzR2xvYiBmcm9tICdpcy1nbG9iJztcbmltcG9ydCB7IE1pbmltYXRjaCB9IGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgZG9jc1VybCBmcm9tICcuLi9kb2NzVXJsJztcbmltcG9ydCBpbXBvcnRUeXBlIGZyb20gJy4uL2NvcmUvaW1wb3J0VHlwZSc7XG5cbmNvbnN0IGNvbnRhaW5zUGF0aCA9IChmaWxlcGF0aCwgdGFyZ2V0KSA9PiB7XG4gIGNvbnN0IHJlbGF0aXZlID0gcGF0aC5yZWxhdGl2ZSh0YXJnZXQsIGZpbGVwYXRoKTtcbiAgcmV0dXJuIHJlbGF0aXZlID09PSAnJyB8fCAhcmVsYXRpdmUuc3RhcnRzV2l0aCgnLi4nKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3RhdGljIGFuYWx5c2lzJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5mb3JjZSB3aGljaCBmaWxlcyBjYW4gYmUgaW1wb3J0ZWQgaW4gYSBnaXZlbiBmb2xkZXIuJyxcbiAgICAgIHVybDogZG9jc1VybCgnbm8tcmVzdHJpY3RlZC1wYXRocycpLFxuICAgIH0sXG5cbiAgICBzY2hlbWE6IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICB6b25lczoge1xuICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgIG1pbkl0ZW1zOiAxLFxuICAgICAgICAgICAgaXRlbXM6IHtcbiAgICAgICAgICAgICAgdHlwZTogJ29iamVjdCcsXG4gICAgICAgICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICAgICAgICAgIGFueU9mOiBbXG4gICAgICAgICAgICAgICAgICAgIHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICAgICAgaXRlbXM6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICBtaW5MZW5ndGg6IDEsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnJvbToge1xuICAgICAgICAgICAgICAgICAgYW55T2Y6IFtcbiAgICAgICAgICAgICAgICAgICAgeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICAgICAgICBpdGVtczogeyB0eXBlOiAnc3RyaW5nJyB9LFxuICAgICAgICAgICAgICAgICAgICAgIHVuaXF1ZUl0ZW1zOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgIG1pbkxlbmd0aDogMSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBleGNlcHQ6IHtcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgICAgICAgICBpdGVtczoge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB1bmlxdWVJdGVtczogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IHsgdHlwZTogJ3N0cmluZycgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXM6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGJhc2VQYXRoOiB7IHR5cGU6ICdzdHJpbmcnIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGFkZGl0aW9uYWxQcm9wZXJ0aWVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIG5vUmVzdHJpY3RlZFBhdGhzKGNvbnRleHQpIHtcbiAgICBjb25zdCBvcHRpb25zID0gY29udGV4dC5vcHRpb25zWzBdIHx8IHt9O1xuICAgIGNvbnN0IHJlc3RyaWN0ZWRQYXRocyA9IG9wdGlvbnMuem9uZXMgfHwgW107XG4gICAgY29uc3QgYmFzZVBhdGggPSBvcHRpb25zLmJhc2VQYXRoIHx8IHByb2Nlc3MuY3dkKCk7XG4gICAgY29uc3QgY3VycmVudEZpbGVuYW1lID0gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lID8gY29udGV4dC5nZXRQaHlzaWNhbEZpbGVuYW1lKCkgOiBjb250ZXh0LmdldEZpbGVuYW1lKCk7XG4gICAgY29uc3QgbWF0Y2hpbmdab25lcyA9IHJlc3RyaWN0ZWRQYXRocy5maWx0ZXIoKHpvbmUpID0+IFtdLmNvbmNhdCh6b25lLnRhcmdldClcbiAgICAgIC5tYXAoKHRhcmdldCkgPT4gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCB0YXJnZXQpKVxuICAgICAgLnNvbWUoKHRhcmdldFBhdGgpID0+IGlzTWF0Y2hpbmdUYXJnZXRQYXRoKGN1cnJlbnRGaWxlbmFtZSwgdGFyZ2V0UGF0aCkpKTtcblxuICAgIGZ1bmN0aW9uIGlzTWF0Y2hpbmdUYXJnZXRQYXRoKGZpbGVuYW1lLCB0YXJnZXRQYXRoKSB7XG4gICAgICBpZiAoaXNHbG9iKHRhcmdldFBhdGgpKSB7XG4gICAgICAgIGNvbnN0IG1tID0gbmV3IE1pbmltYXRjaCh0YXJnZXRQYXRoKTtcbiAgICAgICAgcmV0dXJuIG1tLm1hdGNoKGZpbGVuYW1lKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbnRhaW5zUGF0aChmaWxlbmFtZSwgdGFyZ2V0UGF0aCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNWYWxpZEV4Y2VwdGlvblBhdGgoYWJzb2x1dGVGcm9tUGF0aCwgYWJzb2x1dGVFeGNlcHRpb25QYXRoKSB7XG4gICAgICBjb25zdCByZWxhdGl2ZUV4Y2VwdGlvblBhdGggPSBwYXRoLnJlbGF0aXZlKGFic29sdXRlRnJvbVBhdGgsIGFic29sdXRlRXhjZXB0aW9uUGF0aCk7XG5cbiAgICAgIHJldHVybiBpbXBvcnRUeXBlKHJlbGF0aXZlRXhjZXB0aW9uUGF0aCwgY29udGV4dCkgIT09ICdwYXJlbnQnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFyZUJvdGhHbG9iUGF0dGVybkFuZEFic29sdXRlUGF0aChhcmVHbG9iUGF0dGVybnMpIHtcbiAgICAgIHJldHVybiBhcmVHbG9iUGF0dGVybnMuc29tZSgoaXNHbG9iKSA9PiBpc0dsb2IpICYmIGFyZUdsb2JQYXR0ZXJucy5zb21lKChpc0dsb2IpID0+ICFpc0dsb2IpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEludmFsaWRFeGNlcHRpb25QYXRoKG5vZGUpIHtcbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbm9kZSxcbiAgICAgICAgbWVzc2FnZTogJ1Jlc3RyaWN0ZWQgcGF0aCBleGNlcHRpb25zIG11c3QgYmUgZGVzY2VuZGFudHMgb2YgdGhlIGNvbmZpZ3VyZWQgYGZyb21gIHBhdGggZm9yIHRoYXQgem9uZS4nLFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVwb3J0SW52YWxpZEV4Y2VwdGlvbk1peGVkR2xvYkFuZE5vbkdsb2Iobm9kZSkge1xuICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICBub2RlLFxuICAgICAgICBtZXNzYWdlOiAnUmVzdHJpY3RlZCBwYXRoIGBmcm9tYCBtdXN0IGNvbnRhaW4gZWl0aGVyIG9ubHkgZ2xvYiBwYXR0ZXJucyBvciBub25lJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEludmFsaWRFeGNlcHRpb25HbG9iKG5vZGUpIHtcbiAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgbm9kZSxcbiAgICAgICAgbWVzc2FnZTogJ1Jlc3RyaWN0ZWQgcGF0aCBleGNlcHRpb25zIG11c3QgYmUgZ2xvYiBwYXR0ZXJucyB3aGVuIGBmcm9tYCBjb250YWlucyBnbG9iIHBhdHRlcm5zJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNvbXB1dGVNaXhlZEdsb2JBbmRBYnNvbHV0ZVBhdGhWYWxpZGF0b3IoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1BhdGhSZXN0cmljdGVkOiAoKSA9PiB0cnVlLFxuICAgICAgICBoYXNWYWxpZEV4Y2VwdGlvbnM6IGZhbHNlLFxuICAgICAgICByZXBvcnRJbnZhbGlkRXhjZXB0aW9uOiByZXBvcnRJbnZhbGlkRXhjZXB0aW9uTWl4ZWRHbG9iQW5kTm9uR2xvYixcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZUdsb2JQYXR0ZXJuUGF0aFZhbGlkYXRvcihhYnNvbHV0ZUZyb20sIHpvbmVFeGNlcHQpIHtcbiAgICAgIGxldCBpc1BhdGhFeGNlcHRpb247XG5cbiAgICAgIGNvbnN0IG1tID0gbmV3IE1pbmltYXRjaChhYnNvbHV0ZUZyb20pO1xuICAgICAgY29uc3QgaXNQYXRoUmVzdHJpY3RlZCA9IChhYnNvbHV0ZUltcG9ydFBhdGgpID0+IG1tLm1hdGNoKGFic29sdXRlSW1wb3J0UGF0aCk7XG4gICAgICBjb25zdCBoYXNWYWxpZEV4Y2VwdGlvbnMgPSB6b25lRXhjZXB0LmV2ZXJ5KGlzR2xvYik7XG5cbiAgICAgIGlmIChoYXNWYWxpZEV4Y2VwdGlvbnMpIHtcbiAgICAgICAgY29uc3QgZXhjZXB0aW9uc01tID0gem9uZUV4Y2VwdC5tYXAoKGV4Y2VwdCkgPT4gbmV3IE1pbmltYXRjaChleGNlcHQpKTtcbiAgICAgICAgaXNQYXRoRXhjZXB0aW9uID0gKGFic29sdXRlSW1wb3J0UGF0aCkgPT4gZXhjZXB0aW9uc01tLnNvbWUoKG1tKSA9PiBtbS5tYXRjaChhYnNvbHV0ZUltcG9ydFBhdGgpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbiA9IHJlcG9ydEludmFsaWRFeGNlcHRpb25HbG9iO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1BhdGhSZXN0cmljdGVkLFxuICAgICAgICBoYXNWYWxpZEV4Y2VwdGlvbnMsXG4gICAgICAgIGlzUGF0aEV4Y2VwdGlvbixcbiAgICAgICAgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbixcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tcHV0ZUFic29sdXRlUGF0aFZhbGlkYXRvcihhYnNvbHV0ZUZyb20sIHpvbmVFeGNlcHQpIHtcbiAgICAgIGxldCBpc1BhdGhFeGNlcHRpb247XG5cbiAgICAgIGNvbnN0IGlzUGF0aFJlc3RyaWN0ZWQgPSAoYWJzb2x1dGVJbXBvcnRQYXRoKSA9PiBjb250YWluc1BhdGgoYWJzb2x1dGVJbXBvcnRQYXRoLCBhYnNvbHV0ZUZyb20pO1xuXG4gICAgICBjb25zdCBhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzID0gem9uZUV4Y2VwdFxuICAgICAgICAubWFwKChleGNlcHRpb25QYXRoKSA9PiBwYXRoLnJlc29sdmUoYWJzb2x1dGVGcm9tLCBleGNlcHRpb25QYXRoKSk7XG4gICAgICBjb25zdCBoYXNWYWxpZEV4Y2VwdGlvbnMgPSBhYnNvbHV0ZUV4Y2VwdGlvblBhdGhzXG4gICAgICAgIC5ldmVyeSgoYWJzb2x1dGVFeGNlcHRpb25QYXRoKSA9PiBpc1ZhbGlkRXhjZXB0aW9uUGF0aChhYnNvbHV0ZUZyb20sIGFic29sdXRlRXhjZXB0aW9uUGF0aCkpO1xuXG4gICAgICBpZiAoaGFzVmFsaWRFeGNlcHRpb25zKSB7XG4gICAgICAgIGlzUGF0aEV4Y2VwdGlvbiA9IChhYnNvbHV0ZUltcG9ydFBhdGgpID0+IGFic29sdXRlRXhjZXB0aW9uUGF0aHMuc29tZShcbiAgICAgICAgICAoYWJzb2x1dGVFeGNlcHRpb25QYXRoKSA9PiBjb250YWluc1BhdGgoYWJzb2x1dGVJbXBvcnRQYXRoLCBhYnNvbHV0ZUV4Y2VwdGlvblBhdGgpLFxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXBvcnRJbnZhbGlkRXhjZXB0aW9uID0gcmVwb3J0SW52YWxpZEV4Y2VwdGlvblBhdGg7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUGF0aFJlc3RyaWN0ZWQsXG4gICAgICAgIGhhc1ZhbGlkRXhjZXB0aW9ucyxcbiAgICAgICAgaXNQYXRoRXhjZXB0aW9uLFxuICAgICAgICByZXBvcnRJbnZhbGlkRXhjZXB0aW9uLFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXBvcnRJbnZhbGlkRXhjZXB0aW9ucyh2YWxpZGF0b3JzLCBub2RlKSB7XG4gICAgICB2YWxpZGF0b3JzLmZvckVhY2goKHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLnJlcG9ydEludmFsaWRFeGNlcHRpb24obm9kZSkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcG9ydEltcG9ydHNJblJlc3RyaWN0ZWRab25lKHZhbGlkYXRvcnMsIG5vZGUsIGltcG9ydFBhdGgsIGN1c3RvbU1lc3NhZ2UpIHtcbiAgICAgIHZhbGlkYXRvcnMuZm9yRWFjaCgoKSA9PiB7XG4gICAgICAgIGNvbnRleHQucmVwb3J0KHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG1lc3NhZ2U6IGBVbmV4cGVjdGVkIHBhdGggXCJ7e2ltcG9ydFBhdGh9fVwiIGltcG9ydGVkIGluIHJlc3RyaWN0ZWQgem9uZS4ke2N1c3RvbU1lc3NhZ2UgPyBgICR7Y3VzdG9tTWVzc2FnZX1gIDogJyd9YCxcbiAgICAgICAgICBkYXRhOiB7IGltcG9ydFBhdGggfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBtYWtlUGF0aFZhbGlkYXRvcnMgPSAoem9uZUZyb20sIHpvbmVFeGNlcHQgPSBbXSkgPT4ge1xuICAgICAgY29uc3QgYWxsWm9uZUZyb20gPSBbXS5jb25jYXQoem9uZUZyb20pO1xuICAgICAgY29uc3QgYXJlR2xvYlBhdHRlcm5zID0gYWxsWm9uZUZyb20ubWFwKGlzR2xvYik7XG5cbiAgICAgIGlmIChhcmVCb3RoR2xvYlBhdHRlcm5BbmRBYnNvbHV0ZVBhdGgoYXJlR2xvYlBhdHRlcm5zKSkge1xuICAgICAgICByZXR1cm4gW2NvbXB1dGVNaXhlZEdsb2JBbmRBYnNvbHV0ZVBhdGhWYWxpZGF0b3IoKV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlzR2xvYlBhdHRlcm4gPSBhcmVHbG9iUGF0dGVybnMuZXZlcnkoKGlzR2xvYikgPT4gaXNHbG9iKTtcblxuICAgICAgcmV0dXJuIGFsbFpvbmVGcm9tLm1hcCgoc2luZ2xlWm9uZUZyb20pID0+IHtcbiAgICAgICAgY29uc3QgYWJzb2x1dGVGcm9tID0gcGF0aC5yZXNvbHZlKGJhc2VQYXRoLCBzaW5nbGVab25lRnJvbSk7XG5cbiAgICAgICAgaWYgKGlzR2xvYlBhdHRlcm4pIHtcbiAgICAgICAgICByZXR1cm4gY29tcHV0ZUdsb2JQYXR0ZXJuUGF0aFZhbGlkYXRvcihhYnNvbHV0ZUZyb20sIHpvbmVFeGNlcHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb21wdXRlQWJzb2x1dGVQYXRoVmFsaWRhdG9yKGFic29sdXRlRnJvbSwgem9uZUV4Y2VwdCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgdmFsaWRhdG9ycyA9IFtdO1xuXG4gICAgZnVuY3Rpb24gY2hlY2tGb3JSZXN0cmljdGVkSW1wb3J0UGF0aChpbXBvcnRQYXRoLCBub2RlKSB7XG4gICAgICBjb25zdCBhYnNvbHV0ZUltcG9ydFBhdGggPSByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpO1xuXG4gICAgICBpZiAoIWFic29sdXRlSW1wb3J0UGF0aCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIG1hdGNoaW5nWm9uZXMuZm9yRWFjaCgoem9uZSwgaW5kZXgpID0+IHtcbiAgICAgICAgaWYgKCF2YWxpZGF0b3JzW2luZGV4XSkge1xuICAgICAgICAgIHZhbGlkYXRvcnNbaW5kZXhdID0gbWFrZVBhdGhWYWxpZGF0b3JzKHpvbmUuZnJvbSwgem9uZS5leGNlcHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoID0gdmFsaWRhdG9yc1tpbmRleF0uZmlsdGVyKCh2YWxpZGF0b3IpID0+IHZhbGlkYXRvci5pc1BhdGhSZXN0cmljdGVkKGFic29sdXRlSW1wb3J0UGF0aCkpO1xuXG4gICAgICAgIGNvbnN0IHZhbGlkYXRvcnNXaXRoSW52YWxpZEV4Y2VwdGlvbnMgPSBhcHBsaWNhYmxlVmFsaWRhdG9yc0ZvckltcG9ydFBhdGguZmlsdGVyKCh2YWxpZGF0b3IpID0+ICF2YWxpZGF0b3IuaGFzVmFsaWRFeGNlcHRpb25zKTtcbiAgICAgICAgcmVwb3J0SW52YWxpZEV4Y2VwdGlvbnModmFsaWRhdG9yc1dpdGhJbnZhbGlkRXhjZXB0aW9ucywgbm9kZSk7XG5cbiAgICAgICAgY29uc3QgYXBwbGljYWJsZVZhbGlkYXRvcnNGb3JJbXBvcnRQYXRoRXhjbHVkaW5nRXhjZXB0aW9ucyA9IGFwcGxpY2FibGVWYWxpZGF0b3JzRm9ySW1wb3J0UGF0aFxuICAgICAgICAgIC5maWx0ZXIoKHZhbGlkYXRvcikgPT4gdmFsaWRhdG9yLmhhc1ZhbGlkRXhjZXB0aW9ucylcbiAgICAgICAgICAuZmlsdGVyKCh2YWxpZGF0b3IpID0+ICF2YWxpZGF0b3IuaXNQYXRoRXhjZXB0aW9uKGFic29sdXRlSW1wb3J0UGF0aCkpO1xuICAgICAgICByZXBvcnRJbXBvcnRzSW5SZXN0cmljdGVkWm9uZShhcHBsaWNhYmxlVmFsaWRhdG9yc0ZvckltcG9ydFBhdGhFeGNsdWRpbmdFeGNlcHRpb25zLCBub2RlLCBpbXBvcnRQYXRoLCB6b25lLm1lc3NhZ2UpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1vZHVsZVZpc2l0b3IoKHNvdXJjZSkgPT4ge1xuICAgICAgY2hlY2tGb3JSZXN0cmljdGVkSW1wb3J0UGF0aChzb3VyY2UudmFsdWUsIHNvdXJjZSk7XG4gICAgfSwgeyBjb21tb25qczogdHJ1ZSB9KTtcbiAgfSxcbn07XG4iXX0=