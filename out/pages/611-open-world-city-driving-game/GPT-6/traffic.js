export function makeTraffic(world)
{
    const cars = Array.from({ length: 8 }, (_, index) =>
    {
        const colors = [0xc4755a, 0xd9c38b, 0x8da5a2, 0xc8afa0, 0x617f72, 0xd4b777, 0x9d8da4, 0x9fac83];
        const mesh = world.makeCar(colors[index]);
        return { mesh, phase: index * 46 + 18, x: 0, z: 0, yaw: 0, speed: 5.5 + index % 3 * .55 };
    });
    function position(car)
    {
        const side = 96;
        const p = ((car.phase % (side * 4)) + side * 4) % (side * 4);
        if (p < side) Object.assign(car, { x: -51 + p, z: -51, yaw: Math.PI / 2 });
        else if (p < side * 2) Object.assign(car, { x: 45, z: -51 + p - side, yaw: 0 });
        else if (p < side * 3) Object.assign(car, { x: 45 - (p - side * 2), z: 45, yaw: -Math.PI / 2 });
        else Object.assign(car, { x: -51, z: 45 - (p - side * 3), yaw: Math.PI });
        car.mesh.position.set(car.x, .15, car.z);
        car.mesh.rotation.y = car.yaw;
    }
    cars.forEach(position);
    function update(dt, player)
    {
        for (const car of cars)
        {
            const dx = player.x - car.x;
            const dz = player.z - car.z;
            const ahead = dx * Math.sin(car.yaw) + dz * Math.cos(car.yaw);
            const lateral = Math.abs(dx * Math.cos(car.yaw) - dz * Math.sin(car.yaw));
            const following = cars.some((neighbor) => neighbor !== car && ((neighbor.phase - car.phase) % 384 + 384) % 384 < 8);
            const yielding = ahead > 0 && ahead < 12 && lateral < 3.8;
            if (!following && !yielding) car.phase += car.speed * dt;
            position(car);
        }
    }
    function reset()
    {
        cars.forEach((car, index) =>
        {
            car.phase = index * 46 + 18;
            position(car);
        });
    }
    return { cars, update, reset };
}
