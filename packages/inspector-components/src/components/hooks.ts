import { createContext, useContext } from 'solid-js';

export const PopupContext = createContext<{
  popupRoot: ParentNode | undefined;
}>({
  popupRoot: document.body,
});

export const usePopupContext = () => useContext(PopupContext);
