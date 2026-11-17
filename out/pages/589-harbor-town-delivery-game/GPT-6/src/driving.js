import { depot, roads } from "./content.js";

export function createDriving(colliders)
{
    const van = { x: depot.x, z: depot.z, heading: 0, speed: 0 };
    const keys = new Set();
    const reset = () => Object.assign(van, { x: depot.x, z: depot.z, heading: 0, speed: 0 });
    function recover()
    {
        van.x = roads.reduce((a, b) => Math.abs(b - van.x) < Math.abs(a - van.x) ? b : a);
        van.z = roads.reduce((a, b) => Math.abs(b - van.z) < Math.abs(a - van.z) ? b : a);
        van.speed = 0;
    }
    function blocked(x, z)
    {
        return Math.abs(x) > 33 || Math.abs(z) > 33 || colliders.some(box => Math.abs(x - box.x) < box.w + 1.1 && Math.abs(z - box.z) < box.d + 1.5);
    }
    function tick(dt)
    {
        const forward = keys.has("ArrowUp") || keys.has("KeyW");
        const back = keys.has("ArrowDown") || keys.has("KeyS");
        const left = keys.has("ArrowLeft") || keys.has("KeyA");
        const right = keys.has("ArrowRight") || keys.has("KeyD");
        const brake = keys.has("Space");
        const target = brake ? 0 : forward ? 20 : back ? -10 : 0;
        const acceleration = brake ? 65 : forward || back ? 25 : 17;
        van.speed += Math.sign(target - van.speed) * Math.min(Math.abs(target - van.speed), acceleration * dt);
        van.heading += ((left ? 1 : 0) - (right ? 1 : 0)) * dt * 2.4 * (van.speed < -0.5 ? -1 : 1);
        const x = van.x - Math.sin(van.heading) * van.speed * dt;
        const z = van.z - Math.cos(van.heading) * van.speed * dt;
        if (!blocked(x, z))
        {
            van.x = x;
            van.z = z;
        }
        else van.speed = 0;
    }
    return { van, keys, tick, reset, recover, blocked };
}
