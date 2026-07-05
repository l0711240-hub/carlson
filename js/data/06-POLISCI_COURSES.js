const POLISCI_COURSES = [
  // ── 학부 공통 전필 ──
  {code:'200.103', name:'정치학원론', credit:3, category:'polisci', subtype:'polisci_common', type:'required_polisci', semester:[1,2], everyTerm:true},
  {code:'200.104', name:'국제정치학개론', credit:3, category:'polisci', subtype:'polisci_common', type:'required_polisci', semester:[1,2], everyTerm:true},
  // 사회과학 고전강독 (가군, 1학년)
  {code:'M2170.006600', name:'사회과학 고전강독 1', credit:3, category:'polisci', subtype:'polisci_common', division_pol:'ga', semester:[1], everyTerm:true},
  {code:'M2170.006700', name:'사회과학 고전강독 2', credit:3, category:'polisci', subtype:'polisci_common', division_pol:'ga', semester:[1], everyTerm:true},
  // 정치외교 세미나 (전공선택)
  {code:'M1319.001300', name:'정치외교 세미나', credit:3, category:'polisci', subtype:'polisci_common', division_pol:'elective', semester:[1], everyTerm:true},
  // 국제정치의 길잡이 (전공선택)
  {code:'216B.429', name:'국제정치의 길잡이', credit:3, category:'polisci', subtype:'polisci_common', division_pol:'elective', semester:[1], everyTerm:true},

  // ── 정치학전공 전필 ──
  {code:'216A.416', name:'정치학연습', credit:3, category:'polisci', subtype:'polisci_a', type:'required_polisci_a', division_pol:'required', semester:[1], everyTerm:true},
  // ── 외교학전공 전필 ──
  {code:'216B.420', name:'국제정치연습', credit:3, category:'polisci', subtype:'polisci_b', type:'required_polisci_b', division_pol:'required', semester:[1], everyTerm:true},

  // ── 정치학전공 가군 (2학년 1학기) ──
  {code:'216A.202', name:'비교정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'216A.203', name:'서양정치사상 1', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'216A.219', name:'시민정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'M1319.001400', name:'국제관계사1', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'M1320.001900', name:'정치사회 고전연구', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  // ── 정치학전공 가군 (2학년 2학기) ──
  {code:'216A.204', name:'서양정치사상 2', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'216A.214A', name:'한국정치사입문', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'216A.220', name:'정치경제론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'M1319.001500', name:'국제관계사 2', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'M1320.001100', name:'인권', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'M1321.002200', name:'국제정치자료분석', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  // ── 정치학전공 나군 ──
  {code:'216A.207', name:'일본정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216B.214', name:'중국외교정책론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216B.227', name:'외교정책론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'M1320.001300', name:'정치 체제와 변동', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216B.219A', name:'세계지역연구개론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'216B.222', name:'미국과 국제관계', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'216B.341', name:'일본과 국제관계', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'M1319.000800', name:'유럽정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'M3715.000100', name:'유럽 포퓰리즘', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  // ── 정치학전공 다군 ──
  {code:'216A.210', name:'행정학이론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.217', name:'지구화 시대의 정치', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216B.223', name:'국제정치경제론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216B.226', name:'한반도와 국제정치', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'M1321.001600', name:'무역과 투자의 국제정치경제', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.211', name:'인사행정', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216A.216', name:'북한의 정치와 사회', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.224', name:'안보론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.225', name:'탈근대세계정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.347', name:'금융과 발전의 국제정치경제', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'M1320.002000', name:'정치사회 현대이론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'M1321.002300', name:'테러리즘과 반테러리즘의 정치', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  // ── 정치학전공 3학년 가군 ──
  {code:'216A.301', name:'정치학연구방법론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'216B.337A', name:'한국 정치·외교사상', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'M1320.000200', name:'현대국제정치사상', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'M0000.022400', name:'한국정치사', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'216A.310A', name:'동아시아정치사상', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'216B.340', name:'외교론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'M1320.000600', name:'법과 민주주의', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  {code:'M1320.001600', name:'한국헌법사', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  // ── 정치학전공 3학년 나군 ──
  {code:'216A.308', name:'중국정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216A.328', name:'동아시아정치경제', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216B.335A', name:'미국 정책결정과정의 이해', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216B.338A', name:'러시아 국제관계론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216B.339', name:'유라시아 국제관계론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'M1321.001400', name:'현대동북아 국제정치경제', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'2021.301', name:'유럽지역학입문1', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'216A.320', name:'러시아동구정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'216A.323', name:'미국정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'216B.342', name:'비교 연방제와 연방국가', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'216B.345', name:'중동/아프리카 지역연구', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'M1320.001400', name:'중국의 부상과 아시아의 미래', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  {code:'M1321.001200', name:'유럽지역연구', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  // ── 정치학전공 3학년 다군 ──
  {code:'216A.209A', name:'현대민주주의의 쟁점', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.303', name:'정당론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.311', name:'근대정치사상', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.314', name:'행정조직론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.325', name:'공공선택이론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.302', name:'국제정치이론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216B.328A', name:'정보세계정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216B.228', name:'개발과 협력의 국제정치경제', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'M1321.000800', name:'글로벌 리더십 연습', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1,2], everyTerm:true},
  {code:'M1321.000900', name:'글로벌 냉전의 이해', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'M1321.001100', name:'국제법과 국제관계', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.304', name:'한국정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216A.315', name:'재무행정', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216A.321', name:'의회정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216A.329', name:'거버넌스의 이해', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.326', name:'국제기구론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.336', name:'한국외교정책론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.343', name:'환경과 세계정치', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'M1321.000800b', name:'글로벌 리더십 연습(2)', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'M1321.001800', name:'분쟁해결과 국제기구', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  // ── 정치학전공 4학년 가군 ──
  {code:'216A.403', name:'한국정치사상', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'216B.428', name:'동아시아국제정치사상론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[1]},
  {code:'M1320.001800', name:'계량정치', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'ga', semester:[2]},
  // ── 정치학전공 4학년 나군 ──
  {code:'216B.427', name:'동남아의 정치와 외교', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'M1321.002000', name:'한일관계론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[1]},
  {code:'2021.401', name:'유럽지역통합이론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'na', semester:[2]},
  // ── 정치학전공 4학년 다군 ──
  {code:'216A.405', name:'정치철학', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.415', name:'게임이론과 정치', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.423', name:'동아시아국제정치론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.426A', name:'국제정치의 주요쟁점', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'M1320.001700', name:'헌법', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[1]},
  {code:'216A.407', name:'정치학특강', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216A.413', name:'국가론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216A.414', name:'현대정치사상', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},
  {code:'216B.415', name:'국제문화론', credit:3, category:'polisci', subtype:'polisci_a', division_pol:'da', semester:[2]},

  // ── 외교학전공 과목 (정치학 과목과 동일하게 가/나/다군 구조) ──
  // 외교학전공은 정치학전공과 동일 과목을 공유하므로 subtype을 polisci_b로 설정하는 별도 항목은 생략
  // 실제로 정치학/외교학 전공 구분 없이 같은 과목 풀을 사용하고
  // 수강신청 탭은 하나(정치외교학부)로 통합
];

// 정치외교학부 타과 전공인정 교과목 코드
