// ══════════════════════════════════════════════════════
// SEMESTER COURSE SYSTEM
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
// 연구 패널 (수강신청 내 교수 컨택 / 학부생 인턴)
// ══════════════════════════════════════════════════════

// 컨택 가능한 전공별 정보
const RESEARCH_DEPTS = [
  { id:'geo',          name:'사회교육학과 (사회과교육)',          cat:'geo' },
  { id:'agri',         name:'농경제 교직과정',  cat:'agri' },
  { id:'econ',         name:'사회교육학과 (경제)',           cat:'econ' },
  { id:'forest',       name:'산림환경학',         cat:'forest' },
  { id:'polisci',      name:'사회교육학과 (정치)',       cat:'polisci' },
  { id:'japan',        name:'일본언어문명학부',   cat:'japan' },
  { id:'japan_studies',name:'연계전공 일본학',    cat:'japan_studies' },
  { id:'land',         name:'조경학',             cat:'land' },
];

// ── 계절학기 개설 과목 코드 ──────────────────────────────
// 경제학부
const SEASONAL_ECON_CODES = new Set([
  '200.105','200.106', // 경제원론1·2 (학문의기초/경제학부 공유)
  'M2649.001100','M2649.001200', // 경제원론1·2 (교직과정 코드)
  '212.214',   // 경제수학
  '212.204',   // 경제통계학
  '212.203',   // 경제사
  '212.301',   // 계량경제학
  '212.201',   // 미시경제이론
  '212.202',   // 거시경제이론
]);
// 학문의세계 계절학기 개설
const SEASONAL_LIBERAL_CODES = new Set([
  'L0547.001500', // 한국현대사의이해
  'L0547.001600', // 남북분단과한국전쟁
  'L0547.001700', // 근현대한국민족주의
  '041.040',      // 언어의세계
  '044.010',      // 경제학개론
  '045.012',      // 심리학개론
  '044.007',      // 국제정치학입문
  'E11.128',      // 북한학개론
  'C20.151',      // 한국의문화유산
  'E11.188',      // 현대문화와기독교
  'L0546.000500', // 공연예술의이해
  'C20.132',      // 인물로본한국사
  '043.074',      // 동서양의종교적지혜
]);
// 학문의기초 계절학기
const SEASONAL_BASIC_CODES = new Set([
  '034.029',  // 생물학
  'LIB009',   // 대학글쓰기1
  'LIB003','LIB004','LIB005','LIB006','LIB007','LIB008', // 제2외국어
  'LIB002',   // 대학영어
]);

