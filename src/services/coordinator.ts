import { Room } from "../domain/room";
import { IMessageReciver } from "./IMessageReciver";
import { AcceptAnswerCommand, AcceptOfferCommand, CreateSessionCommand, IUserSession, WsMessage } from "./models";


export class Coordinator {  
    constructor (
        private readonly session: IUserSession,
        private readonly reciver: IMessageReciver,
        private readonly channels: Map<string, Room>
    ){}
    
    public onConnected() {        
        if(!this.channels.has(this.session.channelId)) {
            this.createRoom();

                     
        }
        const room = this.channels.get(this.session.channelId);
        if (room) {
            room.add(this.session.userId);
        }
        const message: WsMessage = {
            event: "userInChannel",
            data: room?.users
        }

        this.recive(message);   
    }
           
    public forward(wsMessage: WsMessage) {
        const to = wsMessage.data.to
        const message: WsMessage = {
            event: wsMessage.event,
            data: {
                from: this.session.userId,
                sdp: wsMessage.data.sdp
            }
        }
        this.reciver.send(to, message)
    }
    
    private createRoom() {        
        const channelId = this.session.channelId;
        const newRoom = new Room(channelId);
        this.channels.set(channelId, newRoom);
    }

    public onDisconnected() 
    {
        this.channels
        .get(this.session.channelId)
        ?.remove(this.session.userId)
    }
    
    //Рассылка в канал к которому подключена сессия
    private sendToChannel(message: WsMessage)
    {
        const room = this.channels.get(this.session.channelId);
        if (room == null)
            return

        this.reciver.broadcastSend(room.users, message);
    }

    //Ответ пользователю отправившему запрос
    private recive(message:WsMessage)
    {
        this.reciver.send(this.session.userId, message)
    }
}