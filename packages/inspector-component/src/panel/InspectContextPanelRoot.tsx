import {
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  computePosition,
  flip,
  offset,
  type Rect,
  shift,
} from '@floating-ui/dom';
import { Panel } from '../components/index.js';
import type { ElementItem } from '../types/type-element-item.js';
import type { Point } from '../types/type-rect.js';
import { InspectPanel, type InspectPanelProps } from './InspectPanel.js';

export type InspectContextPanelRootProps<
  Item extends ElementItem = ElementItem,
> = {} & InspectPanelProps<Item>;

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

export interface InspectContextPanelShowParams<
  Item extends ElementItem = ElementItem,
> extends DragPanelParams {
  panelParams: InspectContextPanelRootProps<Item>;
}

export interface InspectContextPanelRootRef<
  Item extends ElementItem = ElementItem,
> {
  show: (params: InspectContextPanelShowParams<Item>) => void;
  hide: () => void;
}

let longPressTimer: NodeJS.Timeout | null = null;

export const InspectContextPanelRoot = <
  Item extends ElementItem = ElementItem,
>({
  ref,
}: {
  ref: RefObject<InspectContextPanelRootRef<Item> | null>;
}) => {
  const floatingRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState<'block' | 'none'>('none');
  const [panelData, setPanelData] =
    useState<InspectContextPanelRootProps<Item>>();

  // Add drag state
  const isDragging = useRef(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panelStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Cleanup event listeners on unmount
  useEffect(() => {
    // Add event listeners for mouse move and up
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
      }
      longPressTimer = null;
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!floatingRef.current) return;

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    isDragging.current = true;
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    const rect = floatingRef.current!.getBoundingClientRect();
    panelStartPos.current = { x: rect.left, y: rect.top };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !floatingRef.current) return;

    e.preventDefault();
    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    const newX = panelStartPos.current.x + deltaX;
    const newY = panelStartPos.current.y + deltaY;

    Object.assign(floatingRef.current.style, {
      top: `${newY}px`,
      left: `${newX}px`,
    });
  };

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault();
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    isDragging.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  useImperativeHandle(ref, () => ({
    show: (params) => {
      if (!floatingRef.current) {
        return;
      }
      setDisplay('block');
      const virtualEl = {
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: params.initialPosition?.x ?? 0,
            y: params.initialPosition?.y ?? 0,
            left: params.initialPosition?.x ?? 0,
            right: params.initialPosition?.x ?? 0,
            top: params.initialPosition?.y ?? 0,
            bottom: params.initialPosition?.y ?? 0,
          };
        },
      };

      computePosition(virtualEl, floatingRef.current as HTMLElement, {
        placement: 'right-start',
        middleware: [offset(5), flip(), shift()],
      }).then(({ x, y }) => {
        Object.assign(floatingRef.current!.style, {
          top: `${y}px`,
          left: `${x}px`,
        });
      });

      setPanelData(params.panelParams);
    },
    hide: () => {
      console.log('hide');
      setDisplay('none');
      setPanelData(undefined);
    },
  }));

  return (
    <>
      <Panel.InspectPanelRoot
        ref={floatingRef}
        onMouseDown={handleMouseDown}
        onClick={stopPropagation}
        data-draggable-block
        style={{
          display: display,
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          position: 'fixed',
          touchAction: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        {panelData && <InspectPanel {...panelData} />}
      </Panel.InspectPanelRoot>
    </>
  );
};

const stopPropagation = (e: any) => e.stopPropagation();
