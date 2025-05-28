import { type RefObject, useEffect, useRef, useState } from 'react';
import { keybindings } from '@hyperse-internal/tinykeys';
import { useEffectEvent } from './use-effect-event.js';
import { useLayoutEffect } from './use-layout-effect.js';

/**
 * sync prop to state as a controlled component
 */
export const useControlledActive = ({
  controlledActive,
  onActiveChange,
  onActivate,
  onDeactivate,
  disable,
}: {
  controlledActive?: boolean;
  onActiveChange?: (active: boolean) => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  disable?: boolean;
}): {
  activate: () => void;
  deactivate: () => void;
  isActive: boolean;
  activeRef: RefObject<boolean>;
} => {
  const [isActive, setActive] = useState<boolean>(controlledActive ?? false);
  const activeRef = useRef<boolean>(isActive);
  const unbindRef = useRef<() => void>(() => {});

  // sync state as controlled component
  useLayoutEffect(() => {
    if (controlledActive !== undefined) {
      activeRef.current = controlledActive;
      setActive(activeRef.current);
    }
  }, [controlledActive]);

  const activate = useEffectEvent(() => {
    onActiveChange?.(true);
    if (controlledActive === undefined) {
      activeRef.current = true;
      setActive(activeRef.current);
    }
  });

  const deactivate = useEffectEvent(() => {
    onActiveChange?.(false);
    if (controlledActive === undefined) {
      activeRef.current = false;
      setActive(activeRef.current);
    }
  });

  const handelEscapeToCancel = useEffectEvent((event?: KeyboardEvent) => {
    event?.preventDefault();
    event?.stopImmediatePropagation();
    deactivate?.();
  });

  const handleActivate = useEffectEvent(() => {
    onActivate?.();
    unbindRef.current = keybindings(window, {
      esc: handelEscapeToCancel,
    });
  });

  const handleDeactivate = useEffectEvent(() => {
    unbindRef.current?.();
    onDeactivate?.();
  });

  useEffect(() => {
    return () => {
      unbindRef.current?.();
    };
  }, []);

  // trigger activate/deactivate next render after state change
  useEffect(() => {
    if (isActive && !disable) {
      handleActivate();
    } else {
      handleDeactivate();
    }

    return onDeactivate;
  }, [isActive, disable]);

  return {
    activate,
    deactivate,
    isActive,
    activeRef,
  };
};
