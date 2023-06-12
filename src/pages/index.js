import { useState, useEffect } from 'react';

import { useRecoilValue } from 'recoil';
import { connectStatusState } from '@/state/logic';
import { panelOrderState, panelShowState } from '@/state/panels';

import Divider from '@/components/base/Divider';
import Wrapper from '@/components/Wrapper';
import { panelLookup } from '@/util/panelLookup';

export default function Home() {
  const connectStatus = useRecoilValue(connectStatusState);
  const panels = useRecoilValue(panelOrderState);
  const panelShow = useRecoilValue(panelShowState);
  // const [visiblePanels, setVisiblePanels] = useState([]);
  // useEffect(() => {
  //   setVisiblePanels(panels.filter((id) => panelShow[id]));
  // }, [panels, panelShow]);

  return (
    <>
      <main className="t">
        <Wrapper>
          <div className="flex h-full flex-col">
            {!panels.filter((id) => panelShow[id]).length&&(
              <div className="flex-1 flex justify-center items-center text-center">
                <div className="text-sm text-zinc-600">Choose a panel on the left.</div>
              </div>
            )}
            {panels.map((panelID, i) => {
              const { component: Panel } = panelLookup(panelID);
              return (
                <>
                  <Panel key={i} id={panelID} show={panelShow[panelID]} />
                  {/* {i < panels.length - 1 ? <Divider /> : null} */}
                  <Divider
                    style={panelShow[panelID] ? {} : { display: 'none' }}
                  />
                </>
              );
            })}
          </div>
        </Wrapper>

        {/* connect status */}
        <div
          className={`fixed bottom-1 left-2 text-sm ${
            connectStatus ? `text-green-600` : `text-amber-400`
          }`}
        >
          {connectStatus ? `connected` : `connecting...`}
        </div>
      </main>
    </>
  );
}
