export const PLATFORMS=["windows","macos","ios","android","linux"],DAY=86400000;
export function fail(code){throw Object.assign(Error(code),{code});}
export async function digest(value){return [...new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))].map((n)=>n.toString(16).padStart(2,"0")).join("");}
export async function initial(now=Date.now()){
  const hash=await digest("Demo-pass-42!");
  return {users:[{id:"alex",name:"alex_sample",hash,enabled:true},{id:"raya",name:"raya_sample",hash,enabled:true}],invites:[{code:"JOINDEMO",expires:now+30*DAY,usedBy:null},{code:"PASTDEMO",expires:now-DAY,usedBy:null}],devices:[{id:"a11ce001-0000-4000-8000-000000000001",user:"alex",name:"Everyday laptop",platform:"macos",revision:1,active:true,address:2},{id:"a11ce002-0000-4000-8000-000000000002",user:"alex",name:"Pocket companion",platform:"ios",revision:1,active:true,address:3}],session:null,failures:[]};
}
export function requireUser(state){const user=state.users.find((u)=>u.id===state.session);if(!user?.enabled)fail("ERR_SESSION");return user;}
export function rate(state,now=Date.now()){state.failures=state.failures.filter((at)=>now-at<60000);if(state.failures.length>=5)fail("ERR_RATE");state.failures.push(now);}
export async function register(state,{code,name,password},now=Date.now()){
  rate(state,now);code=code.trim().toUpperCase();name=name.trim().toLowerCase();
  if(!/^[a-z][a-z0-9_]{2,23}$/.test(name))fail("ERR_NAME");
  if(state.users.some((u)=>u.name===name))fail("ERR_TAKEN");
  if(password.length<12||password.length>72||!/[A-Z]/.test(password)||!/[a-z]/.test(password)||!/\d/.test(password)||!/[^\w\s]/.test(password))fail("ERR_PASSWORD");
  const invite=state.invites.find((i)=>i.code===code);if(!invite||invite.usedBy||invite.expires<=now)fail("ERR_INVITE");
  if(state.users.length>=50)fail("ERR_USER_LIMIT");
  const started=performance.now(),hash=await digest(password);
  if(invite.usedBy||invite.expires<=now+performance.now()-started)fail("ERR_INVITE");
  if(state.users.some((u)=>u.name===name))fail("ERR_TAKEN");
  if(state.users.length>=50)fail("ERR_USER_LIMIT");
  const user={id:crypto.randomUUID(),name,hash,enabled:true};state.users.push(user);invite.usedBy=user.id;state.session=user.id;return user;
}
export async function login(state,name,password,now=Date.now()){rate(state,now);const hash=await digest(password),user=state.users.find((u)=>u.name===name.trim().toLowerCase()&&u.hash===hash);if(!user)fail("ERR_LOGIN");if(!user.enabled)fail("ERR_DISABLED");state.session=user.id;return user;}
export function addDevice(state,{name,platform}){
  const user=requireUser(state);name=name.trim();if(name.length<2||name.length>40)fail("ERR_DEVICE_NAME");if(!PLATFORMS.includes(platform))fail("ERR_PLATFORM");
  const own=state.devices.filter((d)=>d.user===user.id);if(own.length>=6)fail("ERR_DEVICE_LIMIT");if(own.some((d)=>d.name.toLowerCase()===name.toLowerCase()))fail("ERR_DEVICE_DUPLICATE");
  const address=Array.from({length:253},(_,i)=>i+2).find((n)=>!state.devices.some((d)=>d.address===n));if(!address)fail("ERR_POOL");
  const device={id:crypto.randomUUID(),user:user.id,name,platform,revision:1,active:true,address};state.devices.push(device);return device;
}
export function ownDevice(state,id){const user=requireUser(state),d=state.devices.find((d)=>d.id===id&&d.user===user.id);if(!d)fail("ERR_DEVICE");return d;}
export function regenerate(state,id){const d=ownDevice(state,id);if(d.revision>=999)fail("ERR_REVISION");d.revision++;d.active=true;return d;}
export function disableUser(state,id){const user=state.users.find((u)=>u.id===id);if(!user)fail("ERR_USER");user.enabled=!user.enabled;if(!user.enabled){for(const device of state.devices.filter((d)=>d.user===id))device.active=false;if(state.session===id)state.session=null;}return user;}
export function inviteCode(state,now=Date.now()){
  if(state.invites.length>=100)fail("ERR_INVITE_LIMIT");const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let code;
  do{code=[...crypto.getRandomValues(new Uint8Array(8))].map((n)=>alphabet[n&31]).join("");}while(state.invites.some((i)=>i.code===code));
  const invite={code,expires:now+30*DAY,usedBy:null};state.invites.push(invite);return invite;
}
export async function resetPassword(state,id){const user=state.users.find((u)=>u.id===id);if(!user)fail("ERR_USER");user.hash=await digest("Demo-pass-42!");if(state.session===id)state.session=null;}
export const reference=(device)=>`DEMO:${device.id.slice(0,8)}:${device.revision}`;
export function sampleText(state,id){const d=ownDevice(state,id);if(!d.active)fail("ERR_INACTIVE");return `LEIAGUARD — NON-IMPORTABLE EDUCATIONAL SAMPLE\nNO VPN ACCESS · NO VALID KEYS · NO CONNECTION\nReference: ${reference(d)}\nDevice: ${d.name}\nRevision: ${d.revision}\n\n[Interface]\nPrivateKey = NOT_A_WIREGUARD_KEY\nAddress = 192.0.2.${d.address}/32\n\n[Peer]\nPublicKey = NOT_A_WIREGUARD_KEY\nEndpoint = vpn.example.invalid:51820\nAllowedIPs = 192.0.2.0/24\n\nThis TXT is deliberately invalid. The QR encodes only the DEMO reference, not this text or a tunnel configuration. Obtain real credentials from your actual network operator. Nothing here changes a WireGuard server.\n`;}
