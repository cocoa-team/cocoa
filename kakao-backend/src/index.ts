import { startCocoaServer } from './server';
import { startKakaoClient } from './kakao';
import type { CocoaServerLaunchInfo, KakaoLaunchInfo } from './types';

const kakaoInfo: KakaoLaunchInfo = {
  UUID: process.env.deviceUUID as string,
  deviceName: process.env.deviceName as string,
  id: process.env.accountEmail as string,
  pw: process.env.accountPwd as string,
};

const cocoaPortEnv = process.env.cocoaPort;
let cocoaPort = 8080;
if (cocoaPortEnv) {
  cocoaPort = parseInt(cocoaPortEnv, 10);
}

const cocoaBindIPAddressEnv = process.env.cocoaBindIPAddress;
let cocoaBindIP = '127.0.0.1';
if (cocoaBindIPAddressEnv) {
  cocoaBindIP = cocoaBindIPAddressEnv;
}

const cocoaInfo: CocoaServerLaunchInfo = {
  port: cocoaPort,
  bindIPAddress: cocoaBindIP,
};

startKakaoClient(kakaoInfo);
startCocoaServer(cocoaInfo);
