import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { desk } from "./deskBus";
import { scrollToHash } from "../utils/smoothScroll";
import { useTheme } from "../utils/theme";

/*
  Hero desk (public/desk/desk.glb, built by tools/desk_dev.py).
  Val (Mascot.tsx + deskPlay.ts) plays with the objects: while he uses one its label
  pops up; labels are hidden otherwise. This component publishes the projection he
  walks by and the hooks he calls (deskBus.ts): hide an object he picks up, drop it
  back, open and switch on the laptop, stomp its keys. Hovering an object lifts it and
  shows and shakes its label; clicking it or its label scrolls to its section;
  dragging turns the desk a little.
*/

const MODEL = "/desk/desk.glb";
const TOP = 0.765; // desk surface height, matches TOP in desk_dev.py
const EDGE_Z = 0.24; // the perch strip: just behind the front edge
const PERCH = [-0.72, 0.86]; // desk x range of the perch strip

const TARGETS: Record<string, { href: string; label: string }> = {
  laptop: { href: "#experience", label: "Experience" },
  phone: { href: "#products", label: "Products" },
  mug: { href: "#blog", label: "Writing" },
  sword: { href: "#the-long-road", label: "The Long Road" },
};

// label anchors (desk coords, y relative to the desk top)
const LABELS: Record<string, [number, number, number]> = {
  laptop: [0.02, 0.43, -0.36],
  sword: [0.42, -0.005, 0.44],
  phone: [0.6, 0.03, 0.12],
  mug: [0.4, 0.02, -0.06],
};

const LID_CLOSED = Math.PI / 2 - 0.035;
const SLEEP = 45; // s without use before the laptop screen goes dark

const go = scrollToHash;

