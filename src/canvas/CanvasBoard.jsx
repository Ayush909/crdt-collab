// src/canvas/CanvasBoard.jsx
import { useRef, useEffect, useState } from "react";

export default function CanvasBoard({ strokes }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = "red";
    ctxRef.current = ctx;

    const observer = () => redrawCanvas();
    strokes.observe(observer);

    redrawCanvas();

    return () => strokes.unobserve(observer);
  }, [strokes]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);

    strokes.push([
      {
        id: crypto.randomUUID(),
        points: [{ x: offsetX, y: offsetY }],
      },
    ]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();

    const lastIndex = strokes.length - 1;
    const lastStroke = strokes.get(lastIndex);
    if (lastStroke) {
      const updated = { ...lastStroke };
      updated.points = [...lastStroke.points, { x: offsetX, y: offsetY }];
      strokes.delete(lastIndex, 1);
      strokes.insert(lastIndex, [updated]);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.toArray().forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      stroke.points.forEach((p) => ctx.lineTo(p.x, p.y));
      ctx.stroke();
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="border border-gray-400 bg-white"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
    />
  );
}
