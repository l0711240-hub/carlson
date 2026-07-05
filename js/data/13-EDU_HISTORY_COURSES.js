const EDU_HISTORY_COURSES = [
  {code:'EDU.HIS.001', name:'아시아지역사특강', credit:3, category:'edu_history', type:'normal', semester:[1]},
];

// ── 역사학부 추가 과목 (연계전공 일본학 타과인정) ─────────────
const HISTORY_EXTRA_COURSES = [
  {code:'HIS.ECOHIS', name:'동양사회경제사', credit:3, category:'history', type:'normal', semester:[2]},
];

// ── 연계전공 과학기술학 과목 ──────────────────────────────
// ── 지리교육과 ──────────────────────────────────────────
// category: 'geoedu'
// 사회교육과에서 최대 9학점 전공학점 인정 (GEO_CROSSOVER_EDU_CODES)
const GEOEDU_COURSES = [
  // 1학년
  {code:'700.132', name:'자연지리학',           credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'700.108', name:'환경과 지리',           credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'700.131', name:'인문지리학',            credit:3, category:'geoedu', type:'normal', semester:[2]},
  // 2학년
  {code:'713.214', name:'기후환경론',            credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.226A',name:'인구지리학개론',        credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.315', name:'문화역사지리학',        credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'700.231', name:'지도학',               credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.211', name:'지형학원론',            credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.432', name:'지리정보체계와 지리교육',credit:3, category:'geoedu', type:'normal', semester:[2]},
  // 3학년
  {code:'700.331', name:'한국지리',              credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.427', name:'아메리카지역연구',      credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.437', name:'토양 및 생태지리학',    credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.431', name:'원격탐사와 지리자료분석',credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.228', name:'경제지리교육론',        credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.324A',name:'관광지리',             credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.422', name:'자연지리실습',          credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.436', name:'공간분석과 지리교육',   credit:3, category:'geoedu', type:'normal', semester:[2]},
  // 4학년
  {code:'713.414A',name:'지리사상사',            credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'700.431', name:'세계지리',              credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.421', name:'아시아지역연구',        credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.420', name:'유럽지역연구',          credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.426', name:'아프리카·오세아니아지역연구', credit:3, category:'geoedu', type:'normal', semester:[1]},
  {code:'713.416', name:'정치지리학개론',        credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.417', name:'경제활동과 입지',       credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.434', name:'사회지리교육론',        credit:3, category:'geoedu', type:'normal', semester:[2]},
  {code:'713.435', name:'교통지리교육론',        credit:3, category:'geoedu', type:'normal', semester:[2]},
];

// 지리교육과 과목 중 사회교육과 전공학점 인정 코드 (최대 9학점)
