"use client";

import { useEffect, useRef } from "react";

interface WireframeChassisCanvasProps {
  isDark: boolean;
}

export default function WireframeChassisCanvas({ isDark }: WireframeChassisCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);
  const hoveredRef = useRef(false);

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let angleY = 0.45;
    let angleX = 0.42;

    // 3D vertices for laptop base deck + angled OLED lid + trackpad + keyboard recess
    const baseDeck: [number, number, number][] = [
      [-1.3, 0, -0.9],
      [1.3, 0, -0.9],
      [1.3, 0, 0.9],
      [-1.3, 0, 0.9],
    ];
    const baseBottom: [number, number, number][] = [
      [-1.3, -0.1, -0.9],
      [1.3, -0.1, -0.9],
      [1.3, -0.1, 0.9],
      [-1.3, -0.1, 0.9],
    ];
    const trackpad: [number, number, number][] = [
      [-0.45, 0.005, 0.25],
      [0.45, 0.005, 0.25],
      [0.45, 0.005, 0.8],
      [-0.45, 0.005, 0.8],
    ];
    const keyboard: [number, number, number][] = [
      [-1.08, 0.005, -0.72],
      [1.08, 0.005, -0.72],
      [1.08, 0.005, 0.12],
      [-1.08, 0.005, 0.12],
    ];

    // Lid tilted back ~108 deg from closed
    const lidTilt = -1.25;
    const lidHeight = 1.65;
    const lidZ = -0.9 + Math.cos(lidTilt) * lidHeight * -0.55;
    const lidY = Math.abs(Math.sin(lidTilt)) * lidHeight;

    const lidOuter: [number, number, number][] = [
      [-1.3, 0, -0.9],
      [1.3, 0, -0.9],
      [1.3, lidY, lidZ],
      [-1.3, lidY, lidZ],
    ];

    const screenBezel: [number, number, number][] = [
      [-1.22, 0.12, -0.9 + (lidZ + 0.9) * 0.07],
      [1.22, 0.12, -0.9 + (lidZ + 0.9) * 0.07],
      [1.22, lidY * 0.94, -0.9 + (lidZ + 0.9) * 0.94],
      [-1.22, lidY * 0.94, -0.9 + (lidZ + 0.9) * 0.94],
    ];

    const project = (pt: [number, number, number], w: number, h: number) => {
      const [x, y, z] = pt;
      // Rotate Y
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate X
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const scale = Math.min(w, h) * 0.36;
      const fov = 4.5 / (4.5 + z2);
      return [w * 0.5 + x1 * scale * fov, h * 0.62 - y2 * scale * fov] as [number, number];
    };

    const drawPoly = (
      pts: [number, number, number][],
      w: number,
      h: number,
      stroke: string,
      lineWidth = 1.25
    ) => {
      const projected = pts.map((p) => project(p, w, h));
      ctx.beginPath();
      ctx.moveTo(projected[0][0], projected[0][1]);
      for (let i = 1; i < projected.length; i++) {
        ctx.lineTo(projected[i][0], projected[i][1]);
      }
      ctx.closePath();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && h > 0) {
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
          canvas.width = w * dpr;
          canvas.height = h * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, w, h);

        angleY += hoveredRef.current ? 0.016 : 0.0045;

        const strokeMuted = isDarkRef.current
          ? "rgba(241, 243, 246, 0.28)"
          : "rgba(17, 19, 24, 0.28)";
        const strokeAccent = isDarkRef.current ? "#3b82f6" : "#1d4ed8";

        drawPoly(baseBottom, w, h, strokeMuted, 1);
        drawPoly(baseDeck, w, h, strokeMuted, 1.3);
        drawPoly(keyboard, w, h, strokeMuted, 1);
        drawPoly(trackpad, w, h, strokeAccent, 1.4);
        drawPoly(lidOuter, w, h, strokeMuted, 1.3);
        drawPoly(screenBezel, w, h, strokeAccent, 1.5);

        // Connect base top and bottom corners
        for (let i = 0; i < 4; i++) {
          const a = project(baseDeck[i], w, h);
          const b = project(baseBottom[i], w, h);
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.strokeStyle = strokeMuted;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="specs-gl-canvas"
      onMouseEnter={() => (hoveredRef.current = true)}
      onMouseLeave={() => (hoveredRef.current = false)}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      aria-label="3D Wireframe Laptop Chassis"
    />
  );
}
