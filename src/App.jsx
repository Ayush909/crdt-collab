import "./App.css";
import AiCanvasBoard from "./canvas/AiCanvasBoard";
import { strokes } from "./yjssetup";

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <AiCanvasBoard strokes={strokes} />
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
