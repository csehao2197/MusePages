import * as THREE from "./vendor/three.module.js";
import { T, mulberry32 } from "./tuning.js";

const V = THREE.Vector3;
const FORWARD = new V(0, 0, -1);
const UP = new V(0, 1, 0);
const clamp = THREE.MathUtils.clamp;
const approachAngle = (current, target, step) => current + clamp(Math.atan2(Math.sin(target - current), Math.cos(target - current)), -step, step);

function material(color, basic = false)
{
    return basic ? new THREE.MeshBasicMaterial({ color }) :
        new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: .86, metalness: .02 });
}

function mesh(group, geometry, paint, x = 0, y = 0, z = 0)
{
    const item = new THREE.Mesh(geometry, paint);
    item.position.set(x, y, z);
    group.add(item);
    return item;
}

export function makeFighter()
{
    const outer = new THREE.Group();
    outer.rotation.order = "YXZ";
    const inner = new THREE.Group();
    outer.add(inner);
    outer.userData.inner = inner;
    const hull = material("#D5DCE4");
    const dim = material("#9AA3AE");
    mesh(inner, new THREE.BoxGeometry(.92, .52, 2.5), hull, 0, 0, -.15);
    mesh(inner, new THREE.ConeGeometry(.36, 1.05, 4), hull, 0, 0, -1.85).rotation.x = -Math.PI / 2;
    mesh(inner, new THREE.BoxGeometry(.07, .78, .85), dim, 0, .55, .55);
    mesh(inner, new THREE.BoxGeometry(1.25, .07, .62), dim, -.95, -.02, -.35).rotation.z = .16;
    mesh(inner, new THREE.BoxGeometry(1.25, .07, .62), dim, .95, -.02, -.35).rotation.z = -.16;
    mesh(inner, new THREE.BoxGeometry(.42, .16, .62), material("#E0A24A"), 0, .32, -1.15);
    const glow = material("#E8A23A", true);
    glow.transparent = true;
    glow.opacity = .35;
    for (const x of [-.26, .26])
    {
        mesh(inner, new THREE.CylinderGeometry(.14, .18, .32, 6), material("#2C3138"), x, -.08, 1.22).rotation.x = Math.PI / 2;
        mesh(inner, new THREE.CircleGeometry(.12, 6), glow, x, -.08, 1.40);
    }
    outer.userData.glow = glow;
    return outer;
}

function makeDrone()
{
    const group = new THREE.Group();
    mesh(group, new THREE.OctahedronGeometry(.8), material("#C5CED8"));
    mesh(group, new THREE.TorusGeometry(1.05, .045, 5, 16), material("#7E8794")).rotation.x = Math.PI / 2;
    const sensor = mesh(group, new THREE.SphereGeometry(.1, 6, 4), material("#9AA3AE"), 0, 0, -.85);
    group.userData.sensor = sensor;
    return group;
}

