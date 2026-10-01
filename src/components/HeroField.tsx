"use client";

import { useEffect, useRef } from "react";
import { HERO_COLS } from "@/lib/content";

/**
 * Hero visual — a calm, living process network: Input → Super Intelligence → Decision → Action → Outcome.
 * Signals travel along the connections; at every node the system "decides" where they go next.
 * The cursor gently attracts nearby nodes and brightens the paths around it.
 * Canvas 2D only, paused when off-screen, simplified on small screens, static for reduced motion.
 */

type Node = { col: number; hx: number; hy: number; x: number; y: number; r: number; phase: number; glow: number };
type Edge = { a: number; b: number };
type Packet = { e: number; t: number; speed: number };

const BLUE = [11, 99, 255];
const INDIGO = [74, 58, 240];
const VIOLET = [161, 43, 226];

function brand(u: number, alpha: number) {
  const [a, b, k] = u < 0.5 ? [BLUE, INDIGO, u / 0.5] : [INDIGO, VIOLET, (u - 0.5) / 0.5];
  const c = a.map((v, i) => Math.round(v + (b[i] - v) * k));
  return `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;
}

const COLS = HERO_COLS;

export function HeroField({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let W = 0, H = 0, dpr = 1;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let outgoing: number[][] = [];
    let packets: Packet[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    let raf = 0, running = false, last = 0, spawnClock = 0;

    // Seeded random so the composition is stable between renders.
    let seed = 7;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

    function build() {
      seed = 7;
      const counts = compact ? [4, 1, 3, 3, 1] : [6, 1, 3, 4, 1];
      nodes = [];
      const top = H * 0.14, bottom = H * 0.8;
      counts.forEach((n, col) => {
        for (let i = 0; i < n; i++) {
          const span = n === 1 ? 0 : (bottom - top) * (col === 0 ? 0.92 : 0.7);
          const y = n === 1 ? (top + bottom) / 2 : (top + bottom) / 2 - span / 2 + (span * i) / (n - 1) + (rand() - 0.5) * 14;
          const x = COLS[col] * W + (rand() - 0.5) * (compact ? 8 : 26);
          const r = col === 1 ? (compact ? 15 : 22) : col === 4 ? (compact ? 9 : 12) : col === 0 ? 3.2 : 4.6;
          nodes.push({ col, hx: x, hy: y, x, y, r, phase: rand() * Math.PI * 2, glow: 0 });
        }
      });
      const byCol = (c: number) => nodes.map((n, i) => (n.col === c ? i : -1)).filter((i) => i >= 0);
      edges = [];
      const link = (a: number, b: number) => edges.push({ a, b });
      const [c0, c1, c2, c3, c4] = [0, 1, 2, 3, 4].map(byCol);
      c0.forEach((a) => link(a, c1[0]));
      c2.forEach((b) => link(c1[0], b));
      c2.forEach((a, i) => {
        link(a, c3[i % c3.length]);
        link(a, c3[(i + 1) % c3.length]);
      });
      if (!compact) link(c2[c2.length - 1], c3[c3.length - 1]);
      c3.forEach((a) => link(a, c4[0]));
      outgoing = nodes.map((_, i) => edges.map((e, k) => (e.a === i ? k : -1)).filter((k) => k >= 0));
      packets = [];
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2);
      W = rect.width;
      H = rect.height;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) {
        // A few frozen signals communicate the idea without motion.
        packets = edges.filter((_, i) => i % 3 === 0).map((_, i) => ({ e: i * 3, t: 0.55, speed: 0 }));
        draw(0);
      }
    }

    function curve(e: Edge) {
      const a = nodes[e.a], b = nodes[e.b];
      const mx = (a.x + b.x) / 2;
      return [a.x, a.y, mx, a.y, mx, b.y, b.x, b.y];
    }
    function at(c: number[], t: number) {
      const u = 1 - t;
      const x = u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6];
      const y = u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7];
      return [x, y];
    }

    function spawn() {
      const inputs = nodes.map((n, i) => (n.col === 0 ? i : -1)).filter((i) => i >= 0);
      const from = inputs[Math.floor(Math.random() * inputs.length)];
      packets.push({ e: outgoing[from][0], t: 0, speed: 0.38 + Math.random() * 0.18 });
    }

    function step(dt: number, time: number) {
      mouse.x += (mouse.tx - mouse.x) * 0.12;
      mouse.y += (mouse.ty - mouse.y) * 0.12;
      for (const n of nodes) {
        let x = n.hx + Math.sin(time * 0.0006 + n.phase) * (n.col === 1 ? 2 : 5);
        let y = n.hy + Math.cos(time * 0.0005 + n.phase * 1.3) * (n.col === 1 ? 3 : 7);
        if (mouse.active) {
          const dx = mouse.x - x, dy = mouse.y - y;
          const d = Math.hypot(dx, dy), R = 170;
          if (d < R) {
            const f = (1 - d / R) ** 2 * (n.col === 1 ? 0.08 : 0.22);
            x += dx * f;
            y += dy * f;
          }
        }
        n.x = x;
        n.y = y;
        n.glow = Math.max(0, n.glow - dt * 1.6);
      }
      spawnClock += dt;
      const interval = compact ? 0.75 : 0.42;
      while (spawnClock > interval) {
        spawnClock -= interval;
        if (packets.length < (compact ? 10 : 22)) spawn();
      }
      const next: Packet[] = [];
      for (const p of packets) {
        p.t += p.speed * dt;
        if (p.t >= 1) {
          const target = edges[p.e].b;
          nodes[target].glow = 1;
          const outs = outgoing[target];
          if (outs.length) {
            // The Super Intelligence node fans signals out; decision nodes pick one path.
            const picks = nodes[target].col === 1 && Math.random() < 0.35 ? 2 : 1;
            for (let k = 0; k < picks; k++) next.push({ e: outs[Math.floor(Math.random() * outs.length)], t: 0, speed: p.speed });
          }
        } else next.push(p);
      }
      packets = next;
    }

    function draw(time: number) {
      ctx!.clearRect(0, 0, W, H);

      // cursor halo
      if (mouse.active) {
        const g = ctx!.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        g.addColorStop(0, "rgba(74,58,240,0.07)");
        g.addColorStop(1, "rgba(74,58,240,0)");
        ctx!.fillStyle = g;
        ctx!.fillRect(0, 0, W, H);
      }

      // edges
      for (const e of edges) {
        const c = curve(e);
        let near = 0;
        if (mouse.active) {
          const [mx, my] = at(c, 0.5);
          near = Math.max(0, 1 - Math.hypot(mouse.x - mx, mouse.y - my) / 240);
        }
        const u = (nodes[e.a].x + nodes[e.b].x) / 2 / W;
        ctx!.beginPath();
        ctx!.moveTo(c[0], c[1]);
        ctx!.bezierCurveTo(c[2], c[3], c[4], c[5], c[6], c[7]);
        ctx!.strokeStyle = near > 0.02 ? brand(u, 0.12 + near * 0.4) : "rgba(11,16,36,0.09)";
        ctx!.lineWidth = 1 + near * 0.8;
        ctx!.stroke();
      }

      // packets with short trails
      for (const p of packets) {
        const c = curve(edges[p.e]);
        const [x, y] = at(c, p.t);
        const u = x / W;
        for (let k = 1; k <= 6; k++) {
          const [tx, ty] = at(c, Math.max(0, p.t - k * 0.025));
          ctx!.beginPath();
          ctx!.arc(tx, ty, 2.2 - k * 0.25, 0, Math.PI * 2);
          ctx!.fillStyle = brand(u, 0.35 - k * 0.05);
          ctx!.fill();
        }
        ctx!.beginPath();
        ctx!.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx!.fillStyle = brand(u, 1);
        ctx!.shadowColor = brand(u, 0.8);
        ctx!.shadowBlur = 10;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // nodes
      for (const n of nodes) {
        const u = n.x / W;
        const hover = mouse.active ? Math.max(0, 1 - Math.hypot(mouse.x - n.x, mouse.y - n.y) / 110) : 0;
        const lift = Math.max(n.glow, hover);
        if (n.col === 1) {
          // Super Intelligence core: concentric rings with a slow breathing pulse
          const pulse = reduced ? 0.5 : (Math.sin(time * 0.0018) + 1) / 2;
          for (let k = 3; k >= 1; k--) {
            ctx!.beginPath();
            ctx!.arc(n.x, n.y, n.r + k * 11 + pulse * 4, 0, Math.PI * 2);
            ctx!.strokeStyle = brand(0.45, 0.05 + (3 - k) * 0.04 + lift * 0.08);
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
          const g = ctx!.createLinearGradient(n.x - n.r, n.y - n.r, n.x + n.r, n.y + n.r);
          g.addColorStop(0, brand(0, 1));
          g.addColorStop(0.55, brand(0.5, 1));
          g.addColorStop(1, brand(1, 1));
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = g;
          ctx!.shadowColor = "rgba(74,58,240,0.45)";
          ctx!.shadowBlur = 24 + lift * 16;
          ctx!.fill();
          ctx!.shadowBlur = 0;
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r * 0.42, 0, Math.PI * 2);
          ctx!.fillStyle = "#fafafc";
          ctx!.fill();
        } else if (n.col === 4) {
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r + 7 + lift * 4, 0, Math.PI * 2);
          ctx!.strokeStyle = brand(1, 0.18 + lift * 0.3);
          ctx!.lineWidth = 1;
          ctx!.stroke();
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = brand(1, 1);
          ctx!.fill();
        } else {
          if (lift > 0.02) {
            ctx!.beginPath();
            ctx!.arc(n.x, n.y, n.r + 6 * lift + 2, 0, Math.PI * 2);
            ctx!.fillStyle = brand(u, 0.12 * lift);
            ctx!.fill();
          }
          ctx!.beginPath();
          ctx!.arc(n.x, n.y, n.r, 0, Math.PI * 2);
          ctx!.fillStyle = "#fafafc";
          ctx!.fill();
          ctx!.lineWidth = 1.4;
          ctx!.strokeStyle = lift > 0.02 ? brand(u, 0.5 + lift * 0.5) : "rgba(11,16,36,0.32)";
          ctx!.stroke();
        }
      }
    }

    function loop(time: number) {
      const dt = Math.min(0.05, (time - (last || time)) / 1000);
      last = time;
      step(dt, time);
      draw(time);
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (running || reduced) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const host = canvas.parentElement!;
    const onMove = (e: PointerEvent) => {
      if (!fine) return;
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (!mouse.active) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [compact]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
