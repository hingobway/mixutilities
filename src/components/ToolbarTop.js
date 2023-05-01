import { useRecoilValue, useRecoilState } from 'recoil';
import {
  inputDeviceListState,
  outputDeviceListState,
  inputIDState,
  outputIDState,
} from '@/state/midi';

import { Listbox } from '@headlessui/react';

import {
  ChevronUpDownIcon,
  CheckIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';

import Dropdown from '@/components/base/Dropdown';

const ToolbarTop = () => {
  const inputDevices = useRecoilValue(inputDeviceListState);
  const outputDevices = useRecoilValue(outputDeviceListState);
  const [inputID, setInputID] = useRecoilState(inputIDState);
  const [outputID, setOutputID] = useRecoilState(outputIDState);

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
