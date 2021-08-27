import type { SocketStream } from 'fastify-websocket';

export type CocoaServerLaunchInfo = {
  bindIPAddress: string,
  port: number,
};

export type ChatClient = {
  channelId: string,
  connection: SocketStream,
};

export type KakaoLaunchInfo = {
  UUID: string,
  deviceName: string,
  id: string,
  pw: string,
};
