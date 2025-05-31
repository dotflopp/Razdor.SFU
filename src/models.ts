
// Типы событий 
export type wsEventType = 'joinRoom' | 'leaveRoom' | 'offer' | 'answer' | 'ice-candidate';


// Сообщение от клиента к серверу
export interface WsMessage<T = any> {
  event: wsEventType;
  data: T;
}

export interface TokenPayload{
    userId: string;
    roomId: string;
}

//структура данных под вопросом
export type TrackRemote = {
  id: string;
  kind: 'audio' | 'video';
  track: MediaStreamTrack;
};