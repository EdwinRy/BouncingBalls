import { expect, test, describe } from 'vitest';
import { Vector3 } from 'three';
import { DynamicBall } from './physics';

describe('DynamicBall physics', () => {
    test('should collide with the bounds of the canvas', () => {
        const ball = new DynamicBall(
            new Vector3(100, 0, 0),
            new Vector3(1, 1, 0),
            new Vector3(0, 0, 0),
            10,
            0.1,
            0.1,
            0.1
        );
        ball.collideBounds(-100, 100, 100, -100);
        expect(ball.position.x).toBe(90);
        expect(ball.position.y).toBe(0);
        expect(ball.velocity.x).toBe(-0.9);
        expect(ball.velocity.y).toBe(0.9);
    });

    test('should apply drag to the velocity', () => {
        const ball = new DynamicBall(
            new Vector3(0, 0, 0),
            new Vector3(1, 1, 0),
            new Vector3(0, 0, 0),
            10,
            0.1,
            0.1,
            0.1
        );
        ball.applyDrag();
        expect(ball.velocity.x).toBe(0.9);
        expect(ball.velocity.y).toBe(0.9);
    });

    test('should update the position and velocity', () => {
        const ball = new DynamicBall(
            new Vector3(0, 0, 0),
            new Vector3(1, 1, 0),
            new Vector3(0.1, 0.1, 0),
            10,
            0.1,
            0.1,
            0.1
        );
        ball.update(1);
        expect(ball.position.x).toBe(1.1);
        expect(ball.position.y).toBe(1.1);
        expect(ball.velocity.x).toBe(1.1);
        expect(ball.velocity.y).toBe(1.1);
    });
});
