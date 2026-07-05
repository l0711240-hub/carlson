const GL_SS_CODES = new Set([
  '538.304','5202.203A','5202.409','713.323','538.402','713.214','700.108',
  '208.328','C40.114','208.408','538.305','538.301','M1729.001100','E11.190',
  '538.403','C30.131','C40.124','538.406','M1698.000600','5271.313A',
]);
// 학점인정과목 — 지속가능성 과학
const GL_SCI_CODES = new Set([
  '3346.415','5241.315B','M1698.001200','5271.413','5241.311','208.326A',
  '465.319','465.435','458.405','5271.225','5271.227','538.309',
]);
// 전체 그린리더십 인정 과목 (인턴십 제외)
const GL_ALL_CODES = new Set([
  ...GL_CORE_CODES, ...GL_CERT_CODES, ...GL_SS_CODES, ...GL_SCI_CODES
]);
// 그린리더십 인턴십 선수조건 체크
function checkGreenLeaderReq(){
  return {coreCertCount:0, totalCredits:0, avgGpa:0, ok:true};
  const done = completedCourses.filter(c =>
    c.grade !== 'F' && c.grade !== undefined &&
    (GL_CORE_CODES.has(c.code) || GL_CERT_CODES.has(c.code))
  );
  const coreCertCount = done.length; // 핵심+교과인증 이수 수
  const allDone = completedCourses.filter(c =>
    c.grade !== 'F' && c.grade !== undefined && GL_ALL_CODES.has(c.code)
  );
  const totalCredits = allDone.reduce((s, c) => s + (c.credit||0), 0);
  // 평점평균 계산 (S/U 과목 제외)
  const graded = allDone.filter(c => c.gradePoint != null && c.gradePoint > 0);
  const avgGpa = graded.length > 0
    ? graded.reduce((s, c) => s + c.gradePoint, 0) / graded.length
    : 0;
  return {
    coreCertCount,
    totalCredits,
    avgGpa,
    ok: coreCertCount >= 2 && totalCredits >= 9 && avgGpa >= 2.7,
  };
}
// 그린리더십 인턴십 이수 여부 (= 053.011 이수)
