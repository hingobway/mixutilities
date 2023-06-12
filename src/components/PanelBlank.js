import { asPanel } from '@/components/Panel';

import { CubeTransparentIcon } from '@heroicons/react/24/outline';

const PANEL_PROPS = {
  id: 'blank',
  name: 'Blank Panel',
  icon: CubeTransparentIcon,
};
const PanelBlank = () => {
  return (
    <>
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-zinc-600">blank panel.</span>
      </div>
    </>
  );
};

export default asPanel(PanelBlank, PANEL_PROPS);
export { PANEL_PROPS };
