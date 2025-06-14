import { type CSSProperties } from 'react';
import { type BoxSizing } from '../types/type-rect.js';

export const getBoxStyle = (
  boxSizing: BoxSizing | undefined,
  type: 'margin' | 'padding' | 'border'
): CSSProperties => {
  if (!boxSizing) {
    return {
      display: 'none',
    };
  }
  return {
    borderTopWidth: `${Math.max(boxSizing[`${type}Top`] ?? 0, 0)}px`,
    borderLeftWidth: `${Math.max(boxSizing[`${type}Left`] ?? 0, 0)}px`,
    borderRightWidth: `${Math.max(boxSizing[`${type}Right`] ?? 0, 0)}px`,
    borderBottomWidth: `${Math.max(boxSizing[`${type}Bottom`] ?? 0, 0)}px`,
  };
};
