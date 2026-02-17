import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function DustField({ count = 2400, radius = 180 }) {
  const pointsRef = useRef();

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const r = Math.cbrt(Math.random()) * radius;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }

    return positions;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.011;
      pointsRef.current.rotation.x += delta * 0.0038;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#cbd5ff" size={0.34} sizeAttenuation transparent opacity={0.52} depthWrite={false} />
    </points>
  );
}

function NebulaCloud({ position, color, scale = 1 }) {
  const ref = useRef();

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.022;
      ref.current.rotation.y = state.clock.elapsedTime * 0.009;
    }
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[8, 24, 24]} />
      <meshBasicMaterial color={new THREE.Color(color)} transparent opacity={0.11} depthWrite={false} />
    </mesh>
  );
}

function StarRibbon({ count = 300, radius = 58 }) {
  const ref = useRef();

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const t = (i / count) * Math.PI * 2;
      const ring = radius + (Math.random() - 0.5) * 8;
      positions[i * 3] = Math.cos(t) * ring;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 11;
      positions[i * 3 + 2] = Math.sin(t) * ring;
    }
    return positions;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.021;
      ref.current.rotation.z += delta * 0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={data.length / 3} array={data} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#8be9ff" size={0.28} transparent opacity={0.38} depthWrite={false} />
    </points>
  );
}

function GalaxyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 60], fov: 65 }} dpr={[1, 1.25]} gl={{ antialias: false, alpha: true }}>
        <color attach="background" args={["#040816"]} />
        <fog attach="fog" args={["#040816", 35, 190]} />

        <ambientLight intensity={0.4} />
        <pointLight position={[20, 18, 24]} intensity={1.35} color="#5ab8ff" />
        <pointLight position={[-18, -12, 20]} intensity={1.05} color="#a855f7" />

        <Stars radius={220} depth={110} count={6400} factor={3.3} saturation={0} fade speed={0.7} />
        <DustField count={3600} radius={210} />
        <StarRibbon />

        <NebulaCloud position={[24, -6, -16]} color="#5b6dff" scale={1.8} />
        <NebulaCloud position={[-26, 16, -24]} color="#a855f7" scale={2} />
        <NebulaCloud position={[6, -24, -28]} color="#2dd4bf" scale={1.4} />
        <NebulaCloud position={[-8, 8, -22]} color="#3b82f6" scale={1.6} />
      </Canvas>
    </div>
  );
}

export default GalaxyBackground;
