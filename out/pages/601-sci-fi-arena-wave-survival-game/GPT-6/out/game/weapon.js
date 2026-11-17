import { T } from "./scene.js";
import { rules, reduced } from "./rules.js";

export class Weapon
{
    constructor(yard, player, audio)
    {
        this.yard = yard;
        this.player = player;
        this.audio = audio;
        this.mesh = new T.Group();
        yard.camera.add(this.mesh);
        const rib = new T.MeshStandardMaterial({ color: "#3EE0D2", emissive: "#3EE0D2", emissiveIntensity: 0.8 });
        yard.box([0, 0, 0], [0.28, 0.09, 0.16], "steel", false, false, this.mesh);
        yard.box([0, -0.005, -0.25], [0.08, 0.06, 0.34], "dark", false, false, this.mesh);
        yard.box([0, -0.1, 0.02], [0.06, 0.12, 0.07], "dark", false, false, this.mesh);
        yard.box([0, 0.058, -0.08], [0.03, 0.025, 0.2], rib, false, false, this.mesh);
        this.mesh.traverse((mesh) =>
        {
            if (mesh.isMesh)
            {
                mesh.castShadow = false;
                mesh.receiveShadow = false;
            }
        });
        this.muzzle = new T.PointLight("#3EE0D2", 0, 3.5);
        this.muzzle.position.set(0, 0, -0.43);
        this.mesh.add(this.muzzle);
        this.ray = new T.Raycaster();
        this.reset();
    }

    reset()
    {
        this.ammo = rules.magazine;
        this.reloadRemaining = 0;
        this.cooldown = 0;
        this.hit = 0;
        this.flash = 0;
        this.mesh.position.set(0.26, -0.24, -0.52);
        this.muzzle.intensity = 0;
    }

    reload()
    {
        if (this.ammo === rules.magazine || this.reloadRemaining > 0) return;
        this.reloadRemaining = rules.reload;
        this.audio.cue("reload");
    }

    shoot(drones)
    {
        if (this.reloadRemaining > 0 || this.cooldown > 0) return;
        if (this.ammo === 0)
        {
            this.cooldown = rules.dryInterval;
            this.audio.cue("dry");
            return;
        }
        this.ammo--;
        this.cooldown = rules.shotInterval;
        this.flash = 0.07;
        this.player.kick = 0.07;
        this.audio.cue("shot");
        const camera = this.yard.camera;
        this.yard.world.updateMatrixWorld(true);
        this.ray.setFromCamera(new T.Vector2(0, 0), camera);
        this.ray.far = 48;
        const bodies = drones.live.map((drone) => drone.body);
        const intersection = this.ray.intersectObjects([...this.yard.solids, ...bodies], false)[0];
        const end = intersection ? intersection.point : this.ray.ray.at(48, new T.Vector3());
        if (intersection?.object.userData.drone)
        {
            drones.damage(intersection.object.userData.drone);
            this.hit = 0.08;
        }
        else if (intersection && innerWidth >= 768 && !reduced())
        {
            this.yard.burst(end, 4, 0.3, 0.12, ["#3EE0D2"]);
        }
        const start = this.mesh.localToWorld(new T.Vector3(0, 0, -0.43));
        this.yard.tracer(start, end);
    }

    update(delta, firing, drones)
    {
        this.cooldown = Math.max(0, this.cooldown - delta);
        this.hit = Math.max(0, this.hit - delta);
        this.flash = Math.max(0, this.flash - delta);
        if (this.reloadRemaining > 0)
        {
            this.reloadRemaining = Math.max(0, this.reloadRemaining - delta);
            if (this.reloadRemaining === 0)
            {
                this.ammo = rules.magazine;
                this.audio.cue("loaded");
            }
        }
        if (firing) this.shoot(drones);
        this.mesh.position.z = -0.52 + (!reduced() && this.flash > 0 ? 0.02 : 0);
        this.muzzle.intensity = !reduced() && this.flash > 0.03 ? 6 : 0;
    }
}
