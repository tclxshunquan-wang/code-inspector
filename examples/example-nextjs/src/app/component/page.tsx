'use client';

import { useEffect, useRef } from 'react';
import { InspectContextPanel, Overlay } from '@hyperse/inspector-component';

export default function Component() {
  const overlayRef = useRef<Overlay>(null);
  const inspectorContextPanelRef = useRef<InspectContextPanel>(null);

  const onContextMenuEvent = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    inspectorContextPanelRef.current?.show({
      initialPosition: {
        x: event.clientX,
        y: event.clientY,
      },
      panelParams: {
        renderLayers: [],
        sourceLayers: [],
        onHoverItem: () => {},
        onClickItem: () => {},
        onClickEditor: () => {},
      },
    });
  };

  useEffect(() => {
    overlayRef.current = new Overlay();
    inspectorContextPanelRef.current = new InspectContextPanel();

    window.addEventListener('contextmenu', onContextMenuEvent, {
      capture: true,
    });

    return () => {
      window.removeEventListener('contextmenu', onContextMenuEvent);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mt-4 border-2 border-white p-4" id="dom">
        Triggered by hotkeys, also able to be controlled by component pro
      </div>
      <button
        className="mt-10 rounded-md bg-blue-500 p-2 text-white"
        onClick={() => {
          overlayRef.current?.inspect({
            element: document.getElementById('dom') as HTMLElement,
            title: 'Component',
            info: '/app/component/page.tsx:12',
          });
        }}
      >
        open overlay
      </button>
      <button
        className="mt-10 rounded-md bg-blue-500 p-2 text-white"
        onClick={(e) => {
          inspectorContextPanelRef.current?.show({
            initialPosition: {
              x: 300,
              y: 300,
            },
            panelParams: {
              renderLayers: [],
              sourceLayers: [],
              onHoverItem: () => {},
              onClickItem: () => {},
              onClickEditor: () => {},
            },
          });
        }}
      >
        open inspector context panel
      </button>
    </div>
  );
}
