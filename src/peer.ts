import { TrackRemote } from "./models";

class Peer {
    private id: string;
    private connection: RTCPeerConnection | null = null;
    private streams: Map<string, TrackRemote> = new Map();

    constructor(id: string) {
        this.id = id;
    }

    getId(): string {
        return this.id
    }

    addRemoteTrack(track: TrackRemote): void {
        this.streams.set(track.id, track);
    }
   
    removeRemoteTrack(track: TrackRemote): void {
        this.streams.delete(track.id);
    }

    setPeerConnection(conn: RTCPeerConnection): void {
        this.connection = conn;
    }

    // === Обработка Offer ===
    async reactOnOffer(offerSdp: string): Promise<RTCSessionDescriptionInit> {
        if (!this.connection) {
          throw new Error('Peer connection is not set');
        }

        const offer = new RTCSessionDescription({
          type: 'offer',
          sdp: offerSdp,
        });
        
        await this.connection.setRemoteDescription(offer);
        console.log(`Remote Description was set for peer ${this.id}`);

        const answer = await this.connection.createAnswer();
        await this.connection.setLocalDescription(answer);

        console.log(`Local Description was set for peer ${this.id}`);
        console.log(`Answer was created in peer ${this.id}`);

        return answer;
    }
    
    // === Обработка Answer ===
    async reactOnAnswer(answerSdp: string): Promise<void> {
        if (!this.connection) {
          throw new Error('Peer connection is not set');
        }

        const answer = new RTCSessionDescription({
          type: 'answer',
          sdp: answerSdp,
        });

        await this.connection.setRemoteDescription(answer);
    }
}

export default Peer;