function Desk({ perch }: { perch: React.RefObject<HTMLDivElement | null> }) {
  const { scene } = useGLTF(MODEL);
  const { camera, size, gl } = useThree();
  const [hover, setHover] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [theme] = useTheme();
  const hopAt = useRef<Record<string, number>>({});
  const dropAt = useRef<Record<string, number>>({});

  // base transforms live in userData so a remount (the GLTF is cached) never reads a mid-animation pose
  const parts = useMemo(() => {
    const out: Record<string, { obj: THREE.Object3D; y: number; label: THREE.Vector3 }> = {};
    for (const name of Object.keys(TARGETS)) {
      const obj = scene.getObjectByName(name);
      if (!obj) continue;
      obj.userData.y0 ??= obj.position.y;
      obj.visible = true;
      const at = LABELS[name];
      out[name] = { obj, y: obj.userData.y0, label: new THREE.Vector3(at[0], TOP + at[1], at[2]) };
    }
    return out;
  }, [scene]);

  // the near-black legs and edge vanish on the dark page: lift them a little in dark mode
  useEffect(() => {
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
      if (m?.name === "ink") m.color.set(theme === "dark" ? "#59616f" : "#1b1f27");
    });
  }, [scene, theme]);

  // Hover hit boxes: fixed, invisible and a bit bigger than each object, so lifting the
  // hovered object (or Val picking it up) never slides it out from under the cursor.
  const hits = useMemo(() => {
    const out: { name: string; pos: THREE.Vector3; size: THREE.Vector3 }[] = [];
    const lift = 0.06;
    for (const [name, part] of Object.entries(parts)) {
      const box =
        name === "laptop"
          ? new THREE.Box3(new THREE.Vector3(-0.27, TOP, -0.4), new THREE.Vector3(0.31, TOP + 0.38, 0.1))
          : new THREE.Box3().setFromObject(part.obj).translate(new THREE.Vector3(0, part.y - part.obj.position.y, 0));
      box.expandByScalar(0.02);
      box.max.y += lift;
      out.push({ name, pos: box.getCenter(new THREE.Vector3()), size: box.getSize(new THREE.Vector3()) });
    }
    return out;
  }, [parts]);

  const lap = useMemo(() => {
    const lid = scene.getObjectByName("laptop_lid");
    const keys = scene.getObjectByName("laptop_keys");
    const screen = scene.getObjectByName("lid_screen") as THREE.Mesh | undefined;
    if (lid) lid.userData.open ??= lid.rotation.x;
    if (keys) keys.userData.y0 ??= keys.position.y;
    const codes: THREE.Mesh[] = [];
    for (let i = 0; ; i++) {
      const c = scene.getObjectByName(`code_${i}`) as THREE.Mesh | undefined;
      if (!c) break;
      if (c.userData.w == null) {
        c.geometry.computeBoundingBox();
        const b = c.geometry.boundingBox!;
        c.userData.w = b.max.x - b.min.x;
        c.userData.left = c.position.x - c.userData.w / 2;
      }
      codes.push(c);
    }
    const mat = screen?.material as THREE.MeshStandardMaterial | undefined;
    if (mat) mat.emissive.set("#16324a");
    // starts closed and off; Val opens it
    const st = { open: false, on: false, onAt: -9, used: 0, pressAt: -9 };
    if (lid) lid.rotation.x = st.open ? lid.userData.open : LID_CLOSED;
    return { lid, keys, codes, mat, st };
  }, [scene]);

  useEffect(() => {
    const t = () => performance.now() / 1000;
    const st = lap.st;
    desk.items = {};
    for (const n of ["sword", "mug", "phone"]) if (parts[n]) desk.items[n] = parts[n].obj;
    desk.focus = (name) => {
      if (name) hopAt.current[name] = t();
      setFocus(name);
    };
    desk.hide = (name) => {
      if (parts[name]) parts[name].obj.visible = false;
    };
    desk.drop = (name) => {
      if (!parts[name] || parts[name].obj.visible) return;
      parts[name].obj.visible = true;
      dropAt.current[name] = t();
    };
    const laptop = desk.laptop;
    laptop.open = st.open;
    laptop.on = st.on;
    laptop.openLid = () => {
      st.open = laptop.open = true;
      st.used = t();
    };
    laptop.powerOn = () => {
      if (!st.on) st.onAt = t();
      st.on = laptop.on = true;
      st.used = t();
    };
    laptop.press = () => {
      st.used = st.pressAt = t();
      // "type": a couple of code lines change length
      for (let i = 0; i < 2; i++) {
        const c = lap.codes[Math.floor(Math.random() * lap.codes.length)];
        if (!c) continue;
        const s = 0.25 + Math.random();
        c.scale.x = s;
        c.position.x = c.userData.left + (c.userData.w * s) / 2;
      }
    };
    return () => {
      desk.project = null;
      desk.items = {};
      desk.focus = desk.hide = desk.drop = () => {};
      desk.hover = null;
      document.body.style.cursor = "";
    };
  }, [parts, lap]);

  const p = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, dt) => {
    const t = performance.now() / 1000;
    const k = 1 - Math.exp(-dt * 12);
    for (const [name, part] of Object.entries(parts)) {
      const since = t - (hopAt.current[name] ?? -9);
      const hop = since < 0.45 ? Math.sin((since / 0.45) * Math.PI) * 0.07 : 0;
      // put back: falls from a little above, then one small bounce
      const fell = t - (dropAt.current[name] ?? -9);
      let drop = 0;
      if (fell < 0.25) drop = 0.2 * (1 - (fell / 0.25) ** 2);
      else if (fell < 0.45) drop = Math.sin(((fell - 0.25) / 0.2) * Math.PI) * 0.025;
      const up = (hover === name ? 0.045 : 0) + hop + drop;
      part.obj.position.y += (part.y + up - part.obj.position.y) * (hop || drop ? 1 : k);
    }

    // laptop: lid, screen, keys
    const st = lap.st;
    if (hover === "laptop") {
      if (!st.open) desk.laptop.openLid();
      if (!st.on) desk.laptop.powerOn();
      st.used = t;
    }
    if (st.on && t - st.used > SLEEP) st.on = desk.laptop.on = false;
    if (lap.lid) {
      const open = lap.lid.userData.open as number;
      const pressed = t - st.pressAt < 0.15 ? 0.03 : 0;
      const want = !st.open ? LID_CLOSED : hover === "laptop" ? open - 0.22 : open + pressed;
      lap.lid.rotation.x += (want - lap.lid.rotation.x) * (1 - Math.exp(-dt * 7));
    }
    if (lap.keys) lap.keys.position.y = lap.keys.userData.y0 - (t - st.pressAt < 0.12 ? 0.004 : 0);
    lap.codes.forEach((c, i) => void (c.visible = st.on && t > st.onAt + 0.25 + i * 0.08));
    if (lap.mat) lap.mat.emissiveIntensity = st.on ? 1 : 0;

    // the perch strip along the desk's front edge, in canvas px
    const toPx = (x: number) => {
      p.set(x, TOP, EDGE_Z).project(camera);
      return { x: ((p.x + 1) / 2) * size.width, y: ((1 - p.y) / 2) * size.height };
    };
    const el = perch.current;
    if (el) {
      // write only on change: a width write every frame forces a layout when Val reads rects
      const a = toPx(PERCH[0]);
      const b = toPx(PERCH[1]);
      const tf = `translate(${Math.round(a.x)}px, ${Math.round((a.y + b.y) / 2)}px)`;
      const wd = `${Math.round(b.x - a.x)}px`;
      if (el.style.transform !== tf) el.style.transform = tf;
      if (el.style.width !== wd) el.style.width = wd;
    }
    if (!desk.project) {
      const v = new THREE.Vector3();
      desk.project = (x, y, z) => {
        const r = gl.domElement.getBoundingClientRect();
        const w = r.width;
        const h = r.height;
        v.set(x, y, z).project(camera);
        const px = r.left + ((v.x + 1) / 2) * w;
        const py = r.top + ((1 - v.y) / 2) * h;
        v.set(x, y + 0.1, z).project(camera);
        return { x: px, y: py, unit: (py - (r.top + ((1 - v.y) / 2) * h)) / 0.1 };
      };
    }
  });

  // Hover with a short grace period: moving between objects, or from an object onto its
  // label (which sits above the canvas), doesn't drop the hover and flicker the label.
  const leaveTimer = useRef(0);
  const setTo = (name: string | null) => {
    setHover(name);
    desk.hover = name;
    document.body.style.cursor = name ? "pointer" : "";
  };
  const hoverOn = (name: string) => {
    window.clearTimeout(leaveTimer.current);
    if (desk.hover !== name) setTo(name);
  };
  const hoverOff = () => {
    window.clearTimeout(leaveTimer.current);
    leaveTimer.current = window.setTimeout(() => setTo(null), 220);
  };
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  return (
    <>
      <primitive object={scene} />
      {hits.map((b) => (
        <mesh
          key={b.name}
          position={b.pos}
          onPointerMove={(e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation(); // nearest box wins where two overlap
            hoverOn(b.name);
          }}
          onPointerOut={hoverOff}
        >
          <boxGeometry args={[b.size.x, b.size.y, b.size.z]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      ))}
      {Object.keys(TARGETS).map((name) =>
        parts[name] && (focus === name || hover === name) ? (
          <Html key={name} position={parts[name].label} center zIndexRange={[40, 0]}>
            <span className="z-desk__tip">
              <a
                href={TARGETS[name].href}
                tabIndex={-1}
                onPointerEnter={() => hoverOn(name)}
                onPointerLeave={hoverOff}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  go(TARGETS[name].href);
                }}
              >
                <span className={hover === name ? "is-hover" : undefined}>{TARGETS[name].label} →</span>
              </a>
            </span>
          </Html>
        ) : null,
      )}
    </>
  );
}

