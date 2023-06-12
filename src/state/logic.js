import { atom } from 'recoil';

const connectStatusState = atom({
  key: 'ConnectStatusState',
  default: false,
});

export {connectStatusState};