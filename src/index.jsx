import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { BrowserView, MobileView } from 'react-device-detect';
import { useEffect } from 'react';

function MobileRedirect() {
    useEffect(() => {
        window.location.href = 'https://devxr.fr'; 
    }, []); 
    return null;
}

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <>
        <MobileView>
            <MobileRedirect />
        </MobileView>
        <BrowserView className="window_size">
            <Canvas
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [0, 0, 7],
                }}
            >
                <Experience />
            </Canvas>
        </BrowserView>
    </>
)
