'use client';
import { useEffect } from 'react';
import { type DOMElement, domInspectAgent } from './agent/dom-inspect-agent.js';
import { useControlledActive, useHotkeyToggle } from './hooks/index.js';
import { useHideDomAttributes } from './hooks/use-hide-dom-attributes.js';
import { usePrintPromotion } from './hooks/use-print-promotion.js';
import { useStartInspecting } from './hooks/use-start-inspecting.js';
import { useStopInspecting } from './hooks/use-stop-inspecting.js';
import type { InspectAgent } from './types/type-agent.js';
import type { InspectorProps } from './types/type-inspector.js';

export const Inspector = function <
  InspectAgents extends InspectAgent<any>[] = InspectAgent<DOMElement>[],
>(props: InspectorProps<InspectAgents>) {
  const {
    keys,
    active: controlledActive,
    onActiveChange,
    inspectAgents = [domInspectAgent],
    disable = process.env.NODE_ENV !== 'development',
    hideConsole,
    hideContext,
    hideDomPathAttr,
    children,
  } = props;

  usePrintPromotion(keys, hideConsole, hideContext);

  const { agentRef, contextPanelRef, startInspecting, onContextMenuEvent } =
    useStartInspecting(props, () => {
      deactivate();
    });

  const { stopInspecting } = useStopInspecting({
    agentRef,
    inspectAgents,
    contextPanelRef,
    onContextMenuEvent,
  });

  const { activate, deactivate, activeRef } = useControlledActive({
    controlledActive,
    onActiveChange,
    onActivate: startInspecting,
    onDeactivate: stopInspecting,
    disable,
  });

  useEffect(() => {
    return () => {
      agentRef.current = undefined;
      inspectAgents.forEach((agent) => {
        agent.deactivate();
      });
    };
  }, [inspectAgents]);

  useHotkeyToggle({
    keys,
    disable,
    activeRef,
    deactivate,
    activate,
  });

  useHideDomAttributes(hideDomPathAttr);

  return <>{children ?? null}</>;
};
