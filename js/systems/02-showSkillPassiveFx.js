function showSkillPassiveFx(sk, x, y){
  const meta = SKILL_META[sk];
  if(!meta) return;

  // Canvas 좌표 → 화면 좌표 변환
  const canvas = document.getElementById('gameCanvas');
  if(!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width  / (canvas.width  || rect.width);
  const scaleY = rect.height / (canvas.height || rect.height);
  const screenX = rect.left + x * scaleX;
  const screenY = rect.top  + y * scaleY;

  const el = document.createElement('div');
  el.textContent = meta.icon;
  el.style.cssText = [
    'position:fixed',
    `left:${screenX}px`,
    `top:${screenY - 16}px`,
    'transform:translateX(-50%)',
    'font-size:28px',
    'pointer-events:none',
    'z-index:9998',
    'line-height:1',
    'transition:none',
    `color:${meta.color}`,
    'text-shadow:0 0 6px ' + meta.color,
  ].join(';');
  document.body.appendChild(el);

  // 위로 떠오르면서 fade-out — 3초간 표시
  let frame = 0;
  const totalFrames = 180;        // 60fps × 3초
  const riseDistance = 70;        // 올라가는 거리(px)
  function animate(){
    frame++;
    const progress = frame / totalFrames;
    el.style.top = (screenY - 16 - progress * riseDistance) + 'px';
    // 앞 60%는 불투명 유지, 뒤 40%에서 fade
    const fadeStart = 0.6;
    const alpha = progress < fadeStart
      ? 1
      : Math.max(0, 1 - (progress - fadeStart) / (1 - fadeStart));
    el.style.opacity = String(alpha);
    if(frame < totalFrames) requestAnimationFrame(animate);
    else el.remove();
  }
  requestAnimationFrame(animate);
}

function updateAndDrawSkillFx(ctx){
  // 스킬 해금 배너 — DOM 팝업으로 처리 (Canvas 이모지 렌더 불안정 해결)
  if(_skillFxQueue.length>0){
    const fx = _skillFxQueue[0];
    fx.timer--;
    if(!fx._domShown){
      fx._domShown = true;
      showSkillUnlockBanner(fx.sk, fx.lv);
    }
    if(fx.timer<=0) _skillFxQueue.shift();
  }
}

function showSkillUnlockBanner(sk, lv){
  const meta = SKILL_META[sk];
  if(!meta) return;
  const banner = document.createElement('div');
  banner.style.cssText = [
    'position:fixed',
    'left:50%',
    'top:50%',
    'transform:translate(-50%,-50%)',
    'z-index:9999',
    'pointer-events:none',
    'background:#fff',
    `border:2px solid ${meta.color}`,
    'border-radius:10px',
    'padding:10px 22px',
    'display:flex',
    'align-items:center',
    'gap:8px',
    `box-shadow:0 0 20px ${meta.color}88`,
    'opacity:1',
  ].join(';');
  banner.innerHTML = `
    <span style="font-size:26px;line-height:1">${meta.icon}</span>
    <span style="font-family:'Black Han Sans',sans-serif;font-size:15px;color:${meta.color}">
      ${meta.label} ${lv}단계 해금!
    </span>`;
  document.body.appendChild(banner);

  // 4초 표시 후 fade-out 제거
  setTimeout(()=>{
    let op = 1;
    const fade = setInterval(()=>{
      op -= 0.03;
      banner.style.opacity = String(Math.max(0, op));
      if(op<=0){ clearInterval(fade); banner.remove(); }
    }, 30);
  }, 3500);
}

// 복수전공 목록: 여러 개 가능
// doubleMajors = [{type:'agri'|'econ'|'geo_intensive', approved:true}]
// 사회교육과 심화전공은 졸업 시 자동 판정

// ── 전공 판정 헬퍼 ─────────────────────────────────────
// doubleMajors: [{type, approved, kind}]  kind='double'|'minor'
// minorMajors 변수는 폐지하고 doubleMajors에 kind 필드로 통합
let minorMajors = []; // 호환성 유지용 (실제론 doubleMajors.kind로 관리)
