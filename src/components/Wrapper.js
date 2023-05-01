import ToolbarTop from './ToolbarTop';
import ToolbarSide from './ToolbarSide';

const Wrapper = ({ children }) => {
  return (
    <>
      <div className="flex h-full flex-col">
        {/* top toolbar */}
        <ToolbarTop />
        <div className="mx-3 h-0.5 bg-zinc-900"></div>
        {/* main + sidebar */}
        <div className="flex flex-1 flex-row">
          {/* side toolbar */}
          <ToolbarSide />
          <div className="mb-3 w-0.5 bg-zinc-900"></div>
          {/* MAIN */}
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Wrapper;
