export type StopFunction = () => void;

type Keys = keyof GlobalEventHandlersEventMap;

interface ListenableElement {
  addEventListener<K extends Keys>(
    type: K,
    listener: (ev: GlobalEventHandlersEventMap[K]) => any,
    options?: EventListenerOptions
  ): void;
  removeEventListener<K extends Keys>(
    type: K,
    listener: (ev: GlobalEventHandlersEventMap[K]) => any,
    options?: EventListenerOptions
  ): void;
}

export const setupPointerListener = (handlers: {
  onPointerOver?: (params: {
    element: HTMLElement;
    pointer: PointerEvent;
  }) => void;
  onPointerDown?: (params: {
    element: HTMLElement;
    pointer: PointerEvent;
  }) => void;
  onClick?: (params: { element: HTMLElement; pointer: PointerEvent }) => void;
  target?: ListenableElement;
  preventEvents?: (keyof GlobalEventHandlersEventMap)[];
}): StopFunction => {
  const startInspectingNative = () => {
    registerListeners(handlers.target ?? window);
  };

  const registerListeners = (element?: ListenableElement) => {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (typeof element?.addEventListener === 'function') {
      element.addEventListener('click', onClick, { capture: true });
      element.addEventListener('mousedown', onPointerDown, { capture: true });
      element.addEventListener('pointerdown', onPointerDown, { capture: true });
      element.addEventListener('pointerover', onPointerOver, { capture: true });

      handlers.preventEvents?.forEach((event) => {
        element.addEventListener(event, onStopEvent, { capture: true });
      });
    }
  };

  const stopInspectingNative = () => {
    removeListeners(handlers.target ?? window);
  };

  const removeListeners = (element?: ListenableElement) => {
    // This plug-in may run in non-DOM environments (e.g. React Native).
    if (typeof element?.removeEventListener === 'function') {
      element.removeEventListener('click', onClick, { capture: true });
      element.removeEventListener('mousedown', onPointerDown, {
        capture: true,
      });
      element.removeEventListener('pointerdown', onPointerDown, {
        capture: true,
      });
      element.removeEventListener('pointerover', onPointerOver, {
        capture: true,
      });

      handlers.preventEvents?.forEach((event) => {
        element.removeEventListener(event, onStopEvent, { capture: true });
      });
    }
  };

  const onStopEvent = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onPointerOver = (event: MouseEvent | PointerEvent) => {
    onStopEvent(event);

    const target = event.target as HTMLElement;
    handlers.onPointerOver?.({
      element: target,
      pointer: event as PointerEvent,
    });
  };

  const onPointerDown = (event: MouseEvent | PointerEvent) => {
    const target = event.target as HTMLElement;
    handlers.onPointerDown?.({
      element: target,
      pointer: event as PointerEvent,
    });
  };

  const onClick = (event: MouseEvent | PointerEvent) => {
    const target = event.target as HTMLElement;
    handlers.onClick?.({
      element: target,
      pointer: event as PointerEvent,
    });
  };

  startInspectingNative();

  return stopInspectingNative;
};
