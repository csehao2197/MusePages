import { createBricks, speeds } from "./levels.js";

export const WIDTH = 800;
export const HEIGHT = 600;
export const RADIUS = 6;
export const PADDLE_Y = 550;

export function createGame()
{
    const game = { phase: "idle", level: 1, elapsed: 0, balls: [], bricks: [], paddle: { x: 350, w: 100 }, impacts: [], cleared: 0 };
    loadLevel(game, 1);
    return game;
}

export function loadLevel(game, level)
{
    game.level = level;
    game.bricks = createBricks(level);
    game.paddle.w = Math.max(60, 100 - Math.max(0, level - 2) * 5);
    game.paddle.x = 400 - game.paddle.w / 2;
    const velocity = 180 * speeds[level - 1];
    game.balls = [{ x: 400, y: 520, vx: (level % 2 ? 1 : -1) * velocity, vy: -velocity, trail: [] }];
    game.impacts = [];
    game.launchDelay = .65;
}

export function movePaddle(game, center)
{
    game.paddle.x = Math.max(0, Math.min(WIDTH - game.paddle.w, center - game.paddle.w / 2));
}

export function bounceBrick(ball, brick, previous)
{
    if (ball.x + RADIUS < brick.x || ball.x - RADIUS > brick.x + brick.w ||
        ball.y + RADIUS < brick.y || ball.y - RADIUS > brick.y + brick.h) return false;
    if (previous.y + RADIUS <= brick.y && ball.vy > 0)
    {
        ball.y = brick.y - RADIUS;
        ball.vy = -Math.abs(ball.vy);
    }
    else if (previous.y - RADIUS >= brick.y + brick.h && ball.vy < 0)
    {
        ball.y = brick.y + brick.h + RADIUS;
        ball.vy = Math.abs(ball.vy);
    }
    else if (previous.x + RADIUS <= brick.x && ball.vx > 0)
    {
        ball.x = brick.x - RADIUS;
        ball.vx = -Math.abs(ball.vx);
    }
    else if (previous.x - RADIUS >= brick.x + brick.w && ball.vx < 0)
    {
        ball.x = brick.x + brick.w + RADIUS;
        ball.vx = Math.abs(ball.vx);
    }
    else
    {
        const horizontal = Math.min(ball.x + RADIUS - brick.x, brick.x + brick.w - ball.x + RADIUS);
        const vertical = Math.min(ball.y + RADIUS - brick.y, brick.y + brick.h - ball.y + RADIUS);
        if (horizontal < vertical)
        {
            const left = ball.x < brick.x + brick.w / 2;
            ball.x = left ? brick.x - RADIUS : brick.x + brick.w + RADIUS;
            ball.vx = (left ? -1 : 1) * Math.abs(ball.vx);
        }
        else
        {
            const top = ball.y < brick.y + brick.h / 2;
            ball.y = top ? brick.y - RADIUS : brick.y + brick.h + RADIUS;
            ball.vy = (top ? -1 : 1) * Math.abs(ball.vy);
        }
    }
    return true;
}

function splitBalls(game, ball, brick, newborn)
{
    const speed = Math.hypot(ball.vx, ball.vy);
    const direction = Math.atan2(ball.vy, ball.vx);
    for (const turn of [-Math.PI / 4, Math.PI / 4])
    {
        if (game.balls.length + newborn.length >= 8) break;
        const angle = direction + turn;
        let vy = Math.sin(angle) * speed;
        if (Math.abs(vy) < speed * .2) vy = (vy >= 0 ? 1 : -1) * speed * .2;
        const vx = (Math.cos(angle) >= 0 ? 1 : -1) * Math.sqrt(speed ** 2 - vy ** 2);
        newborn.push({ x: brick.x + brick.w / 2, y: brick.y + brick.h / 2, vx, vy, trail: [] });
    }
}

export function step(game, delta, direction = 0, onImpact = () => {})
{
    if (game.phase !== "playing") return;
    delta = Math.min(delta, .05);
    game.elapsed += delta;
    if (direction) movePaddle(game, game.paddle.x + game.paddle.w / 2 + direction * 480 * delta);
    if (game.launchDelay > 0)
    {
        game.launchDelay -= delta;
        return;
    }
    const count = Math.max(1, Math.ceil(delta / (1 / 240)));
    const dt = delta / count;
    for (let iteration = 0; iteration < count; iteration++)
    {
        const newborn = [];
        for (const ball of game.balls)
        {
            const previous = { x: ball.x, y: ball.y };
            ball.x += ball.vx * dt;
            ball.y += ball.vy * dt;
            if (ball.x < RADIUS)
            {
                ball.x = RADIUS;
                ball.vx = Math.abs(ball.vx);
            }
            if (ball.x > WIDTH - RADIUS)
            {
                ball.x = WIDTH - RADIUS;
                ball.vx = -Math.abs(ball.vx);
            }
            if (ball.y < RADIUS)
            {
                ball.y = RADIUS;
                ball.vy = Math.abs(ball.vy);
            }
            if (ball.vy > 0 && previous.y + RADIUS <= PADDLE_Y && ball.y + RADIUS >= PADDLE_Y &&
                ball.x + RADIUS >= game.paddle.x && ball.x - RADIUS <= game.paddle.x + game.paddle.w)
            {
                const relative = Math.max(-1, Math.min(1, (ball.x - game.paddle.x - game.paddle.w / 2) / (game.paddle.w / 2)));
                const speed = Math.hypot(ball.vx, ball.vy);
                ball.vx = speed * Math.sin(relative * Math.PI / 3);
                ball.vy = -speed * Math.cos(relative * Math.PI / 3);
                ball.y = PADDLE_Y - RADIUS;
                onImpact("paddle");
            }
            for (const brick of game.bricks)
            {
                if (!brick.alive || !bounceBrick(ball, brick, previous)) continue;
                if (brick.type !== "I")
                {
                    brick.alive = false;
                    game.cleared++;
                    game.impacts.push({ x: brick.x + 30, y: brick.y + 10, age: 0, color: brick.type === "S" ? "#f59e0b" : "#6e9ed4" });
                    if (brick.type === "S") splitBalls(game, ball, brick, newborn);
                }
                onImpact(brick.type);
                break;
            }
        }
        game.balls = game.balls.filter((ball) => ball.y - RADIUS < HEIGHT).concat(newborn);
        if (!game.bricks.some((brick) => brick.alive && brick.type !== "I"))
        {
            if (game.level === 10) game.phase = "victory";
            else loadLevel(game, game.level + 1);
            return;
        }
        if (!game.balls.length)
        {
            game.phase = "gameover";
            return;
        }
    }
    for (const ball of game.balls)
    {
        ball.trail.unshift({ x: ball.x, y: ball.y });
        ball.trail.length = Math.min(10, ball.trail.length);
    }
    for (const impact of game.impacts) impact.age += delta;
    game.impacts = game.impacts.filter((impact) => impact.age < .4);
}
