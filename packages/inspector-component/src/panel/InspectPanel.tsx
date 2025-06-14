import { useMemo, useState } from 'react';
import type { TrustedEditor } from '@hyperse/inspector-common';
import { Panel } from '../components/index.js';
import {
  ElementChainMode,
  type ElementInfoGeneratorGetter,
  type ElementItem,
} from '../types/type-element-item.js';
import {
  InspectListItem,
  type InspectListItemProps,
} from './InspectListItem.js';

export type InspectPanelProps<Item extends ElementItem = ElementItem> = {
  renderLayers: ElementInfoGeneratorGetter<Item>[];
  sourceLayers: ElementInfoGeneratorGetter<Item>[];
  onHoverItem?: (item: Item | null) => void;
  onClickItem?: (item: Item) => void;
  onClickEditor?: (params: {
    item: Item;
    editor: TrustedEditor;
  }) => void | Promise<void>;
};

export const InspectPanel = <Item extends ElementItem = ElementItem>(
  props: InspectPanelProps<Item>
) => {
  const {
    renderLayers,
    sourceLayers,
    onHoverItem,
    onClickItem,
    onClickEditor,
  } = props;
  const [chainMode, setChainMode] = useState<ElementChainMode>(
    ElementChainMode.Render
  );
  const renderList = useMemo(() => {
    return renderLayers.reduce<InspectListItemProps<Item>[]>(
      (acc, layer, index) => {
        const list = layer();
        for (const element of list) {
          console.log(element.title);
          acc.push({
            index,
            item: element,
            onHoverItem,
            onClickItem,
            onClickEditor,
          });
        }
        return acc;
      },
      []
    );
  }, [renderLayers]);

  const sourceList = useMemo(() => {
    return sourceLayers.reduce<InspectListItemProps<Item>[]>(
      (acc, layer, index) => {
        const list = layer();
        for (const element of list) {
          acc.push({
            index,
            item: element,
            onHoverItem,
            onClickItem,
            onClickEditor,
          });
        }
        return acc;
      },
      []
    );
  }, [renderLayers]);

  return (
    <Panel.PanelRoot>
      <Panel.PanelActionLayout>
        <Panel.PanelActionButton
          active={`${chainMode === ElementChainMode.Render}`}
          onClick={() => setChainMode(ElementChainMode.Render)}
        >
          Render Chain
        </Panel.PanelActionButton>
        <Panel.PanelActionButton
          active={`${chainMode === ElementChainMode.Source}`}
          onClick={() => setChainMode(ElementChainMode.Source)}
        >
          Source Chain
        </Panel.PanelActionButton>
      </Panel.PanelActionLayout>
      {chainMode === ElementChainMode.Render && (
        <Panel.PanelContentLayout>
          {renderList?.map((item, index) => (
            <InspectListItem<Item> key={index} {...item} />
          ))}
        </Panel.PanelContentLayout>
      )}

      {chainMode === ElementChainMode.Source && (
        <Panel.PanelContentLayout>
          {sourceList?.map((item, index) => (
            <InspectListItem<Item> key={index} {...item} />
          ))}
        </Panel.PanelContentLayout>
      )}
    </Panel.PanelRoot>
  );
};
