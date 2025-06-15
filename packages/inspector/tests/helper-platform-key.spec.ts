import type { Mock } from 'vitest';
import { isAppleDevice } from '@hyperse/tinykeys';
import { getPlatformKey } from '../src/helpers/helper-platform-key.js';

// Mock the isAppleDevice function
vi.mock('@hyperse/tinykeys', () => ({
  isAppleDevice: vi.fn(),
}));

describe('getPlatformKey', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('on Apple devices', () => {
    beforeEach(() => {
      (isAppleDevice as Mock).mockReturnValue(true);
    });

    it('should return Command symbol for $mod', () => {
      expect(getPlatformKey('$mod')).toBe('Command / ⌘');
    });

    it('should return Option symbol for alt', () => {
      expect(getPlatformKey('alt')).toBe('Option / ⌥');
    });

    it('should return Option symbol for option', () => {
      expect(getPlatformKey('option')).toBe('Option / ⌥');
    });

    it('should return Control symbol for control', () => {
      expect(getPlatformKey('control')).toBe('Control / ^');
    });

    it('should return original key for other keys', () => {
      expect(getPlatformKey('shift')).toBe('shift');
    });
  });

  describe('on non-Apple devices', () => {
    beforeEach(() => {
      (isAppleDevice as Mock).mockReturnValue(false);
    });

    it('should return original key for $mod', () => {
      expect(getPlatformKey('$mod')).toBe('$mod');
    });

    it('should return Alt for alt', () => {
      expect(getPlatformKey('alt')).toBe('Alt');
    });

    it('should return Alt for option', () => {
      expect(getPlatformKey('option')).toBe('Alt');
    });

    it('should return Control for control', () => {
      expect(getPlatformKey('control')).toBe('Control');
    });

    it('should return original key for other keys', () => {
      expect(getPlatformKey('shift')).toBe('shift');
    });
  });
});
