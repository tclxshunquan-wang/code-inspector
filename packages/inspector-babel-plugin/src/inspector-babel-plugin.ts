import { types as t } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { TRACE_ID } from '@hyperse/inspector-common';
import { FILE_NAME_VAR, PLUGIN_NAME } from './constant.js';
import { formatTrace } from './helpers/format-trace.js';
import type { PluginState } from './types/type-plugin.js';

/**
 * This adds {fileName, lineNumber, columnNumber} annotations to JSX tags.
 *
 * NOTE: lineNumber and columnNumber are both 1-based.
 *
 * == JSX Literals ==
 *
 * <sometag />
 *
 * becomes:
 *
 * var __jsxFileName = 'this/file.js';
 * <sometag __hps_source={{fileName: __jsxFileName, lineNumber: 10, columnNumber: 1}}/>
 */
export default declare<PluginState>(() => {
  const isSourceAttr = (attr: t.Node) =>
    t.isJSXAttribute(attr) && attr.name.name === TRACE_ID;

  return {
    name: PLUGIN_NAME,
    visitor: {
      JSXOpeningElement(path, state) {
        const { node } = path;
        if (
          // the element was generated and doesn't have location information
          !node.loc ||
          // Already has __source
          path.node.attributes.some(isSourceAttr)
        ) {
          return;
        }

        if (!state.fileNameIdentifier) {
          const fileNameId = path.scope.generateUidIdentifier(FILE_NAME_VAR);
          state.fileNameIdentifier = fileNameId;

          path.scope.getProgramParent().push({
            id: fileNameId,
            init: t.stringLiteral(state.filename || ''),
          });
        }

        const attributeName = t.jsxIdentifier(TRACE_ID);

        const attributeValue = t.jsxExpressionContainer(
          formatTrace(
            t.cloneNode<t.Identifier>(state.fileNameIdentifier as t.Identifier),
            node.loc.start
          )
        );

        node.attributes.push(t.jsxAttribute(attributeName, attributeValue));
      },
    },
  };
});
