const LAND_COURSES = [
  // 1학년
  {code:'500.173',      name:'조경·지역시스템공학개론', credit:2, category:'land', type:'normal',       semester:[1]},
  // 2학년 1학기 전공필수
  {code:'5271.212A',    name:'조경식물재료학',          credit:3, category:'land', type:'required_land', semester:[1]},
  {code:'5271.213',     name:'조경컴퓨터그래픽',         credit:3, category:'land', type:'required_land', semester:[1]},
  {code:'5271.214A',    name:'공간디자인',               credit:3, category:'land', type:'required_land', semester:[1]},
  {code:'5271.221B',    name:'GIS와 계량분석실습',       credit:3, category:'land', type:'required_land',       semester:[1]},
  // 2학년 2학기 전공필수
  {code:'5271.226',     name:'서양조경의 역사와 이론',   credit:3, category:'land', type:'required_land',       semester:[2]},
  {code:'5271.227',     name:'조경생태분석',             credit:3, category:'land', type:'required_land', semester:[2]},
  {code:'5271.324',     name:'조경설계1',                credit:3, category:'land', type:'required_land', semester:[2],
    prereqs:['5271.214A']},
  {code:'5271.411',     name:'도시조경론',               credit:3, category:'land', type:'normal',       semester:[2]},
  // 3학년 1학기 전공필수
  {code:'5271.224A',    name:'조경공학',                 credit:3, category:'land', type:'required_land', semester:[1]},
  {code:'5271.311',     name:'조경계획',                 credit:3, category:'land', type:'required_land', semester:[1],
    prereqs:['5271.324']},
  {code:'5271.321',     name:'공원녹지계획',              credit:3, category:'land', type:'required_land', semester:[1]},
  {code:'5271.422',     name:'조경미학',                 credit:3, category:'land', type:'required_land', semester:[1]},
  {code:'5271.211A',    name:'조경드로잉 및 매체',       credit:3, category:'land', type:'normal',       semester:[1]},
  // 3학년 2학기 전공필수
  {code:'5271.225',     name:'경관생태학',               credit:3, category:'land', type:'required_land',       semester:[2]},
  {code:'5271.323A',    name:'동양조경의 역사와 이론',   credit:3, category:'land', type:'required_land', semester:[2]},
  {code:'5271.412',     name:'조경설계2',                credit:3, category:'land', type:'required_land', semester:[2],
    prereqs:['5271.311']},
  {code:'5271.414',     name:'조경적산 및 경영분석',     credit:3, category:'land', type:'normal',       semester:[2]},
  {code:'M1707.000500', name:'조경 계량분석기법',        credit:3, category:'land', type:'normal',       semester:[2]},
  // 4학년 1학기
  {code:'5271.313A',    name:'통합환경설계',             credit:3, category:'land', type:'normal',       semester:[1]},
  // 환경복원계획 제거됨
  {code:'M1707.000300', name:'졸업작품스튜디오 1',       credit:3, category:'land', type:'land_thesis',   semester:[1],
    prereqs:['5271.412'], studioGroup:'graduation'},
  {code:'M1707.001000', name:'졸업논문세미나 1',         credit:3, category:'land', type:'land_thesis',   semester:[1],
    studioGroup:'graduation'},
  {code:'5271.413',     name:'지속가능환경계획론',        credit:3, category:'land', type:'normal',       semester:[1]},
  {code:'M1707.000100', name:'문화경관론',               credit:3, category:'land', type:'normal',       semester:[1]},
  // 4학년 2학기
  {code:'5271.215',     name:'조경재료 및 시공',          credit:3, category:'land', type:'normal',       semester:[2]},
  {code:'5271.312',     name:'식재설계',                 credit:3, category:'land', type:'normal',       semester:[2]},
  {code:'M1707.000400', name:'졸업작품스튜디오 2',       credit:3, category:'land', type:'land_thesis',   semester:[2],
    prereqs:['M1707.000300'], studioGroup:'graduation'},
  {code:'M1707.001100', name:'졸업논문세미나 2',         credit:3, category:'land', type:'land_thesis',   semester:[2],
    prereqs:['M1707.001000'], studioGroup:'graduation'},
];

// 졸업작품스튜디오/논문세미나 코드 (동시 수강 불가, 100클릭 필요)
