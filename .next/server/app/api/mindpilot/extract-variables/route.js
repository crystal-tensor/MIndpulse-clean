"use strict";(()=>{var e={};e.id=421,e.ids=[421],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9924:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>y,patchFetch:()=>f,requestAsyncStorage:()=>g,routeModule:()=>h,serverHooks:()=>x,staticGenerationAsyncStorage:()=>m});var s={};r.r(s),r.d(s,{GET:()=>d,POST:()=>p});var o=r(9303),n=r(8716),a=r(670),i=r(7070);let c=`
你是一个专业的决策分析助手，负责从用户的自然语言描述中提取结构化的决策要素。

请严格按照以下JSON格式返回结果：
{
  "goals": ["目标1", "目标2"],
  "resources": ["资源1", "资源2"], 
  "constraints": ["约束1", "约束2"],
  "aiResponse": "对用户输入的回应",
  "shouldShowSummary": true/false
}

提取规则：
1. goals: 用户想要达成的目标、期望的结果
2. resources: 用户可用的资源、优势、能力  
3. constraints: 限制条件、约束因素、必须满足的要求

如果某个类别没有新内容，返回空数组。
用简洁的短语描述每个要素，不要包含模板默认内容。
当用户在当前阶段提供了足够信息时，设置shouldShowSummary为true。
重要：只提取用户实际提到的内容，不要添加任何默认的或假设的内容。
`;async function l(e,t,r){let s=r?.apiKey||process.env.OPENAI_API_KEY||process.env.DEEPSEEK_API_KEY,o=r?.provider||process.env.LLM_PROVIDER||"deepseek",n=r?.model||("deepseek"===o?"deepseek-chat":"gpt-4o-mini"),a=r?.temperature||.2,i=r?.baseUrl||("deepseek"===o?"https://api.deepseek.com/v1":"https://api.openai.com/v1");if(!s)throw Error("LLM API密钥未配置");try{let r=`${i}/chat/completions`,l=await fetch(r,{method:"POST",headers:{Authorization:`Bearer ${s}`,"Content-Type":"application/json"},body:JSON.stringify({model:n,messages:[{role:"system",content:c+"\n\n"+(({1:"当前阶段：目标收集。重点提取用户的目标和期望。",2:"当前阶段：资源盘点。重点提取用户的资源和能力。",3:"当前阶段：约束识别。重点提取限制条件和约束。"})[t]||"")},{role:"user",content:e}],temperature:a,response_format:{type:"json_object"}})});if(!l.ok){let e=await l.text();throw Error(`${o.toUpperCase()} API错误: ${l.statusText} - ${e}`)}let u=await l.json();return JSON.parse(u.choices[0].message.content)}catch(e){throw console.error("LLM API调用失败:",e),e}}let u=new Map;async function p(e){try{let{message:t,phase:r,sessionId:s,llmSettings:o}=await e.json();if(!t||!s)return i.NextResponse.json({error:"缺少必要参数"},{status:400});let n=await l(t,r,o),a=function(e,t){let r=u.get(e)||{goals:[],resources:[],constraints:[]},s={goals:Array.from(new Set([...r.goals,...t.goals])),resources:Array.from(new Set([...r.resources,...t.resources])),constraints:Array.from(new Set([...r.constraints,...t.constraints]))};return u.set(e,s),s}(s,{goals:n.goals||[],resources:n.resources||[],constraints:n.constraints||[]}),c=n.aiResponse||"我已经分析了您的输入并提取了相关信息。";return 1===r&&n.goals?.length>0?c=`我理解了您的目标。${n.goals.length>1?"看起来您有多个目标":"您的目标很明确"}。`:2===r&&n.resources?.length>0?c=`很好，我了解了您的资源情况。这些${n.resources.length,"资源"}将有助于实现您的目标。`:3===r&&n.constraints?.length>0&&(c=`明白了您的约束条件。我们在制定方案时会充分考虑这些${n.constraints.length,"限制因素"}。`),i.NextResponse.json({extracted:a,aiResponse:c,shouldShowSummary:n.shouldShowSummary||!1,currentPhaseCount:{goals:n.goals?.length||0,resources:n.resources?.length||0,constraints:n.constraints?.length||0}})}catch(e){return console.error("变量提取错误:",e),i.NextResponse.json({error:"变量提取失败",details:e instanceof Error?e.message:"未知错误"},{status:500})}}async function d(e){try{let{searchParams:t}=new URL(e.url),r=t.get("sessionId");if(!r)return i.NextResponse.json({error:"缺少sessionId参数"},{status:400});let s=u.get(r)||{goals:[],resources:[],constraints:[]};return i.NextResponse.json({variables:s,totalCount:s.goals.length+s.resources.length+s.constraints.length})}catch(e){return console.error("获取会话变量错误:",e),i.NextResponse.json({error:"获取变量失败"},{status:500})}}let h=new o.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/mindpilot/extract-variables/route",pathname:"/api/mindpilot/extract-variables",filename:"route",bundlePath:"app/api/mindpilot/extract-variables/route"},resolvedPagePath:"/Users/danielcrystal/work/MindPulse-Clean/app/api/mindpilot/extract-variables/route.ts",nextConfigOutput:"",userland:s}),{requestAsyncStorage:g,staticGenerationAsyncStorage:m,serverHooks:x}=h,y="/api/mindpilot/extract-variables/route";function f(){return(0,a.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:m})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[276,972],()=>r(9924));module.exports=s})();