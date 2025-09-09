import * as y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const yDOC = new y.Doc();

export const yText = yDOC.getText("shared");

export const provider = new WebrtcProvider("my-room", yDOC);
