'use strict';
(() => {
  const cohorts=[{label:'1–10 people',max:10},{label:'11–50 people',max:50},{label:'51–200 people',max:200},{label:'201–500 people',max:500},{label:'500+ people',max:100000}];
  const industries={
    services:{label:'Professional services',recovery:.6},
    technology:{label:'Technology',recovery:.65},
    retail:{label:'Retail & e-commerce',recovery:.5},
    health:{label:'Healthcare administration',recovery:.45},
    finance:{label:'Financial services',recovery:.55},
    other:{label:'Other',recovery:.5}
  };
  const defaults={cohort:1,industry:'services',hours:6,rate:42,tools:240,team:8,goals:['time','cost']};
  function validate(input) {
    if (!input || !Number.isInteger(input.cohort) || !cohorts[input.cohort]) return 'Choose a company-size range.';
    if (!Object.hasOwn(industries,input.industry)) return 'Choose a listed industry.';
    const limits={hours:[0,80,.5],rate:[0,500,.01],tools:[0,1000000,.01],team:[1,cohorts[input.cohort].max,1]};
    for (const [key,[min,max,step]] of Object.entries(limits)) {
      const value=input[key];
      if (typeof value!=='number' || !Number.isFinite(value) || value<min || value>max || Math.abs(value/step-Math.round(value/step))>1e-6) return `Check ${key}: use ${min} to ${max} in steps of ${step}.`;
    }
    if (!Array.isArray(input.goals) || input.goals.some((goal) => !['time','cost','accuracy','scale'].includes(goal)) || new Set(input.goals).size!==input.goals.length) return 'Choose valid priorities.';
    return '';
  }
  function calculate(input,scenario) {
    const error=validate(input); if (error) throw Error(error);
    const plan=input.cohort===0?{name:'Relay Starter',seat:29,minimum:3}:input.cohort<=2?{name:'Relay Team',seat:25,minimum:10}:{name:'Relay Scale',seat:22,minimum:25};
    const recovery=scenario?.recovery ?? industries[input.industry].recovery;
    const consolidation=scenario?.consolidation ?? .7;
    if (![recovery,consolidation].every((n) => Number.isFinite(n) && n>=0 && n<=1)) throw Error('Scenario fractions must be between zero and one.');
    const annualHours=input.hours*input.team*52, labor=annualHours*input.rate, tools=input.tools*12;
    const timeSaved=annualHours*recovery, laborSaved=timeSaved*input.rate, toolsSaved=tools*consolidation;
    const seats=Math.max(input.team,plan.minimum), subscription=seats*plan.seat*12, setup=2400, investment=subscription+setup;
    const gross=laborSaved+toolsSaved, current=labor+tools, net=gross-investment, projected=current-net;
    const monthlyNet=(gross-subscription)/12, payback=monthlyNet>0?setup/monthlyNet:null;
    return {plan,seats,recovery,consolidation,annualHours,labor,tools,timeSaved,laborSaved,toolsSaved,subscription,setup,investment,gross,current,net,projected,roi:net/investment*100,monthlyNet,payback,remainingLabor:labor-laborSaved,remainingTools:tools-toolsSaved,timeline:Array.from({length:13},(_,month) => ({month,value:monthlyNet*month-setup}))};
  }
  window.relayCalculator={cohorts,industries,defaults,validate,calculate};
})();
