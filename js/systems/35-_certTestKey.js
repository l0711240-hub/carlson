// ══════════════════════════════════════════════════════
// 자격증 시스템
// ══════════════════════════════════════════════════════
let _certTestKey = null, _certTestClicks = 0, _certTestInterval = null, _certTestTime = 0;
const CERT_DURATION = 10;

function openCertOverlay(){
  const el = document.getElementById('cert-list');
  const c = player.certs;
  el.innerHTML = Object.entries(CERT_DEFS).map(([key,def])=>{
    let statusStr = '';
    const hasCert = (key==='컴활1급'&&c.컴활1급)||(key==='토익'&&c.토익)||(key==='텝스'&&c.텝스)||(key==='한국사'&&c.한국사)||(key==='snult일본어'&&c.snult일본어);
    if(key==='토익' && c.토익) statusStr=`<span style="color:#1d4ed8;font-weight:700">${c.토익}점</span>`;
    else if(key==='텝스' && c.텝스) statusStr=`<span style="color:#1d4ed8;font-weight:700">${c.텝스}점</span>`;
    else if(key==='snult일본어' && c.snult일본어!=null) statusStr=`<span style="color:#92400e;font-weight:700">${c.snult일본어}점</span>`;
    else if(key==='한국사' && c.한국사) statusStr=`<span style="color:#15803d;font-weight:700">${c.한국사}급</span>`;
    else if(key==='컴활1급' && c.컴활1급) statusStr=`<span style="color:#15803d;font-weight:700">취득</span>`;
    else statusStr=`<span style="color:#94a3b8">미취득</span>`;
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border:1px solid ${hasCert?'#86efac':'#e8ecf5'};border-radius:8px;margin-bottom:8px;background:${hasCert?'#f0fdf4':'#fff'}">
      <div>
        <div style="font-size:13px;color:#003092;font-weight:700;">${def.label}</div>
        <div style="font-size:10px;color:#888;margin-top:2px;">${def.desc}</div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        ${statusStr}
        <button onclick="openCertTest('${key}')" style="background:#003092;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:12px;font-weight:700;cursor:pointer;">시험 응시</button>
      </div>
    </div>`;
  }).join('');
  document.getElementById('cert-status').textContent = `보유: ${Object.entries(c).filter(([k,v])=>v).map(([k,v])=>k+(v===true?'':(typeof v==='number'?v+'점':v+'급'))).join(' | ')||'없음'}` ;
  document.getElementById('cert-overlay').classList.add('show');
}

function openCertTest(key){
  _certTestKey = key;
  _certTestClicks = 0;
  const def = CERT_DEFS[key];
  document.getElementById('certtest-title').textContent = def.label + ' 시험';
  document.getElementById('certtest-desc').textContent = def.desc;
  document.getElementById('certtest-ready').style.display='';
  document.getElementById('certtest-running').style.display='none';
  document.getElementById('certtest-result').style.display='none';
  document.getElementById('certtest-count').textContent='0';
  document.getElementById('cert-overlay').classList.remove('show');
  document.getElementById('certtest-overlay').classList.add('show');
}

function startCertTest(){
  document.getElementById('certtest-ready').style.display='none';
  document.getElementById('certtest-running').style.display='';
  _certTestClicks=0; _certTestTime=CERT_DURATION;
  window._certKeyH = e=>{if(e.code==='Space'){e.preventDefault();certTestClick();}};
  window.addEventListener('keydown',window._certKeyH);
  _certTestInterval=setInterval(()=>{
    _certTestTime-=0.1;
    const pct=Math.max(0,_certTestTime/CERT_DURATION*100);
    document.getElementById('certtest-bar').style.width=pct+'%';
    document.getElementById('certtest-timer').textContent=Math.ceil(_certTestTime);
    if(_certTestTime<=0){ clearInterval(_certTestInterval); window.removeEventListener('keydown',window._certKeyH); finishCertTest(); }
  },100);
}

function certTestClick(){
  if(_certTestTime<=0||_certTestTime>CERT_DURATION) return;
  _certTestClicks++;
  document.getElementById('certtest-count').textContent=_certTestClicks;
}

function finishCertTest(){
  document.getElementById('certtest-running').style.display='none';
  document.getElementById('certtest-result').style.display='';
  const key=_certTestKey, def=CERT_DEFS[key], clicks=_certTestClicks;
  let resultMsg='', acquired=false;
  if(key==='컴활1급'){
    acquired=clicks>=100;
    if(acquired){ player.certs.컴활1급=true; }
    resultMsg=`${clicks}회 클릭 → ${acquired?'<b style="color:#15803d">취득 성공!</b>':'<span style="color:#ef4444">미취득 (100회 필요)</span>'}`;
  } else if(key==='토익'){
    const score=Math.min(990,Math.round(clicks/100*990));
    player.certs.토익=score;
    resultMsg=`${clicks}회 클릭 → <b style="color:#60a5fa">TOEIC ${score}점</b>`;
    acquired=true;
  } else if(key==='한국사'){
    let grade=0;
    if(clicks>=30) grade=1;
    else if(clicks>=20) grade=2;
    else if(clicks>=10) grade=3;
    if(grade>0){
      if(!player.certs.한국사||grade<player.certs.한국사) player.certs.한국사=grade;
      resultMsg=`${clicks}회 클릭 → <b style="color:#34d399">한국사 ${grade}급 취득!</b>`;
      acquired=true;
    } else {
      resultMsg=`${clicks}회 클릭 → <span style="color:#ef4444">미취득 (10회 이상 필요)</span>`;
    }
  } else if(key==='텝스'){
    const score = Math.min(600, Math.max(6, Math.round(clicks/100*600)));
    player.certs.텝스 = score;
    resultMsg=`${clicks}회 클릭 → <b style="color:#60a5fa">TEPS ${score}점</b>`;
    acquired=true;
  } else if(key==='snult일본어'){
    // 기본 점수: 클릭 100회 = 100점
    let base = Math.min(100, clicks);
    // 일본어 스킬 단계에 따른 가산점 (과목 기반 → 스킬 단계 기반)
    const japanLv = (player.skills && player.skills['일본어']) || 0;
    const bonus = japanLv===1?10 : japanLv===2?20 : japanLv===3?30 : 0;
    const score = Math.min(100, base + bonus);
    player.certs.snult일본어 = score;
    const bonusStr = bonus>0
      ? `<br><span style="color:#34d399">🈶 일본어 ${japanLv}단계 스킬 가산 +${bonus}점</span>`
      : `<br><span style="color:#666">일본어 스킬 없음 (가산점 0점)</span>`;
    resultMsg=`${clicks}회 클릭 (기본 ${base}점 + 가산 ${bonus}점) → <b style="color:#f59e0b">한국사검정 ${score}점</b>${bonusStr}`;
    acquired=true;
  }
  document.getElementById('certtest-result-text').innerHTML=resultMsg;
  if(acquired) addLog(`📜 자격증 취득: ${def.label}`,'log-level');
}
