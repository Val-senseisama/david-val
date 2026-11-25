import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { desk } from "./deskBus";
import { P, H, TOP, deskEnter, deskLeave, deskPoke, deskStep, entryX, hooks } from "./deskPlay";

/*
  Chibi Val roams the page: he stands on headings and cards marked [data-perch],
  rides them as you scroll, hops to the next one when his perch leaves the
  screen, runs after the cursor, jumps to catch it, peeks over edges when bored,
  and hops + talks when clicked or tapped. On the hero desk (HeroDesk.tsx) deskPlay.ts
  drives him instead: he plays with each object in turn, holding a copy of it in his
  hand while the original is hidden, and its label shows while he does.
*/

const MODEL = "/mascot/val.glb";
const LINES = [
  "Hi, I'm Val.",
  "There are demos further down.",
  "Got a product to build?",
];

type Mode = "idle" | "run" | "air" | "wave" | "peek" | "act";
type Air = { sx: number; sy: number; t0: number; dur: number; h: number; kind: "move" | "hop" | "catch" };

const now = () => performance.now() / 1000;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const damp = THREE.MathUtils.damp;

const S = {
  size: 120,
  base: 120,
  x: 0,
  y: -200,
  dir: 1,
  mode: "air" as Mode,
  modeUntil: 0,
  air: null as Air | null,
  perch: null as HTMLElement | null,
  top: 0,
  lo: 0,
  hi: 0,
  px: -1e4,
  py: -1e4,
  lastMove: -1e9,
  nextIdea: 0,
  wanderX: null as number | null,
  peekDir: 0,
  nextCatch: 0,
  land: -1e9,
  bubble: "",
  bubbleUntil: 0,
  line: 0,
  checked: 0,
  slow: false,
  onDesk: false,
  waitSince: 0, // set while he waits for the desk before his first drop
};

const DESK_MQ = "(min-width: 1100px)"; // HeroDesk only loads at this width (Hero3D.tsx)

function dropIn() {
  // land right where his first desk act starts, so the routine begins at once
  S.x = entryX() ?? window.innerWidth * (window.innerWidth < 700 ? 0.8 : 0.78);
  S.y = -S.size;
  S.air = { sx: S.x, sy: S.y, t0: now(), dur: 0.9, h: 0, kind: "move" };
  S.mode = "air";
  S.nextIdea = now() + 4;
}

function perchRange(el: HTMLElement | null) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const m = S.size * 0.35;
  if (!el) return { top: h - 4, lo: m, hi: w - m };
  let r = el.getBoundingClientRect();
  if (el.dataset.perch === "desk") return { top: r.top, lo: r.left, hi: r.right };
  if (/^H\d$/.test(el.tagName)) {
    // stand on the words, not the empty block width
    const range = document.createRange();
    range.selectNodeContents(el);
    const first = range.getClientRects()[0];
    if (first) r = new DOMRect(first.left, r.top, first.width, r.height);
  }
  let lo = r.left + m;
  let hi = r.right - m;
  if (el.dataset.perch === "right") lo = Math.max(lo, r.left + r.width * 0.6);
  if (hi - lo < 10) hi = lo + 10;
  return { top: r.top, lo, hi };
}

function usable(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.top > 64 + S.size * 1.05 && r.top < window.innerHeight - 12 && r.width > S.size * 0.8;
}

function pickPerch(): HTMLElement | null {
  // the hero desk wins whenever it's on screen and ready
  if (desk.perch && desk.project && desk.perch.isConnected && usable(desk.perch)) return desk.perch;
  if (S.perch && S.perch.isConnected && usable(S.perch)) return S.perch;
  const h = window.innerHeight;
  let best: HTMLElement | null = null;
  let score = Infinity;
  document.querySelectorAll<HTMLElement>("[data-perch]").forEach((el) => {
    if (!usable(el)) return;
    const d = Math.abs(el.getBoundingClientRect().top - h * 0.58);
    if (d < score) {
      score = d;
      best = el;
    }
  });
  return best;
}

function say(text: string, secs = 2.6) {
  S.bubble = text;
  S.bubbleUntil = now() + secs;
}

function jump(kind: Air["kind"], h: number, dur: number) {
  S.air = { sx: S.x, sy: S.y, t0: now(), dur, h, kind };
  S.mode = "air";
}

