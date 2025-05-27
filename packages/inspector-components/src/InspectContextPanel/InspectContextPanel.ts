import {
  filter,
  fromEvent,
  merge,
  type Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { customElement } from 'solid-element';
import { type ItemInfo, PointerButton } from '../components/index.js';
import {
  type InspectContextPanelElement,
  InspectContextPanelRoot,
  type InspectContextPanelShowParams,
  InspectContextPanelTagName,
} from './InspectContextPanelRoot.js';

export class InspectContextPanel<Item extends ItemInfo = ItemInfo> {
  #panel: InspectContextPanelElement<Item> | undefined;
  #clickOutsideCallbacks = new Set<() => void>();
  #clickOutsideSubscription?: Subscription;

  constructor() {
    // ensure register with no-side-effect tree-shaking
    customElement(InspectContextPanelTagName, InspectContextPanelRoot);

    // Find the root window, because overlays are positioned relative to it.
    const currentWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;

    const doc = currentWindow.document;
    this.#panel = document.createElement(InspectContextPanelTagName);
    // this.#panel!.setAttribute('popover', '')
    doc.body.appendChild(this.#panel!);
  }

  public show(
    params: InspectContextPanelShowParams<Item> & {
      onClickOutside?: () => void;
    }
  ) {
    // @TODO: open with [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
    this.#panel?.show(params);

    if (!params.onClickOutside) {
      return;
    }

    this.#clickOutsideCallbacks.add(params.onClickOutside);
    this.listenClickOutside();
  }

  public hide() {
    this.#clickOutsideSubscription?.unsubscribe();
    this.#clickOutsideSubscription = undefined;
    this.#panel?.hide();
  }

  public remove() {
    this.hide();
    this.#panel?.remove();
    this.#panel = undefined;
  }

  private checkPointerOutside = (event: MouseEvent): boolean => {
    if (event.button !== PointerButton.Left) {
      return false;
    }

    const target = event.target as HTMLElement;
    if (!this.#panel) {
      // if panel is destroyed, always treat as outside to do cleanup
      return true;
    }

    // if the click inside the panel,
    // `event.target` will always be the host element itself in web-components,
    // while the `event.composedPath()[0]` will be the actual clicked element inside the shadow-root
    return !(target === this.#panel);
  };

  private listenClickOutside = () => {
    if (
      this.#clickOutsideSubscription &&
      !this.#clickOutsideSubscription.closed
    ) {
      return;
    }

    this.#clickOutsideSubscription = fromEvent<MouseEvent>(
      window,
      'pointerdown',
      { capture: true }
    )
      .pipe(
        filter(this.checkPointerOutside),
        tap(stopAndPreventEvent),
        switchMap(() =>
          merge(
            fromEvent(window, 'pointerup', { capture: true }).pipe(
              tap(stopAndPreventEvent)
            ),
            fromEvent(window, 'click', { capture: true }).pipe(
              tap(stopAndPreventEvent),
              tap(() => {
                const callbacks = this.#clickOutsideCallbacks;
                callbacks.forEach((callback) => callback());
                // callbacks should hide the panel which will remove the event listener
              })
            )
          )
        )
      )
      .subscribe();
  };
}

const stopAndPreventEvent = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
};
