import { useState, useEffect } from 'react';

import { createWebSocket } from '../../util';
import { CocoaServerToClientMessage } from '../../../../core/src/types';
import './style.css';

type ChatPageProps = {
  channelId: string,
  channelName: string,
};

const ChatList = (props: {list: CocoaServerToClientMessage[]}) => {
  const { list } = props;
  return (
    <>
      {
        list.map((val) => (
          <div className="chat by-friend">
            <a className="profile-image-wrapper">
              <img className="profile-image" src={val.senderInfo.profileImage}/>
            </a>
            <p className="user-name">
              {val.senderInfo.name}
            </p>
            <div className="inline-chat-list">
              <p className="chat-body">
                {val.messageText}
              </p>
            </div>
          </div>
        ))
      }
    </>
  );
};

const ChatPage = (props: ChatPageProps) => {
  const { channelName, channelId } = props;
  const [textMessage, setMessage] = useState<string>('');
  const [channelSocket, setChannelSocket] = useState<WebSocket>();
  const [recivedChatList, setRecivedChatList] = useState<CocoaServerToClientMessage[]>([]);

  const createChannelSocket = (path: string): WebSocket => {
    const sock: WebSocket = createWebSocket(path);
    sock.onmessage = (ev: MessageEvent<any>): any => {
      const serverMessageText: string = ev.data;
      const serverMessage: CocoaServerToClientMessage = JSON.parse(serverMessageText);
      recivedChatList.push(serverMessage);
      setRecivedChatList([...recivedChatList]);
    };
    return sock;
  };

  useEffect(() => {
    setChannelSocket(createChannelSocket(`/chatStream/${channelId}`));
  }, []);

  const sendChat = (text: string): void => {
    if (channelSocket && channelSocket.readyState === WebSocket.OPEN) {
      channelSocket.send(text);
    } else {
      setChannelSocket(createChannelSocket(`/chatStream/${channelId}`));
    }
  };

  const onKeyDownEvent = ((ev: any): void => {
    if (ev.key === 'Enter' && !ev.shiftKey) {
      const sendText = textMessage.trim();
      if (sendText) {
        sendChat(sendText);
      }
      setMessage('');
      ev.preventDefault();
    }
  });

  return (
    <>
      <div className="chat-layout">
        <header>
          <h1>{channelName}</h1>
        </header>
        <div className="chat-list">
          <ChatList list={recivedChatList} />
        </div>
        <textarea id="chat-input" placeholder="메세지 입력" value={textMessage} onChange={(e) => {
          setMessage(e.target.value);
        }} onKeyDown={onKeyDownEvent}>
        </textarea>
      </div>
    </>
  );
};

export default ChatPage;
