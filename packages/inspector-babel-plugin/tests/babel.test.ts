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
  it('should correct support array spread', async () => {
    const filePath = getDirname(import.meta.url, './fixtures/react.tsx');

    const compiledCode = babelCompile(filePath, {
      plugins: [inspectorBabelPlugin],
    })?.code;

    console.log(compiledCode);

    const targetCode = `
      ${TRACE_ID}: {
      fileName: _jsxFileName2,
      lineNumber: 5,
      columnNumber: 11
    },
    `.trim();

    expect(compiledCode?.trim()).toContain(targetCode);
  });
});
