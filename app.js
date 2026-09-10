const PATIENTS = {
  NG1001: {
    id:"NG1001", password:"Grip@1001", name:"Arjun Menon", age:54, sex:"Male", condition:"Post-stroke hand impairment",
    status:"Improving", therapist:"Dr. Meera Nair", lastSession:"10 Sep 2026",
    metrics:{pinch:2.1, pinchGoal:3.0, rom:72, romGoal:90, consistency:84, endurance:68},
    vitals:{bp:"128/82 mmHg", pulse:"76 bpm", spo2:"98%", temperature:"36.7 °C"},
    medical:[
      ["10 Sep 2026","NeuroGrip session","Pinch 2.1 kgf; 18 controlled repetitions; assistance reduced to 18%."],
      ["03 Sep 2026","Physiotherapy review","Improved thumb opposition and release timing."],
      ["18 Aug 2026","Neurology follow-up","Stable post-stroke status. Continue supervised upper-limb rehabilitation."],
      ["22 Jul 2026","Baseline assessment","Reduced right-hand pinch strength and dexterity."]
    ],
    exercises:[
      ["Assisted thumb-index pinch","12 reps × 3 sets","Completed","Low assistance"],
      ["Controlled pinch resistance","8 reps × 2 sets","Recommended","Light resistance"],
      ["Finger opening / release","15 reps × 2 sets","Pending","Slow controlled movement"]
    ],
    advice:[
      ["Therapist","Keep wrist neutral during pinch practice and rest if movement quality drops."],
      ["NeuroGrip","Today's session target: 20 quality repetitions with assistance below 20% if comfortable."]
    ],
    emergency:"For urgent symptoms, contact your local emergency service. NeuroGrip is not an emergency-response service."
  },
  NG1002: {
    id:"NG1002", password:"Grip@1002", name:"Diya Krishnan", age:47, sex:"Female", condition:"Post-stroke hand weakness",
    status:"Stable", therapist:"Dr. Meera Nair", lastSession:"09 Sep 2026",
    metrics:{pinch:1.6, pinchGoal:2.8, rom:61, romGoal:90, consistency:76, endurance:55},
    vitals:{bp:"134/86 mmHg", pulse:"81 bpm", spo2:"97%", temperature:"36.8 °C"},
    medical:[
      ["09 Sep 2026","NeuroGrip session","Pinch 1.6 kgf; 14 controlled repetitions; assistance 34%."],
      ["01 Sep 2026","Physiotherapy review","Moderate improvement in active finger flexion; endurance remains limited."],
      ["12 Aug 2026","Neurology follow-up","Continue graded hand therapy and monitor fatigue."],
      ["19 Jul 2026","Baseline assessment","Reduced left-hand strength, range of motion and endurance."]
    ],
    exercises:[
      ["Assisted thumb-index pinch","10 reps × 3 sets","Recommended","Moderate assistance"],
      ["Finger flexion / extension","12 reps × 2 sets","Recommended","Assisted"],
      ["Gentle endurance task","60 sec × 2","Pending","Low intensity"]
    ],
    advice:[
      ["Therapist","Use short rest periods between sets. Prioritize smooth movement over speed."],
      ["NeuroGrip","Next target: 16 quality repetitions while maintaining consistent contact pressure."]
    ],
    emergency:"For urgent symptoms, contact your local emergency service. NeuroGrip is not an emergency-response service."
  }
};

const TEAM = {id:"MEDTEAM",password:"NeuroGrip@Team",name:"NeuroGrip Medical Team"};

let state = {role:null,user:null,view:"overview",selectedPatient:null};
let adviceStore = JSON.parse(localStorage.getItem("ng_advice")||"{}");

function save(){localStorage.setItem("ng_advice",JSON.stringify(adviceStore))}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function patient(id){return PATIENTS[id]}
function initials(n){return n.split(" ").map(x=>x[0]).slice(0,2).join("")}

