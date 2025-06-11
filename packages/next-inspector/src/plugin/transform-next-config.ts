import type { NextConfig } from 'next';
import { dirname } from 'path';
import path, { resolve } from 'path/posix';
import { fileURLToPath } from 'url';
import type { PluginOptions } from '../types/type-plugin-options.js';

export const resolveInspectorConfigPath = (
  pluginOptions: PluginOptions,
  cwd?: string
) => {
  const dirm = resolve(import.meta.dirname, './config-cache.ts');
  console.log(dirm);
  return dirm;
};

export const transformNextConfig = (
  pluginOptions: PluginOptions,
  nextConfig?: NextConfig
): NextConfig => {
  const useTurbo = process.env.TURBOPACK != null;
  const nextInspectorConfig: Partial<NextConfig> = {};

  if (useTurbo) {
    const resolveAlias = {
      // Turbo aliases don't work with absolute
      // paths (see error handling above)
      'next-inspector/config': resolveInspectorConfigPath(pluginOptions),
    };
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    if (nextConfig?.experimental?.turbo) {
      console.warn(
        'Next.js 15.3.0 introduces a stable Turbo configuration. Please remove the `experimental.turbo` configuration from your `next.config.js` file.'
      );
      return nextConfig;
    }
    nextInspectorConfig.turbopack = {
      ...nextConfig?.turbopack,
      resolveAlias: {
        ...nextConfig?.turbopack?.resolveAlias,
        ...resolveAlias,
      },
    };
  } else {
    nextInspectorConfig.webpack = function webpack(
      ...[config, options]: Parameters<NonNullable<NextConfig['webpack']>>
    ) {
      // Webpack requires absolute paths
      config.resolve.alias['next-inspector/config'] = path.resolve(
        config.context,
        resolveInspectorConfigPath(pluginOptions, config.context)
      );
      if (typeof nextConfig?.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }
      return config;
    };
  }

  return Object.assign({}, nextConfig, nextInspectorConfig);
};
