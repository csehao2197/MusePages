// Version 1-L, byte mode and mask 0; reference strings are at most 17 ASCII bytes.
export function qrMatrix(text){
  const bytes=new TextEncoder().encode(text);if(bytes.length>17)throw Error("QR reference exceeds version 1-L capacity.");
  const bits=[],push=(n,length)=>{for(let i=length-1;i>=0;i--)bits.push((n>>>i)&1);};
  push(4,4);push(bytes.length,8);for(const n of bytes)push(n,8);push(0,Math.min(4,152-bits.length));while(bits.length%8)bits.push(0);
  const data=[];for(let i=0;i<bits.length;i+=8)data.push(bits.slice(i,i+8).reduce((a,b)=>(a<<1)|b,0));for(let i=0;data.length<19;i++)data.push(i%2?0x11:0xec);
  const multiply=(a,b)=>{let r=0;for(let i=7;i>=0;i--){r=(r<<1)^((r>>>7)*0x11d);r^=((b>>>i)&1)*a;}return r;};
  const divisor=new Uint8Array(7);divisor[6]=1;let root=1;
  for(let i=0;i<7;i++){for(let j=0;j<7;j++){divisor[j]=multiply(divisor[j],root);if(j+1<7)divisor[j]^=divisor[j+1];}root=multiply(root,2);}
  const remainder=new Uint8Array(7);for(const b of data){const factor=b^remainder[0];remainder.copyWithin(0,1);remainder[6]=0;for(let i=0;i<7;i++)remainder[i]^=multiply(divisor[i],factor);}
  const matrix=Array.from({length:21},()=>Array(21).fill(false)),reserved=Array.from({length:21},()=>Array(21).fill(false)),set=(x,y,dark)=>{matrix[y][x]=Boolean(dark);reserved[y][x]=true;};
  for(let i=0;i<21;i++){set(6,i,i%2===0);set(i,6,i%2===0);}
  for(const [cx,cy] of [[3,3],[17,3],[3,17]])for(let y=-4;y<=4;y++)for(let x=-4;x<=4;x++){const xx=cx+x,yy=cy+y,d=Math.max(Math.abs(x),Math.abs(y));if(xx>=0&&yy>=0&&xx<21&&yy<21)set(xx,yy,d!==2&&d!==4);}
  const format=0x77c4,bit=(n)=>(format>>>n)&1;
  for(let i=0;i<6;i++)set(8,i,bit(i));set(8,7,bit(6));set(8,8,bit(7));set(7,8,bit(8));for(let i=9;i<15;i++)set(14-i,8,bit(i));
  for(let i=0;i<8;i++)set(20-i,8,bit(i));for(let i=8;i<15;i++)set(8,6+i,bit(i));set(8,13,true);
  const stream=[...data,...remainder].flatMap((b)=>Array.from({length:8},(_,i)=>(b>>>(7-i))&1));let index=0;
  for(let right=20;right>=1;right-=2){if(right===6)right=5;for(let row=0;row<21;row++){const y=((right+1)&2)===0?20-row:row;for(let j=0;j<2;j++){const x=right-j;if(!reserved[y][x])matrix[y][x]=Boolean(stream[index++]^((x+y)%2===0));}}}
  if(index!==208)throw Error("QR module allocation failed.");return matrix;
}
export function qrSvg(text){const matrix=qrMatrix(text);return `<svg xmlns="http://www.w3.org/2000/svg" width="232" height="232" viewBox="0 0 29 29" shape-rendering="crispEdges"><rect width="29" height="29" fill="white"/><path fill="#102c2b" d="${matrix.flatMap((row,y)=>row.map((dark,x)=>dark?`M${x+4} ${y+4}h1v1h-1z`:"")).join("")}"/></svg>`;}
