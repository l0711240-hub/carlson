// ══════════════════════════════════════════════════════
// 7급 공무원 시험 시스템
// ══════════════════════════════════════════════════════
let _appraiserClicks=0, _appraiserInterval=null, _appraiserTime=0, _appraiserGoal=300;
const APPRAISER_DURATION=30;

function calcAppraiserDiscount(){
  let discount=0;
  for(const [code,val] of Object.entries(APPRAISER_DISCOUNT_CODES)){
    if(completedCourses.some(c=>c.code===code&&c.grade!=='F')) discount+=val;
  }
  return discount;
}

function openAppraiser(){
  const discount=calcAppraiserDiscount();
  const studyBonus=player.appraiserClicks||0;
  _appraiserGoal=Math.max(50,300-discount-studyBonus);
  _appraiserClicks=0; _appraiserTime=APPRAISER_DURATION;
  document.getElementById('appraiser-goal-line').innerHTML=
    `목표: <b style="color:#fbbf24">${_appraiserGoal}회</b> 클릭 (300 - 과목 ${discount} - 공부 ${studyBonus})`;
  document.getElementById('appraiser-goal-num').textContent=_appraiserGoal;
  document.getElementById('appraiser-count').textContent='0';
  document.getElementById('appraiser-timer').textContent=APPRAISER_DURATION;
  document.getElementById('appraiser-timer-bar').style.width='100%';
  document.getElementById('appraiser-progress-bar').style.width='0%';
  document.getElementById('appraiser-ready').style.display='';
  document.getElementById('appraiser-running').style.display='none';
  document.getElementById('appraiser-result').style.display='none';
  document.getElementById('appraiser-overlay').classList.add('show');
}

function startAppraiser(){
  document.getElementById('appraiser-ready').style.display='none';
  document.getElementById('appraiser-running').style.display='';
  _appraiserClicks=0; _appraiserTime=APPRAISER_DURATION;
  window._appKeyH=e=>{if(e.code==='Space'){e.preventDefault();appraiserClick();}};
  window.addEventListener('keydown',window._appKeyH);
  _appraiserInterval=setInterval(()=>{
    _appraiserTime-=0.1;
    const pct=Math.max(0,_appraiserTime/APPRAISER_DURATION*100);
    const col=pct>50?'#fbbf24':pct>25?'#f97316':'#ef4444';
    document.getElementById('appraiser-timer-bar').style.width=pct+'%';
    document.getElementById('appraiser-timer-bar').style.background=col;
    document.getElementById('appraiser-timer').style.color=col;
    document.getElementById('appraiser-timer').textContent=Math.ceil(_appraiserTime);
    if(_appraiserTime<=0){
      clearInterval(_appraiserInterval);
      window.removeEventListener('keydown',window._appKeyH);
      finishAppraiser();
    }
  },100);
}

function appraiserClick(){
  if(_appraiserTime<=0||_appraiserTime>APPRAISER_DURATION) return;
  _appraiserClicks++;
  document.getElementById('appraiser-count').textContent=_appraiserClicks;
  const pct=Math.min(100,(_appraiserClicks/_appraiserGoal)*100);
  document.getElementById('appraiser-progress-bar').style.width=pct+'%';
}

function finishAppraiser(){
  document.getElementById('appraiser-running').style.display='none';
  document.getElementById('appraiser-result').style.display='';
  const passed=_appraiserClicks>=_appraiserGoal;
  document.getElementById('appraiser-pass-btn').style.display=passed?'':'none';
  document.getElementById('appraiser-result-text').innerHTML=
    `<div style="font-size:22px;margin-bottom:8px">${passed?'🎉':'😞'}</div>`+
    `클릭 <b style="color:${passed?'#15803d':'#c0392b'}">${_appraiserClicks}회</b> / 목표 <b>${_appraiserGoal}회</b><br>`+
    `<span style="color:${passed?'#34d399':'#ef4444'};font-family:'Black Han Sans',sans-serif;font-size:16px">`+
    `${passed?'합격!':'불합격'}</span>`+
    (passed?'':'<br><span style="font-size:10px;color:var(--dim)">다음 학기에 재도전하거나 다른 진로를 선택하세요</span>');
  if(passed) addLog('🏠 7급 공무원 합격!','log-level');
}
