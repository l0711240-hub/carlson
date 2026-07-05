function ipmShow(stepId){
  ['ipm-doc-result','ipm-interview-ready','ipm-interview-running','ipm-final-result']
    .forEach(id => document.getElementById(id).style.display = id===stepId ? 'block' : 'none');
  document.getElementById('intern-process-modal').style.display = 'flex';
}
function ipmClose(){
  if(_ipmInterval){ clearInterval(_ipmInterval); _ipmInterval=null; }
  document.getElementById('intern-process-modal').style.display = 'none';
  openInternOverlay(); // 목록 새로고침
}
