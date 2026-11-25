import { desk } from "./deskBus";

/*
  Val's routine on the hero desk. Each object has a little act (a generator that
  runs one step per frame): he walks over, shows its label, picks it up and plays:
    sword  - swings it about, then drops it
    mug    - takes a sip, tosses it, puts it down
    phone  - takes a couple of selfies
    laptop - opens it, switches it on, then jumps up and down on the keyboard
  Acts run in a fresh random order each round. Hovering an object for a moment
  makes him go and do that one next. Positions are desk coords (three.js, y up);
  Mascot.tsx projects them to the screen through desk.project.
*/

export const TOP = 0.765; // desk surface, matches desk_dev.py
export const EDGE_Z = 0.24; // the strip along the front he walks on
export const H = 0.42; // Val's height in desk units
const KEYS_Y = 0.0235; // keyboard top, above the desk surface
const X_MIN = -0.78;
const X_MAX = 0.84;
const SPEED = 0.6; // desk units / s

export type Pose = "stand" | "run" | "air" | "reach" | "hold" | "swing" | "sip" | "toss" | "selfie";

export const P = {
  on: false,
  x: 0,
  z: EDGE_Z,
  h: 0, // feet above the desk surface
  yaw: null as number | null, // null: look at the cursor
  dir: 1,
  pose: "stand" as Pose,
  cheer: false, // arms up while hopping
  held: null as string | null,
  since: 0, // when the current pose started
  shot: 0, // which selfie
  flashAt: -9,
  landAt: -9,
  dt: 0,
};

export const hooks = { say: (() => {}) as (text: string, secs?: number) => void };

const now = () => performance.now() / 1000;

type Act = Generator<void, void, void>;

function* wait(secs: number): Act {
  const end = now() + secs;
  while (now() < end) yield;
}

function* pose(p: Pose, secs: number, yaw: number | null = P.yaw): Act {
  P.pose = p;
  P.yaw = yaw;
  P.since = now();
  yield* wait(secs);
}

function* walkTo(x: number, z: number): Act {
  P.pose = "run";
  for (;;) {
    const dx = x - P.x;
    const dz = z - P.z;
    const d = Math.hypot(dx, dz);
    if (d < 0.01) break;
    const step = Math.min(d, SPEED * P.dt);
    P.x += (dx / d) * step;
    P.z += (dz / d) * step;
    if (Math.abs(dx) > 0.005) P.dir = Math.sign(dx);
    // face where he's going, but never turn his back to the viewer
    P.yaw = Math.max(-1.2, Math.min(1.2, Math.atan2(dx, Math.abs(dz) + 0.05)));
    yield;
  }
  P.pose = "stand";
}

function* hop(x: number, z: number, h1: number, peak: number, dur: number): Act {
  const sx = P.x;
  const sz = P.z;
  const h0 = P.h;
  const t0 = now();
  P.pose = "air";
  if (Math.abs(x - sx) > 0.01) P.dir = Math.sign(x - sx);
  for (;;) {
    const e = Math.min(1, (now() - t0) / dur);
    P.x = sx + (x - sx) * e;
    P.z = sz + (z - sz) * e;
    P.h = h0 + (h1 - h0) * e + peak * 4 * e * (1 - e);
    if (e >= 1) break;
    yield;
  }
  P.landAt = now();
  P.pose = "stand";
}

function pickUp(name: string) {
  desk.hide(name);
  P.held = name;
}

function putDown() {
  if (P.held) desk.drop(P.held);
  P.held = null;
}

// where he stands for each act; every object ends up on his right hand's side (screen left)
const STAND: Record<string, [number, number]> = {
  sword: [0.21, 0.25],
  mug: [0.58, -0.18],
  phone: [0.82, 0.1],
  laptop: [0.4, 0.16],
};

