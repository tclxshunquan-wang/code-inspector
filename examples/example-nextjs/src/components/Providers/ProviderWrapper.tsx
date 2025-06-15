'use client';

import { HeroUIProvider } from '@heroui/react';

export const ProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <HeroUIProvider>{children}</HeroUIProvider>;
};
