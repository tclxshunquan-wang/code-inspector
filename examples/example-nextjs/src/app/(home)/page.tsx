import { Suspense } from 'react';
import Home from './home';
import { Provider } from './provider';

export default function Pages() {
  return (
    <>
      <Suspense>
        <Provider />
      </Suspense>
      <Home />
    </>
  );
}
