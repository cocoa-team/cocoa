import { useState, useEffect } from 'react';

import { createWebSocket } from '../../util';
import { CocoaServerToClientMessage } from '../../../../core';
import './style.css';

type ChatProps = {
  channelId: string,
  channelName: string,
};

const ChatList = (props: {list: CocoaServerToClientMessage[]}) => {
  const { list } = props;
  return (
    <>
      {
        list.map((val) => {
          let chatBy = 'by-me';
          let userInfo = <></>;
          if (val.senderInfo.userId !== '###') {
            chatBy = 'by-friend';
            userInfo = <>
              <a className="profile-image-wrapper">
                <img className="profile-image" src={val.senderInfo.profileImage}/>
              </a>
              <p className="user-name">
                {val.senderInfo.name}
              </p>
            </>;
          }

          let contents = <p className="chat-body">
            {val.messageText}
          </p>;

          console.log(val.messageType);
          /* CocoaChatType.PHOTO */
          if (val.messageType as string === 'photo') {
            if (val.mediaInfo) {
              contents = <img className="image" src={val.mediaInfo?.imageURL} />;
            }
          }

          return (
            <div className={`chat ${chatBy}`} key={val.logId}>
              { userInfo }
              <div className="inline-chat-list">
                {contents}
              </div>
            </div>
          );
        })
      }
    </>
  );
};

export default ({ channelName, channelId }: ChatProps) => {
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

  const keyPressHandle = ((ev: any): void => {
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
        }} onKeyPress={keyPressHandle}>
        </textarea>
      </div>
    </>
  );
};
