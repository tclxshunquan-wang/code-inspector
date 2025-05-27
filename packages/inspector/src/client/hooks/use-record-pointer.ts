import { type RefObject, useEffect, useRef } from 'react';

export const useRecordPointer = ({
  disable,
}: {
  disable?: boolean;
}): RefObject<PointerEvent | undefined> => {
  const pointerRef = useRef<PointerEvent | undefined>(undefined);

  useEffect(() => {
    const recordPointer = (event: PointerEvent) => {
      pointerRef.current = event;
    };

    if (!disable) {
      document.addEventListener('pointermove', recordPointer, true);
    }

    return () => {
      pointerRef.current = undefined;
      document.removeEventListener('pointermove', recordPointer, true);
    };
  }, [disable]);

  return pointerRef;
};
