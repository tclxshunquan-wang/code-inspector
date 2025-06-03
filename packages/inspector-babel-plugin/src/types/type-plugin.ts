import type { PluginPass, types as t } from '@babel/core';

export interface PluginState extends PluginPass {
  /**
   * The current working directory of the project
   * @default process.cwd()
   */
  projectCwd?: string;

  /**
   * Whether the file name is absolute
   * @default false
   */
  isAbsolutePath?: boolean;

  /**
   * The identifier of the file name
   * @default path.basename(file.opts.filename)
   */
  fileNameIdentifier: t.Identifier;
}
