function isGreenLeaderInternDone(){
  return false; // 그린리더십 제거됨
}

// 7급 공무원 할인 과목 코드 → 감소 클릭수
// genv 인정 과목 genvOk 후부여 (기존 forest/land/agri 과목)
ALL_COURSES_WITH_POLISCI.forEach(c => {
  if(GENV_EXTRA_OK_CODES.has(c.code)) c.genvOk = true;
  // 조경학 전공선택 인정 과목 landOk 후부여
  if(['5241.415', '5241.412', '5241.211', '3346.415', '519.203'].includes(c.code)) c.landOk = true;
  // 정치외교학부 전공선택 인정 과목 polisciOk 후부여
  if(POLISCI_CROSSOVER_CODES.includes(c.code) && !['208.215','208.318'].includes(c.code)) c.polisciOk = true;
});
const APPRAISER_DISCOUNT_CODES = {
  '208.401A':    10,  // 법제사회교육과 도시지역정책
  '208.224B':    10,  // 토지주택론
  '212.201':      5,  // 미시경제이론 (경제학부)
  'M2649.001300': 5,  // 미시경제이론 (교직과정)
  '5202.205':     5,  // 공간경제의 이해
  'M1683.001100': 10, // 토지 및 주택시장 경제분석
};
