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

// CSS to stop long-press and text selection globally for the model
const disableTouchStyles = `
  .no-touch {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none;   /* Safari */
    -khtml-user-select: none;    /* Konqueror HTML */
    -moz-user-select: none;      /* Firefox */
    -ms-user-select: none;       /* Internet Explorer/Edge */
    user-select: none;           /* Non-prefixed version, currently supported by Chrome and Opera */
    -webkit-tap-highlight-color: transparent;
  }
`;

function Face({ expression }: { expression: string }) {
  return (
    <Html
      transform
      occlude={false}
      center
      distanceFactor={3}
      position={[0, 0, 1.02]}
      /* Apply the no-touch class here */
      className="select-none pointer-events-none no-touch"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex gap-5 mb-1">
          <div className="w-10 h-10 bg-black rounded-full relative overflow-hidden">
            <div
              className={`w-10 h-10 bg-black animate-blink ${expression === "drag" ? "h-3 mt-4" : ""}`}
            >
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-90" />
            </div>
          </div>
          <div className="w-10 h-10 bg-black rounded-full relative overflow-hidden">
            <div
              className={`w-10 h-10 bg-black animate-blink ${expression === "drag" ? "h-3 mt-4" : ""}`}
            >
              <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full opacity-90" />
            </div>
          </div>
        </div>
        <div
          className={`transition-all duration-300 border-black flex items-center justify-center ${
            expression === "drag"
              ? "w-14 h-14 border-[6px] rounded-full"
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
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Inject the CSS to disable long-press
    if (!document.getElementById("no-touch-styles")) {
      const style = document.createElement("style");
      style.id = "no-touch-styles";
      style.innerHTML = disableTouchStyles;
      document.head.appendChild(style);
    }

    const handleGlobalMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (!containerGroup.current || !materialRef.current) return;
    const targetRotY = (mousePos.current.x * Math.PI) / 6;
    const targetRotX = (mousePos.current.y * Math.PI) / 6;
    containerGroup.current.rotation.y +=
      (targetRotY - containerGroup.current.rotation.y) * 0.1;
    containerGroup.current.rotation.x +=
      (targetRotX - containerGroup.current.rotation.x) * 0.1;

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

    const weave = drag ? Math.sin(state.clock.elapsedTime * 15) * 0.05 : 0;
    const currentScale = drag ? 1.15 + weave : 1;
    containerGroup.current.scale.lerp(
      new THREE.Vector3(currentScale, currentScale, currentScale),
      0.15,
    );
  });

  return (
    <group ref={containerGroup}>
      <Float speed={drag ? 0 : 2} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere
          args={[1, 64, 64]}
          /* Prevent context menu on long-press */
          onContextMenu={(e: any) => e.nativeEvent.preventDefault()}
          onPointerDown={(e) => {
            // Fix for mobile: prevents the browser from thinking this is a scroll/save action
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
      className="relative w-full h-[400px] flex items-center justify-center overflow-visible no-touch"
      onContextMenu={(e) => e.preventDefault()} // Final fallback for the container
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 40 }}
        className="overflow-visible"
        style={{ pointerEvents: "auto", touchAction: "none" }} // touchAction: 'none' is key for mobile
      >
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <JellyPet />
        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.4}
          scale={6}
          blur={2.5}
        />
      </Canvas>
    </div>
  );
}
