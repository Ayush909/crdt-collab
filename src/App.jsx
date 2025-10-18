import "./App.css";

import CanvasBoard from "./canvas/CanvasBoard";
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
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100">
        <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center min-w-[320px] w-full max-w-xs">
          <h2 className="text-2xl font-extrabold mb-6 text-gray-800 tracking-tight">
            Enter your username
          </h2>
          <input
            className="border border-gray-300 px-4 py-2 rounded-lg mb-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-base"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Username"
            maxLength={20}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) setUsername(input.trim());
            }}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 transition-colors text-white px-6 py-2 rounded-lg font-semibold shadow-md w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              if (input.trim()) setUsername(input.trim());
            }}
            disabled={!input.trim()}
          >
            Join
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <CanvasBoard strokes={strokes} userName={username} />
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
