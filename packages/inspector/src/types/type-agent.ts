import type { Fiber } from 'react-reconciler';
import type { TagItem } from '@hyperse/inspector-component';
import type { CodeInfo } from './type-code.js';

type MaybePromise<T> = T | Promise<T>;

/**
 * Pointer(mouse/touch) position
 * use in {@link InspectAgent.getTopElementFromPointer}
 */
export interface Pointer {
  /**
   * coordinate always relative to viewport
   * {@link PointerEvent.clientX}
   */
  clientX: number;
  /**
   * coordinate always relative to viewport
   * {@link PointerEvent.clientY}
   */
  clientY: number;
}

/**
 * For Inspector Component itself without InspectorAgent, it's react-agnostic.
 * the InspectAgent design to work together with different renderer binding (like React DOM, React Native, React Three.js etc.)
 *
 * An Agent need implement these functions:
 * - setup event listener to collect user interaction operation  (like Pointer Down/Up/Over / Click etc.)
 *   and its target element  (like DOM, Three.js etc.)
 * - collect inspection info from its element  (like name, code source position etc.)
 * - show/hide indicator UI on element  (like highlight element, show tooltip for name or code position etc.)
 *
 * > add in version `v2.1.0`
 */
export interface InspectAgent<Element> {
  /**
   * trigger when user activate inspector in <Inspector/>
   *
   * Agent need setup event listeners to collect user interaction on their target renderer (like DOM, React Native, React Three.js etc.)
   */
  activate: (params: {
    /**
     * when hovered onto a element
     * trigger it like on PointerMove on PointerOver event.
     */
    onHover: (params: { element: Element; pointer: PointerEvent }) => void;
    /**
     * Just throw the `PointerDown` event to Inspector,
     *   that's no need to stopPropagation or preventDefault in agent, Inspector will auto stop it when agent is in active.
     * Normally, the `PointerDown` event will stop by Inspector to prevent the default behavior like text selection,
     *   and the `Click` event will use to trigger the inspection and remove event listeners (by deactivate agent).
     */
    onPointerDown: (params: {
      element?: Element;
      pointer: PointerEvent;
    }) => void;
    /**
     * just throw the `client` event to Inspector,
     *   that's no need to stopPropagation or preventDefault in agent, Inspector will auto stop it when agent is in active.
     * Normally, the `PointerDown` event will stop by Inspector to prevent the default behavior like text selection,
     *   and the `Click` event will use to trigger the inspection and remove event listeners (by deactivate agent).
     */
    onClick: (params: { element?: Element; pointer: PointerEvent }) => void;
  }) => void;

  /**
   * trigger when user deactivate inspector in <Inspector/>,
   *
   * to clear agent's indicators, remove event listeners, release resources and reset states
   */
  deactivate: () => void;

  /**
   * get the top layer element for coordinate,
   *
   * design to get hovered element from initial pointer position then trigger Inspector at first.
   *
   * behaviors like {@link Document.elementFromPoint}
   */
  getTopElementFromPointer?: (
    pointer: Pointer
  ) => MaybePromise<Element | undefined | null>;

  /**
   * get the top element on different floating/overlay top layer for coordinate,
   * the return elements should ordered from the topmost to the bottommost layer by visually.
   *
   * design to list different overlay entities on context-menu panel.
   *
   * Note that its behaviors **IS NOT** like {@link Document.elementsFromPoint}
   * (which return all elements on the render tree)
   */
  getTopElementsFromPointer?: (pointer: Pointer) => MaybePromise<Element[]>;

  /**
   * check whether the input element is a valid target element for the current agent.
   * the "input element" will typical returned from other InspectAgent's {@link getRenderChain} / {@link getSourceChain}
   */
  isAgentElement: (element: unknown) => element is Element;

  /**
   * get elements from input element upward to render root.
   *
   * the each `yield` {@link Element} is parent of input element, and the previous parent in next.
   *
   * the `return` value of generator is the upper element of agent's render tree root element,
   *   - so the returned element should not be {@link Element}, but the outside parent of the root element.
   *   - if agent's renderer is the top root of whole app, just return `undefined | null`.
   *
   *
   * e.g. if fetching source-chain from `<Child>'s` element with this source code:
   *
   * ```tsx
   * const Root = () => (
   *   <div id=1 >
   *     <Parent>
   *       <p id=2 >
   *         <Child />
   *       </p>
   *     </Parent>
   *   </div>
   * )
   *
   * const Parent = (children) => (
   *   <div id=3 >
   *     {children}
   *   </div>
   * )
   *
   * const Child = () => <div id=child />
   * ```
   *
   * will expect to get chain:
   *
   * ```tsx
   * [
   *   <div id=child >,
   *   <Child>,
   *   <p id=2 >,
   *   <div id=3 >,
   *   <Parent>,
   *   <div id=1 >,
   *   <Root>,
   * ]
   * ```
   */
  getRenderChain(element: Element): InspectChainGenerator<Element>;

  /**
   * like {@link getRenderChain}, get elements from input element upward to render root,
   *   - but base on source-code structure order rather than render structure order,
   *   - and only yield valid elements which considered have a valid name, source code position, or you want show it in the inspected list.
   *
   * e.g. if fetching source-chain from `<Child>'s` element with this source code:
   *
   * ```tsx
   * const Root = () => (
   *   <div id=1 >
   *     <Parent>
   *       <p id=2 >
   *         <Child />
   *       </p>
   *     </Parent>
   *   </div>
   * )
   *
   * const Parent = (children) => (
   *   <div id=3 >
   *     {children}
   *   </div>
   * )
   *
   * const Child = () => <div id=child />
   * ```
   *
   * will expect to get chain:
   *
   * ```tsx
   * [
   *   <div id=child >,
   *   <Child>,
   *   <Root>,
   * ]
   * ```
   */
  getSourceChain(element: Element): InspectChainGenerator<Element>;

  /**
   * get the element display name and title for show in indicator UI
   */
  getNameInfo: (element: Element) =>
    | undefined
    | {
        /** element's constructor name */
        name: string;
        /** display to describe the element as short */
        title: string;
      };

  findCodeInfo: (element: Element) => CodeInfo | undefined;

  /**
   * [optional] find the nearest react fiber from the element's render tree,
   *   only use for emit to Inspector's user callback.
   */
  findElementFiber?: (element: Element) => Fiber | undefined;

  /**
   * show a indicator UI for the element on page
   */
  indicate: (params: {
    element: Element;
    codeInfo?: CodeInfo;
    pointer?: PointerEvent;
    name?: string;
    title?: string;
  }) => void;

  /**
   * hide agent's indicator UI
   */
  removeIndicate: () => void;
}

export type InspectChainGenerator<Element> = Generator<
  InspectChainItem<Element>,
  UpperRootElement | undefined | null,
  void
>;

type UpperRootElement = any;

/**
 * chain item data structure of {@link InspectAgent.getRenderChain} / {@link InspectAgent.getSourceChain}
 */
export interface InspectChainItem<Element> {
  agent: InspectAgent<Element>;
  /**
   * for show indicator UI like hovered element
   *
   * {@link InspectAgent.indicate}
   */
  element?: Element | null;
  /**
   * for show in chain list,
   * typically display element's name
   */
  title: string;
  /**
   * for show in chain list,
   * typically display element code source path
   */
  subtitle?: string;
  /**
   * for show in chain list,
   * typically display some marks like `Memo` / `ForwardRef`
   *   or some DOM attributes like `id` / `class`
   */
  tags?: TagItem[];
  /** for open in editor */
  codeInfo?: CodeInfo;
}
