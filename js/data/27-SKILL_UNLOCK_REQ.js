const SKILL_UNLOCK_REQ = {0.5:1, 1:1, 2:3, 3:3};

// 통계/GIS 패시브 대상 카테고리
const STAT_GIS_PASSIVE_CATS = new Set(['forest','geo']);

// 스킬 해금 체크 (학기 종료 시 호출)
function checkSkillUnlocks(){
  if(!player || !player.skills) return;
  const GOOD = ['A+','A0','A-'];
  const allSkills = Object.keys(SKILL_META);

  allSkills.forEach(sk=>{
    const curLv = player.skills[sk];
    if(curLv >= 3) return;

    // ── 1단계 체크: 스킬 0 또는 0.5 상태에서 1단계 과목 A- 이상 1개 이수 → 1단계
    if(curLv < 1){
      const has1 = completedCourses.some(cc=>{
        if(!GOOD.includes(cc.grade)) return false;
        const sm = COURSE_SKILL_MAP[cc.code];
        return sm && sm[sk] === 1;
      });
      if(has1){
        player.skills[sk] = 1;
        const meta = SKILL_META[sk];
        addLog(`${meta.icon} 스킬 해금: ${meta.label} 1단계!`, 'log-level');
        showSkillUnlockFx(sk, 1);
        return; // 1단계 달성 → 이번 학기에 2단계 동시 승급 방지
      }
      // 1단계 과목 없으면 0.5단계 체크
      if(curLv === 0){
        const has05 = completedCourses.some(cc=>{
          if(!GOOD.includes(cc.grade)) return false;
          const sm = COURSE_SKILL_MAP[cc.code];
          return sm && sm[sk] === 0.5;
        });
        if(has05){
          player.skills[sk] = 0.5;
          const meta = SKILL_META[sk];
          addLog(`${meta.icon} 스킬 기초: ${meta.label} 기초(0.5단계)!`, 'log-level');
          showSkillUnlockFx(sk, 0.5);
        }
      }
      return;
    }

    // ── 2단계 체크: 1단계 상태에서 2단계 과목 A- 이상 3개 이수 → 2단계
    if(curLv === 1){
      const count2 = completedCourses.filter(cc=>{
        if(!GOOD.includes(cc.grade)) return false;
        const sm = COURSE_SKILL_MAP[cc.code];
        return sm && sm[sk] === 2;
      }).length;
      if(count2 >= 3){
        player.skills[sk] = 2;
        const meta = SKILL_META[sk];
        addLog(`${meta.icon} 스킬 해금: ${meta.label} 2단계!`, 'log-level');
        showSkillUnlockFx(sk, 2);
      }
      return;
    }

    // ── 3단계 체크: 2단계 상태에서 3단계 과목 A- 이상 3개 이수 → 3단계
    if(curLv === 2){
      const count3 = completedCourses.filter(cc=>{
        if(!GOOD.includes(cc.grade)) return false;
        const sm = COURSE_SKILL_MAP[cc.code];
        return sm && sm[sk] === 3;
      }).length;
      if(count3 >= 3){
        player.skills[sk] = 3;
        const meta = SKILL_META[sk];
        addLog(`${meta.icon} 스킬 해금: ${meta.label} 3단계!`, 'log-level');
        showSkillUnlockFx(sk, 3);
      }
    }
  });
}

// 성적 페널티 계산
// - 스킬 부족이 하나라도 있으면: 부족 스킬 중 가장 불리한 페널티 성적표 적용
// - 스킬 충족/초과 시: null → 기본 성적표 (보너스는 triggerSkillPassive에서 진도+1 확률로 처리)
