// All scenes are original Canvas artwork; time is in seconds.
export function drawFilm(canvas, scene, time = 3)
{
    const context = canvas.getContext("2d");
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    if (!canvas.width)
    {
        canvas.width = 960 * scale;
        canvas.height = 540 * scale;
    }
    const c = context;
    c.save();
    c.scale(canvas.width / 960, canvas.height / 540);
    c.clearRect(0, 0, 960, 540);
    const rect = (x, y, w, h, color) =>
    {
        c.fillStyle = color;
        c.fillRect(x, y, w, h);
    };
    const circle = (x, y, r, color) =>
    {
        c.beginPath();
        c.arc(x, y, r, 0, Math.PI * 2);
        c.fillStyle = color;
        c.fill();
    };
    if (scene === "city" || scene === "night")
    {
        const night = scene === "night";
        const sky = c.createLinearGradient(0, 0, 0, 540);
        sky.addColorStop(0, night ? "#242b45" : "#b5b4be");
        sky.addColorStop(1, night ? "#72758b" : "#f1c8b3");
        rect(0, 0, 960, 540, sky);
        circle(680, 168 - Math.sin(time / 10) * 12, night ? 47 : 98, night ? "#ede0be" : "#ffd0a2");
        for (let i = 0; i < 13; i++)
        {
            const x = i * 87 - 30;
            const h = 70 + (i * 43 % 120);
            rect(x, 355 - h, 75, h, "#737f88");
            rect(x + 14, 342 - h, 7, 16, "#737f88");
        }
        for (let i = 0; i < 10; i++)
        {
            const x = i * 110 - 30;
            const h = 108 + (i * 61 % 145);
            rect(x, 428 - h, 94, h, i % 2 ? "#354f56" : "#48636a");
            rect(x - 5, 424 - h, 104, 7, "#2a454d");
            for (let row = 0; row < Math.floor(h / 27) - 1; row++)
            {
                for (let col = 0; col < 4; col++)
                {
                    rect(x + col * 19 + 10, 445 - h + row * 26, 9, 12,
                        (row + col + i) % 3 ? (night ? "#e9c28b" : "#92a3a0") : "#243c48");
                }
            }
        }
        rect(0, 425, 960, 115, "#82969a");
        for (let i = 0; i < 28; i++)
        {
            rect((i * 89 + time * 10) % 1040 - 80, 442 + i % 6 * 15, 30 + i % 4 * 13, 2, "#c5c5b7");
        }
        rect(0, 396, 960, 13, "#233f47");
        rect(0, 416, 960, 6, "#233f47");
        for (let i = 0; i < 8; i++)
        {
            rect(i * 155 + 20, 400, 9, 140, "#233f47");
        }
        const train = (time * 43) % 1300 - 340;
        for (let i = 0; i < 3; i++)
        {
            rect(train + i * 111, 369, 107, 28, "#d9996e");
            rect(train + i * 111 + 6, 375, 93, 10, "#344c54");
            for (let j = 0; j < 5; j++) rect(train + i * 111 + 11 + j * 18, 375, 2, 10, "#d9996e");
        }
        c.strokeStyle = "#30494f";
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(0, 344);
        c.lineTo(960, 344);
        c.stroke();
        for (let i = 0; i < 5; i++)
        {
            rect(i * 250 + 65, 328, 4, 69, "#30494f");
        }
        c.strokeStyle = "#54676d";
        c.lineWidth = 2;
        for (let i = 0; i < 4; i++)
        {
            const x = 170 + i * 20 + time * 4;
            c.beginPath();
            c.moveTo(x, 95 + i % 2 * 15);
            c.lineTo(x + 6, 91 + i % 2 * 15);
            c.lineTo(x + 12, 95 + i % 2 * 15);
            c.stroke();
        }
    }
    else if (scene === "form")
    {
        rect(0, 0, 960, 540, "#e5dcce");
        rect(0, 414, 960, 126, "#cbbba8");
        circle(337, 319, 104, "#cc623f");
        rect(410, 145 + Math.sin(time) * 8, 160, 269, "#637b68");
        circle(674, 332, 82, "#d9b659");
        c.save();
        c.translate(592, 130 + Math.sin(time) * 8);
        c.rotate(Math.sin(time / 2) * 0.1);
        rect(-156, -22, 312, 44, "#e8a48c");
        c.restore();
        circle(337, 319, 40, "#e5dcce");
        rect(98, 386, 112, 28, "#53646b");
    }
    else if (scene === "tide")
    {
        rect(0, 0, 960, 540, "#cbdedb");
        circle(765, 96, 45, "#efe5c3");
        const colors = ["#9abdb9", "#6a9c9b", "#417e85", "#28626f", "#194857"];
        colors.forEach((color, i) =>
        {
            c.beginPath();
            c.moveTo(0, 540);
            for (let x = 0; x <= 960; x += 8)
            {
                c.lineTo(x, 205 + i * 63 + Math.sin(x / 130 + time * 0.8 + i) * (22 + i * 4));
            }
            c.lineTo(960, 540);
            c.fillStyle = color;
            c.fill();
        });
        for (let i = 0; i < 18; i++)
        {
            rect((i * 117 + time * 20) % 960, 270 + i % 6 * 43, 22 + i % 3 * 16, 2, "#bed6cd");
        }
    }
    else if (scene === "clay")
    {
        rect(0, 0, 960, 540, "#cbbda7");
        circle(700, 140, 180, "#dcd0bb");
        rect(0, 417, 960, 123, "#927d65");
        c.fillStyle = "#ae6644";
        c.beginPath();
        c.moveTo(407, 173);
        c.bezierCurveTo(443, 240, 318, 278, 365, 401);
        c.bezierCurveTo(400, 430, 560, 430, 595, 401);
        c.bezierCurveTo(642, 278, 517, 240, 553, 173);
        c.closePath();
        c.fill();
        c.save();
        c.clip();
        for (let i = 0; i < 27; i++)
        {
            rect(330, 185 + i * 8, 310, 2, i % 2 ? "#c48159" : "#b9704c");
            rect(370 + Math.sin(time + i / 4) * 7, 185 + i * 8, 35, 2, "#d2976e");
        }
        c.restore();
        c.beginPath();
        c.ellipse(480, 173, 73, 16, 0, 0, Math.PI * 2);
        c.fillStyle = "#673f2e";
        c.fill();
        rect(688, 399, 110, 17, "#d8cbb1");
    }
    else
    {
        rect(0, 0, 960, 540, "#d9dfc2");
        circle(719, 130, 116, "#e7c977");
        rect(0, 460, 960, 80, "#a4af83");
        for (let i = 0; i < 9; i++)
        {
            const x = 85 + i * 100;
            const top = 150 + i * 43 % 140;
            const sway = Math.sin(time * 0.8 + i) * 8;
            c.strokeStyle = "#496d52";
            c.lineWidth = 5;
            c.beginPath();
            c.moveTo(x, 500);
            c.quadraticCurveTo(x + sway, 330, x + sway, top);
            c.stroke();
            for (let j = 0; j < 4; j++)
            {
                c.save();
                c.translate(x + sway / 2, top + 50 + j * 55);
                c.rotate(j % 2 ? 0.45 : -0.45);
                c.beginPath();
                c.ellipse(j % 2 ? 28 : -28, -10, 40, 15, j % 2 ? -0.6 : 0.6, 0, Math.PI * 2);
                c.fillStyle = (i + j) % 2 ? "#52775a" : "#7f985e";
                c.fill();
                c.restore();
            }
        }
    }
    c.restore();
}
