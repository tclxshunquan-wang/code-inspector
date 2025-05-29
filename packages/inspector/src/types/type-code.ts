export interface CodeInfo {
  lineNumber: string;
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

/**
 * props that injected into react nodes
 *
 * like <div __hpssource={{fileName: /usr/workspace/inspector-demo/src/index.js, lineNumber: 10, columnNumber: 1}}/>
 * this props will be record in fiber
 */
export interface CodeDataAttribute {
  fileName: string;
  lineNumber: number;
  columnNumber?: number;
}
