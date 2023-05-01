import { useEffect, useState } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import {
  inputDeviceListState,
  outputDeviceListState,
  inputIDState,
  outputIDState,
  newMsgState,
} from '@/state/midi';

import useWS, { ReadyState } from 'react-use-websocket';

import Wrapper from '@/components/Wrapper';
import PanelMacros from '@/components/PanelMacros';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

const PORT = 54200;
const WS_URL = `ws://localhost:${PORT}`;

export default function Home() {
  const [connectStatus, setConnectStatus] = useState(false);
  const [, setInputDeviceList] = useRecoilState(inputDeviceListState);
  const [, setOutputDeviceList] = useRecoilState(outputDeviceListState);
  const inputDevice = useRecoilValue(inputIDState);
  const outputDevice = useRecoilValue(outputIDState);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWS(WS_URL, {
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
    reconnectAttempts: 20,
    reconnectInterval: 3000,
  });

  // on connect:
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      // connected
      setConnectStatus(true);
      sendJsonMessage({ type: 'announce' });
    }
    if (readyState == ReadyState.CLOSED) {
      // disconnected
      setConnectStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState]);

  // on message:
  useEffect(() => {
    if (lastJsonMessage !== null) {
      switch (lastJsonMessage.type) {
        case 'device_list':
          lastJsonMessage.data.input.unshift([-1, 'select input device']);
          lastJsonMessage.data.output.unshift([-1, 'select output device']);
          setInputDeviceList(lastJsonMessage.data.input);
          setOutputDeviceList(lastJsonMessage.data.output);
          break;
        default:
          console.log(lastJsonMessage);
      }
    }
  }, [lastJsonMessage]);

  // receive sends from other modules
  const [newMsg, setNewMsg] = useRecoilState(newMsgState);
  useEffect(() => {
    if (newMsg != null) {
      sendJsonMessage(newMsg);
      setNewMsg(null);
    }
  }, [newMsg]);

  // on MIDI device change:
  useEffect(() => {
    if (inputDevice > -1 && outputDevice > -1)
      sendJsonMessage({
        type: 'set_midi_devices',
        data: { input: inputDevice, output: outputDevice },
      });
  }, [inputDevice, outputDevice]);

  const handleButton = (e) => {
    const { innerText: text } = e.target;
    sendJsonMessage({ type: 'message', data: { text } });
  };
  const sendM = (n) => {
    sendJsonMessage({ type: 'send_midi_msg', data: { preset: n } });
  };

  return (
    <>
      <main className="t">
        <Wrapper>
          <div className="flex h-full flex-col">
            <PanelMacros />
            <div className="mx-4 h-0.5 bg-zinc-900/70"></div>
            <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
              blank panel.
            </div>
          </div>
        </Wrapper>

        {/* connect status */}
        <div
          className={`fixed bottom-1 right-2 text-sm ${
            connectStatus ? `text-green-600` : `text-amber-400`
          }`}
        >
          {connectStatus ? `connected` : `connecting...`}
        </div>
      </main>
    </>
  );
}
