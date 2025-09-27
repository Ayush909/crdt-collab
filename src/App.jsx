import "./App.css";

import AiCanvasBoard from "./canvas/AiCanvasBoard";
import { strokes } from "./yjssetup";
import { useState, useEffect } from "react";


function App() {
  const [username, setUsername] = useState("");
  const [input, setInput] = useState("");


  // On mount, check sessionStorage for username
  useEffect(() => {
    const stored = sessionStorage.getItem("crdt-collab-username");
    if (stored) setUsername(stored);
  }, []);

  // When username is set, store in sessionStorage
  useEffect(() => {
    if (username) {
      sessionStorage.setItem("crdt-collab-username", username);
    }
  }, [username]);


  if (!username) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Enter your username</h2>
          <input
            className="border px-3 py-2 rounded mb-4"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Username"
            maxLength={20}
            autoFocus
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (input.trim()) setUsername(input.trim());
            }}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <AiCanvasBoard strokes={strokes} userName={username} />
      <button
        onClick={() => {
          strokes.delete(0, strokes.length); // Clear the strokes array
        }}
        className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Clear Canvas
      </button>
    </div>
  );
}

export default App;