function loginScreen(){
  return `<div class="login-shell">
    <section class="login-brand">
      <div class="logo">Neuro<span>Grip</span></div>
      <div class="brand-copy">
        <div class="eyebrow" style="color:#9bd5cc">CARE PORTAL</div>
        <h1>Rehabilitation care, clearly connected.</h1>
        <p>A focused clinical portal for rehabilitation progress, patient guidance, exercise planning and therapist oversight.</p>
      </div>
      <div class="secure-note">Demo environment • All patient records are fictional</div>
    </section>
    <section class="login-panel"><div class="login-card">
      <div class="eyebrow">Secure sign in</div><h2>Welcome to NeuroGrip</h2><p class="sub">Select your portal and enter your credentials.</p>
      <div class="role-tabs">
        <button class="${state.loginRole!=="team"?"active":""}" onclick="setLoginRole('patient')">Patient</button>
        <button class="${state.loginRole==="team"?"active":""}" onclick="setLoginRole('team')">Medical Team</button>
      </div>
      <div id="login-error"></div>
      <form onsubmit="handleLogin(event)">
        <div class="field"><label>User ID</label><input id="login-id" autocomplete="username" placeholder="${state.loginRole==="team"?"Medical team ID":"Patient ID"}" required></div>
        <div class="field"><label>Password</label><input id="login-password" type="password" autocomplete="current-password" placeholder="Enter password" required></div>
        <button class="primary">Sign in</button>
      </form>
      <div class="demo-hint">${state.loginRole==="team"?"Medical team access includes both demo patient records and clinical advice tools.":"Use one of the two fictional patient accounts provided with this demo."}</div>
    </div></section>
  </div>`
}
state.loginRole="patient";

function setLoginRole(role){state.loginRole=role;render()}

function handleLogin(e){
  e.preventDefault();
  const id=document.getElementById("login-id").value.trim();
  const pw=document.getElementById("login-password").value;
  if(state.loginRole==="team" && id===TEAM.id && pw===TEAM.password){state.role="team";state.user=TEAM;state.view="overview";render();return}
  if(state.loginRole==="patient" && PATIENTS[id] && PATIENTS[id].password===pw){state.role="patient";state.user=PATIENTS[id];state.view="overview";render();return}
  document.getElementById("login-error").innerHTML=`<div class="error">Invalid credentials. Please check the demo credentials supplied with the project.</div>`;
}

function shell(content){
  const team=state.role==="team";
  const nav=team
    ? [["overview","Dashboard"],["patients","Patients"],["analytics","Clinical analytics"]]
    : [["overview","My dashboard"],["exercises","Exercises"],["history","Medical history"],["advice","Care guidance"],["support","Medical assistance"]];
  return `<div class="shell">
    <header class="topbar"><div class="topbar-left"><div class="logo">Neuro<span>Grip</span></div></div>
      <div class="user-chip"><div class="avatar">${initials(state.user.name)}</div><span>${esc(state.user.name)}</span><button class="logout" onclick="logout()">Sign out</button></div>
    </header>
    <div class="layout"><aside class="sidebar">${nav.map(n=>`<button class="nav-item ${state.view===n[0]?"active":""}" onclick="go('${n[0]}')">${n[1]}</button>`).join("")}</aside><main class="main">${content}</main></div>
  </div>`
}

function metricCard(label,value,foot){return `<div class="card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-foot">${foot}</div></div>`}
function progress(label,val,goal,suffix=""){const pct=Math.min(100,Math.round(val/goal*100));return `<div class="metric-row"><span>${label}</span><strong>${val}${suffix} / ${goal}${suffix}</strong></div><div class="bar"><div class="fill" style="width:${pct}%"></div></div>`}

function patientOverview(){
 const p=state.user;
 return `<div class="page-head"><div><h1>Good evening, ${esc(p.name.split(" ")[0])}</h1><div class="muted">Your rehabilitation overview • Last session ${p.lastSession}</div></div><span class="pill good">${p.status}</span></div>
 <div class="grid stats">
 ${metricCard("Pinch force",p.metrics.pinch+" kgf","Current best")}
 ${metricCard("Range of motion",p.metrics.rom+"%","Active movement score")}
 ${metricCard("Movement quality",p.metrics.consistency+"%","Consistency index")}
 ${metricCard("Endurance",p.metrics.endurance+"%","Session endurance")}
 </div>
 <div class="grid two">
  <section class="card"><h3 class="section-title">Current functional profile</h3>
   ${progress("Pinch strength",p.metrics.pinch,p.metrics.pinchGoal," kgf")}
   ${progress("Range of motion",p.metrics.rom,p.metrics.romGoal,"%")}
   ${progress("Movement consistency",p.metrics.consistency,100,"%")}
   ${progress("Endurance",p.metrics.endurance,100,"%")}
   <div class="note-box" style="margin-top:18px"><strong>Adaptive status</strong><br>Current mode: ${p.metrics.pinch>=1.9?"Reduced assistance":"Assisted movement"}. The next exercise is selected using your recent performance and therapist guidance.</div>
  </section>
  <section class="card"><h3 class="section-title">Today's guidance</h3>
   ${mergedAdvice(p.id).slice(0,3).map(a=>`<div class="advice"><strong>${esc(a[0])}</strong><p>${esc(a[1])}</p></div>`).join("")}
   <div class="actions"><button class="secondary" onclick="go('exercises')">View exercises</button><button class="secondary" onclick="go('support')">Contact medical team</button></div>
  </section>
 </div>
 <div class="grid two" style="margin-top:18px">
  <section class="card"><h3 class="section-title">Recent rehabilitation</h3>${p.medical.slice(0,3).map(x=>`<div class="timeline"><div class="timeline-item"><div class="timeline-date">${x[0]}</div><div class="timeline-title">${esc(x[1])}</div><div class="muted small">${esc(x[2])}</div></div></div>`).join("")}</section>
  <section class="card"><h3 class="section-title">Current vital snapshot</h3>${Object.entries(p.vitals).map(([k,v])=>`<div class="metric-row"><span>${k.toUpperCase()}</span><strong>${v}</strong></div>`).join("")}<div class="muted small">Values shown are fictional demo data.</div></section>
 </div>`
}

