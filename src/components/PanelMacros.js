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
        <div className="flex flex-row gap-4">
          {/* record icon */}
          <div className=" relative my-auto h-8 w-8 rounded-full bg-zinc-200 p-1.5">
            <div
              className={`h-full w-full flex-1 rounded-full shadow-inner ${
                record ? `bg-red-500` : `bg-zinc-400`
              }`}
            ></div>
          </div>
          {/* toggle button */}
          <Button
            className="bg-red-700 hover:bg-red-800"
            onClick={() => setRecord(!record)}
          >
            Toggle Recording
          </Button>
          <Button className="!p-2" onClick={clearMacro}>
            <TrashIcon className="w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default PanelMacros;
