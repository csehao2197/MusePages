import {writeFile} from "node:fs/promises";
import {chromium} from "@playwright/test";
const browser=await chromium.launch();
try{
  const page=await browser.newPage();
  await page.setContent('<canvas width="960" height="540"></canvas>');
  const bytes=await page.evaluate(async()=>{
    const canvas=document.querySelector("canvas"),ctx=canvas.getContext("2d"),stream=canvas.captureStream(30);
    const recorder=new MediaRecorder(stream,{mimeType:"video/webm;codecs=vp9",videoBitsPerSecond:1800000}),chunks=[];
    recorder.ondataavailable=event=>{if(event.data.size)chunks.push(event.data);};
    const stopped=new Promise(resolve=>recorder.onstop=resolve);
    function frame(time){
      ctx.fillStyle="#121911";ctx.fillRect(0,0,960,540);
      const light=ctx.createRadialGradient(660+Math.sin(time)*90,210,0,700,220,460);
      light.addColorStop(0,"#655333");light.addColorStop(1,"#121911");ctx.fillStyle=light;ctx.fillRect(0,0,960,540);
      ctx.strokeStyle="#64704a";ctx.lineWidth=1;ctx.strokeRect(44,34,872,472);
      ctx.globalAlpha=.4;ctx.beginPath();ctx.arc(480,270,165+Math.sin(time)*9,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
      ctx.textAlign="center";ctx.fillStyle="#b5ac89";ctx.font="12px Arial";ctx.fillText("AN ORIGINAL TITLE STUDY",480,197);
      ctx.fillStyle="#e1d3ae";ctx.font="italic 61px Georgia";ctx.fillText("A chapter,",480,280);ctx.fillText("a light.",480,350);
      ctx.fillStyle="#85916c";ctx.font="11px Arial";ctx.fillText("LENTERA / SILENT MOTION STUDY / 6 SECONDS",480,425);
      ctx.fillStyle="#b5ac89";ctx.fillRect(44,502,872*Math.min(time/6,1),2);
    }
    frame(0);recorder.start();
    const start=performance.now();
    await new Promise(resolve=>{function tick(now){const elapsed=(now-start)/1000;frame(elapsed);if(elapsed<6)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});
    recorder.stop();await stopped;stream.getTracks().forEach(track=>track.stop());
    return Array.from(new Uint8Array(await new Blob(chunks,{type:"video/webm"}).arrayBuffer()));
  });
  await writeFile(new URL("assets/opening.webm",import.meta.url),Buffer.from(bytes));
  console.log("Created original six-second English-only title animation.");
}finally{await browser.close();}
