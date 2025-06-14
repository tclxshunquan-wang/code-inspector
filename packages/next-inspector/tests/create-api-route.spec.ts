import { existsSync, mkdirSync, readFileSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createApiRoute } from '../src/api/create-api-route.js';

describe('createApiRoute', () => {
  const projectCwd = join(
    fileURLToPath(dirname(import.meta.url)),
    'fixtures/routes'
  );

  beforeEach(() => {
    if (existsSync(projectCwd)) {
      rmSync(projectCwd, {
        recursive: true,
      });
    }
  });

  it('should create api route', () => {
    const pluginOptions = {
      customLaunchEditorEndpoint: '/hps_inspector_01',
      projectCwd: projectCwd,
    };
    const consoleFn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    createApiRoute(pluginOptions);
    expect(consoleFn).toHaveBeenCalledWith(
      `[hps-next-inspector]: work directory not found, please create it manually`
    );
    consoleFn.mockRestore();
  });

  it('should create api route: routes/src/app', () => {
    const workDir = join(projectCwd, 'src/app');
    mkdirSync(workDir, { recursive: true });
    const pluginOptions = {
      customLaunchEditorEndpoint: '/hps_inspector_02',
      projectCwd: projectCwd,
    };
    const result = createApiRoute(pluginOptions);
    const targetFile = join(workDir, '/hps_inspector_02/route.ts');
    expect(result).toBe(targetFile);
    const routeContent = readFileSync(targetFile, 'utf-8');
    expect(routeContent).toContain(
      `export * from '@hyperse/next-inspector/api';`
    );
  });

  it('should create api route: routes/app', () => {
    const workDir = join(projectCwd, 'app');
    mkdirSync(workDir, { recursive: true });
    const pluginOptions = {
      customLaunchEditorEndpoint: 'hps_inspector_03',
      projectCwd: projectCwd,
    };
    const result = createApiRoute(pluginOptions);
    const targetFile = join(workDir, 'hps_inspector_03/route.ts');
    expect(result).toBe(targetFile);
    const routeContent = readFileSync(targetFile, 'utf-8');
    expect(routeContent).toContain(
      `export * from '@hyperse/next-inspector/api';`
    );
  });
});
