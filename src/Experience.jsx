import { Text, Plane } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const imageUrls = [
    'https://devxr.fr/site_classique/images/catacombes.webp',
    'https://devxr.fr/site_classique/images/devxr_3D.webp',
    'https://devxr.fr/site_classique/images/paul_marechal.webp', 
    'https://devxr.fr/site_classique/images/back_devxr.webp',
    'https://devxr.fr/site_classique/images/game_devxr.webp',
    'https://devxr.fr/site_classique/images/paulmarechal.webp',
    'https://devxr.fr/site_classique/images/aerobay_search.webp',
    'https://devxr.fr/site_classique/images/vr_devxr.webp',
    'https://devxr.fr/site_classique/images/menu_devxr.webp',
    'https://devxr.fr/site_classique/images/cd_paulmarechal_second.webp',
    'https://devxr.fr/site_classique/images/cards_catacombes.webp',
    'https://devxr.fr/site_classique/images/display_rooms_catacombes.webp',
    'https://devxr.fr/site_classique/images/aerobay.webp',
    'https://devxr.fr/site_classique/images/cv_paulmarechal.webp',
    'https://devxr.fr/site_classique/images/menu_intranet.webp',
    'https://devxr.fr/site_classique/images/room_catacombes.webp',
    'https://devxr.fr/site_classique/images/clean_services_home.webp',
    'https://devxr.fr/site_classique/images/aero_helico.png',

];

const videoUrls = [
    'https://devxr.fr/assets/video/visite_guerinet_realite_virtuelle.mp4', 
    'https://devxr.fr/assets/video/Vinyls_AR_second.mp4', 
    'https://devxr.fr/site_classique/video/catas_web.mp4'
]

function displayElementMenu(headerClick, displayDivElem) {
    const header_menu_item = document.querySelectorAll('.header_menu_item');
    const header_item = document.querySelector(headerClick);
    const div_item = document.querySelector(displayDivElem);
    const main_body = document.querySelector('.main_body');
    const canvas = document.querySelector('#root');
    const mainBodyChildrenAll = Array.from(main_body.children);

    header_item.addEventListener('click', () => {
        header_menu_item.forEach(item => {
            item.style.borderBottom = '0px solid #fff';
        });
        
        header_item.style.borderBottom = '1px solid #191919';
        
        mainBodyChildrenAll.forEach(mainBodyChildren => {
            mainBodyChildren.style.opacity = '0';
            mainBodyChildren.style.display = 'none';
        });
        canvas.style.opacity = '0';

        if (displayDivElem === '.about_body') {
            div_item.style.display = 'grid';
        } else {
            div_item.style.display = 'flex';
        }
        
        setTimeout(() => {
            div_item.style.opacity = '1';

            const videos = div_item.querySelectorAll('video');
            videos.forEach(video => {
                video.setAttribute('autoplay', '');
                video.setAttribute('loop', '');
                video.play(); 
            });
        }, 100);

        setTimeout(() => {
            canvas.style.display = 'none';
        }, 550);
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                const videos = div_item.querySelectorAll('video');
                videos.forEach(video => {
                    video.pause();
                    video.removeAttribute('autoplay');
                    video.removeAttribute('loop');
                });
            }
        });
    });

    observer.observe(div_item);
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


document.addEventListener('DOMContentLoaded', () => {
    const scan_qr_ra = document.getElementById('scan_qr_ra');
    const scan_vinyl_ra = document.getElementById('scan_vinyl_ra');
    const web_page_ra = document.getElementById('web_page_ra');
    const video_phone_ra = document.getElementById('video_phone_ra');
    
    const fdc_qr_v2_1 = document.getElementById('fdc_qr_v2_1');
    const guerinet_qr_v2_1 = document.getElementById('guerinet_qr_v2_1');

    scan_qr_ra.addEventListener('click', () => {
        video_phone_ra.setAttribute('src', '../video/qr_catas.mp4');
    
        fdc_qr_v2_1.setAttribute('src', 'https://devxr.fr/assets/images/catacombes/qr_code_fdc.webp');
        guerinet_qr_v2_1.setAttribute('src', 'https://devxr.fr/assets/images/catacombes/qr_code_guerinet.webp');

        fdc_qr_v2_1.style.opacity = '1'
        guerinet_qr_v2_1.style.opacity = '1'
    });

    scan_vinyl_ra.addEventListener('click', () => {
        video_phone_ra.setAttribute('src', '../video/vinyls_ra.mp4');

        fdc_qr_v2_1.setAttribute('src', '../images/qrCode.png')
        guerinet_qr_v2_1.style.opacity = '0'
    });

    web_page_ra.addEventListener('click', () => {
        video_phone_ra.setAttribute('src', '../video/web_ra.mp4');

        fdc_qr_v2_1.setAttribute('src', '../images/qrCatacombes_ar.png')
        guerinet_qr_v2_1.style.opacity = '0'
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

        const timeline = document.querySelector('.timeline')
        const window_width = window.innerWidth;

        timeline.style.width = `${window_width}px`

        const maxHeight = height / 2 - 0.5;
        const minHeight = -maxHeight;

        return mediaItems.map(() => {
            const x = getRandomPosition(-width / 2 + -2, width / 2 - 0);
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

function LogoText() {
    return (
        <group position={[0, 0, 0]}>
            <Text
                fontSize={0.8}
                font={'../font/bebas_neue/BebasNeue-Regular.woff'}
                color="black"
                anchorX="center"
                anchorY="middle"
                position={[-0.25, 0, 0]}
            >
                D
            </Text>

            <Text
                fontSize={0.5} 
                font={'../font/bebas_neue/BebasNeue-Regular.woff'}
                color="black"
                anchorX="left"
                anchorY="middle"
                position={[-0.1, -0.08, 0]} 
            >
                ev
            </Text>

            <Text
                fontSize={0.8}
                font={'../font/bebas_neue/BebasNeue-Regular.woff'}
                color="black"
                anchorX="left"
                anchorY="middle"
                position={[0.3, 0, 0]} 
            >
                XR
            </Text>
        </group>
    );
}


export default function Experience() {
    const { camera } = useThree();
    const planePosition = [0, 0, 7];

    const scrollContainer = document.querySelector(".timeline");

    scrollContainer.addEventListener("wheel", (evt) => {
        evt.preventDefault();
        
        const shoot = true;
        
        if (shoot) {
            scrollContainer.scrollLeft += evt.deltaY / 4;  
        } else {
            // Par défaut, défilement normal
            scrollContainer.scrollLeft += evt.deltaY;
        }
    });
    

    return (
        <>
            <RotatingMediaAroundCircle images={imageUrls} videos={videoUrls} planePosition={planePosition} />
            <Plane position={planePosition} args={[2.5, 2]} />
            <LogoText/>

        </>
    );
}