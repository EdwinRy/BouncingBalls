"use client";
import { useEffect, useState } from 'react';
import { BallPit } from './ui/BallSimulation/BallPit';
import WebGL from "three/examples/jsm/capabilities/WebGL.js"

export default function Home() {
    const useBrowserWindow = true;
    const padding = useBrowserWindow ? '' : 'md:p-20 p-3';

    const [hasWebGL, setHasWebGL] = useState(false);

    useEffect(() => {
        setHasWebGL(WebGL.isWebGLAvailable());
    }, []);

    return (
        <div className={`w-full h-full relative flex items-center justify-center ${padding}`}>
            {hasWebGL && <BallPit />}
            {!hasWebGL &&
                <div className='text-3xl'>
                    <div>Loading WebGL...</div>
                    <div>If this message persists, your browser may not support WebGL.</div>
                </div>
            }
        </div>
    );
}