export class Patrol
{
    constructor(scene, camera, tones, reduced)
    {
        this.scene = scene;
        this.camera = camera;
        this.tones = tones;
        this.reduced = reduced;
        this.state = "title";
        this.time = 0;
        this.wave = 1;
        this.score = 0;
        this.shield = T.SHIELD_MAX;
        this.events = [];
        this.metrics = { shots: 0, enemyShots: 0, hits: 0, kills: 0, missiles: 0, boosts: 0, rolls: 0, waves: 0, boundaryReturns: 0 };
        this.ship = makeFighter();
        scene.add(this.ship);
        this.rocks = [];
        this.drones = [];
        this.bolts = [];
        this.particles = [];
        this.boundary = false;
        this.shimmer = mesh(this.ship, new THREE.SphereGeometry(2.2, 12, 8), new THREE.MeshBasicMaterial(
        {
            color: "#D5E6F2", wireframe: true, transparent: true, opacity: .25
        }));
        this.shimmer.visible = false;
        this.speedLines = new THREE.Group();
        this.ship.add(this.speedLines);
        for (let i = 0; i < 8; i++)
        {
            const angle = i / 8 * Math.PI * 2;
            mesh(this.speedLines, new THREE.BoxGeometry(.05, .05, .8), material("#8FCBE3", true), Math.cos(angle) * 1.8, Math.sin(angle), 3 + i * .35);
        }
        const cage = new THREE.Mesh(new THREE.SphereGeometry(T.SPHERE, 8, 6), new THREE.MeshBasicMaterial(
        {
            color: "#8F98A4", wireframe: true, transparent: true, opacity: .14
        }));
        scene.add(cage);
        this.buildField();
        for (let i = 0; i < 9; i++)
        {
            const item = makeDrone();
            item.visible = false;
            scene.add(item);
            this.drones.push({ mesh: item, alive: false, shield: T.DRONE_SHIELD, cooldown: 0 });
        }
        for (let i = 0; i < 40; i++)
        {
            const enemy = i >= T.BOLT_CAP;
            const item = mesh(scene, new THREE.BoxGeometry(enemy ? .1 : .08, enemy ? .1 : .08, enemy ? 1.2 : 1.6), material(enemy ? "#B7C0CA" : "#E7F1F8", true));
            item.visible = false;
            this.bolts.push({ mesh: item, enemy, life: 0, velocity: new V() });
        }
        this.missile = { mesh: new THREE.Group(), life: 0, target: null };
        mesh(this.missile.mesh, new THREE.ConeGeometry(.12, .7, 4), material("#E8A23A", true)).rotation.x = -Math.PI / 2;
        mesh(this.missile.mesh, new THREE.BoxGeometry(.4, .04, .14), material("#E8A23A", true), 0, 0, .17);
        this.missile.mesh.visible = false;
        scene.add(this.missile.mesh);
        this.lockRing = mesh(scene, new THREE.TorusGeometry(1.7, .03, 5, 32), material("#E8A23A", true));
        this.lockRing.visible = false;
        const particleGeometry = new THREE.PlaneGeometry(.26, .26);
        for (let i = 0; i < 120; i++)
        {
            const item = mesh(scene, particleGeometry, material(i % 2 ? "#E8A23A" : "#E7F1F8", true));
            item.visible = false;
            this.particles.push({ mesh: item, life: 0, duration: 1, velocity: new V(), spin: 0 });
        }
        this.title();
    }

