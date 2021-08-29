import axios from 'axios';

import { CocoaChannelInfo } from '../../../core/src';

export function createWebSocket(path: string): WebSocket {
  const protocolPrefix = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
  return new WebSocket(`${protocolPrefix}//127.0.0.1:8080${path}`);
}

export async function getChannelList(): Promise<CocoaChannelInfo[]> {
  const response = await axios.get('/channels');
  return response.data;
}
