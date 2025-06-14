import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { isDev } from '../helpers/helper-is-dev.js';
import type { PluginOptions } from '../types/type-plugin-options.js';

const withWorkDir = (projectCwd: string) => {
  return [`${projectCwd}/src/app`, `${projectCwd}/app`];
};

export const createApiRoute = (pluginOptions: PluginOptions) => {
  if (!isDev()) {
    return;
  }

  const apiFileTemplate = `/**
 * This file is used to create the api file for the next-inspector plugin.
 *
 * Ensure the api path is \`pluginOptions.customLaunchEditorEndpoint\`.
 */
export * from '@hyperse/next-inspector/api';
`;

  const { customLaunchEditorEndpoint, projectCwd = process.cwd() } =
    pluginOptions;

  const workDirs = withWorkDir(projectCwd);

  const existWorkDir = workDirs.find((workDir) => {
    return existsSync(workDir);
  });

  if (!existWorkDir) {
    console.warn(
      `[hps-next-inspector]: work directory not found, please create it manually`
    );
    return;
  }

  const apiFileDir = `${existWorkDir}/${customLaunchEditorEndpoint}`.replace(
    /\/\//g,
    '/'
  );
  const apiFile = join(apiFileDir, 'route.ts');

  if (existsSync(apiFile)) {
    return;
  }

  mkdirSync(apiFileDir, { recursive: true });

  writeFileSync(apiFile, apiFileTemplate, { encoding: 'utf-8' });

  return apiFile;
};
