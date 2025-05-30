import { isMac } from './helpers/helper-platform.js';

/**
 * Default hotkeys for toggling the inspector component
 *
 * On macOS: Command + I
 * On other platforms: Ctrl + I
 */
export const defaultHotkeys = () => (isMac() ? ['$mod', 'i'] : ['Ctrl', 'i']);
