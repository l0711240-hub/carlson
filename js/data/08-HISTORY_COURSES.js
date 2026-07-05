const HISTORY_COURSES = [
  // 일본사 (일본언어문명 전공선택 인정용)
  {code:'M3545.002400', name:'개관일본사',    credit:3, category:'history', type:'normal', semester:[2], everyTerm:true},
  {code:'M3545.000500', name:'일본근현대사1', credit:3, category:'history', type:'normal', semester:[2], everyTerm:true},
  {code:'M3545.000700', name:'일본사특강',    credit:3, category:'history', type:'normal', semester:[1], everyTerm:true},
  {code:'M3545.000600', name:'일본근현대사2', credit:3, category:'history', type:'normal', semester:[1]},
  // 한국사·서양사 (정치외교학부 전공선택 인정용)
  {code:'100.134',  name:'20세기한국사',             credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'109.222',  name:'한국근대사',                credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
  {code:'109.409',  name:'한국독립운동사',            credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
  {code:'109.416',  name:'한국현대사',                credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'111.326',  name:'일본근대국가의 성립과 전개', credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'111.413',  name:'근대중국의 개혁과 혁명',    credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
  {code:'112.206',  name:'미국사',                   credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
  {code:'112.207',  name:'영국사',                   credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'112.211',  name:'서양근대사2: 긴 19세기의 역사', credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'112.310',  name:'독일사',                   credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
  {code:'112.311',  name:'프랑스사',                 credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'112.323',  name:'20세기 전반의 역사',        credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
  {code:'112.324',  name:'20세기 후반의 역사',        credit:3, category:'history', type:'normal', semester:[2], polisciOk:true},
  {code:'112.405',  name:'러시아사',                 credit:3, category:'history', type:'normal', semester:[1], polisciOk:true},
];

// ── 아시아언어문명학부 일본언어문명 전공 ─────────────────
// category: 'japan'
// type: 'required_japan'(전공필수) | 'normal'
