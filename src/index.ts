import SignalingHub from "./infrastructure/signaling-hub";

const signalingHub = new SignalingHub(3000)
signalingHub.startServer()