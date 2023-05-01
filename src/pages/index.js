import { useEffect, useState } from 'react';

import useWS, { ReadyState } from 'react-use-websocket';

import Button from '@/components/base/Button';

import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';

const PORT = 54200;
const WS_URL = `ws://localhost:${PORT}`;

export default function Home() {
  const [connectStatus, setConnectStatus] = useState(false);

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
      console.log(lastJsonMessage);
    }
  }, [lastJsonMessage]);

  const handleButton = (e) => {
    const { innerText: text } = e.target;
    sendJsonMessage({ type: 'message', data: { text } });
  };
  const unknownSend = () => {
    sendJsonMessage({ type: 'strange', data: { text: 'hello' } });
  };

  return (
    <>
      <main className="t">
        {/* header bar */}
        <div className="flex flex-row justify-between bg-zinc-900 p-2 px-4">
          {/* header left side */}
          <div className="flex flex-row items-center gap-4">
            <AdjustmentsVerticalIcon className="h-6" />
            <div className="text-xl">MixUtilities</div>
          </div>
          {/* header right side */}
          <div className="flex flex-row gap-2">
            <Button onClick={handleButton}>Hello</Button>
            <Button onClick={handleButton}>World</Button>
            <Button className="!bg-red-700" onClick={unknownSend}>
              something new...
            </Button>
          </div>
        </div>

        {/* main content */}
        <div className="flex h-full items-center justify-center text-sm text-zinc-500">
          content here.
        </div>

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
