import { useGLTF } from '@react-three/drei';

// Model paths
export const MODEL_PATHS = {
  MOON: '/models/Moon.glb',
  SPACESHIP: '/models/Spaceship.glb',
  SPACE_STATION: '/models/SpaceStation.glb',
  SPACE_ROVER: '/models/SpaceRover.glb',
  SATELLITE: '/models/Satellite.glb'
} as const;

// Preload all models
export function preloadAllModels() {
  Object.values(MODEL_PATHS).forEach(path => {
    useGLTF.preload(path);
  });
}

// Preload specific models
export function preloadModels(...paths: string[]) {
  paths.forEach(path => {
    useGLTF.preload(path);
  });
} 