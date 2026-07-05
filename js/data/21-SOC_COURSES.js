const GENV_OVERLAP_CAT_CODES = {
  forest: ['M1698.000600','5241.311','M1698.001200','M1698.002500','M1729.000900'],
  land:   ['5271.225'],
};

// 사회학과
const SOC_COURSES = [
  {code:'205.240A',     name:'환경과 생태의 사회학',    credit:3, category:'soc', type:'normal', semester:[2]},
  {code:'205.245A',     name:'정치사회학',              credit:3, category:'soc', type:'normal', semester:[1], polisciOk:true},
  {code:'205.344A',     name:'민족사회학과 북한연구',   credit:3, category:'soc', type:'normal', semester:[2], polisciOk:true},
  {code:'205.345A',     name:'일본과 동아시아',         credit:3, category:'soc', type:'normal', semester:[1], polisciOk:true},
  {code:'M1304.001300', name:'동아시아 사회',           credit:3, category:'soc', type:'normal', semester:[2], polisciOk:true},
];

const ALL_COURSES_WITH_POLISCI = [...LIBERAL_COURSES, ...GEO_COURSES, ...GEOEDU_COURSES, ...AGRI_COURSES, ...ECON_COURSES, ...FOREST_COURSES, ...POLISCI_COURSES, ...HISTORY_COURSES, ...HISTORY_EXTRA_COURSES, ...JAPAN_COURSES, ...JAPAN_STUDIES_COURSES, ...ARTHISTORY_COURSES, ...EDU_HISTORY_COURSES, ...STS_COURSES, ...LAND_COURSES, ...GENV_COURSES, ...SOC_COURSES, ...CIVIL_COURSES, ...ENERGY_COURSES, ...CHEMBIO_COURSES, ...EARTH_COURSES, ...LIFESCI_COURSES, ...AGROBIO_COURSES, ...ELECTIVE_COURSES,
  // 공무원 시험 공부 (자격증 탭에서만 노출, S_repeatable, 중복수강 가능, 30회→appraiserClicks+10)
  {code:'CERT.APPRAISER', name:'공무원 시험 공부', credit:0, category:'cert_study', type:'appraiser_study', semester:[1,2], everyTerm:true, alwaysSucceed:true},
  {code:'CERT.임용 1차',      name:'임용 1차 공부',      credit:0, category:'cert_study', type:'leet_study',      semester:[1,2], everyTerm:true, alwaysSucceed:true},
];
