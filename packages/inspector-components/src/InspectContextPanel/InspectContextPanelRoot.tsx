import { type ComponentType, customElement } from 'solid-element';
import { onMount, Show } from 'solid-js';
import {
  type DragPanelParams,
  type ItemInfo,
  PopupContext,
} from '../components/index.js';
import tailwindRoot from '../tailwind.less?inline';
import { createStore, css } from '../utils/index.js';
import { InspectPanel, type InspectPanelProps } from './InspectPanel.js';

export interface InspectContextPanelExpose<Item extends ItemInfo = ItemInfo> {
  show: (params: InspectContextPanelShowParams<Item>) => void;
  hide: () => void;
}

export interface InspectContextPanelElement<Item extends ItemInfo>
  extends HTMLElement,
    InspectContextPanelExpose<Item> {}

export interface InspectContextPanelShowParams<Item extends ItemInfo = ItemInfo>
  extends DragPanelParams {
  panelParams: InspectPanelProps<Item>;
}

type HostElement = HTMLElement & {
  style: CSSStyleDeclaration;
} & InspectContextPanelExpose;

export const InspectContextPanelRoot: ComponentType<Record<string, never>> = (
  _props,
  { element }
) => {
  type Store = Partial<InspectContextPanelShowParams> & {
    host?: HTMLElement;
    shadowRoot?: ShadowRoot;
    setHost: (roots: { host: HTMLElement; shadowRoot: ShadowRoot }) => void;
    initWithParams: (params: InspectContextPanelShowParams) => void;
    removePanel: () => void;
  };

  const store = createStore<Store>(({ set }) => ({
    setHost: (roots) => set(roots),
    initWithParams: (params) => set(params),
    removePanel: () =>
      set({
        panelParams: undefined,
        initialPosition: undefined,
      }),
  }));

  const show: InspectContextPanelExpose['show'] = (params) => {
    store.initWithParams(params);
  };

  const hide: InspectContextPanelExpose['hide'] = () => {
    store.removePanel();
  };

  onMount(() => {
    const shadowRoot = element.renderRoot as ShadowRoot | undefined;
    const host = shadowRoot?.host as HostElement | undefined;

    if (shadowRoot && host) {
      host.show = show;
      host.hide = hide;
      store.setHost({
        shadowRoot,
        host,
      });
    }
  });

  return (
    <>
      {/**
       * - when render in storybook, tailwind.css is build in storybook
       * - when build the package, tailwind.css is compile and extract to here by rollup & postcss
       */}
      <style>
        {tailwindRoot}
        {hostStyles}
      </style>

      <Show
        when={store.shadowRoot && store.initialPosition && store.panelParams}
      >
        <PopupContext.Provider
          value={{
            popupRoot: store.shadowRoot!,
          }}
        >
          <InspectPanel
            {...store.panelParams!}
            initialPosition={store.initialPosition!}
          />
        </PopupContext.Provider>
      </Show>
    </>
  );
};

const hostStyles = css`
  :host {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 10001000;
  }
`;

export const InspectContextPanelTagName = 'inspect-context-panel';

/**
 * that's also no-side-effect for tree-shaking,
 * because it will call again in `ContextPanel` constructor
 */
customElement(InspectContextPanelTagName, InspectContextPanelRoot);
