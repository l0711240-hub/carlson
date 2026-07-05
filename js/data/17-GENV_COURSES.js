// ══════════════════════════════════════════════════════
// 연합전공 글로벌환경경영학 (genv)
// type: 'required_genv'(전필) | 'normal'
// subtype: 'sci'(과학기술) | 'hum'(인문사회)
// ══════════════════════════════════════════════════════
const GENV_COURSES = [
  // ── 자체 개설 (538.xxx / M1729.xxx / M3713.xxx) ──────────────────────
  // 2학년 1학기
  {code:'538.304',       name:'환경심리학',                    credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[1]},
  {code:'538.305',       name:'지구환경과 에너지문제',         credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[1]},
  {code:'538.403',       name:'생활속의 생태학',               credit:3, category:'genv', type:'normal',        subtype:'sci',  semester:[1]},
  {code:'M1729.001300',  name:'환경경영을 위한 경제원론 1',   credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[1]},
  // 2학년 2학기
  {code:'538.402',       name:'환경정책입문',                  credit:3, category:'genv', type:'required_genv', subtype:'hum',  semester:[2]},
  // 3학년 1학기
  {code:'538.301',       name:'환경경영학',                    credit:3, category:'genv', type:'required_genv', subtype:'hum',  semester:[1]},
  {code:'538.406',       name:'국제환경기구론',                credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[1]},
  {code:'M1729.000700',  name:'산림환경과 식약용식물학',       credit:3, category:'genv', type:'normal',        subtype:'sci',  semester:[1]},
  {code:'M1729.001400',  name:'개발경제학과 환경경영',         credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[1]},
  // 3학년 2학기
  {code:'538.303',       name:'지구화시대의 환경과 사회',      credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[2]},
  {code:'538.306',       name:'기업과 사회적 책임',            credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[2]},
  {code:'M1729.001200',  name:'지속가능교통체계',              credit:3, category:'genv', type:'normal',        subtype:'sci',  semester:[2]},
  {code:'M1729.001500',  name:'환경경영을 위한 효과성평가',   credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[2]},
  // 4학년 1학기
  {code:'538.404',       name:'환경경영 실습(인턴과정)',       credit:3, category:'genv', type:'required_genv', subtype:'sci',  semester:[1]},
  {code:'M3713.000400',  name:'글로벌환경경영 특강',           credit:3, category:'genv', type:'required_genv', subtype:'hum',  semester:[1]},
  {code:'M1729.000500',  name:'기후경제의 이해',               credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[1]},
  {code:'M1729.001100',  name:'환경경영과 지속가능성 분석',    credit:3, category:'genv', type:'required_genv', subtype:'hum',  semester:[1]},
  // 4학년 2학기
  {code:'538.302A',      name:'생태철학과 환경윤리',           credit:3, category:'genv', type:'normal',        subtype:'hum',  semester:[2]},
  {code:'538.309',       name:'환경 분석 및 계획',             credit:3, category:'genv', type:'normal',        subtype:'sci',  semester:[2]},
  {code:'M1729.000900',  name:'환경경영과 경관계획',           credit:3, category:'genv', type:'normal',        subtype:'sci',  semester:[2]},
  {code:'M1729.001600',  name:'건설환경시스템 지속가능공학',   credit:3, category:'genv', type:'normal',        subtype:'sci',  semester:[2]},
];

// 이공계 타전공 과목 (글로벌환경경영학 인정, 학과별 별도 탭)
// 각 학과별 과목 배열 (글로벌환경경영학 인정 타전공 과목들)
// category는 학과 단축명, genvOk:true 로 genv 인정 표시
