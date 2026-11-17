export const track =
{
    length: 4200,
    roadWidth: 12,
    limit: 5.2,
    hover: 0.85,
    steer: 8.5,
    cruise: 68,
    pace: 92,
    boost: 132,
    frameDrain: 0.42,
    wallDamage: 22,
    droneDamage: 24,
    surgeDrain: 29,
    surgeRegen: 5,
    archSurge: 36,
    initialSurge: 100,
    pickupScore: 100,
    archScore: 50,
    finishScore: 500,
    hitWidth: 1.15,
    tick: 1 / 60,
    viewDistance: 260,
    roadStep: 5,
    curveScale: 0.004,
    curveWidth: 8,
    towerCount: 84,
    lanes: [-3.6, 0, 3.6]
};
export function bend(distance)
{
    return Math.sin(distance * track.curveScale) * track.curveWidth + Math.sin(distance * 0.009) * 2;
}
export const course = [];
for (let index = 0; index < 47; index++)
{
    const distance = 100 + index * 84;
    const lane = track.lanes[index % 3];
    course.push({ id: `crystal-${index}`, kind: "crystal", distance, x: lane });
    if (index % 4 === 1)
    {
        course.push({ id: `arch-${index}`, kind: "arch", distance: distance + 36, x: 0 });
    }
    if (index > 2)
    {
        course.push({ id: `drone-${index}`, kind: "drone", distance: distance + 47, x: track.lanes[(index + 1) % 3] });
    }
}
course.sort((a, b) => a.distance - b.distance);
