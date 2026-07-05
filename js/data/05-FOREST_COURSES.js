const FOREST_COURSES = [
  // 1학년 2학기
  {code:"500.170", name:"산림과학개론", credit:2, category:"forest", type:"normal", semester:[2]},
  // 2학년 1학기
  {code:"500.305", name:"식물분류학 및 실험", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"5241.211", name:"야생동물학 및 실습", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"5241.214A", name:"산림생태학 및 실습", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"M1698.000400", name:"산림곤충학 및 실험", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"M1698.001100", name:"수목학", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"M1698.002000", name:"산림식약용식물학", credit:3, category:"forest", type:"normal", semester:[1]},
  // 2학년 2학기
  {code:"5241.219", name:"산림토양학 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"5241.220", name:"산림지리정보학 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.002400", name:"생태수문학 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.002700", name:"산림평가학 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.002800", name:"산림치유복지학", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.003100", name:"스마트산림종자학", credit:3, category:"forest", type:"normal", semester:[2]},
  // 3학년 1학기
  {code:"5241.311", name:"생태경제학 및 실습", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"5241.315B", name:"생태관광 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"5241.417", name:"산림환경학연구", credit:1, category:"forest", type:"required_forest", semester:[1]},
  {code:"M1698.000100", name:"산림생명공학 및 실험", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"M1698.001200", name:"조림학 및 실습", credit:3, category:"forest", type:"required_forest", semester:[1]},
  {code:"M1698.003000", name:"경관생태관리 및 실습", credit:3, category:"forest", type:"normal", semester:[1]},
  // 3학년 2학기
  {code:"5241.215A", name:"보전생물학 및 실험", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"5241.218", name:"국제자연환경관리실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"5241.317", name:"삼림유전육종학 및 실험", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"5241.321", name:"수목생리학", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.000200", name:"산림보호학 및 실험", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.001600", name:"산림경관조사 및 분석", credit:3, category:"forest", type:"normal", semester:[2]},
  // 4학년 1학기
  {code:"5241.415", name:"도시수목보호관리학 및 실험", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"M1698.002300", name:"산림복원공학 및 실습", credit:3, category:"forest", type:"normal", semester:[1]},
  {code:"M1698.002900", name:"산림경영학 및 실습", credit:3, category:"forest", type:"required_forest", semester:[1]},
  {code:"M1698.003200", name:"산림환경과 ESG 경영", credit:3, category:"forest", type:"normal", semester:[1]},
  // 4학년 2학기
  {code:"5241.412", name:"야생동물보전관리학 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"5241.418B", name:"보호지역과 사회", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.000600", name:"산림정책학 및 실습", credit:3, category:"forest", type:"normal", semester:[2]},
  {code:"M1698.001900", name:"학술림 연구 및 실습", credit:3, category:"forest", type:"required_forest", semester:[2]},
  {code:"M1698.002500", name:"산림경관보전계획", credit:3, category:"forest", type:"normal", semester:[2]},
];

// ── 정치외교학부 과목 ──────────────────────────────────
// category: 'polisci'
// subtype: 'polisci_a'(정치학전공) | 'polisci_b'(외교학전공) | 'polisci_common'(학부공통)
// division_pol: 'ga'(가군) | 'na'(나군) | 'da'(다군) | 'required'(전필) | 'elective'(전선)
