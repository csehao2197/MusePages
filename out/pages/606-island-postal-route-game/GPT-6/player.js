import { walkable, heightAt, routeTo, distance } from "./terrain.js";
import { content } from "./content.js";

export function createPlayer(mesh)
{
    const position = { ...content.post };
    let path = [];
    let moving = false;
    function reset()
    {
        Object.assign(position, content.post);
        path = [];
        mesh.position.set(position.x, heightAt(position.x, position.z), position.z);
    }
    function follow(id)
    {
        path = routeTo(id, position);
    }
    function update(dt, input, open, elapsed)
    {
        let { x, z } = input;
        if (x || z) path = [];
        if (!x && !z && path.length)
        {
            const next = path[0];
            if (distance(position, next) < .25) path.shift();
            if (path.length)
            {
                x = path[0].x - position.x;
                z = path[0].z - position.z;
            }
        }
        const length = Math.hypot(x, z);
        moving = length > 0;
        if (moving)
        {
            x = x / length * 6 * dt;
            z = z / length * 6 * dt;
            if (walkable(position.x + x, position.z, open)) position.x += x;
            if (walkable(position.x, position.z + z, open)) position.z += z;
            mesh.rotation.y = Math.atan2(x, z);
        }
        mesh.position.set(position.x, heightAt(position.x, position.z) + (moving ? Math.abs(Math.sin(elapsed * 12)) * .09 : 0), position.z);
        mesh.children.filter(c => c.userData.leg).forEach((leg, i) => leg.rotation.x = moving ? Math.sin(elapsed * 12 + i * Math.PI) * .5 : 0);
    }
    reset();
    return { position, reset, follow, update, get following() { return path.length > 0; } };
}
