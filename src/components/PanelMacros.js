import { useState, useEffect } from 'react';

import { useRecoilState } from 'recoil';
import { newMsgState } from '@/state/midi';

import Button from '@/components/base/Button';

import { TrashIcon } from '@heroicons/react/24/outline';

const PanelMacros = () => {
  const [record, setRecord] = useState(false);
  const [, setNewMsg] = useRecoilState(newMsgState);

  useEffect(() => {
    setNewMsg({ type: 'set_record', data: { on: record } });
    // setNewMsg({ type: 'send_midi_msg', data: { preset: !record } });
  }, [record]);

  const clearMacro = () => {
    setNewMsg({ type: 'clear_macro' });
  };

  return (
    <>
      <div className="relative flex flex-1 items-center justify-center p-4">
        <div className="absolute right-4 top-4 flex flex-row gap-2 text-sm uppercase">
          <div className="text-zinc-500">Trigger:</div>
          <div className="text-sky-400">Mute Group 1</div>
        </div>
        {/* record controls */}
        <div className="flex flex-row gap-4 rounded-xl border border-zinc-100/10 bg-zinc-700/30 p-4">
          {/* record icon */}
          <div className=" relative my-auto h-8 w-8 rounded-full bg-zinc-200 p-1.5">
            <div
              className={`h-full w-full flex-1 rounded-full shadow-inner ${record ? `bg-red-500 animate-pulse` : `bg-zinc-400 animate-none`
                }`}
            ></div>
          </div>
          {/* toggle button */}
          <Button
            className="hover:!bg-red-800 !bg-red-700"
            onClick={() => setRecord(!record)}
          >
            Toggle Recording
          </Button>
          <Button
            className="hover:!bg-amber-800 !bg-amber-700 !p-2"
            onClick={clearMacro}
          >
            <TrashIcon className="w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PanelMacros;
