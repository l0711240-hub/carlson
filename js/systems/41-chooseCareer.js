function chooseCareer(choice){
  document.getElementById('career-overlay').classList.remove('show');
  if(choice === 'grad'){
    document.getElementById('career-overlay').classList.remove('show');
    if(window._postMasterMode){
      // 석사 졸업 후 → 박사 전형 (같은 학과만)
      window._postMasterMode=false;
      player.gradDegree='phd';
      player.gradCredits=0; player.gradPapers=0; player.gradResearch=0;
      player.gradConferences=0;
      player.gradThesisHits=0; player.gradEthicsDone=false;
      window._pendingGradTransition=true;
      window._pendingGradDegree='phd';
      openGradApply('phd');
      return;
    }
    // 학부 → 석사: 대학원 전형 먼저 → 합격 시 졸업증
    window._pendingGradBonus = {
      stamina: player._gradStaminaBonus || 0,
      speed:   player._gradSpeedBonus  || 0,
    };
    courseEntities=[];
    openGradApply('master');
    return;
  } else if(choice === 'law'){
    openLeet();
  } else if(choice === 'pubco'){
    document.getElementById('ncs-ready').style.display='';
    document.getElementById('ncs-running').style.display='none';
    document.getElementById('ncs-result').style.display='none';
    document.getElementById('ncs-count').textContent='0';
    document.getElementById('ncs-timer').textContent='10';
    document.getElementById('ncs-bar').style.width='100%';
    document.getElementById('ncs-overlay').classList.add('show');
  } else if(choice === 'appraiser'){
    openAppraiser();
  }
}

// ── 임용 1차 미니게임 ─────────────────────────────────────
let leetClickCount = 0;
let leetTimerInterval = null;
let leetTimeLeft = 10;
const LEET_DURATION = 10;       // 시험 시간 (초)
const LEET_MAX_CLICKS = 140;    // 100점 = 140클릭 (감소 전 150클릭 기준)

function openLeet(){
  // 임용 1차 공부 이수 횟수에 따라 만점 기준 클릭 수 감소 (1회당 10클릭, 최대 50클릭)
  const leetStudy = completedCourses.filter(c=>c.code==='CERT.임용 1차'&&c.grade!=='F').length;
  window._leetEffMaxClicks = Math.max(100, LEET_MAX_CLICKS - leetStudy * 10);
  leetClickCount = 0;
  leetTimeLeft = LEET_DURATION;
  document.getElementById('leet-ready').style.display='';
  document.getElementById('leet-running').style.display='none';
  document.getElementById('leet-result').style.display='none';
  document.getElementById('leet-count').textContent='0';
  document.getElementById('leet-timer').textContent=LEET_DURATION;
  document.getElementById('leet-timer-bar').style.width='100%';
  document.getElementById('leet-overlay').classList.add('show');
}

function startLeet(){
  document.getElementById('leet-ready').style.display='none';
  document.getElementById('leet-running').style.display='';
  document.getElementById('leet-result').style.display='none';
  leetClickCount = 0;
  leetTimeLeft = LEET_DURATION;
  const _effDur = LEET_DURATION;

  // 스페이스바 핸들러
  window._leetKeyHandler = function(e){
    if(e.code==='Space' || e.key===' '){ e.preventDefault(); leetClick(); }
  };
  window.addEventListener('keydown', window._leetKeyHandler);

  leetTimerInterval = setInterval(()=>{
    leetTimeLeft -= 0.1;
    const pct = Math.max(0, (leetTimeLeft / _effDur) * 100);
    document.getElementById('leet-timer-bar').style.width = pct + '%';
    // 색상 변화
    const col = pct > 50 ? '#fbbf24' : pct > 25 ? '#f97316' : '#ef4444';
    document.getElementById('leet-timer-bar').style.background = col;
    document.getElementById('leet-timer').style.color = col;
    document.getElementById('leet-timer').textContent = Math.ceil(leetTimeLeft);

    if(leetTimeLeft <= 0){
      clearInterval(leetTimerInterval);
      window.removeEventListener('keydown', window._leetKeyHandler);
      finishLeet();
    }
  }, 100);
}
