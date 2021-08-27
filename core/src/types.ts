export type CocoaUser = {
  name: string,
  permission?: string[],
  userId: string,
  profileImage: string,
};

export enum CocoaChatType {
  TEXT = 'text',
}

export interface CocoaChatData {
  logId: string;
  channelId: string;
  messageTime: number;
  messageText: string;
  messageType: CocoaChatType;
}

export interface CocoaServerToClientMessage extends CocoaChatData {
  senderInfo: CocoaUser;
}

export type CocoaChannelInfo = {
  name: string,
  channelId: string,
};
