'use strict';
(() => {
  const languages=['cURL','JavaScript','Python','Ruby','Go','PHP'];
  const quote=(text) => `'${text.replaceAll("'","'\\''")}'`;
  const single=(text) => `'${text.replaceAll('\\','\\\\').replaceAll("'","\\'")}'`;
  function bodyFor(endpoint,version) {
    const body={...endpoint.example};
    if (version==='1.x' && body.name) {body.full_name=body.name;delete body.name;}
    return body;
  }
  function requestCode(endpoint,language,version,options={}) {
    const root=`https://api.example.com${window.orbitReference.prefix(version)}`;
    let url=root+endpoint.path.replace('{id}',encodeURIComponent(options.id || endpoint.sampleId || 'usr_123'));
    const params=new URLSearchParams();
    if (endpoint.id==='users-list') {
      params.set('limit',String(options.limit ?? 2));
      if (version==='1.x') params.set('page',String(options.page || 1));else if (options.cursor) params.set('cursor',options.cursor);
      if (options.role && options.role!=='all') params.set('role',options.role);
    }
    if (endpoint.id==='users-get' && options.include) params.set('include',options.include);
    if (params.size) url+=`?${params}`;
    const hasBody=['POST','PUT'].includes(endpoint.method), body=options.body || bodyFor(endpoint,version), raw=JSON.stringify(body), method=endpoint.method;
    if (language==='cURL') return `curl -X ${method} ${quote(url)} \\\n  -H 'Authorization: Bearer YOUR_API_KEY'${hasBody?` \\\n  -H 'Content-Type: application/json' \\\n  --data ${quote(raw)}`:''}`;
    if (language==='JavaScript') return `// Node.js 18+; replace YOUR_API_KEY before use.\nconst response = await fetch(${JSON.stringify(url)}, {\n  method: '${method}',\n  headers: {\n    Authorization: 'Bearer YOUR_API_KEY'${hasBody?",\n    'Content-Type': 'application/json'":''}\n  }${hasBody?`,\n  body: JSON.stringify(${JSON.stringify(body,null,2).replaceAll('\n','\n  ')})`:''}\n});\nconsole.log(response.status);\nif (response.status !== 204) console.log(await response.json());`;
    if (language==='Python') return `import json\nfrom urllib.request import Request, urlopen\nfrom urllib.error import HTTPError\n\nrequest = Request(\n    ${JSON.stringify(url)},\n    method="${method}",\n    headers={"Authorization": "Bearer YOUR_API_KEY"${hasBody?', "Content-Type": "application/json"':''}}${hasBody?`,\n    data=${JSON.stringify(raw)}.encode("utf-8")`:''}\n)\ntry:\n    with urlopen(request) as response:\n        print(response.status)\n        content = response.read()\n        if content:\n            print(json.loads(content))\nexcept HTTPError as error:\n    print(error.code, error.read().decode("utf-8"))`;
    if (language==='Ruby') return `require 'net/http'\nrequire 'json'\n\nuri = URI(${single(url)})\nrequest = Net::HTTP::${{GET:'Get',POST:'Post',PUT:'Put',DELETE:'Delete'}[method]}.new(uri)\nrequest['Authorization'] = 'Bearer YOUR_API_KEY'${hasBody?`\nrequest['Content-Type'] = 'application/json'\nrequest.body = ${single(raw)}`:''}\nresponse = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|\n  http.request(request)\nend\nputs response.code\nputs JSON.parse(response.body) unless response.body.to_s.empty?`;
    if (language==='Go') return `package main\n\nimport (\n  "fmt"\n  "io"\n  "net/http"${hasBody?'\n  "strings"':''}\n)\n\nfunc main() {\n  request, err := http.NewRequest(${JSON.stringify(method)}, ${JSON.stringify(url)}, ${hasBody?`strings.NewReader(${JSON.stringify(raw)})`:'nil'})\n  if err != nil { panic(err) }\n  request.Header.Set("Authorization", "Bearer YOUR_API_KEY")${hasBody?'\n  request.Header.Set("Content-Type", "application/json")':''}\n  response, err := http.DefaultClient.Do(request)\n  if err != nil { panic(err) }\n  defer response.Body.Close()\n  body, err := io.ReadAll(response.Body)\n  if err != nil { panic(err) }\n  fmt.Println(response.StatusCode, string(body))\n}`;
    return `<?php\n// Requires PHP's cURL extension.\n$curl = curl_init(${single(url)});\ncurl_setopt_array($curl, [\n    CURLOPT_CUSTOMREQUEST => '${method}',\n    CURLOPT_RETURNTRANSFER => true,\n    CURLOPT_HTTPHEADER => [\n        'Authorization: Bearer YOUR_API_KEY'${hasBody?",\n        'Content-Type: application/json'":''}\n    ]${hasBody?`,\n    CURLOPT_POSTFIELDS => ${single(raw)}`:''}\n]);\n$response = curl_exec($curl);\nif ($response === false) {\n    throw new RuntimeException(curl_error($curl));\n}\necho curl_getinfo($curl, CURLINFO_HTTP_CODE), PHP_EOL;\nif ($response !== '') echo $response, PHP_EOL;\ncurl_close($curl);`;
  }
  window.orbitExamples={languages,bodyFor,requestCode};
})();
