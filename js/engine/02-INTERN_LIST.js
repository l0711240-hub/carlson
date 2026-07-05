// ══════════════════════════════════════════════════════
// 인턴 / 자격증 / 공기업 데이터
// ══════════════════════════════════════════════════════
const INTERN_LIST = [
  // 직무 관련 인턴
  {id:'related_geo',   name:'지리정보 관련 인턴',   type:'related',  bonus:[15,20], req:{minGpa:3.3}},
  {id:'related_econ',  name:'경제·금융 관련 인턴',  type:'related',  bonus:[15,20], req:{minGpa:3.5, needsMajor:['econ']}},
  {id:'related_forest',name:'산림·환경 관련 인턴',  type:'related',  bonus:[15,20], req:{minGpa:3.0, needsMajor:['forest','land']}},
  {id:'related_land',  name:'조경·도시계획 관련 인턴',type:'related', bonus:[15,20], req:{minGpa:3.0, needsMajor:['land']}},
  {id:'related_env',    name:'환경·에너지 관련 인턴',  type:'related',  bonus:[15,20], req:{minGpa:3.0, needsMajor:['genv']}},
  {id:'related_it',    name:'IT·GIS 관련 인턴',    type:'related',  bonus:[15,20], req:{minGpa:3.0}},
  // 공공기관 인턴
  {id:'public_gov',    name:'정부기관 인턴',         type:'public',   bonus:[10,12], req:{minGpa:2.5}},
  {id:'public_corp',   name:'공기업 인턴',           type:'public',   bonus:[10,12], req:{minGpa:3.0}},
  {id:'public_ngo',    name:'공공기관·NGO 인턴',     type:'public',   bonus:[10,12], req:{minGpa:2.5}},
  // 일반 인턴
  {id:'general_corp',  name:'일반 기업 인턴',        type:'general',  bonus:[7,10],  req:{minGpa:2.0}},
  {id:'general_small', name:'스타트업 인턴',         type:'general',  bonus:[7,10],  req:{minGpa:2.0}},
];

const CERT_DEFS = {
  컴활1급:    { label:'컴퓨터활용능력 1급', clicks:100, desc:'100회 클릭' },
  토익:       { label:'TOEIC', clicks:100, desc:'1~100회 → 10~990점', isScore:true },
  한국사:     { label:'한국사능력검정시험', clicks:30, desc:'10회→3급 / 20회→2급 / 30회→1급', isGrade:true },
  텝스:       { label:'TEPS', clicks:100, desc:'1~100회 → 6~600점 (10초 100회=600점)', isScore:true, maxScore:600 },
  snult일본어:{ label:'한국사검정', clicks:100, desc:'0~100점 (10초 100회=100점, 일본어 과목 수강 시 가산점)', isScore:true, maxScore:100 },
};

