import { useEffect, useRef, useState } from "react";
import { awareness } from "../yjssetup";

export default function AICanvasBoard({ strokes, userName }) {
  // User info (userName from prop, color from palette)
  const COLOR_PALETTE = [
    "#e57373",
    "#f06292",
    "#ba68c8",
    "#64b5f6",
    "#4dd0e1",
    "#81c784",
    "#ffd54f",
    "#ffb74d",
    "#a1887f",
    "#90a4ae",
    "#000000",
    "#ffffff",
  ];
  const [userColor, setUserColor] = useState(COLOR_PALETTE[0]);
  const canvasRef = useRef(null);
  const [localStrokes, setLocalStrokes] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Listen to CRDT updates
  useEffect(() => {
    const updateHandler = () => {
      setLocalStrokes(strokes.toArray());
    };
    strokes.observe(updateHandler);
    updateHandler(); // initial load
    return () => strokes.unobserve(updateHandler);
  }, []);

  // Awareness: listen for remote cursors and user presence
  useEffect(() => {
    let resolvedAwareness;

    const setupAwarenessHandler = async () => {
      resolvedAwareness = await awareness; // Resolve the awareness Promise

      const awarenessHandler = () => {
        const states = Array.from(resolvedAwareness.getStates().entries());
        const cursors = states
          .filter(([, state]) => state.cursor && state.name && state.color)
          .map(([, state]) => ({
            x: state.cursor.x,
            y: state.cursor.y,
            name: state.name,
            color: state.color,
          }));
        setRemoteCursors(cursors);
        setOnlineUsers(
          states.map(([, state]) => ({ name: state.name, color: state.color }))
        );
      };

      resolvedAwareness.on("change", awarenessHandler);
      awarenessHandler(); // Initial call

      return () => resolvedAwareness.off("change", awarenessHandler); // Cleanup
    };

    const cleanup = setupAwarenessHandler(); // Call the setup function
    return () => cleanup && cleanup(); // Cleanup on unmount
  }, []);

  // Draw remote cursors on top of canvas (no trail)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // Redraw strokes first
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    localStrokes.forEach((stroke) => {
      ctx.strokeStyle = stroke.color;
      ctx.beginPath();
      ctx.moveTo(stroke.x1, stroke.y1);
      ctx.lineTo(stroke.x2, stroke.y2);
      ctx.stroke();
    });
    // Draw only the latest cursor positions
    remoteCursors.forEach((cursor) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = cursor.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
      ctx.globalAlpha = 1.0;
      ctx.font = "14px sans-serif";
      ctx.fillStyle = cursor.color;
      ctx.fillText(cursor.name, cursor.x + 10, cursor.y - 10);
      ctx.restore();
    });
  }, [remoteCursors, localStrokes]);

  // Mouse drawing (user)
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    const x2 = x1 + 1; // start tiny
    const y2 = y1 + 1;
    strokes.push([{ x1, y1, x2, y2, author: userName, color: userColor }]);
  };

  const handleMouseMove = async (e) => {
    // Resolve the awareness Promise
    const resolvedAwareness = await awareness;

    // Get mouse position
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Broadcast local cursor position
    resolvedAwareness.setLocalStateField("cursor", { x, y });
    resolvedAwareness.setLocalStateField("name", userName);
    resolvedAwareness.setLocalStateField("color", userColor);

    // For continuous drawing
    if (e.buttons !== 1) return; // Left click
    const x2 = x;
    const y2 = y;
    const last = strokes.get(strokes.length - 1);
    if (last && last.author === userName) {
      strokes.push([
        {
          x1: last.x2,
          y1: last.y2,
          x2,
          y2,
          author: userName,
          color: userColor,
        },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4 flex flex-row items-center space-x-2">
        <span className="font-semibold">Pick your color:</span>
        {COLOR_PALETTE.map((color) => (
          <button
            key={color}
            className={`w-7 h-7 rounded-full border-2 ${
              userColor === color ? "border-black" : "border-gray-300"
            }`}
            style={{ background: color }}
            onClick={() => setUserColor(color)}
            aria-label={`Pick color ${color}`}
          />
        ))}
      </div>
      <div className="relative flex flex-row items-center justify-center w-full">
        <canvas
          ref={canvasRef}
          width={1000}
          height={600}
          className="border border-gray-400 bg-white shadow-md rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
        />
        <div className="absolute top-4 left-4 p-2 bg-white rounded shadow border w-64 z-10">
          <div className="font-bold mb-2">Online Users</div>
          <ul>
            {onlineUsers.map((u, i) => (
              <li key={i} style={{ color: u.color }}>
                ● {u.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
