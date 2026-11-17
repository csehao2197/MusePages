import test from "node:test";
import assert from "node:assert/strict";
import { SnakeGame, SPEEDS, stepFor } from "../game.js";
import { LocalRuns } from "../storage.js";

test("latest legal one-slot turn wins; a reverse cannot erase it", () =>
{
    const game = new SnakeGame();
    game.start();
    game.queue("north");
    assert.equal(game.queue("west"), false);
    assert.deepEqual(game.queued, [0, -1]);
    game.queue("south");
    game.cross();
    assert.deepEqual(game.body[0], [11, 9]);
    assert.equal(game.queued, null);
    assert.deepEqual(game.direction, [0, 1]);
});

test("opening food actually grows and scores; subsequent food excludes the updated body", () =>
{
    const game = new SnakeGame(() => 0);
    game.start();
    game.cross();
    game.cross();
    game.cross();
    assert.equal(game.score, 10);
    assert.equal(game.body.length, 5);
    assert.deepEqual(game.body[0], [14, 8]);
    assert.deepEqual(game.food, [0, 0]);
    assert(!game.body.some((cell) => cell.join() === game.food.join()));
});

test("wrap crosses an edge while walls stop without committing", () =>
{
    const game = new SnakeGame();
    game.start();
    for (let i = 0; i < 5; i++) game.cross();
    assert.deepEqual(game.body[0], [0, 8]);
    game.reset("walls");
    game.start();
    for (let i = 0; i < 5; i++) game.cross();
    assert.equal(game.state, "over");
    assert.equal(game.reason, "rail");
    assert.deepEqual(game.body[0], [15, 8]);
    assert.equal(game.score, 10);
});

test("self collision rejects occupied cells, but permits the vacating tail", () =>
{
    const game = new SnakeGame();
    game.start();
    game.body = [[1, 1], [1, 2], [2, 2], [2, 1]];
    game.direction = [1, 0];
    game.food = [8, 8];
    game.cross();
    assert.equal(game.state, "playing");
    assert.deepEqual(game.body[0], [2, 1]);
    game.body = [[1, 1], [2, 1], [2, 2], [1, 2], [0, 2]];
    game.direction = [0, 1];
    game.cross();
    assert.equal(game.reason, "cross");
    assert.deepEqual(game.body[0], [1, 1]);
});

test("points use the pre-growth step and all five rates follow length boundaries", () =>
{
    assert.deepEqual([4, 7, 8, 11, 12, 16, 17, 22, 23, 256].map(stepFor), [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]);
    assert.deepEqual(SPEEDS, [3.4, 4.4, 5.5, 6.6, 7.8]);
    const game = new SnakeGame();
    game.start();
    game.body = Array.from({ length: 7 }, (_, index) => [11 - index, 8]);
    game.food = [12, 8];
    game.cross();
    assert.equal(game.score, 10);
    assert.equal(game.step, 2);
    game.food = [13, 8];
    game.cross();
    assert.equal(game.score, 30);
});

test("pause freezes simulation and restart restores the exact opening", () =>
{
    const game = new SnakeGame();
    game.start();
    game.update(0.04);
    const frozen = game.offset;
    game.pause();
    game.update(5);
    assert.equal(game.offset, frozen);
    assert.equal(game.queue("north"), false);
    game.resume();
    game.update(0.04);
    assert(game.offset > frozen);
    game.reset("walls");
    assert.equal(game.offset, 0);
    assert.equal(game.score, 0);
    assert.deepEqual(game.food, [14, 8]);
    assert.deepEqual(game.body, [[11, 8], [10, 8], [9, 8], [8, 8]]);
});

test("a hitch is delta-capped and collision checks cannot be skipped", () =>
{
    const game = new SnakeGame();
    game.reset("walls");
    game.start();
    game.body = [[15, 8], [14, 8], [13, 8], [12, 8]];
    game.offset = 0.95;
    game.update(30);
    assert.equal(game.reason, "rail");
    assert.equal(game.offset, 1);
    assert.deepEqual(game.body[0], [15, 8]);
});

test("last food clears the 256-cell floor, scores once, and hides food", () =>
{
    const game = new SnakeGame();
    game.start();
    game.body = [[1, 0]];
    for (let z = 0; z < 16; z++)
    {
        for (let x = 0; x < 16; x++)
        {
            if (!(z === 0 && (x === 0 || x === 1))) game.body.push([x, z]);
        }
    }
    game.direction = [-1, 0];
    game.food = [0, 0];
    game.step = 5;
    game.cross();
    assert.equal(game.reason, "clear");
    assert.equal(game.body.length, 256);
    assert.equal(game.food, null);
    assert.equal(game.score, 50);
});

test("corrupt and unavailable storage remain playable; best and board persist independently", () =>
{
    let raw = "{bad";
    const storage = { getItem: () => raw, setItem: (key, value) => { raw = value; } };
    const runs = new LocalRuns(storage);
    assert.equal(runs.data.wrap.best, 0);
    assert.equal(runs.best("wrap", 50), true);
    assert.equal(JSON.parse(raw).wrap.best, 50);
    assert.equal(JSON.parse(raw).wrap.board.length, 0);
    runs.save("wrap", "ABC", 50, 8);
    runs.save("wrap", "YOU", 50, 9);
    assert.equal(runs.data.wrap.board[0].name, "YOU");
    assert.equal(runs.data.walls.best, 0);
    const denied = new LocalRuns({ getItem() { throw Error("Denied"); }, setItem() { throw Error("Denied"); } });
    assert.doesNotThrow(() => { denied.best("walls", 20); denied.save("walls", "YOU", 20, 6); denied.mute(true); });
    assert.equal(denied.data.walls.best, 20);
});