function renderResearchPanel(){
  const el = document.getElementById('reg-course-list');
  if(!el) return;

  const plan = player.researchPlan || [];
  const cH = player.contactHistory || {};
  const iH = player.internHistory  || {};

  function hasCoursesInDept(cat){
    const inCompleted = completedCourses.some(c=>c.category===cat&&c.grade!=='F');
    const inEnrolled  = enrolledCodes.some(code=>{
      const c=ALL_COURSES_WITH_POLISCI.find(x=>x.code===code);
      return c&&c.category===cat;
    });
    return inCompleted||inEnrolled;
  }

  // 전체 이력 요약
  const totalContact = Object.keys(cH).length;
  const totalIntern  = Object.keys(iH).length;

  let html = `<div style="font-size:9px;color:var(--dim);margin-bottom:8px;line-height:1.6;padding:6px 8px;background:#f0f4fb;border-radius:5px">
    해당 전공 수업 수강 후 교수 컨택 신청 가능 · 컨택 완수 후 학부생 인턴 신청 가능 · 각 10회 접촉으로 완수<br>
    <span style="color:#22c55e">교수 컨택 완수 전공: ${totalContact}개</span>
    &nbsp;|&nbsp;
    <span style="color:#60a5fa">학부생 인턴 완수 전공: ${totalIntern}개</span>
  </div>`;

  for(const dept of RESEARCH_DEPTS){
    const hasCourse      = hasCoursesInDept(dept.cat);
    const contactRec     = cH[dept.id];   // {done,year,sem} or truthy
    const internRec      = iH[dept.id];
    const contactThisSem = plan.some(p=>p.dept===dept.id&&p.type==='contact');
    const internThisSem  = plan.some(p=>p.dept===dept.id&&p.type==='intern');

    const canContact = hasCourse && !contactThisSem && !contactRec;
    const canReContact = hasCourse && !contactThisSem && contactRec; // 이미 했지만 재신청 가능
    const canIntern  = contactRec && !internThisSem && !internRec;
    const canReIntern = contactRec && !internThisSem && internRec;

    // 카드 테두리 색상: 둘 다 완수=초록, 컨택만=노랑, 없음=기본
    const borderCol = (contactRec&&internRec) ? '#22c55e' : contactRec ? '#fbbf24' : 'var(--border)';
    const nameCol   = hasCourse ? '#e2e8f0' : '#475569';

    // 완수 배지
    const contactBadge = contactRec
      ? `<span style="background:#052e16;color:#22c55e;font-size:7px;border-radius:3px;padding:1px 4px;margin-left:4px">🤝 컨택완료${contactRec.year?` (${contactRec.year}학년 ${contactRec.sem}학기)`:''}</span>`
      : contactThisSem
        ? `<span style="background:#1c1917;color:#f97316;font-size:7px;border-radius:3px;padding:1px 4px;margin-left:4px">⏳ 이번학기 진행중</span>`
        : '';
    const internBadge = internRec
      ? `<span style="background:#0c1a2e;color:#60a5fa;font-size:7px;border-radius:3px;padding:1px 4px;margin-left:4px">🔬 인턴완료${internRec.year?` (${internRec.year}학년 ${internRec.sem}학기)`:''}</span>`
      : internThisSem
        ? `<span style="background:#0c1a2e;color:#60a5fa;font-size:7px;border-radius:3px;padding:1px 4px;margin-left:4px">⏳ 이번학기 진행중</span>`
        : '';

    // 버튼 영역
    let contactBtn = '';
    if(canContact||canReContact){
      contactBtn = `<button class="btn btn-sm" style="font-size:9px;background:${canReContact?'#e0e7ff':'#4f46e5'};color:${canReContact?'#3730a3':'#fff'}" onclick="addResearchPlan('${dept.id}','contact')">🤝 ${canReContact?'재컨택':'교수 컨택'}</button>`;
    } else if(contactThisSem){
      contactBtn = `<button class="btn btn-sm" style="font-size:9px;background:#f0f2f8;color:#555;border:1px solid #dde3f0" onclick="removeResearchPlan('${dept.id}','contact')">✕ 취소</button>`;
    } else if(!hasCourse){
      contactBtn = `<span style="font-size:8px;color:#94a3b8">수업 없음</span>`;
    }

    let internBtn = '';
    if(canIntern||canReIntern){
      internBtn = `<button class="btn btn-sm" style="font-size:9px;background:${canReIntern?'#d1fae5':'#059669'};color:${canReIntern?'#065f46':'#fff'}" onclick="addResearchPlan('${dept.id}','intern')">🔬 ${canReIntern?'재인턴':'학부생 인턴'}</button>`;
    } else if(internThisSem){
      internBtn = `<button class="btn btn-sm" style="font-size:9px;background:#f0f2f8;color:#555;border:1px solid #dde3f0" onclick="removeResearchPlan('${dept.id}','intern')">✕ 취소</button>`;
    } else if(!contactRec){
      internBtn = `<span style="font-size:8px;color:#94a3b8">컨택 필요</span>`;
    }

    html += `<div style="background:#fff;border:1px solid ${borderCol};border-radius:8px;padding:10px 12px;margin-bottom:6px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
        <div style="min-width:0">
          <div style="font-size:11px;color:${nameCol};font-weight:700;display:flex;align-items:center;flex-wrap:wrap;gap:2px">
            ${dept.name}${contactBadge}${internBadge}
          </div>
        </div>
        <div style="display:flex;gap:5px;flex-shrink:0">
          ${contactBtn}${internBtn}
        </div>
      </div>
    </div>`;
  }

  // 이번 학기 신청 요약
  if(plan.length>0){
    html += `<div style="margin-top:8px;padding:7px 10px;background:#f0f4fb;border:1px solid #dde3f0;border-radius:5px;font-size:9px">
      <b style="color:#003092">📋 이번 학기 신청:</b><br>
      ${plan.map(p=>{
        const d=RESEARCH_DEPTS.find(x=>x.id===p.dept);
        return `<span style="color:${p.type==='contact'?'#d97706':p.type==='intern'?'#0369a1':'#7c3aed'}">${p.type==='contact'?'🤝':p.type==='intern'?'🔬':'📄'} ${d?.name||p.dept} ${p.type==='contact'?'교수컨택':p.type==='intern'?'학부생인턴':'연구계획'}</span>`;
      }).join('&nbsp;&nbsp;')}
    </div>`;
  }

  // ── 연구계획 섹션 (학생자율연구 수강 조건) ──
  const anyContact = Object.keys(player.contactHistory||{}).length > 0;
  const planDone   = player.researchPlanDone || false;
  const planDept   = player.researchPlanDept || null; // 연구계획 제출 전공
  const planHits   = player.researchPlanHits || 0;
  const planThisSem = plan.some(p=>p.type==='research_plan');
  const planDeptName = planDept ? (RESEARCH_DEPTS.find(d=>d.id===planDept)?.name || planDept) : '';

  // 컨택 완수 전공 목록 (연구계획 전공 선택 드롭다운용)
  const contactedDepts = RESEARCH_DEPTS.filter(d=>(player.contactHistory||{})[d.id]);

  html += `<div style="margin-top:10px;padding:8px 10px;background:#f0f4fb;border:1px solid ${planDone?'#c4b5fd':'#dde3f0'};border-radius:6px">
    <div style="font-size:11px;color:${planDone?'#a78bfa':'#94a3b8'};font-weight:700;margin-bottom:4px">
      📄 연구계획 ${planDone
        ? `<span style="color:#22c55e;font-size:9px">✓ 완수</span>${planDeptName?` <span style="color:#a78bfa;font-size:9px">[${planDeptName}]</span>`:''}`
        : planHits>0 ? `<span style="color:#fbbf24;font-size:9px">(${planHits}/3회)</span>` : ''}
    </div>
    <div style="font-size:8px;color:#666;margin-bottom:6px">교수 컨택 완수 후 전공을 선택하여 신청 · 3회 접촉으로 완수 · 완수 시 학생자율연구 1·2 수강 가능<br>
    ⭐ 연구계획 전공 = 학생자율연구 이수 시 해당 전공 대학원 입시 가산점 적용</div>
    ${planDone
      ? `<span style="font-size:8px;color:#22c55e">✓ 연구계획 완수 [${planDeptName}] — 학생자율연구 수강 가능</span>`
      : anyContact && !planThisSem
        ? `<div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
           <select id="research-plan-dept-select" style="font-size:9px;background:#fff;color:#1a1a2e;border:1px solid #dde3f0;border-radius:4px;padding:2px 6px">
             ${contactedDepts.map(d=>`<option value="${d.id}">${d.name}</option>`).join('')}
           </select>
           <button class="btn btn-sm" style="font-size:9px;background:#4c1d95" onclick="addResearchPlanItem()">📄 연구계획 신청</button>
           </div>`
        : planThisSem
          ? `<span style="color:#a78bfa;font-size:8px">⏳ 이번 학기 진행 중 (${planHits}/3회)</span>
             <button class="btn btn-sm" style="font-size:9px;background:#f0f2f8;color:#555;border:1px solid #dde3f0;margin-left:6px" onclick="removeResearchPlanItem()">✕ 취소</button>`
          : `<span style="font-size:8px;color:#94a3b8">교수 컨택 필요</span>`
    }
  </div>`;

  el.innerHTML = html;
}
