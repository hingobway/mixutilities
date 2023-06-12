import { useRecoilState } from 'recoil';
import { panelShowState } from '@/state/panels';

import panels from '@/util/panelLookup';

const ToolbarSide = () => {
  const [panelShow, setPanelShow] = useRecoilState(panelShowState);

  return (
    <>
      <div className="flex flex-col items-center gap-3 p-3 py-4">
        {Object.keys(panels).map((id, i) => {
          const {
            props: { icon: Icon },
          } = panels[id];
          return (
            <button
              key={i}
              onClick={() => setPanelShow({ id, show: !panelShow[id] })}
              className={`rounded-md p-1 ${
                panelShow[id]
                  ? `bg-zinc-700 opacity-100 hover:opacity-80`
                  : `bg-transparent hover:bg-zinc-700/60`
              }`}
            >
              <Icon className="w-6" />
            </button>
          );
        })}
      </div>
    </>
  );
};

export default ToolbarSide;
