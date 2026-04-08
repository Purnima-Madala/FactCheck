import { Float } from "@react-three/drei";

interface NeuralOrbProps {
  color: string;
  position: [number, number, number];
  scale: number;
  intensity: number;
}

export function NeuralOrb({ color, position, scale, intensity }: NeuralOrbProps) {
  return (
    <Float speed={1.7} rotationIntensity={0.7} floatIntensity={0.8}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={Math.max(0.25, intensity)}
          roughness={0.25}
          metalness={0.35}
        />
      </mesh>
    </Float>
  );
}
