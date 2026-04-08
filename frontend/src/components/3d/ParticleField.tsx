import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  color?: string;
}

export function ParticleField({ count = 700, color = "#91f8ff" }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const v = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;
      p[idx] = (Math.random() - 0.5) * 14;
      p[idx + 1] = (Math.random() - 0.5) * 7;
      p[idx + 2] = (Math.random() - 0.5) * 14;

      v[idx] = (Math.random() - 0.5) * 0.0012;
      v[idx + 1] = (Math.random() - 0.5) * 0.0009;
      v[idx + 2] = (Math.random() - 0.5) * 0.0012;
    }

    return { positions: p, velocities: v };
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) {
      return;
    }

    const elapsed = state.clock.elapsedTime;
    const geometry = pointsRef.current.geometry;
    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;

    for (let i = 0; i < count; i += 1) {
      const idx = i * 3;

      positions[idx] += velocities[idx] + Math.sin(elapsed + i * 0.02) * 0.0008;
      positions[idx + 1] += velocities[idx + 1] + Math.cos(elapsed * 0.8 + i * 0.01) * 0.0007;
      positions[idx + 2] += velocities[idx + 2] + Math.sin(elapsed * 0.6 + i * 0.015) * 0.0009;

      if (positions[idx] > 7) positions[idx] = -7;
      if (positions[idx] < -7) positions[idx] = 7;
      if (positions[idx + 1] > 3.5) positions[idx + 1] = -3.5;
      if (positions[idx + 1] < -3.5) positions[idx + 1] = 3.5;
      if (positions[idx + 2] > 7) positions[idx + 2] = -7;
      if (positions[idx + 2] < -7) positions[idx + 2] = 7;
    }

    attribute.needsUpdate = true;
    pointsRef.current.rotation.y = elapsed * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.035} transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}
