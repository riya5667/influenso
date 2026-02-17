import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, QuadraticBezierLine, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const EARTH_MODEL_URL = "/models/earth.glb";
const EARTH_DIFFUSE_FALLBACK = "/models/earth-diffuse.jpg";

function fibonacciSpherePoints(count, radius = 1.07) {
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ringRadius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.cos(theta) * ringRadius;
    const z = Math.sin(theta) * ringRadius;
    points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
  }

  return points;
}

function buildEvenNetwork(points, neighbors = 4, maxDistance = 1.15) {
  const edges = new Set();
  const degree = Array(points.length).fill(0);
  const radiusSq = points[0].lengthSq();
  const maxAngle = 1.18; // ~67.6 degrees, keeps links local to avoid clipped stubs.

  const connect = (i, j) => {
    const cos = THREE.MathUtils.clamp(points[i].dot(points[j]) / radiusSq, -1, 1);
    const angle = Math.acos(cos);
    if (angle > maxAngle) return;

    const a = Math.min(i, j);
    const b = Math.max(i, j);
    const key = `${a}-${b}`;
    if (!edges.has(key)) {
      edges.add(key);
      degree[a] += 1;
      degree[b] += 1;
    }
  };

  for (let i = 0; i < points.length; i += 1) {
    const distances = [];

    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      distances.push({ j, d: points[i].distanceTo(points[j]) });
    }

    distances.sort((a, b) => a.d - b.d);

    for (let k = 0; k < neighbors; k += 1) {
      if (distances[k].d > maxDistance) continue;
      connect(i, distances[k].j);
    }
  }

  // Ensure every node is connected.
  for (let i = 0; i < points.length; i += 1) {
    if (degree[i] > 0) continue;
    let nearest = -1;
    let minD = Infinity;
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      const d = points[i].distanceTo(points[j]);
      if (d < minD) {
        minD = d;
        nearest = j;
      }
    }
    if (nearest >= 0) connect(i, nearest);
  }

  // Enforce rich local mesh: each node must have at least 4 links.
  const minDegree = 4;
  for (let i = 0; i < points.length; i += 1) {
    if (degree[i] >= minDegree) continue;

    const distances = [];
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      distances.push({ j, d: points[i].distanceTo(points[j]) });
    }
    distances.sort((a, b) => a.d - b.d);

    for (let k = 0; k < distances.length && degree[i] < minDegree; k += 1) {
      connect(i, distances[k].j);
    }
  }

  // Add multiple horizontal neighbors (similar latitude bands) for lateral mesh.
  for (let i = 0; i < points.length; i += 1) {
    const candidates = [];
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      const yDiff = Math.abs(points[i].y - points[j].y);
      if (yDiff > 0.32) continue;
      candidates.push({ j, d: points[i].distanceTo(points[j]), yDiff });
    }

    if (!candidates.length) continue;
    candidates.sort((a, b) => {
      if (a.yDiff !== b.yDiff) return a.yDiff - b.yDiff;
      return a.d - b.d;
    });

    for (let n = 0; n < Math.min(4, candidates.length); n += 1) {
      connect(i, candidates[n].j);
    }
  }

  // Ring links in latitude bands for complete horizontal sweep.
  const bands = 8;
  const grouped = Array.from({ length: bands }, () => []);
  for (let i = 0; i < points.length; i += 1) {
    const yNorm = (points[i].y + 1) / 2;
    const band = Math.min(bands - 1, Math.max(0, Math.floor(yNorm * bands)));
    grouped[band].push(i);
  }

  for (const group of grouped) {
    if (group.length < 3) continue;

    group.sort((a, b) => {
      const azA = Math.atan2(points[a].z, points[a].x);
      const azB = Math.atan2(points[b].z, points[b].x);
      return azA - azB;
    });

    for (let i = 0; i < group.length - 1; i += 1) {
      const a = group[i];
      const b = group[i + 1];
      const c = i + 2 < group.length ? group[i + 2] : -1;
      connect(a, b);
      if (c >= 0) connect(a, c);
    }
  }

  return [...edges].map((key) => key.split("-").map(Number));
}

