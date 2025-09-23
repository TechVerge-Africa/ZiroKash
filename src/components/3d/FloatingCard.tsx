import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface FloatingCardProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
  scale?: number;
}

export function FloatingCard({ position, rotation = [0, 0, 0], color = "#1e40af", scale = 1 }: FloatingCardProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} scale={scale}>
      <boxGeometry args={[1.6, 1, 0.1]} />
      <meshStandardMaterial
        color={color}
        metalness={0.1}
        roughness={0.2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}