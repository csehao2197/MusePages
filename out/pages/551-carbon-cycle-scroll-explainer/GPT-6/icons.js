import replaceElement from "./vendor/replaceElement.js";
import Wind from "./vendor/icons/wind.js";
import Trees from "./vendor/icons/trees.js";
import Waves from "./vendor/icons/waves.js";
import Layers from "./vendor/icons/layers.js";
import Flame from "./vendor/icons/flame.js";
import Thermometer from "./vendor/icons/thermometer.js";
import Info from "./vendor/icons/info.js";
import ArrowDown from "./vendor/icons/arrow-down.js";
import Printer from "./vendor/icons/printer.js";
import Plus from "./vendor/icons/plus.js";
import Minus from "./vendor/icons/minus.js";

export const icons = { Wind, Trees, Waves, Layers, Flame, Thermometer, Info, ArrowDown, Printer, Plus, Minus };

export function createIcons({icons, attrs})
{
    document.querySelectorAll("[data-lucide]").forEach((element) =>
    {
        replaceElement(element, {nameAttr: "data-lucide", icons, attrs});
    });
}
