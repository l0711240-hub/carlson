function openGradSemReg(){
  const degree=player.gradDegree;
  const dept=GRAD_DEPTS.find(d=>d.id===player.gradSchool)||GRAD_DEPTS[0];
  _gradSemPlan=[];
  const el=document.getElementById('gradsem-list');
  const isPostdoc=(player.rankIdx===3);
  const isProf=(player.rankIdx===4);

  // 교수 모드 종료 버튼 표시/숨김
  const profEndBtn = document.getElementById('prof-end-btn');
  if(profEndBtn) profEndBtn.style.display = isProf ? '' : 'none';
  // 제목 변경: 교수는 "학기계획", 나머지는 "수강계획"
  document.querySelector('#gradsem-overlay div[style*="font-size:17px"]').textContent =
    isProf ? '🎓 교수 학기계획' : '📚 대학원 수강계획';

  document.getElementById('gradsem-subtitle').innerHTML= isProf
    ? (()=>{
        const profLec   = player.postdocLectures||0;
        const profPaper = player.gradPapers||0;
        const profRes   = (player.gradResearch||0)+(player.postdocResearch||0)+(player.profResearch||0);
        const profConf  = player.postdocConferences||0;
        const profGuide = player.profStudentGuidance||0;
        const profPub   = player.profPubs||0;
        const profProj  = player.profProjs||0;
        const profExt   = player.profExtLectures||0;
        const profBroad = player.profBroadcasts||0;
        const coeff = 0.05*profLec + 0.02*profPaper + 0.01*profRes + 0.01*profConf
                    + 0.02*profGuide + 0.2*profPub + 0.5*profProj
                    + 0.01*profExt  + 0.02*profBroad;
        const profScore = Math.round(player.points * coeff);
        return `교수 ${semLabel(gameYear,gameSem)} &nbsp;|&nbsp; 포인트 <b style="color:#fbbf24">${player.points}</b> &nbsp;|&nbsp; 활동점수 <b style="color:#22c55e">${profScore}</b> &nbsp;|&nbsp; 출판 <b style="color:#a78bfa">${player.profPubHits||0}/30</b> &nbsp;|&nbsp; 연구사업 <b style="color:#34d399">${player.profProjHits||0}/50</b>`;
      })()
    : `${dept.name} ${degree==='master'?'석사':degree==='phd'?'박사':''}과정
      이수학점 <b style="color:#a78bfa">${player.gradCredits||0}</b>/${degree==='master'?24:36} &nbsp;|&nbsp;
      논문 <b style="color:#be185d">${player.gradPapers||0}</b>개 &nbsp;|&nbsp;
      연구 <b style="color:#0f766e">${player.gradResearch||0}</b>회 &nbsp;|&nbsp;
      학회 <b style="color:#0369a1">${player.gradConferences||0}</b>회 &nbsp;|&nbsp;
      졸업논문 <b style="color:#d97706">${player.gradThesisHits||0}</b>/${degree==='master'?25:50}회 &nbsp;|&nbsp;
      연구윤리 <b style="color:${player.gradEthicsDone?'#22c55e':'#ef4444'}">${player.gradEthicsDone?'이수':'미이수'}</b>
    </span>`;

  function makeBtn(label, type, extra){
    const b=document.createElement('button');
    b.className='btn btn-sm';
    b.style.cssText='font-size:11px;background:#eef2fc;color:#003092;border:1px solid #003092;border-radius:6px;padding:5px 10px;margin:2px;cursor:pointer;font-weight:600;';
    b.textContent=label;
    b.addEventListener('click',()=>{ addGradItem(type); renderGradSemList(); });
    return b;
  }

  function renderGradSemList(){
    const usedCredit=_gradSemPlan.filter(x=>x.credit).reduce((s,x)=>s+x.credit,0);
    document.getElementById('gradsem-credit-info').textContent=
      `수강 학점: ${usedCredit}/12학점 (교과 최대 12학점)`;
    el.innerHTML='';

    // 수강 계획 목록
    for(let i=0;i<_gradSemPlan.length;i++){
      const item=_gradSemPlan[i];
      const div=document.createElement('div');
      div.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border:1px solid #e8ecf5;border-radius:8px;margin-bottom:4px;font-size:11px;background:#fff';
      const span=document.createElement('span');
      span.style.color='#1a1a2e';
      span.textContent=item.name+(item.credit?` (${item.credit}학점)`:'');
      const rmBtn=document.createElement('button');
      rmBtn.className='btn btn-sm btn-warn';
      rmBtn.style.cssText='font-size:9px;padding:3px 7px';
      rmBtn.textContent='제거';
      const idx=i;
      rmBtn.addEventListener('click',()=>{ removeGradItem(idx); renderGradSemList(); });
      div.appendChild(span); div.appendChild(rmBtn);
      el.appendChild(div);
    }

    // 추가 버튼들
    const btnDiv=document.createElement('div');
    btnDiv.style.cssText='display:flex;flex-wrap:wrap;gap:4px;margin-top:10px;padding:8px;background:#f0f4fb;border-radius:6px';

    if(isProf){
      const allResearch=(player.gradResearch||0)+(player.postdocResearch||0)+(player.profResearch||0);
      const allGuidance=(player.profStudentGuidance||0);
      const pts=player.points||0;
      // 학생지도: 무제한
      btnDiv.appendChild(makeBtn('학생지도 추가','student_guidance'));
      // 강의: 포닥 최대 1개, 교수 최대 4개
      const hasLecProf=_gradSemPlan.filter(x=>x.type==='lecture_postdoc').length;
      const maxLecProf = isProf ? 4 : 1;
      if(hasLecProf < maxLecProf) btnDiv.appendChild(makeBtn(`강의 추가 (${maxLecProf-hasLecProf}개 가능)`,'lecture_postdoc'));
      // 연구: 무제한
      btnDiv.appendChild(makeBtn('연구 추가','research_postdoc'));
      // 논문: 연구+학생지도 실적 기반
      const paperCountProf=_gradSemPlan.filter(x=>x.type==='paper_postdoc').length;
      const availPaperProf=Math.max(0,allResearch+allGuidance-(player.gradPapers||0)-paperCountProf);
      if(availPaperProf>0) btnDiv.appendChild(makeBtn(`논문 작성(${availPaperProf}회 가능)`,'paper_postdoc'));
      // 학회: 연구+학생지도 실적 기반
      const confCountProf=_gradSemPlan.filter(x=>x.type==='conference_postdoc').length;
      const availConfProf=Math.max(0,allResearch+allGuidance-confCountProf);
      if(availConfProf>0) btnDiv.appendChild(makeBtn(`학회 발표(${availConfProf}회 가능)`,'conference_postdoc'));
      // 출판: 포인트 50 이상, 누적 진행
      if(pts>=50) btnDiv.appendChild(makeBtn(`출판 추가 (누적 ${player.profPubHits||0}/30회)`,'publication'));
      else btnDiv.appendChild(makeBtn(`출판 (포인트 ${pts}/50 필요)`,'publication_locked'));
      // 연구사업: 누적 진행
      btnDiv.appendChild(makeBtn(`연구사업 참여 (누적 ${player.profProjHits||0}/50회)`,'research_project'));
      // 외부강연: 포인트 30 이상, 학기 최대 5개
      const extLecCount=_gradSemPlan.filter(x=>x.type==='external_lecture').length;
      if(pts>=30 && extLecCount<5) btnDiv.appendChild(makeBtn(`외부강연 (${5-extLecCount}회 가능)`,'external_lecture'));
      else if(pts<30) btnDiv.appendChild(makeBtn(`외부강연 (포인트 ${pts}/30 필요)`,'ext_lecture_locked'));
      // 방송출연: 포인트 80 이상, 학기 최대 5개
      const broadCount=_gradSemPlan.filter(x=>x.type==='broadcast').length;
      if(pts>=80 && broadCount<5) btnDiv.appendChild(makeBtn(`방송출연 (${5-broadCount}회 가능)`,'broadcast'));
      else if(pts<80) btnDiv.appendChild(makeBtn(`방송출연 (포인트 ${pts}/80 필요)`,'broad_locked'));
    } else if(isPostdoc){
      const hasLecPd=_gradSemPlan.filter(x=>x.type==='lecture_postdoc').length;
      if(hasLecPd < 1) btnDiv.appendChild(makeBtn('강의 추가 (1개 가능)','lecture_postdoc'));
      const paperCountPd=_gradSemPlan.filter(x=>x.type==='paper_postdoc').length;
      const availPaperPd=Math.max(0,(player.gradResearch||0)+(player.postdocResearch||0)-(player.gradPapers||0)-paperCountPd);
      if(availPaperPd>0) btnDiv.appendChild(makeBtn(`논문 작성(${availPaperPd}회 가능)`,'paper_postdoc'));
      btnDiv.appendChild(makeBtn('연구 추가','research_postdoc'));
      const confCount=_gradSemPlan.filter(x=>x.type==='conference_postdoc').length;
      const availConf=Math.max(0,(player.gradResearch||0)+(player.postdocResearch||0)-confCount);
      if(availConf>0) btnDiv.appendChild(makeBtn(`학회 발표(${availConf}회 가능)`,'conference_postdoc'));
    } else {
      const total=_gradSemPlan.filter(x=>x.credit).reduce((s,x)=>s+x.credit,0);
      const usedLec=_gradSemPlan.filter(x=>x.type==='lecture').reduce((s,x)=>s+x.credit,0);
      const usedThRes=_gradSemPlan.filter(x=>x.type==='thesis_res').reduce((s,x)=>s+x.credit,0);
      const degree=player.gradDegree;
      const maxThRes=degree==='master'?6:12;
      // 전공교과: 총학점 12 이하, 교과만 12 이하
      if(total<12 && usedLec<12) btnDiv.appendChild(makeBtn(`전공교과 추가 (${12-usedLec}학점 가능)`,'lecture'));
      // 논문연구: 총학점 12 이하
      if(total<12 && usedThRes<maxThRes) btnDiv.appendChild(makeBtn(`논문연구 추가 (${maxThRes-usedThRes}학점 가능)`,'thesis_res'));
      // 연구윤리: 미이수+미신청 시만
      if(!player.gradEthicsDone&&!_gradSemPlan.some(x=>x.type==='ethics'))
        btnDiv.appendChild(makeBtn('연구윤리 추가(1학점)','ethics'));
      // 논문/연구: 연구 실적만큼 논문 작성 가능
      const paperCount=_gradSemPlan.filter(x=>x.type==='paper').length;
      const availPaper=Math.max(0,(player.gradResearch||0)-paperCount-(player.gradPapers||0));
      if(availPaper>0) btnDiv.appendChild(makeBtn(`논문 작성(${availPaper}회 가능)`,'paper'));
      btnDiv.appendChild(makeBtn('연구 추가','research'));
      // 학회 발표
      const confCount=_gradSemPlan.filter(x=>x.type==='conference').length;
      const availConf=Math.max(0,(player.gradResearch||0)-confCount);
      if(availConf>0) btnDiv.appendChild(makeBtn(`학회 발표(${availConf}회 가능)`,'conference'));
      // 졸업논문: 1학기 1개만
      const alreadyHasThesis=_gradSemPlan.some(x=>x.type==='thesis');
      if(checkGradThesisReady()&&!alreadyHasThesis) btnDiv.appendChild(makeBtn('졸업논문 추가(1개만)','thesis'));
      // 교수 컨택: 해당 전공 컨택 미완료이고 미신청 시
      const contactedThisDeptAlready = !!(player.contactHistory||{})[player.gradSchool] || player.gradContactDone;
      if(!contactedThisDeptAlready && !_gradSemPlan.some(x=>x.type==='contact')){
        const contactLabel = player.gradDegree==='master' ? '교수 컨택 추가 (석사필수)' : '교수 컨택 추가';
        btnDiv.appendChild(makeBtn(contactLabel,'contact'));
      } else if(contactedThisDeptAlready){
        // 이미 컨택 완료 — 버튼 숨김
      }
    }
    el.appendChild(btnDiv);
  }

  window._renderGradSemList=renderGradSemList;
  renderGradSemList();
  document.getElementById('gradsem-overlay').classList.add('show');
}
