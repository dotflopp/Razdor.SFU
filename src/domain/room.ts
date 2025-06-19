export class Room {
    constructor(private channelId: string) {
        this.users = new Set<string>();
    }

    public users: Set<string>;

    add(userId: string) {
        this.users.add(userId);
    }

    remove(userId: string) {
        this.users.delete(userId);
    }

    isEmpty(): boolean {
        return this.users.size === 0;
    }
}