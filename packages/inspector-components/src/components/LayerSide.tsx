import { styled } from '../utils/index.js';

export const LayerSide = styled.div({
  class: `
    flex flex-none flex-col items-stretch justify-stretch
    p-1 w-[41px] border-r border-border box-border
  `,
});

export const Title = styled.div({
  class: `
    flex flex-none items-center justify-center text-sm
    h-8 text-text-0 truncate
  `,
});

export const Divider = styled.div({
  class: `
    flex flex-none items-center justify-between gap-1.5 text-xs
    w-6 h-[1px] mb-1 mx-auto bg-border
  `,
});

export const LayerList = styled.div({
  class: `
    flex flex-auto flex-col items-stretch justify-start
    no-scrollbar overflow-y-auto box-content
    text-text-2 select-none  relative
  `,
});

export const LayerItem = styled.div({
  class: `
    flex flex-none items-center justify-center
    aria-selected:sticky aria-selected:top-0 aria-selected:bottom-0 aria-selected:z-10
    h-8 bg-bg-1 text-text-2 font-mono truncate
  `,
});

export const LayerItemText = styled.span({
  class: `opacity-85`,
});
