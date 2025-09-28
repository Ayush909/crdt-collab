import * as y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const ydoc = new y.Doc();
// wss:// means "WebSocket Secure" (WebSocket over HTTPS/TLS)
export const provider = new WebrtcProvider("drawing-room", ydoc, {signaling : ["ws://localhost:4444/"], iceServers: [{urls: "stun:stun.l.google.com:19302"},  { 
      urls: "turn:your-turn-server.com:3478",
      username: "testuser",
      credential: "testpass"
    }]});
export const strokes = ydoc.getArray("strokes");
export const awareness = provider.awareness;

/*

To Test in Incognito mode in Chrome:

Normal ↔ Incognito are treated as different “privacy contexts” in Chrome.

Chrome applies mDNS (Multicast DNS) privacy in Incognito mode very strictly.

So your normal window may offer a LAN candidate like 192.168.x.x, but your incognito peer sees only xxxx.local → unusable for connection.

Since we don’t have a TURN server, they fail to sync (your webrtc-internals showed: connectionstatechange: failed).

For local dev (just for debugging), we can temporarily disable mDNS in Chrome:

Open chrome://flags/#enable-webrtc-hide-local-ips-with-mdns

Set to Disabled.

Restart Chrome.

*/

provider.on('peers', (peers) => {
  console.log('Connected peers:', peers);
});