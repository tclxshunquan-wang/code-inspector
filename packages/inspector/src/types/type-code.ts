export interface CodeInfo {
  /**
   * code source file line number
   */
  lineNumber: string;
  /**
   * code source file column number
   */
  columnNumber: string;
  /**
   * code source file relative path to dev-server cwd(current working directory)
   * need use with custom babel plugin
   */
  relativePath?: string;
  /**
   * code source file absolute path
   * just need use with `@hyperse/inspector-babel-plugin` which auto set by most framework
   */
  absolutePath?: string;
}
