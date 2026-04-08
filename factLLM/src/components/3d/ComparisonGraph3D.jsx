import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function Bar3D({ position, height, color, label, value }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        height,
        0.1
      );
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.8, height, 0.8]} position={[0, height / 2, 0]}>
        <meshStandardMaterial 
          color={color} 
          transparent
          opacity={0.85}
          metalness={0.1}
          roughness={0.5}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </Box>
      <Text
        position={[0, height + 0.3, 0]}
        fontSize={0.2}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {value}%
      </Text>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color="#475569"
        anchorX="center"
        anchorY="middle"
        fontWeight="500"
      >
        {label}
      </Text>
    </group>
  );
}

function Scene({ data }) {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
    }
  });

  const colors = ['#0ea5e9', '#6366f1', '#8b5cf6', '#10b981'];
  
  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#0ea5e9" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#8b5cf6" />
      
      {data.map((item, index) => (
        <Bar3D
          key={index}
          position={[index * 1.5 - (data.length - 1) * 0.75, 0, 0]}
          height={item.value / 50}
          color={colors[index % colors.length]}
          label={item.label}
          value={item.value}
        />
      ))}
      
      <gridHelper args={[10, 20, '#cbd5e1', '#e2e8f0']} position={[0, -0.01, 0]} />
    </group>
  );
}

export default function ComparisonGraph3D({ data }) {
  return (
    <div className="graph-container">
      <div className="graph-title">
        <span>📊 3D Hallucination Comparison</span>
      </div>
      <div style={{ height: '400px' }}>
        <Canvas camera={{ position: [4, 3, 6], fov: 50 }}>
          <Scene data={data} />
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>
    </div>
  );
}