function patientExercises(){
 const p=state.user;
 return `<div class="page-head"><div><h1>Exercises</h1><div class="muted">Your current rehabilitation plan</div></div><span class="pill info">Adaptive plan</span></div>
 <div class="grid two"><section class="card"><h3 class="section-title">Today's exercise plan</h3>
 ${p.exercises.map((e,i)=>`<div class="advice"><div style="display:flex;justify-content:space-between;gap:10px"><strong>${esc(e[0])}</strong><span class="pill ${e[2]==="Completed"?"good":e[2]==="Recommended"?"info":"warn"}">${e[2]}</span></div><p>${esc(e[1])} • ${esc(e[3])}</p><button class="secondary" onclick="toast('Exercise session started in demo mode')">Start session</button></div>`).join("")}
 </section><section class="card"><h3 class="section-title">How progression works</h3>
 <div class="timeline">${["Assisted movement","Reduced assistance","Independent movement","Controlled resistance"].map((x,i)=>`<div class="timeline-item"><div class="timeline-date">Stage ${i+1}</div><div class="timeline-title">${x}</div><div class="muted small">${["Support movement when strength is limited.","Gradually increase active patient contribution.","Monitor performance with minimal mechanical help.","Challenge strength and endurance when appropriate."][i]}</div></div>`).join("")}</div>
 <div class="note-box">Your clinician defines the rehabilitation boundaries. NeuroGrip demo recommendations do not replace medical advice.</div></section></div>`
}

function patientHistory(){
 const p=state.user;
 return `<div class="page-head"><div><h1>Medical history</h1><div class="muted">Previous rehabilitation and clinical records</div></div></div>
 <section class="card table-wrap"><table class="table"><thead><tr><th>Date</th><th>Event</th><th>Clinical note</th></tr></thead><tbody>${p.medical.map(x=>`<tr><td>${x[0]}</td><td><strong>${esc(x[1])}</strong></td><td>${esc(x[2])}</td></tr>`).join("")}</tbody></table></section>
 <div class="grid two" style="margin-top:18px"><section class="card"><h3 class="section-title">Current health snapshot</h3>${Object.entries(p.vitals).map(([k,v])=>`<div class="metric-row"><span>${k}</span><strong>${v}</strong></div>`).join("")}</section><section class="card"><h3 class="section-title">Functional recovery</h3>${progress("Pinch",p.metrics.pinch,p.metrics.pinchGoal," kgf")}${progress("ROM",p.metrics.rom,p.metrics.romGoal,"%")}${progress("Consistency",p.metrics.consistency,100,"%")}</section></div>`
}

function patientAdvice(){
 return `<div class="page-head"><div><h1>Care guidance</h1><div class="muted">Advice shared by your medical team</div></div></div>
 <section class="card">${mergedAdvice(state.user.id).map(a=>`<div class="advice"><strong>${esc(a[0])}</strong><p>${esc(a[1])}</p></div>`).join("")}</section>
 <div class="card" style="margin-top:18px"><h3 class="section-title">Safety</h3><div class="note-box">${esc(state.user.emergency)}</div></div>`
}

