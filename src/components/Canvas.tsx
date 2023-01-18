import React, {
  useRef,
  useEffect,
  useState,
  TouchEvent,
  MouseEvent,
} from "react";
import { useSocket } from "../contexts/SocketProvider";
import { CanvasProps } from "../interfaces";

export const Canvas = ({ setImage, handleSave }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const socketContext = useSocket();

  useEffect(() => {
    const canvas: HTMLCanvasElement = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.strokeStyle = "white";
      ctx.lineCap = "round";
      ctx.lineWidth = 4;
      contextRef.current = ctx;
    }

    contextRef.current = ctx;
  }, []);

  const startDrawing = (event: MouseEvent) => {
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const startDrawingInMobile = (event: TouchEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event.touches[0];
    contextRef.current?.beginPath();
    contextRef.current?.moveTo(clientX, clientY);
    setIsDrawing(true);
    console.log(event);
  };

  function stopDrawing() {
    contextRef.current?.closePath();
    setIsDrawing(false);
  }

  const draw = (event: MouseEvent) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    contextRef.current?.lineTo(offsetX, offsetY);
    contextRef.current?.stroke();
  };

  const drawOnMobile = (event: TouchEvent) => {
    event.preventDefault();
    const { clientX, clientY } = event.touches[0];
    contextRef.current?.lineTo(clientX, clientY);
    contextRef.current?.stroke();
  };

  const onSave = () => {
    const src = canvasRef.current
      ?.toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    setImage(src || "");
    socketContext?.socket.emit("draw-image", src);
    handleSave?.();
  };

  return (
    <div className="canvas-container">
      <canvas
        style={{ border: "2px solid white" }}
        width="350px"
        height="200px"
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawingInMobile}
        onTouchMove={drawOnMobile}
        onTouchEnd={stopDrawing}
      />
      <button onClick={onSave}>save</button>
    </div>
  );
};
