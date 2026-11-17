import { T } from "./scene.js";
import { rules, compact, reduced } from "./rules.js";

export class Drones
{
    constructor(yard, player, audio)
    {
        this.yard = yard;
        this.player = player;
        this.audio = audio;
        this.live = [];
        this.bolts = [];
        this.dropped = 0;
        this.clock = 0;
        this.bodyGeometry = new T.BoxGeometry(0.84, 0.3, 0.58);
        this.bodyMaterial = new T.MeshStandardMaterial({ color: "#2A2824", metalness: 0.42, roughness: 0.46 });
        this.thrusterGeometry = new T.BoxGeometry(0.2, 0.14, 0.2);
        this.thrusterMaterial = new T.MeshStandardMaterial({ color: "#E8A15A", emissive: "#E8A15A", emissiveIntensity: 0.6 });
        this.finGeometry = new T.BoxGeometry(0.06, 0.2, 0.16);
        this.markGeometry = new T.BoxGeometry(0.07, 0.07, 0.07);
        this.markMaterial = new T.MeshStandardMaterial({ color: "#E8A15A", emissive: "#E8A15A", emissiveIntensity: 1.2 });
        this.boltGeometry = new T.SphereGeometry(0.11, 8, 6);
        this.boltMaterial = new T.MeshBasicMaterial({ color: "#E7B15A" });
        this.reset();
    }

    create(slot, wave, title = false)
    {
        const group = new T.Group();
        const body = new T.Mesh(this.bodyGeometry, this.bodyMaterial);
        group.add(body);
        for (const x of [-0.28, 0.28])
        {
            const thruster = new T.Mesh(this.thrusterGeometry, this.thrusterMaterial);
            thruster.position.set(x, -0.2, 0);
            group.add(thruster);
            const mark = new T.Mesh(this.markGeometry, this.markMaterial);
            mark.position.set(x, 0, 0.3);
            group.add(mark);
        }
        const fin = new T.Mesh(this.finGeometry, this.bodyMaterial);
        fin.position.y = 0.24;
        group.add(fin);
        group.traverse((object) =>
        {
            if (object.isMesh) object.castShadow = true;
        });
        const baySlot = wave === 1 ? slot - 1 : slot;
        group.position.set(title ? 0 : (baySlot % 2 ? 12.4 : -12.4), title ? 2.25 : 2.15, title ? -4.2 : 0);
        group.rotation.y = 0;
        this.yard.world.add(group);
        const drone =
        {
            group, body, slot, wave, title,
            health: rules.droneHealth,
            angle: slot * 2.2,
            fire: 0.6 + slot * 0.15,
            age: 0
        };
        body.userData.drone = drone;
        this.live.push(drone);
        return drone;
    }

    reset()
    {
        for (const drone of this.live) this.yard.world.remove(drone.group);
        for (const bolt of this.bolts) this.yard.world.remove(bolt.mesh);
        this.live = [];
        this.bolts = [];
        this.clock = 0;
        this.dropped = 0;
        this.create(0, 1, true);
    }

    damage(drone)
    {
        if (drone.title || !this.live.includes(drone)) return;
        drone.health = Math.max(0, drone.health - rules.hitDamage);
        if (drone.health > 0) return;
        this.yard.world.remove(drone.group);
        this.live.splice(this.live.indexOf(drone), 1);
        this.dropped++;
        const calm = reduced();
        this.yard.burst(drone.group.position, calm ? 6 : (compact() ? 8 : 18), calm ? 0 : 2.2, calm ? 0.25 : 0.4, ["#F4EFE6", "#E8A15A"]);
        this.audio.cue("break");
    }

    fire(drone)
    {
        const mesh = new T.Mesh(this.boltGeometry, this.boltMaterial);
        mesh.position.copy(drone.group.position);
        const direction = this.player.position.clone().sub(mesh.position).normalize();
        mesh.position.addScaledVector(direction, 0.5);
        this.yard.world.add(mesh);
        this.bolts.push({ mesh, velocity: direction.multiplyScalar(rules.boltSpeed), life: rules.boltLife });
        this.audio.cue("bolt");
    }

