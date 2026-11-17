import * as THREE from "three";
import { content } from "../content.js";

export async function saveSnapshot(garden)
{
    if (garden.exporting) return false;
    garden.exporting = true;
    const { renderer } = garden;
    const oldSize = renderer.getSize(new THREE.Vector2());
    const oldRatio = renderer.getPixelRatio();
    const oldRing = garden.ring.visible;
    let url;
    try
    {
        garden.ring.visible = false;
        const scale = Math.min(1, 2048 / Math.max(oldSize.x, oldSize.y));
        renderer.setPixelRatio(1);
        renderer.setSize(Math.round(oldSize.x * scale), Math.round(oldSize.y * scale), false);
        garden.render();
        const blob = await new Promise((resolve) => renderer.domElement.toBlob(resolve, "image/png"));
        if (!blob) throw new Error("PNG encoding failed");
        url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${content.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-garden.png`;
        anchor.click();
        garden.ui.toast(content.toasts.saved);
        return true;
    }
    catch
    {
        garden.ui.toast(content.toasts.failed);
        return false;
    }
    finally
    {
        if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
        renderer.setPixelRatio(oldRatio);
        renderer.setSize(oldSize.x, oldSize.y, false);
        garden.ring.visible = oldRing;
        garden.exporting = false;
        garden.render();
    }
}
