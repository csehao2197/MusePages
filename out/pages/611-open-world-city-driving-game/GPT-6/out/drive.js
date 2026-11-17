export function createDriver(world, notify)
{
    const input = { forward: false, brake: false, left: false, right: false, handbrake: false };
    const state = { x: -9, z: -88, yaw: 0, speed: 0, car: null, collisions: 0, distance: 0 };
    let bumpCooldown = 0;

    function nearestCar()
    {
        return world.poolCars.find((car) => Math.hypot(car.x - state.x, car.z - state.z) < 8);
    }

    function solid(x, z, radius, ignore = null, traffic = [])
    {
        if (Math.abs(x) > 105 || Math.abs(z) > 105) return true;
        for (const obstacle of world.obstacles)
        {
            if (Math.abs(x - obstacle.x) < obstacle.w / 2 + radius && Math.abs(z - obstacle.z) < obstacle.d / 2 + radius) return true;
        }
        for (const car of [...world.poolCars, ...traffic])
        {
            if (car === ignore) continue;
            if (Math.hypot(x - car.x, z - car.z) < radius + 2.3) return true;
        }
        return false;
    }

    function toggleCar()
    {
        if (state.car)
        {
            const car = state.car;
            const offsets = [Math.PI / 2, -Math.PI / 2, Math.PI, 0];
            const spot = offsets.map((angle) => ({ x: car.x + Math.sin(car.yaw + angle) * 4.5, z: car.z + Math.cos(car.yaw + angle) * 4.5 })).find((p) => !solid(p.x, p.z, .65, car));
            if (!spot) return false;
            state.x = spot.x;
            state.z = spot.z;
            state.speed = 0;
            car.speed = 0;
            state.car = null;
            world.player.visible = true;
            notify("leftCar");
            return true;
        }
        const car = nearestCar();
        if (!car)
        {
            notify("noCar");
            return false;
        }
        state.car = car;
        state.x = car.x;
        state.z = car.z;
        state.yaw = car.yaw;
        state.speed = 0;
        world.player.visible = false;
        notify("borrowed");
        return true;
    }

    function clearInput()
    {
        for (const key of Object.keys(input)) input[key] = false;
    }

    function reset()
    {
        Object.assign(state, { x: -9, z: -88, yaw: 0, speed: 0, car: null, collisions: 0, distance: 0 });
        for (const car of world.poolCars)
        {
            Object.assign(car, car.start, { speed: 0 });
            car.mesh.position.set(car.x, .15, car.z);
            car.mesh.rotation.y = car.yaw;
        }
        world.player.visible = true;
        clearInput();
    }

    function update(dt, traffic)
    {
        bumpCooldown = Math.max(0, bumpCooldown - dt);
        const steer = (input.right ? 1 : 0) - (input.left ? 1 : 0);
        const throttle = (input.forward ? 1 : 0) - (input.brake ? 1 : 0);
        if (state.car)
        {
            const resistance = input.handbrake ? 24 : (throttle === 0 ? 4.2 : .8);
            const acceleration = throttle * (state.speed * throttle < 0 ? 25 : 12);
            state.speed += acceleration * dt;
            state.speed = Math.sign(state.speed) * Math.max(0, Math.abs(state.speed) - resistance * dt);
            state.speed = Math.max(-8, Math.min(24, state.speed));
            const grip = input.handbrake ? .78 : .49;
            state.yaw += state.speed / 3.4 * Math.tan(steer * grip) * dt;
        }
        else
        {
            state.yaw += steer * 2.7 * dt;
            state.speed += (throttle * 8 - state.speed) * Math.min(1, dt * 13);
        }
        const steps = Math.max(1, Math.ceil(Math.abs(state.speed) * dt / .6));
        for (let step = 0; step < steps; step++)
        {
            const dx = Math.sin(state.yaw) * state.speed * dt / steps;
            const dz = Math.cos(state.yaw) * state.speed * dt / steps;
            const nx = state.x + dx;
            const nz = state.z + dz;
            if (!solid(nx, nz, state.car ? 1.5 : .65, state.car, traffic))
            {
                state.x = nx;
                state.z = nz;
                state.distance += Math.hypot(dx, dz);
            }
            else
            {
                if (bumpCooldown === 0)
                {
                    state.collisions++;
                    bumpCooldown = 1.2;
                    notify("collision");
                }
                state.speed *= -.18;
                break;
            }
        }
        if (state.car)
        {
            Object.assign(state.car, { x: state.x, z: state.z, yaw: state.yaw, speed: state.speed });
            state.car.mesh.position.set(state.x, .15, state.z);
            state.car.mesh.rotation.y = state.yaw;
        }
        else
        {
            world.player.position.set(state.x, .65, state.z);
            world.player.rotation.y = state.yaw;
            const walk = Math.sin(state.distance * 2) * Math.min(.5, Math.abs(state.speed) * .1);
            world.leftLeg.rotation.x = walk;
            world.rightLeg.rotation.x = -walk;
        }
    }
    return { state, input, nearestCar, toggleCar, clearInput, reset, update, solid };
}
