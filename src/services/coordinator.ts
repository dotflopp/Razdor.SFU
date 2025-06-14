import { Room } from "../domain/room";
import { IMessageReciver } from "./IMessageReciver";
import { AcceptAnswerCommand, AcceptOfferCommand, CreateSessionCommand, IUserSession } from "./models";


type Rooms = Map<string, Room>;

export class Coordinator {
    
    constructor (
        private readonly session: IUserSession,
        private readonly reciver: IMessageReciver,
        private readonly channels: Rooms
    ){}
    
    public onConnected() {        
        if(!this.channels.has(this.session.channelId)) {
            this.createRoomIfNotExist();
        }
    }       
    
    private createRoomIfNotExist() {  
          
    }

    public acceptOffer(command: AcceptOfferCommand) {
    }
    
    public acceptAnswer(command: AcceptAnswerCommand) {
    }
    
    public onDisconnected() 
    {
        this.channels
        .get(this.session.channelId)
        ?.remove(this.session.userId)
    }
}