function patientSupport(){
 return `<div class="page-head"><div><h1>Medical assistance</h1><div class="muted">Reach the rehabilitation team for non-emergency support</div></div></div>
 <div class="grid three"><div class="card"><h3 class="section-title">Rehabilitation team</h3><p class="muted small">Assigned clinician</p><strong>${esc(state.user.therapist)}</strong><p class="muted small">Neuro-rehabilitation service</p><button class="primary" style="margin-top:10px" onclick="toast('Demo request sent to the medical team')">Request a call</button></div>
 <div class="card"><h3 class="section-title">Message team</h3><p class="muted small">Send a non-urgent question about your rehabilitation plan.</p><button class="secondary" onclick="openMessage()">Send message</button></div>
 <div class="card"><h3 class="section-title">Urgent symptoms</h3><p class="muted small">${esc(state.user.emergency)}</p><button class="danger-btn" onclick="toast('Please use your local emergency service for urgent symptoms')">Urgent help</button></div></div>`
}

function mergedAdvice(id){return [...(PATIENTS[id].advice||[]),...(adviceStore[id]||[])]}

function teamOverview(){
 const ps=Object.values(PATIENTS);
 return `<div class="page-head"><div><h1>Clinical dashboard</h1><div class="muted">Patient monitoring and rehabilitation oversight</div></div><span class="pill info">Demo clinical portal</span></div>
 <div class="grid stats">${metricCard("Active patients",ps.length,"Fictional records")}${metricCard("Improving",ps.filter(p=>p.status==="Improving").length,"Current status")}${metricCard("Avg. pinch",((ps[0].metrics.pinch+ps[1].metrics.pinch)/2).toFixed(1)+" kgf","Across demo patients")}${metricCard("Sessions tracked",ps.length*4,"Sample history")}</div>
 <div class="grid two"><section class="card"><h3 class="section-title">Patients</h3>${ps.map(patientRow).join("")}</section><section class="card"><h3 class="section-title">Clinical alerts</h3><div class="advice"><strong>Review exercise progression</strong><p>Both demo patients have current exercise recommendations awaiting clinician review.</p></div><div class="advice"><strong>Fatigue monitoring</strong><p>Diya Krishnan has lower endurance and may benefit from shorter sets and rest intervals.</p></div></section></div>`
}

function patientRow(p){return `<div class="patient-row"><div class="patient-main"><div class="avatar">${initials(p.name)}</div><div><div class="patient-name">${esc(p.name)}</div><div class="patient-meta">${p.id} • ${esc(p.condition)}</div></div></div><div class="actions"><span class="pill ${p.status==="Improving"?"good":"info"}">${p.status}</span><button class="link-btn" onclick="selectPatient('${p.id}')">Open profile →</button></div></div>`}

function teamPatients(){
 return `<div class="page-head"><div><h1>Patients</h1><div class="muted">Select a patient to review their complete demo record</div></div><div class="search"><input placeholder="Search patient..." oninput="filterPatients(this.value)"></div></div><div id="patient-list" class="patient-list">${Object.values(PATIENTS).map(patientRow).join("")}</div>`
}
function filterPatients(q){const list=document.getElementById("patient-list");const rows=Object.values(PATIENTS).filter(p=>(p.name+" "+p.id+" "+p.condition).toLowerCase().includes(q.toLowerCase()));list.innerHTML=rows.length?rows.map(patientRow).join(""):`<div class="card empty">No matching patient</div>`}

function selectPatient(id){state.selectedPatient=id;state.view="patient-profile";render()}

function teamProfile(){
 const p=PATIENTS[state.selectedPatient]; if(!p){state.view="patients";return teamPatients()}
 return `<div class="page-head"><div><button class="link-btn" onclick="go('patients')">← All patients</button><h1 style="margin-top:8px">${esc(p.name)}</h1><div class="muted">${p.id} • ${esc(p.condition)} • ${p.age} years</div></div><span class="pill good">${p.status}</span></div>
 <div class="grid profile-grid">
 <section><div class="grid stats">${metricCard("Pinch force",p.metrics.pinch+" kgf","Current best")}${metricCard("ROM",p.metrics.rom+"%","Active movement")}${metricCard("Consistency",p.metrics.consistency+"%","Movement quality")}${metricCard("Endurance",p.metrics.endurance+"%","Session endurance")}</div>
 <div class="card"><h3 class="section-title">Functional profile</h3>${progress("Pinch strength",p.metrics.pinch,p.metrics.pinchGoal," kgf")}${progress("Range of motion",p.metrics.rom,p.metrics.romGoal,"%")}${progress("Movement consistency",p.metrics.consistency,100,"%")}${progress("Endurance",p.metrics.endurance,100,"%")}</div>
 <div class="card" style="margin-top:18px"><h3 class="section-title">Medical history</h3><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Event</th><th>Note</th></tr></thead><tbody>${p.medical.map(x=>`<tr><td>${x[0]}</td><td>${esc(x[1])}</td><td>${esc(x[2])}</td></tr>`).join("")}</tbody></table></div></div></section>
 <aside><div class="card"><h3 class="section-title">Patient details</h3><div class="metric-row"><span>Age</span><strong>${p.age}</strong></div><div class="metric-row"><span>Sex</span><strong>${p.sex}</strong></div><div class="metric-row"><span>Condition</span><strong>${esc(p.condition)}</strong></div><div class="metric-row"><span>Last session</span><strong>${p.lastSession}</strong></div></div>
 <div class="card" style="margin-top:18px"><h3 class="section-title">Current vitals</h3>${Object.entries(p.vitals).map(([k,v])=>`<div class="metric-row"><span>${k}</span><strong>${v}</strong></div>`).join("")}</div>
 <div class="card" style="margin-top:18px"><h3 class="section-title">Medical advice</h3>${mergedAdvice(p.id).map(a=>`<div class="advice"><strong>${esc(a[0])}</strong><p>${esc(a[1])}</p></div>`).join("")}<button class="primary" onclick="openAdvice('${p.id}')">Add advice</button></div></aside></div>`
}

