"use strict";
const form=document.querySelector("#interest-form"),receipt=document.querySelector("#interest-receipt");
const now=new Date();
form.elements.date.min=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
form.addEventListener("input",event=>event.target.setCustomValidity?.(""));
form.addEventListener("submit",event=>{
  event.preventDefault();const data=new FormData(form),name=data.get("name").trim(),email=data.get("email").trim(),date=data.get("date");
  if(name.length<2){form.elements.name.setCustomValidity("Enter at least two non-whitespace name characters.");form.elements.name.reportValidity();return;}
  const now=new Date(),today=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  if(date<today){form.elements.date.setCustomValidity("Choose today or a future date for this local preview.");form.elements.date.reportValidity();return;}
  receipt.hidden=false;receipt.querySelector(".interest-name").textContent=name;receipt.querySelector(".interest-summary").textContent=`${document.body.dataset.property} · ${email} · desired move-in ${date}`;
  form.reset();receipt.setAttribute("tabindex","-1");receipt.focus();
});
document.querySelector("#clear-interest").addEventListener("click",()=>{receipt.hidden=true;receipt.querySelector(".interest-name").textContent="";receipt.querySelector(".interest-summary").textContent="";form.elements.name.focus();});
