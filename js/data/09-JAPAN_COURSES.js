const JAPAN_COURSES = [
  // ── 전공필수 ──
  {code:'1003.221',     name:'아시아문명론입문',    credit:3, category:'japan', type:'required_japan', semester:[1], everyTerm:true},
  {code:'M2641.000300', name:'아시아연구지도',       credit:3, category:'japan', type:'required_japan', semester:[1]},
  // ── 1학년 ──
  {code:'1003.271',     name:'집중일본어 1',         credit:3, category:'japan', type:'normal', semester:[1], everyTerm:true},
  {code:'1003.272',     name:'집중일본어 2',         credit:3, category:'japan', type:'normal', semester:[2], everyTerm:true},
  {code:'100.171',      name:'일본문명의 이해',       credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'M2169.009200', name:'일본 근대 시각문화',   credit:3, category:'japan', type:'normal', semester:[2]},
  // ── 2학년 ──
  {code:'1003.275',     name:'일본문헌강독 1',       credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'M2753.000400', name:'전후 일본 문화와 예술',credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'1003.321',     name:'아시아문명교류사',      credit:3, category:'japan', type:'normal', semester:[2]},
  {code:'1003.276',     name:'일본문헌강독 2',       credit:3, category:'japan', type:'normal', semester:[2]},
  {code:'1003.274',     name:'일본 전통 문화와 예술',credit:3, category:'japan', type:'normal', semester:[2]},
  // ── 3학년 ──
  {code:'1003.301',     name:'일본고전문학',          credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'1003.371A',    name:'일본근대문학',          credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'M2753.000200', name:'전후 일본사회와 영화',  credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'1003.421',     name:'아시아문명연구의 시각', credit:3, category:'japan', type:'normal', semester:[2]},
  {code:'1003.375',     name:'일본현대소설',          credit:3, category:'japan', type:'normal', semester:[2]},
  {code:'1003.373A',    name:'일본의 사상과 문명',    credit:3, category:'japan', type:'normal', semester:[2]},
  // ── 4학년 ──
  {code:'M2641.000301', name:'아시아연구지도(4학년)', credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'1003.474',     name:'일본문헌 번역연습',     credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'M2753.000100', name:'일본론 특강',           credit:3, category:'japan', type:'normal', semester:[1]},
  {code:'1003.473',     name:'일본문명특강',          credit:3, category:'japan', type:'normal', semester:[2]},
];

// 일본언어문명 전공선택 인정 타과 과목 코드 (정치외교학부 2개 + 역사학부, 최대 3과목 = 9학점)
