import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

const EARTH_MODEL_URL = "/models/earth.glb";
const EARTH_DIFFUSE_FALLBACK = "/models/earth-diffuse.jpg";

function latLngToVector(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
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

function SingleMarker() {
  const pulseRef = useRef();
  const markerRef = useRef();
  const position = useMemo(() => latLngToVector(28.6139, 77.209, 1.08), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pulseRef.current) {
      const s = 1 + Math.sin(t * 2.2) * 0.22;
      pulseRef.current.scale.setScalar(s);
      pulseRef.current.material.opacity = 0.28 + Math.sin(t * 2.2) * 0.08;
    }
    if (markerRef.current) {
      markerRef.current.material.opacity = 0.75 + Math.sin(t * 2.2) * 0.2;
    }
  });

  return (
    <group position={position.toArray()}>
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.016, 16, 16]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.85} />
      </mesh>
      <mesh ref={pulseRef}>
        <ringGeometry args={[0.024, 0.042, 40]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.28} side={THREE.DoubleSide} />
      </mesh>
    </group>
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
      <SingleMarker />
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
