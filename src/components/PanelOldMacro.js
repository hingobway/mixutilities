import { useState, useEffect } from 'react';

import { useLogic, useWatch } from '@/hooks/logic';

import { asPanel } from './Panel';
import Button from '@/components/base/Button';

import { LifebuoyIcon, TrashIcon } from '@heroicons/react/24/outline';

const PANEL_PROPS = {
  id: 'old-macros',
  name: 'single macro',
  icon: LifebuoyIcon,
};
const PanelMacros = () => {
  const { sendLogic } = useLogic();

  const [record, setRecord] = useState(false);
  useEffect(()=>{
    sendLogic('record_status');
  },[]);
  useWatch('record_status', ({ on }) => setRecord(on));

  const toggleRecord = () => {
    sendLogic('set_record', { on: !record });
  };
  const clearMacro = () => {
    sendLogic('clear_macro');
  };

  return (
    <>
      <div className="relative flex h-full flex-col items-center justify-center p-4">
        <div className="absolute right-4 top-4 flex flex-row gap-2 text-sm uppercase">
          <div className="text-zinc-500">Trigger:</div>
          <div className="text-sky-400">Mute Group 1</div>
        </div>
        {/* record controls */}
        <div className="flex flex-row gap-4 rounded-xl border border-zinc-100/10 bg-zinc-700/30 p-4">
          {/* record icon */}
          <div className=" relative my-auto h-8 w-8 rounded-full bg-zinc-200 p-1.5">
            <div
              className={`h-full w-full flex-1 rounded-full shadow-inner ${
                record ? `animate-pulse bg-red-500` : `animate-none bg-zinc-400`
              }`}
            ></div>
          </div>
          {/* toggle button */}
          <Button
            className="!bg-red-700 hover:!bg-red-800"
            onClick={toggleRecord}
          >
            Toggle Recording
          </Button>
          <Button
            className="!bg-amber-700 !p-2 hover:!bg-amber-800"
            onClick={clearMacro}
          >
            <TrashIcon className="w-5" />
          </Button>
        </div>
        {/* <div className="mt-6">
          <Button onClick={() => sendLogic('send_midi_msg', { id: 2 })}>
            Send MG 2
          </Button>
        </div> */}
      </div>
    </>
  );
};

export default asPanel(PanelMacros, PANEL_PROPS);
export { PANEL_PROPS };
