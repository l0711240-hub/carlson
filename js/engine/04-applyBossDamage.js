function applyBossDamage(dmg){
  const BOSS_DMG = 45;
  // 설치형 터렛(임용 기출문제, 리딩 등) 발사체는 1/3 데미지
  const actual = (dmg==='turret') ? Math.round(BOSS_DMG/3) : BOSS_DMG;
  if(player.rankIdx === 0){
    player.stamina=Math.max(0,player.stamina-actual);
  } else {
    player.points=Math.max(0,player.points-actual);
  }
  player.invincible=60;
  updateUI();
  if(player.rankIdx===0 && player.stamina<=0){ gameOverFn('stamina'); }
  else if(player.rankIdx>0 && player.rankIdx<=3 && player.points<=0 && !player.gradSchool){ gameOverFn('stamina'); }
  else if(player.rankIdx>0 && player.rankIdx<=3 && player.points<=0 && player.gradSchool){ /* 대학원: 포인트 0이어도 학기종료까지 유지 */ }
  else if(player.rankIdx===4 && player.points<=0){ gameOverFn('stamina'); }
}

function drawBosses(){
  // Draw quake rings
  for(const b of bosses){
    if(!b.alive) continue;
    if(b.quakeActive){
      for(let i=0;i<3;i++){
        const r=30+(i*25)+Math.sin(b.quakePhase+i)*8;
        ctx.beginPath();
        ctx.arc(b.x,b.y,r,0,Math.PI*2);
        ctx.strokeStyle=b.quakeColor||'rgba(255,255,255,0.1)';
        ctx.lineWidth=2;
        ctx.stroke();
      }
    }

    // Slow field aura for 장경호
    if(b.ability==='slowfield'){
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.fieldRadius,0,Math.PI*2);
      const grad=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.fieldRadius);
      grad.addColorStop(0,'rgba(192,132,252,0.08)');
      grad.addColorStop(1,'rgba(192,132,252,0)');
      ctx.fillStyle=grad; ctx.fill();
      ctx.strokeStyle='rgba(192,132,252,0.2)'; ctx.lineWidth=1;
      ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
    }

    // Pull field aura for 정상우
    if(b.ability==='pull'){
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.pullRadius,0,Math.PI*2);
      const grad=ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.pullRadius);
      grad.addColorStop(0,'rgba(52,211,153,0.06)');
      grad.addColorStop(1,'rgba(52,211,153,0)');
      ctx.fillStyle=grad; ctx.fill();
      ctx.strokeStyle='rgba(52,211,153,0.15)'; ctx.lineWidth=1;
      ctx.setLineDash([3,6]); ctx.stroke(); ctx.setLineDash([]);
    }

    // Boss body
    const pulse=Math.sin(b.wobble)*2;
    ctx.save();
    ctx.shadowColor=b.color; ctx.shadowBlur=18;
    ctx.fillStyle=b.color+'22';
    ctx.beginPath(); ctx.arc(b.x,b.y,b.size+pulse+8,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=b.color+'55';
    ctx.beginPath(); ctx.arc(b.x,b.y,b.size+pulse+4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=b.color;
    ctx.beginPath(); ctx.arc(b.x,b.y,b.size+pulse,0,Math.PI*2); ctx.fill();
    ctx.restore();

    // Label
    ctx.fillStyle='#000';
    ctx.font=`bold ${b.size-4}px Black Han Sans,sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('교',b.x,b.y-3);
    ctx.font=`bold 7px Noto Sans KR,sans-serif`;
    ctx.fillStyle=b.color;
    ctx.textBaseline='top';
    ctx.fillText(b.name,b.x,b.y+b.size+3);

    // Speech bubble
    if(b.quoteTimer < 190 && b.quote && b.quote.length > 0){
      const lines=b.quote.split('\n');
      const bw=Math.max(...lines.map(l=>l.length))*5.5+16;
      const bh=lines.length*14+10;
      const bx=b.x-bw/2, by=b.y-b.size-bh-14;
      ctx.fillStyle='rgba(255,255,255,0.92)';
      ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,5); ctx.fill();
      ctx.beginPath(); ctx.moveTo(b.x-6,b.y-b.size-14); ctx.lineTo(b.x+6,b.y-b.size-14); ctx.lineTo(b.x,b.y-b.size-4); ctx.fill();
      ctx.fillStyle='#111';
      ctx.font='bold 9px Noto Sans KR,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='top';
      lines.forEach((line,i)=>ctx.fillText(line,b.x,by+6+i*14));
    }
    if(b.quoteTimer>=b.quoteCooldown){ b.quoteTimer=0; }

    // 김상배 레이저 렌더링
    if(b.ability==='laser_spin' && b.laserActive){
      const lx2=b.x+Math.cos(b.laserAngle)*(b.laserLen||130);
      const ly2=b.y+Math.sin(b.laserAngle)*(b.laserLen||130);
      ctx.save();
      ctx.shadowColor=b.color; ctx.shadowBlur=16;
      ctx.strokeStyle=b.color; ctx.lineWidth=4; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(lx2,ly2); ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,0.85)'; ctx.lineWidth=1.5;
      ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(lx2,ly2); ctx.stroke();
      ctx.restore();
    }
  }

  // Draw projectiles & turrets
  for(const p of bossProjectiles){
    if(!p.alive) continue;
    if(p.isTurret){
      ctx.save();
      ctx.shadowColor=p.color; ctx.shadowBlur=12;
      ctx.fillStyle='#fff';
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      ctx.fillStyle=p.color;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r-2,0,Math.PI*2); ctx.fill();
      ctx.restore();
      ctx.fillStyle='#fff';
      ctx.font='bold 7px Noto Sans KR,sans-serif';
      ctx.textAlign='center'; ctx.textBaseline='middle';
      const tl=p.label||'!';
      ctx.fillText(tl.length>3?tl.substring(0,3):tl, p.x, p.y);
      const lifePct=Math.max(0,p.life/600);
      ctx.fillStyle='#e2e8f0'; ctx.fillRect(p.x-12,p.y-p.r-8,24,3);
      ctx.fillStyle=lifePct>0.5?'#22c55e':'#f97316';
      ctx.fillRect(p.x-12,p.y-p.r-8,24*lifePct,3);
      continue;
    }
    ctx.save();
    ctx.shadowColor=p.color; ctx.shadowBlur=10;
    ctx.fillStyle=p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.fillStyle='#fff';
    ctx.font='bold 8px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('!',p.x,p.y);
  }

  // Stun indicator over player
  if(playerStunTimer>0){
    ctx.font='bold 16px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText('⚡',player.x,player.y-player.size-8);
    ctx.fillStyle='rgba(251,191,36,0.3)';
    ctx.beginPath(); ctx.arc(player.x,player.y,player.size+10,0,Math.PI*2); ctx.fill();
  }

  // Slow indicator over player
  if(playerSlowed){
    ctx.font='bold 14px sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='bottom';
    ctx.fillText('🐢',player.x+14,player.y-player.size-4);
  }
}
// ── 설계비평 클릭게임 ─────────────────────────────────
