import { useEffect, useRef, useState } from "react";

export default function AiCanvasBoard({ strokes }) {
  const canvasRef = useRef(null);
  const [localStrokes, setLocalStrokes] = useState([]);

  // Listen to CRDT updates
  useEffect(() => {
    const updateHandler = () => setLocalStrokes(strokes.toArray());
    strokes.observe(updateHandler);
    updateHandler(); // initial load
    return () => strokes.unobserve(updateHandler);
  }, []);

  // Draw strokes on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStrokes.forEach((stroke) => {
      ctx.strokeStyle = stroke.author === "ai" ? "blue" : "black";
      ctx.beginPath();
      ctx.moveTo(stroke.x1, stroke.y1);
      ctx.lineTo(stroke.x2, stroke.y2);
      ctx.stroke();
    });
  }, [localStrokes]);

  // Mouse drawing (user)
  const handleMouseDown = (e) => {
    console.log("Mouse down", e);
    const rect = canvasRef.current.getBoundingClientRect();
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    const x2 = x1 + 1; // start tiny
    const y2 = y1 + 1;
    strokes.push([{ x1, y1, x2, y2, author: "user" }]);
  };

  const handleMouseMove = (e) => {
    if (e.buttons !== 1) return; // left click
    console.log("Mouse move", e);
    const rect = canvasRef.current.getBoundingClientRect();
    const x2 = e.clientX - rect.left;
    const y2 = e.clientY - rect.top;
    const last = strokes.get(strokes.length - 1);
    if (last && last.author === "user") {
      strokes.push([{ x1: last.x2, y1: last.y2, x2, y2, author: "user" }]);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f0f0f0",
      }}
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #999", background: "white" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
      />
    </div>
  );
}
