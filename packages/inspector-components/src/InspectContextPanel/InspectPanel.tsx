import { Match, Switch } from 'solid-js';
import { type TrustedEditor } from '@react-dev-inspector/launch-editor-endpoint';
import {
  ContextPanel,
  type DragPanelParams,
  type ItemInfo,
} from '../components/index.js';
import { createStore } from '../utils/index.js';
import { ElementInspectPanel } from './ElementInspectPanel.js';
import {
  ElementChainMode,
  type ElementInfoGeneratorGetter,
  PanelType,
} from './types.js';

export interface InspectPanelProps<Item extends ItemInfo = ItemInfo> {
  renderLayers: ElementInfoGeneratorGetter<Item>[];
  sourceLayers: ElementInfoGeneratorGetter<Item>[];
  onHoverItem?: (item: Item | null) => void;
  onClickItem?: (item: Item) => void;
  onClickEditor?: (params: {
    item: Item;
    editor: TrustedEditor;
  }) => void | Promise<void>;
}

export const InspectPanel = <Item extends ItemInfo = ItemInfo>(
  props: InspectPanelProps<Item> & DragPanelParams
) => {
  const store = createStore<InspectPanelStore>(({ set }) => ({
    panelType: PanelType.Elements,
    onPanelTypeChange: (type) => set({ panelType: type }),
    elementChainMode: ElementChainMode.Render,
    onChangeChainMode: (mode) => set({ elementChainMode: mode }),
  }));

  const elementLayers = () => {
    const layers = {
      [ElementChainMode.Render]: () => props.renderLayers,
      [ElementChainMode.Source]: () => props.sourceLayers,
    };
    return layers[store.elementChainMode]() ?? [];
  };

  return (
    <ContextPanel
      initialPosition={props.initialPosition}
      spaceBox={props.spaceBox}
      class={`h-96 w-[300px]`}
      sizeLimit={{
        minWidth: 160,
        minHeight: 160,
        maxWidth: 800,
        maxHeight: 800,
      }}
    >
      <Switch>
        <Match when={store.panelType === PanelType.Elements}>
          <ElementInspectPanel
            elementChainMode={store.elementChainMode}
            layers={elementLayers()}
            onChangeChainMode={store.onChangeChainMode}
            onClickItem={props.onClickItem}
            onClickEditor={props.onClickEditor}
            onHoverItem={props.onHoverItem}
            // toSettingsPanel={() => {}}
          />
        </Match>
      </Switch>
    </ContextPanel>
  );
};

interface InspectPanelStore {
  panelType: PanelType;
  onPanelTypeChange: (type: PanelType) => void;
  elementChainMode: ElementChainMode;
  onChangeChainMode: (mode: ElementChainMode) => void;
}
