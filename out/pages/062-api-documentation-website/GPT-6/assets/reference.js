'use strict';
(() => {
  const versions=['2.1','2.0','1.x'];
  const prefix=(version) => version==='1.x'?'/v1':'/v2';
  const endpoints=[
    {id:'users-list',resource:'users',method:'GET',path:'/users',title:'List users',description:'Browse users with a role filter and version-specific pagination.',example:{},fields:[['data','array','Users in this page.'],['pagination','object','Cursor metadata in v2; page metadata in v1.']]},
    {id:'users-get',resource:'users',method:'GET',path:'/users/{id}',title:'Retrieve a user',description:'Look up a user by ID. v2.1 can include owned projects.',sampleId:'usr_123',example:{},fields:[['id','string','Stable user identifier.'],['name','string','Display name; full_name in v1.'],['email','string','Email address.'],['role','string','admin or member.'],['created_at','string','Creation time, ISO 8601 UTC.']]},
    {id:'users-create',resource:'users',method:'POST',path:'/users',title:'Create a user',description:'Create a user with a unique email address. Returns 201 Created.',example:{name:'Jordan Lee',email:'jordan@example.com',role:'member'},fields:[['id','string','New user identifier.'],['name','string','Display name; full_name in v1.'],['email','string','Unique email address.'],['role','string','admin or member.'],['created_at','string','Creation time, ISO 8601 UTC.']]},
    {id:'users-update',resource:'users',method:'PUT',path:'/users/{id}',title:'Update a user',description:'Update one or more documented fields. Unspecified fields remain unchanged.',sampleId:'usr_123',example:{name:'John Doe',role:'admin'},fields:[['id','string','Unchanged user identifier.'],['name','string','Updated display name; full_name in v1.'],['email','string','Email address.'],['role','string','Updated permission role.'],['created_at','string','Original creation time.']]},
    {id:'users-delete',resource:'users',method:'DELETE',path:'/users/{id}',title:'Delete a user',description:'Remove a user from the local sandbox. Returns 204 with no response body.',sampleId:'usr_789',example:{},fields:[]},
    {id:'projects-get',resource:'projects',method:'GET',path:'/projects/{id}',title:'Retrieve a project',description:'Fetch a project and its owner reference.',sampleId:'proj_alpha',example:{},fields:[['id','string','Project identifier.'],['name','string','Project name.'],['status','string','active or archived.'],['owner_id','string','Reference to its user owner.'],['created_at','string','Creation time.']]},
    {id:'tasks-get',resource:'tasks',method:'GET',path:'/tasks/{id}',title:'Retrieve a task',description:'Read a task, status, assignee and due date.',sampleId:'task_design',example:{},fields:[['id','string','Task identifier.'],['project_id','string','Parent project.'],['title','string','Task title.'],['status','string','todo, in_progress or completed.'],['assignee_id','string','Assigned user reference.'],['due_date','string','Calendar date, YYYY-MM-DD.']]},
    {id:'comments-get',resource:'comments',method:'GET',path:'/comments/{id}',title:'Retrieve a comment',description:'Read a comment on a task.',sampleId:'cmt_review',example:{},fields:[['id','string','Comment identifier.'],['task_id','string','Parent task.'],['author_id','string','Author user reference.'],['body','string','Comment text.'],['created_at','string','Creation time.']]},
    {id:'files-get',resource:'files',method:'GET',path:'/files/{id}',title:'Retrieve file metadata',description:'Inspect metadata for a sample file. No binary upload or download service is connected.',sampleId:'file_brief',example:{},fields:[['id','string','File identifier.'],['name','string','Original file name.'],['mime_type','string','Media type.'],['size_bytes','integer','File size in bytes.'],['download_url','string','Illustrative reserved-domain URL.']]}
  ];
  const fixtures={
    users:[{id:'usr_123',name:'John Doe',email:'john@example.com',role:'admin',created_at:'2024-01-15T10:30:00Z'},{id:'usr_456',name:'Sam Rivera',email:'sam@example.com',role:'member',created_at:'2024-02-01T09:00:00Z'},{id:'usr_789',name:'Avery Lee',email:'avery@example.com',role:'member',created_at:'2024-02-02T09:00:00Z'}],
    projects:[{id:'proj_alpha',name:'Website refresh',status:'active',owner_id:'usr_123',created_at:'2024-02-10T12:00:00Z'}],
    tasks:[{id:'task_design',project_id:'proj_alpha',title:'Review homepage concepts',status:'in_progress',assignee_id:'usr_456',due_date:'2026-03-20'}],
    comments:[{id:'cmt_review',task_id:'task_design',author_id:'usr_123',body:'Let’s explore the simpler direction.',created_at:'2026-03-01T14:30:00Z'}],
    files:[{id:'file_brief',name:'creative-brief.pdf',mime_type:'application/pdf',size_bytes:184320,download_url:'https://api.example.com/v2/files/file_brief/content'}]
  };
  const errors={400:'bad_request',401:'unauthorized',404:'not_found',409:'conflict',429:'rate_limited',500:'server_error'};
  const validKey=(key) => typeof key==='string' && /^demo_(?:local|[a-f0-9]{24})$/.test(key);
  const userDTO=(user,version) => {
    const copy={...user};
    if (version==='1.x') {copy.full_name=copy.name;delete copy.name;}
    return copy;
  };
  function sample(endpoint,version='2.1') {
    if (endpoint.id==='users-list') return version==='1.x'?{data:fixtures.users.slice(0,2).map((u) => userDTO(u,version)),pagination:{page:1,per_page:2,total:3}}:{data:fixtures.users.slice(0,2).map((u) => userDTO(u,version)),pagination:{next_cursor:'after_usr_456',has_more:true,limit:2}};
    if (endpoint.method==='DELETE') return null;
    if (endpoint.resource==='users') return userDTO(endpoint.method==='POST'?{id:'usr_demo_1',...endpoint.example,created_at:'2026-03-01T10:30:00Z'}:fixtures.users[0],version);
    const value={...fixtures[endpoint.resource][0]};
    if (endpoint.resource==='files') value.download_url=`https://api.example.com${prefix(version)}/files/file_brief/content`;
    return value;
  }
  function createSandbox(clock=() => Date.now()) {
    let users=structuredClone(fixtures.users), serial=0, calls=0, sequence=0, reset=clock()+60000;
    function run(input) {
      if (clock()>=reset) {calls=0;reset=clock()+60000;}
      const requestId=`req_demo_${String(++sequence).padStart(4,'0')}`;
      const headers={'Content-Type':'application/json','X-Request-Id':requestId,'X-RateLimit-Limit':'60','X-RateLimit-Reset':String(Math.ceil(reset/1000))};
      const result=(status,body) => {
        headers['X-RateLimit-Remaining']=String(Math.max(0,60-calls));
        if (status===429) headers['Retry-After']=String(Math.max(1,Math.ceil((reset-clock())/1000)));
        if (status===204) delete headers['Content-Type'];
        return {status,body,headers};
      };
      const fail=(status,message) => result(status,{error:{code:errors[status],message,request_id:requestId}});
      if (calls>=60) return fail(429,'Local demo rate window exhausted. Reset the sandbox or wait for the next window.');
      calls++;
      if (!validKey(input.key)) return fail(401,'Use a demo_ key. No real API key is accepted by this sandbox.');
      if (!versions.includes(input.version)) return fail(400,'Unknown API version.');
      if (input.scenario && input.scenario!=='success') {
        const status=Number(input.scenario);
        if (!Object.hasOwn(errors,status)) return fail(400,'Unknown demo scenario.');
        return fail(status,`Deliberately simulated ${errors[status].replaceAll('_',' ')} response.`);
      }
      const endpoint=endpoints.find((entry) => entry.id===input.endpoint);
      if (!endpoint) return fail(404,'Unknown endpoint.');
      if (endpoint.path.includes('{id}') && !/^[a-z][a-z0-9_]{1,39}$/.test(input.id || '')) return fail(400,'ID must be 2–40 lowercase letters, digits or underscores, starting with a letter.');
      if (endpoint.id==='users-list') {
        const limit=Number(input.limit ?? 2), role=input.role || 'all';
        if (!Number.isInteger(limit) || limit<1 || limit>100) return fail(400,'limit must be an integer from 1 to 100.');
        if (!['all','admin','member'].includes(role)) return fail(400,'role must be admin or member.');
        const filtered=users.filter((user) => role==='all' || user.role===role);
        let start=0;
        if (input.version==='1.x') {
          if (input.cursor) return fail(400,'v1 uses page, not cursor.');
          const page=Number(input.page ?? 1);
          if (!Number.isInteger(page) || page<1 || page>100000) return fail(400,'page must be a positive integer up to 100000.');
          start=(page-1)*limit;
          return result(200,{data:filtered.slice(start,start+limit).map((user) => userDTO(user,input.version)),pagination:{page,per_page:limit,total:filtered.length}});
        }
        if (input.cursor) {
          const index=filtered.findIndex((user) => `after_${user.id}`===input.cursor);
          if (index<0) return fail(400,'Unknown cursor for this filtered result set.');
          start=index+1;
        }
        const selected=filtered.slice(start,start+limit), more=start+limit<filtered.length;
        return result(200,{data:selected.map((user) => userDTO(user,input.version)),pagination:{next_cursor:more?`after_${selected.at(-1).id}`:null,has_more:more,limit}});
      }
      if (endpoint.resource!=='users') {
        const record=fixtures[endpoint.resource].find((entry) => entry.id===input.id);
        if (!record) return fail(404,'Resource not found in the local fixtures.');
        return result(200,sample(endpoint,input.version));
      }
      const index=endpoint.method==='POST'?-1:users.findIndex((user) => user.id===input.id);
      if (endpoint.method==='GET') {
        if (index<0) return fail(404,'User not found.');
        if (input.include && (input.version!=='2.1' || input.include!=='projects')) return fail(400,'Only v2.1 supports include=projects.');
        const user=userDTO(users[index],input.version);
        if (input.include==='projects') user.projects=fixtures.projects.filter((project) => project.owner_id===user.id).map((project) => ({...project}));
        return result(200,user);
      }
      if (endpoint.method==='DELETE') {
        if (index<0) return fail(404,'User not found.');
        users.splice(index,1);return result(204,null);
      }
      if (endpoint.method==='PUT' && index<0) return fail(404,'User not found.');
      const body=input.body, nameField=input.version==='1.x'?'full_name':'name';
      if (!body || typeof body!=='object' || Array.isArray(body) || !Object.keys(body).length || Object.keys(body).some((field) => ![nameField,'email','role'].includes(field))) return fail(400,`Supply only ${nameField}, email and role as a nonempty JSON object.`);
      if ((endpoint.method==='POST' || Object.hasOwn(body,nameField)) && (typeof body[nameField]!=='string' || body[nameField].trim().length<2 || body[nameField].trim().length>100)) return fail(400,`${nameField} must contain 2–100 characters.`);
      if ((endpoint.method==='POST' || Object.hasOwn(body,'email')) && (typeof body.email!=='string' || body.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))) return fail(400,'Supply a valid email address up to 254 characters.');
      if (Object.hasOwn(body,'role') && !['admin','member'].includes(body.role)) return fail(400,'role must be admin or member.');
      if (body.email && users.some((user,i) => i!==index && user.email.toLowerCase()===body.email.toLowerCase())) return fail(409,'Email already belongs to a user.');
      const changes={};if (Object.hasOwn(body,nameField)) changes.name=body[nameField].trim();if (body.email) changes.email=body.email;if (body.role) changes.role=body.role;
      if (endpoint.method==='POST') {
        const created={id:`usr_demo_${++serial}`,role:'member',...changes,created_at:new Date(clock()).toISOString()};
        users.push(created);return result(201,userDTO(created,input.version));
      }
      users[index]={...users[index],...changes};return result(200,userDTO(users[index],input.version));
    }
    return {run};
  }
  window.orbitReference={versions,prefix,endpoints,fixtures,errors,validKey,sample,createSandbox};
})();
