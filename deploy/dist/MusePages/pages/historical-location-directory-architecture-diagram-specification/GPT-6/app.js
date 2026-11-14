const $=s=>document.querySelector(s),nodes={
browser:['Browser','Named component','Public visitors and contributors use the directory through a browser.',['HTTPS to the web server.']],
web:['Web server','Ingress product undecided','The shared entry point sits in front of the partial applications. No ingress product is selected by this presentation.',['Routes to the frontend.','Routes to the backend.']],
frontend:['Frontend','Stack undecided','The browser-facing application presents the historical directory. Its technology is not selected in this source.',['Served through the web server.','Calls the backend API.','Communicates with Keycloak for identity.']],
backend:['Backend','Stack undecided','The domain application handles directory data and application behavior. Stack details remain open.',['Receives routed API requests.','Persists data in the database.','Communicates with Keycloak.','Planned later connection from MCP server.']],
keycloak:['Keycloak','Named identity component','The specification names Keycloak. It is not marked as an undecided identity-provider placeholder. Detailed authentication behavior belongs in the auth specification.',['Identity communication with frontend and backend.']],
database:['Database','Database product undecided','Domain persistence is part of the system overview. No database engine, hosting product or schema is chosen here.',['Backend persistence connection.']],
mcp:['MCP server','Post-MVP','A later extension, shown separately from unresolved MVP technology choices. Interface details and operational behavior remain unselected.',['Planned dotted connection to the backend.']]
};
function select(id){const n=nodes[id];$('#inspector').innerHTML=`<h2>${n[0]}</h2><span class="decision">${n[1]}</span><p>${n[2]}</p><h3>Connections</h3><ul>${n[3].map(x=>`<li>${x}</li>`).join('')}</ul>`;document.querySelectorAll('[data-node]').forEach(b=>b.classList.toggle('selected',b.dataset.node===id))}
document.querySelectorAll('[data-node]').forEach(b=>b.onclick=()=>select(b.dataset.node));$('#reset').onclick=()=>select('browser');
const source=`flowchart TB
  Browser["Browser"]
  Web["Web server — ingress product (undecided)"]
  Frontend["Frontend — stack (undecided)"]
  Backend["Backend — stack (undecided)"]
  Keycloak["Keycloak"]
  Database["Database — product (undecided)"]
  MCP["MCP server (post-MVP)"]
  Browser -->|HTTPS| Web
  Web --> Frontend
  Web --> Backend
  Frontend <-->|API| Backend
  Frontend <-->|Identity| Keycloak
  Backend <-->|Identity| Keycloak
  Backend <-->|Persistence| Database
  MCP -.->|Planned| Backend
  classDef undecided stroke:#719a86,stroke-dasharray:6 4
  classDef later fill:#f0f3ed,color:#8e9b88,stroke:#a7b3a5,stroke-dasharray:2 4
  class Web,Frontend,Backend,Database undecided
  class MCP later`;
$('#mermaid').textContent=source;$('#showsource').onclick=()=>$('#source').scrollIntoView();
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText(source);$('#copystatus').textContent='Mermaid source copied.'}catch{const s=getSelection(),r=document.createRange();r.selectNodeContents($('#mermaid'));s.removeAllRanges();s.addRange(r);$('#copystatus').textContent='Source selected. Copy it using your browser.'}};select('browser');
