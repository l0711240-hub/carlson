function getAdjustedGradeMap(code){
  if(!player || !player.skills) return null;
  const sm = COURSE_SKILL_MAP[code];
  if(!sm) return null;

  // 강화 페널티 스킬: 통계·미시경제학·거시경제학·설계 (모든 통계 포함)
  const HARD_PENALTY_SKILLS = new Set(['통계','미시경제학','거시경제학','설계']);

  // ── 페널티 성적표 (스킬 부족) ──
  const GRADE_MAPS_DEFAULT = {
    'half_to_1': [[11,'A+'],[10,'A0'],[9,'A-'],[8,'B+'],[7,'B0'],[6,'B-'],[5,'C+'],[4,'C0'],[2,'C-'],[0,'F']],
    '0_to_1':    [[6,'A+'],[4,'A0'],[3,'A-'],[2,'B+'],[1,'B0'],[0,'B-']],
    '0_to_2':    [[13,'A+'],[12,'A0'],[11,'A-'],[10,'B+'],[9,'B0'],[8,'B-'],[7,'C+'],[6,'C0'],[4,'C-'],[3,'F']],
    '0_to_3':    [[15,'A+'],[14,'A0'],[13,'A-'],[12,'B+'],[11,'B0'],[10,'B-'],[9,'C+'],[8,'C0'],[5,'C-'],[0,'F']],
    '1_to_2':    [[6,'A+'],[4,'A0'],[3,'A-'],[2,'B+'],[1,'B0'],[0,'B-']],
    '1_to_3':    [[13,'A+'],[12,'A0'],[11,'A-'],[10,'B+'],[9,'B0'],[8,'B-'],[7,'C+'],[6,'C0'],[4,'C-'],[3,'F']],
    '2_to_3':    [[6,'A+'],[4,'A0'],[3,'A-'],[2,'B+'],[1,'B0'],[0,'B-']],
  };
  const GRADE_MAPS_HARD = {
    'half_to_1': [[11,'A+'],[10,'A0'],[9,'A-'],[8,'B+'],[7,'B0'],[6,'B-'],[5,'C+'],[4,'C0'],[2,'C-'],[0,'F']],
    '0_to_1':    [[15,'A+'],[14,'A0'],[13,'A-'],[12,'B+'],[11,'B0'],[10,'B-'],[9,'C+'],[8,'C0'],[6,'C-'],[0,'F']],
    '0_to_2':    [[17,'A+'],[16,'A0'],[15,'A-'],[14,'B+'],[13,'B0'],[12,'B-'],[11,'C+'],[10,'C0'],[8,'C-'],[0,'F']],
    '0_to_3':    [[20,'A+'],[18,'A0'],[17,'A-'],[16,'B+'],[15,'B0'],[14,'B-'],[13,'C+'],[12,'C0'],[10,'C-'],[0,'F']],
    '1_to_2':    [[13,'A+'],[12,'A0'],[11,'A-'],[10,'B+'],[9,'B0'],[8,'B-'],[7,'C+'],[6,'C0'],[4,'C-'],[0,'F']],
    '1_to_3':    [[15,'A+'],[14,'A0'],[13,'A-'],[12,'B+'],[11,'B0'],[10,'B-'],[9,'C+'],[8,'C0'],[6,'C-'],[0,'F']],
    '2_to_3':    [[13,'A+'],[12,'A0'],[11,'A-'],[10,'B+'],[9,'B0'],[8,'B-'],[7,'C+'],[6,'C0'],[4,'C-'],[0,'F']],
  };

  let worstPenaltyMap = null;
  let worstMin = -1;

  for(const [sk, lv] of Object.entries(sm)){
    if(lv === 0.5) continue;
    const playerLv = player.skills[sk] || 0;
    if(playerLv >= lv) continue; // 충족/초과는 페널티 없음

    let mapKey = null;
    if(playerLv === 0   && lv === 1) mapKey = '0_to_1';
    else if(playerLv === 0   && lv === 2) mapKey = '0_to_2';
    else if(playerLv === 0   && lv === 3) mapKey = '0_to_3';
    else if(playerLv === 0.5 && lv === 1) mapKey = 'half_to_1';
    else if(playerLv === 0.5 && lv === 2) mapKey = '0_to_2';
    else if(playerLv === 0.5 && lv === 3) mapKey = '0_to_3';
    else if(playerLv === 1   && lv === 2) mapKey = '1_to_2';
    else if(playerLv === 1   && lv === 3) mapKey = '1_to_3';
    else if(playerLv === 2   && lv === 3) mapKey = '2_to_3';

    if(mapKey){
      const maps = HARD_PENALTY_SKILLS.has(sk) ? GRADE_MAPS_HARD : GRADE_MAPS_DEFAULT;
      const m = maps[mapKey];
      const topMin = m[0][0];
      if(topMin > worstMin){ worstMin = topMin; worstPenaltyMap = m; }
    }
  }

  return worstPenaltyMap; // null이면 기본 성적표
}

