import type { InspectContextPanelElement } from './InspectContextPanel';
import type { InspectorOverlayElement } from './Overlay';

declare global {
  interface HTMLElementTagNameMap {
    'inspector-overlay': InspectorOverlayElement;
    'inspect-context-panel': InspectContextPanelElement;
  }

  namespace JSX {
    interface IntrinsicElements {
      'inspector-overlay': HTMLAttributes;
      'inspector-context-panel': HTMLAttributes;
    }
  }
}
