import { defaultHotkeys } from '../constant.js';

export const printPromotion = (
  hotKeys?: string[],
  hideContext: boolean = false
) => {
  const keys = (hotKeys || defaultHotkeys()).map((item) => '%c' + item);
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
      `%cPress [ ${keys.join(
        ' %c+ '
      )}%c ] to enable code inspector (click page elements to locate source code in editor)`,
      ...colors
    );
    return;
  }
  console.log(
    `%c[hyperse-inspector]%c Press [ ${keys.join(
      ' %c+ '
    )}%c ] to enable code inspector (click page elements to locate source code in editor)`,
    'color: #006aff; font-weight: 900; font-size: 14px;',
    ...colors
  );
};
