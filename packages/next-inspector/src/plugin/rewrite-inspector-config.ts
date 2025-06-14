import { existsSync, writeFileSync } from 'fs';
import { relative, resolve } from 'path/posix';
import { isDev } from '../helpers/helper-is-dev.js';
import type { PluginOptions } from '../types/type-plugin-options.js';

export const rewriteInspectorConfig = (
  pluginOptions: PluginOptions,
  cwd: string = process.cwd()
) => {
  if (!isDev()) {
    return;
  }
  const configFilePath = resolve(
    import.meta.dirname,
    './plugin-inspector-config.js'
  );
  if (!existsSync(configFilePath)) {
    throw new Error(`Could not find inspector config at ${configFilePath}.`);
  }
  writeFileSync(
    configFilePath,
    `export const nextInspectorConfig = ${JSON.stringify(pluginOptions)}`,
    'utf-8'
  );

  return relative(cwd, configFilePath);
};
