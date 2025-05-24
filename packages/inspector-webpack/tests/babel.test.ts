import { babelCompile, getDirname } from './utils/index.js';

describe(`tests preset babel react`, () => {
  it('should correct support array spread', () => {
    const filePath = getDirname(import.meta.url, './fixtures/react.tsx');
    const compiledCode = babelCompile(filePath)?.code;
    expect(compiledCode?.indexOf(`_toConsumableArray(children).`)).not.toBe(-1);
  });
});
