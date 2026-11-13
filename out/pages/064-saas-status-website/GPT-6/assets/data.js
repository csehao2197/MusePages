'use strict';
(() => {
  const minute=60000,day=1440*minute,end=Date.UTC(2026,2,12),snapshot=Date.UTC(2026,2,13,11,57);
  const components=[
    ['web','Web Application','monitor',['US-East frontend','EU-West frontend','AP-South frontend']],
    ['api','API (v2)','braces',['REST gateway · US-East','REST gateway · EU-West','Rate limiting']],
    ['database','Database Cluster','database',['Primary cluster','Read replicas','Backup pipeline']],
    ['storage','File Storage & CDN','hard-drive',['Object storage · US-West','CDN edge network','Upload processing']],
    ['auth','Authentication Service','lock-keyhole',['Identity gateway','Session service','Single sign-on']],
    ['webhooks','Webhooks','webhook',['Delivery workers · US-East','Delivery workers · EU-West','Event ingestion']],
    ['email','Email Delivery','mail',['Transactional queue','Delivery workers','Template rendering']],
    ['search','Search & Indexing','search',['Query service','Index workers','Index storage']],
    ['mobile','Mobile API','smartphone',['Mobile gateway · US-East','Mobile gateway · EU-West']],
    ['jobs','Background Jobs','layers',['Job scheduler','Worker pool','Queue storage']]
  ].map(([id,name,icon,parts]) => ({id,name,icon,parts}));
  const incidents=[
    {id:'api-response-times',date:'2026-03-11',component:'api',title:'Elevated API Response Times',severity:'Minor',duration:45,unavailable:8,start:'14:10',end:'14:55',summary:'A connection-pool bottleneck caused slow responses in US-East. The 45-minute response included eight minutes of sample unavailability.',updates:[['14:55','Resolved','API latency and error rates have returned to baseline.'],['14:40','Monitoring','The connection pool has been expanded. We are watching recovery.'],['14:25','Identified','Connection-pool saturation was isolated in the US-East gateway.'],['14:10','Investigating','We are investigating elevated API response times.']]},
    {id:'database-migration',date:'2026-03-08',component:'database',title:'Scheduled Maintenance: Database Migration',severity:'Maintenance',duration:120,unavailable:0,start:'02:00',end:'04:00',summary:'Planned maintenance completed successfully. No user-facing impact; observed availability remained 100%.',updates:[['04:00','Resolved','Migration and verification completed. No user-facing impact.'],['03:30','Monitoring','Replica health and consistency checks are passing.'],['02:00','In progress','The planned migration has started. Reads and writes remain available.']]},
    {id:'file-upload-failures',date:'2026-03-03',component:'storage',title:'File Upload Failures',severity:'Major',duration:80,unavailable:70,start:'10:00',end:'11:20',summary:'An upload-worker configuration caused failures for large files. Seventy unavailable sample minutes were recorded during an 80-minute incident.',updates:[['11:20','Resolved','Uploads are processing normally and the retry queue is clear.'],['11:10','Monitoring','The worker configuration has been rolled back. Upload recovery is under observation.'],['10:25','Identified','The failure was traced to an upload-worker configuration change.'],['10:00','Investigating','We are investigating reports of failed uploads.']]},
    {id:'job-queue-delay',date:'2026-02-26',component:'jobs',title:'Background Job Queue Delay',severity:'Minor',duration:35,unavailable:10,start:'15:10',end:'15:45',summary:'A worker-capacity imbalance delayed queued jobs. Capacity was redistributed.',updates:[['15:45','Resolved','Queue processing returned to baseline.'],['15:10','Investigating','Queued jobs are completing later than expected.']]},
    {id:'email-queue-delay',date:'2026-02-25',component:'email',title:'Transactional Email Queue Delay',severity:'Minor',duration:25,unavailable:10,start:'08:00',end:'08:25',summary:'A temporary queue delay affected transactional messages. No messages were lost in this fictional event.',updates:[['08:25','Resolved','Delivery delays have cleared.'],['08:00','Investigating','We are investigating a delivery-queue backlog.']]},
    {id:'mobile-gateway',date:'2026-02-19',component:'mobile',title:'Mobile Gateway Intermittent Errors',severity:'Minor',duration:30,unavailable:10,start:'12:00',end:'12:30',summary:'A gateway rollout was reversed after elevated error responses.',updates:[['12:30','Resolved','The prior gateway version is healthy.'],['12:00','Investigating','Intermittent mobile API failures are under investigation.']]},
    {id:'search-recovery',date:'2026-02-12',component:'search',title:'Search Index Recovery',severity:'Minor',duration:40,unavailable:8,start:'07:10',end:'07:50',summary:'One search index required recovery. Healthy replicas served most requests.',updates:[['07:50','Resolved','Index recovery is complete.'],['07:10','Investigating','Some searches are returning delayed results.']]},
    {id:'webhook-workers',date:'2026-02-02',component:'webhooks',title:'Webhook Worker Recovery',severity:'Major',duration:140,unavailable:100,start:'13:00',end:'15:20',summary:'A worker-pool fault required replacement capacity. The queue was drained before resolution.',updates:[['15:20','Resolved','Worker capacity and delivery latency are normal.'],['13:00','Investigating','Webhook delivery capacity is reduced.']]},
    {id:'web-edge',date:'2026-01-21',component:'web',title:'Web Application Edge Routing Issue',severity:'Major',duration:120,unavailable:100,start:'09:00',end:'11:00',summary:'A routing configuration was reverted, restoring application reachability.',updates:[['11:00','Resolved','Application access has recovered across regions.'],['09:00','Investigating','Some users cannot reach the web application.']]},
    {id:'identity-gateway',date:'2026-01-06',component:'auth',title:'Authentication Gateway Recovery',severity:'Major',duration:100,unavailable:75,start:'16:00',end:'17:40',summary:'Gateway failover restored sign-in. Existing sessions remained valid in this sample event.',updates:[['17:40','Resolved','Authentication requests are healthy again.'],['16:00','Investigating','New sign-ins are affected by gateway errors.']]}
  ];
  const active={
    webhooks:{id:'webhook-delivery',date:'2026-03-13',title:'Degraded Webhook Delivery Performance',severity:'Minor',components:['webhooks'],start:'09:42',duration:135,stage:2,updates:[['11:57','Monitoring','Webhook delivery latency has improved. We are continuing to monitor.'],['10:30','Identified','Root cause identified as elevated queue backlog in US-East region. Scaling resources.'],['09:42','Investigating','We are investigating reports of delayed webhook deliveries.']]},
    outage:{id:'regional-gateway',date:'2026-03-13',title:'US-East Regional Gateway Outage',severity:'Critical',components:['web','api','mobile'],start:'11:33',duration:24,stage:1,updates:[['11:50','Identified','A regional routing fault has been isolated. Traffic is being moved to healthy gateways.'],['11:33','Investigating','We are investigating errors reaching US-East application and API gateways.']]}
  };
  const history=Object.fromEntries(components.map((component) => [component.id,Array.from({length:90},(_,index) => {
    const date=new Date(end-(89-index)*day).toISOString().slice(0,10),event=incidents.find((item) => item.date===date && item.component===component.id);
    return {date,observed:1440,unavailable:event?.unavailable || 0,maintenance:event?.severity==='Maintenance',note:event?`${event.title}. ${event.summary}`:'No incidents reported.',event:event?.id || null};
  })]));
  const average=[31,29,30,36,39,37,41,46,53,58,60,67,65,58,50,45,43,41,40,44,48,45,35,39];
  const errors=[.07,.06,.06,.05,.05,.05,.04,.04,.03,.03,.04,.03,.03,.02,.03,.02,.02,.02,.02,.02,.03,.02,.02,.02];
  const throughput=[7.2,6.1,5.8,5.5,5.9,6.6,8.2,10.4,12.7,14.2,16.3,18.2,17.4,15.1,14.6,13.2,12.8,11.4,10.1,9.7,10.5,11.8,13.3,12.4];
  window.cloudSyncData={components,incidents,active,history,snapshot,end,day,average,errors,throughput};
})();
