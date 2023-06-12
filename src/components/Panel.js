import { useState, useRef } from 'react';

import { motion, useDragControls } from 'framer-motion';

import { useRecoilState } from 'recoil';
import { panelOrderState, panelShowState } from '@/state/panels';

import { XMarkIcon } from '@heroicons/react/24/outline';

const Panel = ({ children, panelProps: { name, icon: Icon }, id, show }) => {
  const [, setPanelOrder] = useRecoilState(panelOrderState);
  const [, setPanelShow] = useRecoilState(panelShowState);

  const [isDragging, setIsDragging] = useState(false);
  const dragControls = useDragControls();
  const panelRef = useRef(null);

  const dragUpdate = (e, info) => {
    // info contains:
    //  - point.x/y  relative to device or page
    //  - delta.x/y  distance moved since last event
    //  - offset.x/y distance from start of drag
    //  - velocity.x/y current velocity

    console.log(`dragged ${name}`, Math.abs(info.offset.y));
  };
  const dragDone = (e, info) => {
    setIsDragging(false);

    // TODO need to fix this so that you don't jump invisible panels when one is hidden.
    //     ...ie run this over an array of only visible panels (rework the atomic state)

    const delta = Math.abs(info.offset.y);
    if (delta > 180)
      setPanelOrder((prev) => {
        const newOrder = [...prev];
        const cur = newOrder.indexOf(id);
        if (delta / info.offset.y === -1 && cur > 0) {
          [newOrder[cur], newOrder[cur - 1]] = [
            newOrder[cur - 1],
            newOrder[cur],
          ];
        } else if (cur < newOrder.length - 1) {
          [newOrder[cur], newOrder[cur + 1]] = [
            newOrder[cur + 1],
            newOrder[cur],
          ];
        }
        return newOrder;
      });
  };

  return (
    <>
      <motion.div
        drag="y"
        dragSnapToOrigin
        dragListener={false}
        dragControls={dragControls}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={dragDone}
        onDrag={dragUpdate}
        ref={panelRef}
        className={`flex flex-1 flex-row p-4 ${
          isDragging
            ? `z-50 !cursor-grabbing bg-zinc-400/10 opacity-60`
            : `z-auto bg-transparent opacity-100`
        }`}
        style={show ? {} : { display: 'none' }}
      >
        {/* panel content */}
        <div className="flex-1">{children}</div>

        {/* panel sidebar */}
        <div className="ml-3 mr-2 flex flex-col items-center text-zinc-400">
          {/* panel icon */}
          <div
            className={`${isDragging ? `cursor-grabbing` : `cursor-grab`}`}
            onPointerDown={(e) => dragControls.start(e)}
          >
            <Icon className="w-5" />
          </div>
          {/* panel name & nav */}
          <div className="flex flex-1 flex-col items-center justify-end gap-3">
            <div
              className="pl-0.5 lowercase"
              style={{ writingMode: 'vertical-lr' }}
            >
              {name}
            </div>
            <button
              onClick={() => setPanelShow({ id, show: false })}
              className="-m-0.5 rounded-md bg-transparent p-0.5 text-zinc-400/80 hover:bg-red-600/50 hover:text-zinc-200/90"
            >
              <XMarkIcon className="w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

const asPanel = (Child, panelProps) => {
  const PanelWrapper = (passedProps) => (
    <Panel {...{ panelProps }} {...passedProps}>
      <Child />
    </Panel>
  );
  return PanelWrapper;
};

export { asPanel };
