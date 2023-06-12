import { useState, useEffect } from 'react';

import { useLogic, useWatch } from '@/hooks/logic';

import { DocumentIcon } from '@heroicons/react/24/outline';

import Dropdown from '@/components/base/Dropdown';

const ph_in = 'select input device';
const ph_out = 'select output device';

const ToolbarTop = () => {
  const [inputDevices, setInputDevices] = useState([[-1, ph_in]]);
  const [outputDevices, setOutputDevices] = useState([[-1, ph_out]]);
  const [inputID, setInputID] = useState(-1);
  const [outputID, setOutputID] = useState(-1);

  const { sendLogic } = useLogic();
  useWatch('device_list', ({ input, output }) => {
    input.unshift([-1, ph_in]);
    output.unshift([-1, ph_out]);
    setInputDevices(input);
    setOutputDevices(output);
  });

  // on MIDI device change:
  useEffect(() => {
    if (inputID > -1 && outputID > -1)
      sendLogic('set_midi_devices', { input: inputID, output: outputID });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputID, outputID]);

  return (
    <>
      <div className="flex h-11 flex-row justify-between px-4 py-2">
        <div className="flex flex-row items-center gap-2 px-2">
          <div className="w-5">
            <DocumentIcon />
          </div>
          <div className="t">my file</div>
        </div>
        {/* MIDI device selection */}
        <div className="flex flex-row gap-2">
          {/* input devices */}
          <Dropdown
            list={inputDevices}
            selected={inputID}
            onChange={setInputID}
            selectedName={inputDevices.find((it) => it[0] === inputID)[1]}
            itValue={(it) => it[0]}
            itName={(it) => it[1]}
          />
          {/* output devices */}
          <Dropdown
            list={outputDevices}
            selected={outputID}
            onChange={setOutputID}
            selectedName={outputDevices.find((it) => it[0] === outputID)[1]}
            itValue={(it) => it[0]}
            itName={(it) => it[1]}
          />
        </div>
      </div>
    </>
  );
};

export default ToolbarTop;