export default function HeroDesk() {
  const perch = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const down = useRef({ x: 0, y: 0 });
  const [seen, setSeen] = useState(true);

  // stop rendering the desk while it's scrolled out of view
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    desk.perch = perch.current;
    return () => void (desk.perch = null);
  }, []);

  // Clicks go to whatever is highlighted under the pointer; a drag (turning the desk) doesn't count.
  const onDown = (e: React.PointerEvent) => void (down.current = { x: e.clientX, y: e.clientY });
  const onClick = (e: React.MouseEvent) => {
    if (Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) > 6) return;
    if (desk.hover) go(TARGETS[desk.hover].href);
  };

  return (
    <div ref={root} className="z-desk" aria-hidden="true" onPointerDown={onDown} onClick={onClick}>
      <Canvas
        frameloop={seen ? "always" : "never"}
        camera={{ position: [0.45, 2.3, 4.2], fov: 38 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={1.0} color="#fff4e2" />
        <hemisphereLight args={["#fff6e6", "#3a3f4a", 1.2]} />
        <directionalLight position={[2, 4, 3]} intensity={2.6} color="#fff1d6" />
        <directionalLight position={[-3, 2, -2]} intensity={1.0} color="#e0b040" />
        <Desk perch={perch} />
        <OrbitControls
          target={[0, 0.55, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          rotateSpeed={0.5}
          minAzimuthAngle={-0.55}
          maxAzimuthAngle={0.55}
          minPolarAngle={0.85}
          maxPolarAngle={1.25}
        />
      </Canvas>
      <div ref={perch} className="z-desk__perch" data-perch="desk" />
    </div>
  );
}

useGLTF.preload(MODEL);
