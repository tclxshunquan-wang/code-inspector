import type { Box, BoxSizing } from '../floating/index.js';

/**
 * @deprecated now use `getBoundingRect` instead
 */
export function getBoundingBox(element: HTMLElement | any): Box {
  const domRect = element?.getBoundingClientRect?.() as DOMRect | undefined;
  if (!domRect) {
    return {
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      right: 0,
      bottom: 0,
    };
  }

  return {
    top: domRect.top,
    left: domRect.left,
    width: domRect.width,
    height: domRect.height,
    right: domRect.right,
    bottom: domRect.bottom,
  };
}

export function getElementDimensions(element: HTMLElement | any): BoxSizing {
  if (element instanceof HTMLElement) {
    const calculatedStyle = window.getComputedStyle(element);
    return {
      borderLeft: Number.parseInt(calculatedStyle.borderLeftWidth, 10),
      borderRight: Number.parseInt(calculatedStyle.borderRightWidth, 10),
      borderTop: Number.parseInt(calculatedStyle.borderTopWidth, 10),
      borderBottom: Number.parseInt(calculatedStyle.borderBottomWidth, 10),
      marginLeft: Number.parseInt(calculatedStyle.marginLeft, 10),
      marginRight: Number.parseInt(calculatedStyle.marginRight, 10),
      marginTop: Number.parseInt(calculatedStyle.marginTop, 10),
      marginBottom: Number.parseInt(calculatedStyle.marginBottom, 10),
      paddingLeft: Number.parseInt(calculatedStyle.paddingLeft, 10),
      paddingRight: Number.parseInt(calculatedStyle.paddingRight, 10),
      paddingTop: Number.parseInt(calculatedStyle.paddingTop, 10),
      paddingBottom: Number.parseInt(calculatedStyle.paddingBottom, 10),
    };
  }

  return {
    borderTop: 0,
    borderBottom: 0,
    borderLeft: 0,
    borderRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  };
}
