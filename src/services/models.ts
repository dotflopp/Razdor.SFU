export interface CreateSessionCommand{
    userId: string;
    channelId: string;
}

export interface AcceptOfferCommand {
    offerSdp: any;
}

export interface AcceptAnswerCommand {
    answerSdp: any;
}

// Типы событий 
export type wsEventType = 'userInChannel' | 'userJoinRoom' | 'userLeaveRoom' | 'offer' | 'answer' | 'ice-candidate';


// Сообщение от клиента к серверу
export interface WsMessage<T = any> {
  event: wsEventType;
  body: T;
}

export interface TokenPayload{
    sessionId: string;
}


export interface IUserSession {
    id: string
    userId: string;
    channelId: string;
}