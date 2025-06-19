import { WebSocket, WebSocketServer } from 'ws';
import { TokenPayload, WsMessage } from '../services/models';
import { IMessageReciver }  from '../services/IMessageReciver'
import { CoordinatorProvider } from '../services/coordinator-provider';
import { SessionManager } from './session-manager';
import { IncomingMessage } from 'http';
import { TokenSource } from './token-source'
import url from 'url'


class SignalingHub implements IMessageReciver {
  private readonly wsConnections: Map<string, WebSocket>
  
  constructor(
    private readonly wsServer: WebSocketServer, 
    private readonly sessionManager: SessionManager, 
    private readonly coordinatorProvider: CoordinatorProvider,
    private readonly tokenSource: TokenSource,
  ) {
    this.wsConnections = new Map()
    this.setupWebSocket();
  }  

  public send(userId: string, message: any): void {
    const socket = this.wsConnections.get(userId)
    socket?.send(JSON.stringify(message))
  }

  public broadcastSend(userIds: Set<string>, message: any): void {
    if (userIds.size == 0) return
    userIds.forEach((client) =>{
      this.send(client, message)
    })
  }

  private getSessionByToken(token: string){
    const {sessionId} = this.tokenSource.readToken(token)
    return this.sessionManager.getById(sessionId);
  }

  private setupWebSocket(): void {
    this.wsServer.on('connection', (socket, message: IncomingMessage) => {
      console.log('Клиент подключился'); 

      var token = url.parse(message.url ?? "/", true).query["access-token"] as string;
      const session = this.getSessionByToken(token);

      console.log(this.getSessionByToken(token))

      //создаем координатора для управления одной сессией
      const coordinator = this.coordinatorProvider.create(session)
      this.wsConnections.set(session.userId, socket);

      coordinator.onConnected()
      
      // Получение сообщений от клиента
      socket.on('message', (message) => {
        const wsMessage: WsMessage<any> = JSON.parse(message.toString())  
        switch(wsMessage.event) {
          case 'ice-candidate':
          case 'answer': 
          case 'offer': {
            console.log(message)
            coordinator.forward(wsMessage)
            break;
          }
        }
      });
      // Отключение клиента
      socket.on('close', () => {
        this.sessionManager.remove(session.id)
        this.wsConnections.delete(session.userId)
        coordinator.onDisconnected()
      });
    });
  }
}

export default SignalingHub;