// ══════════════════════════════════════════════════════
// UI
// ══════════════════════════════════════════════════════
function addLog(msg,cls='log-info'){
  logs.unshift({msg,cls,time:`${semLabel(gameYear,gameSem)}`});
  if(logs.length>60) logs.pop();
  renderLog();
}
function renderLog(){
  document.getElementById('log-list').innerHTML=logs.slice(0,25).map(l=>
    `<div class="log-entry"><span class="time">[${l.time}]</span><span class="${l.cls}">${l.msg}</span></div>`
  ).join('');
}
function retakeable(c){ return c.grade==='F' || (c.gradePoint!==null && c.gradePoint<=2.3); }

function renderCourseList(){
  const el=document.getElementById('course-list');
  // Show all including F (sorted: passed first, F at bottom)
  const sorted = [...completedCourses].sort((a,b)=>{
    if(a.grade==='F' && b.grade!=='F') return 1;
    if(a.grade!=='F' && b.grade==='F') return -1;
    return 0;
  });
  const catColor={liberal:'#f472b6',geo:'#34d399',agri:'#fbbf24',econ:'#818cf8',forest:'#22c55e',polisci:'#c084fc',japan:'#f59e0b',history:'#94a3b8',land:'#4ade80',general:'#64748b'};
  el.innerHTML=sorted.map(c=>{
    const rt=retakeable(c)?` <span style="color:#f97316">↺</span>`:'';
    const fStyle=c.grade==='F'?'opacity:0.7;':'';
    // 전공 미인정이면 일반선택
    let effCat = c.category;
    if((c.category==='agri'&&!isAgriMajor())||(c.category==='econ'&&!isEconMajor())||(c.category==='forest'&&!isForestMajor())||(c.category==='polisci'&&!isPolisciMajor())||(c.category==='japan'&&!isJapanMajor())||(c.category==='history'&&!isJapanMajor()&&!isJapanStudiesMajor())||(c.category==='japan_studies'&&!isJapanStudiesMajor())||(c.category==='arthistory'&&!isJapanStudiesMajor())||(c.category==='edu_history'&&!isJapanStudiesMajor())||(c.category==='sts'&&!isJapanStudiesMajor())||(c.category==='land'&&!isLandMajor())||(c.category==='genv'&&!isGenvMajor())||(c.category==='civil'&&!isGenvMajor())||(c.category==='energy'&&!isGenvMajor())||(c.category==='chembio'&&!isGenvMajor())||(c.category==='earth'&&!isGenvMajor())||(c.category==='lifesci'&&!isGenvMajor())||(c.category==='agrobio'&&!isGenvMajor())||(c.category==='soc'&&true)) effCat='general';
    const col=catColor[effCat]||'#94a3b8';
    const catStr = effCat==='liberal'?'교양':effCat==='geo'?'지리':effCat==='agri'?'지역정보':effCat==='econ'?'경제학부':effCat==='forest'?'산림':effCat==='polisci'?'정치외교':effCat==='japan'?'일본언어문명':effCat==='history'?'역사학부':effCat==='land'?'조경학':effCat==='genv'?'글로벌환경경영':effCat==='civil'?'건설환경공학부':effCat==='energy'?'에너지자원공학과':effCat==='chembio'?'화학생물공학부':effCat==='earth'?'지구환경과학부':effCat==='lifesci'?'생명과학부':effCat==='agrobio'?'응용생물화학부':effCat==='soc'?'사회학과':'일반선택';
    return `<div class="course-item ${c.gradeClass}" style="${fStyle}">
      <div class="course-name" style="display:flex;justify-content:space-between;align-items:center;">
        <span>${c.name}</span>
        <span style="font-size:8px;color:${col};border:1px solid ${col};border-radius:3px;padding:1px 4px;">${catStr}</span>
      </div>
      <div class="course-meta"><span style="font-size:8px">${semLabel(c.semYear, c.semNum)}</span><span>${c.grade}${rt}</span></div>
    </div>`;
  }).join('');
}

