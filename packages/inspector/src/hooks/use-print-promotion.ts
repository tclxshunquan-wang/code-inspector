import { useEffect, useRef } from 'react';
import { printPromotion } from '../helpers/helper-promotion.js';

export const usePrintPromotion = (
  hotKeys?: string[],
  hideConsole?: boolean,
  hideContext?: boolean
) => {
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (hideConsole || isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    printPromotion(hotKeys, hideContext);
  }, [hideConsole, hideContext]);
};
