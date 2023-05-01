import { QueueListIcon, RectangleStackIcon } from '@heroicons/react/24/outline';

const ToolbarSide = () => {
  return (
    <>
      <div className="_w-12 flex flex-col items-center gap-4 p-3 py-4">
        <div className="w-6">
          <QueueListIcon />
        </div>
        <div className="w-6">
          <RectangleStackIcon />
        </div>
      </div>
    </>
  );
};

export default ToolbarSide;