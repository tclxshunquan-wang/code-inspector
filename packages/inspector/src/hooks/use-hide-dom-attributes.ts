import { useEffect, useRef } from 'react';
import { TRACE_SOURCE } from '@hyperse/inspector-common';

export const useHideDomAttributes = (hideDomPathAttr: boolean = true) => {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!hideDomPathAttr) return;

    const body = document.body;

    const observer = new MutationObserver(() => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      timer.current = setTimeout(() => {
        const nodes = document.querySelectorAll(
          `[${TRACE_SOURCE}]`
        ) as NodeListOf<HTMLElement>;
        nodes.forEach((node: any) => {
          node[TRACE_SOURCE] = node.getAttribute(TRACE_SOURCE);
          node.removeAttribute(TRACE_SOURCE);
        });
      }, 1000);
    });

    observer.observe(body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      timer.current = null;
      observer.disconnect();
    };
  }, [hideDomPathAttr]);
};
