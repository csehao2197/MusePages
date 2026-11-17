import { palette as p } from "./palette.js";
import { tiers } from "../quality.js";

const fragment = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec4 season;
uniform float nightAmount;
uniform float rainAmount;
uniform vec4 rings[24];
varying vec2 uv;
float hash(vec2 x){return fract(sin(dot(x,vec2(127.1,311.7)))*43758.5453);}
float cells(vec2 x, float t)
{
    vec2 g=floor(x), f=fract(x);
    float a=8., b=8.;
    for(int j=-1;j<=1;j++)
    {
        for(int i=-1;i<=1;i++)
        {
            vec2 n=vec2(float(i),float(j));
            float h=hash(g+n);
            vec2 q=n+0.5+0.23*sin(vec2(h*6.28,h*14.1)+t)-f;
            float d=dot(q,q);
            if(d<a){b=a;a=d;}else{b=min(b,d);}
        }
    }
    return pow(1.-clamp((sqrt(b)-sqrt(a))*3.8,0.,1.),6.);
}
void main()
{
    vec2 pixel=uv*resolution;
    for(int i=0;i<24;i++)
    {
        vec4 r=rings[i];
        vec2 delta=pixel-r.xy;
        float distance=length(delta);
        float band=exp(-pow((distance-r.z)/18.,2.));
        pixel+=delta/max(distance,1.)*band*r.w*6.;
    }
    float u=sqrt(resolution.x*resolution.y)/1140.;
    vec2 x=pixel/max(u,0.3)/118.;
    float a=cells(x+vec2(time*.042,-time*.025),time*.42);
    float b=cells(x*1.7+vec2(-time*.067,time*.034),-time*.31);
    float floorNoise=sin(x.x*.82+sin(x.y*1.2))*sin(x.y*.67+x.x*.3);
    vec3 base=mix(vec3(.055,.231,.263),vec3(.024,.110,.141),nightAmount);
    float edge=pow(length((uv-.5)*vec2(1.0,1.05)),1.7);
    base=mix(base,vec3(.031,.165,.192),edge*.5*(1.-nightAmount));
    base*=1.+floorNoise*.055;
    vec3 light=mix(vec3(.961,.937,.878),vec3(.878,.690,.290),season.z*.4);
    float strength=(1.+season.y*.25-season.w*.4)*(1.-nightAmount*.95)*(1.-rainAmount*.65);
    base+=light*(a*.065+b*.026+a*b*.08)*strength;
    gl_FragColor=vec4(base*(1.-rainAmount*.08),1.);
}`;

export function createWater(state, random, ripples)
{
    let canvas = document.querySelector("#water");
    let gl = null;
    let context = null;
    let program;
    let uniforms;
    let fallbackTiles;
    const ringData = new Float32Array(24 * 4);
    try
    {
        gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
        if (gl)
        {
            const shader = (type, text) =>
            {
                const s = gl.createShader(type);
                gl.shaderSource(s, text);
                gl.compileShader(s);
                if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw Error("Shader unavailable");
                return s;
            };
            program = gl.createProgram();
            gl.attachShader(program, shader(gl.VERTEX_SHADER, "attribute vec2 position;varying vec2 uv;void main(){uv=position*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(position,0.,1.);}"));
            gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Water unavailable");
            state.webglCompiled = true;
            gl.useProgram(program);
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
            const position = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(position);
            gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            uniforms = Object.fromEntries(["resolution", "time", "season", "nightAmount", "rainAmount", "rings"].map((n) => [n, gl.getUniformLocation(program, n)]));
            const debug = gl.getExtension("WEBGL_debug_renderer_info");
            const renderer = debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : "";
            if (/swiftshader|llvmpipe|software/i.test(renderer))
            {
                state.waterFallbackReason = "Software WebGL renderer; use the lower-power Canvas water.";
                gl = null;
            }
        }
    }
    catch
    {
        gl = null;
    }
    function fallback()
    {
        if (!context)
        {
            const next = canvas.cloneNode();
            canvas.replaceWith(next);
            canvas = next;
            context = canvas.getContext("2d", { alpha: false });
        }
        fallbackTiles = [1, 1.06, 0.96].map((scale) =>
        {
            const tile = document.createElement("canvas");
            tile.width = tile.height = 360;
            const c = tile.getContext("2d");
            c.strokeStyle = p.cream;
            c.lineWidth = 0.8;
            const points = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => ({ x: 18 + random() * 54, y: 18 + random() * 54 })));
            const site = (x, y) =>
            {
                const q = points[(y + 40) % 4][(x + 40) % 4];
                return { x: x * 90 + q.x, y: y * 90 + q.y };
            };
            c.scale(scale, scale);
            for (let y = -1; y <= 4; y++)
            {
                for (let x = -1; x <= 4; x++)
                {
                    const a = site(x, y);
                    let polygon = [{ x: a.x - 180, y: a.y - 180 }, { x: a.x + 180, y: a.y - 180 }, { x: a.x + 180, y: a.y + 180 }, { x: a.x - 180, y: a.y + 180 }];
                    for (let j = -1; j <= 1; j++)
                    {
                        for (let i = -1; i <= 1; i++)
                        {
                            if (!i && !j) continue;
                            const b = site(x + i, y + j);
                            const nx = b.x - a.x;
                            const ny = b.y - a.y;
                            const limit = (b.x * b.x + b.y * b.y - a.x * a.x - a.y * a.y) / 2;
                            const next = [];
                            for (let k = 0; k < polygon.length; k++)
                            {
                                const q = polygon[k];
                                const r = polygon[(k + 1) % polygon.length];
                                const dq = q.x * nx + q.y * ny - limit;
                                const dr = r.x * nx + r.y * ny - limit;
                                if (dq <= 0) next.push(q);
                                if ((dq <= 0) !== (dr <= 0))
                                {
                                    const t = dq / (dq - dr);
                                    next.push({ x: q.x + (r.x - q.x) * t, y: q.y + (r.y - q.y) * t });
                                }
                            }
                            polygon = next;
                        }
                    }
                    c.beginPath();
                    polygon.forEach((q, i) => { if (!i) c.moveTo(q.x, q.y); else c.lineTo(q.x, q.y); });
                    c.closePath();
                    c.stroke();
                }
            }
            return tile;
        });
        state.renderer = "canvas2d";
        resize();
    }
    function resize()
    {
        const ratio = gl ? Math.min(devicePixelRatio || 1, tiers[state.tier].water) : 1;
        canvas.width = Math.round(state.w * ratio);
        canvas.height = Math.round(state.h * ratio);
        if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
    }
    if (!gl) fallback();
    else
    {
        state.renderer = "webgl";
        canvas.addEventListener("webglcontextlost", (event) =>
        {
            event.preventDefault();
            gl = null;
            fallback();
        });
    }
    return {
        resize,
        draw()
        {
            const t = state.time * (state.reduced ? 0.25 : 1);
            if (gl)
            {
                gl.uniform2f(uniforms.resolution, state.w, state.h);
                gl.uniform1f(uniforms.time, t);
                gl.uniform4fv(uniforms.season, state.seasonMix);
                gl.uniform1f(uniforms.nightAmount, state.night);
                gl.uniform1f(uniforms.rainAmount, state.rain);
                ringData.fill(0);
                let i = 0;
                for (const r of ripples.rings)
                {
                    if (!r.active || r.age < 0 || i >= 24) continue;
                    ringData[i * 4] = r.x;
                    ringData[i * 4 + 1] = r.y;
                    ringData[i * 4 + 2] = r.radius;
                    ringData[i * 4 + 3] = r.alpha;
                    i++;
                }
                gl.uniform4fv(uniforms.rings, ringData);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                return;
            }
            const c = context;
            c.fillStyle = `rgb(${14 - 8 * state.night}, ${59 - 31 * state.night}, ${67 - 31 * state.night})`;
            c.fillRect(0, 0, state.w, state.h);
            c.save();
            c.globalCompositeOperation = "lighter";
            c.globalAlpha = 0.10 * (1 - state.night * 0.95) * (1 - state.rain * 0.65);
            c.scale(state.u, state.u);
            for (let i = 0; i < (state.tier === "low" ? 1 : 2); i++)
            {
                const tile = fallbackTiles[i];
                const dx = (t * (i ? -8 : 5)) % 360;
                const dy = (t * (i ? 3 : -2)) % 360;
                for (let x = -360; x < state.w / state.u + 360; x += 360)
                {
                    for (let y = -360; y < state.h / state.u + 360; y += 360) c.drawImage(tile, x + dx, y + dy);
                }
            }
            c.restore();
            const vignette = c.createRadialGradient(state.w * 0.5, state.h * 0.5, 0, state.w * 0.5, state.h * 0.5, state.w * 0.7);
            vignette.addColorStop(0, "transparent");
            vignette.addColorStop(1, "#082A3180");
            c.fillStyle = vignette;
            c.fillRect(0, 0, state.w, state.h);
        }
    };
}
