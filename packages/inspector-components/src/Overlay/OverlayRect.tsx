import { createEffect, createMemo, createSignal, type JSX } from 'solid-js';
import type { BoxSizing, Rect } from '../floating/index.js';
import { css } from '../utils/index.js';

export const InspectorOverlayRect = (props: {
  class?: string;
  /** target element bounding Rect */
  boundingRect?: Rect;
  /** target element margin/border/padding */
  boxSizing?: BoxSizing;
}) => {
  const position = createMemo(
    (): Required<Pick<JSX.CSSProperties, 'translate'>> => {
      const x =
        (props.boundingRect?.x ?? 0) -
        Math.max(props.boxSizing?.marginLeft ?? 0, 0);
      const y =
        (props.boundingRect?.y ?? 0) -
        Math.max(props.boxSizing?.marginTop ?? 0, 0);

      return {
        translate: `${x}px ${y}px`,
      };
    }
  );

  const [marginStyle, setMarginStyle] = createSignal<JSX.CSSProperties>({
    display: 'none',
  });
  const [borderStyle, setBorderStyle] = createSignal<JSX.CSSProperties>({
    display: 'none',
  });
  const [paddingStyle, setPaddingStyle] = createSignal<JSX.CSSProperties>({
    display: 'none',
  });
  const [contentStyle, setContentStyle] = createSignal<JSX.CSSProperties>({
    display: 'none',
  });

  const getBoxStyle = (
    boxSizing: BoxSizing | undefined,
    type: 'margin' | 'padding' | 'border'
  ): JSX.CSSProperties => {
    if (!boxSizing) {
      return {
        display: 'none',
      };
    }

    return {
      'border-top-width': `${Math.max(boxSizing[`${type}Top`] ?? 0, 0)}px`,
      'border-left-width': `${Math.max(boxSizing[`${type}Left`] ?? 0, 0)}px`,
      'border-right-width': `${Math.max(boxSizing[`${type}Right`] ?? 0, 0)}px`,
      'border-bottom-width': `${Math.max(boxSizing[`${type}Bottom`] ?? 0, 0)}px`,
    };
  };

  createEffect(() => {
    const { boxSizing, boundingRect } = props;

    setMarginStyle(getBoxStyle(boxSizing, 'margin'));
    setBorderStyle(getBoxStyle(boxSizing, 'border'));
    setPaddingStyle(getBoxStyle(boxSizing, 'padding'));
    setContentStyle(
      !(boundingRect && boxSizing)
        ? {}
        : {
            height: `${
              boundingRect.height -
              boxSizing.borderTop -
              boxSizing.borderBottom -
              boxSizing.paddingTop -
              boxSizing.paddingBottom
            }px`,
            width: `${
              boundingRect.width -
              boxSizing.borderLeft -
              boxSizing.borderRight -
              boxSizing.paddingLeft -
              boxSizing.paddingRight
            }px`,
          }
    );
  });

  return (
    <div
      class={`inspector-overlay-rect-container ${props.class ?? ''}`}
      style={{
        translate: position().translate,
      }}
    >
      <div class="inspector-overlay-margin" style={marginStyle()}>
        <div class="inspector-overlay-border" style={borderStyle()}>
          <div class="inspector-overlay-padding" style={paddingStyle()}>
            <div class="inspector-overlay-content" style={contentStyle()} />
          </div>
        </div>
      </div>
      <style>{styles}</style>
    </div>
  );
};

const styles = css`
  .inspector-overlay-rect-container {
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    cursor: default;
    box-sizing: border-box;
  }

  .inspector-overlay-margin {
    /**
    * PageHighlight.Margin in
    *   https://github.com/ChromeDevTools/devtools-frontend/blob/chromium/6210/front_end/core/common/Color.ts#L2322
    */
    border-color: rgba(246, 178, 107, 0.66);
    border-style: solid;
  }
  .inspector-overlay-border {
    /**
    * PageHighlight.Border in
    *   https://github.com/ChromeDevTools/devtools-frontend/blob/chromium/6210/front_end/core/common/Color.ts#L2320
    */
    border-color: rgba(255, 229, 153, 0.66);
    border-style: solid;
  }
  .inspector-overlay-padding {
    /**
    * PageHighlight.Padding in
    *   https://github.com/ChromeDevTools/devtools-frontend/blob/chromium/6210/front_end/core/common/Color.ts#L2318
    */
    border-color: rgba(147, 196, 125, 0.55);
    border-style: solid;
  }
  .inspector-overlay-content {
    /**
    * PageHighlight.Content in
    *   https://github.com/ChromeDevTools/devtools-frontend/blob/chromium/6210/front_end/core/common/Color.ts#L2315
    */
    background-color: rgba(111, 168, 220, 0.66);
  }
`;
