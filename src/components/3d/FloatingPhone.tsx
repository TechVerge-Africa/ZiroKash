import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';

interface FloatingPhoneProps {
  position: [number, number, number];
  color?: string;
}

export function FloatingPhone({ position, color = "#0ea5e9" }: FloatingPhoneProps) {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + 1) * 0.15;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Phone body */}
      <mesh>
        <boxGeometry args={[0.8, 1.6, 0.1]} />
        <meshStandardMaterial
          color={color}
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0.1, 0.051]}>
        <boxGeometry args={[0.7, 1.4, 0.01]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>
      {/* Screen glow */}
      <mesh position={[0, 0.1, 0.052]}>
        <boxGeometry args={[0.68, 1.38, 0.005]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}