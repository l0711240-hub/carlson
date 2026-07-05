const GEO_EDU_CROSSOVER_CODES = [
  '700.132','700.108','700.131','713.214','713.226A','713.315',
  '700.231','713.211','713.432','700.331','713.427',
  '713.437','713.431','713.228','713.324A','713.422','713.436',
  '713.414A','700.431','713.421','713.420','713.426',
  '713.416','713.417','713.434','713.435',
];

const STS_COURSES = [
  {code:'STS.001', name:'동아시아의 과학, 전통과 현대', credit:3, category:'sts', type:'normal', semester:[1]},
];

// ── 선택교양 ─────────────────────────────────────────────
// category: 'elective'
// 학생자율연구1·2 제외 전부 S/U (1회 접촉→S)
// 학생자율연구1·2는 A~F (학문의세계 방식, minPick:1 기본)
const ELECTIVE_COURSES = [
  // 체육 (1학점, S/U)
  {code:'051.003', name:'축구',           credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.004', name:'배구',           credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.005', name:'양궁',           credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.006', name:'야구',           credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.018', name:'체력단련',       credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.019', name:'테니스초급',     credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.023', name:'댄스스포츠',     credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.024', name:'농구초급',       credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.025', name:'배드민턴초급',   credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'051.026', name:'탁구초급',       credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  {code:'L0652.000200', name:'달리기와 건강', credit:1, category:'elective', type:'S', subcat:'sport', everyTerm:true},
  // 예술 실기 (S/U)
  {code:'052.002', name:'수묵화의 기초', credit:2, category:'elective', type:'S', subcat:'art', everyTerm:true},
  {code:'052.003', name:'수채화의 기초', credit:2, category:'elective', type:'S', subcat:'art', everyTerm:true},
  {code:'052.004', name:'소묘의 기초',   credit:2, category:'elective', type:'S', subcat:'art', everyTerm:true},
  {code:'052.010', name:'교양연주-단소', credit:1, category:'elective', type:'S', subcat:'art', everyTerm:true},
  // 대학과 리더십 (S/U)
  {code:'E20.101', name:'대학생활과 진로탐색', credit:2, category:'elective', type:'S', subcat:'leadership', semester:[1]},
  {code:'E20.106', name:'자기주도 학습설계', credit:2, category:'elective', type:'S', subcat:'leadership', everyTerm:true},
  {code:'053.011', name:'사회봉사 2', credit:1, category:'elective', type:'S', subcat:'leadership', everyTerm:true},
  {code:'053.003', name:'사회봉사 1',        credit:1, category:'elective', type:'S', subcat:'leadership', everyTerm:true},
  // 창의와 융합
  {code:'054.001', name:'학생자율연구 1', credit:2, category:'elective', type:'normal', subcat:'creative', everyTerm:true}, // A~F
  {code:'054.002', name:'학생자율연구 2', credit:2, category:'elective', type:'normal', subcat:'creative', everyTerm:true}, // A~F, prereq: 054.001 A+
  {code:'054.006', name:'인하 모둠강좌(융합)', credit:3, category:'elective', type:'S', subcat:'creative', everyTerm:true},
];

// ── 조경·지역시스템공학부 조경학 전공 ──────────────────
// category: 'land'
// type: 'required_land'(전공필수) | 'normal' | 'studio'(졸업작품스튜디오/논문세미나)