// On the hero desk deskPlay.ts moves him in desk coords; project that onto the screen.
function driveDesk(t: number, dt: number) {
  deskStep(t, dt);
  const pr = desk.project!(P.x, TOP + P.h, P.z);
  S.x = pr.x;
  S.y = pr.y;
  S.size = H * pr.unit;
  S.dir = P.dir;
  S.mode = P.pose === "run" ? "run" : P.pose === "air" ? "air" : P.pose === "stand" ? "idle" : "act";
  S.land = Math.max(S.land, P.landAt);
  S.wanderX = null;
  S.peekDir = 0;
}

function leaveDesk() {
  if (!S.onDesk) return;
  deskLeave();
  S.onDesk = false;
  S.size = S.base;
  if (!S.air) S.mode = "idle";
}

function think(t: number, dt: number) {
  const w = window.innerWidth;
  // keep the perch fresh (cheap: a few rects every 150 ms)
  if (t - S.checked > 0.15) {
    S.checked = t;
    const next = pickPerch();
    if (next !== S.perch) {
      leaveDesk();
      S.perch = next;
      if (!S.air) {
        const r = perchRange(next);
        const far = Math.abs(r.top - S.y) > 4 || S.x < r.lo || S.x > r.hi;
        if (far) jump("move", clamp(Math.abs(r.top - S.y) * 0.25 + 70, 70, 220), 0.7);
      }
    }
  }
  const deskHere = !!desk.perch && S.perch === desk.perch && !!desk.project;
  if (!deskHere) leaveDesk();
  if (!S.onDesk) S.size = S.base;
  const r = perchRange(S.perch);
  S.top = r.top;
  S.lo = r.lo;
  S.hi = r.hi;

  if (S.air) return;
  if (deskHere) {
    if (!S.onDesk) {
      deskEnter(S.x);
      S.onDesk = true;
    }
    driveDesk(t, dt);
    return;
  }
  S.y = S.top; // ride the perch while scrolling
  S.slow = false;
  if (S.mode === "act" || S.mode === "air") S.mode = "idle";

  const active = t - S.lastMove < 3 && S.px > -1e3;
  if (active) {
    S.wanderX = null;
    const tx = clamp(S.px, S.lo, S.hi);
    const dx = tx - S.x;
    if (Math.abs(dx) > 12) {
      S.mode = "run";
      S.dir = Math.sign(dx);
      return;
    }
    if (S.mode === "run") S.mode = "idle";
    const above = S.y - S.py; // px the cursor is above his feet
    if (above > S.size * 0.95 && above < S.size + 280 && Math.abs(S.px - S.x) < S.size * 0.6 && t > S.nextCatch) {
      S.nextCatch = t + 1.1;
      jump("catch", clamp(above - S.size * 0.85, 40, 280), 0.42 + (above / 1000) * 0.5);
    }
    return;
  }

  // bored: wander, peek over an edge, or wave
  if (S.mode === "run" && S.wanderX == null) S.mode = "idle";
  if (S.wanderX != null) {
    const dx = S.wanderX - S.x;
    if (Math.abs(dx) > 6) {
      S.mode = "run";
      S.dir = Math.sign(dx);
      return;
    }
    S.wanderX = null;
    if (S.peekDir) {
      S.mode = "peek";
      S.modeUntil = t + 2.2;
      return;
    }
    S.mode = "idle";
  }
  if ((S.mode === "wave" || S.mode === "peek") && t < S.modeUntil) return;
  if (S.mode === "wave" || S.mode === "peek") {
    S.mode = "idle";
    S.peekDir = 0;
  }
  if (t < S.nextIdea) return;
  S.nextIdea = t + 3 + Math.random() * 4;
  const roll = Math.random();
  if (roll < 0.4) {
    S.wanderX = S.lo + Math.random() * (S.hi - S.lo);
  } else if (roll < 0.75 && S.hi - S.lo > S.size) {
    S.peekDir = Math.random() < 0.5 ? -1 : 1;
    S.wanderX = S.peekDir < 0 ? S.lo : S.hi;
  } else {
    S.mode = "wave";
    S.modeUntil = t + 1.6;
  }
  void w;
}

