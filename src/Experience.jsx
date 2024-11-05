import { Text, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

const imageUrls = [
    '/images/catacombes.webp',
    '/images/devxr_3D.webp',
    '/images/paul_marechal.webp', 
    '/images/aerobay_search.webp',
    '/images/back_devxr.webp',
    '/images/game_devxr.webp',
    '/images/paulmarechal.webp',
    '/images/aerobay_search.webp',
    '/images/vr_devxr.webp',
    '/images/menu_devxr.webp',
    '/images/cd_paulmarechal_second.webp',
    '/images/cards_catacombes.webp',
    '/images/display_rooms_catacombes.webp',
    '/images/aerobay.webp',
    '/images/cv_paulmarechal.webp',
    '/images/menu_intranet.webp',
    '/images/room_catacombes.webp',
];

const videoUrls = [
    'https://devxr.fr/assets/video/visite_guerinet_realite_virtuelle.mp4', 
    'https://devxr.fr/assets/video/Vinyls_AR_second.mp4', 
]

// Display elemement of menu 
function displayElementMenu(headerClick, displayDivElem) {
    const header_item = document.querySelector(headerClick);
    const div_item = document.querySelector(displayDivElem);
    const main_body = document.querySelector('.main_body');
    const canvas = document.querySelector('#root');

    const mainBodyChildrenAll = Array.from(main_body.children);

    header_item.addEventListener('click', () => {
        mainBodyChildrenAll.forEach(mainBodyChildren => {
            mainBodyChildren.style.opacity = '0'
            mainBodyChildren.style.display = 'none'
        })
        canvas.style.opacity = '0';

        div_item.style.display = 'flex';
        setTimeout(() => {
            div_item.style.opacity = '1';
        }, 100);

        setTimeout(() => {
            canvas.style.display = 'none';
        }, 550);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    displayElementMenu('.about_item', '.about_body')
    displayElementMenu('.work_item', '.project_body')
    displayElementMenu('.services_item', '.services_body')
    displayElementMenu('.news_item', '.news_body')
    displayElementMenu('.contact_item', '.contact_body')

})

// Click on work 
function clickOnWorkItem() {
    const item_all = document.querySelectorAll('.page_card');

    item_all.forEach(item => {
        item.addEventListener('click', () => {
            item_all.forEach(elem => elem.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

clickOnWorkItem();


// Accordeon menu 
document.querySelectorAll('.accordion-title').forEach(item => {
    item.addEventListener('click', () => {
        const parent = item.parentNode;
        const isActive = parent.classList.contains('active');
        
        document.querySelectorAll('.accordion-item').forEach(child => {
            child.classList.remove('active');
        });
        
        if (!isActive) {
            parent.classList.add('active');
        }
    });
});

// Image facing
function ImageFacingPlane({ url, position, planePosition }) {
    const imageRef = useRef();

    useFrame(() => {

        if (imageRef.current) {
            imageRef.current.lookAt(new THREE.Vector3(planePosition[0], imageRef.current.position.y, planePosition[2]));
        }
    });

    return (
        <mesh position={position} ref={imageRef}>
            <planeGeometry args={[1.7, 1]} />
            <meshBasicMaterial map={new THREE.TextureLoader().load(url)} />
        </mesh>
    );
}

// Video facing
function VideoFacingPlane({ url, position, planePosition }) {
    const videoRef = useRef();
    const [videoAspect, setVideoAspect] = useState(1);

    // Crée un élément vidéo et calcule le ratio d’aspect
    const videoElement = useMemo(() => {
        const video = document.createElement("video");
        video.src = url;
        video.crossOrigin = "anonymous";
        video.loop = true;
        video.muted = true;
        
        // Ajuste le rapport d’aspect une fois que les métadonnées de la vidéo sont chargées
        video.addEventListener("loadedmetadata", () => {
            const aspect = video.videoWidth / video.videoHeight;
            setVideoAspect(aspect);
        });

        video.play();
        return video;
    }, [url]);

    const videoTexture = useMemo(() => new THREE.VideoTexture(videoElement), [videoElement]);

    useFrame(() => {
        if (videoRef.current) {
            videoRef.current.lookAt(new THREE.Vector3(planePosition[0], videoRef.current.position.y, planePosition[2]));
        }
    });

    return (
        <mesh position={position} ref={videoRef}>
            <planeGeometry args={[1.7 * videoAspect, 1.7]} />
            <meshBasicMaterial map={videoTexture} />
        </mesh>
    );
}



function RotatingMediaAroundCircle({ images, videos, planePosition }) {
    const groupRef = useRef();
    const { camera } = useThree();

    const mediaItems = [...images, ...videos]; 

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

        return mediaItems.map(() => {
            const x = getRandomPosition(-width / 2 + 1, width / 2 - 1);
            const y = getRandomPosition(minHeight, maxHeight);
            const z = getRandomPosition(-3, 3);
            return [x, y, z];
        });
    }, [mediaItems.length, camera]);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <group ref={groupRef}>
            {mediaItems.map((url, index) => {
                const angle = (index / mediaItems.length) * Math.PI * 2;
                const x = Math.cos(angle) * 3;
                const z = Math.sin(angle) * 3;
                const y = positions[index][1];

                const isVideo = url.endsWith(".mp4");

                return isVideo ? (
                    <VideoFacingPlane
                        key={index}
                        url={url}
                        position={[x, y, z]}
                        planePosition={planePosition}
                    />
                ) : (
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
            <RotatingMediaAroundCircle images={imageUrls} videos={videoUrls} planePosition={planePosition} />
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