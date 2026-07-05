// ══════════════════════════════════════════════════════
// DRAW
// ══════════════════════════════════════════════════════
const catCourseColors={liberal:'#f472b6',geo:'#34d399',agri:'#fbbf24',econ:'#818cf8',forest:'#22c55e',polisci:'#c084fc',japan:'#f59e0b',japan_studies:'#60a5fa',history:'#94a3b8',arthistory:'#c4b5fd',edu_history:'#a3e635',sts:'#fb923c',land:'#4ade80',genv:'#2dd4bf',civil:'#38bdf8',energy:'#fbbf24',chembio:'#a78bfa',earth:'#6ee7b7',lifesci:'#f9a8d4',agrobio:'#fde68a',soc:'#c084fc',intern:'#38bdf8',studio:'#a78bfa',research_contact:'#fbbf24',contact:'#fbbf24',grad:'#a78bfa'};

function draw(){
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#f0f4fb'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='#dde3f0'; ctx.lineWidth=0.5;
  for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}

  // Courses
  for(const c of courseEntities){
    if(!c.visible) continue;
    const pct=c.maxHits>0?c.hits/c.maxHits:0;
    const pulse=Math.sin(c.pulse||0)*2;
    const sz=17+pulse;
    const base=catCourseColors[c.category]||'#34d399';
    // lerp to yellow when complete
    const lerp=(a,b,t)=>Math.round(a+(b-a)*t);
    const r2=lerp(parseInt(base.slice(1,3),16),255,pct*0.6);
    const g2=lerp(parseInt(base.slice(3,5),16),211,pct*0.3);
    const b2=lerp(parseInt(base.slice(5,7),16),61,pct*0.4);
    const col=`rgb(${r2},${g2},${b2})`;

    ctx.save(); ctx.shadowColor=col; ctx.shadowBlur=8+pct*12;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(c.x,c.y,sz,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.strokeStyle='#e2e8f0'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.arc(c.x,c.y,sz,0,Math.PI*2); ctx.stroke();
    if(pct>0){
      ctx.strokeStyle=col; ctx.lineWidth=4; ctx.lineCap='round';
      ctx.beginPath(); ctx.arc(c.x,c.y,sz,-Math.PI/2,-Math.PI/2+pct*Math.PI*2); ctx.stroke();
      ctx.lineCap='butt';
    }
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle=col; ctx.font='bold 10px sans-serif';
    if(c.type==='studio'){
      ctx.fillText('🎨',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillText(`${c.hits}/100`,c.x,c.y+6);
      if(c.hits>=50) ctx.fillStyle='#fbbf24';
    } else if(c.type==='intern'){
      ctx.fillText('💼',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillStyle='#60a5fa';
      ctx.fillText(`${c.hits}/30`,c.x,c.y+6);
    } else if(c.type==='contact'){
      ctx.fillText('🤝',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillText(`${c.hits}/${c.maxHits}`,c.x,c.y+6);
    } else if(c.type==='intern_lab'||c.type==='intern'){
      ctx.fillText('🔬',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillText(`${c.hits}/${c.maxHits}`,c.x,c.y+6);
    } else if(c.type==='land_thesis'){
      ctx.fillText('📝',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillText(`${c.hits}/10`,c.x,c.y+6);
    } else if(c.category==='grad'){
      const gradIcons={lecture:'📚',thesis_res:'📄',ethics:'⚖️',paper:'📝',research:'🔬',thesis:'🏆',ta:'👨‍🏫',lab:'🧪',conference:'🎤',lecture_postdoc:'🎓'};
      ctx.fillText(gradIcons[c.type]||'📌',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillText(`${c.hits}/${c.maxHits===999?'∞':c.maxHits}`,c.x,c.y+6);
    } else {
      ctx.fillText((c.type==='S'||c.type==='S_repeatable')?'★':'📖',c.x,c.y-4);
      ctx.font=`bold 8px Black Han Sans,sans-serif`;
      ctx.fillText(`${c.hits}/${c.maxHits}`,c.x,c.y+6);
    }
    ctx.fillStyle='#475569'; ctx.font='7px Noto Sans KR,sans-serif';
    ctx.textBaseline='top';
    const lbl=c.name.length>8?c.name.substring(0,8)+'…':c.name;
    ctx.fillText(lbl,c.x,c.y+sz+3);
  }

  // Boss mobs (학부 + 대학원 모두 표시)
  if(player.rankIdx<=3) drawBosses();
  if(player.rankIdx===0) drawTAs();

  // Entities
  for(const e of entities){
    const pulse=Math.sin(e.wobble)*1.5;
    ctx.save(); ctx.shadowColor=e.color; ctx.shadowBlur=8;
    ctx.fillStyle=e.color+'33'; ctx.beginPath(); ctx.arc(e.x,e.y,e.size+pulse+4,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=e.color; ctx.beginPath(); ctx.arc(e.x,e.y,e.size+pulse,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.fillStyle='rgba(0,0,0,0.75)'; ctx.font=`bold ${Math.max(7,e.size-3)}px Black Han Sans,sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText({student:'학',master:'석',phd:'박',postdoc:'포',prof:'교'}[e.rank]||'?',e.x,e.y);
  }

  // Player
  const pR=RANKS[player.rankIdx];
  const flash=player.invincible>0&&Math.floor(player.invincible/6)%2===0;
  if(!flash){
    ctx.save(); ctx.shadowColor=pR.color; ctx.shadowBlur=20;
    ctx.strokeStyle=pR.color; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(player.x,player.y,player.size+6,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle=pR.color+'44'; ctx.beginPath(); ctx.arc(player.x,player.y,player.size+6,0,Math.PI*2); ctx.fill();
    ctx.fillStyle=pR.color; ctx.beginPath(); ctx.arc(player.x,player.y,player.size,0,Math.PI*2); ctx.fill();
    ctx.restore();
    ctx.fillStyle='#003092'; ctx.font=`bold ${player.size+2}px Black Han Sans,sans-serif`;
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText('나',player.x,player.y);
  }

  // Stamina bar (모든 랭크)
  {
    const bw=36,bh=5,bx=player.x-18,by=player.y-player.size-14;
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,2); ctx.fill();
    const pct=player.stamina/player.maxStamina;
    ctx.fillStyle=pct>0.6?'#22c55e':pct>0.3?'#f97316':'#ef4444';
    ctx.beginPath(); ctx.roundRect(bx,by,bw*pct,bh,2); ctx.fill();
    ctx.strokeStyle='#334155'; ctx.lineWidth=0.5;
    ctx.beginPath(); ctx.roundRect(bx,by,bw,bh,2); ctx.stroke();
  }

  // Semester bar + countdown
  const sp=semTimer/semDuration, sl=Math.ceil((semDuration-semTimer)/60);
  const bc=sl<=5?'#ef4444':sl<=10?'#f97316':'#334155';
  ctx.fillStyle='#1e2d40'; ctx.fillRect(0,H-6,W,6);
  ctx.fillStyle=bc; ctx.fillRect(0,H-6,W*sp,6);
  ctx.fillStyle=sl<=5?'#ef4444':'#475569';
  ctx.font='bold 10px Black Han Sans,sans-serif'; ctx.textAlign='right'; ctx.textBaseline='bottom';
  ctx.fillText(`학기 종료 ${sl}초`,W-6,H-8);

  // 임용 기출문제 비콘 렌더링
  for(const beacon of bossBeacons){
    if(!beacon.alive) continue;
    ctx.save();
    ctx.shadowColor='#fcd34d'; ctx.shadowBlur=12;
    ctx.fillStyle='#78350f';
    ctx.beginPath(); ctx.arc(beacon.x,beacon.y,beacon.r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='#fcd34d'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(beacon.x,beacon.y,beacon.r,0,Math.PI*2); ctx.stroke();
    ctx.restore();
    ctx.fillStyle='#fcd34d'; ctx.font='bold 8px Noto Sans KR,sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText('기출문제',beacon.x,beacon.y+beacon.r+2);
  }

  // 도트뎀 인디케이터
  if(bossDotActive && bossDotTimer>0){
    ctx.fillStyle='rgba(239,68,68,0.18)';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#ef4444'; ctx.font='bold 12px Black Han Sans,sans-serif';
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText(`🔥 도트뎀 진행중 (${Math.ceil(bossDotTimer/60)}초)`, W/2, 8);
  }

  // 화이트아웃 (장경호)
  if(whiteoutTimer>0){
    const alpha=Math.min(1, whiteoutTimer/20);
    ctx.fillStyle=`rgba(255,255,255,${alpha})`;
    ctx.fillRect(0,0,W,H);
  }

  // 스킬 패시브 FX + 해금 배너
  updateAndDrawSkillFx(ctx);
}

window.addEventListener('resize',()=>{resizeCanvas();});
