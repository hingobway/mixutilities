import { asPanel } from '@/components/Panel';
import Button from '@/components/base/Button';

import { useLogic } from '@/hooks/logic';

import { RectangleStackIcon } from '@heroicons/react/24/outline';

const PANEL_PROPS = {
  id: 'multis',
  name: 'Mutli-select',
  icon: RectangleStackIcon,
};
const PanelMultis = () => {
  const { sendLogic } = useLogic();

  return (
    <>
      <div className="flex h-full items-center justify-center gap-2">
        <Button onClick={() => sendLogic('send_midi_msg', { id: 2 })}>
          Send MG 2
        </Button>
        <Button onClick={() => sendLogic('send_midi_msg', { id: 3 })}>
          Send MG 3
        </Button>
      </div>
    </>
  );
};

export default asPanel(PanelMultis, PANEL_PROPS);
export { PANEL_PROPS };
