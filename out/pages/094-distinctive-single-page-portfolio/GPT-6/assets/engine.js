import {projects,dictionaries} from "./content.js";
export const categories=["all","saas","civic","campus","academic","personal"];
export const language=()=>"en";
export const description=project=>project.en;
const normalize=(value)=>String(value??"").normalize("NFKC").toLocaleLowerCase("en").trim();
export function filterProjects(query="",category="all",locale="en"){
  const words=normalize(query).split(/\s+/).filter(Boolean);
  return projects.filter((project)=>(category==="all"||project.category===category)&&words.every((word)=>normalize([project.name,project.role,project.organization,project.stack.join(" "),description(project,locale),dictionaries[language(locale)][project.category]].join(" ")).includes(word)));
}
export function projectFromHash(hash){
  try{return projects.find((project)=>`#project-${project.id}`===decodeURIComponent(hash))??null;}catch{return null;}
}
export function sheetIndex(index,delta,total=2){
  if(!Number.isInteger(index)||!Number.isInteger(delta)||!Number.isInteger(total)||total<1)throw new Error("Invalid sheet navigation");
  return ((index+delta)%total+total)%total;
}
export function nextQuote(current,random,count=4){
  if(!Number.isInteger(current)||current<0||current>=count||!Number.isFinite(random)||random<0||random>=1||!Number.isInteger(count)||count<2)throw new Error("Invalid quote state");
  return (current+1+Math.floor(random*(count-1)))%count;
}
export function messageDraft(subject,message,locale="en"){
  const title=String(subject??"").trim(),body=String(message??"").trim();
  if(title.length<2||title.length>100||body.length<10||body.length>2000||/[\r\n\x00-\x1f\x7f]/.test(title)||/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(body))throw new Error("Invalid draft");
  return `UNSENT LOCAL DRAFT\nRecipient: not configured\nNothing has been sent.\n\nSubject: ${title}\n\n${body}\n`;
}
