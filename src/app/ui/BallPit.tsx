'use client';
import { Box, Stats } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { use, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCanvasPointerStore } from '../_utils/canvasPointerEvents';
import * as THREE from 'three';
import { DynamicBall } from '../_utils/physics';
import _ from 'lodash';

interface BallsProps {
    maxCount: number;
    ballRadiusPx: number;
    ballResolution: number;
}

const tempCircle = new THREE.Object3D();
const Balls = ({ maxCount, ballRadiusPx, ballResolution }: BallsProps) => {
    const { viewport } = useThree();
    const pointer = useCanvasPointerStore((state) => state.pointer);

    const simulation = useRef<DynamicBall[]>([]);
    const instancesRef = useRef<THREE.InstancedMesh>(null);

    const [pointerInit, setPointerInit] = useState(false);
    useEffect(() => {
        if (!pointerInit) {
            setPointerInit(true);
            return;
        }

        const { x, y } = screenToWorldCoords(pointer.x, pointer.y);
        simulation.current.push(
            new DynamicBall(
                new THREE.Vector3(x, y, -0.001 * simulation.current.length - 1),
                new THREE.Vector3(
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20,
                    0
                ),
                new THREE.Vector3(0, -0.5, 0),
                ballRadiusPx,
                0.3,
                0,
                0.05
            )
        );
    }, [pointer]);

    const screenToWorldCoords = useCallback(
        (x: number, y: number) => {
            return {
                x: (x * viewport.width) / 2,
                y: (y * viewport.height) / 2,
            };
        },
        [viewport]
    );

    const { halfWidth, halfHeight } = useMemo(() => {
        return {
            halfWidth: viewport.width / 2,
            halfHeight: viewport.height / 2,
        };
    }, [viewport]);

    const timeDeltaFactor = useMemo(() => 100, []);

    let dt = 0;
    useFrame((_, delta) => {
        if (!instancesRef.current) return;
        if (!simulation.current) return;

        dt = Math.min(delta, 0.05) * timeDeltaFactor;

        for (let i = 0; i < simulation.current.length; i++) {
            const instance = simulation.current[i];
            instance.update(dt);
            instance.applyDrag();
            instance.collideBounds(
                -halfWidth,
                halfWidth,
                halfHeight,
                -halfHeight
            );

            tempCircle.position.set(
                instance.position.x,
                instance.position.y,
                instance.position.z
            );
            tempCircle.updateMatrix();
            instancesRef.current.setMatrixAt(i, tempCircle.matrix);
        }

        instancesRef.current.instanceMatrix.needsUpdate = true;
    });

    const circleGeometry = new THREE.CircleGeometry(
        ballRadiusPx,
        ballResolution
    );
    const material = new THREE.MeshBasicMaterial({ color: 'red' });

    return (
        <instancedMesh
            ref={instancesRef}
            args={[circleGeometry, material, maxCount]}
        />
    );
};

export const BallPit = () => {
    const setPointer = useCanvasPointerStore((state) => state.setPointer);

    const onClick = (event: any) => {
        const rect = event.target.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        setPointer(mouseX, mouseY);
    };

    return (
        <div className="border h-full w-full">
            <Canvas
                orthographic
                camera={{ position: [0, 0, 0] }}
                onClick={onClick}>
                <Balls
                    count={2}
                    maxCount={100000}
                    ballRadiusPx={20}
                    ballResolution={64}
                />
                <Box args={[3, 3, 3]} position={[0, 0, 0]} />
                <Stats />
            </Canvas>
        </div>
    );
};
