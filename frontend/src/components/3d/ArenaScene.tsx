import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { MODEL_SELECTION } from "../../store/arenaStore";
import type { ModelResult } from "../../types";
import { NeuralOrb } from "./NeuralOrb";
import { ParticleField } from "./ParticleField";

interface ArenaSceneProps {
  results: ModelResult[];
  loading: boolean;
  winner: string;
}

export function ArenaScene({ results, loading, winner }: ArenaSceneProps) {
  const hasResults = results.length > 0;

  return (
    <div className="glass h-[360px] w-full overflow-hidden rounded-2xl">
      <Canvas camera={{ position: [0, 1.5, 6], fov: 55 }}>
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#02030a", 5, 14]} />
        <ambientLight intensity={0.28} />
        <pointLight position={[0, 2, 2]} intensity={2.0} color="#bae6fd" />
        <pointLight position={[-2, -1, -2]} intensity={0.9} color="#a7f3d0" />
        <Sparkles count={120} scale={10} size={1.4} speed={0.24} color="#e2e8f0" />
        <ParticleField count={900} />

        {MODEL_SELECTION.map((model, index) => {
          const result = results.find((item) => item.modelId === model.id);
          const angle = (index / MODEL_SELECTION.length) * Math.PI * 2;
          const ringPosition: [number, number, number] = [
            Math.cos(angle) * 2.2,
            Math.sin(angle * 1.2) * 0.4,
            Math.sin(angle) * 2.2
          ];

          const battlePosition: [number, number, number] = [
            Math.cos(angle) * 1.1,
            0,
            Math.sin(angle) * 1.1
          ];

          const leaderPosition: [number, number, number] = hasResults
            ? result?.modelId === winner
              ? [0, 1.4, 0]
              : [Math.cos(angle) * 2.8, -0.6, Math.sin(angle) * 2.8]
            : ringPosition;

          const position = loading ? battlePosition : leaderPosition;
          const composite = result?.compositeScore ?? 35;

          return (
            <NeuralOrb
              key={model.id}
              color={model.color}
              position={position}
              scale={result?.modelId === winner && !loading ? 1.3 : 0.9}
              intensity={0.3 + composite / 65}
            />
          );
        })}

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
          <circleGeometry args={[6, 64]} />
          <meshBasicMaterial color="#0f172a" transparent opacity={0.55} />
        </mesh>

        <mesh position={[0, -1.29, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.25, 1.42, 64]} />
          <meshBasicMaterial color="#bae6fd" transparent opacity={loading ? 0.72 : 0.4} />
        </mesh>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.75} />
      </Canvas>
    </div>
  );
}
