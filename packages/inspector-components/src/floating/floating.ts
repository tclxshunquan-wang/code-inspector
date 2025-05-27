import {
  computePosition,
  type Dimensions,
  flip,
  offset,
  shift,
} from '@floating-ui/core';
import { type Rect } from './types.js';

export const getViewSpaceBox = (boundaryWindow?: Window): Rect => {
  const windowAgent =
    boundaryWindow ?? window.__REACT_DEVTOOLS_TARGET_WINDOW__ ?? window;
  const documentBox = getBoundingRect(windowAgent.document.documentElement);
  return {
    x: documentBox.x + windowAgent.scrollX,
    y: documentBox.y + windowAgent.scrollY,
    width: windowAgent.innerWidth,
    height: windowAgent.innerHeight,
  };
};

export const restraintTipPosition = async ({
  elementBox,
  spaceBox,
  tipSize,
}: {
  /** the `reference` of computePosition */
  elementBox: Rect;
  /** the `ClippingRect` of computePosition */
  spaceBox: Rect;
  /** the `floating` of computePosition */
  tipSize: Dimensions;
}): Promise<{ top: number; left: number }> => {
  // https://floating-ui.com/docs/platform
  const { x, y } = await computePosition(elementBox, tipSize, {
    platform: {
      getElementRects: (elementRects) => elementRects,
      getDimensions: (element) => element,
      getClippingRect: () => spaceBox,
    },
    // y-axis is the main axis
    placement: 'bottom-start',
    // css position type
    strategy: 'fixed',
    middleware: [
      /**
       * add distance (margin or spacing) between the reference and floating element
       *
       * https://floating-ui.com/docs/offset
       */
      offset(4),
      /**
       * prevents the floating element from overflowing a clipping container
       * by flipping it to the opposite placement to stay in view.
       *
       * https://floating-ui.com/docs/flip
       */
      flip({
        crossAxis: false,
        fallbackAxisSideDirection: 'start',
      }),
      /**
       * prevents the floating element from overflowing a clipping container
       * by shifting it to stay in view (container).
       *
       * https://floating-ui.com/docs/shift
       */
      shift({
        padding: 4,
        crossAxis: true,
      }),
    ],
  });

  return {
    left: x,
    top: y,
  };
};

export function getBoundingRect(element: HTMLElement | any): Rect {
  const domRect = element?.getBoundingClientRect?.() as DOMRect | undefined;
  if (!domRect) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  return {
    x: domRect.left,
    y: domRect.top,
    width: domRect.width,
    height: domRect.height,
  };
}
