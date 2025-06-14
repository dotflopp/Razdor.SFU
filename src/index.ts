import SignalingHub from "./infrastructure/signaling-hub";
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer, Server as HttpServer } from 'http';
import { Coordinator } from "./services/coordinator";
import { CoordinatorProvider } from "./services/coordinator-provider";
import { TokenSource } from "./infrastructure/token-source";
import { SessionManager } from "./infrastructure/session-manager";
import { Room } from "./domain/room";

const coordinatorProvider = new CoordinatorProvider()

const port = 8080;
const app = express();
const httpServer = createServer(app)
const wsServer = new WebSocketServer({server: httpServer, path: "/signaling"})  

const tokens = new TokenSource("super_key");
const sessions = new SessionManager();
const signalingHub = new SignalingHub(wsServer, sessions, coordinatorProvider, tokens)


const rooms = new Map<string, Room>();

coordinatorProvider.inject(userSession => new Coordinator(userSession, signalingHub, rooms))

app.use(express.json());
app.post("/sessions", (req, res) => {
    const data = req.body 
    
    const channelId = data["channelId"];
    const userId = data["userId"];

    const session = sessions.create({userId, channelId});

    const resp = {
       token: tokens.newToken({sessionId:session.id})
    }
    res.send(resp)
})

httpServer.listen(port, () => {
    console.log('Сервер запущен')}
)