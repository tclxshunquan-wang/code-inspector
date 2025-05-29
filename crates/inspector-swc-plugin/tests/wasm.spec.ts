import fs from 'node:fs/promises';
import path, { resolve } from 'node:path';
import url, { fileURLToPath } from 'node:url';
import { test } from 'vitest';
import { transform } from '@swc/core';

const pluginName = 'inspector_swc_plugin.wasm';
const pluginPath = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  '..',
  'dist',
  pluginName
);
const fileName = resolve(
  fileURLToPath(import.meta.url),
  '..',
  'fixtures',
  'react.tsx'
);

const transformCode = async (code: string) => {
  return transform(code, {
    sourceMaps: true,
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          pragma: 'React.createElement',
          pragmaFrag: 'React.Fragment',
          throwIfNamespace: true,
          development: false,
          useBuiltins: true,
        },
      },
      target: 'es2018',
      experimental: {
        plugins: [[pluginPath, {}]],
      },
    },
    filename: fileName,
  });
};

describe('wasm', () => {
  test('Should load inspector wasm plugin correctly', async () => {
    const input = await fs.readFile(
      new URL('./fixtures/react.tsx', import.meta.url),
      'utf-8'
    );
    const { code } = await transformCode(input);

    // Verify that the transformation was successful
    expect(code).toBeDefined();
    expect(code).toContain('__inspectorsource');
    expect(code).toContain('fileName');
    expect(code).toContain('lineNumber');
    expect(code).toContain('columnNumber');
    expect(code).toContain(`"${fileName}"`);
  });
});
