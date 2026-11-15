export function startParticles(canvas)
{
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl || !gl.getExtension("EXT_color_buffer_float")) return false;
    const mobile = innerWidth <= 760;
    const size = mobile ? 128 : 512;
    const vertex = `#version 300 es
    in vec2 a;out vec2 uv;void main(){uv=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
    function program(fragment, customVertex = vertex)
    {
        function shader(type, source)
        {
            const result = gl.createShader(type);
            gl.shaderSource(result, source);
            gl.compileShader(result);
            if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(result));
            return result;
        }
        const result = gl.createProgram();
        gl.attachShader(result, shader(gl.VERTEX_SHADER, customVertex));
        gl.attachShader(result, shader(gl.FRAGMENT_SHADER, `#version 300 es\nprecision highp float;\n${fragment}`));
        gl.linkProgram(result);
        if (!gl.getProgramParameter(result, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(result));
        return result;
    }
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    function target(width, data = null)
    {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, width, width, 0, gl.RGBA, gl.FLOAT, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw Error("Float framebuffer unavailable");
        return { texture, framebuffer, width };
    }
    function pair(width, data)
    {
        return { read: target(width, data), write: target(width, data), swap() { [this.read, this.write] = [this.write, this.read]; } };
    }
    function uniforms(prog, values)
    {
        let unit = 0;
        for (const [name, value] of Object.entries(values))
        {
            const location = gl.getUniformLocation(prog, name);
            if (value?.texture)
            {
                gl.activeTexture(gl.TEXTURE0 + unit);
                gl.bindTexture(gl.TEXTURE_2D, value.texture);
                gl.uniform1i(location, unit++);
            }
            else if (Array.isArray(value))
            {
                if (value.length === 2) gl.uniform2fv(location, value);
                else gl.uniform3fv(location, value);
            }
            else gl.uniform1f(location, value);
        }
    }
    function pass(prog, output, values)
    {
        gl.disable(gl.BLEND);
        gl.useProgram(prog);
        uniforms(prog, values);
        gl.bindFramebuffer(gl.FRAMEBUFFER, output.framebuffer);
        gl.viewport(0, 0, output.width, output.width);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        const attribute = gl.getAttribLocation(prog, "a");
        gl.enableVertexAttribArray(attribute);
        gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.disableVertexAttribArray(attribute);
    }
    const common = `in vec2 uv;out vec4 color;uniform sampler2D field;uniform sampler2D velocity;uniform vec2 texel;`;
    const curl = program(`${common}void main(){float l=texture(field,uv-vec2(texel.x,0)).y;float r=texture(field,uv+vec2(texel.x,0)).y;float b=texture(field,uv-vec2(0,texel.y)).x;float t=texture(field,uv+vec2(0,texel.y)).x;color=vec4((r-l-t+b)*.5,0,0,1);}`);
    const vorticity = program(`${common}uniform sampler2D curls;void main(){float l=abs(texture(curls,uv-vec2(texel.x,0)).x);float r=abs(texture(curls,uv+vec2(texel.x,0)).x);float b=abs(texture(curls,uv-vec2(0,texel.y)).x);float t=abs(texture(curls,uv+vec2(0,texel.y)).x);vec2 f=vec2(t-b,l-r);f/=length(f)+.0001;f*=30.*texture(curls,uv).x;color=vec4(texture(field,uv).xy+f/60.,0,1);}`);
    const divergence = program(`${common}void main(){vec2 l=texture(field,uv-vec2(texel.x,0)).xy;vec2 r=texture(field,uv+vec2(texel.x,0)).xy;vec2 b=texture(field,uv-vec2(0,texel.y)).xy;vec2 t=texture(field,uv+vec2(0,texel.y)).xy;color=vec4((r.x-l.x+t.y-b.y)*.5,0,0,1);}`);
    const pressurePass = program(`${common}uniform sampler2D divergence;void main(){float l=texture(field,uv-vec2(texel.x,0)).x;float r=texture(field,uv+vec2(texel.x,0)).x;float b=texture(field,uv-vec2(0,texel.y)).x;float t=texture(field,uv+vec2(0,texel.y)).x;float d=texture(divergence,uv).x;color=vec4((l+r+b+t-d)*.25*.95,0,0,1);}`);
    const subtract = program(`${common}uniform sampler2D pressure;void main(){float l=texture(pressure,uv-vec2(texel.x,0)).x;float r=texture(pressure,uv+vec2(texel.x,0)).x;float b=texture(pressure,uv-vec2(0,texel.y)).x;float t=texture(pressure,uv+vec2(0,texel.y)).x;color=vec4(texture(field,uv).xy-vec2(r-l,t-b),0,1);}`);
    const advect = program(`${common}uniform float decay;void main(){vec2 back=uv-texture(velocity,uv).xy*texel/60.;color=texture(field,clamp(back,0.,1.))*decay;}`);
    const splat = program(`${common}uniform vec2 pointer;uniform vec3 force;uniform float aspect;void main(){vec2 delta=uv-pointer;delta.x*=aspect;float s=exp(-dot(delta,delta)/.0018);color=texture(field,uv)+vec4(force*s,0);}`);
    const init = new Float32Array(size * size * 4);
    for (let index = 0; index < size * size; index++)
    {
        const u = (index % size + .5) / size * Math.PI * 2;
        const v = (Math.floor(index / size) + .5) / size * Math.PI * 2;
        const tube = .21 + .055 * Math.sin(u * 3);
        const radius = .46 + .05 * Math.cos(u * 2);
        const x = (radius + tube * Math.cos(v)) * Math.cos(u);
        const y = (radius + tube * Math.cos(v)) * Math.sin(u);
        const z = tube * Math.sin(v) + .1 * Math.sin(u * 2);
        const ry = Math.cos(-.5) * y + Math.sin(-.5) * z;
        const rz = -Math.sin(-.5) * y + Math.cos(-.5) * z;
        init[index * 4] = .866 * x + .5 * rz + (Math.random() - .5) * .1;
        init[index * 4 + 1] = ry + (Math.random() - .5) * .1;
        init[index * 4 + 2] = -.5 * x + .866 * rz + (Math.random() - .5) * .1;
        init[index * 4 + 3] = 1;
    }
    const positions = pair(size, init);
    const velocity = pair(256);
    const density = pair(512);
    const pressure = pair(256);
    const curlTarget = target(256);
    const divergenceTarget = target(256);
    const simulate = program(`in vec2 uv;out vec4 color;uniform sampler2D position;uniform sampler2D velocity;uniform sampler2D density;uniform float time;uniform float stepSize;uniform vec2 gaze;
    float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    void main(){float u=uv.x*6.283185;float v=uv.y*6.283185;float tube=.21+.055*sin(u*3.);float radius=.46+.05*cos(u*2.);vec3 origin=vec3((radius+tube*cos(v))*cos(u),(radius+tube*cos(v))*sin(u),tube*sin(v)+.10*sin(u*2.));float a=-.5;origin.yz=mat2(cos(a),-sin(a),sin(a),cos(a))*origin.yz;origin.xz=mat2(.866,-.5,.5,.866)*origin.xz;
    vec3 pos=texture(position,uv).xyz;vec2 screen=pos.xy*.44+vec2(.51,.52);vec2 flow=texture(velocity,screen).xy;float dye=texture(density,screen).x;
    vec3 perturb=vec3(flow*.000035*min(dye,3.),0.);perturb+=vec3(sin(pos.y*8.+time),cos(pos.x*8.-time),sin(pos.z*8.+time))*.00017;
    pos+=(origin-pos)*.045*stepSize+perturb*stepSize;color=vec4(pos,hash(uv));}`);
    const drawVertex = `#version 300 es
    precision highp float;uniform sampler2D positions;uniform float size;uniform float aspect;uniform float dpr;uniform float time;uniform vec2 gaze;out float shade;out float random;
    void main(){int index=gl_VertexID;int n=int(size);vec2 uv=(vec2(index%n,index/n)+.5)/size;vec4 p=texture(positions,uv);vec3 pos=p.xyz;pos.x+=gaze.x*.06;pos.y+=gaze.y*.06;float depth=2.2-pos.z*.35;vec2 screen=pos.xy*2.65/depth;screen.x/=aspect;screen*=min(1.,aspect/.9);screen+=vec2(.03,aspect<.9?.48:.07);gl_Position=vec4(screen,0.,1.);gl_PointSize=dpr*(.8+fract(p.w*53.)*.85);shade=.35+.75*(pos.z+.4);random=p.w;}`;
    const draw = program(`in float shade;in float random;out vec4 color;uniform float time;void main(){vec2 p=gl_PointCoord*2.-1.;float r=dot(p,p);if(r>1.)discard;float sparkle=.6+.4*sin(time*4.+random*20.);vec3 ink=mix(vec3(.5),vec3(.6,.45,1.),pow(random,100.));color=vec4(ink*shade*(.6+sparkle)*(.9-r*.6),.7);}`, drawVertex);
    let pointer = [0,0];
    let previous = [0,0];
    let moved = false;
    const gaze = [0,0];
    canvas.addEventListener("pointermove", (event) =>
    {
        pointer = [event.clientX / innerWidth, 1 - event.clientY / innerHeight];
        moved = true;
    });
    canvas.addEventListener("pointerdown", (event) =>
    {
        previous = pointer = [event.clientX / innerWidth, 1 - event.clientY / innerHeight];
        moved = true;
    });
    function resize()
    {
        const dpr = Math.min(devicePixelRatio, 2);
        canvas.width = Math.floor(innerWidth * dpr);
        canvas.height = Math.floor(innerHeight * dpr);
    }
    addEventListener("resize", resize);
    resize();
    let last = performance.now();
    window.axonStats = { particles: size * size, frames: 0, splats: 0, backend: "WebGL2", pressureIterations: 5 };
    function frame(now)
    {
        const stepSize = Math.min(1.5, (now - last) / 16.667);
        last = now;
        const texel = [1 / 256, 1 / 256];
        if (moved)
        {
            const dx = (pointer[0] - previous[0]) * 500;
            const dy = (pointer[1] - previous[1]) * 500;
            pass(splat, velocity.write, { field: velocity.read, pointer, force: [dx,dy,0], aspect: innerWidth / innerHeight });
            velocity.swap();
            pass(splat, density.write, { field: density.read, pointer, force: [1,1,1], aspect: innerWidth / innerHeight });
            density.swap();
            previous = [...pointer];
            moved = false;
            window.axonStats.splats++;
        }
        pass(curl, curlTarget, { field: velocity.read, texel });
        pass(vorticity, velocity.write, { field: velocity.read, curls: curlTarget, texel });
        velocity.swap();
        pass(divergence, divergenceTarget, { field: velocity.read, texel });
        for (let index = 0; index < 5; index++)
        {
            pass(pressurePass, pressure.write, { field: pressure.read, divergence: divergenceTarget, texel });
            pressure.swap();
        }
        pass(subtract, velocity.write, { field: velocity.read, pressure: pressure.read, texel });
        velocity.swap();
        pass(advect, velocity.write, { field: velocity.read, velocity: velocity.read, texel, decay: .98 });
        velocity.swap();
        pass(advect, density.write, { field: density.read, velocity: velocity.read, texel, decay: .97 });
        density.swap();
        gaze[0] += ((pointer[0] - .5) * -1 - gaze[0]) * .05;
        gaze[1] += ((pointer[1] - .5) * 2 - gaze[1]) * .05;
        pass(simulate, positions.write, { position: positions.read, velocity: velocity.read, density: density.read, time: now / 1000, stepSize, gaze });
        positions.swap();
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.useProgram(draw);
        uniforms(draw, { positions: positions.read, size, aspect: innerWidth / innerHeight, dpr: Math.min(devicePixelRatio,2), time: now / 1000, gaze });
        gl.drawArrays(gl.POINTS, 0, size * size);
        window.axonStats.frames++;
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return true;
}
