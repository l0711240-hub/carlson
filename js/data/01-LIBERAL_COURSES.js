
// ══════════════════════════════════════════════════════
// COURSE DATA
// ══════════════════════════════════════════════════════
// category: 'liberal'=교양, 'geo'=사회교육과, 'agri'=교직과정
// type: 'normal'|'S'|'required_geo'|'required_agri'|'required_liberal'|'lang2'|'div_liberal'
// division: 인하대 핵심교양 영역 (1=인간가치공존,2=역사사상문화,3=문학예술미디어,4=사회제도세계,5=자연생명환경,6=수리정보기술,7=일반교양SW·AI)
// minPick: 이 픽 이상으로만 신청 가능 (없으면 제한 없음)
// recPick: 고정 픽순 (전공과목용)
// alwaysSucceed: 무조건 성공
// specialPickRule: 특수 확률 함수명

const LIBERAL_COURSES = [
  // ── 필수 교양 ──────────────────────────────────────
  {code:"LIB002", name:"의사소통 영어", credit:3, category:"liberal", type:"required_liberal", everyTerm:true, mustTake:true, recPick:1},
  {code:"LIB003", name:"대학독일어", credit:3, category:"liberal", type:"lang2", everyTerm:true},
  {code:"LIB004", name:"생활한문", credit:3, category:"liberal", type:"lang2", everyTerm:true},
  {code:"LIB005", name:"대학스페인어", credit:3, category:"liberal", type:"lang2", everyTerm:true},
  {code:"LIB006", name:"대학중국어", credit:3, category:"liberal", type:"lang2", everyTerm:true},
  {code:"LIB007", name:"대학일본어", credit:3, category:"liberal", type:"lang2", everyTerm:true},
  {code:"LIB008", name:"교양 한국어", credit:3, category:"liberal", type:"lang2", everyTerm:true},
  {code:"LIB009", name:"커리어 디자인 1", credit:2, category:"liberal", type:"required_liberal", everyTerm:true, mustTake:true, recPick:2},
  {code:"LIB010", name:"커리어 디자인 2", credit:2, category:"liberal", type:"required_liberal", everyTerm:true, mustTake:true, recPick:2,
    prereq:"LIB009"}, // 대학글쓰기1 선수 필요
  {code:"034.029", name:"미래사회와 소프트웨어", credit:3, category:"liberal", type:"basic_required", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true},
  {code:"GEB1126", name:"문제해결을 위한 글쓰기", credit:3, category:"liberal", type:"required_liberal", everyTerm:true},
  {code:"GEB1101", name:"프로네시스 세미나 Ⅰ", credit:1, category:"liberal", type:"required_liberal", everyTerm:true},
  {code:"GEB1112", name:"크로스오버 1: 인간의 탐색", credit:2, category:"liberal", type:"required_liberal", everyTerm:true},
  {code:"GEB1113", name:"크로스오버 2: 자연의 탐색", credit:2, category:"liberal", type:"required_liberal", everyTerm:true},

  // ── 분과 교양 ──────────────────────────────────────
  // 1) 언어와 문학 (매학기 1~3개 무작위 오픔)
  {code:"L0545.000600", name:"공학윤리와 토론", credit:3, category:"liberal", type:"div_liberal", division:1, divName:"1영역 인간·가치·공존", everyTerm:true},
  {code:"L0545.001700", name:"논리와 비판적 사고", credit:3, category:"liberal", type:"div_liberal", division:1, divName:"1영역 인간·가치·공존", everyTerm:true},
  {code:"041.039", name:"인간과 윤리", credit:3, category:"liberal", type:"div_liberal", division:1, divName:"1영역 인간·가치·공존", everyTerm:true},
  {code:"041.040", name:"철학의 이해", credit:3, category:"liberal", type:"div_liberal", division:1, divName:"1영역 인간·가치·공존", everyTerm:true},
  {code:"041.045", name:"행복과 좋은 삶", credit:3, category:"liberal", type:"div_liberal", division:1, divName:"1영역 인간·가치·공존", everyTerm:true},

  // 2) 문화와 예술
  {code:"042.010", name:"한국사의 이해", credit:3, category:"liberal", type:"div_liberal", division:2, divName:"2영역 역사·사상·문화", everyTerm:true},
  {code:"042.012", name:"동북아와 한일관계", credit:3, category:"liberal", type:"div_liberal", division:2, divName:"2영역 역사·사상·문화", everyTerm:true},
  {code:"042.014", name:"세계사의 흐름", credit:3, category:"liberal", type:"div_liberal", division:2, divName:"2영역 역사·사상·문화", everyTerm:true},
  {code:"042.017", name:"근현대 한국의 형성", credit:3, category:"liberal", type:"div_liberal", division:2, divName:"2영역 역사·사상·문화", everyTerm:true},
  {code:"L0546.000500", name:"서양문명과 사상", credit:3, category:"liberal", type:"div_liberal", division:2, divName:"2영역 역사·사상·문화", everyTerm:true},
  {code:"042.041", name:"종교와 인간", credit:3, category:"liberal", type:"div_liberal", division:2, divName:"2영역 역사·사상·문화", everyTerm:true},

  // 3) 역사와 철학
  {code:"L0547.001200", name:"영화로 보는 문학세계", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"043.004", name:"그래픽 디자인 이야기", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"043.007", name:"희곡의 이해", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"043.013", name:"음악의 세계", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  // 테마 중국사: 3픽 이상, 매학기 2~4개 무작위
  {code:"L0547.002100", name:"미술의 세계", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true, minPick:3, offerCount:[2,4]},
  {code:"L0547.002300", name:"사진과 영상", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"043.046", name:"대중문화와 미디어", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"L0547.001400", name:"문학의 향연", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"043.074", name:"공연예술의 감상", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},

  // 4) 정치와 경제
  {code:"044.006", name:"정치와 사회의 이해", credit:3, category:"liberal", type:"div_liberal", division:4, divName:"4영역 사회·제도·세계", everyTerm:true},
  {code:"044.007", name:"국제관계와 세계", credit:3, category:"liberal", type:"div_liberal", division:4, divName:"4영역 사회·제도·세계", everyTerm:true},
  {code:"044.009", name:"경제와 생활", credit:3, category:"liberal", type:"div_liberal", division:4, divName:"4영역 사회·제도·세계", everyTerm:true},
  {code:"044.010", name:"시장과 사회", credit:3, category:"liberal", type:"div_liberal", division:4, divName:"4영역 사회·제도·세계", everyTerm:true},
  {code:"044.019", name:"법과 시민생활", credit:3, category:"liberal", type:"div_liberal", division:4, divName:"4영역 사회·제도·세계", everyTerm:true},
  {code:"E11.128", name:"사회문제와 정책", credit:3, category:"liberal", type:"div_liberal", division:4, divName:"4영역 사회·제도·세계", everyTerm:true},
  {code:"C20.151", name:"디자인과 생활", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"E11.188", name:"스토리텔링의 기술", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},
  {code:"C20.132", name:"미디어 리터러시", credit:3, category:"liberal", type:"div_liberal", division:3, divName:"3영역 문학·예술·미디어", everyTerm:true},

  // 5) 인간과 사회
  {code:"045.002", name:"생활과 과학", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true},
  // 심리학개론: 3픽 이상, 2~4 무작위
  {code:"045.012", name:"자연과학의 이해", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true, minPick:3, offerCount:[2,4]},
  // 굿 라이프 심리학: 3픽 이상, 2~4 무작위
  {code:"L0549.001400", name:"생명과학의 세계", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true, minPick:3, offerCount:[2,4]},
  {code:"045.014", name:"환경과 지속가능성", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true},
  // 공간정보와 시각화: A이상 시 컴퓨터지도학 보너스
  {code:"L0549.000800", name:"기후변화와 인간", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true, bonus:{ifGrade:"A", targetCode:"208.231A", extraHits:2}},
  {code:"045.016", name:"우주와 자연", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true},
  {code:"045.019", name:"에너지와 환경", credit:3, category:"liberal", type:"div_liberal", division:5, divName:"5영역 자연·생명·환경", everyTerm:true},

  // 6) 자연과 기술 (필수 분과 중 하나)
  {code:"046.001", name:"인공지능과 소프트웨어를 활용한 탄소중립", credit:3, category:"liberal", type:"div_liberal", division:6, divName:"6영역 수리·정보·기술", everyTerm:true},
  {code:"046.006", name:"수학의 세계", credit:3, category:"liberal", type:"div_liberal", division:6, divName:"6영역 수리·정보·기술", everyTerm:true},
  {code:"046.007", name:"통계와 데이터", credit:3, category:"liberal", type:"div_liberal", division:6, divName:"6영역 수리·정보·기술", everyTerm:true},
  {code:"046.014", name:"정보과학의 이해", credit:3, category:"liberal", type:"div_liberal", division:6, divName:"6영역 수리·정보·기술", everyTerm:true},
  {code:"L0550.000400", name:"과학기술과 문명", credit:3, category:"liberal", type:"div_liberal", division:6, divName:"6영역 수리·정보·기술", everyTerm:true},

  // 7) 생명과 환경 (필수 분과 중 하나)
  {code:"047.010", name:"이차전지와 인공지능", credit:3, category:"liberal", type:"div_liberal", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true},
  {code:"L0551.000400", name:"빅데이터의 이해", credit:3, category:"liberal", type:"div_liberal", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true},
  // 참살이의학특강: 2픽 이상, 2~5 무작위
  {code:"047.021", name:"AI와 미래사회", credit:3, category:"liberal", type:"div_liberal", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true, minPick:2, offerCount:[2,5]},
  // 죽음의 과학적 이해: 1픽이어도 50% 이하, 3~5 무작위
  {code:"047.022", name:"디지털 리터러시", credit:3, category:"liberal", type:"div_liberal", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true, specialPickRule:"death_science", offerCount:[3,5]},
  {code:"047.025", name:"소프트웨어와 문제해결", credit:3, category:"liberal", type:"div_liberal", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true},
  {code:"E11.114", name:"데이터 사이언스 입문", credit:3, category:"liberal", type:"div_liberal", division:7, divName:"7영역 일반교양 SW·AI", everyTerm:true},
];

// 매학기 분과별 오픈 수업 수 (무작위)
