import { isAppleDevice } from '@hyperse/tinykeys';

export const getPlatformKey = (key: string) => {
  const isApple = isAppleDevice();
  const lowerKey = key.toLowerCase();

  if (lowerKey === '$mod') {
    return isApple ? 'Command / ⌘' : key;
  }

  if (lowerKey === 'alt' || lowerKey === 'option') {
    return isApple ? 'Option / ⌥' : 'Alt';
  }

  if (lowerKey === 'control') {
    return isApple ? 'Control / ^' : 'Control';
  }

  return key;
};
