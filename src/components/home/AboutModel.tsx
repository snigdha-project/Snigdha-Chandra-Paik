"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshDistortMaterial,
  Float,
  Sphere,
  Html,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

const disableTouchStyles = `
  .no-touch {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  @keyframes blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); }
  }
  .animate-blink {
    animation: blink 4s infinite;
  }
`;

function Face({ expression }: { expression: string }) {
  return (
    <Html
      transform
      occlude={false}
      center
      distanceFactor={2.5}
      position={[0, 0, 0]}
      className="select-none pointer-events-none no-touch"
    >
      <div className="flex flex-col items-center justify-center pointer-events-none">
        <div className="flex gap-6 mb-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="w-10 h-10 bg-black rounded-full relative overflow-hidden"
            >
              <div
                className={`w-full h-full bg-black animate-blink origin-center transition-all duration-300 ${
                  expression === "drag" ? "scale-y-[0.3] mt-3" : ""
                }`}
              >
                <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-90" />
              </div>
            </div>
          ))}
        </div>

        <div
          className={`transition-all duration-300 border-black flex items-center justify-center ${
            expression === "drag"
              ? "w-12 h-12 border-[6px] rounded-full"
              : "w-16 h-4 border-b-[8px] rounded-full"
          }`}
        />
      </div>
    </Html>
  );
}

function JellyPet() {
  const containerGroup = useRef<THREE.Group>(null);
  const materialRef = useRef<any>(null);
  const [drag, setDrag] = useState(false);

  // Track mouse coordinates
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!document.getElementById("no-touch-styles")) {
        const style = document.createElement("style");
        style.id = "no-touch-styles";
        style.innerHTML = disableTouchStyles;
        document.head.appendChild(style);
      }

      const onMouseMove = (e: MouseEvent) => {
        // Normalizing coordinates for Three.js tracking
        mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener("mousemove", onMouseMove);
      return () => window.removeEventListener("mousemove", onMouseMove);
    }
  }, []);

  useFrame((state, delta) => {
    if (!containerGroup.current || !materialRef.current) return;

    // Rotation tracking (Eye/Face follows cursor)
    const targetRotY = (mouse.current.x * Math.PI) / 6;
    const targetRotX = (-mouse.current.y * Math.PI) / 6;

    containerGroup.current.rotation.y = THREE.MathUtils.lerp(
      containerGroup.current.rotation.y,
      targetRotY,
      0.1,
    );
    containerGroup.current.rotation.x = THREE.MathUtils.lerp(
      containerGroup.current.rotation.x,
      targetRotX,
      0.1,
    );

    // Distortion physics
    const targetSpeed = drag ? 5 : 1.5;
    const targetDistort = drag ? 0.4 : 0.2;
    materialRef.current.speed = THREE.MathUtils.lerp(
      materialRef.current.speed,
      targetSpeed,
      delta * 5,
    );
    materialRef.current.distort = THREE.MathUtils.lerp(
      materialRef.current.distort,
      targetDistort,
      delta * 5,
    );

    // Scale feedback
    const weave = drag ? Math.sin(state.clock.elapsedTime * 15) * 0.05 : 0;
    const currentScale = drag ? 1.15 + weave : 1;
    containerGroup.current.scale.lerp(
      new THREE.Vector3(currentScale, currentScale, currentScale),
      0.15,
    );
  });

  return (
    <group ref={containerGroup}>
      <Float speed={drag ? 0 : 2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere
          args={[1, 64, 64]}
          onContextMenu={(e: any) => e.nativeEvent.preventDefault()}
          onPointerDown={(e) => {
            (e.target as any).releasePointerCapture(e.pointerId);
            setDrag(true);
          }}
          onPointerUp={() => setDrag(false)}
          onPointerLeave={() => setDrag(false)}
        >
          <MeshDistortMaterial ref={materialRef} color="#A64D32" radius={1} />
          <Face expression={drag ? "drag" : "rest"} />
        </Sphere>
      </Float>
    </group>
  );
}

export default function AboutModel() {
  return (
    <div
      className="relative w-full h-[450px] flex items-center justify-center overflow-visible no-touch select-none z-10"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 35 }}
        className="overflow-visible"
        style={{ pointerEvents: "auto", touchAction: "none" }}
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight
          position={[-10, 10, 10]}
          angle={0.15}
          penumbra={1}
          intensity={1}
        />

        <JellyPet />

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.4}
          scale={8}
          blur={2.5}
          far={4}
        />
      </Canvas>
    </div>
  );
}
