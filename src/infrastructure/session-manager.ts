import { TokenPayload, IUserSession } from "../services/models";
import { CreateSessionCommand } from "../services/models";
import { TokenSource } from "./token-source"

export class SessionManager
{
    private readonly sessions: Map<string, IUserSession>;
    
    constructor()
    {
        this.sessions = new Map<string, IUserSession>();
        //ТЕСТ!!!
        const seed : IUserSession = {
            id: "80a74c0a-e3be-4a8a-8ac8-72fc7a3d41ea",
            userId: "57404346547044352",
            channelId: "58089110555852800" 
        }
        this.sessions.set(seed.id, seed)
    }
    
    public create({userId, channelId }: CreateSessionCommand): IUserSession
    {
        const session: IUserSession = {
            id: crypto.randomUUID(),
            userId: userId,
            channelId: channelId
        }
        
        this.sessions.set(session.id, session);
        return session;
    }
    
    public getById(sessionId: string): IUserSession
    {
        var session = this.sessions.get(sessionId)
        
        if (session == null)
            throw new Error("SessionNotFound")
        return session
    }
    
    public remove(sessionId: string) 
    {
        this.sessions.delete(sessionId)
    }
}
