'use strict';var _path = require('path');var _path2 = _interopRequireDefault(_path);

var _resolve = require('eslint-module-utils/resolve');var _resolve2 = _interopRequireDefault(_resolve);
var _importType = require('../core/importType');
var _moduleVisitor = require('eslint-module-utils/moduleVisitor');var _moduleVisitor2 = _interopRequireDefault(_moduleVisitor);
var _docsUrl = require('../docsUrl');var _docsUrl2 = _interopRequireDefault(_docsUrl);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { 'default': obj };}

var enumValues = { 'enum': ['always', 'ignorePackages', 'never'] };
var patternProperties = {
  type: 'object',
  patternProperties: { '.*': enumValues } };

var properties = {
  type: 'object',
  properties: {
    pattern: patternProperties,
    ignorePackages: { type: 'boolean' } } };



function buildProperties(context) {

  var result = {
    defaultConfig: 'never',
    pattern: {},
    ignorePackages: false };


  context.options.forEach(function (obj) {

    // If this is a string, set defaultConfig to its value
    if (typeof obj === 'string') {
      result.defaultConfig = obj;
      return;
    }

    // If this is not the new structure, transfer all props to result.pattern
    if (obj.pattern === undefined && obj.ignorePackages === undefined) {
      Object.assign(result.pattern, obj);
      return;
    }

    // If pattern is provided, transfer all props
    if (obj.pattern !== undefined) {
      Object.assign(result.pattern, obj.pattern);
    }

    // If ignorePackages is provided, transfer it to result
    if (obj.ignorePackages !== undefined) {
      result.ignorePackages = obj.ignorePackages;
    }
  });

  if (result.defaultConfig === 'ignorePackages') {
    result.defaultConfig = 'always';
    result.ignorePackages = true;
  }

  return result;
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      category: 'Style guide',
      description: 'Ensure consistent use of file extension within the import path.',
      url: (0, _docsUrl2['default'])('extensions') },


    schema: {
      anyOf: [
      {
        type: 'array',
        items: [enumValues],
        additionalItems: false },

      {
        type: 'array',
        items: [
        enumValues,
        properties],

        additionalItems: false },

      {
        type: 'array',
        items: [properties],
        additionalItems: false },

      {
        type: 'array',
        items: [patternProperties],
        additionalItems: false },

      {
        type: 'array',
        items: [
        enumValues,
        patternProperties],

        additionalItems: false }] } },





  create: function () {function create(context) {

      var props = buildProperties(context);

      function getModifier(extension) {
        return props.pattern[extension] || props.defaultConfig;
      }

      function isUseOfExtensionRequired(extension, isPackage) {
        return getModifier(extension) === 'always' && (!props.ignorePackages || !isPackage);
      }

      function isUseOfExtensionForbidden(extension) {
        return getModifier(extension) === 'never';
      }

      function isResolvableWithoutExtension(file) {
        var extension = _path2['default'].extname(file);
        var fileWithoutExtension = file.slice(0, -extension.length);
        var resolvedFileWithoutExtension = (0, _resolve2['default'])(fileWithoutExtension, context);

        return resolvedFileWithoutExtension === (0, _resolve2['default'])(file, context);
      }

      function isExternalRootModule(file) {
        var slashCount = file.split('/').length - 1;

        if (slashCount === 0) {return true;}
        if ((0, _importType.isScoped)(file) && slashCount <= 1) {return true;}
        return false;
      }

      function checkFileExtension(source, node) {
        // bail if the declaration doesn't have a source, e.g. "export { foo };", or if it's only partially typed like in an editor
        if (!source || !source.value) {return;}

        var importPathWithQueryString = source.value;

        // don't enforce anything on builtins
        if ((0, _importType.isBuiltIn)(importPathWithQueryString, context.settings)) {return;}

        var importPath = importPathWithQueryString.replace(/\?(.*)$/, '');

        // don't enforce in root external packages as they may have names with `.js`.
        // Like `import Decimal from decimal.js`)
        if (isExternalRootModule(importPath)) {return;}

        var resolvedPath = (0, _resolve2['default'])(importPath, context);

        // get extension from resolved path, if possible.
        // for unresolved, use source value.
        var extension = _path2['default'].extname(resolvedPath || importPath).substring(1);

        // determine if this is a module
        var isPackage = (0, _importType.isExternalModule)(
        importPath,
        (0, _resolve2['default'])(importPath, context),
        context) ||
        (0, _importType.isScoped)(importPath);

        if (!extension || !importPath.endsWith('.' + String(extension))) {
          // ignore type-only imports and exports
          if (node.importKind === 'type' || node.exportKind === 'type') {return;}
          var extensionRequired = isUseOfExtensionRequired(extension, isPackage);
          var extensionForbidden = isUseOfExtensionForbidden(extension);
          if (extensionRequired && !extensionForbidden) {
            context.report({
              node: source,
              message: 'Missing file extension ' + (
              extension ? '"' + String(extension) + '" ' : '') + 'for "' + String(importPathWithQueryString) + '"' });

          }
        } else if (extension) {
          if (isUseOfExtensionForbidden(extension) && isResolvableWithoutExtension(importPath)) {
            context.report({
              node: source,
              message: 'Unexpected use of file extension "' + String(extension) + '" for "' + String(importPathWithQueryString) + '"' });

          }
        }
      }

      return (0, _moduleVisitor2['default'])(checkFileExtension, { commonjs: true });
    }return create;}() };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9leHRlbnNpb25zLmpzIl0sIm5hbWVzIjpbImVudW1WYWx1ZXMiLCJwYXR0ZXJuUHJvcGVydGllcyIsInR5cGUiLCJwcm9wZXJ0aWVzIiwicGF0dGVybiIsImlnbm9yZVBhY2thZ2VzIiwiYnVpbGRQcm9wZXJ0aWVzIiwiY29udGV4dCIsInJlc3VsdCIsImRlZmF1bHRDb25maWciLCJvcHRpb25zIiwiZm9yRWFjaCIsIm9iaiIsInVuZGVmaW5lZCIsIk9iamVjdCIsImFzc2lnbiIsIm1vZHVsZSIsImV4cG9ydHMiLCJtZXRhIiwiZG9jcyIsImNhdGVnb3J5IiwiZGVzY3JpcHRpb24iLCJ1cmwiLCJzY2hlbWEiLCJhbnlPZiIsIml0ZW1zIiwiYWRkaXRpb25hbEl0ZW1zIiwiY3JlYXRlIiwicHJvcHMiLCJnZXRNb2RpZmllciIsImV4dGVuc2lvbiIsImlzVXNlT2ZFeHRlbnNpb25SZXF1aXJlZCIsImlzUGFja2FnZSIsImlzVXNlT2ZFeHRlbnNpb25Gb3JiaWRkZW4iLCJpc1Jlc29sdmFibGVXaXRob3V0RXh0ZW5zaW9uIiwiZmlsZSIsInBhdGgiLCJleHRuYW1lIiwiZmlsZVdpdGhvdXRFeHRlbnNpb24iLCJzbGljZSIsImxlbmd0aCIsInJlc29sdmVkRmlsZVdpdGhvdXRFeHRlbnNpb24iLCJpc0V4dGVybmFsUm9vdE1vZHVsZSIsInNsYXNoQ291bnQiLCJzcGxpdCIsImNoZWNrRmlsZUV4dGVuc2lvbiIsInNvdXJjZSIsIm5vZGUiLCJ2YWx1ZSIsImltcG9ydFBhdGhXaXRoUXVlcnlTdHJpbmciLCJzZXR0aW5ncyIsImltcG9ydFBhdGgiLCJyZXBsYWNlIiwicmVzb2x2ZWRQYXRoIiwic3Vic3RyaW5nIiwiZW5kc1dpdGgiLCJpbXBvcnRLaW5kIiwiZXhwb3J0S2luZCIsImV4dGVuc2lvblJlcXVpcmVkIiwiZXh0ZW5zaW9uRm9yYmlkZGVuIiwicmVwb3J0IiwibWVzc2FnZSIsImNvbW1vbmpzIl0sIm1hcHBpbmdzIjoiYUFB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QVFxRCxNQUFSLENBQWU7QUFDYmIsb0JBQU1ELE1BRE87QUFFYmUscUVBQThDL0IsU0FBOUMsdUJBQWlFbUIseUJBQWpFLE9BRmEsRUFBZjs7QUFJRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxnQ0FBY0osa0JBQWQsRUFBa0MsRUFBRWlCLFVBQVUsSUFBWixFQUFsQyxDQUFQO0FBQ0QsS0FqSWMsbUJBQWpCIiwiZmlsZSI6ImV4dGVuc2lvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCB7IGlzQnVpbHRJbiwgaXNFeHRlcm5hbE1vZHVsZSwgaXNTY29wZWQgfSBmcm9tICcuLi9jb3JlL2ltcG9ydFR5cGUnO1xuaW1wb3J0IG1vZHVsZVZpc2l0b3IgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9tb2R1bGVWaXNpdG9yJztcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnO1xuXG5jb25zdCBlbnVtVmFsdWVzID0geyBlbnVtOiBbICdhbHdheXMnLCAnaWdub3JlUGFja2FnZXMnLCAnbmV2ZXInIF0gfTtcbmNvbnN0IHBhdHRlcm5Qcm9wZXJ0aWVzID0ge1xuICB0eXBlOiAnb2JqZWN0JyxcbiAgcGF0dGVyblByb3BlcnRpZXM6IHsgJy4qJzogZW51bVZhbHVlcyB9LFxufTtcbmNvbnN0IHByb3BlcnRpZXMgPSB7XG4gIHR5cGU6ICdvYmplY3QnLFxuICBwcm9wZXJ0aWVzOiB7XG4gICAgcGF0dGVybjogcGF0dGVyblByb3BlcnRpZXMsXG4gICAgaWdub3JlUGFja2FnZXM6IHsgdHlwZTogJ2Jvb2xlYW4nIH0sXG4gIH0sXG59O1xuXG5mdW5jdGlvbiBidWlsZFByb3BlcnRpZXMoY29udGV4dCkge1xuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICBkZWZhdWx0Q29uZmlnOiAnbmV2ZXInLFxuICAgIHBhdHRlcm46IHt9LFxuICAgIGlnbm9yZVBhY2thZ2VzOiBmYWxzZSxcbiAgfTtcblxuICBjb250ZXh0Lm9wdGlvbnMuZm9yRWFjaCgob2JqKSA9PiB7XG5cbiAgICAvLyBJZiB0aGlzIGlzIGEgc3RyaW5nLCBzZXQgZGVmYXVsdENvbmZpZyB0byBpdHMgdmFsdWVcbiAgICBpZiAodHlwZW9mIG9iaiA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJlc3VsdC5kZWZhdWx0Q29uZmlnID0gb2JqO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIElmIHRoaXMgaXMgbm90IHRoZSBuZXcgc3RydWN0dXJlLCB0cmFuc2ZlciBhbGwgcHJvcHMgdG8gcmVzdWx0LnBhdHRlcm5cbiAgICBpZiAob2JqLnBhdHRlcm4gPT09IHVuZGVmaW5lZCAmJiBvYmouaWdub3JlUGFja2FnZXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHQucGF0dGVybiwgb2JqKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiBwYXR0ZXJuIGlzIHByb3ZpZGVkLCB0cmFuc2ZlciBhbGwgcHJvcHNcbiAgICBpZiAob2JqLnBhdHRlcm4gIT09IHVuZGVmaW5lZCkge1xuICAgICAgT2JqZWN0LmFzc2lnbihyZXN1bHQucGF0dGVybiwgb2JqLnBhdHRlcm4pO1xuICAgIH1cblxuICAgIC8vIElmIGlnbm9yZVBhY2thZ2VzIGlzIHByb3ZpZGVkLCB0cmFuc2ZlciBpdCB0byByZXN1bHRcbiAgICBpZiAob2JqLmlnbm9yZVBhY2thZ2VzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJlc3VsdC5pZ25vcmVQYWNrYWdlcyA9IG9iai5pZ25vcmVQYWNrYWdlcztcbiAgICB9XG4gIH0pO1xuXG4gIGlmIChyZXN1bHQuZGVmYXVsdENvbmZpZyA9PT0gJ2lnbm9yZVBhY2thZ2VzJykge1xuICAgIHJlc3VsdC5kZWZhdWx0Q29uZmlnID0gJ2Fsd2F5cyc7XG4gICAgcmVzdWx0Lmlnbm9yZVBhY2thZ2VzID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3N1Z2dlc3Rpb24nLFxuICAgIGRvY3M6IHtcbiAgICAgIGNhdGVnb3J5OiAnU3R5bGUgZ3VpZGUnLFxuICAgICAgZGVzY3JpcHRpb246ICdFbnN1cmUgY29uc2lzdGVudCB1c2Ugb2YgZmlsZSBleHRlbnNpb24gd2l0aGluIHRoZSBpbXBvcnQgcGF0aC4nLFxuICAgICAgdXJsOiBkb2NzVXJsKCdleHRlbnNpb25zJyksXG4gICAgfSxcblxuICAgIHNjaGVtYToge1xuICAgICAgYW55T2Y6IFtcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdhcnJheScsXG4gICAgICAgICAgaXRlbXM6IFtlbnVtVmFsdWVzXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczogW1xuICAgICAgICAgICAgZW51bVZhbHVlcyxcbiAgICAgICAgICAgIHByb3BlcnRpZXMsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICBpdGVtczogW3Byb3BlcnRpZXNdLFxuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtczogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiBbcGF0dGVyblByb3BlcnRpZXNdLFxuICAgICAgICAgIGFkZGl0aW9uYWxJdGVtczogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgIGl0ZW1zOiBbXG4gICAgICAgICAgICBlbnVtVmFsdWVzLFxuICAgICAgICAgICAgcGF0dGVyblByb3BlcnRpZXMsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBhZGRpdGlvbmFsSXRlbXM6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuXG4gIGNyZWF0ZShjb250ZXh0KSB7XG5cbiAgICBjb25zdCBwcm9wcyA9IGJ1aWxkUHJvcGVydGllcyhjb250ZXh0KTtcblxuICAgIGZ1bmN0aW9uIGdldE1vZGlmaWVyKGV4dGVuc2lvbikge1xuICAgICAgcmV0dXJuIHByb3BzLnBhdHRlcm5bZXh0ZW5zaW9uXSB8fCBwcm9wcy5kZWZhdWx0Q29uZmlnO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzVXNlT2ZFeHRlbnNpb25SZXF1aXJlZChleHRlbnNpb24sIGlzUGFja2FnZSkge1xuICAgICAgcmV0dXJuIGdldE1vZGlmaWVyKGV4dGVuc2lvbikgPT09ICdhbHdheXMnICYmICghcHJvcHMuaWdub3JlUGFja2FnZXMgfHwgIWlzUGFja2FnZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNVc2VPZkV4dGVuc2lvbkZvcmJpZGRlbihleHRlbnNpb24pIHtcbiAgICAgIHJldHVybiBnZXRNb2RpZmllcihleHRlbnNpb24pID09PSAnbmV2ZXInO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzUmVzb2x2YWJsZVdpdGhvdXRFeHRlbnNpb24oZmlsZSkge1xuICAgICAgY29uc3QgZXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGUpO1xuICAgICAgY29uc3QgZmlsZVdpdGhvdXRFeHRlbnNpb24gPSBmaWxlLnNsaWNlKDAsIC1leHRlbnNpb24ubGVuZ3RoKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkRmlsZVdpdGhvdXRFeHRlbnNpb24gPSByZXNvbHZlKGZpbGVXaXRob3V0RXh0ZW5zaW9uLCBjb250ZXh0KTtcblxuICAgICAgcmV0dXJuIHJlc29sdmVkRmlsZVdpdGhvdXRFeHRlbnNpb24gPT09IHJlc29sdmUoZmlsZSwgY29udGV4dCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNFeHRlcm5hbFJvb3RNb2R1bGUoZmlsZSkge1xuICAgICAgY29uc3Qgc2xhc2hDb3VudCA9IGZpbGUuc3BsaXQoJy8nKS5sZW5ndGggLSAxO1xuXG4gICAgICBpZiAoc2xhc2hDb3VudCA9PT0gMCkgIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIGlmIChpc1Njb3BlZChmaWxlKSAmJiBzbGFzaENvdW50IDw9IDEpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0ZpbGVFeHRlbnNpb24oc291cmNlLCBub2RlKSB7XG4gICAgICAvLyBiYWlsIGlmIHRoZSBkZWNsYXJhdGlvbiBkb2Vzbid0IGhhdmUgYSBzb3VyY2UsIGUuZy4gXCJleHBvcnQgeyBmb28gfTtcIiwgb3IgaWYgaXQncyBvbmx5IHBhcnRpYWxseSB0eXBlZCBsaWtlIGluIGFuIGVkaXRvclxuICAgICAgaWYgKCFzb3VyY2UgfHwgIXNvdXJjZS52YWx1ZSkgeyByZXR1cm47IH1cblxuICAgICAgY29uc3QgaW1wb3J0UGF0aFdpdGhRdWVyeVN0cmluZyA9IHNvdXJjZS52YWx1ZTtcblxuICAgICAgLy8gZG9uJ3QgZW5mb3JjZSBhbnl0aGluZyBvbiBidWlsdGluc1xuICAgICAgaWYgKGlzQnVpbHRJbihpbXBvcnRQYXRoV2l0aFF1ZXJ5U3RyaW5nLCBjb250ZXh0LnNldHRpbmdzKSkgeyByZXR1cm47IH1cblxuICAgICAgY29uc3QgaW1wb3J0UGF0aCA9IGltcG9ydFBhdGhXaXRoUXVlcnlTdHJpbmcucmVwbGFjZSgvXFw/KC4qKSQvLCAnJyk7XG5cbiAgICAgIC8vIGRvbid0IGVuZm9yY2UgaW4gcm9vdCBleHRlcm5hbCBwYWNrYWdlcyBhcyB0aGV5IG1heSBoYXZlIG5hbWVzIHdpdGggYC5qc2AuXG4gICAgICAvLyBMaWtlIGBpbXBvcnQgRGVjaW1hbCBmcm9tIGRlY2ltYWwuanNgKVxuICAgICAgaWYgKGlzRXh0ZXJuYWxSb290TW9kdWxlKGltcG9ydFBhdGgpKSB7IHJldHVybjsgfVxuXG4gICAgICBjb25zdCByZXNvbHZlZFBhdGggPSByZXNvbHZlKGltcG9ydFBhdGgsIGNvbnRleHQpO1xuXG4gICAgICAvLyBnZXQgZXh0ZW5zaW9uIGZyb20gcmVzb2x2ZWQgcGF0aCwgaWYgcG9zc2libGUuXG4gICAgICAvLyBmb3IgdW5yZXNvbHZlZCwgdXNlIHNvdXJjZSB2YWx1ZS5cbiAgICAgIGNvbnN0IGV4dGVuc2lvbiA9IHBhdGguZXh0bmFtZShyZXNvbHZlZFBhdGggfHwgaW1wb3J0UGF0aCkuc3Vic3RyaW5nKDEpO1xuXG4gICAgICAvLyBkZXRlcm1pbmUgaWYgdGhpcyBpcyBhIG1vZHVsZVxuICAgICAgY29uc3QgaXNQYWNrYWdlID0gaXNFeHRlcm5hbE1vZHVsZShcbiAgICAgICAgaW1wb3J0UGF0aCxcbiAgICAgICAgcmVzb2x2ZShpbXBvcnRQYXRoLCBjb250ZXh0KSxcbiAgICAgICAgY29udGV4dCxcbiAgICAgICkgfHwgaXNTY29wZWQoaW1wb3J0UGF0aCk7XG5cbiAgICAgIGlmICghZXh0ZW5zaW9uIHx8ICFpbXBvcnRQYXRoLmVuZHNXaXRoKGAuJHtleHRlbnNpb259YCkpIHtcbiAgICAgICAgLy8gaWdub3JlIHR5cGUtb25seSBpbXBvcnRzIGFuZCBleHBvcnRzXG4gICAgICAgIGlmIChub2RlLmltcG9ydEtpbmQgPT09ICd0eXBlJyB8fCBub2RlLmV4cG9ydEtpbmQgPT09ICd0eXBlJykgeyByZXR1cm47IH1cbiAgICAgICAgY29uc3QgZXh0ZW5zaW9uUmVxdWlyZWQgPSBpc1VzZU9mRXh0ZW5zaW9uUmVxdWlyZWQoZXh0ZW5zaW9uLCBpc1BhY2thZ2UpO1xuICAgICAgICBjb25zdCBleHRlbnNpb25Gb3JiaWRkZW4gPSBpc1VzZU9mRXh0ZW5zaW9uRm9yYmlkZGVuKGV4dGVuc2lvbik7XG4gICAgICAgIGlmIChleHRlbnNpb25SZXF1aXJlZCAmJiAhZXh0ZW5zaW9uRm9yYmlkZGVuKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogc291cmNlLFxuICAgICAgICAgICAgbWVzc2FnZTpcbiAgICAgICAgICAgICAgYE1pc3NpbmcgZmlsZSBleHRlbnNpb24gJHtleHRlbnNpb24gPyBgXCIke2V4dGVuc2lvbn1cIiBgIDogJyd9Zm9yIFwiJHtpbXBvcnRQYXRoV2l0aFF1ZXJ5U3RyaW5nfVwiYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChleHRlbnNpb24pIHtcbiAgICAgICAgaWYgKGlzVXNlT2ZFeHRlbnNpb25Gb3JiaWRkZW4oZXh0ZW5zaW9uKSAmJiBpc1Jlc29sdmFibGVXaXRob3V0RXh0ZW5zaW9uKGltcG9ydFBhdGgpKSB7XG4gICAgICAgICAgY29udGV4dC5yZXBvcnQoe1xuICAgICAgICAgICAgbm9kZTogc291cmNlLFxuICAgICAgICAgICAgbWVzc2FnZTogYFVuZXhwZWN0ZWQgdXNlIG9mIGZpbGUgZXh0ZW5zaW9uIFwiJHtleHRlbnNpb259XCIgZm9yIFwiJHtpbXBvcnRQYXRoV2l0aFF1ZXJ5U3RyaW5nfVwiYCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtb2R1bGVWaXNpdG9yKGNoZWNrRmlsZUV4dGVuc2lvbiwgeyBjb21tb25qczogdHJ1ZSB9KTtcbiAgfSxcbn07XG4iXX0=