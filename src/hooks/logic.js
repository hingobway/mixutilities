import { useEffect } from 'react';

import useWS, { ReadyState } from 'react-use-websocket';

import { useRecoilState } from 'recoil';
import { connectStatusState } from '@/state/logic';

const PORT = 54200;
const WS_URL = `ws://localhost:${PORT}`;

const useLogic = () => {
  const [, setConnectStatus] = useRecoilState(connectStatusState);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWS(WS_URL, {
    shouldReconnect: (closeEvent) => {
      console.log(closeEvent);
      return true;
    },
    reconnectAttempts: 20,
    reconnectInterval: 3000,
    share: true,
  });

  // on connect:
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      // connected
      sendJsonMessage({ type: 'announce' });
      setConnectStatus(true);
    }
    if (readyState == ReadyState.CLOSED) {
      // disconnected
      setConnectStatus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyState]);

  return {
    sendLogic: (type, data) => sendJsonMessage({ type, data }),
    lastLogicMessage: lastJsonMessage,
  };
};

const useWatch = (type, cb) => {
  const { lastLogicMessage } = useLogic();
  useEffect(() => {
    if (lastLogicMessage !== null && lastLogicMessage.type === type) {
      cb(lastLogicMessage.data);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLogicMessage]);
};

export { useLogic, useWatch };
