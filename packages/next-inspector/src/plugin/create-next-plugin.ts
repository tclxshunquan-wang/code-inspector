import type { NextConfig } from 'next';
import type { PluginOptions } from '../types/type-plugin-options.js';
import { transformNextConfig } from './transform-next-config.js';

export default function createNextIntlPlugin(
  pluginOptions: PluginOptions = {}
) {
  const config = pluginOptions;
  return function withNextInspector(nextConfig?: NextConfig) {
    return transformNextConfig(config, nextConfig);
  };
}
