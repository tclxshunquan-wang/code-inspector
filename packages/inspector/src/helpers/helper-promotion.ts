import { defaultHotkeys } from '../constant.js';

export const printPromotion = (hotKeys?: string[]) => {
  const keys = (hotKeys || defaultHotkeys()).map((item) => '%c' + item);
  const colorCount = keys.length * 2 + 1;
  const colors = Array(colorCount)
    .fill('')
    .map((_, index) => {
      if (index % 2 === 0) {
        return 'color: #42b983; font-weight: bold; font-family: PingFang SC;';
      } else {
        return 'color: #1976d2; font-weight: bold; font-family: PingFang SC;';
      }
    });
  console.log(
    `%c[hyperse-inspector]%c Press [ ${keys.join(
      ' %c+ '
    )}%c ] to enable code inspector (click page elements to locate source code in editor)`,
    'color: #006aff; font-weight: bold;',
    ...colors
  );
};
