import { Text, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const imageUrls = [
    '/images/catacombes.webp',
    '/images/devxr_3D.webp',
    '/images/paul_marechal.webp'
];

function ImageFacingPlane({ url, position, planePosition }) {
    const imageRef = useRef();

    useFrame(() => {
        if (imageRef.current) {
            imageRef.current.lookAt(new THREE.Vector3(planePosition[0], imageRef.current.position.y, planePosition[2]));
        }
    });

    return (
        <mesh position={position} ref={imageRef}>
            <planeGeometry args={[1.5, 1]} />
            <meshBasicMaterial map={new THREE.TextureLoader().load(url)} />
        </mesh>
    );
}

function RotatingImagesAroundCircle({ images, planePosition }) {
    const groupRef = useRef();
    const { camera } = useThree();

    function getRandomPosition(min, max) {
        return Math.random() * (max - min) + min;
    }

    const positions = useMemo(() => {
        const aspect = window.innerWidth / window.innerHeight; 
        const vFov = (camera.fov * Math.PI) / 180; 
        const height = 2 * Math.tan(vFov / 2) * Math.abs(camera.position.z); 
        const width = height * aspect; 

        const maxHeight = height / 2 - 0.5; 
        const minHeight = -maxHeight; 

        return images.map(() => {
            const x = getRandomPosition(-width / 2 + 1, width / 2 - 1); 
            const y = getRandomPosition(minHeight, maxHeight); 
            const z = getRandomPosition(-3, 3);
            return [x, y, z];
        });
    }, [images.length, camera]);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.2; 
        }
    });

    return (
        <group ref={groupRef}>
            {images.map((url, index) => {
                const angle = (index / images.length) * Math.PI * 2; 

                const x = Math.cos(angle) * 3; 
                const z = Math.sin(angle) * 3; 
                const y = positions[index][1]; 

                return (
                    <ImageFacingPlane
                        key={index}
                        url={url}
                        position={[x, y, z]} 
                        planePosition={planePosition} 
                    />
                );
            })}
        </group>
    );
}

export default function Experience() {
    const { camera } = useThree();
    const planePosition = [0, 0, 7]; 

    return (
        <>
            <RotatingImagesAroundCircle images={imageUrls} planePosition={planePosition} />
            <Plane position={planePosition} args={[2.5, 2]} />
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
