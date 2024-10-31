import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react';
import * as THREE from 'three';

const imageUrls = [
    '/images/catacombes.webp',
    '/images/devxr_3D.webp',
    '/images/paul_marechal.webp'
];

function RotatingImages({ images, cameraPosition }) {
    const groupRef = useRef();
    const radius = 3; 

    useFrame(({ clock }) => {
        groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
    });

    return (
        <group ref={groupRef}>
            {images.map((url, index) => {
                const angle = (index / images.length) * Math.PI * 1.5;
                const x = radius * Math.cos(angle);
                const z = radius * Math.sin(angle);

                const imageRef = useRef();

                useFrame(() => {
                    if (imageRef.current) {
                        imageRef.current.lookAt(new THREE.Vector3(...cameraPosition));
                    }
                });

                return (
                    <mesh position={[x, 0, z]} ref={imageRef} key={index}>
                        <planeGeometry args={[1.5, 1]} />
                        <meshBasicMaterial map={new THREE.TextureLoader().load(url)} />
                    </mesh>
                );
            })}
        </group>
    );
}

export default function Experience() {
    const { camera } = useThree();

    return (
        <>
            <RotatingImages images={imageUrls} cameraPosition={camera.position.toArray()} />

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
