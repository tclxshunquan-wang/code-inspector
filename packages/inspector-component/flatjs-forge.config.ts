import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@flatjs/forge';
import { forgePluginStyling } from '@flatjs/forge-plugin-styling';
const __filename = fileURLToPath(import.meta.url);

const stylingPlugin = await forgePluginStyling({
  projectCwd: dirname(__filename),
  format: 'esm',
  use: ['less'],
  postcssOptions: {
    plugins: [],
  },
});

export default defineConfig({
  input: ['src/index.ts'],
  dts: {
    compilationOptions: {
      followSymlinks: false,
      preferredConfigPath: 'tsconfig.build.json',
    },
    entryPointOptions: {
      libraries: {
        importedLibraries: ['react'],
      },
    },
    dtsFilter: (dtsFile) =>
      dtsFile.split('/').length <= 2 && /index.d.ts/.test(dtsFile),
  },
  modularImports: [],
  plugin: {
    extraPlugins: [stylingPlugin],
    pluginConfigs: {
      babelOptions: {
        usePreset: 'react',
        plugins: [],
      },
    },
  },
  output: {
    format: 'esm',
    sourcemap: true,
  },
});
