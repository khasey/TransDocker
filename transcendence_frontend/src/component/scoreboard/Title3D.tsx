import { Canvas, useFrame } from "@react-three/fiber";
import { GradientTexture, GradientType, MeshWobbleMaterial, Text, Text3D } from '@react-three/drei';
import { useRef, useState } from "react";
import * as THREE from 'three';
import { FontLoader } from 'three-stdlib';
import { useEffect } from 'react';
import RobotoBoldTypeface from '/public/Roboto_Bold.typeface.json';
import styles from './Title3D.module.css'


const TitleScore = () => {
  const lightRef = useRef<THREE.PointLight>(null!);

  const setLightPosition = (position: THREE.Vector3) => {
    lightRef.current.position.set(position.x, position.y, position.z + 10);
  };
  useEffect(() => {
    console.log(RobotoBoldTypeface);
  }, []);

  return (
    <div className={styles.container}>
    <Canvas>
      <ambientLight intensity={0.1} />
      <pointLight ref={lightRef} position={[0, 0, 100]} />
        <>
          <Text3D position={[-10, -1, 0]} font={RobotoBoldTypeface}
          curveSegments={100}
          bevelEnabled
          bevelSize={0.04}
          bevelThickness={0.1}
          height={1}
          lineHeight={10}
          letterSpacing={0.03}
          size={2}>
            SCOREBOARD
            <MeshWobbleMaterial factor={0} speed={0} color={"#0088ff"}>
              <GradientTexture stops={[0, 0.1, 0.9]} colors={['#e63946', '#f1faee', '#a8dadc']} size={10} />
            </MeshWobbleMaterial>
            </Text3D>
        </>
    </Canvas>
    </div>
  );
};

export default TitleScore;
