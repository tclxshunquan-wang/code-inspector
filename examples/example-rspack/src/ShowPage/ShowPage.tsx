import { useState } from 'react';
import { Inspector } from '@hyperse/inspector';

export const ShowPage = () => {
  const [active, setActive] = useState(false);

  return (
    <>
      12312312
      <Inspector
        active={active}
        onActiveChange={setActive}
        onClickElement={(e) => {
          console.log(e);
        }}
      />
      <button>测试</button>
    </>
  );
};
