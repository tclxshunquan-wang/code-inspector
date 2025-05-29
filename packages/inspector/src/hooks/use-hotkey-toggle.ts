import { type RefObject, useEffect } from 'react';
import { useTinykeys } from '@hyperse-internal/tinykeys';
import { isMac } from '../helpers/helper-platform.js';

/**
 * make 'Ctrl + i' as default shortcut on Windows/Linux
 */
export const defaultHotkeys = () => (isMac() ? ['$mod', 'i'] : ['Ctrl', 'i']);

export const useHotkeyToggle = ({
  keys,
  disable,
  activate,
  deactivate,
  activeRef,
}: {
  /**
   * Inspector Component toggle hotkeys,
   *
   * supported keys see: https://github.com/hyperse-internal/tinykeys
   *
   * @default - `['$mod', 'i']` on macOS, `['Ctrl', 'i']` on other platforms.
   *
   * Setting `keys={null}` explicitly means that disable use hotkeys to trigger it.
   */
  keys: string[] | null;
  /** Whether to disable all behavior include hotkeys listening or trigger */
  disable?: boolean;
  activeRef: RefObject<boolean>;
  activate: () => void;
  deactivate: () => void;
}) => {
  const hotkey = (keys || defaultHotkeys()).join('+');

  const handleActionSelect = () => {
    if (activeRef.current) {
      deactivate();
    } else {
      activate();
    }
  };

  const bindEvent = useTinykeys({
    actionTree: {
      [hotkey]: {
        id: hotkey,
        shortcut: [hotkey],
      },
    },
    onActionSelect: handleActionSelect,
  });

  useEffect(() => {
    if (disable) {
      return;
    }
    const unbind = bindEvent();
    return () => {
      unbind();
    };
  }, [hotkey, disable]);
};
