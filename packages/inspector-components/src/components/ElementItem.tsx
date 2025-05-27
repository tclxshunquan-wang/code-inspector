import { Copy } from 'lucide-solid';
import { For, Show } from 'solid-js';
import { unwrap } from 'solid-js/store';
import { TrustedEditor } from '@react-dev-inspector/launch-editor-endpoint';
import { cn, css, styled } from '../utils/index.js';
import { IconBox } from './IconBox.js';
import { VSCode, WebStorm } from './icons/index.js';
import { Tag, type TagItem } from './Tag.js';

/**
 * `h-12` in ElementItem component
 */
export const ELEMENT_ITEM_HEIGHT = 48;

export interface ElementItemProps<Item extends ItemInfo = ItemInfo> {
  class?: string | undefined;
  style?: string;
  item: Item;
  index: number;
  onClickItem?: (item: Item) => void;
  onClickEditor?: (params: {
    editor: TrustedEditor;
    item: Item;
  }) => void | Promise<void>;
  onHoverItem?: (item: Item) => void;
}

export const ElementItem = <Item extends ItemInfo = ItemInfo>(
  props: ElementItemProps<Item>
) => {
  const onClickItem = () => props.onClickItem?.(unwrap(props.item));
  const onHoverItem = () => props.onHoverItem?.(unwrap(props.item));

  return (
    <S.ItemContainerRow
      class={props.class}
      style={props.style}
      onClick={onClickItem}
      onPointerEnter={onHoverItem}
    >
      <S.MajorInfo>
        <S.TitleLabelRow>
          <div
            class={`no-scrollbar flex flex-auto items-center justify-start gap-2 overflow-x-auto hover:basis-[content] [&>*]:hover:shrink-0 [&>*]:hover:basis-[content] [&>*]:hover:overflow-visible`}
          >
            <Show when={props.item.title || !props.item.tags?.length}>
              <S.TitleText
                class={props.item.title ? undefined : 'text-text-3 font-normal'}
              >
                {props.item.title || '(anonymous)'}
              </S.TitleText>
            </Show>

            <Show when={props.item.tags?.length}>
              <div
                class={`no-scrollbar flex min-w-10 flex-shrink-[3] flex-grow-0 basis-[content] items-center justify-start gap-1 overflow-x-auto`}
              >
                <For each={props.item.tags}>{(tag) => <Tag tag={tag} />}</For>
              </div>
            </Show>
          </div>

          <Show when={props.item.title}>
            <S.CopyIcon
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                copyText(props.item.title);
              }}
            >
              <Copy class={`w-3 stroke-1 transition-all duration-100`} />
            </S.CopyIcon>
          </Show>
        </S.TitleLabelRow>

        <S.TitleLabelRow>
          <S.SubtitleText
            class={cn(!props.item.subtitle && 'text-text-3')}
            dir="rtl"
          >
            <span>&lrm;{props.item.subtitle || '—'}&lrm;</span>
          </S.SubtitleText>
          {Boolean(props.item.subtitle) && (
            <S.CopyIcon
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                copyText(props.item.subtitle!);
              }}
            >
              <Copy class={`w-3 stroke-1 transition-all duration-100`} />
            </S.CopyIcon>
          )}
        </S.TitleLabelRow>
      </S.MajorInfo>

      <aside
        class={`text-text-2 hidden h-10 flex-none flex-col items-stretch justify-stretch text-xs`}
      >
        <S.RowInRight>#{props.index}</S.RowInRight>

        <S.RowInRight>
          <S.EditorIcon
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              props.onClickEditor?.({
                item: unwrap(props.item),
                editor: TrustedEditor.VSCode,
              });
            }}
          >
            <VSCode class={`w-3 transition-all duration-100`} />
          </S.EditorIcon>
          <S.EditorIcon
            onClick={(event) => {
              event.stopPropagation();
              event.preventDefault();
              props.onClickEditor?.({
                item: unwrap(props.item),
                editor: TrustedEditor.WebStorm,
              });
            }}
          >
            <WebStorm class={`w-3 transition-all duration-100`} />
          </S.EditorIcon>
        </S.RowInRight>
      </aside>
    </S.ItemContainerRow>
  );
};

const S = {
  ItemContainerRow: styled.section({
    class: `
      flex flex-auto items-center justify-stretch rounded
      h-12 whitespace-nowrap
      cursor-default hover:bg-bg-hover-2 active:bg-bg-active-1
      max-w-full px-2 gap-1 text-text-1 font-mono
      [&:hover>aside]:flex
    `,
    style: css`
      flex-flow: row nowrap;
    `,
  }),

  MajorInfo: styled.div({
    class: `
      flex [flex:1_1_100%] flex-col justify-stretch items-stretch
      truncate max-w-full h-10
    `,
  }),

  TitleLabelRow: styled.div({
    class: `
      flex flex-1 items-center justify-between gap-1.5 text-xs
      [&:hover>.iconbox]:flex
    `,
  }),

  TitleText: styled.span({
    class: `min-w-12 flex-grow-0 flex-shrink-1 basis-[content] text-left truncate no-scrollbar text-[13px] font-bold`,
  }),

  SubtitleText: styled.span({
    class: `
      flex flex-initial items-center justify-start
      text-left text-[11px] text-text-2 overflow-x-auto no-scrollbar
      [&>*]:truncate [&>*]:hover:shrink-0 [&>*]:hover:overflow-visible [&>*]:hover:basis-[content]
    `,
  }),

  Tag: styled.span({
    class: `bg-[hsl(var(--info))] rounded px-1.5 py-0.5 select-none text-xs`,
  }),

  CopyIcon: styled(IconBox, {
    class: `
      hidden size-5 text-text-1 hover:bg-bg-hover-3 hover:text-text-1
      [&:hover>svg]:w-3.5 [&:hover>svg]:[stroke-width:1.5px]
    `,
  }),

  EditorIcon: styled(IconBox, {
    class: `size-5 hover:bg-bg-hover-3 [&:hover>*]:w-4`,
  }),

  RowInRight: styled.div({
    class: `flex flex-1 items-center justify-end gap-0.5 text-xs text-text-3 select-none`,
  }),
};

/**
 * item's structure in ElementItem component
 */
export interface ItemInfo {
  title: string;
  subtitle?: string;
  tags?: TagItem[];
  codeInfo?: CodeInfo;
}

interface CodeInfo {
  lineNumber: string;
  columnNumber: string;
  /**
   * code source file relative path to dev-server cwd(current working directory)
   * need use with `@react-dev-inspector/babel-plugin`
   */
  relativePath?: string;
  /**
   * code source file absolute path
   * just need use with `@babel/plugin-transform-react-jsx-source` which auto set by most framework
   */
  absolutePath?: string;
}

const copyText = (text: string) => {
  return navigator.clipboard.writeText(text);
};
