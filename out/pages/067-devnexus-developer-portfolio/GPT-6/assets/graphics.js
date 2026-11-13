export function startGraphics() {
  const cloud = document.querySelector("#particles");
  const sphere = document.querySelector("#skill-sphere");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const control = document.querySelector("#motion-toggle");
  let paused = reduced.matches, frame = 0, angle = .4, pitch = -.2, drag = null;
  const visible = new Set();
  const gl = cloud.getContext("webgl", {alpha:true,antialias:true,powerPreference:"low-power"});
  let program, buffer, lost = false;
  const status = document.querySelector("#graphics-status");
  if (gl) {
    try {
      const shader = (type, source) => {
        const result = gl.createShader(type);
        gl.shaderSource(result, source); gl.compileShader(result);
        if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) throw Error("Shader unavailable");
        return result;
      };
      program = gl.createProgram();
      gl.attachShader(program, shader(gl.VERTEX_SHADER, "attribute vec3 p;uniform float t;uniform float d;varying float depth;void main(){float c=cos(t),s=sin(t);vec3 q=vec3(p.x*c+p.z*s,p.y,-p.x*s+p.z*c);float y=q.y*cos(.3)-q.z*sin(.3);float z=q.y*sin(.3)+q.z*cos(.3);float k=1.65/(2.4-z);gl_Position=vec4(q.x*k,y*k,0.,1.);gl_PointSize=(1.8+1.6*(z+1.))*d;depth=(z+1.)*.5;}"));
      gl.attachShader(program, shader(gl.FRAGMENT_SHADER, "precision mediump float;varying float depth;uniform vec3 color;void main(){float r=length(gl_PointCoord-vec2(.5));if(r>.5)discard;gl_FragColor=vec4(mix(vec3(.56,.28,.9),color,depth),(.25+depth*.75)*(1.-smoothstep(.2,.5,r)));}"));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Program unavailable");
      const points = [];
      for (let i=0;i<850;i++) {const y=1-2*(i+.5)/850,r=Math.sqrt(1-y*y),a=i*2.399963;points.push(Math.cos(a)*r,y,Math.sin(a)*r);}
      buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(points),gl.STATIC_DRAW);
      cloud.dataset.renderer="webgl";status.textContent="WebGL ready";
    } catch {program=null;}
  }
  if (!program) {cloud.dataset.renderer="static";status.textContent="static fallback";}
  const ctx = sphere.getContext("2d");
  const words=["HTML","CSS","JavaScript","React","Node.js","SQL","Git","APIs","Playwright","WebGL","A11y","Design","CI/CD","TypeScript","DevTools","Systems"];
  const fit = canvas => {
    const dpr=Math.min(devicePixelRatio||1,2),w=Math.max(1,Math.round(canvas.clientWidth*dpr)),h=Math.max(1,Math.round(canvas.clientHeight*dpr));
    if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
    return dpr;
  };
  function draw(time=0,force=false) {
    const dark=document.documentElement.dataset.theme==="dark";
    if(program&&!lost&&visible.has(cloud)) {
      const dpr=fit(cloud);gl.viewport(0,0,cloud.width,cloud.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER,buffer);const p=gl.getAttribLocation(program,"p");gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,3,gl.FLOAT,false,0,0);
      gl.uniform1f(gl.getUniformLocation(program,"t"),angle);gl.uniform1f(gl.getUniformLocation(program,"d"),dpr);
      gl.uniform3f(gl.getUniformLocation(program,"color"),dark?0:.0,dark?.94:.42,dark?1:.5);
      gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.drawArrays(gl.POINTS,0,850);
    }
    if(ctx&&(force||visible.has(sphere))) {
      const dpr=fit(sphere),w=sphere.width/dpr,h=sphere.height/dpr,r=Math.min(w*.36,h*.38);
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
      const positions=words.map((word,i)=>{const y=1-2*(i+.5)/words.length,rad=Math.sqrt(1-y*y),a=i*2.399963;const x=Math.cos(a)*rad,z=Math.sin(a)*rad,x1=x*Math.cos(angle)+z*Math.sin(angle),z1=-x*Math.sin(angle)+z*Math.cos(angle);return{word,x:x1,y:y*Math.cos(pitch)-z1*Math.sin(pitch),z:y*Math.sin(pitch)+z1*Math.cos(pitch)};}).sort((a,b)=>a.z-b.z);
      ctx.strokeStyle=dark?"#00f0ff16":"#006c821a";ctx.beginPath();ctx.ellipse(w/2,h/2,r,r,0,0,Math.PI*2);ctx.stroke();
      positions.forEach(p=>{const scale=1+p.z*.23;ctx.font=`${Math.round(11*scale)}px Consolas, monospace`;ctx.fillStyle=dark?`rgba(0,240,255,${.35+(p.z+1)*.3})`:`rgba(0,90,112,${.4+(p.z+1)*.3})`;ctx.textAlign="center";ctx.fillText(p.word,w/2+p.x*r,h/2+p.y*r);});
    }
    if(time&&!paused&&!document.hidden&&visible.has(cloud)) {
      const roles=["Frontend engineer","Systems thinker","Curious by default"],step=Math.floor(time/5000)%3,part=(time%5000)/75;
      document.querySelector("#typed-role").textContent=roles[step].slice(0,Math.max(1,Math.min(roles[step].length,Math.floor(part))));
    }
  }
  let previous=0;
  function tick(time){frame=0;if(!paused&&!document.hidden&&visible.size){if(!drag)angle+=Math.min(time-previous||16,50)*.00013;previous=time;draw(time);frame=requestAnimationFrame(tick);}else draw();}
  function sync(){cancelAnimationFrame(frame);frame=0;previous=0;draw(0,true);if(!paused&&!document.hidden&&visible.size)frame=requestAnimationFrame(tick);control.textContent=paused?"Resume motion":"Pause motion";control.setAttribute("aria-pressed",String(paused));}
  const observer=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visible.add(e.target):visible.delete(e.target));sync();});
  observer.observe(cloud);observer.observe(sphere);
  control.addEventListener("click",()=>{paused=!paused;sync();});
  reduced.addEventListener("change",()=>{paused=reduced.matches;document.querySelector("#typed-role").textContent="Frontend engineer";sync();});
  document.addEventListener("visibilitychange",sync);window.addEventListener("resize",sync);
  new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  sphere.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY};sphere.setPointerCapture(e.pointerId);});
  sphere.addEventListener("pointermove",e=>{if(!drag)return;angle+=(e.clientX-drag.x)*.012;pitch=Math.max(-1.3,Math.min(1.3,pitch+(e.clientY-drag.y)*.01));drag={x:e.clientX,y:e.clientY};draw();});
  const stopDrag=()=>{drag=null;};sphere.addEventListener("pointerup",stopDrag);sphere.addEventListener("pointercancel",stopDrag);
  sphere.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))return;e.preventDefault();angle+=e.key==="ArrowLeft"?-.2:e.key==="ArrowRight"?.2:0;pitch+=e.key==="ArrowUp"?-.1:e.key==="ArrowDown"?.1:0;draw();});
  cloud.addEventListener("webglcontextlost",e=>{e.preventDefault();lost=true;cloud.dataset.renderer="static";status.textContent="static fallback";sync();});
}
