import { Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";

interface ParticleBackgroundProps {
  theme: "dark" | "light";
}

export function ParticleBackground({ theme }: ParticleBackgroundProps) {
  const sparkleColor = theme === "dark" ? "#8de6ff" : "#0ea5e9";

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
      <Canvas camera={{ position: [0, 0, 7], fov: 55 }} gl={{ alpha: true }}>
        <ambientLight intensity={theme === "dark" ? 0.35 : 0.5} />
        <Sparkles
          count={theme === "dark" ? 180 : 130}
          scale={12}
          size={1.8}
          speed={0.25}
          color={sparkleColor}
        />
        <ParticleField count={560} color={sparkleColor} />
      </Canvas>
    </div>
  );
}
