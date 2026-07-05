const JAPAN_STUDIES_COURSES = [
  // 전공필수 (연계전공 자체 개설)
  {code:'M3236.000100', name:'일본학 입문',               credit:3, category:'japan_studies', type:'required_jstudies', semester:[1], everyTerm:true},
  {code:'M3716.000100', name:'현대 일본의 쟁점',          credit:3, category:'japan_studies', type:'normal', semester:[2], everyTerm:true},
  // 2학년 (역사학부 개설 — history 카테고리이지만 일본학 탭에도 표시)
  {code:'114.325',      name:'일본종교',                   credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'111.326',      name:'일본근대국가의 성립과 전개', credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'206.219B',     name:'일본문화의 이해',            credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'216A.207',     name:'일본정치론',                 credit:3, category:'japan_studies', type:'normal', semester:[2], everyTerm:true},
  // 3학년
  {code:'111.415',      name:'20세기 일본의 역사',         credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'M1249.000200', name:'일본의 국가와 문화',         credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'1003.373A',    name:'일본의 사상과 문명',         credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'205.345A',     name:'일본과 동아시아',            credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'111.227A',     name:'일본의 무사사회',            credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'M3236.000200', name:'일본 시민사회',              credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'216B.341',     name:'일본과 국제관계',            credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'1003.301',     name:'일본고전문학',               credit:3, category:'japan_studies', type:'normal', semester:[1]},
  // 4학년
  {code:'1003.275',     name:'일본문헌강독 1',             credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'1003.276',     name:'일본문헌강독 2',             credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'M3236.000300', name:'일본의 경제성장과 산업발달', credit:3, category:'japan_studies', type:'normal', semester:[2]},
  // 추가 전공선택
  {code:'100.171',      name:'일본문명의 이해',            credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'1003.371A',    name:'일본근대문학',               credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'M2169.009200', name:'일본 근대 시각문화',         credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'1003.473',     name:'일본문명특강',               credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'1003.274',     name:'일본 전통 문화와 예술',      credit:3, category:'japan_studies', type:'normal', semester:[2]},
  {code:'M2753.000400', name:'전후 일본 문화와 예술',      credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'M2753.000200', name:'전후 일본사회와 영화',       credit:3, category:'japan_studies', type:'normal', semester:[1]},
  {code:'M1321.002000', name:'한일관계론',                 credit:3, category:'japan_studies', type:'normal', semester:[2]},
];

// 연계전공 일본학의 인문대 개설 6학점 요건 과목 코드
// (역사학부, 아시아언어문명학부, 종교학과 개설 과목)
