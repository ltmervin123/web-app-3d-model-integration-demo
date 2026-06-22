/* eslint-disable react-hooks/purity */
"use client";

import { Suspense, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  useAnimations,
  Html,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import ModelErrorBoundary from "./ModelErrorBoundary";
import { useSuppressThreeWarnings } from "@/hooks/useSuppressThreeWarnings";

function ButterflyModel() {
  const { scene, animations } = useGLTF("/models/butterfly.glb");
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    // Play all animations named "metarig|2" (the butterfly wing flap animation)
    Object.values(actions).forEach((action) => {
      if (action && "metarig|2" === action.getClip().name) {
        action.play();
      }
    });

    // Enable shadows on the model
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [actions, scene]);

  return (
    <primitive
      object={scene}
      scale={2.5}
      position={[0, 0, 0]}
      frustumCulled={false}
    />
  );
}

function GroundPlane() {
  const canvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Create a checkered pattern with grey tones
      const tileSize = 32;
      for (let y = 0; y < canvas.height; y += tileSize) {
        for (let x = 0; x < canvas.width; x += tileSize) {
          const isEven = (x / tileSize + y / tileSize) % 2 === 0;
          ctx.fillStyle = isEven ? "#d0d0d0" : "#a8a8a8";
          ctx.fillRect(x, y, tileSize, tileSize);
          // Add some subtle noise for texture
          ctx.fillStyle = "rgba(200,200,200,0.05)";
          for (let i = 0; i < 20; i++) {
            ctx.fillRect(
              x + Math.random() * tileSize,
              y + Math.random() * tileSize,
              Math.random() * 4,
              Math.random() * 4,
            );
          }
        }
      }
    }
    return canvas;
  }, []);

  const texture = useMemo(() => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    tex.repeat.set(4, 4);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [canvas]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[5000, 5000]} />
      <meshStandardMaterial
        map={texture}
        roughness={0.9}
        metalness={0}
        displacementScale={0.1}
      />
    </mesh>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <p className="text-sm text-gray-400 animate-pulse">Loading model…</p>
    </Html>
  );
}

export default function ButterflyViewer() {
  useSuppressThreeWarnings();

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [1000, 500, 500], fov: 50, near: 0.1, far: 10000 }}
        style={{ width: "100%", height: "100%" }}
        shadows
      >
        <color attach="background" args={["#c0c0c0"]} />
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[100, 100, 100]}
          intensity={2}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={1000}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <directionalLight position={[-500, 300, -500]} intensity={0.6} />
        <GroundPlane />
        <ModelErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <ButterflyModel />
          </Suspense>
        </ModelErrorBoundary>
        <OrbitControls
          enableZoom
          target={[0, 0.3, 0]}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
        />
      </Canvas>
    </div>
  );
}
