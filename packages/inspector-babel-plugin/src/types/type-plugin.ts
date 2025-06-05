import type { PluginPass, types as t } from '@babel/core';

export interface PluginState extends PluginPass {
  /**
   * The current working directory of the project
   *
   * If not provided, the file name is absolute path
   */
  projectCwd?: string;

  /**
   * The identifier of the file name
   * @default path.basename(file.opts.filename)
   */
  fileNameIdentifier: t.Identifier;
}
