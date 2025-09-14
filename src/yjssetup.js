import * as y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export function setupYjs(roomName = "drawing-room") {
  const ydoc = new y.Doc();
  const provider = new WebrtcProvider(roomName, ydoc);
  const strokes = ydoc.getArray("strokes");

  return { ydoc, provider, strokes };
}
