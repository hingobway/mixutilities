import { useState, useEffect } from 'react';

import { useLogic, useWatch } from '@/hooks/logic';

import { asPanel } from './Panel';
import IconButton from './base/IconButton';

import {
  QueueListIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlayCircleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ViewfinderCircleIcon,
} from '@heroicons/react/24/outline';

const PANEL_PROPS = {
  id: 'macros',
  name: 'Macros',
  icon: QueueListIcon,
};
const PanelMacros = () => {
  const { sendLogic } = useLogic();

  return (
    <>
      <div className="flex h-full flex-row gap-1">
        {/* macros list container */}
        <div className="flex w-60 flex-row">
          {/* macro list action buttons */}
          <div className="flex flex-col justify-between p-1">
            {/* top buttons */}
            <div className="flex flex-col gap-2">
              <IconButton icon={PlusIcon} />
            </div>
            {/* bottom buttons */}
            <div className="flex flex-col gap-2">
              <IconButton icon={DocumentDuplicateIcon} />
              <IconButton icon={TrashIcon} red />
            </div>
          </div>
          {/* actual list box */}
          <div className="flex-1 rounded-md bg-zinc-900"></div>
        </div>
        {/* macro editor container */}
        <div className="flex flex-1 flex-row">
          {/* macro editor */}
          <div className="flex flex-1 flex-col rounded-md bg-zinc-900">
            {/* macro editor header */}
            <div className="flex flex-row justify-between rounded-t-md bg-zinc-400/20 px-3 py-2">
              {/* macro name editor */}
              <div className="text-sm">
                <span className="text-zinc-100/40">&ldquo;</span>
                <span
                  className="-mx-2 -my-1 rounded-md px-2 py-1 hover:bg-zinc-400/5 focus:bg-zinc-400/20 focus:outline-none"
                  contentEditable="true"
                  spellCheck="false"
                >
                  macro name
                </span>
                <span className="text-zinc-100/40">&rdquo;</span>
              </div>
              <div className="flex flex-row gap-2 text-sm uppercase">
                <div className="text-zinc-500">Trigger:</div>
                <div className="cursor-pointer text-sky-400">Mute Group 1</div>
              </div>
            </div>
            {/* macro actions list */}
            <div className="_bg-red-500/20 m-2 flex-1 rounded-lg"></div>
          </div>
          {/* macro editor action buttons */}
          <div className="mt-9 flex flex-col justify-between p-1">
            {/* top buttons */}
            <div className="flex flex-col gap-2">
              <IconButton icon={ViewfinderCircleIcon} />
              <IconButton icon={PlusCircleIcon} />
              <IconButton icon={MinusCircleIcon} />
            </div>
            {/* bottom buttons */}
            <div className="flex flex-col gap-2">
              <IconButton icon={PlayCircleIcon} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default asPanel(PanelMacros, PANEL_PROPS);
export { PANEL_PROPS };
