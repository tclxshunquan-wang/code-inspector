import { createRoot } from 'react-dom/client';
import { Inspector } from '../Inspector.js';

function injectInspectorComponent() {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      const inspectorRoot = document.createElement('div');
      inspectorRoot.id = 'inspector-root';
      document.body.appendChild(inspectorRoot);
      const inspector = createRoot(inspectorRoot);
      inspector.render(
        <Inspector
          hideDomPathAttr
          disable={false}
          customLaunchEditorEndpoint={process.env.INSPECTOR_ENDPOINT}
          keys={process.env.INSPECTOR_KEYS?.split(',')}
        />
      );
    });
  }
}
injectInspectorComponent();
