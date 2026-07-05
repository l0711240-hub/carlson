const EARTH_COURSES = [ // 지구환경과학부
  {code:'3345.311',     name:'환경지구학',                   credit:3, category:'earth',   type:'normal', subtype:'sci', genvOk:true, semester:[1]},
];
const LIFESCI_COURSES = [ // 생명과학부
  {code:'3346.415',     name:'생태학',                       credit:3, category:'lifesci', type:'normal', subtype:'sci', genvOk:true, semester:[1]},
];
const AGROBIO_COURSES = [ // 응용생물화학부
  {code:'519.203',      name:'토양학',                       credit:3, category:'agrobio', type:'normal', subtype:'sci', genvOk:true, semester:[1]},
  {code:'519.251',      name:'일반생태학',                    credit:3, category:'agrobio', type:'normal', subtype:'sci', genvOk:true, semester:[2]},
];

// 기존 forest/land/agri 과목 중 genv 인정 과목에 genvOk 속성 후부여
const GENV_EXTRA_OK_CODES = new Set([
  '5241.311','M1698.001200','5241.215A','5241.416A','M1698.000600', // forest
  '5271.225', // land
  '5201.404', // agri
]);

// 글로벌환경경영학 크로스리스팅 맵: genv코드 → 동일과목으로 취급되는 타전공 코드
// 크로스리스팅된 과목은 한 쪽만 수강 가능 (동시/순차 모두 불가)
