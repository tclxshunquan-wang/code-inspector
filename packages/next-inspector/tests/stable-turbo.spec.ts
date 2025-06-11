import { resolveInspectorConfigPath } from '../src/plugin/transform-next-config.js';

describe('hasStableTurboConfig', () => {
  test('should be true', () => {
    const result = resolveInspectorConfigPath({
      inspectorEndpoint: './next-inspector.config.js',
      projectCwd: process.cwd(),
    });
    expect(result).toBe(true);
  });
});