function createStarTexture(size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const c = size / 2;

  const radial = ctx.createRadialGradient(c, c, 0, c, c, c);
  radial.addColorStop(0, "rgba(255,255,255,1)");
  radial.addColorStop(0.16, "rgba(216,247,255,0.95)");
  radial.addColorStop(0.44, "rgba(134,228,255,0.45)");
  radial.addColorStop(1, "rgba(134,228,255,0)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function EarthModel() {
  const { scene } = useGLTF(EARTH_MODEL_URL);
  const diffuseTexture = useTexture(EARTH_DIFFUSE_FALLBACK);

  const { model, scaleFactor, centeredOffset } = useMemo(() => {
    diffuseTexture.colorSpace = THREE.SRGBColorSpace;
    diffuseTexture.flipY = false;

    const cloned = scene.clone(true);

    cloned.traverse((node) => {
      if (!node.isMesh || !node.material) return;
      const materials = Array.isArray(node.material) ? node.material : [node.material];

      materials.forEach((mat) => {
        mat.map = diffuseTexture;
        mat.color = new THREE.Color(1, 1, 1);
        mat.emissive = new THREE.Color(0, 0, 0);
        mat.needsUpdate = true;
      });
    });

    const bounds = new THREE.Box3().setFromObject(cloned);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const targetDiameter = 2.1;
    const normalizedScale = targetDiameter / maxAxis;

    return {
      model: cloned,
      scaleFactor: normalizedScale,
      centeredOffset: center.multiplyScalar(-normalizedScale),
    };
  }, [scene, diffuseTexture]);

  return (
    <group scale={[scaleFactor, scaleFactor, scaleFactor]} position={centeredOffset.toArray()}>
      <primitive object={model} />
    </group>
  );
}

function GlowNode({ position, phase = 0, starTexture }) {
  const coreRef = useRef();
  const starRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime * 1.9 + phase;
    const pulse = 1 + Math.sin(t) * 0.16;

    if (coreRef.current) {
      coreRef.current.scale.setScalar(pulse);
      coreRef.current.material.opacity = 0.9 + Math.sin(t) * 0.08;
    }

    if (starRef.current) {
      const s = 0.12 + Math.sin(t) * 0.02;
      starRef.current.scale.set(s, s, 1);
      starRef.current.material.opacity = 0.42 + Math.sin(t) * 0.06;
    }

  });

  return (
    <group position={position.toArray()}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.0065, 10, 10]} />
        <meshBasicMaterial color="#f2fdff" transparent opacity={0.96} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <sprite ref={starRef}>
        <spriteMaterial
          map={starTexture}
          color="#86e8ff"
          transparent
          opacity={0.42}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
    </group>
  );
}

function GlobeNetworkOverlay() {
  const points = useMemo(() => fibonacciSpherePoints(48, 1.07), []);
  const starTexture = useMemo(() => createStarTexture(128), []);

  useEffect(() => {
    return () => {
      starTexture.dispose();
    };
  }, [starTexture]);

  const arcs = useMemo(() => {
    const pairs = buildEvenNetwork(points, 4, 1.15);

    return pairs.map(([a, b], idx) => {
      const start = points[a];
      const end = points[b];
      const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(1.108 + (idx % 2) * 0.012);
      return { start, end, mid, idx };
    });
  }, [points]);

  return (
    <>
      {arcs.map((arc) => (
        <QuadraticBezierLine
          key={`arc-${arc.idx}`}
          start={arc.start.toArray()}
          end={arc.end.toArray()}
          mid={arc.mid.toArray()}
          color={arc.idx % 2 === 0 ? "#5df4ff" : "#64b5ff"}
          lineWidth={1.14}
          transparent
          opacity={0.84}
        />
      ))}

      {points.map((point, idx) => (
        <GlowNode key={`node-${idx}`} position={point} phase={idx * 0.41} starTexture={starTexture} />
      ))}
    </>
  );
}

function RotatingEarth() {
  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <group ref={ref}>
      <EarthModel />
      <GlobeNetworkOverlay />
    </group>
  );
}

useGLTF.preload(EARTH_MODEL_URL);
useTexture.preload(EARTH_DIFFUSE_FALLBACK);

function GlobeCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.15, 3.2], fov: 44 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.1;
      }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight intensity={0.55} skyColor="#c4e0ff" groundColor="#0a1027" />
      <directionalLight intensity={1.1} position={[3.5, 2.7, 4.5]} color="#f1f7ff" />
      <pointLight intensity={0.75} position={[-3, -0.2, 2.4]} color="#7dd3fc" />
      <Environment preset="city" />

      <RotatingEarth />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 2.7}
        maxPolarAngle={Math.PI - Math.PI / 2.7}
      />
    </Canvas>
  );
}

export default GlobeCanvas;
