// ══════════════════════════════════════════════════════
// NCS 시험 + 공기업 시스템
// ══════════════════════════════════════════════════════
let _ncsClicks=0, _ncsInterval=null, _ncsTime=0;

function startNcs(){
  document.getElementById('ncs-ready').style.display='none';
  document.getElementById('ncs-running').style.display='';
  _ncsClicks=0; _ncsTime=10;
  window._ncsKeyH=e=>{if(e.code==='Space'){e.preventDefault();ncsClick();}};
  window.addEventListener('keydown',window._ncsKeyH);
  _ncsInterval=setInterval(()=>{
    _ncsTime-=0.1;
    const pct=Math.max(0,_ncsTime/10*100);
    document.getElementById('ncs-bar').style.width=pct+'%';
    document.getElementById('ncs-timer').textContent=Math.ceil(_ncsTime);
    if(_ncsTime<=0){ clearInterval(_ncsInterval); window.removeEventListener('keydown',window._ncsKeyH); finishNcs(); }
  },100);
}

function ncsClick(){
  if(_ncsTime<=0) return;
  _ncsClicks++;
  document.getElementById('ncs-count').textContent=_ncsClicks;
}

function finishNcs(){
  document.getElementById('ncs-running').style.display='none';
  document.getElementById('ncs-result').style.display='';
  const score=Math.min(100,Math.round(_ncsClicks/80*100));
  player.ncsScore=score;
  document.getElementById('ncs-result-text').innerHTML=`클릭 <b>${_ncsClicks}회</b> → NCS 점수 <b style="color:#c2410c">${score}점</b>`;
}

function finishNcsAndShowCompanies(){
  document.getElementById('ncs-overlay').classList.remove('show');
  showPublicCompanies();
}

function calcCertScore(){
  let s=0;
  const c=player.certs;
  if(c.컴활1급) s+=15;
  if(c.토익>=850) s+=20;
  else if(c.토익>=700) s+=10;
  if(c.한국사===1) s+=15;
  else if(c.한국사===2) s+=10;
  else if(c.한국사===3) s+=5;
  return s;
}


// 사회봉사 공기업 가산점 (2회 이상 +1, 4회 이상 +2)
function calcVolunteerBonus(){
  const count = completedCourses.filter(c=>c.code==='053.003'&&c.grade==='S').length;
  if(count >= 4) return 2;
  if(count >= 2) return 1;
  return 0;
}
function calcInternScore(){
  let s=0;
  for(const i of player.interns.filter(x=>x.done)){
    // fixedScore: 인턴 완료 시 확정된 점수 사용 (없으면 중간값 사용)
    if(i.fixedScore != null){
      s += i.fixedScore;
    } else {
      const b=i.bonus;
      s+=b[0]+Math.round((b[1]-b[0])/2);
    }
  }
  // 그린리더십 인턴십 수료 시 소량 보너스 (+3)
  if(isGreenLeaderInternDone()) s+=3;
  // 사회봉사 이수 가산점
  s += calcVolunteerBonus();
  return s;
}
