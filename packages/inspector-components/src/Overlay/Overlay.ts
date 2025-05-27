import { customElement } from 'solid-element';
import {
  type BoxSizing,
  getBoundingRect,
  type Rect,
} from '../floating/index.js';
import {
  InspectorOverlay,
  type InspectorOverlayElement,
  InspectorOverlayTagName,
} from './InspectorOverlay.js';
import { getElementDimensions } from './utils.js';

export class Overlay {
  window: Window;
  overlay: InspectorOverlayElement;

  constructor() {
    // ensure register with no-side-effect tree-shaking
    customElement(InspectorOverlayTagName, InspectorOverlay);

    // Find the root window, because overlays are positioned relative to it.
    const currentWindow = window.__REACT_DEVTOOLS_TARGET_WINDOW__ || window;
    this.window = currentWindow;

    const doc = currentWindow.document;
    this.overlay = document.createElement(InspectorOverlayTagName);
    // this.overlay.setAttribute('popover', '')
    doc.body.appendChild(this.overlay);
  }

  public inspect<Element = HTMLElement>({
    element,
    title,
    info,
    getBoxSizing = getElementDimensions,
    getBoundingRect: _getBoundingRect = getBoundingRect,
  }: {
    element?: Element;
    title?: string;
    info?: string;
    /**
     * default as `window.getComputedStyle(element)`
     */
    getBoxSizing?: (element: Element) => BoxSizing;
    /**
     * default as `element.getBoundingClientRect()`
     */
    getBoundingRect?: (element: Element) => Rect;
  }) {
    // @TODO: open with [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
    return this.overlay.inspect({
      element,
      title,
      info,
      getBoxSizing,
      getBoundingRect: _getBoundingRect,
    });
  }

  public async hide() {
    await this.overlay.hide();
  }

  public remove() {
    this.overlay.remove();
  }
}
