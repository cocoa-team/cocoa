export type ChannelList = Array<{ name: string, channelId: string }>;

export type CocoaUser = {
  name: string,
  permission?: string[],
  userId: string,
  profileImage: string,
};

export type ChatData = {
  channelId: string,
  userId: string,
  date: number,
  profileImage: string,
  name: string,
  text?: string,
  image?: string,
  emoticon?: string,
};

export enum CocoaChatType {
  TEXT = 'text',
}

export interface CocoaChatData {
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
};
