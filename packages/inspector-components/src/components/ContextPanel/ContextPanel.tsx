import { type JSX } from 'solid-js';
import { DragHandlers } from './DragHandlers';
import { type DragPanelParams, useResizeAndDrag } from './hooks';

import { cn } from '#utils';

export interface ContextPanelProps extends DragPanelParams {
  class?: string | undefined;
  children?: JSX.Element;
  style?: JSX.CSSProperties;
}

export const ContextPanel = (props: ContextPanelProps) => {
  const { setContainerRef, positionStyle, resizeOrDragTrigger } =
    useResizeAndDrag(props);

  return (
    <div
      class={cn(
        `inspector-context-panel bg-card relative top-0 left-0 flex items-stretch justify-stretch overflow-hidden rounded-md border shadow-xl data-[dragging]:cursor-move *:data-[dragging]:pointer-events-none *:data-[resizing]:pointer-events-none`,
        props.class
      )}
      ref={setContainerRef}
      style={positionStyle()}
      onPointerDown={resizeOrDragTrigger}
      onMouseDown={stopPropagation}
      onClick={stopPropagation}
      data-draggable-block
    >
      {props.children}

      <DragHandlers />
    </div>
  );
};

const stopPropagation = (e: Event) => e.stopPropagation();
