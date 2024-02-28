import { Vector3 } from 'three';

export class DynamicBall {
    position: Vector3;
    velocity: Vector3;
    acceleration: Vector3;
    radius: number;
    friction: number;
    drag: number;
    dampening: number;

    constructor(
        initialPosition: Vector3,
        initialVelocity: Vector3,
        acceleration: Vector3,
        radius: number,
        friction: number,
        drag: number,
        dampening: number
    ) {
        this.position = initialPosition;
        this.velocity = initialVelocity;
        this.acceleration = acceleration;
        this.radius = radius;
        this.friction = 1 - friction;
        this.drag = 1 - drag;
        this.dampening = 1 - dampening;
    }

    collideBounds(left: number, right: number, top: number, bottom: number) {
        if (this.position.x < left + this.radius) {
            this.position.x = left + this.radius;
            this.velocity.x *= -1 * this.dampening;
            this.velocity.y *= this.friction;
        } else if (this.position.x > right - this.radius) {
            this.position.x = right - this.radius;
            this.velocity.x *= -1 * this.dampening;
            this.velocity.y *= this.friction;
        } else if (this.position.y < bottom + this.radius) {
            this.position.y = bottom + this.radius;
            this.velocity.y *= -1 * this.dampening;
            this.velocity.x *= this.friction;
        } else if (this.position.y > top - this.radius) {
            this.position.y = top - this.radius;
            this.velocity.y *= -1 * this.dampening;
            this.velocity.x *= this.friction;
        }
    }

    applyDrag() {
        this.velocity.x *= this.drag;
        this.velocity.y *= this.drag;
    }

    update(deltaTime: number) {
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.velocity.z += this.acceleration.z * deltaTime;

        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
    }
}
