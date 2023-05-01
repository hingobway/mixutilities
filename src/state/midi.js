import { atom /* selector */ } from 'recoil';

const inputDeviceListState = atom({
  key: 'InputDeviceList',
  default: [[-1, 'select input device']],
});
const outputDeviceListState = atom({
  key: 'OutputDeviceList',
  default: [[-1, 'select output device']],
});

const inputIDState = atom({
  key: 'InputID',
  default: -1,
});
const outputIDState = atom({
  key: 'OutputID',
  default: -1,
});

// const inputDeviceState = selector({
//   key: 'InputDevice',
//   get: ({ get }) => {
//     const inputID = get(inputIDState);
//     const inputDeviceList = get(inputDeviceListState);
//     return inputDeviceList.find((device) => device[0] === inputID);
//   },
// });
// const outputDeviceState = selector({
//   key: 'OutputDevice',
//   get: ({ get }) => {
//     const outputID = get(outputIDState);
//     const outputDeviceList = get(outputDeviceListState);
//     return outputDeviceList.find((device) => device[0] === outputID);
//   },
// });

export {
  inputDeviceListState,
  outputDeviceListState,
  inputIDState,
  outputIDState,
};
