window.createArtwork = (canvas, variant = 0) =>
{
    const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, antialias: true });
    if (!gl) throw Error("WebGL is required to render the original artwork");
    const vertex = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, "attribute vec2 p; void main() { gl_Position = vec4(p, 0., 1.); }");
    gl.compileShader(vertex);
    const fragment = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, `
        precision highp float;
        uniform vec2 resolution;
        uniform float time;
        uniform float variant;
        mat2 rot(float a)
        {
            return mat2(cos(a), -sin(a), sin(a), cos(a));
        }
        float torus(vec3 p, vec2 t)
        {
            return length(vec2(length(p.xz) - t.x, p.y)) - t.y;
        }
        float box(vec3 p, vec3 b)
        {
            vec3 q = abs(p) - b;
            return length(max(q, 0.)) + min(max(q.x, max(q.y, q.z)), 0.);
        }
        float sculpture(vec3 p)
        {
            p.xz *= rot(time * .18);
            if (variant < .5)
            {
                p.xy *= rot(.45);
                vec3 a = p;
                a.yz *= rot(.9);
                float ringA = torus(a, vec2(1.05, .34));
                vec3 b = p - vec3(.1, .0, .0);
                b.xy *= rot(1.57);
                b.yz *= rot(-.5);
                return min(ringA, torus(b, vec2(.93, .26)));
            }
            if (variant < 1.5)
            {
                float head = length((p - vec3(0., .45, 0.)) * vec3(1., .9, 1.)) - .68;
                float body = length((p - vec3(0., -.65, 0.)) * vec3(1.1, 1.6, 1.4)) - .9;
                float earA = length(p - vec3(.72, .6, 0.)) - .22;
                float earB = length(p - vec3(-.72, .6, 0.)) - .22;
                return min(min(head, body), min(earA, earB));
            }
            if (variant < 2.5)
            {
                vec3 q = p;
                q.xz *= rot(.6);
                float d = 10.;
                for (int i = 0; i < 5; i++)
                {
                    float fi = float(i);
                    vec3 a = q - vec3((fi - 2.) * .57, -.45 + sin(fi * .8) * .35, 0.);
                    d = min(d, box(a, vec3(.22, .9 + sin(fi * .8) * .35, .4)));
                }
                return d;
            }
            if (variant < 3.5)
            {
                vec3 q = p;
                q.yz *= rot(-.2);
                float bottle = length(vec2(length(q.xz) - .45, max(abs(q.y) - .55, 0.))) - .11;
                float cap = box(q - vec3(0., .79, 0.), vec3(.34, .12, .34));
                return min(bottle, cap);
            }
            vec3 q = p;
            q.xy *= rot(.6);
            q.xz *= rot(.8);
            return torus(q, vec2(.95, .4));
        }
        float scene(vec3 p)
        {
            return min(sculpture(p), p.y + 1.55);
        }
        vec3 normal(vec3 p)
        {
            vec2 e = vec2(.001, 0.);
            return normalize(vec3(scene(p + e.xyy) - scene(p - e.xyy), scene(p + e.yxy) - scene(p - e.yxy), scene(p + e.yyx) - scene(p - e.yyx)));
        }
        vec3 environment(vec3 d)
        {
            vec3 col = mix(vec3(.045, .05, .06), vec3(.44, .48, .5), smoothstep(-.4, .9, d.y));
            float strip = pow(max(dot(d, normalize(vec3(-1., 1.5, 1.))), 0.), 18.);
            float warm = pow(max(dot(d, normalize(vec3(1., .4, -.4))), 0.), 5.);
            col += vec3(2.8, 2.6, 2.2) * strip;
            col += vec3(.9, .29, .07) * warm;
            return col;
        }
        void main()
        {
            vec2 uv = (gl_FragCoord.xy * 2. - resolution) / resolution.y;
            vec3 ro = vec3(0., .8, 5.2);
            vec3 target = vec3(0., -.1, 0.);
            vec3 ww = normalize(target - ro);
            vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
            vec3 vv = cross(uu, ww);
            vec3 rd = normalize(uv.x * uu + uv.y * vv + 3.4 * ww);
            float t = 0.;
            for (int i = 0; i < 105; i++)
            {
                float h = scene(ro + rd * t);
                if (h < .001 || t > 18.) break;
                t += h * .8;
            }
            vec3 col = vec3(.045, .048, .052) + .015 * (uv.y + 1.);
            if (t < 18.)
            {
                vec3 p = ro + rd * t;
                vec3 n = normal(p);
                vec3 l = normalize(vec3(-3., 6., 4.));
                float diffuse = max(dot(n, l), 0.);
                float ao = clamp(sculpture(p + n * .15) / .15, .12, 1.);
                if (p.y < -1.54)
                {
                    float shadow = 1.;
                    float st = .03;
                    for (int i = 0; i < 32; i++)
                    {
                        float h = sculpture(p + l * st);
                        shadow = min(shadow, 9. * h / st);
                        st += clamp(h, .025, .3);
                    }
                    col = vec3(.07, .073, .075) * (.35 + .7 * diffuse * clamp(shadow, .1, 1.));
                    col += vec3(.055, .025, .01) * exp(-length(p.xz) * .65);
                }
                else
                {
                    vec3 reflection = environment(reflect(rd, n));
                    vec3 material = variant > 2.5 && variant < 3.5 ? vec3(.38, .56, .39) : vec3(.9, .75, .59);
                    if (variant > .5 && variant < 1.5) material = vec3(.79, .37, .13);
                    if (variant > 1.5 && variant < 2.5) material = vec3(.55, .6, .69);
                    col = reflection * material * ao + material * diffuse * .1;
                    float fresnel = pow(1. - max(dot(n, -rd), 0.), 4.);
                    col += fresnel * vec3(.2, .15, .1);
                    if (variant > .5 && variant < 1.5 && p.z > .42 && p.y > .35 && p.y < .65 && abs(p.x) < .45)
                    {
                        col *= .08;
                        if (abs(abs(p.x) - .24) < .07) col += vec3(.6, 1., .78);
                    }
                }
            }
            col = pow(col / (col + vec3(.7)), vec3(.4545));
            col *= 1. - .12 * length(uv * .35);
            gl_FragColor = vec4(col, 1.);
        }
    `);
    gl.compileShader(fragment);
    if (!gl.getShaderParameter(fragment, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(fragment));
    const program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution");
    const time = gl.getUniformLocation(program, "time");
    gl.uniform1f(gl.getUniformLocation(program, "variant"), variant);
    return (seconds = 0) =>
    {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(time, seconds);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    };
};
