"use client";

import { useRef, useMemo, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ── Mouse tracker physics ── */
const mouse = { x: 0, y: 0, vx: 0, vy: 0 };

/* ── Individual floating sphere with boundary physics ── */
function FloatingSphere({ position, color, size, speed, phase }) {
  const meshRef = useRef();
  const velRef = useRef({
    x: (Math.random() - 0.5) * 0.012,
    y: (Math.random() - 0.5) * 0.008,
    z: (Math.random() - 0.5) * 0.005,
  });
  const posRef = useRef({ x: position[0], y: position[1], z: position[2] });

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const vel = velRef.current;
    const pos = posRef.current;

    // Soft boundary bounce
    const BOUNDS = { x: 6, y: 3.5, z: 2 };
    if (Math.abs(pos.x) > BOUNDS.x) vel.x *= -1;
    if (Math.abs(pos.y) > BOUNDS.y) vel.y *= -1;
    if (Math.abs(pos.z) > BOUNDS.z) vel.z *= -1;

    // Mouse parallax attraction (very subtle)
    vel.x += mouse.x * 0.0003;
    vel.y += mouse.y * 0.0003;

    // Damping
    vel.x *= 0.995;
    vel.y *= 0.995;
    vel.z *= 0.998;

    // Integrate
    pos.x += vel.x;
    pos.y += vel.y;
    pos.z += vel.z;

    // Breathing oscillation
    const breathe = Math.sin(t * speed + phase) * 0.12;

    if (meshRef.current) {
      meshRef.current.position.set(pos.x, pos.y + breathe, pos.z);
      meshRef.current.rotation.x += 0.003 * speed;
      meshRef.current.rotation.y += 0.005 * speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 24, 24]} position={position}>
      <MeshDistortMaterial
        color={color}
        distort={0.35}
        speed={1.5}
        roughness={0.1}
        metalness={0.3}
        transparent
        opacity={0.55}
        envMapIntensity={0.8}
      />
    </Sphere>
  );
}

/* ── Small orbiting particles ── */
function Particles() {
  const pointsRef = useRef();
  const count = 160;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#1976D2'),
      new THREE.Color('#42A5F5'),
      new THREE.Color('#00B4D8'),
      new THREE.Color('#FFC107'),
    ];
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 4;
      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.018;
    pointsRef.current.rotation.x = state.clock.elapsedTime * 0.006;
    // Subtle mouse parallax on particles
    pointsRef.current.position.x = mouse.x * 0.15;
    pointsRef.current.position.y = mouse.y * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Abstract fan-blade rings ── */
function FanRing({ radius, y, speed }) {
  const groupRef = useRef();
  const blades = 6;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += speed;
      groupRef.current.position.x = mouse.x * 0.3;
      groupRef.current.position.y = y + mouse.y * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, y, -3]}>
      {Array.from({ length: blades }).map((_, i) => {
        const angle = (i / blades) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
            rotation={[0, 0, angle + Math.PI / 2]}
          >
            <capsuleGeometry args={[0.04, 0.35, 4, 8]} />
            <meshStandardMaterial
              color="#00B4D8"
              emissive="#1565C0"
              emissiveIntensity={0.4}
              transparent
              opacity={0.4}
              metalness={0.5}
              roughness={0.2}
            />
          </mesh>
        );
      })}
      {/* Center hub */}
      <mesh>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#42A5F5" emissive="#42A5F5" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

/* ── Camera parallax rig ── */
function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Scene config ── */
const SPHERES = [
  { position: [-4.5, 1.5, -1], color: '#1565C0', size: 0.55, speed: 0.7, phase: 0 },
  { position: [4,   -1,  -0.5], color: '#00B4D8', size: 0.42, speed: 0.95, phase: 1.2 },
  { position: [-2,  -2,  -2], color: '#42A5F5', size: 0.35, speed: 1.1, phase: 2.4 },
  { position: [2.5, 2,  -1.5], color: '#FFC107', size: 0.28, speed: 0.8, phase: 0.8 },
  { position: [5.5, 0.5, -2], color: '#1976D2', size: 0.48, speed: 0.6, phase: 3.1 },
  { position: [-5.5, -1, -1.5], color: '#00B4D8', size: 0.3, speed: 1.2, phase: 1.9 },
  { position: [0,  2.5, -2.5], color: '#42A5F5', size: 0.22, speed: 1.4, phase: 0.5 },
  { position: [3,  -2.5, -1], color: '#1565C0', size: 0.38, speed: 0.75, phase: 2.8 },
];

/* ── Main component ── */
export default function Scene3D() {
  useEffect(() => {
    const handleMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div id="scene-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
        performance={{ min: 0.5 }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#42A5F5" />
        <pointLight position={[-5, -3, 2]} intensity={0.8} color="#1976D2" />
        <pointLight position={[0, 4, -2]} intensity={0.6} color="#00B4D8" />

        {/* Particles */}
        <Particles />

        {/* Floating spheres */}
        {SPHERES.map((s, i) => (
          <FloatingSphere key={i} {...s} />
        ))}

        {/* Fan rings */}
        <FanRing radius={0.6} y={0.8} speed={0.008} />
        <FanRing radius={0.4} y={-1.2} speed={-0.012} />

        {/* Camera parallax */}
        <CameraRig />
      </Canvas>
    </div>
  );
}
