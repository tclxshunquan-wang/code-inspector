import { useEffect, useLayoutEffect as _useLayoutEffect } from 'react';

export const useLayoutEffect =
  typeof window !== 'undefined' &&
  // @ts-expect-error `window` is not available in SSR
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  window?.document?.createElement
    ? _useLayoutEffect
    : useEffect;
