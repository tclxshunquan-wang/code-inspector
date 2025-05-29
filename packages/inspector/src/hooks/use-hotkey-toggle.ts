import { type RefObject, useEffect } from 'react';
import { keybindings } from '@hyperse-internal/tinykeys';
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
  keys?: string[] | null;
  /** Whether to disable all behavior include hotkeys listening or trigger */
  disable?: boolean;
  activeRef: RefObject<boolean>;
  activate: () => void;
  deactivate: () => void;
}) => {
  const hotkey: string | null = keys === null ? null : (keys ?? []).join('+');

  useEffect(() => {
    const handleHotKeys = (event?: KeyboardEvent) => {
      event?.preventDefault();
      event?.stopImmediatePropagation();
      if (activeRef.current) {
        deactivate();
      } else {
        activate();
      }
    };

    const bindKey =
      hotkey === null || disable ? null : hotkey || defaultHotkeys().join('+');

    if (bindKey) {
      const unbind = keybindings(window, {
        [bindKey]: handleHotKeys,
      });

      return () => {
        unbind();
      };
    }
    return;
  }, [hotkey, disable]);
};
