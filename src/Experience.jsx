import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const imageUrls = [
    '/images/catacombes.webp',
    '/images/devxr_3D.webp',
    '/images/paul_marechal.webp',
];

function RotatingImages({ images }) {
    const groupRef = useRef();
    const radius = 3; 

    useFrame(({ clock }) => {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    });

    return (
        <group ref={groupRef}>
            {images.map((url, index) => {
                const angle = (index / images.length) * Math.PI * 2;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);

                return (
                    <mesh position={[x, 0, z]} key={index}>
                        <planeGeometry args={[1, 1.5]} />
                        <meshBasicMaterial map={new THREE.TextureLoader().load(url)} />
                    </mesh>
                );
            })}
        </group>
    );
}

export default function Experience() {
    return (
        <>
            <RotatingImages images={imageUrls} />

            <Text
                position={[0, 0, 0]}
                fontSize={0.5}
                color="black"
                anchorX="center"
                anchorY="middle"
            >
                DevXR
            </Text>
        </>
    );
}
