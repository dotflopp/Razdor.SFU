import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { TokenPayload, WsMessage } from '../models';
import { IMessageReciver }  from '../services/message-reciver'
import { Coordinator } from '../services/coordinator';


class SignalingHub implements IMessageReciver {
  private readonly wsServer: WebSocketServer 
  private readonly httpServer : HttpServer 
  private readonly port: number
  private readonly wsConnections: Map<string, WebSocket>
  private readonly coordinator: Coordinator
  
  constructor(port: number) {
    this.wsConnections = new Map()
    this.port = port
    const app = express();
    this.httpServer = createServer(app);
    this.wsServer = new WebSocketServer({ server: this.httpServer })   
    this.setupWebSocket();
    this.coordinator = new Coordinator();
  }
  

  send(userId: string, message: any): void {
    
  }

  public broadcastSend(userIds: Set<String>, message: any): void {
    if (userIds.size == 0) return
    userIds.forEach((client) =>{
      const socket = this.wsConnections.get(client.toString());
      
      socket?.send(message)
    })
  }

  private setupWebSocket(): void {
    
    this.wsServer.on('connection', (socket, message) => {
      const matchs = Array.from(message.url?.matchAll(/\?token=(.*)/) ?? [])
      const token = matchs[0]!.groups![0];

      const sessionId = this.coordinator.acceptConnection(token);
      this.wsConnections.set(sessionId, socket);  


      console.log('Клиент подключился');
      console.log(message);
      
      // Получение сообщений от клиента
      socket.on('message', (message) => {
        
        const wsMessage: WsMessage<any> = JSON.parse(message.toString())

        switch(wsMessage.event) {
          case 'ice-candidate':
          case 'answer':
          case 'offer': {
            const data = wsMessage.data
            console.log(data)
            break
          }
        }
        
      });

      // Отключение клиента
      socket.on('close', () => {
        console.log('Клиент отключился');
      });
    });
  }

  public startServer():void {
    this.httpServer.listen(this.port, () => {
      console.log('Сервер запущен')}
    )
  }
}


export default SignalingHub;