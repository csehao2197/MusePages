import { WIDTH, HEIGHT, PADDLE_Y, RADIUS } from "./engine.js";

export function render(ctx, game, now, reducedMotion)
{
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#050314";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    const glow = ctx.createRadialGradient(400, 290, 0, 400, 290, 420);
    glow.addColorStop(0, "#19102b");
    glow.addColorStop(1, "#050314");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "#a78bfa06";
    ctx.lineWidth = 1;
    for (let x = 16; x < WIDTH; x += 32)
    {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, HEIGHT);
        ctx.stroke();
    }
    for (let y = 16; y < HEIGHT; y += 32)
    {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WIDTH, y);
        ctx.stroke();
    }
    for (let i = 0; i < 95; i++)
    {
        const x = (i * 197 + 53) % WIDTH;
        const y = (i * 137 + 17) % HEIGHT;
        ctx.fillStyle = i % 4 === 0 ? "#c3a6ef66" : "#7f6a982b";
        ctx.fillRect(x, y, i % 5 === 0 ? 2 : 1, 1);
    }
    ctx.save();
    if (game.phase === "idle") ctx.globalAlpha = .6;
    for (const brick of game.bricks)
    {
        if (!brick.alive) continue;
        const { x, y, w, h, type } = brick;
        ctx.fillStyle = type === "S" ? "#753f09" : type === "I" ? "#374151" : "#1e3a5f";
        ctx.strokeStyle = type === "S" ? "#d97706" : type === "I" ? "#647081" : "#3c618b";
        if (type === "S")
        {
            ctx.shadowColor = "#d97706";
            ctx.shadowBlur = reducedMotion ? 8 : 8 + Math.sin(now / 400) * 4;
        }
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 3);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#ffffff0c";
        ctx.fillRect(x + 2, y + 2, w - 4, 2);
        if (type === "I")
        {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x + 1, y + 1, w - 2, h - 2);
            ctx.clip();
            ctx.strokeStyle = "#ffffff10";
            for (let offset = -20; offset < w; offset += 6)
            {
                ctx.beginPath();
                ctx.moveTo(x + offset, y);
                ctx.lineTo(x + offset + 20, y + h);
                ctx.stroke();
            }
            ctx.restore();
            ctx.strokeStyle = "#c3cbd8";
            ctx.lineWidth = 1.4;
            ctx.strokeRect(x + 26, y + 9, 8, 7);
            ctx.beginPath();
            ctx.arc(x + 30, y + 8, 3, Math.PI, 0);
            ctx.stroke();
            ctx.lineWidth = 1;
        }
        if (type === "S")
        {
            ctx.fillStyle = "#ffe1aa";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.fillText("⊕", x + w / 2, y + 15);
        }
    }
    ctx.restore();
    ctx.save();
    ctx.shadowColor = "#7c3aed";
    ctx.shadowBlur = 20;
    const paddleGradient = ctx.createLinearGradient(0, PADDLE_Y, 0, PADDLE_Y + 12);
    paddleGradient.addColorStop(0, "#b794f6");
    paddleGradient.addColorStop(1, "#7c3aed");
    ctx.fillStyle = paddleGradient;
    ctx.beginPath();
    ctx.roundRect(game.paddle.x, PADDLE_Y, game.paddle.w, 10, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#e9dcff";
    ctx.fillRect(game.paddle.x + 8, PADDLE_Y + 2, game.paddle.w - 16, 1);
    for (const ball of game.balls)
    {
        if (!reducedMotion)
        {
            ball.trail.forEach((point, index) =>
            {
                ctx.fillStyle = `rgba(167,139,250,${.22 * (1 - index / 10)})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, RADIUS * (1 - index / 14), 0, Math.PI * 2);
                ctx.fill();
            });
        }
        ctx.shadowColor = "#c4b5fd";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#e0e7ff";
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, RADIUS, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    if (!reducedMotion)
    {
        for (const impact of game.impacts)
        {
            ctx.globalAlpha = 1 - impact.age / .4;
            ctx.fillStyle = impact.color;
            for (let i = 0; i < 8; i++)
            {
                const angle = i * Math.PI / 4;
                ctx.fillRect(impact.x + Math.cos(angle) * impact.age * 140, impact.y + Math.sin(angle) * impact.age * 90, 3, 3);
            }
        }
    }
    ctx.restore();
}