    buildField()
    {
        const rocksRandom = mulberry32(0x0D165607);
        const rockMaterials = ["#C3CBD4", "#8E98A4", "#646C78"].map(color => material(color));
        for (let i = 0; i < 46; i++)
        {
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const positions = geometry.attributes.position;
            const radialScales = new Map();
            for (let j = 0; j < positions.count; j++)
            {
                const position = new V().fromBufferAttribute(positions, j);
                const key = position.toArray().map(value => value.toFixed(4)).join(",");
                if (!radialScales.has(key)) radialScales.set(key, .72 + rocksRandom() * .5);
                position.multiplyScalar(radialScales.get(key));
                positions.setXYZ(j, position.x, position.y, position.z);
            }
            geometry.computeVertexNormals();
            const item = new THREE.Mesh(geometry, rockMaterials[i % 3]);
            let tries = 0;
            do
            {
                item.position.set((rocksRandom() - .5) * 280, (rocksRandom() - .5) * 280, (rocksRandom() - .5) * 280);
                tries++;
            }
            while ((item.position.length() < 36 || item.position.length() > 142 ||
                this.rocks.some(rock => rock.mesh.position.distanceTo(item.position) < 16)) && tries < 2000);
            item.scale.setScalar(2.4 + rocksRandom() * 6.2);
            item.rotation.set(rocksRandom() * 6, rocksRandom() * 6, rocksRandom() * 6);
            this.scene.add(item);
            this.rocks.push({ mesh: item, spin: .04 + rocksRandom() * .14 });
        }
        const starsRandom = mulberry32(0x57A12);
        const points = [];
        for (let i = 0; i < 900; i++)
        {
            const z = starsRandom() * 2 - 1;
            const angle = starsRandom() * Math.PI * 2;
            const radius = Math.sqrt(1 - z * z) * 400;
            points.push(radius * Math.cos(angle), z * 400, radius * Math.sin(angle));
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
        this.stars = new THREE.Points(geometry, new THREE.PointsMaterial({ color: "#C5CED8", size: 1.4, sizeAttenuation: true, fog: false }));
        this.scene.add(this.stars);
    }

    resize(mobile)
    {
        this.mobile = mobile;
        this.rocks.forEach((rock, index) => rock.mesh.visible = !mobile || index < 20);
        this.stars.geometry.setDrawRange(0, this.performanceCut ? 300 : mobile ? 400 : 900);
        this.camera.fov = mobile ? this.state === "title" ? 60 : 62 : 52;
        this.camera.updateProjectionMatrix();
        this.updateCamera(1, true);
    }

    title()
    {
        this.state = "title";
        this.ship.position.set(0, 0, 18);
        this.ship.rotation.set(0, .55, 0, "YXZ");
        this.ship.userData.inner.rotation.z = 0;
        this.ship.visible = true;
        this.clear();
        this.shimmer.visible = false;
        this.speedLines.visible = false;
        this.updateCamera(1, true);
    }

    clear()
    {
        for (const drone of this.drones) drone.mesh.visible = drone.alive = false;
        for (const bolt of this.bolts) { bolt.life = 0; bolt.mesh.visible = false; }
        for (const particle of this.particles) { particle.life = 0; particle.mesh.visible = false; }
        this.missile.life = 0;
        this.missile.mesh.visible = false;
        this.lockRing.visible = false;
        this.candidate = null;
        this.lockProgress = 0;
    }

    launch()
    {
        this.clear();
        this.state = "play";
        this.wave = 1;
        this.score = 0;
        this.metrics = { shots: 0, enemyShots: 0, hits: 0, kills: 0, missiles: 0, boosts: 0, rolls: 0, waves: 0, boundaryReturns: 0 };
        this.shield = T.SHIELD_MAX;
        this.ship.position.set(0, 6, 24);
        this.ship.rotation.set(0, 0, 0, "YXZ");
        this.ship.userData.inner.rotation.z = 0;
        this.ship.visible = true;
        this.boostTime = this.boostCD = this.rollTime = this.rollCD = this.fireCD = this.lockCD = this.sinceHit = this.invulnerable = this.breather = this.endWait = this.shake = 0;
        this.boundary = false;
        this.spawnWave();
        this.updateCamera(1, true);
    }

    spawnWave()
    {
        const count = Math.min(3 + (this.wave - 1) * 2, 9);
        this.drones.forEach((drone, index) =>
        {
            drone.alive = index < count;
            drone.mesh.visible = drone.alive;
            drone.shield = T.DRONE_SHIELD;
            drone.cooldown = T.DRONE_FIRE_CD;
            if (!drone.alive) return;
            const angle = index / count * Math.PI * 2 + .7;
            drone.mesh.position.set(Math.cos(angle) * T.SPAWN_RADIUS, ((index % 5) - 2) * 14, Math.sin(angle) * T.SPAWN_RADIUS);
            drone.mesh.quaternion.setFromUnitVectors(FORWARD, this.ship.position.clone().sub(drone.mesh.position).normalize());
        });
        this.metrics.waves++;
        this.events.push(`Wave ${this.wave}.`);
    }

    fire(enemy, owner)
    {
        const bolt = this.bolts.find(item => item.enemy === enemy && item.life <= 0);
        if (!bolt) return;
        bolt.life = T.BOLT_LIFE;
        bolt.mesh.visible = true;
        bolt.mesh.quaternion.copy(owner.quaternion);
        bolt.mesh.position.copy(owner.position).add(new V(0, 0, enemy ? -1.1 : -2.55).applyQuaternion(owner.quaternion));
        bolt.velocity.copy(FORWARD).applyQuaternion(owner.quaternion).multiplyScalar(enemy ? T.DRONE_BOLT_SPEED : T.BOLT_SPEED);
        if (enemy) this.metrics.enemyShots++;
        else
        {
            this.metrics.shots++;
            this.tones.play("bolt");
        }
    }

    burst(position, player)
    {
        const random = mulberry32(0xB4757 + this.wave * 13 + (player ? 1 : 0));
        const small = this.mobile || this.reduced;
        let count = small ? player ? 24 : 12 : player ? 56 : 28;
        for (const particle of this.particles)
        {
            if (particle.life > 0) continue;
            if (count-- <= 0) break;
            particle.duration = (player ? .65 : .45) * (small ? .35 : 1);
            particle.life = particle.duration;
            particle.mesh.position.copy(position);
            particle.mesh.visible = true;
            particle.mesh.scale.setScalar(1);
            particle.velocity.set(random() * 2 - 1, random() * 2 - 1, random() * 2 - 1).normalize().multiplyScalar(5 + random() * 9);
            particle.spin = random() * 8 - 4;
        }
    }

    destroy(drone)
    {
        if (!drone.alive) return;
        drone.alive = false;
        drone.mesh.visible = false;
        this.score += 100;
        this.metrics.kills++;
        this.burst(drone.mesh.position, false);
        this.tones.play("destroy");
        if (!this.drones.some(item => item.alive))
        {
            this.breather = T.BREATHER;
            this.score += 250;
            this.events.push(`Wave ${this.wave} cleared. Next wave incoming.`);
            this.tones.play("clear");
        }
    }

    damage()
    {
        if (this.state !== "play" || this.invulnerable > 0 || this.rollTime > T.ROLL_TIME - T.SHIMMER) return;
        this.shield = Math.max(0, this.shield - T.DRONE_BOLT_DAMAGE);
        this.metrics.hits++;
        this.invulnerable = T.HIT_INVULN;
        this.sinceHit = 0;
        this.shake = .16;
        this.tones.play("hit");
        if (this.shield === 0)
        {
            this.state = "ended";
            this.ship.visible = false;
            this.burst(this.ship.position, true);
            this.endWait = .7;
            this.tones.play("end");
            for (const bolt of this.bolts) { bolt.life = 0; bolt.mesh.visible = false; }
            this.missile.life = 0;
            this.missile.mesh.visible = false;
            this.lockRing.visible = false;
            this.events.push(`Shields down. Wave reached ${this.wave}.`);
        }
    }

    step(dt, input)
    {
        this.time += dt;
        for (const rock of this.rocks)
        {
            rock.mesh.rotation.y += rock.spin * dt;
            rock.mesh.rotation.x += rock.spin * dt * .4;
        }
        this.particles.forEach(particle =>
        {
            if (particle.life <= 0) return;
            particle.life -= dt;
            particle.mesh.visible = particle.life > 0;
            particle.mesh.position.addScaledVector(particle.velocity, dt);
            particle.mesh.quaternion.copy(this.camera.quaternion);
            if (!this.reduced) particle.mesh.rotateZ(particle.spin * (particle.duration - particle.life));
            particle.mesh.scale.setScalar(Math.max(0, particle.life / particle.duration));
        });
        if (this.state === "title")
        {
            if (!this.reduced) this.ship.rotation.y += .08 * dt;
            this.updateCamera(dt, true);
            return;
        }
        if (this.state === "ended")
        {
            this.endWait = Math.max(0, this.endWait - dt);
            return;
        }
        for (const key of ["boostCD", "rollCD", "fireCD", "lockCD", "invulnerable", "shake"])
        {
            this[key] = Math.max(0, this[key] - dt);
        }
        this.sinceHit += dt;
        if (this.sinceHit > T.REGEN_DELAY && this.shield > 0) this.shield = Math.min(T.SHIELD_MAX, this.shield + T.REGEN_RATE * dt);
        if (input.boost && this.boostCD === 0 && this.boostTime <= 0)
        {
            this.boostTime = T.BOOST_TIME;
            this.metrics.boosts++;
            this.tones.play("boost");
        }
        if (this.boostTime > 0)
        {
            this.boostTime = Math.max(0, this.boostTime - dt);
            if (this.boostTime === 0) this.boostCD = T.BOOST_CD;
        }
        if (input.roll && this.rollCD === 0 && this.rollTime <= 0)
        {
            this.rollTime = T.ROLL_TIME;
            this.rollDirection = input.x >= 0 ? -1 : 1;
            this.metrics.rolls++;
            this.tones.play("roll");
        }
        if (this.rollTime > 0)
        {
            this.rollTime = Math.max(0, this.rollTime - dt);
            const t = 1 - this.rollTime / T.ROLL_TIME;
            this.ship.userData.inner.rotation.z = this.rollDirection * Math.PI * 2 * t * t * (3 - 2 * t);
            if (this.rollTime === 0)
            {
                this.rollCD = T.ROLL_GAP;
                this.ship.userData.inner.rotation.z = 0;
            }
        }
        else
        {
            this.ship.userData.inner.rotation.z = THREE.MathUtils.lerp(this.ship.userData.inner.rotation.z, -input.x * T.BANK, 1 - Math.exp(-8 * dt));
        }
        this.shimmer.visible = this.rollTime > T.ROLL_TIME - T.SHIMMER;
        this.speedLines.visible = this.boostTime > 0 && !this.reduced;
        this.ship.userData.glow.opacity = this.boostTime > 0 ? 1 : .35;
        if (!this.boundary && this.ship.position.length() > T.WARN)
        {
            this.boundary = true;
            this.metrics.boundaryReturns++;
        }
        if (this.boundary && this.ship.position.length() < T.RELEASE) this.boundary = false;
        if (this.boundary)
        {
            const desired = this.ship.position.clone().negate().normalize();
            this.ship.rotation.y = approachAngle(this.ship.rotation.y, Math.atan2(-desired.x, -desired.z), T.YAW_RATE * dt);
            this.ship.rotation.x += clamp(Math.asin(desired.y) - this.ship.rotation.x, -T.PITCH_RATE * dt, T.PITCH_RATE * dt);
        }
        else
        {
            this.ship.rotation.y -= input.x * T.YAW_RATE * dt;
            this.ship.rotation.x = clamp(this.ship.rotation.x + input.y * T.PITCH_RATE * dt, -T.PITCH_LIMIT, T.PITCH_LIMIT);
        }
        const forward = FORWARD.clone().applyQuaternion(this.ship.quaternion);
        this.ship.position.addScaledVector(forward, (this.boostTime > 0 ? T.BOOST_SPEED : T.CRUISE) * dt);
        if (input.fire && this.fireCD === 0)
        {
            this.fire(false, this.ship);
            this.fireCD = T.BOLT_INTERVAL;
        }
        this.stepLock(dt, input, forward);
        this.stepDrones(dt);
        this.stepBolts(dt);
        this.stepMissile(dt);
        if (this.breather > 0 && this.state === "play")
        {
            this.breather -= dt;
            if (this.breather <= 0)
            {
                this.breather = 0;
                this.wave++;
                this.spawnWave();
            }
        }
        this.updateCamera(dt);
    }

    stepLock(dt, input, forward)
    {
        let next = null;
        let nearest = T.LOCK_MAX;
        if (input.lock && this.missile.life <= 0 && this.lockCD === 0)
        {
            for (const drone of this.drones)
            {
                if (!drone.alive) continue;
                const offset = drone.mesh.position.clone().sub(this.ship.position);
                const distance = offset.length();
                if (distance >= T.LOCK_MIN && distance < nearest && offset.normalize().dot(forward) > Math.cos(T.LOCK_CONE_DEG * Math.PI / 180))
                {
                    nearest = distance;
                    next = drone;
                }
            }
        }
        if (next !== this.candidate) this.lockProgress = 0;
        this.candidate = next;
        if (next)
        {
            this.lockProgress += dt / T.LOCK_TIME;
            if (Math.floor(this.time * 10) !== this.lastTick)
            {
                this.tones.play("tick");
                this.lastTick = Math.floor(this.time * 10);
            }
            if (this.lockProgress >= 1)
            {
                this.missile.life = T.MISSILE_LIFE;
                this.missile.target = next;
                this.missile.mesh.visible = true;
                this.missile.mesh.position.copy(this.ship.position);
                this.missile.mesh.quaternion.copy(this.ship.quaternion);
                this.lockProgress = 0;
                this.lockCD = T.LOCK_CD;
                this.metrics.missiles++;
                this.tones.play("missile");
            }
        }
        else this.lockProgress = 0;
        this.lockRing.visible = !!next && this.lockProgress > 0;
        if (next)
        {
            this.lockRing.position.copy(next.mesh.position);
            this.lockRing.quaternion.copy(this.camera.quaternion);
            this.lockRing.scale.setScalar(this.reduced ? 1 : 1 + .05 * Math.sin(this.time * 5));
        }
        this.drones.forEach(drone => drone.mesh.userData.sensor.material.emissive.set(drone === next ? "#E8A23A" : "#000000"));
    }

    stepDrones(dt)
    {
        for (const drone of this.drones)
        {
            if (!drone.alive || this.state !== "play") continue;
            const offset = this.ship.position.clone().sub(drone.mesh.position);
            const distance = offset.length();
            const direction = offset.normalize();
            const target = new THREE.Quaternion().setFromUnitVectors(FORWARD, direction);
            drone.mesh.quaternion.rotateTowards(target, T.DRONE_TURN * dt);
            const nose = FORWARD.clone().applyQuaternion(drone.mesh.quaternion);
            drone.mesh.position.addScaledVector(nose, Math.min(16 * Math.pow(1.06, this.wave - 1), 42) * dt);
            for (const other of this.drones)
            {
                if (!other.alive || other === drone) continue;
                const apart = drone.mesh.position.clone().sub(other.mesh.position);
                const gap = apart.length();
                if (gap > 0 && gap < T.SEPARATION) drone.mesh.position.addScaledVector(apart.normalize(), (T.SEPARATION - gap) * 4 * dt);
            }
            if (drone.mesh.position.length() > 146) drone.mesh.position.setLength(146);
            drone.cooldown = Math.max(0, drone.cooldown - dt);
            if (distance < T.DRONE_FIRE_RANGE && nose.dot(direction) > Math.cos(T.DRONE_FIRE_CONE_DEG * Math.PI / 180) && drone.cooldown === 0)
            {
                this.fire(true, drone.mesh);
                drone.cooldown = T.DRONE_FIRE_CD;
            }
        }
    }

    stepBolts(dt)
    {
        for (const bolt of this.bolts)
        {
            if (bolt.life <= 0) continue;
            bolt.life -= dt;
            const slices = Math.max(1, Math.ceil(bolt.velocity.length() * dt / 2));
            for (let i = 0; i < slices && bolt.life > 0; i++)
            {
                bolt.mesh.position.addScaledVector(bolt.velocity, dt / slices);
                if (bolt.enemy)
                {
                    if (bolt.mesh.position.distanceTo(this.ship.position) < 1.15)
                    {
                        this.damage();
                        bolt.life = 0;
                    }
                }
                else
                {
                    const target = this.drones.find(drone => drone.alive && drone.mesh.position.distanceTo(bolt.mesh.position) < 1.85);
                    if (target)
                    {
                        target.shield -= T.PLAYER_BOLT_DAMAGE;
                        if (target.shield <= 0) this.destroy(target);
                        bolt.life = 0;
                    }
                }
            }
            if (bolt.mesh.position.length() > 170) bolt.life = 0;
            bolt.mesh.visible = bolt.life > 0;
        }
    }

    stepMissile(dt)
    {
        const missile = this.missile;
        if (missile.life <= 0) return;
        missile.life -= dt;
        if (missile.target?.alive)
        {
            const direction = missile.target.mesh.position.clone().sub(missile.mesh.position).normalize();
            missile.mesh.quaternion.rotateTowards(new THREE.Quaternion().setFromUnitVectors(FORWARD, direction), T.MISSILE_TURN * dt);
        }
        missile.mesh.position.addScaledVector(FORWARD.clone().applyQuaternion(missile.mesh.quaternion), T.MISSILE_SPEED * dt);
        if (missile.target?.alive && missile.mesh.position.distanceTo(missile.target.mesh.position) < 2.15)
        {
            this.destroy(missile.target);
            missile.life = 0;
        }
        missile.mesh.visible = missile.life > 0;
    }

    updateCamera(dt, snap = false)
    {
        if (!this.ship || this.state === "ended") return;
        const title = this.state === "title";
        let offset = new V(0, 3.2, 8.4);
        let target = new V(0, .45, -7);
        if (title && this.mobile)
        {
            offset.set(0, 5.6, 12.2);
            target.set(0, -6, -6);
        }
        if (title && !this.mobile)
        {
            offset.x = -3.4;
            target.x = -3.4;
        }
        if (!title && this.boostTime > 0 && !this.reduced) offset.add(new V(0, .15, 1.6));
        offset.applyQuaternion(this.ship.quaternion).add(this.ship.position);
        target.applyQuaternion(this.ship.quaternion).add(this.ship.position);
        if (snap) this.camera.position.copy(offset);
        else this.camera.position.lerp(offset, 1 - Math.exp(-5.5 * dt));
        if (this.shake > 0 && !this.reduced) this.camera.position.x += Math.sin(this.time * 46) * .14 * this.shake / .16;
        this.camera.up.copy(UP);
        this.camera.lookAt(target);
    }
}
