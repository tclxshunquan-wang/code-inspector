import { createRoot } from 'react-dom/client';
import { Inspector } from '../Inspector.js';

function injectInspectorComponent() {
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      const inspectorRoot = document.createElement('div');
      inspectorRoot.id = 'inspector-root';
      document.body.appendChild(inspectorRoot);
      const inspector = createRoot(inspectorRoot);

      const endpoint = process.env.INSPECTOR_ENDPOINT;
      const keys = process.env.INSPECTOR_KEYS;
      const hideConsole = process.env.INSPECTOR_HIDE_CONSOLE;
      const hideContext = process.env.INSPECTOR_HIDE_CONTEXT;
      const hideDomPathAttr = process.env.INSPECTOR_HIDE_DOM_PATH_ATTR;
      const disable = process.env.INSPECTOR_DISABLE;

      inspector.render(
        <Inspector
          disable={disable === 'TRUE'}
          customLaunchEditorEndpoint={endpoint}
          keys={keys?.split(',')}
          hideDomPathAttr={hideDomPathAttr === 'TRUE'}
          hideConsole={hideConsole === 'TRUE'}
          hideContext={hideContext === 'TRUE'}
        />
      );
    });
  }
}
injectInspectorComponent();
