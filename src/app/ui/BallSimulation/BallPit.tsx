'use client';
import { Canvas } from '@react-three/fiber';
import _ from 'lodash';
import { useCanvasPointerStore } from '../../_utils/canvasPointerEvents';
import { Balls } from './Balls';
import { useState } from 'react';

interface BallPitProps {
    maxCount?: number;
    ballRadiusPx?: number;
    ballResolution?: number;
}

export const BallPit = ({
    maxCount = 10000,
    ballRadiusPx = 20,
    ballResolution = 16,
}: BallPitProps) => {
    const setPointer = useCanvasPointerStore((state) => state.setPointer);

    const [hintVisible, setHintVisible] = useState(true);

    const onClick = (event: any) => {
        const rect = event.target.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setPointer(mouseX, mouseY);
    };

    return (
        <div className="border h-full w-full relative" onClick={() => setHintVisible(false)}>
            <Canvas orthographic camera={{ position: [0, 0, 0] }} onClick={onClick}>
                <Balls
                    maxCount={maxCount}
                    ballRadiusPx={ballRadiusPx}
                    ballResolution={ballResolution}
                />
                {/* <Stats /> */}
            </Canvas>
            {hintVisible && (
                <div
                    className="absolute top-0 left-0 w-full h-full flex
                    items-center justify-center pointer-events-none">
                    <div className="text-3xl">Click here to add a ball</div>
                </div>
            )}
        </div>
    );
};
