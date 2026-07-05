// ══════════════════════════════════════════════════════
// GAME LOOP
// ══════════════════════════════════════════════════════
let keys2={};
window.addEventListener('keydown',e=>{keys[e.key]=true;});
window.addEventListener('keyup',e=>{keys[e.key]=false;});

function loop(){
  if(!gameRunning) return;
  update(); draw();
  animId=requestAnimationFrame(loop);
}

function update(){
  semTimer++;
  // 디버그 모드 자동 완수
  {
    const isGrad = player.rankIdx >= 1 && player.gradSchool;
    const doAutoComplete = (DEBUG_MODE === 'full') ||
                           (DEBUG_MODE === 'undergrad_only' && !isGrad);
    const doPointRefill  = (DEBUG_MODE === 'full') && isGrad;

    if(doAutoComplete && semTimer===1){
      // 포인트/스태미나 보충
      if(player.rankIdx===0) player.stamina=player.maxStamina;
      else player.points=Math.max(player.points,100);
      for(const c of courseEntities){
        if(c.visible && c.hits < c.maxHits){
          if(c.isThesis){
            const req = player.gradDegree==='phd'?50:25;
            c.hits = req;
          } else {
            c.hits = c.maxHits;
          }
        }
      }
      // 인턴 자동 완수
      for(const intern of (player.interns||[])){
        if(!intern.done){ intern.hits=30; }
      }
      // 연구 계획 자동 완수
      for(const ce of courseEntities){
        if(ce.category==='research_contact') ce.hits=10;
      }
    }
    // 전체 디버그 + 대학원: 매 프레임 포인트 풀충 (승급 바로 가능)
    if(doPointRefill){
      const th = getPromoteThreshold(player.rankIdx);
      if(player.points < th) player.points = th + 10;
    }
  }
  if(semTimer>=semDuration){
    semTimer=0;
    if(player.rankIdx===0){
      // 학부생: 학기 종료 처리
      gameRunning=false; cancelAnimationFrame(animId);
      endSemester();
      checkPromotion();
      if(gameRunning) return; // transcript overlay opened
      // showSemResult()가 nextSemester()를 대신 호출함
      return;
    } else {
      // 석사 이상: 타이머 리셋, 스태미나 풀충전 (대학원은 계절학기 없음)
      gameSem = gameSem===1 ? 2 : 1;
      if(gameSem===1) gameYear++;
      for(let i=0;i<5+Math.floor(Math.random()*5);i++) spawnEntity('student');
      player.stamina = player.maxStamina; // 석사 이상: 매 학기 풀충전
      // 대학원/포닥/교수 과정이면 endGradSemester 호출
      if(player.rankIdx>=1 && player.rankIdx<=4 && player.gradSchool){
        gameRunning=false; cancelAnimationFrame(animId);
        endGradSemester(); return;
      }
      updateUI();
      // gameRunning stays true, loop continues
    }
  }

  // Player move (check stun)
  let dx=0,dy=0;
  if(playerStunTimer<=0){
    if(keys['ArrowUp']||keys['w']||keys['W']) dy=-1;
    if(keys['ArrowDown']||keys['s']||keys['S']) dy=1;
    if(keys['ArrowLeft']||keys['a']||keys['A']) dx=-1;
    if(keys['ArrowRight']||keys['d']||keys['D']) dx=1;
    if(dx&&dy){dx*=0.707;dy*=0.707;}
  }
  const effectiveSpeed = playerSlowed ? player.speed*0.8 : player.speed;
  player.vx=dx*effectiveSpeed; player.vy=dy*effectiveSpeed;
  player.x=Math.max(player.size,Math.min(W-player.size,player.x+player.vx));
  player.y=Math.max(player.size,Math.min(H-player.size,player.y+player.vy));
  if(player.invincible>0) player.invincible--;

  // Boss mobs
  if(player.rankIdx<=3) updateBosses();
  if(player.rankIdx===0) updateTAs();

  // Stamina regen (학부생만 자동회복, 석사 이상은 매 학기 충전)
  if(player.rankIdx===0) player.stamina = Math.min(player.maxStamina, player.stamina + 0.08);

  // Point drain 없음 — 포인트는 잡아먹기로만 증가

  // Entities
  for(const e of entities){
    if(!e.alive) continue;
    e.wobble+=0.05; e.changeTimer--;
    if(e.changeTimer<=0){
      e.vx=(Math.random()-0.5)*2*e.speed; e.vy=(Math.random()-0.5)*2*e.speed;
      e.changeTimer=60+Math.random()*120;
    }
    if(canEatEntity(player.rank,e.rank)){
      const ddx=e.x-player.x,ddy=e.y-player.y,dist=Math.sqrt(ddx*ddx+ddy*ddy);
      if(dist<120&&dist>0){e.vx+=(ddx/dist)*0.2;e.vy+=(ddy/dist)*0.2;}
    }
    if(canEatEntity(e.rank,player.rank)&&player.invincible===0){
      const ddx=player.x-e.x,ddy=player.y-e.y,dist=Math.sqrt(ddx*ddx+ddy*ddy);
      if(dist<180&&dist>0){e.vx+=(ddx/dist)*0.15;e.vy+=(ddy/dist)*0.15;}
    }
    const spd=Math.sqrt(e.vx*e.vx+e.vy*e.vy);
    if(spd>e.speed){e.vx=e.vx/spd*e.speed;e.vy=e.vy/spd*e.speed;}
    e.x=Math.max(e.size,Math.min(W-e.size,e.x+e.vx));
    e.y=Math.max(e.size,Math.min(H-e.size,e.y+e.vy));
    if(e.x<=e.size||e.x>=W-e.size) e.vx*=-1;
    if(e.y<=e.size||e.y>=H-e.size) e.vy*=-1;
  }

  // Course interaction
  for(const c of courseEntities){
    c.pulse+=0.05;
    if(!c.visible&&semTimer>=c.appearAt){
      c.visible=true;
      addLog(`📖 ${c.name} 수업 시작`,'log-info');
    }
    if(!c.visible) continue;
    c.wanderTimer--;
    if(c.wanderTimer<=0){c.vx=(Math.random()-0.5)*0.6;c.vy=(Math.random()-0.5)*0.6;c.wanderTimer=120+Math.random()*180;}
    c.x=Math.max(20,Math.min(W-20,c.x+c.vx)); c.y=Math.max(20,Math.min(H-20,c.y+c.vy));
    if(c.x<=20||c.x>=W-20) c.vx*=-1; if(c.y<=20||c.y>=H-20) c.vy*=-1;
    if(c.cooldown>0) c.cooldown--;
    const cdx=player.x-c.x,cdy=player.y-c.y,dist=Math.sqrt(cdx*cdx+cdy*cdy);
    if(dist<player.size+16&&c.cooldown===0&&c.hits<c.maxHits){
      if(player.rankIdx===0){
        // 학문의 세계(div_liberal): 픽순에 따른 랜덤 진행도, 죽음의 과학적 이해는 3
        let hitsGain = 1;
        if(c.type==='div_liberal'){
          const cd2 = ALL_COURSES_WITH_POLISCI.find(x=>x.code===c.code);
          if(cd2 && cd2.specialPickRule==='death_science'){
            // 죽음의 과학적 이해: 3 고정
            hitsGain = 3;
          } else if(cd2 && cd2.minPick===3){
            // 권장픽 3픽 과목 (테마중국사·심리학개론 등): 1~4
            hitsGain = 1 + Math.floor(Math.random()*4);
          } else if(cd2 && cd2.minPick===2){
            // 권장픽 2픽 과목 (참살이의학특강 등): 2~4
            hitsGain = 2 + Math.floor(Math.random()*3);
          } else {
            // 나머지 학문의 세계: 1~3
            hitsGain = 1 + Math.floor(Math.random()*3);
          }
        }
        c.hits = Math.min(c.maxHits, c.hits + hitsGain);
        c.cooldown=35;
        if(c.hits%5===0||c.hits===c.maxHits) addLog(`📖 ${c.name} ${c.hits}/${c.maxHits}회`,'log-info');
        triggerSkillPassive(c);
      } else if(c.category==='grad'||c.category==='contact'||c.category==='research_contact'){
        // 대학원 courseEntity에 닿으면 hits 증가
        c.hits++; c.cooldown=40;
        if(c.isThesis){ player.gradThesisHits=Math.max(player.gradThesisHits,c.hits); }
        if(c.hits===c.maxHits) addLog(`✅ ${c.name} 완료!`,'log-level');
        else if(c.hits%3===0) addLog(`📌 ${c.name} ${c.hits}/${c.maxHits}`,'log-info');
        updateUI();
      } else {
        c.cooldown=90; player.points+=1; updateUI();
      }
    }
  }

  // Entity collision
  for(const e of entities){
    if(!e.alive) continue;
    const ddx=player.x-e.x,ddy=player.y-e.y,dist=Math.sqrt(ddx*ddx+ddy*ddy);
    if(dist<player.size+e.size-4){
      if(canEatEntity(player.rank,e.rank)){
        e.alive=false;
        const rawPts = e.pts;
        const mult = player._gradPtMult || 1.0;
        const gained = Math.round(rawPts * mult);
        player.points += gained;
        addLog(`🔥 ${e.name} 잡아먹음! (+${gained}pt${mult>1?' ×'+mult.toFixed(2):''})`, 'log-eat');
        updateUI();
        if(player.rankIdx>0){
          // 대학원/포닥 중에는 포인트 자동승급 차단 (endGradSemester에서만 승급)
          const inGradProgram = player.gradSchool && ['master','phd','postdoc'].includes(player.gradDegree||'');
          if(!inGradProgram){
            const th1=getPromoteThreshold(1), th2=getPromoteThreshold(2), th3=getPromoteThreshold(3);
            if(player.rankIdx===1&&player.points>=th1) promote('phd');
            else if(player.rankIdx===2&&player.points>=th2) promote('postdoc');
            else if(player.rankIdx===3&&player.points>=th3) promote('prof');
            // rankIdx===4(교수)는 promote('prof')에서 winGame() 호출하므로 여기선 처리 안 함
          }
        }
        setTimeout(()=>{if(entities.filter(x=>x.rank===e.rank).length<5) spawnEntity(e.rank);},2000);
      } else if(canEatEntity(e.rank,player.rank)&&player.invincible===0){
        const dmg = e.pts * 3;
        player.stamina = Math.max(0, player.stamina - dmg);
        player.invincible = 90;
        addLog(`😱 ${e.name||'?'}에 공격! 스태미나 -${Math.round(dmg)}`,'log-eat');
        updateUI();
        if(player.stamina <= 0){ gameOverFn('stamina'); return; }
      }
    }
  }
  entities=entities.filter(e=>e.alive);
  const counts={student:0,master:0,phd:0,postdoc:0,prof:0};
  for(const e of entities) counts[e.rank]++;
  const mins={student:10,master:4,phd:2,postdoc:1,prof:1};
  for(const [rank,min] of Object.entries(mins)) if(counts[rank]<min) spawnEntity(rank);
}
