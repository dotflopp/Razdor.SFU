import { Room } from "../domain/room";
import { TokenSource } from "../infrastructure/token-source";
import { TokenPayload } from "../models";
import { IMessageReciver } from "./message-reciver";
import { AcceptAnswerCommand, AcceptOfferCommand, CreateSessionCommand } from "./models";

export class Coordinator {
    private readonly tokens: TokenSource;
    private readonly rooms: Map<string, Room>;
    constructor (){
        this.tokens = new TokenSource("super_key")
        this.rooms = new Map<string, Room>();
    }
    
    ///
    public createUserSession({ userId, channelId, communityId }: CreateSessionCommand): string {
        //неУверен какую брать руму поэтому беру номер сессии
        if(!this.rooms.has(channelId)) {
            this.createRoomIfNotExist();
        }
        return this.tokens.newToken({userId, roomId: channelId}) 
    }

    private createRoomIfNotExist() {
        
    }

    //return connection id
    public acceptConnection(token: string): string {
        var tokenPayload = this.tokens.readToken(token)
        return tokenPayload.userId;
    }       

    //
    public acceptOffer(reciver: IMessageReciver, command: AcceptOfferCommand)
    {
        var {userId, roomId} = this.tokens.readToken(command.sessionToken)
        const userIds = this.generateUserIds(userId, roomId)
        reciver.broadcastSend( userIds, command)
    }

    public acceptAnswer(reciver: IMessageReciver, command: AcceptAnswerCommand) {
        var {userId, roomId} = this.tokens.readToken(command.sessionToken)
        const userIds = this.generateUserIds(userId, roomId)
        reciver.broadcastSend( userIds, command)
    }
    
    //возвращает список всех id пользователей в комнате, кроме самого пользователя
    private generateUserIds(userId:string, roomId:string): Set<String> {
        var userIds: Set<String> = new Set<String>()
        this.rooms.forEach((room) => {
            if(room.id == roomId) userIds = room.userIds 
        })
        //удаляем искомого пользователя 
        userIds.delete(userId)
        return userIds
    }
}