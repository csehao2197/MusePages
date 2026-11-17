const radians = Math.PI / 180;
const mix = (a, b, t) => a + (b - a) * t;
const logMix = (a, b, t) => Math.exp(mix(Math.log(a), Math.log(b), t));
const sub = (a, b) => a.map((v, i) => v - b[i]);
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => a.map(v => v / Math.hypot(...a));

export class SolarScene
{
    constructor(canvas, bodies)
    {
        this.canvas = canvas;
        this.bodies = bodies;
        this.gl = canvas.getContext("webgl2", { antialias: true, alpha: false, powerPreference: "high-performance" });
        if (!this.gl)
        {
            return;
        }
        this.scale = 0;
        this.targetScale = 0;
        this.azimuth = .4;
        this.elevation = .62;
        this.zoom = 1;
        this.focus = null;
        this.cameraTarget = [0, 0, 0];
        this.cameraDistance = 205;
        this.reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
        const gl = this.gl;
        const vertex = `#version 300 es
            precision highp float;
            in vec3 position;
            uniform mat4 projection;
            uniform mat4 view;
            uniform vec3 center;
            uniform float radius;
            uniform float spin;
            uniform float tilt;
            out vec3 normal;
            out vec3 localPosition;
            out vec3 worldPosition;
            void main()
            {
                localPosition = position;
                float c = cos(spin), s = sin(spin);
                vec3 p = vec3(c * position.x + s * position.z, position.y, -s * position.x + c * position.z);
                p = vec3(cos(tilt) * p.x - sin(tilt) * p.y, sin(tilt) * p.x + cos(tilt) * p.y, p.z);
                normal = normalize(p);
                worldPosition = p * radius + center;
                gl_Position = projection * view * vec4(worldPosition, 1.0);
            }`;
        const fragment = `#version 300 es
            precision highp float;
            in vec3 normal;
            in vec3 localPosition;
            in vec3 worldPosition;
            uniform vec3 color;
            uniform int recipe;
            uniform bool luminous;
            uniform bool flatColor;
            out vec4 outputColor;
            float field(vec3 p)
            {
                return sin(p.x * 17.0 + sin(p.z * 11.0)) * sin(p.y * 13.0 + p.z * 8.0) + .4 * sin(p.x * 39.0 + p.y * 27.0);
            }
            void main()
            {
                if (flatColor)
                {
                    outputColor = vec4(color, 1.0);
                    return;
                }
                vec3 n = normalize(normal);
                vec3 p = localPosition;
                float grain = field(p);
                vec3 surface = color;
                if (recipe == 0)
                {
                    surface *= .9 + .12 * grain;
                }
                if (recipe == 1)
                {
                    surface *= .75 + .2 * grain;
                }
                if (recipe == 2)
                {
                    float bands = sin(p.y * 40.0 + sin(p.z * 8.0) * .5);
                    surface *= .83 + .15 * bands + .03 * grain;
                }
                if (recipe == 3)
                {
                    float land = sin(p.x * 5.0 + p.y * 3.0) + sin(p.y * 9.0 - p.z * 5.0) + .3 * grain;
                    surface = land > .48 ? vec3(.32, .43, .29) : vec3(.07, .27, .47);
                    if (abs(p.y) > .9) surface = vec3(.82, .88, .85);
                    float clouds = sin(p.x * 28.0 + sin(p.z * 19.0) + p.y * 23.0);
                    surface = mix(surface, vec3(.86), max(0.0, clouds - .58) * .65);
                }
                float light = luminous ? 1.1 : .16 + .84 * max(0.0, dot(n, normalize(-worldPosition)));
                outputColor = vec4(pow(surface * light, vec3(.86)), 1.0);
            }`;
        const compile = (type, source) =>
        {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
            {
                throw Error(gl.getShaderInfoLog(shader));
            }
            return shader;
        };
        this.program = gl.createProgram();
        gl.attachShader(this.program, compile(gl.VERTEX_SHADER, vertex));
        gl.attachShader(this.program, compile(gl.FRAGMENT_SHADER, fragment));
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        {
            throw Error(gl.getProgramInfoLog(this.program));
        }
        gl.useProgram(this.program);
        this.u = Object.fromEntries(["projection", "view", "center", "radius", "spin", "tilt", "color", "recipe", "luminous", "flatColor"].map(k => [k, gl.getUniformLocation(this.program, k)]));
        this.attribute = gl.getAttribLocation(this.program, "position");
        const sphere = [];
        const point = (lat, lon) => [Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)];
        for (let y = 0; y < 32; y++)
        {
            for (let x = 0; x < 64; x++)
            {
                const a = -Math.PI / 2 + y * Math.PI / 32;
                const b = a + Math.PI / 32;
                const c = x * Math.PI / 32;
                const d = c + Math.PI / 32;
                sphere.push(...point(a, c), ...point(b, c), ...point(b, d), ...point(a, c), ...point(b, d), ...point(a, d));
            }
        }
        this.sphere = this.buffer(sphere);
        const orbit = [];
        for (let i = 0; i <= 256; i++)
        {
            orbit.push(Math.cos(i * Math.PI / 128), 0, Math.sin(i * Math.PI / 128));
        }
        this.orbit = this.buffer(orbit);
        const rings = [];
        for (let i = 0; i < 180; i++)
        {
            const a = i * Math.PI / 90;
            const b = (i + 1) * Math.PI / 90;
            const p = (r, angle) => [r * Math.cos(angle), 0, r * Math.sin(angle)];
            rings.push(...p(1.35, a), ...p(2.3, a), ...p(2.3, b), ...p(1.35, a), ...p(2.3, b), ...p(1.35, b));
        }
        this.rings = this.buffer(rings);
        const stars = [];
        let seed = 814;
        for (let i = 0; i < 420; i++)
        {
            seed = (seed * 1664525 + 1013904223) >>> 0;
            const x = seed / 4294967296;
            seed = (seed * 1664525 + 1013904223) >>> 0;
            stars.push((x * 2 - 1) * 1.4, (seed / 4294967296 * 2 - 1) * 1.4, 0);
        }
        this.stars = this.buffer(stars);
        gl.enable(gl.DEPTH_TEST);
        this.bindControls();
        canvas.dataset.renderer = "webgl2";
    }

    buffer(values)
    {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(values), gl.STATIC_DRAW);
        return { buffer, count: values.length / 3 };
    }

    drawBuffer(mesh, mode)
    {
        const gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.buffer);
        gl.enableVertexAttribArray(this.attribute);
        gl.vertexAttribPointer(this.attribute, 3, gl.FLOAT, false, 0, 0);
        gl.drawArrays(mode, 0, mesh.count);
    }

    bindControls()
    {
        let start = null;
        let moved = false;
        this.canvas.addEventListener("pointerdown", event =>
        {
            start = [event.clientX, event.clientY];
            moved = false;
            this.canvas.setPointerCapture(event.pointerId);
        });
        this.canvas.addEventListener("pointermove", event =>
        {
            if (!start)
            {
                return;
            }
            const dx = event.clientX - start[0];
            const dy = event.clientY - start[1];
            if (Math.abs(dx) + Math.abs(dy) > 2)
            {
                moved = true;
            }
            this.azimuth -= dx * .006;
            this.elevation = Math.max(.12, Math.min(1.4, this.elevation + dy * .005));
            start = [event.clientX, event.clientY];
        });
        const end = event =>
        {
            if (start && !moved && this.projected)
            {
                const match = this.projected.map((p, index) => ({ index, delta: Math.hypot(p.x - event.clientX, p.y - event.clientY), radius: p.radius }))
                    .filter(p => p.delta < Math.max(13, p.radius + 5)).sort((a, b) => a.delta - b.delta)[0];
                if (match)
                {
                    this.onSelect?.(match.index);
                }
            }
            start = null;
        };
        this.canvas.addEventListener("pointerup", end);
        this.canvas.addEventListener("pointercancel", () => { start = null; });
        this.canvas.addEventListener("wheel", event =>
        {
            if (document.body.classList.contains("touring"))
            {
                return;
            }
            event.preventDefault();
            this.zoom = Math.max(.45, Math.min(4, this.zoom * Math.exp(event.deltaY * .001)));
        }, { passive: false });
        this.canvas.addEventListener("keydown", event =>
        {
            if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "+", "=", "-"].includes(event.key))
            {
                event.preventDefault();
                if (event.key === "ArrowLeft") this.azimuth -= .12;
                if (event.key === "ArrowRight") this.azimuth += .12;
                if (event.key === "ArrowUp") this.elevation = Math.min(1.4, this.elevation + .1);
                if (event.key === "ArrowDown") this.elevation = Math.max(.12, this.elevation - .1);
                if (event.key === "+" || event.key === "=") this.zoom = Math.max(.45, this.zoom * .85);
                if (event.key === "-") this.zoom = Math.min(4, this.zoom / .85);
            }
        });
    }

    geometry(body, days)
    {
        const radius = logMix(body.radius, body.diameterKm / this.bodies[0].diameterKm * 5, this.scale);
        const distance = body.distance === 0 ? 0 : logMix(body.distance, body.distanceKm / this.bodies[0].diameterKm * 10, this.scale);
        const angle = body.startAngleDeg * radians + (body.orbitDays ? days / body.orbitDays * Math.PI * 2 : 0);
        return { radius, distance, center: [Math.cos(angle) * distance, 0, Math.sin(angle) * distance] };
    }

    render(days, dt)
    {
        if (!this.gl)
        {
            return [];
        }
        const gl = this.gl;
        const w = innerWidth;
        const h = innerHeight;
        const dpr = Math.min(devicePixelRatio, matchMedia("(pointer: coarse)").matches ? 1.5 : 2);
        if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr))
        {
            this.canvas.width = Math.round(w * dpr);
            this.canvas.height = Math.round(h * dpr);
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
        const smoothing = this.reduced ? 1 : 1 - Math.exp(-dt * 5);
        this.scale = mix(this.scale, this.targetScale, smoothing);
        if (Math.abs(this.scale - this.targetScale) < .00001) this.scale = this.targetScale;
        const geometry = this.bodies.map(body => this.geometry(body, days));
        const focused = this.focus === null ? null : geometry[this.focus];
        const desiredTarget = focused ? focused.center : [0, 0, 0];
        const desiredDistance = (focused ? focused.radius * (this.bodies[this.focus].rings ? 12 : 9) : logMix(w < 761 ? 600 : 205, 72000, this.scale)) * this.zoom;
        this.cameraDistance = mix(this.cameraDistance, desiredDistance, smoothing);
        this.cameraTarget = this.cameraTarget.map((v, i) => mix(v, desiredTarget[i], smoothing));
        const t = this.cameraTarget;
        const d = this.cameraDistance;
        const eye = [t[0] + d * Math.cos(this.elevation) * Math.sin(this.azimuth), t[1] + d * Math.sin(this.elevation), t[2] + d * Math.cos(this.elevation) * Math.cos(this.azimuth)];
        const z = unit(sub(eye, t));
        const x = unit(cross([0, 1, 0], z));
        const y = cross(z, x);
        const view = [x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0, -dot(x, eye), -dot(y, eye), -dot(z, eye), 1];
        const f = 1 / Math.tan(42 * radians / 2);
        const near = Math.max(.0001, d / 10000);
        const far = Math.max(1000, d * 100);
        const shiftX = w < 761 ? 0 : .10;
        const shiftY = w < 761 ? -.08 : .02;
        const projection = [f / (w / h), 0, 0, 0, 0, f, 0, 0, shiftX, shiftY, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0];
        gl.clearColor(.0196, .0275, .051, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.program);
        const identity = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        gl.uniformMatrix4fv(this.u.projection, false, identity);
        gl.uniformMatrix4fv(this.u.view, false, identity);
        gl.uniform3f(this.u.center, 0, 0, 0);
        gl.uniform1f(this.u.radius, 1);
        gl.uniform1f(this.u.spin, 0);
        gl.uniform1f(this.u.tilt, 0);
        gl.uniform1i(this.u.flatColor, 1);
        gl.uniform3f(this.u.color, .20, .23, .28);
        gl.disable(gl.DEPTH_TEST);
        this.drawBuffer(this.stars, gl.POINTS);
        gl.enable(gl.DEPTH_TEST);
        gl.uniformMatrix4fv(this.u.projection, false, projection);
        gl.uniformMatrix4fv(this.u.view, false, view);
        geometry.forEach((g, index) =>
        {
            if (index === 0) return;
            gl.uniform1f(this.u.radius, g.distance);
            gl.uniform3f(this.u.color, .115, .139, .17);
            this.drawBuffer(this.orbit, gl.LINE_STRIP);
        });
        this.projected = geometry.map((g, index) =>
        {
            const body = this.bodies[index];
            const color = body.color.match(/\w\w/g).map(v => parseInt(v, 16) / 255);
            gl.uniform3fv(this.u.center, g.center);
            gl.uniform1f(this.u.radius, g.radius);
            gl.uniform1f(this.u.spin, days * 24 / body.rotationHours * Math.PI * 2);
            gl.uniform1f(this.u.tilt, (body.rotationHours < 0 ? 180 - body.tiltDeg : body.tiltDeg) * radians);
            gl.uniform3fv(this.u.color, color);
            gl.uniform1i(this.u.recipe, body.surface);
            gl.uniform1i(this.u.flatColor, 0);
            gl.uniform1i(this.u.luminous, index === 0 ? 1 : 0);
            this.drawBuffer(this.sphere, gl.TRIANGLES);
            if (body.rings)
            {
                gl.uniform1i(this.u.flatColor, 1);
                gl.uniform3f(this.u.color, .42, .38, .29);
                gl.uniform1f(this.u.spin, 0);
                this.drawBuffer(this.rings, gl.TRIANGLES);
            }
            const relative = sub(g.center, eye);
            const depth = -dot(relative, z);
            return {
                x: (dot(relative, x) * f / (w / h) / depth - shiftX + 1) * w / 2,
                y: (1 - dot(relative, y) * f / depth + shiftY) * h / 2,
                radius: g.radius * f / depth * h / 2,
                depth
            };
        });
        this.canvas.dataset.scale = this.scale.toFixed(5);
        this.canvas.dataset.azimuth = this.azimuth.toFixed(3);
        this.canvas.dataset.zoom = this.zoom.toFixed(3);
        return this.projected;
    }
}