function updateUI(){
  const ri=player.rankIdx, r=RANKS[ri];
  document.getElementById('h-year').textContent=`${gameYear}학년`;
  document.getElementById('h-rank').textContent=r.name;
  if(player.rankIdx>=1&&player.rankIdx<=2&&player.gradSchool){
    const minCr=player.gradDegree==='master'?24:36;
    document.getElementById('h-credits').textContent=`${player.gradCredits}/${minCr}(대학원)`;
  } else {
    document.getElementById('h-credits').textContent=`${player.credits}/130`;
  }
  document.getElementById('h-liberal').textContent=`${player.liberalCredits}/36`;
  document.getElementById('h-major').textContent=`지리${player.geoCredits}${isAgriMajor()?'+'+(getMajorKind('agri')==='minor'?'부':'복')+'지역'+player.agriCredits:''}${isEconMajor()?'+'+(getMajorKind('econ')==='minor'?'부':'복')+'경제'+player.econCredits:''}${isForestMajor()?'+'+(getMajorKind('forest')==='minor'?'부':'복')+'산림'+player.forestCredits:''}${hasAnyMajor('polisci_a')?'+'+(getMajorKind('polisci_a')==='minor'?'부':'복')+'정치'+player.polisciCredits:''}${hasAnyMajor('polisci_b')?'+'+(getMajorKind('polisci_b')==='minor'?'부':'복')+'외교'+player.polisciCredits:''}${isJapanMajor()?'+'+(getMajorKind('japan')==='minor'?'부':'복')+'일본'+player.japanCredits:''}${isJapanStudiesMajor()?'+연일본'+player.japanStudiesCredits:''}${isLandMajor()?'+'+(getMajorKind('land')==='minor'?'부':'복')+'조경'+player.landCredits:''}`;
  document.getElementById('h-gpa').textContent=player.gpa?(player.gpa).toFixed(2):'-';
  const pEl=document.getElementById('h-points');
  pEl.textContent=player.points;
  pEl.style.color=(ri>0&&player.points<=5)?'#ef4444':'';
  document.getElementById('year-text').textContent=`${semLabel(gameYear,gameSem)}`;
  const dmLabels=doubleMajors.filter(d=>d.approved).map(d=>{
    const typeNames={agri:'교직과정',econ:'경제학부',forest:'산림환경학',polisci_a:'정치학전공',polisci_b:'외교학전공',japan:'일본언어문명',japan_studies:'연계전공 일본학',land:'조경학',genv:'글로벌환경경영학'};
    const kindLabel = d.type==='genv' ? '연합전공' : d.type==='japan_studies' ? '연계전공' : d.kind==='double' ? '복수' : '부전공';
    return `${typeNames[d.type]||d.type}(${kindLabel})`;
  });
  document.getElementById('h-double').textContent=dmLabels.length?dmLabels.join(', '):'-';

  const staminaRow=document.getElementById('stamina-row');
  staminaRow.style.display='flex';
  {
    const sp=player.stamina/player.maxStamina*100;
    document.getElementById('prog-stamina').style.width=sp+'%';
    document.getElementById('prog-stamina').style.background=sp>60?'#22c55e':sp>30?'#f97316':'#ef4444';
    document.getElementById('val-stamina').textContent=`${Math.round(player.stamina)}/${player.maxStamina}`;
  }

  const creditPct=Math.min(100,player.credits/130*100);
  document.getElementById('prog-credits').style.width=creditPct+'%';
  document.getElementById('val-credits').textContent=`${player.credits}/130`;
  const libPct=Math.min(100,player.liberalCredits/36*100);
  document.getElementById('prog-liberal').style.width=libPct+'%';
  document.getElementById('val-liberal').textContent=`${player.liberalCredits}/36`;

  const rankEl=document.getElementById('rank-display');
  rankEl.textContent=r.name;
  rankEl.className='player-title rank-'+ri===0?'rank-student':['rank-student','rank-master','rank-phd','rank-postdoc','rank-prof'][ri];
  rankEl.style.color=r.color;
  document.getElementById('gpa-display').textContent=ri===0?`GPA: ${player.gpa?(player.gpa).toFixed(2):'-'}`:`포인트: ${player.points}`;

  const baseThresholds=[0,60,240,200,999];
  const disc = player._gradPromoteDisc || 0;
  const thresholds = baseThresholds.map((v,i)=> i===0 ? 0 : Math.round(v*(1-disc)));
  let nextLabel='-', nextPct=0;
  if(ri===0){
    const gpa=player.gpa||0;
    nextLabel=`GPA ${gpa.toFixed(2)}/4.3`;
    nextPct=Math.min(100,gpa/4.3*100);
  } else if(ri<4){
    nextLabel=`${player.points}/${thresholds[ri+1]}pt`;
    nextPct=Math.min(100,player.points/thresholds[ri+1]*100);
  } else {nextLabel='교수 달성!';nextPct=100;}
  document.getElementById('prog-next').style.width=nextPct+'%';
  document.getElementById('val-next').textContent=nextLabel;

  // 스킬 패널 렌더 (그룹별 구분)
  const skillEl = document.getElementById('skill-list');
  if(skillEl && player && player.skills){
    const SKILL_ALL = ['통계','일본어','현장연구','GIS','질적연구','설계','생명과학','미시경제학','거시경제학','지리문헌','경제문헌','정치문헌','외교문헌','행정문헌','조경문헌','환경문헌'];
    let html = '';
    for(const sk of SKILL_ALL){
        const meta = SKILL_META[sk];
        const lv = (player.skills[sk]) || 0;
        let stars = '';
        if(lv === 0)        stars = '○○○';
        else if(lv === 0.5) stars = '◑○○';
        else if(lv === 1)   stars = '●○○';
        else if(lv === 2)   stars = '●●○';
        else                stars = '●●●';
        const col = lv > 0 ? meta.color : '#94a3b8';
        const bg  = lv > 0 ? meta.color+'18' : '#f8f9fc';
        html += `<div style="background:${bg};border:1px solid ${lv>0?meta.color:'#e2e8f0'};border-radius:4px;padding:2px 5px;display:flex;align-items:center;gap:3px;">
          <span style="font-size:10px">${meta.icon}</span>
          <span style="font-size:7px;color:${col};font-weight:${lv>0?700:400};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${meta.label}</span>
          <span style="font-size:7px;color:${col};letter-spacing:0px;">${stars}</span>
        </div>`;
    }
    skillEl.innerHTML = html;
  }
}
