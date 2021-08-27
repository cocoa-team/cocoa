import fastify from 'fastify';
import fastifyWebSocket from 'fastify-websocket';
import WebSocket from 'ws';

import { CocoaChatType, CocoaServerToClientMessage } from '../../core';

import { ChatClient, CocoaServerLaunchInfo } from './types';
import { makeCocoaChannelList, sendChatCocoaCore } from './kakao';

const server = fastify({ logger: true });

server.register(fastifyWebSocket);

const clients: ChatClient[] = [];

const sendAllWebsocketClient = (chatData: CocoaServerToClientMessage): void => {
  const json = JSON.stringify(chatData);
  for (let i = 0; i < clients.length; i += 1) {
    if (clients[i].connection.socket.readyState !== WebSocket.CLOSED) {
      if (clients[i].channelId === chatData.channelId) {
        clients[i].connection.socket.send(json);
      }
    } else {
      clients.splice(i, 1);
      i -= 1;
    }
  }
};

export const sendChatToCocoaClients = (chatData: CocoaServerToClientMessage): void => {
  sendAllWebsocketClient(chatData);
};

server.get('/chatStream/:channelId', { websocket: true }, (connection, req) => {
  const channelIdParam = (req.params as any).channelId;

  if (channelIdParam) {
    const channelId = channelIdParam;
    clients.push({
      channelId,
      connection,
    });

    let internalLogId = 0;

    connection.socket.on('message', (message: Buffer) => {
      internalLogId += 1;
      sendChatCocoaCore({
        logId: internalLogId.toString(),
        channelId,
        messageTime: new Date().getTime(),
        messageText: message.toString('utf8'),
        messageType: CocoaChatType.TEXT,
      });

      sendChatToCocoaClients({
        logId: internalLogId.toString(),
        channelId,
        messageTime: new Date().getTime(),
        messageText: message.toString('utf8'),
        messageType: CocoaChatType.TEXT,
        senderInfo: {
          profileImage: '',
          userId: '###',
          name: '',
        },
      });
    });
  }
});

server.get('/channels', async (request, reply) => {
  const channelList = makeCocoaChannelList();
  return reply
    .send(channelList);
});

server.get('/', async (request, reply) => reply
  .code(200)
  .send({ msg: 'core index page!' }));

export const startCocoaServer = async (info: CocoaServerLaunchInfo) => {
  try {
    await server.listen(info.port, info.bindIPAddress);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
