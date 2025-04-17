"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree, Object3DNode, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PerspectiveCamera, Scene, Fog, Color } from "three";
import ThreeGlobe from "three-globe";
import countries from "@/data/globe.json";

// Fiber extension for ThreeGlobe
declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: Object3DNode<ThreeGlobe, typeof ThreeGlobe>;
  }
}
extend({ ThreeGlobe });

const RING_SPEED = 3;
const ASPECT_RATIO = 1.2;

// Types
type ArcData = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type PointData = {
  size: number;
  order: number;
  color: (t: number) => string;
  lat: number;
  lng: number;
};

type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

const defaultGlobeConfig: Required<GlobeConfig> = {
  pointSize: 4,
  globeColor: "#062056",
  showAtmosphere: true,
  atmosphereColor: "#FFFFFF",
  atmosphereAltitude: 0.1,
  emissive: "#062056",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#38bdf8",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 23.685, lng: 90.3563 },
  autoRotate: true,
  autoRotateSpeed: 0.5,
};

// Sample arc data
const arcs: ArcData[] = [
  {
    order: 1,
    startLat: 40.7128,
    startLng: -74.006,
    endLat: 51.5074,
    endLng: -0.1278,
    arcAlt: 1.2,
    color: "#FF0000",
  },
  {
    order: 2,
    startLat: 34.0522,
    startLng: -118.2437,
    endLat: 48.8566,
    endLng: 2.3522,
    arcAlt: 1.0,
    color: "#00FF00",
  },
  {
    order: 3,
    startLat: 39.9042,
    startLng: 116.4074,
    endLat: 35.6895,
    endLng: 139.6917,
    arcAlt: 1.5,
    color: "#0000FF",
  },
];

// Utility functions
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 255, g: 255, b: 255 };
};

const genRandomIndices = (length: number, count: number): number[] => {
  const set = new Set<number>();
  while (set.size < count) set.add(Math.floor(Math.random() * length));
  return Array.from(set);
};

// Main Globe Component
function Globe({ globeConfig }: { globeConfig: GlobeConfig }) {
  const globeRef = useRef<ThreeGlobe>(null);
  const [globeData, setGlobeData] = useState<PointData[]>([]);

  const config = useMemo(
    () => ({ ...defaultGlobeConfig, ...globeConfig }),
    [globeConfig]
  );

  const prepareMaterial = useCallback(() => {
    const mat = globeRef.current?.globeMaterial() as any;
    if (!mat) return;
    mat.color = new Color(config.globeColor);
    mat.emissive = new Color(config.emissive);
    mat.emissiveIntensity = config.emissiveIntensity;
    mat.shininess = config.shininess;
  }, [config]);

  const generatePoints = useCallback(() => {
    const data = arcs.flatMap(
      ({ order, color, startLat, startLng, endLat, endLng }) => {
        const { r, g, b } = hexToRgb(color);
        const getColor = (t: number) => `rgba(${r},${g},${b},${1 - t})`;
        return [
          {
            size: config.pointSize,
            order,
            color: getColor,
            lat: startLat,
            lng: startLng,
          },
          {
            size: config.pointSize,
            order,
            color: getColor,
            lat: endLat,
            lng: endLng,
          },
        ];
      }
    );

    const unique = data.filter(
      (d, i, arr) =>
        arr.findIndex((v) => v.lat === d.lat && v.lng === d.lng) === i
    );
    setGlobeData(unique);
  }, [config.pointSize]);

  const startAnimation = useCallback(() => {
    if (!globeRef.current) return;

    globeRef.current
      .arcsData(arcs)
      .arcStartLat((d) => (d as ArcData).startLat)
      .arcStartLng((d) => (d as ArcData).startLng)
      .arcEndLat((d) => (d as ArcData).endLat)
      .arcEndLng((d) => (d as ArcData).endLng)
      .arcColor((d: any) => (d as ArcData).color)
      .arcAltitude((d) => (d as ArcData).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(config.arcLength)
      .arcDashGap(15)
      .arcDashInitialGap((d) => (d as ArcData).order)
      .arcDashAnimateTime(config.arcTime)

      .pointsData(globeData)
      .pointColor((e) => {
        const point = e as PointData;
        return typeof point.color === "function" ? point.color(0) : point.color;
      })
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2)

      .ringsData([])
      .ringColor(() => (t: any) => t.color)
      .ringMaxRadius(config.maxRings)
      .ringPropagationSpeed(RING_SPEED)
      .ringRepeatPeriod((config.arcTime * config.arcLength) / config.rings);
  }, [globeData, config]);

  // Initial setup
  useEffect(() => {
    if (!globeRef.current) return;
    generatePoints();
    prepareMaterial();
  }, [generatePoints, prepareMaterial]);

  useEffect(() => {
    if (!globeRef.current || globeData.length === 0) return;

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(config.showAtmosphere)
      .atmosphereColor(config.atmosphereColor)
      .atmosphereAltitude(config.atmosphereAltitude)
      .hexPolygonColor(() => config.polygonColor);

    startAnimation();
  }, [globeData, config, startAnimation]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!globeRef.current || globeData.length === 0) return;
      const show = genRandomIndices(
        globeData.length,
        Math.floor(arcs.length * 1.5)
      );
      globeRef.current.ringsData(globeData.filter((_, i) => show.includes(i)));
    }, 2000);
    return () => clearInterval(interval);
  }, [globeData]);

  return <threeGlobe ref={globeRef} />;
}

// Renderer Config
function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x000000, 0); // Transparent
  }, [gl, size]);
  return null;
}

// Main World Scene
export function World() {
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);

  return (
    <Canvas
      camera={new PerspectiveCamera(50, ASPECT_RATIO, 180, 1800)}
      onCreated={({ camera }) => camera.position.set(0, 0, 400)}
    >
      <WebGLRendererConfig />
      <ambientLight intensity={1} />
      <directionalLight position={[-100, 0, 400]} intensity={0.6} />
      <directionalLight position={[100, 0, 400]} intensity={0.6} />
      <OrbitControls enableZoom />
      <Globe globeConfig={defaultGlobeConfig} />
    </Canvas>
  );
}