    title(delta)
    {
        this.clock += delta;
        const drone = this.live[0];
        drone.group.rotation.y += delta * 0.25;
        drone.group.position.y = 2.25 + (reduced() ? 0 : Math.sin(this.clock * Math.PI * 2 * 0.8) * 0.12);
    }

    update(delta, wave)
    {
        this.clock += delta;
        for (const drone of this.live)
        {
            drone.age += delta;
            const radius = 8.5 + (drone.slot % 3) * 1.1;
            const speed = rules.droneSpeed(wave);
            drone.angle += delta * speed / radius;
            const position = drone.group.position;
            const desired = new T.Vector3(
                this.player.position.x + Math.cos(drone.angle) * radius,
                2.15,
                this.player.position.z + Math.sin(drone.angle) * radius);
            desired.x = T.MathUtils.clamp(desired.x, -12.8, 12.8);
            desired.z = T.MathUtils.clamp(desired.z, -9.8, 9.8);
            const direction = desired.sub(position);
            direction.y = 0;
            const distance = Math.hypot(position.x - this.player.position.x, position.z - this.player.position.z);
            const outward = position.clone().sub(this.player.position).setY(0).normalize();
            if (distance < 5.5) direction.addScaledVector(outward, 8);
            if (distance > 13) direction.addScaledVector(outward, -8);
            if (direction.length() > 0.03)
            {
                direction.normalize();
                let step = direction.clone().multiplyScalar(speed * delta);
                if (this.yard.blocked(position.x + step.x, position.z + step.z, 0.8))
                {
                    const side = new T.Vector3(-direction.z, 0, direction.x);
                    const alternatives = [1, -1].map((sign) => position.clone().addScaledVector(side, 2 * sign));
                    const target = alternatives.find((point) => !this.yard.blocked(point.x, point.z, 0.8));
                    step = target ? target.sub(position).normalize().multiplyScalar(speed * delta) : new T.Vector3();
                }
                if (!this.yard.blocked(position.x + step.x, position.z + step.z, 0.8))
                {
                    position.add(step);
                    if (step.lengthSq() > 0) drone.group.rotation.y = Math.atan2(step.x, step.z);
                }
                drone.group.rotation.z = reduced() ? 0 : Math.sin(drone.angle) * 0.15;
            }
            position.x = T.MathUtils.clamp(position.x, -12.8, 12.8);
            position.z = T.MathUtils.clamp(position.z, -9.8, 9.8);
            position.y = 2.15 + (reduced() || drone.age < 0.4 ? 0 : Math.sin(this.clock * Math.PI * 2 * 1.4 + drone.slot) * 0.1);
            drone.fire -= delta;
            if (drone.fire <= 0)
            {
                this.fire(drone);
                drone.fire = rules.droneInterval(wave);
            }
        }
        for (let index = this.bolts.length - 1; index >= 0; index--)
        {
            const bolt = this.bolts[index];
            const start = bolt.mesh.position.clone();
            const end = start.clone().addScaledVector(bolt.velocity, delta);
            bolt.life -= delta;
            const solid = this.yard.segment(start, end);
            const segment = new T.Line3(start, end);
            const nearest = segment.closestPointToPoint(this.player.position, true, new T.Vector3());
            const hit = nearest.distanceTo(this.player.position) < 0.4;
            const beforeWall = !solid || start.distanceTo(nearest) < solid.distance;
            if (hit && beforeWall) this.player.damage();
            if (bolt.life <= 0 || solid || (hit && beforeWall))
            {
                this.yard.world.remove(bolt.mesh);
                this.bolts.splice(index, 1);
            }
            else bolt.mesh.position.copy(end);
        }
    }
}
