import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { WorkspaceFiles } from "../../../../../src/workflows/script/render-prompt-page.mjs";

const folder = path.resolve("out", "pages", "617-danmaku-video-platform", "GPT-6");
const evidence = JSON.parse(await readFile(path.join(folder, ".checks", "media.json"), "utf8"));
const uint = (value) =>
{
    const bytes = Buffer.alloc(8);
    bytes.writeBigUInt64BE(BigInt(value));
    return bytes;
};
function element(id, data)
{
    let bytes = 1;
    while (data.length >= 2 ** (7 * bytes) - 1) bytes++;
    const size = Buffer.alloc(bytes);
    let length = data.length;
    for (let i = bytes - 1; i >= 0; i--)
    {
        size[i] = length % 256;
        length = Math.floor(length / 256);
    }
    size[0] |= 128 >> (bytes - 1);
    return Buffer.concat([Buffer.from(id, "hex"), size, data]);
}
function unsigned(id, value)
{
    return element(id, uint(value));
}
function remux(buffer)
{
    const vint = (offset, identifier = false) =>
    {
        let bytes = 1;
        while (!(buffer[offset] & (128 >> (bytes - 1)))) bytes++;
        let value = identifier ? buffer[offset] : buffer[offset] & ((1 << (8 - bytes)) - 1);
        for (let i = 1; i < bytes; i++) value = value * 256 + buffer[offset + i];
        return { value, bytes };
    };
    const readElement = (offset) =>
    {
        const id = vint(offset, true);
        const size = vint(offset + id.bytes);
        return { id: id.value, offset, data: offset + id.bytes + size.bytes, size: size.value };
    };
    const header = readElement(0);
    const ebml = buffer.subarray(0, header.data + header.size);
    const segment = readElement(ebml.length);
    let offset = segment.data;
    const info = readElement(offset);
    const infoBytes = buffer.subarray(offset, info.data + info.size);
    offset = info.data + info.size;
    const tracks = readElement(offset);
    const tracksBytes = buffer.subarray(offset, tracks.data + tracks.size);
    offset = tracks.data + tracks.size;
    const clusters = [];
    while (offset < buffer.length)
    {
        const cluster = readElement(offset);
        if (cluster.id !== 0x1f43b675) throw Error(`Unexpected cluster ${cluster.id.toString(16)}`);
        const timestamp = readElement(cluster.data);
        if (timestamp.id !== 0xe7) throw Error("Cluster timecode missing");
        let time = 0;
        for (let i = 0; i < timestamp.size; i++) time = time * 256 + buffer[timestamp.data + i];
        let end = cluster.data;
        while (end < buffer.length)
        {
            const child = readElement(end);
            if (child.id === 0x1f43b675) break;
            end = child.data + child.size;
        }
        clusters.push({ time, bytes: element("1f43b675", buffer.subarray(cluster.data, end)) });
        offset = end;
    }
    const cuePoints = (start) =>
    {
        let position = start;
        return clusters.map((cluster) =>
        {
            const cue = element("bb", Buffer.concat([
                unsigned("b3", cluster.time),
                element("b7", Buffer.concat([unsigned("f7", 1), unsigned("f1", position)]))
            ]));
            position += cluster.bytes.length;
            return cue;
        });
    };
    const seekEntry = (id, position) => element("4dbb", Buffer.concat([
        element("53ab", Buffer.from(id, "hex")), unsigned("53ac", position)
    ]));
    const provisionalHead = element("114d9b74", Buffer.concat([seekEntry("1549a966", 0), seekEntry("1654ae6b", 0), seekEntry("1c53bb6b", 0)]));
    const provisionalCues = element("1c53bb6b", Buffer.concat(cuePoints(0)));
    const infoPosition = provisionalHead.length;
    const tracksPosition = infoPosition + infoBytes.length;
    const cuesPosition = tracksPosition + tracksBytes.length;
    const start = cuesPosition + provisionalCues.length;
    const seekHead = element("114d9b74", Buffer.concat([seekEntry("1549a966", infoPosition), seekEntry("1654ae6b", tracksPosition), seekEntry("1c53bb6b", cuesPosition)]));
    const cues = element("1c53bb6b", Buffer.concat(cuePoints(start)));
    return { bytes: Buffer.concat([ebml, element("18538067", Buffer.concat([seekHead, infoBytes, tracksBytes, cues, ...clusters.map((c) => c.bytes)]))]), clusters: clusters.map((c) => c.time) };
}
for (const clip of evidence.clips)
{
    const filename = `${clip.id}.webm`;
    const movie = await readFile(path.join(folder, "assets", filename));
    const indexed = remux(movie);
    for (const base of [folder, path.join(folder, "out")])
    {
        await writeFile(path.join(base, "assets", filename), indexed.bytes);
    }
    clip.bytes = indexed.bytes.length;
    clip.sha256 = createHash("sha256").update(indexed.bytes).digest("hex");
    clip.cueTimestampsMs = indexed.clusters;
    clip.indexedForSeeking = true;
    console.log(`${clip.id}: ${indexed.clusters.length} indexed media clusters`);
}
await WorkspaceFiles.saveJson(path.join(folder, ".checks", "media.json"), evidence);
