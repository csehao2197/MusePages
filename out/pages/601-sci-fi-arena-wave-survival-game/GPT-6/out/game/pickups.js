import { T } from "./scene.js";
import { rules, reduced } from "./rules.js";

export class Pickups
{
    constructor(yard, player, audio)
    {
        this.player = player;
        this.audio = audio;
        this.cells = [];
        for (const [kind, x, z] of [
            ["health", -4.8, 6.6], ["health", 9.1, -5.4],
            ["shield", 3.6, 6.5], ["shield", -8.8, -2.6]])
        {
            const color = kind === "health" ? "#F08A4B" : "#7EB6FF";
            const material = new T.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.3, roughness: 0.35 });
            const mesh = new T.Group();
            const cylinder = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.62, 10), material);
            const cap = new T.Mesh(new T.BoxGeometry(0.16, 0.08, 0.16), material);
            cap.position.y = 0.35;
            mesh.add(cylinder, cap);
            mesh.position.set(x, 0.4, z);
            mesh.traverse((object) =>
            {
                if (object.isMesh) object.castShadow = true;
            });
            yard.world.add(mesh);
            this.cells.push({ kind, mesh, timer: 0 });
        }
    }

    reset()
    {
        for (const cell of this.cells)
        {
            cell.timer = 0;
            cell.mesh.visible = true;
            cell.mesh.rotation.y = 0;
        }
    }

    update(delta, playing)
    {
        for (const cell of this.cells)
        {
            if (reduced()) cell.mesh.rotation.y = 0;
            else cell.mesh.rotation.y += delta * 0.7;
            if (!playing) continue;
            if (cell.timer > 0)
            {
                cell.timer = Math.max(0, cell.timer - delta);
                cell.mesh.visible = cell.timer === 0;
            }
            if (!cell.mesh.visible || this.player[cell.kind] >= 100) continue;
            if (Math.hypot(this.player.position.x - cell.mesh.position.x, this.player.position.z - cell.mesh.position.z) < 1)
            {
                this.player[cell.kind] = Math.min(100, this.player[cell.kind] + rules.restore);
                cell.timer = rules.cellRespawn;
                cell.mesh.visible = false;
                this.audio.cue("pickup");
            }
        }
    }
}
