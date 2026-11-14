const triangleVertices=[[0,1.3,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,-1.3,0]];
const triangles=[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]];
export function createGeometry(canvas,onMode){
  let gl;
  try{gl=canvas.getContext("webgl",{antialias:false,preserveDrawingBuffer:true});}catch{}
  if(!gl){onMode(false);return {rotate(){},reset(){},get turns(){return 0;}};}
  const shader=(type,source)=>{const item=gl.createShader(type);gl.shaderSource(item,source);gl.compileShader(item);if(!gl.getShaderParameter(item,gl.COMPILE_STATUS))throw new Error("Geometry shader unavailable");return item;};
  const program=gl.createProgram();
  gl.attachShader(program,shader(gl.VERTEX_SHADER,"attribute vec3 p;attribute vec3 c;uniform float turn;uniform float aspect;varying vec3 color;void main(){float a=turn;vec3 q=vec3(p.x*cos(a)+p.z*sin(a),p.y,-p.x*sin(a)+p.z*cos(a));float b=-0.35;vec3 r=vec3(q.x,q.y*cos(b)-q.z*sin(b),q.y*sin(b)+q.z*cos(b));float depth=4.0-r.z;gl_Position=vec4(r.x*2.7/aspect,r.y*2.7,depth-1.0,depth);color=c;}"));
  gl.attachShader(program,shader(gl.FRAGMENT_SHADER,"precision mediump float;varying vec3 color;void main(){gl_FragColor=vec4(color,1.0);}"));
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error("Geometry program unavailable");
  gl.useProgram(program);
  const positions=[],colors=[];
  triangles.forEach((face,index)=>face.forEach((vertex)=>{
    positions.push(...triangleVertices[vertex]);
    colors.push(...[[.66,.61,.90],[.83,.80,.99],[.42,.37,.67],[.55,.50,.80],[.72,.80,.39],[.52,.62,.20],[.34,.40,.16],[.73,.79,.43]][index]);
  }));
  for(const [name,data]of [["p",positions],["c",colors]]){
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    const location=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,3,gl.FLOAT,false,0,0);
  }
  const turn=gl.getUniformLocation(program,"turn"),aspect=gl.getUniformLocation(program,"aspect");
  let step=1,start=null;
  const draw=()=>{
    const dpr=Math.min(window.devicePixelRatio||1,2),box=canvas.getBoundingClientRect();
    canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));
    gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.91,.90,.85,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);
    gl.uniform1f(turn,step*Math.PI/4);gl.uniform1f(aspect,canvas.width/canvas.height);gl.drawArrays(gl.TRIANGLES,0,positions.length/3);canvas.dataset.turn=String(step);
  };
  canvas.addEventListener("pointerdown",(event)=>{start=event.clientX;canvas.setPointerCapture(event.pointerId);});
  canvas.addEventListener("pointerup",(event)=>{if(start!==null&&Math.abs(event.clientX-start)>12){step+=(event.clientX>start?1:-1);draw();}start=null;});
  canvas.addEventListener("pointercancel",()=>{start=null;});
  canvas.addEventListener("webglcontextlost",(event)=>{event.preventDefault();onMode(false);});
  canvas.addEventListener("webglcontextrestored",()=>window.location.reload());
  new ResizeObserver(draw).observe(canvas);draw();onMode(true);
  return {rotate(){step++;draw();},reset(){step=1;draw();},get turns(){return step;}};
}
