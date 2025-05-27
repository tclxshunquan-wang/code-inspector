import {
  type Component,
  type ComponentProps,
  type JSX,
  splitProps,
} from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { cn } from './classnames.js';

interface StyleDefinedParams {
  class?: string;
  style?: JSX.CSSProperties | string;
}

interface StylesProps {
  class?: string;
  style?: JSX.CSSProperties | string;
}

interface StyledComponentCreator {
  <Props extends StylesProps>(
    Component: Component<Props>,
    params: StyleDefinedParams
  ): typeof Component;

  <Tag extends keyof JSX.HTMLElementTags>(
    Component: Tag,
    params: StyleDefinedParams
  ): Component<JSX.HTMLElementTags[Tag]>;
}

type StyledTagCreator = {
  [Tag in keyof JSX.HTMLElementTags]: (
    params: StyleDefinedParams
  ) => Component<JSX.HTMLElementTags[Tag]>;
};

interface StyledCreator extends StyledComponentCreator, StyledTagCreator {}

/**
 * style-component method for tailwindcss with solidjs
 *
 * - will merge `class` attribute with `tailwind-merge` for tailwindcss
 * - will merge `style` attribute when CSSProperties or string
 *  - if type of define params's `style` is not same as jsx component props's `style`, it will use `props.style`
 * - will NOT extract any CSS to class name like other style-components library
 *
 * Note: add this config in VSCode `settings.json` for code hinting
 *   via [Tailwind CSS IntelliSense](https://github.com/tailwindlabs/tailwindcss-intellisense):
 *
 * ```json
 * "tailwindCSS.experimental.classRegex": [
 *   "class: *`([^`]*)`",
 *   "class: *\"([^\"]*)\"",
 *   "class: *'([^']*)'",
 * ],
 * ```
 */
export const styled = (<
  Props extends StylesProps,
  Tag extends keyof JSX.HTMLElementTags,
>(
  Component: Component<Props> | Tag,
  params: StyleDefinedParams
): Component<ComponentProps<typeof Component>> => {
  type CombineProps = ComponentProps<typeof Component> & StylesProps;

  const StyledComponent: Component<CombineProps> = (props: CombineProps) => {
    const [localProps, restProps] = splitProps(props, ['class', 'style']);

    const style = (): JSX.CSSProperties | string | undefined => {
      const propsStyle = localProps.style;
      if (typeof propsStyle === 'string' && typeof params.style === 'string') {
        return `${params.style} ${propsStyle}`;
      } else if (
        typeof propsStyle === 'object' &&
        typeof params.style === 'object'
      ) {
        return {
          ...params.style,
          ...propsStyle,
        };
      }

      return propsStyle ?? params.style;
    };

    return (
      <Dynamic
        component={Component}
        {...(restProps as CombineProps)}
        class={cn(params.class, localProps.class)}
        style={style()}
      />
    );
  };

  return StyledComponent;
}) as StyledCreator;

export const tags: (keyof JSX.HTMLElementTags)[] = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'search',
  'section',
  'select',
  'slot',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
];

tags.forEach((tag) => {
  styled[tag] = (params: StyleDefinedParams) => styled(tag, params);
});

/** only use for syntax highlighting by styled-components extension in IDE */
export const css = String.raw;

// @ts-expect-error  TS6196: 'RestrictPropsStyle' is declared but never used.
type _RestrictPropsStyle<Props, ParamsStyle> = Omit<Props, 'style'> & {
  style?: IntrinsicStyle<ParamsStyle>;
};

type IntrinsicStyle<ParamsStyle> = ParamsStyle extends string
  ? string
  : ParamsStyle extends JSX.CSSProperties
    ? JSX.CSSProperties
    : ParamsStyle extends [undefined]
      ? JSX.CSSProperties | string
      : never;
