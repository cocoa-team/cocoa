export type CocoaUser = {
  name: string,
  permission?: string[],
  userId: string,
  profileImage: string,
};

export enum CocoaChatType {
  TEXT = 'text',
  PHOTO = 'photo',
  EMOTICON = 'emoticon',
}

export interface CocoaMediaInfo {
  imageURL?: string;
}

export interface CocoaChatData {
  logId: string;
  channelId: string;
  messageTime: number;
  messageText: string;
  messageType: CocoaChatType;
  mediaInfo?: CocoaMediaInfo;
}

export interface CocoaServerToClientMessage extends CocoaChatData {
  senderInfo: CocoaUser;
}

export type CocoaChannelInfo = {
  name: string,
  channelId: string,
};