function move(t: number, dt: number) {
  if (S.mode === "run" && !S.onDesk) {
    const speed = S.wanderX != null ? 120 : S.slow ? 240 : 300;
    S.x = clamp(S.x + S.dir * speed * dt, S.lo, S.hi);
  }
  if (S.mode === "air" && S.air) {
    const a = S.air;
    const e = clamp((t - a.t0) / a.dur, 0, 1);
    const tx = a.kind === "move" ? clamp(a.sx, S.lo, S.hi) : a.sx;
    const ty = S.top;
    S.x = a.sx + (tx - a.sx) * e;
    S.y = a.sy + (ty - a.sy) * e - a.h * 4 * e * (1 - e);
    if (e >= 1) {
      S.air = null;
      S.mode = "idle";
      S.land = t;
      if (a.kind === "catch" && Math.hypot(S.px - S.x, S.py - (S.y - S.size)) < 70 && Math.random() < 0.5) say("Got you!", 1.4);
      if (a.kind === "hop") {
        S.mode = "wave";
        S.modeUntil = t + 1.4;
      }
    }
  }
  S.x = clamp(S.x, S.size * 0.3, window.innerWidth - S.size * 0.3);
}

// How each desk object sits in his right hand: the item is moved so its grip point is
// at the hand, then turned (Euler in ZYX order: X first).
// Held items keep their desk size: cartoon-big in his hands.
const GRIPS: Record<string, { at: [number, number, number]; rot: [number, number, number]; scale: number }> = {
  sword: { at: [-0.29, 0.016, 0], rot: [0, 0, -2.09], scale: 1 }, // blade out past the fist
  mug: { at: [0.075, 0.066, 0], rot: [0, Math.PI, 0], scale: 1 }, // by the handle, cup on the outside
  phone: { at: [0, 0.008, 0.09], rot: [-Math.PI / 2, 0, 0], scale: 1 }, // upright, screen toward him
};

// The canvas is a box that follows him (page coords); his feet sit FEET px from its top.
const BOX = typeof window !== "undefined" && window.innerWidth < 700 ? 420 : 640;
const FEET = Math.round(BOX * 0.66);

