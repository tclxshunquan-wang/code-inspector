'use client';

import { Inspector } from '@hyperse/inspector';
import { launchEditorEndpoint } from '@hyperse/inspector-common';
import { nextInspectorConfig } from '@hyperse/next-inspector/config';

export const InspectorProvider = () => {
  const {
    keys = ['$mod', 'i'],
    customLaunchEditorEndpoint = launchEditorEndpoint,
    hideConsole = false,
    hideContext = false,
    hideDomPathAttr = true,
    disable = false,
  } = nextInspectorConfig || {};

  return (
    <Inspector
      customLaunchEditorEndpoint={customLaunchEditorEndpoint}
      keys={keys}
      hideConsole={hideConsole}
      hideContext={hideContext}
      hideDomPathAttr={hideDomPathAttr}
      disable={disable}
    />
  );
};
