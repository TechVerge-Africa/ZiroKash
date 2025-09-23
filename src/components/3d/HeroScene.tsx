import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { FloatingCard } from './FloatingCard';
import { FloatingPhone } from './FloatingPhone';
import { ParticleField } from './ParticleField';
import { Suspense } from 'react';

export function HeroScene() {
  const isMobile = window.innerWidth < 768;
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPR on mobile for performance
        performance={{ min: 0.8 }} // Maintain 60fps on mobile
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} />
          {!isMobile && <Environment preset="city" />}
          
          {/* Optimized lighting for mobile */}
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={0.8}
            castShadow={false} // Disable shadows on mobile for performance
          />
          
          {/* Particle background */}
          <ParticleField />
          
          {/* Floating elements - fewer on mobile */}
          <FloatingPhone position={[-1.5, 0.5, 0]} color="#1e40af" />
          <FloatingCard position={[1.5, -0.5, -1]} color="#0ea5e9" />
          {!isMobile && (
            <>
              <FloatingCard position={[0, 1.5, -2]} color="#8b5cf6" scale={0.8} />
              <FloatingCard position={[-1.5, -1, 1]} color="#06b6d4" scale={0.6} />
            </>
          )}
          
          {/* Auto rotation */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            autoRotate
            autoRotateSpeed={isMobile ? 0.3 : 0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}