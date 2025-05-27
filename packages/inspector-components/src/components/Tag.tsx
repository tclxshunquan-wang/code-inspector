import { type JSX, Show, splitProps } from 'solid-js';
import { styled } from '../utils/index.js';

/**
 * tag string with optional color styles
 */
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

export interface TagProps
  extends Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'style'> {
  tag: TagItem;
  style?: JSX.CSSProperties;
}

export const Tag = (props: TagProps) => {
  const [local, others] = splitProps(props, ['tag', 'style']);

  const tagText = () =>
    typeof local.tag === 'string' ? local.tag : local.tag?.label;

  const tagBackground = () =>
    typeof local.tag === 'string' ? undefined : local.tag?.background;

  const tagTextColor = () =>
    typeof local.tag === 'string' ? undefined : local.tag?.textColor;

  return (
    <Show when={tagText()}>
      <S.Tag
        {...others}
        style={{
          ...local.style,
          color: tagTextColor(),
          background: tagBackground(),
        }}
      >
        {tagText()}
      </S.Tag>
    </Show>
  );
};

const S = {
  Tag: styled.span({
    class: `text-text-1 bg-[var(--color-tag-lightblue-1)] rounded px-1.5 py-0.5 select-none text-xs`,
  }),
};
