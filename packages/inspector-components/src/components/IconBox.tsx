import { type JSX } from 'solid-js';
import { cn } from '../utils/index.js';

export interface IconBoxProps {
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  /** default is 28 */
  boxSize?: number;
  /** default is 14 */
  size?: number;
  onClick?: (e: MouseEvent) => void;
  onPointerEnter?: (e: PointerEvent) => void;
  onPointerLeave?: (e: PointerEvent) => void;
  forwardProps?: JSX.HTMLAttributes<HTMLDivElement>;
}

export const IconBox = (props: IconBoxProps) => {
  return (
    <div
      {...props.forwardProps}
      class={cn(
        `iconbox flex size-7 flex-none items-center justify-center rounded text-sm leading-none`,
        props.onClick &&
          'hover:bg-bg-hover-2 active:bg-bg-active-1 cursor-pointer',
        props.class
      )}
      style={{
        width: props.boxSize && `${props.boxSize}px`,
        height: props.boxSize && `${props.boxSize}px`,
        'font-size': props.size && `${props.size}px`,
        ...props.style,
      }}
      onClick={props.onClick}
      onPointerEnter={props.onPointerEnter}
      onPointerLeave={props.onPointerLeave}
    >
      {props.children}
    </div>
  );
};
