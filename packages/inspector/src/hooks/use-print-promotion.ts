import { useEffect, useRef } from 'react';
import { printPromotion } from '../helpers/helper-promotion.js';

export const usePrintPromotion = (hideConsole: boolean, hotKeys?: string[]) => {
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (hideConsole || isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    printPromotion(hotKeys);
  }, [hideConsole]);
};
