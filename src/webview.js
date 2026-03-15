function getWebviewContent(result, langInfo) {

const { functions = [], overallTimeComplexity, overallSpaceComplexity, tips = [], language } = result;

// Find worst function

let worstFunction = null;

if (functions.length > 0) {
  worstFunction = functions.reduce((worst, fn) => {
    return getRank(fn.timeComplexity) > getRank(worst.timeComplexity) ? fn : worst;
  }, functions[0]);
}

//Function cards

const funcCardsHTML = functions.map(fn => {

const isWorst = worstFunction && fn.name === worstFunction.name;

const stepsHTML = fn.steps.length === 0
? `<div class="fn-no-steps">No complex operations — runs in O(1)</div>`
: fn.steps.map((step, i) => `
<div class="step">

<div class="step-header">

<span class="step-num">${i+1}</span>

<span class="step-line">Line ${step.lineNum}</span>

<span class="step-complex">${step.complexity}</span>

</div>

<div class="step-code">${escapeHtml(step.code)}</div>

<div class="step-label">${step.label}</div>

<div class="step-reason">${step.reason}</div>

</div>
`).join("");

return `
<div class="fn-card ${isWorst ? "worst" : ""}">

<div class="fn-header">

<div class="fn-name">ƒ ${fn.name}()</div>

<div class="fn-lines">Lines ${fn.startLine}-${fn.endLine}</div>

</div>

<div class="fn-badges">

<div class="badge ${complexityClass(fn.timeComplexity)}">
TIME ${fn.timeComplexity}
</div>

<div class="badge space">
SPACE ${fn.spaceComplexity}
</div>

</div>

<div class="fn-desc">
${fn.explanation || ""}
</div>

<div class="fn-steps">
${stepsHTML}
</div>

</div>
`;

}).join("");

// Tips

const tipsHTML = tips.length > 0
? `
<div class="section-title">Optimization Tips</div>

${tips.map(t=>`
<div class="tip-card">

<div class="tip-text">${t.tip}</div>

${t.example ? `<pre class="tip-code">${escapeHtml(t.example)}</pre>` : ""}

</div>
`).join("")}
`
: "";

//HTML

return `
<!DOCTYPE html>
<html>

<head>

<meta charset="UTF-8">

<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Syne:wght@400;700&display=swap" rel="stylesheet">

<style>

/* ---------- Base ---------- */

body{
font-family:'Syne',sans-serif;
background:#0d0d14;
color:#e2e2f0;
padding:24px;
}

/* ---------- Header ---------- */

.header-top{
display:flex;
align-items:center;
gap:10px;
margin-bottom:20px;
}

.logo{
font-size:24px;
font-weight:800;
}

.logo span{
color:#f97316;
}

.tag{
font-family:'JetBrains Mono';
font-size:10px;
background:#f9731620;
color:#f97316;
padding:2px 8px;
border-radius:20px;
}

.lang{
font-family:'JetBrains Mono';
font-size:11px;
background:#1a1a28;
padding:3px 8px;
border-radius:20px;
}

/* ---------- Overall Cards ---------- */

.overall-grid{
display:grid;
grid-template-columns:1fr 1fr;
gap:12px;
margin-bottom:20px;
}

.card{
background:#141422;
border:1px solid #2a2a40;
border-radius:10px;
padding:16px;
}

.card-title{
font-size:11px;
color:#8888aa;
margin-bottom:6px;
}

.card-value{
font-family:'JetBrains Mono';
font-size:22px;
font-weight:600;
}

.card-func{
font-family:'JetBrains Mono';
font-size:12px;
color:#9aa0b8;
margin-top:4px;
}

/* ---------- Sections ---------- */

.section-title{
margin:24px 0 10px;
font-size:12px;
letter-spacing:1px;
color:#9aa0b8;
}

/* ---------- Function Cards ---------- */

.fn-card{
background:#141422;
border:1px solid #2a2a40;
border-radius:10px;
margin-bottom:14px;
transition:all 0.2s ease;
}

.fn-card:hover{
transform:translateY(-2px);
border-color:#3b82f6;
}

.worst{
border-left:3px solid #ef4444;
box-shadow:0 0 12px rgba(239,68,68,0.25);
}

.fn-header{
display:flex;
justify-content:space-between;
padding:14px 16px;
border-bottom:1px solid #2a2a40;
}

.fn-name{
font-family:'JetBrains Mono';
font-weight:600;
}

.fn-lines{
font-size:11px;
color:#8888aa;
}

/* ---------- Badges ---------- */

.fn-badges{
display:flex;
gap:8px;
padding:10px 16px;
}

.badge{
font-family:'JetBrains Mono';
padding:5px 10px;
border-radius:6px;
font-size:12px;
font-weight:600;
}

/* complexity colors */

.constant{ background:#22c55e20; color:#22c55e; }
.linear{ background:#3b82f620; color:#3b82f6; }
.nlogn{ background:#eab30820; color:#eab308; }
.quadratic{ background:#f9731620; color:#f97316; }
.exponential{ background:#ef444420; color:#ef4444; }

.space{
background:#1a1a28;
color:#9aa0b8;
}

/* ---------- Description ---------- */

.fn-desc{
padding:0 16px 10px;
font-size:12px;
color:#8888aa;
}

/* ---------- Steps ---------- */

.fn-steps{
padding:12px 16px;
display:flex;
flex-direction:column;
gap:8px;
}

.step{
background:#1a1a28;
border-radius:6px;
padding:8px;
}

.step-header{
display:flex;
gap:6px;
align-items:center;
margin-bottom:4px;
}

.step-num{
font-family:'JetBrains Mono';
background:#22c55e;
color:#000;
width:18px;
height:18px;
display:flex;
align-items:center;
justify-content:center;
border-radius:50%;
font-size:11px;
}

.step-line{
font-family:'JetBrains Mono';
font-size:10px;
color:#8888aa;
}

.step-complex{
font-family:'JetBrains Mono';
font-size:10px;
background:#2a2a40;
padding:1px 6px;
border-radius:4px;
}

.step-code{
font-family:'JetBrains Mono';
font-size:12px;
color:#9cdcfe;
background:#0f0f1a;
padding:6px 8px;
border-radius:4px;
}

.step-label{
font-size:11px;
}

.step-reason{
font-size:11px;
color:#8888aa;
}

/* ---------- Tips ---------- */

.tip-card{
background:#141422;
border:1px solid #2a2a40;
border-radius:10px;
padding:14px;
margin-bottom:10px;
}

.tip-text{
font-weight:600;
margin-bottom:6px;
}

.tip-code{
font-family:'JetBrains Mono';
background:#1a1a28;
padding:8px;
border-radius:6px;
font-size:11px;
}

</style>

</head>

<body>

<div class="header-top">

<div class="logo">
Complexity<span>Analyzer</span>
</div>

<div class="tag">PER FUNCTION</div>

<div class="lang">
${langInfo ? langInfo.icon + " " + langInfo.label : language}
</div>

</div>

<div class="overall-grid">

<div class="card">

<div class="card-title">Worst Time Complexity</div>

<div class="card-value">${overallTimeComplexity}</div>

${worstFunction ? `<div class="card-func">from ${escapeHtml(worstFunction.name)}()</div>` : ""}

</div>

<div class="card">

<div class="card-title">Worst Space Complexity</div>

<div class="card-value">${overallSpaceComplexity}</div>

</div>

</div>

<div class="section-title">Functions</div>

${funcCardsHTML}

${tipsHTML}

</body>
</html>
`;

}

function escapeHtml(str){
return String(str)
.replace(/&/g,'&amp;')
.replace(/</g,'&lt;')
.replace(/>/g,'&gt;')
.replace(/"/g,'&quot;');
}

function getRank(c){
const order=['O(1)','O(log n)','O(n)','O(n log n)','O(n^2)','O(n^3)','O(2^n)','O(n!)'];
const i=order.findIndex(x=>x.replace(/\s/g,'').toLowerCase()===c.replace(/\s/g,'').toLowerCase());
return i===-1?2:i;
}

function complexityClass(c){

if(!c) return "linear";

c=c.replace(/\s/g,'');

if(c==="O(1)") return "constant";
if(c==="O(n)") return "linear";
if(c==="O(nlogn)") return "nlogn";
if(c==="O(n^2)") return "quadratic";
if(c.includes("2^n")) return "exponential";

return "linear";

}

module.exports={getWebviewContent};