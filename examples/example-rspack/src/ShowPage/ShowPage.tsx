import { useState } from 'react';
import { Inspector } from '@hyperse/inspector';

export const ShowPage = () => {
  const [active, setActive] = useState(false);

  return (
    <>
      <Inspector
        keys={['Shift', 'c']}
        active={active}
        onActiveChange={setActive}
        onClickElement={(e) => {
          console.log(e);
        }}
      />
      <div>12312312</div>
      <button>测试</button>
    </>
  );
};
