import { defaultHotkeys } from '../constant.js';
import { getPlatformKey } from './helper-platform-key.js';

export const printPromotion = (
  hotKeys?: string[],
  hideContext: boolean = false
) => {
  const keys = (hotKeys || defaultHotkeys()).map((item) =>
    getPlatformKey(item)
  );
  const colorCount = keys.length * 2 + 1;
  const colors = Array(colorCount)
    .fill('')
    .map((_, index) => {
      if (index % 2 === 0) {
        return 'color: #42b983; font-size: 12px; font-weight: bold;';
      } else {
        return 'color: #1976d2; font-size: 12px; font-weight: bold;';
      }
    });
  if (hideContext) {
    console.log(
      `%cPress [ ${keys.map((key) => `%c${key}`).join(' %c+ ')}%c ] to enable code inspector`,
      ...colors
    );
    return;
  }
  console.log(
    `%c[hyperse-inspector]%c Press [ ${keys.map((key) => `%c${key}`).join(' %c+ ')}%c ] to enable code inspector`,
    'color: #006aff; font-weight: 900; font-size: 14px;',
    ...colors
  );
};
