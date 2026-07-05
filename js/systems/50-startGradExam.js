function startGradExam(stageKey){
  document.getElementById('gradapply-exam-panel').style.display='';
  _gradExamClicks=0; _gradExamTime=10;
  document.getElementById('gradapply-exam-clicks').textContent='0';
  document.getElementById('gradapply-exam-timer').textContent='10';
  document.getElementById('gradapply-exam-bar').style.width='100%';
  const startTime=Date.now();
  _gradExamInterval=setInterval(()=>{
    const elapsed=(Date.now()-startTime)/1000;
    _gradExamTime=Math.max(0,10-elapsed);
    document.getElementById('gradapply-exam-timer').textContent=Math.ceil(_gradExamTime);
    document.getElementById('gradapply-exam-bar').style.width=(_gradExamTime/10*100)+'%';
    if(_gradExamTime<=0){
      clearInterval(_gradExamInterval);
      const degree=window._gradApplyDegree;
      const dept=GRAD_DEPTS.find(d=>d.id===_gradApplyDept);
      const cats=dept?[dept.majorCat]:['geo'];
      let bonus=0;
      if(degree==='master'){
        // 석사: 해당 전공 평점×학점 가산 (최대 20점)
        bonus = Math.min(20, completedCourses
          .filter(c=>cats.includes(c.category)&&c.grade!=='F'&&c.gradePoint>0)
          .reduce((s,c)=>s+c.gradePoint*c.credit*0.08,0));
      } else {
        // 박사: 석사 이수학점 가산 (최대 20점)
        bonus = Math.min(20, (player.gradCredits||0)*0.25);
      }
      const score=Math.min(100, Math.round(_gradExamClicks+bonus));
      if(!_gradApplyRoundScores[_gradApplyRoundIdx]) _gradApplyRoundScores[_gradApplyRoundIdx]={};
      _gradApplyRoundScores[_gradApplyRoundIdx][stageKey]=score;
      document.getElementById('gradapply-exam-panel').style.display='none';
      gradNextStage();
    }
  },50);
}
function gradExamClick(){if(_gradExamTime<=0)return;_gradExamClicks++;document.getElementById('gradapply-exam-clicks').textContent=_gradExamClicks;}

function startGradInterview(stageKey){
  document.getElementById('gradapply-interview-panel').style.display='';
  _gradIntClicks=0; _gradIntTime=5;
  document.getElementById('gradapply-int-clicks').textContent='0';
  document.getElementById('gradapply-int-timer').textContent='5';
  document.getElementById('gradapply-int-bar').style.width='100%';
  const startTime=Date.now();
  _gradIntInterval=setInterval(()=>{
    const elapsed=(Date.now()-startTime)/1000;
    _gradIntTime=Math.max(0,5-elapsed);
    document.getElementById('gradapply-int-timer').textContent=Math.ceil(_gradIntTime);
    document.getElementById('gradapply-int-bar').style.width=(_gradIntTime/5*100)+'%';
    if(_gradIntTime<=0){
      clearInterval(_gradIntInterval);
      const degree=window._gradApplyDegree;
      const dept=GRAD_DEPTS.find(d=>d.id===_gradApplyDept);
      // 면접 점수 구성
      const majorSc  = calcGradMajorScore(dept, degree);     // 전공기여 (최대30)
      const gpaSc    = calcGradGpaScore(degree);             // GPA (최대50)
      const contactSc= calcGradContactScore(dept);           // 교수컨택 (최대25) ★핵심
      const internSc = calcGradInternScore(dept);            // 학부생인턴 (최대15)
      const paperSc  = degree==='phd'?Math.min(15,(player.gradPapers||0)*5):0;
      const clickSc  = Math.round(_gradIntClicks/50*30);     // 클릭 (최대30 → 50회 만점)
      // 교수컨택 없으면 면접 총점 55점 제한, 전공수업 0개면 40점 제한
      let maxIntScore = 100;
      if(contactSc===0 && degree==='master') maxIntScore = 55;
      if(majorSc===0 && degree==='master') maxIntScore = Math.min(maxIntScore, 40);
      const autoScore= Math.min(70, majorSc*0.5 + gpaSc*0.3 + contactSc + internSc + paperSc);
      const score    = Math.min(maxIntScore, autoScore + clickSc);
      if(!_gradApplyRoundScores[_gradApplyRoundIdx]) _gradApplyRoundScores[_gradApplyRoundIdx]={};
      _gradApplyRoundScores[_gradApplyRoundIdx][stageKey||'interview']=score;
      document.getElementById('gradapply-interview-panel').style.display='none';
      // 점수 내역 표시 후 다음 단계
      const el=document.getElementById('gradapply-doc-panel');
      el.style.display='';
      el.innerHTML=`<b style="color:#60a5fa">면접 점수: ${score}/100점</b>
        <div style="font-size:9px;color:var(--dim);line-height:1.8;margin:6px 0;background:#f0f4fb;border-radius:4px;padding:6px 8px">
          클릭(${_gradIntClicks}회): <b style="color:#60a5fa">+${clickSc}점</b><br>
          교수 컨택: <b style="color:#fbbf24">+${contactSc}점</b>${contactSc>=25?' ✅ 해당전공':contactSc>0?' (타전공)':' ❌ 없음'}<br>
          학부생 인턴: <b style="color:#34d399">+${internSc}점</b><br>
          전공·GPA 기여: <b style="color:#a78bfa">+${Math.round(majorSc*0.5+gpaSc*0.3)}점</b>
          ${paperSc?`<br>논문 기여: <b style="color:#f472b6">+${paperSc}점</b>`:''}
        </div>
        <button class="btn" style="font-size:11px;padding:6px 16px" onclick="gradNextStage()">다음 →</button>`;
    }
  },50);
}
