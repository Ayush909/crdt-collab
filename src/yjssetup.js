import * as y from "yjs";
import { WebrtcProvider } from "y-webrtc";

const ydoc = new y.Doc();
export const provider = new WebrtcProvider("drawing-room", ydoc);
export const strokes = ydoc.getArray("strokes");
export const awareness = provider.awareness;
