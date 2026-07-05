function checkGradThesisReady(){
  const degree=player.gradDegree;
  if(degree==='master') return player.gradPapers>=1 && player.gradResearch>=3;
  if(degree==='phd')    return player.gradPapers>=3 && player.gradResearch>=10;
  return false;
}

function addGradItem(type){
  // 잠긴 항목 무시
  if(type.endsWith('_locked')) return;
  const def=GRAD_COURSE_TYPES.find(x=>x.id===type);
  if(!def) return;
  // 교과 학점 체크
  if(type==='lecture'){
    const used=_gradSemPlan.filter(x=>x.type==='lecture').reduce((s,x)=>s+x.credit,0);
    if(used+3>12){alert('교과 최대 12학점');return;}
    // 논문연구 포함 최대 12학점
    const total=_gradSemPlan.filter(x=>x.credit).reduce((s,x)=>s+x.credit,0);
    if(total+3>12){alert('총 수강 학점 최대 12학점');return;}
  }
  if(type==='thesis_res'){
    const total=_gradSemPlan.filter(x=>x.credit).reduce((s,x)=>s+x.credit,0);
    if(total+3>12){alert('총 수강 학점 최대 12학점');return;}
    const used=_gradSemPlan.filter(x=>x.type==='thesis_res').reduce((s,x)=>s+x.credit,0);
    const degree=player.gradDegree;
    const maxThRes=degree==='master'?6:12;
    if(used+3>maxThRes){alert(`논문연구 최대 ${maxThRes}학점`);return;}
  }
  if(type==='ethics'){
    const total=_gradSemPlan.filter(x=>x.credit).reduce((s,x)=>s+x.credit,0);
    if(total+1>12){alert('총 수강 학점 최대 12학점');return;}
  }
  // 강의 학기당 제한: 포닥 최대 1개, 교수 최대 4개
  if(type==='lecture_postdoc'){
    const maxLec = player.rankIdx===4 ? 4 : 1;
    const curLec = _gradSemPlan.filter(x=>x.type==='lecture_postdoc').length;
    if(curLec>=maxLec){ alert(`강의는 학기당 최대 ${maxLec}개입니다.`); return; }
  }
  if(type==='conference'||type==='conference_postdoc'){
    const confCount=_gradSemPlan.filter(x=>x.type===type).length;
    const researchTotal=(player.gradResearch||0)+(player.postdocResearch||0);
    if(confCount>=researchTotal){
      alert('연구 실적만큼만 학회 발표를 추가할 수 있습니다.');
      return;
    }
  }
  // 논문 작성 추가 가능 여부 체크 (연구 실적 - 기존 논문 실적 만큼)
  if(type==='paper'){
    const paperCount=_gradSemPlan.filter(x=>x.type==='paper').length;
    const researchTotal=(player.gradResearch||0);
    if((player.gradPapers||0)+paperCount>=researchTotal){
      alert('연구 실적만큼만 논문을 작성할 수 있습니다.');
      return;
    }
  }
  if(type==='paper_postdoc'){
    const paperCount=_gradSemPlan.filter(x=>x.type==='paper_postdoc').length;
    const researchTotal=(player.gradResearch||0)+(player.postdocResearch||0);
    if((player.gradPapers||0)+paperCount>=researchTotal){
      alert('연구 실적만큼만 논문을 작성할 수 있습니다.');
      return;
    }
  }
  _gradSemPlan.push({
    type, name:def.name,
    credit:def.credit||0,
    maxHits:def.maxHits,
    hits:0,
    graded:def.graded,
    grade:def.grade||null,
    isPaper:def.isPaper||false,
    isResearch:def.isResearch||false,
    isThesis:def.isThesis||false,
    isPostdocLec:def.isPostdocLec||false,
    isConference:def.isConference||false,
  });
  if(window._renderGradSemList) window._renderGradSemList();
}
