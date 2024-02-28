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
    const colours = useRef<THREE.Color[]>([]);
    const instancesRef = useRef<THREE.InstancedMesh>(null);

    const [pointerInit, setPointerInit] = useState(false);
    // When a user clicks on the canvas, a new ball is created with randomised attributes
    useEffect(() => {
        if (!pointerInit) {
            setPointerInit(true);
            return;
        }
        const { x, y } = screenToWorldCoords(pointer.x, pointer.y);

        const position = new THREE.Vector3(x, y, -0.001 * simulation.current.length - 1);
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            0
        );
        const acceleration = new THREE.Vector3(0, -0.5, 0);
        const radius = ballRadiusPx;
        const friction = 0.3;
        const drag = 0;
        const dampening = 0.05;

        simulation.current.push(
            new DynamicBall(position, velocity, acceleration, radius, friction, drag, dampening)
        );
        colours.current.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
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
        if (!colours.current) return;

        dt = Math.min(delta, 0.05) * timeDeltaFactor;

        for (let i = 0; i < simulation.current.length; i++) {
            const instance = simulation.current[i];
            const colour = colours.current[i];

            instance.position.z = -(simulation.current.length - i) - 1;
            instance.update(dt);
            instance.applyDrag();
            instance.collideBounds(-halfWidth, halfWidth, halfHeight, -halfHeight);

            tempCircle.position.set(instance.position.x, instance.position.y, instance.position.z);
            tempCircle.updateMatrix();
            instancesRef.current.setMatrixAt(i, tempCircle.matrix);
            instancesRef.current.setColorAt(i, colour);
        }

        instancesRef.current.instanceMatrix.needsUpdate = true;
    });

    const circleGeometry = new THREE.CircleGeometry(ballRadiusPx, ballResolution);
    const material = new THREE.MeshBasicMaterial({
        color: 'white',
        depthTest: true,
    });

    return <instancedMesh ref={instancesRef} args={[circleGeometry, material, maxCount]} />;
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
            <Canvas orthographic camera={{ position: [0, 0, 0] }} onClick={onClick}>
                <Balls maxCount={100000} ballRadiusPx={20} ballResolution={64} />
                <Box args={[3, 3, 3]} position={[0, 0, 0]} />
                <Stats />
            </Canvas>
        </div>
    );
};
