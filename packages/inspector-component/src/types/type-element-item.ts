export type ElementInfoGenerator<Item extends ElementItem = ElementItem> =
  Generator<Item, void, void>;
export type ElementInfoGeneratorGetter<Item extends ElementItem = ElementItem> =
  () => Generator<Item, void, void>;

export interface ElementItem {
  title: string;
  subtitle?: string;
  tags?: TagItem[];
  codeInfo?: CodeInfo;
}

export type TagItem = string | TagObject;

export interface TagObject {
  label: string;
  /**
   * @default `var(--color-text-1)`
   */
  textColor?: string;
  /**
   * @default `var(--color-tag-lightblue-1)`
   *
   * > supported tag colors:
   * > red / pink / orange / amber / yellow / lime / green / lightblue / cyan / blue / indigo / violet / purple / gray
   */
  background?: string;
}

interface CodeInfo {
  lineNumber: string;
  columnNumber: string;
  /**
   * code source file relative path to dev-server cwd(current working directory)
   * need use with `@hyperse/inspector-babel-plugin`
   */
  relativePath?: string;
  /**
   * code source file absolute path
   * just need use with `@babel/plugin-transform-react-jsx-source` which auto set by most framework
   */
  absolutePath?: string;
}

export enum ElementChainMode {
  Render = 'Render',
  Source = 'Source',
}
