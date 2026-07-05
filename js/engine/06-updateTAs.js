function updateTAs(){
  for(const ta of taAssistants){
    if(!ta.alive) continue;
    ta.wobble+=0.06;
    // 플레이어를 향해 천천히 이동
    const dx=player.x-ta.x, dy=player.y-ta.y;
    const dist=Math.sqrt(dx*dx+dy*dy);
    if(dist>ta.size+player.size+4){
      ta.vx+=(dx/dist)*0.04; ta.vy+=(dy/dist)*0.04;
    }
    ta.vx*=0.92; ta.vy*=0.92;
    ta.x=Math.max(ta.size,Math.min(W-ta.size,ta.x+ta.vx));
    ta.y=Math.max(ta.size,Math.min(H-ta.size,ta.y+ta.vy));
    // 플레이어 충돌
    if(dist<ta.size+player.size-2&&player.invincible===0){
      applyBossDamage('contact');
    }
  }
  taAssistants=taAssistants.filter(t=>t.alive);
}

function drawTAs(){
  for(const ta of taAssistants){
    if(!ta.alive) continue;
    const pulse=Math.sin(ta.wobble)*1.5;
    ctx.save();
    ctx.shadowColor=ta.color; ctx.shadowBlur=10;
    ctx.fillStyle=ta.color+'33';
    ctx.beginPath(); ctx.arc(ta.x,ta.y,ta.size+pulse+5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=ta.color;
    ctx.beginPath(); ctx.arc(ta.x,ta.y,ta.size+pulse,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.fillStyle='#000';
    ctx.font=`bold ${ta.size-2}px Black Han Sans,sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('조',ta.x,ta.y-2);
    ctx.fillStyle=ta.color;
    ctx.font='bold 6px Noto Sans KR,sans-serif';
    ctx.textBaseline='top';
    ctx.fillText('조교',ta.x,ta.y+ta.size+2);
  }
}

// ── 졸업작품 스튜디오 100클릭 게임 ───────────────────
// courseEntities에서 type==='studio'인 과목은 maxHits=100으로 설정되며
// 1회 접촉당 클릭 1회 처리 (별도 오버레이 없이 게임 내에서 처리)

function spawnEntity(rankId){
  const r=RANKS.find(x=>x.id===rankId);
  if(!r) return;
  entities.push({
    x:Math.random()*W, y:Math.random()*H,
    rank:rankId, rankIdx:getRankIdx(rankId),
    name:r.name,
    size:r.size, color:r.color, pts:r.pts,
    speed:r.speed*0.8+Math.random()*0.4,
    vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2,
    wobble:Math.random()*Math.PI*2, alive:true,
    changeTimer:60+Math.random()*120,
  });
}

function canEatEntity(aRank, bRank){
  const ai=getRankIdx(aRank), bi=getRankIdx(bRank);
  if(ai===0) return false;
  return ai>bi;
}
