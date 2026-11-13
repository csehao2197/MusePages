'use strict';
(() => {
  const topics=[
    {id:'productivity',name:'Productivity',count:28,color:'#2563eb',icon:'zap',subjects:['Protecting deep work','Designing a calmer week','Making priorities visible','Small habits for focused teams','Reducing work in progress','Writing useful weekly reviews','Planning around energy'],principle:'Measure meaningful outcomes, not time at a keyboard.',steps:['Name one outcome that matters this week.','Protect a shared focus block and turn off routine alerts.','Review what moved, what stalled and what to stop.']},
    {id:'engineering',name:'Engineering',count:22,color:'#7c3aed',icon:'code-2',subjects:['Small pull requests','Useful release notes','Readable technical decisions','Safer deployment habits','A healthy review queue','Reducing cycle time'],principle:'Short feedback loops make delivery more predictable.',steps:['Choose one change small enough to review in a day.','Write the intended behavior and a clear rollback path.','Review queue age before adding more work.']},
    {id:'remote-work',name:'Remote Work',count:19,color:'#059669',icon:'globe-2',subjects:['A written team agreement','Time-zone handoffs','A remote onboarding buddy','Quiet hours that work','Decisions across time zones','Building connection at a distance'],principle:'Clarity travels better than another status meeting.',steps:['Write the decision, owner and response deadline.','Use a shared source of truth instead of scattered chat.','Leave a handoff note before the next time zone starts.']},
    {id:'leadership',name:'Leadership',count:15,color:'#d97706',icon:'compass',subjects:['Better one-to-ones','Delegating decisions','Coaching with context','A useful team retrospective','Setting a clear team direction'],principle:'Give people context and room to make a decision.',steps:['Explain the outcome and the constraints, not every step.','Agree on a checkpoint before work begins.','Use the review to learn, rather than assign blame.']},
    {id:'product-updates',name:'Product Updates',count:14,color:'#dc2626',icon:'sparkles',subjects:['A calmer project inbox','A clearer weekly overview','Thoughtful notification controls','A simpler project handoff','A more useful command menu'],principle:'A useful feature reduces friction in a real workflow.',steps:['Pick a small sample project and identify one friction point.','Try the proposed workflow with fictional data.','Write down what becomes clearer and what still needs work.']},
    {id:'customer-stories',name:'Customer Stories',count:10,color:'#0891b2',icon:'users',subjects:['A studio that found its rhythm','A distributed team with one plan','An agency with clearer handoffs','A launch team that reduced noise'],principle:'A customer story is useful when it explains the process, not just the headline.',steps:['Map the old handoff and identify a specific bottleneck.','Give each transition a clear owner and exit condition.','Compare the same outcome over comparable time periods.']}
  ];
  const authors=[{name:'Sarah Chen',role:'Head of People',initials:'SC',color:'#ead6bd'},{name:'Marcus Reed',role:'Engineering Lead',initials:'MR',color:'#b8cedc'},{name:'Emma Wilson',role:'Remote Team Editor',initials:'EW',color:'#d6c6df'},{name:'Alex Rivera',role:'Product Lead',initials:'AR',color:'#bfd2be'},{name:'Jamie Park',role:'Customer Editor',initials:'JP',color:'#ead0bc'},{name:'Priya Shah',role:'Leadership Editor',initials:'PS',color:'#d4c7bc'}];
  const seed=[
    ['async-first','Async-First: 7 Rules for Teams That Ship Faster','engineering',6,1,'async','Less waiting, more making. Seven small agreements that keep decisions moving without another meeting.'],
    ['culture-of-ownership','Building a Culture of Ownership in Remote Teams','remote-work',10,2,'remote','Ownership is more than assigning a task. Build the context, trust and clear expectations that let it grow.'],
    ['february-release','What We Shipped in February 2026','product-updates',4,3,'product','A quieter inbox, clearer project views and a few thoughtful improvements to your everyday workflow.'],
    ['designlab-story','How Designlab Reduced Project Delays by 40%','customer-stories',7,4,'customer','A fictional studio story about clearer handoffs, shared context and a more considered way to plan.'],
    ['better-standups',"The Manager’s Guide to Running Better Standups",'leadership',5,5,'leadership','Make a little room for the work that matters. A practical reset for the daily check-in.'],
    ['flowline-briefs','Why We Replaced Meetings With Flowline Briefs','productivity',9,0,'briefs','A decision, a little context and a clear next step. What a useful written update can do.'],
    ['cicd-visual-guide','CI/CD for Non-Engineers: A Visual Guide','engineering',12,1,'cicd','From a small change to a safe release: a friendlier look at the pipeline behind the product.'],
    ['planning-framework','From Chaos to Clarity: Our Planning Framework','productivity',8,5,'planning','Start with the outcome, make the trade-offs visible and leave room for what you learn.'],
    ['flowline-ai','Introducing Flowline AI: Your Smart Assistant','product-updates',3,3,'ai','An editorial concept for a helpful planning assistant. A preview of the idea, not a released AI service.'],
    ['four-day-week','The 4-Day Work Week: How We Boosted Output by 23%','productivity',8,0,'featured',"After six months of experimentation, here’s what we learned about compressed schedules, async communication, and measuring what matters."]
  ];
  const articles=seed.map(([id,title,topic,minutes,author,art,excerpt],index) => ({id,title,topic,minutes,author,art,excerpt,date:`2026-03-${String(id==='four-day-week'?10:10-Math.min(index,8)).padStart(2,'0')}`,subject:title,format:minutes>=8?'guide':'article'}));
  const angles=['a practical playbook','questions worth asking','a one-week experiment','a team discussion guide'];
  for (const topic of topics) {
    let remaining=topic.count-articles.filter((article) => article.topic===topic.id).length,index=0;
    while (remaining>0) {
      const subject=topic.subjects[Math.floor(index/angles.length)],angle=angles[index%angles.length];
      articles.push({id:`${topic.id}-${index+1}`,title:`${subject}: ${angle}`,topic:topic.id,minutes:5+index%7,author:topics.indexOf(topic)%authors.length,art:{productivity:'planning',engineering:'async','remote-work':'remote',leadership:'leadership','product-updates':'product','customer-stories':'customer'}[topic.id],excerpt:`${topic.principle} A focused editorial brief with a small experiment your team can adapt.`,date:`2026-02-${String(28-index%25).padStart(2,'0')}`,subject,format:index%3===0?'guide':'article'});
      index++;remaining--;
    }
  }
  const featured=articles.find((article) => article.id==='four-day-week');
  const lessons=[
    ['Start with an outcome','Choose one observable change your team wants to make. “Ship the onboarding guide” is clearer than “work on onboarding”.','outcome'],
    ['Make the work visible','Break the outcome into small, reviewable tasks. A shared board is a conversation aid, not a surveillance tool.','board'],
    ['Give each task an owner','Name one person accountable for moving the task forward. Add a clear handoff, not a long list of watchers.','owner'],
    ['Leave useful context','Write the decision, the reason and the next step. Make it possible for a teammate in another time zone to continue.','context'],
    ['Protect the focus','Keep work in progress small. Finish or deliberately pause something before starting another item.','focus'],
    ['Close the loop','Compare the outcome with the original goal. Keep one useful habit, change one friction point and plan the next experiment.','review'],
    ['Try a small week','Pick one project, one written update and one review. Try the smallest version of the process before spreading it.','week'],
    ['Take the next step','Download the original playbook or scorecard. This is a fictional product lesson, not a claim about a live Flowline service.','finish']
  ];
  window.flowlineContent={topics,authors,articles,featured,lessons};
})();
