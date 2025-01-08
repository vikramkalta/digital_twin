/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 Test.gltf 
*/

import React, { useMemo } from "react";
import { useGLTF, Text } from "@react-three/drei";
import * as THREE from "three";

export function Model({ kpi, value }) {
  const minMaxValues = {
    CO2: { min: 350, max: 1200 },
    Humidity: { min: 20, max: 80 },
    Temperature: { min: 0, max: 22 },
    Occupancy: { min: 0, max: 20 },
  };
  const { min, max } = minMaxValues[kpi] || { min: 0, max: 100 };

  const { nodes, materials } = useGLTF("/House.gltf");
  const wallColor = "lightgray";
  const roofColor = "#98958B";
  const defaultColor = "white";

  const ballColor = useMemo(() => {
    const normalize = (value, min, max) =>
      Math.max(0, Math.min(1, (value - min) / (max - min)));
    const t = normalize(value, min, max);
    return new THREE.Color().lerpColors(
      new THREE.Color("green"),
      new THREE.Color("red"),
      t
    );
  }, [value, min, max]);

  // Helper function to get material based on name
  const getMaterialForName = (node) => {
    if (node.parent.userData.name?.toLowerCase?.()?.includes?.("wall")) {
      return new THREE.MeshStandardMaterial({ color: wallColor });
    }
    if (node.parent.userData.name?.toLowerCase?.()?.includes?.("roof")) {
      return new THREE.MeshStandardMaterial({ color: roofColor });
    }
    if (node.name.toLowerCase().includes("roof")) {
      return new THREE.MeshStandardMaterial({ color: roofColor });
    }
    if (node.name.toLowerCase().includes("door")) {
      return new THREE.MeshStandardMaterial({ color: "gray" });
    }
    if (node.name.toLowerCase().includes("ball")) {
      return new THREE.MeshStandardMaterial({ color: ballColor });
    }
    return new THREE.MeshStandardMaterial({ color: defaultColor });
  };

  return (
    <group scale={[25, 25, 25]} position={[-0.3, -0.2, 0]} dispose={null}>
      {/* Iterate over nodes */}
      {Object.keys(nodes).map((nodeName) => {
        const node = nodes[nodeName];

        if (node.isMesh) {
          return (
            <mesh
              key={nodeName}
              geometry={node.geometry}
              material={getMaterialForName(node)}
            >
              {node.name.toLowerCase().includes("ball") && (
                <Text
                  position={[0.0123, 0.027, 0.004]}
                  fontSize={0.002}
                  color="black"
                  anchorX="center"
                  anchorY="middle"
                >
                   {value.toFixed(1)} {kpi}
                </Text>
              )}
            </mesh>
          );
        } else if (node.isGroup) {
          return <primitive key={nodeName} object={node} />;
        }

        return null;
      })}
    </group>
  );
}

useGLTF.preload("/House.gltf");
