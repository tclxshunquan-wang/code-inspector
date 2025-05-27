import {
  EMPTY,
  filter,
  fromEvent,
  map,
  merge,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { type JSX, onCleanup, onMount } from 'solid-js';

import {
  getViewSpaceBox,
  type Point,
  type Rect,
  restraintTipPosition,
  type Size,
} from '#floating';
import { createStore } from '#utils';

export interface DragPanelParams {
  initialPosition?: Point;
  /** viewport space box relative of client */
  spaceBox?: Rect;
  sizeLimit?: SizeLimit;
}

interface SizeLimit {
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * the `data-draggable-block` attribute to allow element could be use on drag panel
 */
export const useResizeAndDrag = (
  params: DragPanelParams
): {
  setContainerRef: (element?: HTMLElement) => void;
  container: () => HTMLElement | undefined;
  positionStyle: () =>
    | undefined
    | Pick<JSX.CSSProperties, 'position' | 'top' | 'left' | 'translate'>;
  resizeOrDragTrigger: (event: PointerEvent) => void;
} => {
  const spaceBox = () => params.spaceBox ?? getViewSpaceBox();
  const store = createStore<PositionSizeStore>(({ set, get }) => ({
    setContainerRef: (container) => set({ container }),
    positionSizeStyle: {},
    updatePosition: (position) => {
      const { positionSizeStyle } = get();
      set({
        position,
        positionSizeStyle: {
          position: 'fixed',
          translate: `${position.x}px ${position.y}px`,
          width: positionSizeStyle.width,
          height: positionSizeStyle.height,
        },
      });
    },

    updateRectBox: ({ position: nextPosition, size }) => {
      const state = get();
      const position =
        nextPosition ??
        state.position ??
        (state.container?.getBoundingClientRect().toJSON() as Rect | undefined);

      if (!position) {
        return;
      }

      const translate =
        (!nextPosition ? state.positionSizeStyle.translate : undefined) ??
        `${position.x}px ${position.y}px`;

      set({
        position,
        size,
        positionSizeStyle: {
          position: 'fixed',
          translate,
          width: `${size.width}px`,
          height: `${size.height}px`,
        },
      });
    },
  }));

  onMount(() => {
    const container = store.container;
    if (!container) {
      return;
    }

    if (params.initialPosition) {
      const pointerPadding = 4;
      restraintTipPosition({
        elementBox: {
          x: params.initialPosition.x - pointerPadding,
          y: params.initialPosition.y - pointerPadding,
          width: pointerPadding,
          height: pointerPadding,
        },
        spaceBox: spaceBox(),
        tipSize: container.getBoundingClientRect().toJSON() as Rect,
      }).then((position) => {
        store.updatePosition({
          x: position.left,
          y: position.top,
        });
      });
    }
  });

  const { dragStart$ } = useDragContainer({
    container: () => store.container,
    position: () => store.position,
    updatePosition: store.updatePosition,
  });

  const { resizeStart$ } = useResizeContainer({
    container: () => store.container,
    position: () => store.position,
    size: () => store.size,
    sizeLimit: params.sizeLimit,
    updateRectBox: store.updateRectBox,
  });

  return {
    setContainerRef: store.setContainerRef,
    container: () => store.container,

    positionStyle: () => store.positionSizeStyle,

    resizeOrDragTrigger: (event) => {
      event.stopPropagation();

      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (event.button !== PointerButton.Left) {
        return;
      }

      if ('resizeHandler' in target.dataset) {
        event.preventDefault();
        resizeStart$.next(event);
        return;
      }

      if ('draggableBlock' in target.dataset) {
        event.preventDefault();
        dragStart$.next(event);
      }
    },
  };
};

interface PositionSizeStore {
  container?: HTMLElement;
  setContainerRef: (element?: HTMLElement) => void;
  position?: Point;
  size?: Size;
  positionSizeStyle: Pick<
    JSX.CSSProperties,
    'position' | 'width' | 'height' | 'translate'
  >;
  updatePosition: (position: Point) => void;
  updateRectBox: (params: { position?: Point; size: Size }) => void;
}

export const useDragContainer = (params: {
  container: () => HTMLElement | undefined;
  position: () => Point | undefined;
  updatePosition: (position: Point) => void;
}): {
  dragStart$: Subject<PointerEvent>;
} => {
  const { container, position, updatePosition } = params;

  const dragStart$ = new Subject<PointerEvent>();

  const subscriber = dragStart$
    .pipe(
      switchMap((down) => {
        const start =
          position() ??
          (container()?.getBoundingClientRect().toJSON() as Rect | undefined);
        if (!start) {
          return EMPTY;
        }

        let first = true;

        return fromEvent<PointerEvent>(window, 'pointermove', {
          capture: true,
        }).pipe(
          filter(() => Boolean(container())),
          tap((event) => {
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation();
            if (first) {
              container()!.dataset.dragging = '';
              first = false;
            }
          }),
          map((move) => ({
            x: move.clientX - down.clientX + start.x,
            y: move.clientY - down.clientY + start.y,
          })),
          takeUntil(
            merge(
              fromEvent(window, 'pointerdown', { capture: true }),
              fromEvent(window, 'pointercancel', { capture: true }),
              fromEvent(window, 'contextmenu', { capture: true }),
              fromEvent(window, 'pointerup', { capture: true }),
              fromEvent(window, 'blur', { capture: true })
            ).pipe(
              take(1),
              tap(() => {
                if (container()) {
                  delete container()!.dataset.dragging;
                }
              })
            )
          )
        );
      }),
      tap((position) => {
        updatePosition(position);
      })
    )
    .subscribe();

  onCleanup(() => subscriber.unsubscribe());

  return {
    dragStart$,
  };
};

export const useResizeContainer = (params: {
  container: () => HTMLElement | undefined;
  position: () => Point | undefined;
  size: () => Size | undefined;
  sizeLimit?: SizeLimit;
  updateRectBox: (params: { position?: Point; size: Size }) => void;
}): {
  resizeStart$: Subject<PointerEvent>;
} => {
  const { container, position, size, updateRectBox } = params;

  const resizeStart$ = new Subject<PointerEvent>();

  const subscriber = resizeStart$
    .pipe(
      switchMap((down) => {
        const target = down.target;

        const direction = getResizeDirection(target);
        if (!direction) {
          return EMPTY;
        }

        const startRect: Rect | undefined =
          position() && size()
            ? {
                ...position()!,
                ...size()!,
              }
            : (container()?.getBoundingClientRect().toJSON() as
                | Rect
                | undefined);

        if (!startRect) {
          return EMPTY;
        }

        const cursor = resizeCursor[direction];

        let first = true;
        const bodyCursor = document.body.style.cursor;

        return fromEvent<PointerEvent>(window, 'pointermove', {
          capture: true,
        }).pipe(
          filter(() => Boolean(container())),
          tap((event) => {
            event.stopPropagation();
            event.preventDefault();
            event.stopImmediatePropagation();
            if (first) {
              document.body.style.cursor = cursor;
              container()!.dataset.resizing = '';
              first = false;
            }
          }),
          map((move) => ({
            startRect,
            direction,
            movement: {
              x: move.clientX - down.clientX,
              y: move.clientY - down.clientY,
            },
          })),
          takeUntil(
            merge(
              fromEvent(window, 'pointerdown', { capture: true }),
              fromEvent(window, 'pointercancel', { capture: true }),
              fromEvent(window, 'contextmenu', { capture: true }),
              fromEvent(window, 'pointerup', { capture: true }),
              fromEvent(window, 'blur', { capture: true })
            ).pipe(
              take(1),
              tap(() => {
                document.body.style.cursor = bodyCursor;
                if (container()) {
                  delete container()!.dataset.resizing;
                }
              })
            )
          )
        );
      }),
      tap(({ startRect, direction, movement }) => {
        const sizeRatio = getResizeStrategy(direction);
        let width = startRect.width + movement.x * sizeRatio.x;
        let height = startRect.height + movement.y * sizeRatio.y;

        const { sizeLimit } = params;

        if (sizeLimit?.minWidth) {
          width = Math.max(sizeLimit.minWidth, width);
        }
        if (sizeLimit?.minHeight) {
          height = Math.max(sizeLimit.minHeight, height);
        }
        if (sizeLimit?.maxWidth) {
          width = Math.min(sizeLimit.maxWidth, width);
        }
        if (sizeLimit?.maxHeight) {
          height = Math.min(sizeLimit.maxHeight, height);
        }

        const deltaX = startRect.width - width;
        const deltaY = startRect.height - height;

        const positionRatio = getPositionStrategy(sizeRatio);

        updateRectBox({
          position: positionRatio
            ? {
                x: startRect.x + deltaX * positionRatio.x,
                y: startRect.y + deltaY * positionRatio.y,
              }
            : undefined,
          size: {
            width,
            height,
          },
        });
      })
    )
    .subscribe();

  onCleanup(() => subscriber.unsubscribe());

  return {
    resizeStart$,
  };
};

enum Direction {
  Top = 'Top',
  Right = 'Right',
  Bottom = 'Bottom',
  Left = 'Left',
  TopLeft = 'TopLeft',
  TopRight = 'TopRight',
  BottomLeft = 'BottomLeft',
  BottomRight = 'BottomRight',
}

const getResizeDirection = (target: unknown): Direction | undefined => {
  if (
    !(target instanceof HTMLElement) ||
    !('resizeHandler' in target.dataset)
  ) {
    return;
  }

  switch (true) {
    case target.dataset.resizeBorderTop === '': {
      return Direction.Top;
    }
    case target.dataset.resizeBorderRight === '': {
      return Direction.Right;
    }
    case target.dataset.resizeBorderBottom === '': {
      return Direction.Bottom;
    }
    case target.dataset.resizeBorderLeft === '': {
      return Direction.Left;
    }
    case target.dataset.resizeCornerTopLeft === '': {
      return Direction.TopLeft;
    }
    case target.dataset.resizeCornerTopRight === '': {
      return Direction.TopRight;
    }
    case target.dataset.resizeCornerBottomLeft === '': {
      return Direction.BottomLeft;
    }
    case target.dataset.resizeCornerBottomRight === '': {
      return Direction.BottomRight;
    }
  }
};

const resizeCursor: Record<
  Direction,
  NonNullable<JSX.CSSProperties['cursor']>
> = {
  [Direction.Top]: 'ns-resize',
  [Direction.Right]: 'ew-resize',
  [Direction.Bottom]: 'ns-resize',
  [Direction.Left]: 'ew-resize',
  [Direction.TopLeft]: 'nwse-resize',
  [Direction.TopRight]: 'nesw-resize',
  [Direction.BottomLeft]: 'nesw-resize',
  [Direction.BottomRight]: 'nwse-resize',
};

type ResizeRatio = 0 | 1 | -1;
interface ResizeStrategy {
  x: ResizeRatio;
  y: ResizeRatio;
}

const getResizeStrategy = (direction: Direction): ResizeStrategy => {
  const resizeStrategy: Record<Direction, ResizeStrategy> = {
    [Direction.Left]: {
      x: -1,
      y: 0,
    },
    [Direction.Top]: {
      x: 0,
      y: -1,
    },
    [Direction.Right]: {
      x: 1,
      y: 0,
    },
    [Direction.Bottom]: {
      x: 0,
      y: 1,
    },
    [Direction.TopLeft]: {
      x: -1,
      y: -1,
    },
    [Direction.TopRight]: {
      x: 1,
      y: -1,
    },
    [Direction.BottomLeft]: {
      x: -1,
      y: 1,
    },
    [Direction.BottomRight]: {
      x: 1,
      y: 1,
    },
  };

  return resizeStrategy[direction];
};

/**
 * 0 => 0
 * 1 => 0
 * -1 => 1
 */
const getPositionStrategy = (
  size: ResizeStrategy
): ResizeStrategy | undefined => {
  if (size.x !== -1 && size.y !== -1) {
    return;
  }
  return {
    x: size.x === -1 ? 1 : 0,
    y: size.y === -1 ? 1 : 0,
  };
};

export enum PointerButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}
