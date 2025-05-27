import { createMemo, type JSX } from 'solid-js';

export interface DragHandlersProps {
  borderSize?: number;
  cornerSize?: number;
}

export const DragHandlers = (props: DragHandlersProps) => {
  const defaultBorderSize = 3;
  const defaultCornerSize = 8;

  const cornerSize = createMemo<Pick<JSX.CSSProperties, 'width' | 'height'>>(
    () => ({
      width: `${props.cornerSize || defaultCornerSize}px`,
      height: `${props.cornerSize || defaultCornerSize}px`,
    })
  );
  const borderSize = createMemo(
    () => `${props.borderSize || defaultBorderSize}px`
  );

  return (
    <>
      {/* 4 x Border Handlers ↑ → ↓ ← */}
      <div
        class={`absolute top-0 left-0 z-10 w-full cursor-ns-resize`}
        style={{ height: borderSize() }}
        data-resize-handler
        data-resize-border-top
      />
      <div
        class={`absolute bottom-0 left-0 z-10 w-full cursor-ns-resize`}
        style={{ height: borderSize() }}
        data-resize-handler
        data-resize-border-bottom
      />
      <div
        class={`absolute top-0 left-0 z-10 h-full cursor-ew-resize`}
        style={{ width: borderSize() }}
        data-resize-handler
        data-resize-border-left
      />
      <div
        class={`absolute top-0 right-0 z-10 h-full cursor-ew-resize`}
        style={{ width: borderSize() }}
        data-resize-handler
        data-resize-border-right
      />

      {/* 4 x Corner Handlers ↖︎ ↗︎ ↘︎ ↙︎ */}
      <div
        class={`absolute top-0 left-0 z-10 cursor-nwse-resize`}
        style={cornerSize()}
        data-resize-handler
        data-resize-corner-top-left
      />
      <div
        class={`absolute top-0 right-0 z-10 cursor-nesw-resize`}
        style={cornerSize()}
        data-resize-handler
        data-resize-corner-top-right
      />
      <div
        class={`absolute right-0 bottom-0 z-10 cursor-nwse-resize`}
        style={cornerSize()}
        data-resize-handler
        data-resize-corner-bottom-right
      />
      <div
        class={`absolute bottom-0 left-0 z-10 cursor-nesw-resize`}
        style={cornerSize()}
        data-resize-handler
        data-resize-corner-bottom-left
      />
    </>
  );
};