// 스킬 해금 시각 효과
let _skillFxQueue = [];
let _skillFxTimer = 0;
function showSkillUnlockFx(sk, lv){
  _skillFxQueue.push({sk, lv, timer:180});
}

// 과목 출석 시 패시브 발동 체크 (과목 충돌 후 호출)
function triggerSkillPassive(courseEnt){
  if(!player || player.rankIdx !== 0) return;
  const cd = ALL_COURSES_WITH_POLISCI.find(x=>x.code===courseEnt.code);
  if(!cd) return;
  const cat = cd.category;
  const sm = COURSE_SKILL_MAP[courseEnt.code] || {};
  const hasQualitative = sm['질적연구'];

  // ── 스킬 초과 달성 진도 보너스 ──
  // 과목에 매핑된 스킬 중 플레이어가 초과 달성한 것 확인
  // playerLv > courseLv 인 스킬 각각에 대해 확률 진도+1
  // 같은 과목에 여러 스킬이 있으면 각 스킬별로 독립 발동
  // 규칙: 1단계 초과→25%, 2단계 초과(1→2)→? 등 playerLv - courseLv 차이 기반
  // 명세: 1단계에서 1단계 수업=25%, 2→1=50%, 2→2=25%, 3→1=100%, 3→2=50%, 3→3=25%
  for(const [sk, courseLv] of Object.entries(sm)){
    if(courseLv === 0.5) continue;
    const playerLv = player.skills[sk] || 0;
    if(playerLv < courseLv) continue; // 부족은 패스 (페널티 경로)
    // 충족 또는 초과: playerLv >= courseLv
    // diff = playerLv - courseLv (0=딱 맞음, 1=1단계 초과, 2=2단계 초과)
    const diff = playerLv - courseLv;
    let prob = 0;
    if(diff === 0 && courseLv === 1 && playerLv === 1) prob = 0.25; // 1단계에서 1단계
    else if(diff === 1 && courseLv === 1) prob = 0.50;              // 2단계에서 1단계
    else if(diff === 0 && courseLv === 2 && playerLv === 2) prob = 0.25; // 2단계에서 2단계
    else if(diff === 2 && courseLv === 1) prob = 1.00;              // 3단계에서 1단계
    else if(diff === 1 && courseLv === 2) prob = 0.50;              // 3단계에서 2단계
    else if(diff === 0 && courseLv === 3 && playerLv === 3) prob = 0.25; // 3단계에서 3단계

    if(prob > 0 && Math.random() < prob){
      courseEnt.hits = Math.min(courseEnt.maxHits, courseEnt.hits + 1);
      showSkillPassiveFx(sk, courseEnt.x, courseEnt.y);
      addLog(`${SKILL_META[sk]?.icon||'⭐'} ${SKILL_META[sk]?.label||sk} 스킬 보너스! ${courseEnt.name} 진도+1`, 'log-level');
    }
  }

  // ── 통계/GIS 패시브: 산림환경 or (지리+질적연구단계없음) → 확률 진도+1 ──
  if(STAT_GIS_PASSIVE_CATS.has(cat) && !hasQualitative){
    const statLv = player.skills['통계'];
    const prob = statLv===1?0.10:statLv===2?0.15:statLv===3?0.20:0;
    if(prob>0 && Math.random()<prob){
      courseEnt.hits = Math.min(courseEnt.maxHits, courseEnt.hits+1);
      showSkillPassiveFx('통계', courseEnt.x, courseEnt.y);
      addLog(`📊 통계 스킬 발동! ${courseEnt.name} 진도+1`,'log-level');
    }
    const gisLv = player.skills['GIS'];
    const gisProb = gisLv===1?0.10:gisLv===2?0.15:gisLv===3?0.20:0;
    if(gisProb>0 && Math.random()<gisProb){
      courseEnt.hits = Math.min(courseEnt.maxHits, courseEnt.hits+1);
      showSkillPassiveFx('GIS', courseEnt.x, courseEnt.y);
      addLog(`🗺️ GIS 스킬 발동! ${courseEnt.name} 진도+1`,'log-level');
    }
  }

  // ── 일본어 패시브: japan/japan_studies 계열에서 10% 확률 진도+1 ──
  if((cat==='japan'||cat==='japan_studies') && player.skills['일본어']>=1){
    if(Math.random()<0.10){
      courseEnt.hits = Math.min(courseEnt.maxHits, courseEnt.hits+1);
      showSkillPassiveFx('일본어', courseEnt.x, courseEnt.y);
      addLog(`🈶 일본어 스킬 발동! ${courseEnt.name} 진도+1`,'log-level');
    }
  }
}

// 패시브 발동 시각 효과 — DOM 기반 플로팅 (Canvas 이모지 렌더 불안정 문제 해결)
let _passiveFxList = [];
