import { join, relative } from 'path/posix';
import { TRACE_ID } from '@hyperse/inspector-common';
import inspectorBabelPlugin from '../src/index.js';
import { babelCompile, getDirname } from './utils/index.js';

describe(`tests preset babel react`, () => {
  it('should correct support array spread', () => {
    const filePath = getDirname(import.meta.url, './fixtures/react.tsx');
    const compiledCode = babelCompile(filePath)?.code;
    expect(compiledCode?.indexOf(`_toConsumableArray(children).`)).not.toBe(-1);
  });
});

describe(`tests preset babel react, inject inspector source`, () => {
  const projectCwd = getDirname(import.meta.url, 'fixtures');
  it('should correct support array spread', async () => {
    const filePath = join(projectCwd, './react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [
        [
          inspectorBabelPlugin,
          {
            projectCwd: projectCwd,
          },
        ],
      ],
    })?.code;

    const targetCode = `
      ${TRACE_ID}: {
      fileName: _jsxFileName2,
      lineNumber: 5,
      columnNumber: 11
    },
    `.trim();
    expect(compiledCode?.trim()).toContain(targetCode);
    expect(compiledCode).toContain(
      `_jsxFileName2 = "${relative(projectCwd, filePath)}"`
    );
  });

  it('should correct support array spread with relative file name. projectCwd is default', async () => {
    const filePath = join(projectCwd, './react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [
        [
          inspectorBabelPlugin,
          {
            projectCwd: process.cwd(),
          },
        ],
      ],
    })?.code;

    expect(compiledCode).toContain(
      `_jsxFileName2 = "${relative(process.cwd(), filePath)}"`
    );
  });

  it('should correct support array spread with absolute file name', async () => {
    const filePath = join(projectCwd, './react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [[inspectorBabelPlugin, { isAbsolutePath: true }]],
    })?.code;

    expect(compiledCode).toContain(`_jsxFileName2 = "${filePath}"`);
  });
});
