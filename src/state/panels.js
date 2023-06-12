import { atom, selector } from 'recoil';

import panels from '@/util/panelLookup';

const panelOrderState = atom({
  key: 'PanelOrderState',
  default: Object.keys(panels),
});

const panelShowInternalState = atom({
  key: 'PanelShowInternalState',
  default: Object.keys(panels).reduce(
    (obj, { id }) => ({ ...obj, [id]: false }),
    {}
  ),
});

const panelShowState = selector({
  key: 'PanelShowState',
  get: ({ get }) => get(panelShowInternalState),
  set: ({ get, set }, { id, show }) => {
    const current = get(panelShowInternalState);
    set(panelShowInternalState, { ...current, [id]: show });
  },
});

export { panelOrderState, panelShowState };
