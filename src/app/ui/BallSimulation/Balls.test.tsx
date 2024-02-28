import { expect, test, describe } from 'vitest';
import ReactThreeTestRenderer from '@react-three/test-renderer';
import { Balls } from './Balls';

test('instanced mash is rendered correctly', async () => {
    const renderer = await ReactThreeTestRenderer.create(
        <Balls maxCount={100} ballRadiusPx={10} ballResolution={10} />
    );
    const meshChildren = renderer.scene.allChildren;
    expect(meshChildren.length).toBe(1);
    expect(meshChildren[0]._fiber.type).toBe('Mesh');
});
