export class Room {
    public constructor (
        public id: string,
        public sessionIds: Set<string>
    ){}

    public remove(sessionId: string) {
        this.sessionIds.delete(sessionId)
    }
}