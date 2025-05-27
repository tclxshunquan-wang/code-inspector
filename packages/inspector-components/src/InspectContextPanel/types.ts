import { type ItemInfo } from '../components/index.js';

export type ElementInfoGenerator<Item extends ItemInfo = ItemInfo> = Generator<
  Item,
  void,
  void
>;
export type ElementInfoGeneratorGetter<Item extends ItemInfo = ItemInfo> =
  () => Generator<Item, void, void>;

export enum ElementChainMode {
  Render = 'Render',
  Source = 'Source',
}

export enum PanelType {
  Elements = 'Elements',
  Settings = 'Settings',
}
