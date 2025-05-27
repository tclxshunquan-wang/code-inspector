import { styled } from '#utils';

export const PanelContainer = styled.div({
  class: `
    inspector-panel-container
    flex flex-auto flex-col items-stretch justify-stretch overflow-hidden
    bg-bg-1  text-text-1 text-sm
  `,
});

export const PanelBody = styled.div({
  class: `
    inspector-panel-body
    flex items-stretch justify-stretch flex-auto
    min-h-0 min-w-0
  `,
});
