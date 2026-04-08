import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function ParticleCloud() {
  const ref = useRef();
  const count = 3000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      const r = 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      pos[i] = r * Math.sin(phi) * Math.cos(theta);
      pos[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i + 2] = r * Math.cos(phi);
      
      const color = new THREE.Color();
      color.setHSL(0.6 + Math.random() * 0.2, 0.5, 0.6);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    return { pos, colors };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = time * 0.03;
      ref.current.rotation.x = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <Points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.pos}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={positions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        vertexColors
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function FloatingOrbs() {
  const orb1 = useRef();
  const orb2 = useRef();
  const orb3 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    if (orb1.current) {
      orb1.current.position.x = Math.sin(time * 0.2) * 6;
      orb1.current.position.y = Math.cos(time * 0.3) * 4;
      orb1.current.position.z = Math.sin(time * 0.15) * 3 - 8;
    }
    
    if (orb2.current) {
      orb2.current.position.x = Math.cos(time * 0.25) * 7;
      orb2.current.position.y = Math.sin(time * 0.2) * 5;
      orb2.current.position.z = Math.cos(time * 0.2) * 4 - 10;
    }
    
    if (orb3.current) {
      orb3.current.position.x = Math.sin(time * 0.18) * 5;
      orb3.current.position.y = Math.cos(time * 0.35) * 6;
      orb3.current.position.z = Math.sin(time * 0.22) * 5 - 12;
    }
  });

  return (
    <>
      <mesh ref={orb1}>
        <Sphere args={[0.8, 64, 64]}>
          <MeshDistortMaterial
            color="#6366f1"
            transparent
            opacity={0.08}
            distort={0.3}
            speed={2}
            wireframe
          />
        </Sphere>
      </mesh>
      
      <mesh ref={orb2}>
        <Sphere args={[0.6, 64, 64]}>
          <MeshDistortMaterial
            color="#06b6d4"
            transparent
            opacity={0.06}
            distort={0.4}
            speed={1.5}
            wireframe
          />
        </Sphere>
      </mesh>
      
      <mesh ref={orb3}>
        <Sphere args={[1.0, 64, 64]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            transparent
            opacity={0.05}
            distort={0.25}
            speed={1.8}
            wireframe
          />
        </Sphere>
      </mesh>
    </>
  );
}

const Background3D = () => {
  return (
    <div className="canvas-container">
      <Canvas camera={{ position: [0, 0, 18], fov: 70 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -5, -10]} intensity={0.8} color="#6366f1" />
        <pointLight position={[5, -10, 5]} intensity={0.5} color="#06b6d4" />
        <ParticleCloud />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
};

export default Background3D;