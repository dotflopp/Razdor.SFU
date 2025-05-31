import Peer from "./peer";

class Room {
    public id: string;
    public peers: Map<string, Peer> = new Map();
    
    constructor(id: string) {
        this.id = id;
    }

    // === Добавление пира в комнату ===
    AddPeer(peer: Peer): void {
        this.peers.set(peer.getId(), peer);
    }

    // === Удаление пира из комнаты ===
    RemovePeer(peerId: string): void {
        const peer = this.peers.get(peerId);
        if (peer) {
            console.log(`Peer ${peerId} removed`);
            this.peers.delete(peerId);
            
            //this.Signal();
        }
    }

}