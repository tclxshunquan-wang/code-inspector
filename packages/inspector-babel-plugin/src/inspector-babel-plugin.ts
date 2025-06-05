import { relative } from 'path/posix';
import { types as t } from '@babel/core';
import { declare } from '@babel/helper-plugin-utils';
import { TRACE_SOURCE } from '@hyperse/inspector-common';
import { PLUGIN_NAME } from './constant.js';
import type { PluginState } from './types/type-plugin.js';

const isSourceAttr = (attr: t.Node) =>
  t.isJSXAttribute(attr) && attr.name.name === TRACE_SOURCE;

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
 * var __jsxFileName = 'project/file.js';
 * <sometag data-hps-source="project/file.js:10:1:sometag"/>
 */
export default declare<PluginState>((_, options) => {
  const { projectCwd } = options;

  return {
    name: PLUGIN_NAME,
    visitor: {
      JSXOpeningElement(path, state) {
        const { node } = path;
        if (
          // the element was generated and doesn't have location information
          !node.loc ||
          // Already has data-hps-source
          path.node.attributes.some(isSourceAttr)
        ) {
          return;
        }

        const { line, column } = node.loc.start;
        const lineNumber = line;
        const columnNumber = column + 1;
        let fileName = state.filename;

        if (fileName && projectCwd) {
          fileName = relative(projectCwd, fileName);
        }

        node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier(TRACE_SOURCE),
            t.jsxExpressionContainer(
              t.stringLiteral(
                `${fileName}:${lineNumber}:${columnNumber}:${
                  (node.name as t.JSXIdentifier).name
                }`
              )
            )
          )
        );
      },
    },
  };
});
