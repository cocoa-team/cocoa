// eslint-disable-next-line import/prefer-default-export
export function createWebSocket(path: string): WebSocket {
  const protocolPrefix = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  return new WebSocket(`${protocolPrefix}//127.0.0.1:8080${path}`);
}