const ACTS: Record<string, () => Act> = {
  *sword() {
    yield* walkTo(...STAND.sword);
    desk.focus("sword");
    try {
      yield* pose("reach", 0.45, -0.5);
      pickUp("sword");
      hooks.say("En garde!", 1.6);
      yield* pose("swing", 2.6, 0);
      yield* pose("hold", 0.35, -0.2);
      putDown();
      hooks.say("Oops.", 1.2);
      yield* pose("stand", 0.6, -0.3);
    } finally {
      putDown();
    }
  },

  *mug() {
    yield* walkTo(...STAND.mug);
    desk.focus("mug");
    try {
      yield* pose("reach", 0.45, -0.7);
      pickUp("mug");
      yield* pose("hold", 0.3, -0.2);
      yield* pose("sip", 1.4, 0);
      yield* pose("toss", 1.0, 0);
      yield* pose("hold", 0.3, -0.3);
      yield* pose("reach", 0.3, -0.7);
      putDown();
      yield* pose("stand", 0.4, -0.3);
    } finally {
      putDown();
    }
  },

  *phone() {
    yield* walkTo(...STAND.phone);
    desk.focus("phone");
    try {
      yield* pose("reach", 0.45, -0.7);
      pickUp("phone");
      yield* pose("hold", 0.3, 0);
      for (P.shot = 0; P.shot < 2; P.shot++) {
        yield* pose("selfie", 0.55, P.shot ? -0.25 : 0.25);
        P.flashAt = now();
        if (!P.shot) hooks.say("Selfie!", 1.4);
        yield* wait(0.55);
      }
      yield* pose("hold", 0.3, -0.3);
      yield* pose("reach", 0.3, -0.7);
      putDown();
      yield* pose("stand", 0.4, -0.3);
    } finally {
      putDown();
    }
  },

  *laptop() {
    yield* walkTo(...STAND.laptop);
    desk.focus("laptop");
    if (!desk.laptop.open) {
      yield* pose("reach", 0.35, -0.6);
      desk.laptop.openLid();
      yield* wait(0.6);
    }
    if (!desk.laptop.on) {
      yield* pose("reach", 0.3, -0.6);
      desk.laptop.powerOn();
      yield* pose("stand", 0.8, -0.5);
    }
    try {
      P.cheer = true;
      yield* hop(0.2, -0.12, KEYS_Y, 0.16, 0.5);
      for (const x of [0.06, -0.1, -0.18, -0.02, 0.14]) {
        yield* hop(x, -0.12 + (Math.random() - 0.5) * 0.06, KEYS_Y, 0.07, 0.3);
        desk.laptop.press();
      }
      P.cheer = false;
      yield* hop(STAND.laptop[0], STAND.laptop[1], 0, 0.15, 0.5);
    } finally {
      P.cheer = false;
      P.h = 0;
    }
  },

  // tapped him while he was between acts
  *poke() {
    yield* hop(P.x, P.z, P.h, 0.12, 0.45);
  },
};

const NAMES = ["sword", "mug", "phone", "laptop"];
let act: Act | null = null;
let actName: string | null = null;
let last: string | null = null;
let queue: string[] = [];
let idleUntil = 0;
let focusOff = 0;
let hoverName: string | null = null;
let hoverSince = 0;
let poke = false;

function shuffle(): string[] {
  const q = [...NAMES];
  for (let i = q.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [q[i], q[j]] = [q[j], q[i]];
  }
  if (q[0] === last) q.push(q.shift()!);
  return q;
}

function start(name: string) {
  act = ACTS[name]();
  actName = name;
  focusOff = 0;
}

function abort() {
  act?.return(); // runs the act's finally: anything in hand goes back on the desk
  act = null;
  actName = null;
  desk.focus(null);
  P.pose = "stand";
  P.cheer = false;
}

/** Viewport px where he should first land: the stand spot of his first act. */
export function entryX(): number | null {
  if (!desk.project) return null;
  if (!queue.length) queue = shuffle();
  const [x, z] = STAND[queue[0]];
  return desk.project(x, TOP, z).x;
}

/** He just landed on the desk at viewport x = px. */
export function deskEnter(px: number) {
  const pr = desk.project;
  let x = 0;
  if (pr) {
    const a = pr(X_MIN, TOP, EDGE_Z).x;
    const b = pr(X_MAX, TOP, EDGE_Z).x;
    x = X_MIN + ((px - a) / (b - a || 1)) * (X_MAX - X_MIN);
  }
  Object.assign(P, { on: true, x: Math.max(X_MIN, Math.min(X_MAX, x)), z: EDGE_Z, h: 0, yaw: null, pose: "stand" });
  idleUntil = now() + 0.3;
}

export function deskLeave() {
  abort();
  P.on = false;
  P.h = 0;
}

export function deskPoke() {
  poke = true;
}

export function deskStep(t: number, dt: number) {
  P.dt = dt;
  const hv = desk.hover;
  if (hv !== hoverName) {
    hoverName = hv;
    hoverSince = t;
  }
  if (focusOff && t > focusOff) {
    desk.focus(null);
    focusOff = 0;
  }
  // hovering something for a moment: go and play with that one instead
  if (hv && hv !== actName && ACTS[hv] && t - hoverSince > 0.35) {
    hoverSince = Infinity; // once per hover
    abort();
    start(hv);
  }
  if (act) {
    if (act.next().done) {
      last = actName;
      act = null;
      actName = null;
      focusOff = t + 0.9;
      idleUntil = t + 1.2 + Math.random() * 1.6;
      P.pose = "stand";
      P.yaw = null;
    }
    return;
  }
  if (poke) {
    poke = false;
    act = ACTS.poke();
    return;
  }
  if (t < idleUntil) return;
  if (!queue.length) queue = shuffle();
  start(queue.shift()!);
}