// 학위 계열 분류
function getDegreeCategory(){
  // 졸업요건을 충족한(이수한) 복전만 인정
  function _metSimple(d){
    const t=d.type,k=d.kind;
    if(k==='double'){
      if(t==='agri') return ['M2649.001300','M2649.001400','M2649.001600','M1683.000400','5202.202','5202.205','5202.415'].every(passed)&&calcAgriEffectiveCredits()>=48;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=39;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=48;
      if(t==='polisci_a'||t==='polisci_b') return calcPolisciCrossoverCredits(t)>=getPolisciCreditReq(t);
      if(t==='japan') return passed('1003.221')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=29&&le>=19&&calcLandEffectiveCredits()>=getLandCreditReq();}
      if(t==='genv'){const eff=calcGenvEffectiveCredits();const sci=calcGenvSciCredits();return GENV_REQUIRED_CODES.every(passed)&&eff>=39&&sci>=Math.ceil(eff/3)&&isGenvInternDone();}
    }
    if(k==='minor'){
      if(t==='agri') return ['5202.202','M2649.001300','M1683.000400','212.201','212.202'].every(passed)&&calcAgriEffectiveCredits()>=24;
      if(t==='econ') return ['212.201','212.202','212.203','212.204','212.214'].every(passed)&&calcEconEffectiveCredits()>=21;
      if(t==='forest') return ['M1698.001200','M1698.002900','M1698.001900','5241.417'].every(passed)&&player.forestCredits>=21;
      if(t==='polisci_a'||t==='polisci_b') return calcPolisciCrossoverCredits(t)>=getPolisciCreditReq(t);
      if(t==='japan') return passed('1003.221')&&calcJapanEffectiveCredits()>=getJapanCreditReq();
      if(t==='land'){const le=completedCourses.filter(c=>c.category==='land'&&c.type==='normal'&&c.grade!=='F').reduce((s,c)=>s+c.credit,0);return calcLandRequiredCredits()>=19&&le>=5&&calcLandEffectiveCredits()>=getLandCreditReq();}
    }
    return false;
  }
  const metTypes = doubleMajors.filter(d=>d.approved&&_metSimple(d)).map(d=>d.type);
  const hasMajor = t => metTypes.includes(t);
  if(hasMajor('genv')) return ['환경'];  // 연합전공 글로벌환경경영 → 환경학사
  if(hasMajor('econ') || hasMajor('agri')) return ['상경'];
  const cats = [];
  if(hasMajor('polisci_a')||hasMajor('polisci_b')||hasMajor('japan')) cats.push('외교언어');
  if(hasMajor('forest')||hasMajor('land')) cats.push('농학');
  if(hasMajor('genv')) cats.push('환경');
  if(hasMajor('land')) cats.push('조경');
  cats.push('지리'); // 주전공
  return cats.length ? cats : ['지리'];
}

const PUBLIC_COMPANIES = [
  {id:'한국은행',          name:'한국은행',          degreeBonus:{상경:15},                          passScore:210},
  {id:'한국수출입은행',    name:'한국수출입은행',    degreeBonus:{상경:15, 공학:8},                  passScore:200},
  {id:'신용보증기금',      name:'신용보증기금',      degreeBonus:{상경:15},                          passScore:190},
  {id:'인천국제공항공사', name:'인천국제공항공사',  degreeBonus:{공학:15, 외교언어:5},              passScore:185},
  {id:'한국공항공사',      name:'한국공항공사',      degreeBonus:{공학:15},                          passScore:180},
  {id:'한국전력공사',      name:'한국전력공사',      degreeBonus:{공학:20},                          passScore:180},
  {id:'한국수자원공사',    name:'한국수자원공사',    degreeBonus:{공학:15, 지리:15, 환경:12},         passScore:175},
  {id:'한국도로공사',      name:'한국도로공사',      degreeBonus:{공학:15},                          passScore:170},
  {id:'한국토지주택공사', name:'한국토지주택공사',  degreeBonus:{지리:10, 조경:10, 외교언어:10},    passScore:170},
  {id:'한국환경공단',      name:'한국환경공단',      degreeBonus:{환경:20, 공학:15, 지리:10},         passScore:170},
  {id:'국립환경과학원',    name:'국립환경과학원',    degreeBonus:{환경:20, 지리:10},                  passScore:165},
  {id:'한국임업진흥원',    name:'한국임업진흥원',    degreeBonus:{농학:20, 환경:8},                    passScore:170},
  {id:'한국산림복지진흥원',name:'한국산림복지진흥원',degreeBonus:{농학:20, 환경:8},                  passScore:165},
  {id:'한국수목원정원관리원',name:'한국수목원정원관리원',degreeBonus:{조경:20, 농학:20},            passScore:165},
];
let critiqueActive = false; // 설계비평 클릭게임 진행 중
let critiqueState = null;
let playerStunTimer = 0;  // frames player cannot move
let playerSlowed = false;  // whether player is currently slowed
let playerSlowTimer = 0;   // frames remaining for speed debuff
let whiteoutTimer = 0;     // frames for screen whiteout
let bossDotTimer = 0;      // dot damage timer
let bossDotActive = false; // is dot damage active
let bossDotDps = 0;        // damage per second during dot
let bossBeacons = [];      // 임용 기출문제 beacon turrets