function teamAnalytics(){
 const ps=Object.values(PATIENTS);
 return `<div class="page-head"><div><h1>Clinical analytics</h1><div class="muted">Cross-patient overview of the fictional demo cohort</div></div></div>
 <div class="grid three">${ps.map(p=>`<div class="card"><h3 class="section-title">${esc(p.name)}</h3>${progress("Pinch",p.metrics.pinch,p.metrics.pinchGoal," kgf")}${progress("ROM",p.metrics.rom,p.metrics.romGoal,"%")}${progress("Quality",p.metrics.consistency,100,"%")}${progress("Endurance",p.metrics.endurance,100,"%")}</div>`).join("")}</div>
 <div class="card" style="margin-top:18px"><h3 class="section-title">Recommended review priorities</h3><div class="table-wrap"><table class="table"><thead><tr><th>Patient</th><th>Priority</th><th>Suggested clinical focus</th></tr></thead><tbody><tr><td>Arjun Menon</td><td><span class="pill good">Progression</span></td><td>Assess whether reduced assistance can continue safely.</td></tr><tr><td>Diya Krishnan</td><td><span class="pill warn">Endurance</span></td><td>Maintain low-intensity repetitions and monitor fatigue.</td></tr></tbody></table></div></div>`
}

function openAdvice(id){
 const p=PATIENTS[id];
 document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h3 style="margin:0">Add medical advice</h3><button class="close" onclick="closeModal()">×</button></div><p class="muted small">Patient: ${esc(p.name)}. This is a demo portal.</p><div class="field"><label>Advice</label><textarea id="advice-text" rows="5" placeholder="Enter clear, patient-friendly guidance..."></textarea></div><div class="actions"><button class="secondary" onclick="closeModal()">Cancel</button><button class="primary" style="width:auto" onclick="saveAdvice('${id}')">Save advice</button></div></div></div>`)
}
function openMessage(){document.body.insertAdjacentHTML("beforeend",`<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h3 style="margin:0">Message medical team</h3><button class="close" onclick="closeModal()">×</button></div><div class="field"><label>Message</label><textarea id="message-text" rows="5" placeholder="Type your non-urgent question..."></textarea></div><button class="primary" onclick="closeModal();toast('Message sent in demo mode')">Send message</button></div></div>`)}
function saveAdvice(id){const t=document.getElementById("advice-text").value.trim();if(!t)return;if(!adviceStore[id])adviceStore[id]=[];adviceStore[id].push(["Medical Team",t]);save();closeModal();toast("Advice saved");render()}
function closeModal(){document.getElementById("modal")?.remove()}
function toast(msg){const d=document.createElement("div");d.className="toast";d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2800)}
function logout(){state={role:null,user:null,view:"overview",selectedPatient:null,loginRole:"patient"};render()}
function go(view){state.view=view;render()}

function render(){
 if(!state.role){document.getElementById("app").innerHTML=loginScreen();return}
 let content="";
 if(state.role==="patient"){
   content={overview:patientOverview,exercises:patientExercises,history:patientHistory,advice:patientAdvice,support:patientSupport}[state.view]?.()||patientOverview;
 }else{
   content={overview:teamOverview,patients:teamPatients,analytics:teamAnalytics,"patient-profile":teamProfile}[state.view]?.()||teamOverview;
 }
 document.getElementById("app").innerHTML=shell(content);
}
render();