function Val({
  box,
  bubble,
  flash,
}: {
  box: React.RefObject<HTMLDivElement | null>;
  bubble: React.RefObject<HTMLDivElement | null>;
  flash: React.RefObject<HTMLDivElement | null>;
}) {
  const { scene } = useGLTF(MODEL);
  const group = useRef<THREE.Group>(null);
  const phase = useRef(0);

  const n = useMemo(() => {
    const get = (k: string) => scene.getObjectByName(k) as THREE.Object3D;
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m && m.transparent) m.depthWrite = false;
    });
    const parts = {
      root: get("val"),
      body: get("body"),
      head: get("head"),
      armL: get("arm_L"),
      armR: get("arm_R"),
      legL: get("leg_L"),
      legR: get("leg_R"),
    };
    // the hand: held desk items hang off this
    const holder = new THREE.Group();
    holder.position.set(-0.042, -0.215, 0.02);
    parts.armR.add(holder);
    const grip = new THREE.Group();
    holder.add(grip);
    return { ...parts, bodyY: parts.body.position.y, lap: scene.getObjectByName("laptop"), holder, grip };
  }, [scene]);
  const heldRef = useRef<string | null>(null);
  const wp = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    S.base = S.size = window.innerWidth < 700 ? 84 : 120;
    // on wide screens wait for the desk (it loads separately) so he lands on it, not beside it
    if (window.matchMedia(DESK_MQ).matches && !desk.project) S.waitSince = now();
    else dropIn();
    const onMove = (e: PointerEvent) => {
      S.px = e.clientX;
      S.py = e.clientY;
      S.lastMove = now();
    };
    const onDown = (e: PointerEvent) => {
      onMove(e);
      const hit =
        Math.abs(e.clientX - S.x) < S.size * 0.35 && e.clientY < S.y + 4 && e.clientY > S.y - S.size * 1.05;
      if (!hit) return;
      if (S.onDesk) {
        deskPoke();
        if (!P.held) say(LINES[S.line++ % LINES.length]);
      } else if (!S.air) {
        jump("hop", S.size * 0.9, 0.55);
        say(LINES[S.line++ % LINES.length]);
      }
    };
    const onResize = () => (S.base = window.innerWidth < 700 ? 84 : 120);
    hooks.say = say;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const t = now();
    if (S.waitSince) {
      const hero = desk.perch ? desk.perch.getBoundingClientRect().top < window.innerHeight : false;
      if (!(desk.project && hero) && t - S.waitSince < 6) {
        if (group.current) group.current.visible = false;
        return;
      }
      S.waitSince = 0;
      if (group.current) group.current.visible = true;
      dropIn();
    }
    think(t, dt);
    move(t, dt);

    const g = group.current;
    if (!g) return;
    // move the box by whole px in page coords; the sub-px rest goes on the model
    const rx = Math.round(S.x);
    const ry = Math.round(S.y);
    const sx = window.scrollX;
    const sy = window.scrollY;
    if (box.current) box.current.style.transform = `translate(${rx - BOX / 2 + sx}px, ${ry - FEET + sy}px)`;
    g.position.set(S.x - rx, BOX / 2 - FEET - (S.y - ry), 0);
    const squash = Math.max(0, 1 - (t - S.land) / 0.25);
    g.scale.set(S.size * (1 + 0.12 * squash), S.size * (1 - 0.14 * squash), S.size);

    const run = S.mode === "run";
    const air = S.mode === "air";
    phase.current += dt * (run ? (S.wanderX != null ? 9 : 15) : 0);
    const p = phase.current;
    const k = 14;

    // where to face: sideways-ish when running, the viewer otherwise, a nudge toward the cursor
    let yaw = 0;
    if (S.onDesk && P.yaw != null) yaw = P.yaw;
    else if (run) yaw = S.dir * 1.15;
    else if (S.mode === "peek") yaw = S.peekDir * 1.3;
    else yaw = clamp((S.px - S.x) / 900, -0.45, 0.45);
    n.root.rotation.y = damp(n.root.rotation.y, yaw, 10, dt);

    const swing = run ? Math.sin(p) : 0;
    let legL = -swing * 0.85;
    let legR = swing * 0.85;
    let armLx = swing * 0.35;
    let armRx = -swing * 0.8;
    let armRz = 0;
    let armLz = 0;
    let lean = run ? 0.12 : 0;
    let headX = clamp((S.py - (S.y - S.size)) / 1200, -0.3, 0.3);
    let headY = 0;
    let bob = run ? Math.abs(Math.sin(p)) * 0.035 : Math.sin(t * 2.2) * 0.006;

    let toss = 0; // held item thrown up the arm (mascot units)
    let tilt = 0; // extra tilt of the held item
    if (air) {
      legL = -0.7;
      legR = 0.35;
      armRz = S.air?.kind === "catch" ? -2.9 : -2.2;
      armLz = 0.35;
      lean = -0.08;
      headX = -0.25;
      bob = 0;
      if (S.onDesk && P.cheer) {
        armRz = -2.6 + Math.sin(t * 16) * 0.25;
        armLz = 2.6 - Math.sin(t * 16) * 0.25;
        legL = -0.9;
        legR = 0.9;
        headX = -0.1;
      }
    } else if (S.mode === "act") {
      const e = t - P.since;
      switch (P.pose) {
        case "reach": // bend toward the object on his right hand's side
          armRz = -0.7;
          armRx = -0.9;
          lean = 0.3;
          headX = 0.3;
          headY = -0.3;
          break;
        case "hold":
          armRz = -0.35;
          armRx = -0.6;
          break;
        case "swing": {
          const w = t * 9;
          armRz = -2.2 + Math.sin(w) * 0.8;
          armRx = Math.cos(w) * 0.5;
          armLz = 0.6;
          legL = -0.3;
          legR = 0.3;
          n.root.rotation.y = Math.sin(t * 4.5) * 0.5;
          bob = Math.abs(Math.sin(w)) * 0.03;
          headX = -0.15;
          break;
        }
        case "sip": // cup to the mouth, head back
          armRx = -2.2;
          armRz = -0.35;
          tilt = 1.25 - Math.min(1, e / 0.5) * 0.35;
          headX = -0.3;
          armLz = 0.25;
          break;
        case "toss": {
          armRz = -2.85;
          const u = clamp(e / 0.75, 0, 1);
          toss = 4 * u * (1 - u) * 0.7;
          tilt = u * Math.PI * 2;
          headX = -0.35 * Math.min(1, toss * 4);
          headY = -0.2;
          break;
        }
        case "selfie": {
          // phone up on one side, peace sign on the other, head tipped toward the phone
          armRz = -2.75;
          armRx = -0.35;
          armLz = 2.35 + Math.sin(t * 10) * 0.05;
          armLx = -0.3;
          headX = -0.2;
          headY = -0.25;
          n.head.rotation.z = damp(n.head.rotation.z, P.shot ? 0.18 : -0.18, 8, dt);
          break;
        }
      }
    } else if (S.mode === "wave") {
      armRz = -2.55 + Math.sin(t * 13) * 0.35;
      headY = 0.12;
    } else if (S.mode === "peek") {
      lean = 0.5;
      headX = 0.35;
      headY = Math.sin(t * 2.5) * 0.2;
      armRz = -0.5;
      armRx = -0.9;
    } else if (!run) {
      headY = Math.sin(t * 0.9) * 0.08;
    }

    n.legL.rotation.x = damp(n.legL.rotation.x, legL, k, dt);
    n.legR.rotation.x = damp(n.legR.rotation.x, legR, k, dt);
    n.armL.rotation.x = damp(n.armL.rotation.x, armLx, k, dt);
    n.armL.rotation.z = damp(n.armL.rotation.z, armLz, k, dt);
    n.armR.rotation.x = damp(n.armR.rotation.x, armRx, k, dt);
    n.armR.rotation.z = damp(n.armR.rotation.z, armRz, k, dt);
    n.body.rotation.x = damp(n.body.rotation.x, lean, 10, dt);
    n.body.position.y = n.bodyY + bob;
    n.head.rotation.x = damp(n.head.rotation.x, headX, 8, dt);
    n.head.rotation.y = damp(n.head.rotation.y, headY, 8, dt);
    if (!(S.mode === "act" && P.pose === "selfie")) n.head.rotation.z = damp(n.head.rotation.z, 0, 8, dt);

    // desk play: his own laptop stays off while he's at the desk; a copy of the held item sits in his hand
    if (n.lap) n.lap.visible = !S.onDesk;
    const held = S.onDesk ? P.held : null;
    if (held !== heldRef.current) {
      heldRef.current = held;
      n.grip.clear();
      const src = held ? desk.items[held] : undefined;
      const g = held ? GRIPS[held] : undefined;
      if (src && g) {
        const item = src.clone(true);
        item.visible = true;
        item.position.set(-g.at[0], -g.at[1], -g.at[2]);
        item.rotation.set(0, 0, 0);
        item.scale.set(1, 1, 1);
        n.grip.add(item);
        n.grip.rotation.set(g.rot[0], g.rot[1], g.rot[2], "ZYX");
      }
    }
    n.holder.visible = !!held;
    n.holder.scale.setScalar((held ? GRIPS[held].scale : 1) / H);
    n.holder.position.y = -0.215 - toss;
    n.holder.rotation.x = damp(n.holder.rotation.x, held === "mug" ? tilt : 0, 10, dt);
    if (held === "mug" && P.pose === "toss") n.holder.rotation.x = tilt;

    const f = flash.current;
    if (f) {
      const since = t - P.flashAt;
      if (since < 0.4 && held === "phone") {
        n.holder.getWorldPosition(wp);
        f.style.opacity = String(1 - since / 0.4);
        const fx = rx - BOX / 2 + BOX / 2 + wp.x + sx;
        const fy = ry - FEET + BOX / 2 - wp.y - S.size * 0.25 + sy;
        f.style.transform = `translate(${Math.round(fx)}px, ${Math.round(fy)}px) scale(${0.6 + since * 2})`;
      } else if (f.style.opacity !== "0") f.style.opacity = "0";
    }

    const b = bubble.current;
    if (b) {
      const show = t < S.bubbleUntil;
      if (show && b.textContent !== S.bubble) b.textContent = S.bubble;
      b.style.opacity = show ? "1" : "0";
      b.style.transform = `translate(${rx + sx}px, ${Math.round(S.y - S.size * 1.08 + sy)}px) translate(-50%, -100%)`;
    }
    void state;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

export default function Mascot() {
  const bubble = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  return (
    <div className="z-mascot" aria-hidden="true">
      <div ref={box} className="z-mascot__box" style={{ width: BOX, height: BOX }}>
        <Canvas
          orthographic
          camera={{ zoom: 1, position: [0, 0, 600], near: 1, far: 2000 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={1.0} color="#fff4e2" />
          <hemisphereLight args={["#fff6e6", "#3a3f4a", 1.4]} />
          <directionalLight position={[200, 400, 600]} intensity={3.2} color="#fff1d6" />
          <directionalLight position={[-500, 200, -300]} intensity={1.6} color="#e0b040" />
          <Val box={box} bubble={bubble} flash={flash} />
        </Canvas>
      </div>
      <div ref={flash} className="z-flash" />
      <div ref={bubble} className="z-bubble" />
    </div>
  );
}

useGLTF.preload(MODEL);
