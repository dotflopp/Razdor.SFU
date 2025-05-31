export interface IMessageReciver {
    send(userId: string, message: any): void;
    broadcastSend(userIds: Set<String>, message: any): void
}
