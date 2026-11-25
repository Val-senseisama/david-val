/*
  Shared state between the hero desk (HeroDesk.tsx) and the mascot (Mascot.tsx,
  deskPlay.ts). The desk publishes a projection from desk coordinates to viewport
  px, the objects Val can pick up, and controls for hiding, dropping and the laptop;
  Val's desk routine calls them while he plays with each object.
*/
import type * as THREE from "three";

export type Projected = { x: number; y: number; unit: number }; // viewport px, px per desk unit

export const desk = {
  perch: null as HTMLElement | null,
  hover: null as string | null,
  // desk coords (three.js, y up) -> viewport px; null until the desk has rendered
  project: null as ((x: number, y: number, z: number) => Projected) | null,
  items: {} as Record<string, THREE.Object3D>, // originals, for cloning into Val's hand
  focus: (() => {}) as (name: string | null) => void, // show this object's label (null hides)
  hide: (() => {}) as (name: string) => void, // he picked it up
  drop: (() => {}) as (name: string) => void, // put it back: it falls into place
  laptop: {
    open: false,
    on: false,
    openLid: () => {},
    powerOn: () => {},
    press: () => {}, // a key got stomped
  },
};
