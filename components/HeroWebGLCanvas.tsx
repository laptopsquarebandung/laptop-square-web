"use client";

import { useEffect, useRef } from "react";

interface HeroWebGLCanvasProps {
  isDark: boolean;
}

export default function HeroWebGLCanvas({ isDark }: HeroWebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDarkRef = useRef(isDark);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mouseRef.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: 1.0 - (e.clientY - rect.top) / rect.height,
        };
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) {
      return () => window.removeEventListener("pointermove", handlePointerMove);
    }

    const vertexSrc = `#version 300 es
      in vec2 a_pos;
      out vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    const fragmentSrc = `#version 300 es
      precision highp float;
      in vec2 v_uv;
      out vec4 outColor;

      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_isDark;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.02;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec2 aspect = vec2(u_res.x / max(u_res.y, 1.0), 1.0);
        vec2 p = v_uv * aspect;
        vec2 m = u_mouse * aspect;

        float t = u_time * 0.08;
        float elev = fbm(p * 2.2 + vec2(t, -t * 0.6));
        float contour = abs(fract(elev * 8.0) - 0.5);
        float line = smoothstep(0.035, 0.0, contour);

        // Precision architectural grid
        vec2 gridUv = p * 12.0;
        vec2 gridFract = abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
        float grid = 1.0 - min(min(gridFract.x, gridFract.y), 1.0);

        float dist = length(p - m);
        float mouseGlow = exp(-dist * dist * 2.1);

        vec3 baseColor = u_isDark > 0.5 ? vec3(0.043, 0.051, 0.067) : vec3(0.965, 0.969, 0.976);
        vec3 lineColor = u_isDark > 0.5 ? vec3(0.23, 0.51, 0.96) : vec3(0.11, 0.31, 0.85);
        vec3 gridColor = u_isDark > 0.5 ? vec3(0.95, 0.95, 0.98) : vec3(0.07, 0.08, 0.1);

        float lineAlpha = (u_isDark > 0.5 ? 0.16 : 0.075) + mouseGlow * 0.12;
        float gridAlpha = (u_isDark > 0.5 ? 0.035 : 0.025) + mouseGlow * 0.03;

        vec3 col = baseColor;
        col = mix(col, gridColor, grid * gridAlpha);
        col = mix(col, lineColor, line * lineAlpha);
        col += lineColor * mouseGlow * (u_isDark > 0.5 ? 0.09 : 0.035);

        outColor = vec4(col, 1.0);
      }
    `;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) {
      return () => window.removeEventListener("pointermove", handlePointerMove);
    }

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uIsDark = gl.getUniformLocation(prog, "u_isDark");

    let animId = 0;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth * dpr;
      const h = canvas.clientHeight * dpr;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const render = (now: number) => {
      resize();
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) * 0.001);
      gl.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uIsDark, isDarkRef.current ? 1.0 : 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="hero-gl-canvas"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
