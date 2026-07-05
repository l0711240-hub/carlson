const DIV_OFFER_COUNT = {1:[1,3], 2:[1,3], 3:[1,3], 4:[1,3], 5:[1,3], 6:[1,3], 7:[1,3]};

// semester: which semesters this course is offered (1=1st, 2=2nd)
const GEO_COURSES = [
  // 1학년
  {code:"208.219", name:"정치와 사회", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"M0.003400", name:"사회과 교육론", credit:3, category:"geo", type:"normal", semester:[2]},
  // 2학년 1학기
  {code:"208.205", name:"경제와 사회", credit:3, category:"geo", type:"normal", semester:[1], recPick:3},
  {code:"208.207", name:"인간과 사회", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.210", name:"국제관계론", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.223", name:"자연지리학", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.311", name:"한국사회의 이해", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.320", name:"통합사회교육론", credit:3, category:"geo", type:"normal", semester:[1]},
  // 2학년 2학기
  {code:"208.228A", name:"이주사회학", credit:3, category:"geo", type:"normal", semester:[2]},
  // 컴퓨터 지도학: 3픽, 공간정보와 시각화 A이상이면 히트 보너스
  {code:"208.231A", name:"사회과 평가론", credit:3, category:"geo", type:"normal", semester:[2], recPick:3},
  {code:"208.302", name:"한국지리", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.327A", name:"행정학 입문", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"M0000.021600", name:"세계지리", credit:3, category:"geo", type:"normal", semester:[2]},
  // 글로벌 지역연구방법론: 1학점, S/U, 2학기만, 반복 수강 가능 (1번만 닿으면 이수)
  {code:"M1310.000100", name:"글로벌 시민교육", credit:1, category:"geo", type:"S_repeatable", semester:[2], alwaysSucceed:true},
  // 3학년 1학기
  {code:"208.318A", name:"비교민주주의론", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.401A", name:"법과 사회", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.407A", name:"현대정치과정론", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"M0000.021700", name:"한국문화의 창의적 탐색", credit:3, category:"geo", type:"normal", semester:[1]},
  // 공간정보분석1: 고정 1픽
  {code:"M0000.029300", name:"사회과학방법론", credit:3, category:"geo", type:"required_geo", semester:[1], recPick:1},
  {code:"M1310.000400", name:"정치발전과 교육", credit:3, category:"geo", type:"S", semester:[1], recPick:2},
  {code:"M1310.000800", name:"융합형 프로젝트 기반 수업 설계", credit:3, category:"geo", type:"normal", semester:[1]},
  // 3학년 2학기
  {code:"208.226A", name:"다문화교육의 이해", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.316", name:"지역문화의 탐구", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.322", name:"문화와 사회", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.326", name:"사회문제와 법", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.410", name:"경제교육과 국가경제", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.416A", name:"시장경제의 탐구와 연습", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"M0000.028600", name:"사회 교재연구 및 지도법", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"M1310.001000", name:"세계화와 현대 사회", credit:3, category:"geo", type:"normal", semester:[2]},
  // 4학년 1학기
  {code:"208.224B", name:"법교육 개론", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.321", name:"사회과 답사 및 견학", credit:3, category:"geo", type:"S_repeatable", semester:[1], recPick:2},
  {code:"208.328", name:"범죄와 형벌", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"208.413A", name:"지도학의 이해", credit:3, category:"geo", type:"normal", semester:[1]},
  {code:"M1310.001100", name:"경제교육론", credit:3, category:"geo", type:"normal", semester:[1]},
  // 4학년 2학기
  {code:"208.323A", name:"국가경제의 탐구와 연습", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.408", name:"문화와 교육", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"208.326A", name:"사회문제와 법", credit:3, category:"geo", type:"normal", semester:[2]},
  // 지리공간의 역사와 사상: 고정 2픽
  {code:"208.421A", name:"사회과 논리 및 논술", credit:3, category:"geo", type:"required_geo", semester:[2], recPick:2},
  {code:"208.422", name:"법교육 이론과 사례", credit:3, category:"geo", type:"normal", semester:[2]},
  {code:"M0000.021500", name:"인문지리학", credit:3, category:"geo", type:"normal", semester:[2]},
];
