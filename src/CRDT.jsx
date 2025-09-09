import * as Y from "yjs";

// Create two docs (like two users)
const ydoc1 = new Y.Doc();
const ydoc2 = new Y.Doc();

const text1 = ydoc1.getText("shared");
const text2 = ydoc2.getText("shared");

// User A edits
text1.insert(0, "Hello");

// User B edits offline
text2.insert(0, "World ");

// Sync them (like over WebSocket)
Y.applyUpdate(ydoc2, Y.encodeStateAsUpdate(ydoc1));
Y.applyUpdate(ydoc1, Y.encodeStateAsUpdate(ydoc2));

console.log(text1.toString());
// "World Hello"
