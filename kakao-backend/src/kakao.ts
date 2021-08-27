import {
  AuthApiClient,
  TalkClient,
  KnownAuthStatusCode,
  TalkChatData,
  TalkChannel,
  Long,
} from 'node-kakao';

import {
  CocoaChannelInfo, CocoaChatData, CocoaChatType,
} from '../../core';

import { KakaoLaunchInfo } from './types';
import { sendChatToCocoaClients } from './server';

const messageQueue: CocoaChatData[] = [];

const client = new TalkClient();

setInterval(() => {
  if (messageQueue.length > 0) {
    const chatData = messageQueue[0];

    const channel = client.channelList.get(Long.fromString(chatData.channelId));

    if (channel) {
      channel.sendChat(chatData.messageText);
    }

    messageQueue.splice(0, 1);
  }
}, 200);

const sendKakaoChat = (chat: CocoaChatData): void => {
  messageQueue.push(chat);
};

const kakaoClientMessage = (...arg: any) => {
  console.log(...arg);
};

function alertLoginError(name: string, error: number) {
  const errorMessage: number | string = KnownAuthStatusCode[error] ?? error;

  kakaoClientMessage(`Login Fail (from=${name}, code=${errorMessage})`);
  return false;
}

async function login(LaunchInfo: KakaoLaunchInfo): Promise<boolean> {
  kakaoClientMessage('login...');

  const apiClient = await AuthApiClient.create(LaunchInfo.deviceName, LaunchInfo.UUID);

  const authResult = await apiClient.login({
    email: LaunchInfo.id,
    password: LaunchInfo.pw,
    forced: true,
  });

  if (authResult.success === false) {
    // if (authResult.status === 8)
    //   return await registerDevice(apiClient);
    return alertLoginError('auth', authResult.status);
  }

  const loginResult = await client.login(authResult.result);

  if (loginResult.success === false) {
    // if (loginResult.status === KnownAuthStatusCode.DEVICE_NOT_REGISTERED)
    //   return await registerDevice(apiClient)
    return alertLoginError('auth', loginResult.status);
  }
  return true;
}

function chatHandleCallback(data: TalkChatData, channel: TalkChannel) {
  const sender = data.getSenderInfo(channel);
  const roomName = channel.getDisplayName();

  if (sender === undefined) {
    console.error('sender is undefined');
    return;
  }

  kakaoClientMessage(new Date(), `[${roomName}]${sender.nickname}': ' ${data.text}`);

  sendChatToCocoaClients({
    logId: data.chat.logId.toString(),
    channelId: channel.channelId.toString(),
    messageTime: new Date().getTime(),
    messageText: data.text,
    messageType: CocoaChatType.TEXT,
    senderInfo: {
      profileImage: sender.profileURL,
      userId: sender.userId.toString(),
      name: sender.nickname,
    },
  });
}

export const sendChatCocoaCore = (chatData: CocoaChatData) => {
  sendKakaoChat(chatData);
};

export const startKakaoClient = (LaunchInfo: KakaoLaunchInfo) => {
  client.on('switch_server', () => {
    login(LaunchInfo);
  });

  client.on('chat', chatHandleCallback);

  login(LaunchInfo).then((res) => {
    if (res === true) kakaoClientMessage('login success!!');
  }).catch((e) => {
    kakaoClientMessage('login fail!!', e);
  });
};

export const makeCocoaChannelList = (): CocoaChannelInfo[] => {
  const result: CocoaChannelInfo[] = [];

  const t = [...client.channelList.all()];
  t.forEach((v) => {
    result.push({
      name: v.getDisplayName(),
      channelId: v.channelId.toString(),
    });
  });

  return result;
};
