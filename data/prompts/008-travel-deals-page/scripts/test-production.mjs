import { spawn } from "node:child_process";
import { createConnection } from "node:net";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
const require = createRequire(import.meta.url);
const port = 3108;
function listening() {
  return new Promise(resolve => {
    const socket = createConnection({host:"127.0.0.1",port});
    socket.setTimeout(700);
    socket.once("connect",()=>{socket.destroy();resolve(true);});
    socket.once("error",()=>{socket.destroy();resolve(false);});
    socket.once("timeout",()=>{socket.destroy();resolve(false);});
  });
}
if(await listening()) throw new Error("Port 3108 already has a listener; refusing reuse.");
const server=spawn(process.execPath,[require.resolve("next/dist/bin/next"),"start","-H","127.0.0.1","-p",String(port)],{cwd:process.cwd(),stdio:"inherit",env:{...process.env,NEXT_TELEMETRY_DISABLED:"1"}});
let runner;
let failure;
try {
  const deadline=Date.now()+45000;
  let ready=false;
  while(Date.now()<deadline) {
    if(server.exitCode!==null) throw new Error(`Production server exited: ${server.exitCode}`);
    try {const response=await fetch(`http://127.0.0.1:${port}`,{signal:AbortSignal.timeout(1500)});if(response.ok){ready=true;break;}}catch{}
    await delay(300);
  }
  if(!ready) throw new Error("Production startup exceeded 45 seconds.");
  runner=spawn(process.execPath,[require.resolve("@playwright/test/cli"),"test",...process.argv.slice(2)],{cwd:process.cwd(),stdio:"inherit"});
  const result=await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>{runner.kill();reject(new Error("Tests exceeded 210 seconds."));},210000);
    runner.once("error",error=>{clearTimeout(timeout);reject(error);});
    runner.once("exit",code=>{clearTimeout(timeout);resolve(code);});
  });
  if(result!==0) throw new Error(`Playwright exited ${result}`);
} catch(error) {failure=error;}
finally {
  if(runner&&runner.exitCode===null) runner.kill();
  server.kill();
  for(let i=0;i<30&&await listening();i++) await delay(200);
  if(await listening()) throw new Error(`Port ${port} still has a listener after owned PID ${server.pid} cleanup.`);
  console.log(`Owned server PID ${server.pid} stopped; port ${port} has no listener.`);
}
if(failure) {console.error(failure);process.exitCode=1;}
