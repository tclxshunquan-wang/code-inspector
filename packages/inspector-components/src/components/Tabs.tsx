import type { ValidComponent } from 'solid-js';
import { splitProps } from 'solid-js';
import { type PolymorphicProps } from '@kobalte/core/polymorphic';
import * as TabsPrimitive from '@kobalte/core/tabs';
import { cn } from '../utils/index.js';

export const Tabs = TabsPrimitive.Root;

type TabsListProps<T extends ValidComponent = 'div'> =
  TabsPrimitive.TabsListProps<T> & {
    class?: string | undefined;
  };

export const List = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TabsListProps<T>>
) => {
  const [local, others] = splitProps(props as TabsListProps, ['class']);
  return (
    <TabsPrimitive.List
      class={cn(
        `flex h-10 w-full items-center justify-start gap-2 py-1`,
        local.class
      )}
      {...others}
    />
  );
};

type TabsTriggerProps<T extends ValidComponent = 'button'> =
  TabsPrimitive.TabsTriggerProps<T> & {
    class?: string | undefined;
  };

export const Trigger = <T extends ValidComponent = 'button'>(
  props: PolymorphicProps<T, TabsTriggerProps<T>>
) => {
  const [local, others] = splitProps(props as TabsTriggerProps, ['class']);
  return (
    <TabsPrimitive.Trigger
      class={cn(
        `text-text-3 hover:text-text-2 data-[selected]:text-text-0 inline-flex w-[100px] flex-initial items-center justify-start rounded px-1 py-1 text-sm font-normal whitespace-nowrap select-none hover:font-medium hover:opacity-80 disabled:pointer-events-none data-[selected]:font-medium`,
        local.class
      )}
      {...others}
    />
  );
};

type TabsContentProps<T extends ValidComponent = 'div'> =
  TabsPrimitive.TabsContentProps<T> & {
    class?: string | undefined;
  };

export const Content = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TabsContentProps<T>>
) => {
  const [local, others] = splitProps(props as TabsContentProps, ['class']);
  return (
    <TabsPrimitive.Content
      class={cn(
        `flex flex-auto items-stretch justify-stretch focus-visible:outline-none`,
        local.class
      )}
      {...others}
    />
  );
};

type TabsIndicatorProps<T extends ValidComponent = 'div'> =
  TabsPrimitive.TabsIndicatorProps<T> & {
    class?: string | undefined;
  };

export const Indicator = <T extends ValidComponent = 'div'>(
  props: PolymorphicProps<T, TabsIndicatorProps<T>>
) => {
  const [local, others] = splitProps(props as TabsIndicatorProps, ['class']);
  return (
    <TabsPrimitive.Indicator
      class={cn(
        // "duration-250ms absolute transition-all data-[orientation=horizontal]:-bottom-px data-[orientation=vertical]:-right-px data-[orientation=horizontal]:h-[2px] data-[orientation=vertical]:w-[2px]",
        local.class
      )}
      {...others}
    />
  );
};
