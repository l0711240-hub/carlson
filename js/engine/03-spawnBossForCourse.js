function spawnBossForCourse(courseCode){
  let def = BOSS_DEFS[courseCode];
  if(!def) return;
  // randomNames가 있으면 무작위 선택
  if(def.randomNames && def.randomNames.length>0){
    const chosenName = def.randomNames[Math.floor(Math.random()*def.randomNames.length)];
    def = {...def, name:chosenName};
  }
  // Don't double-spawn same boss
  if(bosses.find(b=>b.courseCode===courseCode)) return;
  bosses.push({
    courseCode,
    x: 60+Math.random()*(W-120),
    y: 60+Math.random()*(H-120),
    ...def,
    vx:(Math.random()-0.5)*0.8,
    vy:(Math.random()-0.5)*0.8,
    wobble:Math.random()*Math.PI*2,
    quakePhase:0,
    quakeActive:false,
    quakeTimer:0,
    changeTimer:120+Math.random()*180,
    attackTimer:0,
    stunTimer:0,
    alive:true,
    // Quote bubble
    quoteTimer:0,
    quoteCooldown:240+Math.random()*300,
  });
}

function updateBosses(){
  playerSlowed = (playerSlowTimer > 0);

  for(const b of bosses){
    if(!b.alive) continue;
    b.wobble += 0.04;
    b.quakePhase += 0.12;
    b.quoteTimer++;
    b.changeTimer--;

    // Wander
    if(b.changeTimer<=0){
      b.vx=(Math.random()-0.5)*1.4; b.vy=(Math.random()-0.5)*1.4;
      b.changeTimer=120+Math.random()*180;
    }

    // Always drift toward player slowly
    const ddx=player.x-b.x, ddy=player.y-b.y;
    const dist=Math.sqrt(ddx*ddx+ddy*ddy);
    if(dist>0){b.vx+=(ddx/dist)*0.04; b.vy+=(ddy/dist)*0.04;}

    const spd=Math.sqrt(b.vx*b.vx+b.vy*b.vy);
    if(spd>0.9){b.vx=b.vx/spd*0.9; b.vy=b.vy/spd*0.9;}

    b.x=Math.max(b.size,Math.min(W-b.size,b.x+b.vx));
    b.y=Math.max(b.size,Math.min(H-b.size,b.y+b.vy));
    if(b.x<=b.size||b.x>=W-b.size) b.vx*=-1;
    if(b.y<=b.size||b.y>=H-b.size) b.vy*=-1;

    // ── ABILITY LOGIC ──────────────────────────────────
    if(b.ability==='slowfield'){
      // Slow player if in range
      if(dist < b.fieldRadius){
        playerSlowed = true;
        // Quake effect when player is in range
        b.quakeActive = true;
      } else {
        b.quakeActive = false;
      }
      // Damage on direct contact
      if(dist < b.size+player.size && player.invincible===0){
        applyBossDamage(8);
      }
    }

    if(b.ability==='rangedattack'){
      b.attackTimer++;
      b.quakeActive = b.attackTimer % 60 < 20;
      if(b.attackTimer >= (b.attackCooldown||180)){
        b.attackTimer=0;
        // quotes 배열이 있으면 순환 선택
        if(b.quotes && b.quotes.length>0){
          b.quoteIdx = ((b.quoteIdx||0) + 1) % b.quotes.length;
          b.quote = b.quotes[b.quoteIdx];
        }
        const ang=Math.atan2(player.y-b.y, player.x-b.x);
        bossProjectiles.push({
          x:b.x, y:b.y,
          vx:Math.cos(ang)*(b.projectileSpeed||2.5),
          vy:Math.sin(ang)*(b.projectileSpeed||2.5),
          color:b.color, r:6, alive:true,
          boss:b.name,
        });
        b.quoteTimer = 0;
      }
      if(dist < b.size+player.size && player.invincible===0){
        applyBossDamage('contact');
      }
    }

    if(b.ability==='stun'){
      b.stunTimer++;
      b.quakeActive = b.stunTimer % 60 < 20;
      if(b.stunTimer >= (b.stunCooldown||300) && dist < 180){
        b.stunTimer=0;
        if(playerStunTimer===0){
          playerStunTimer = b.stunDuration||120;
          b.quoteTimer=0; // show quote on stun
          addLog(`⚡ ${b.name}의 야코비 행렬! 1초 스턴!`,'log-eat');
        }
      }
      if(dist < b.size+player.size && player.invincible===0){
        applyBossDamage(10);
      }
    }

    if(b.ability==='pull'){
      b.quakeActive = dist < b.pullRadius;
      if(dist < b.pullRadius && dist > b.size+player.size){
        // Pull player toward boss
        const str = b.pullStrength||1.2;
        player.x -= (ddx/dist)*str*(1-dist/b.pullRadius);
        player.y -= (ddy/dist)*str*(1-dist/b.pullRadius);
        player.x=Math.max(player.size,Math.min(W-player.size,player.x));
        player.y=Math.max(player.size,Math.min(H-player.size,player.y));
      }
      if(dist < b.size+player.size && player.invincible===0){
        applyBossDamage(7);
        b.quoteTimer=0;
      }
    }

    if(b.ability==='hitreduce'){
      b.attackTimer = (b.attackTimer||0) + 1;
      b.quakeActive = b.attackTimer % 80 < 25;
      const timeLeft = semDuration - semTimer;
      if(b.attackTimer >= (b.hitReduceCooldown||300) && timeLeft > 600){
        b.attackTimer = 0;
        b.quoteTimer = 0;
        const econPool = player.rankIdx===0
          ? courseEntities.filter(c=>c.code==='212.214'&&c.visible&&c.hits>0)
          : courseEntities.filter(c=>c.category==='grad'&&c.visible&&c.hits>0);
        if(econPool.length>0){
          const econTarget=econPool[Math.floor(Math.random()*econPool.length)];
          econTarget.hits--;
          addLog(`📉 정동준: ${econTarget.name} 진도 -1!`,'log-eat');
        }
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(5);
    }

    // 김영순: 랜덤 말풍선 → 정지 or 원격공격
    if(b.ability==='forest_parkpil'){
      b.attackTimer = (b.attackTimer||0)+1;
      b.quakeActive = b.attackTimer % 70 < 20;
      if(b.attackTimer >= (b.actionCooldown||240)){
        b.attackTimer = 0;
        // Pick random action
        const roll = Math.random();
        let cumulative = 0, chosen = 0;
        for(let qi=0; qi<b.quoteWeights.length; qi++){
          cumulative += b.quoteWeights[qi];
          if(roll < cumulative){ chosen=qi; break; }
        }
        b.quote = b.quotes[chosen];
        b.quoteTimer = 0;
        if(b.isRanged[chosen]){
          // Fire projectile
          const ang=Math.atan2(player.y-b.y, player.x-b.x);
          bossProjectiles.push({x:b.x,y:b.y,vx:Math.cos(ang)*2.5,vy:Math.sin(ang)*2.5,color:b.color,r:6,alive:true,boss:b.name});
        } else if(b.stunDurations[chosen]>0 && playerStunTimer===0){
          playerStunTimer = b.stunDurations[chosen];
          addLog(`⚡ ${b.name}: ${b.quote}!`,'log-eat');
        }
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(6);
    }

    // 김영순: 랜덤 말풍선 → 1초 정지 + 진도 -1 (학기 종료 10초 전 발동 안함)
    if(b.ability==='forest_jang'){
      b.attackTimer = (b.attackTimer||0)+1;
      b.quakeActive = b.attackTimer % 80 < 25;
      const timeLeft = semDuration - semTimer;
      if(b.attackTimer >= (b.actionCooldown||300) && timeLeft > 600){
        b.attackTimer = 0;
        b.quote = b.quotes[Math.floor(Math.random()*b.quotes.length)];
        b.quoteTimer = 0;
        if(playerStunTimer===0) playerStunTimer = b.stunDuration||60;
        // 대학원이면 grad 과목 중 무작위, 학부면 수목학 코드 고정
        const jangPool=player.rankIdx===0
          ? courseEntities.filter(c=>c.code===b.targetCode&&c.visible&&c.hits>0)
          : courseEntities.filter(c=>c.category==='grad'&&c.visible&&c.hits>0);
        if(jangPool.length>0){
          const sumoк=jangPool[Math.floor(Math.random()*jangPool.length)];
          sumoк.hits--;
          addLog(`📉 김영순: ${b.quote} — ${sumoк.name} 진도 -1!`,'log-eat');
        }
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(6);
    }

    // 정상우: 1초에 5씩 3초 도트뎀
    if(b.ability==='dot_damage'){
      b.attackTimer = (b.attackTimer||0)+1;
      b.quakeActive = b.attackTimer % 90 < 30;
      if(b.attackTimer >= (b.dotCooldown||300)){
        b.attackTimer=0;
        b.quoteTimer=0;
        bossDotActive=true;
        bossDotTimer=b.dotDuration||180;
        bossDotDps=b.dotDps||5;
        addLog(`🔥 ${b.name}: 이게 과제인지 의심스러운 정도입니다! (도트뎀 시작)`,'log-eat');
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(5);
    }

    // 정상우: 5초 속도 절반
    if(b.ability==='slow_debuff'){
      b.attackTimer = (b.attackTimer||0)+1;
      b.quakeActive = b.attackTimer % 90 < 25;
      if(b.attackTimer >= (b.slowCooldown||360)){
        b.attackTimer=0;
        b.quoteTimer=0;
        playerSlowTimer=Math.max(playerSlowTimer, b.slowDuration||300);
        addLog(`🐢 ${b.name}: ${b.quote.split('\n')[0]}! 속도 절반!`,'log-eat');
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(6);
    }

    // 김지훈: 1초 정지, 단 한 번만
    if(b.ability==='once_stun'){
      b.quakeActive = false;
      if(!b.triggered && dist < 200){
        b.triggered=true;
        b.quoteTimer=0;
        playerStunTimer=Math.max(playerStunTimer, b.stunDuration||180);
        addLog(`🚫 김지훈: 조별 현장연구! 3초 정지!`,'log-eat');
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(5);
    }

    // 김지훈: 진도 1 감소 (학기 종료 10초 전 발동 안함)
    if(b.ability==='hit_reduce_climate'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%90<25;
      const timeLeft=semDuration-semTimer;
      if(b.attackTimer>=(b.hitReduceCooldown||360) && timeLeft>600){
        b.attackTimer=0;
        b.quoteTimer=0;
        // 학부: 기후학과 기후변화 고정, 대학원: grad 과목 중 무작위
        const climTarget=player.rankIdx===0
          ? courseEntities.find(c=>c.code==='M1310.001000'&&c.visible&&c.hits>0)
          : courseEntities.filter(c=>c.category==='grad'&&c.visible&&c.hits>0)[Math.floor(Math.random()*courseEntities.filter(c=>c.category==='grad'&&c.visible&&c.hits>0).length)];
        if(climTarget){ climTarget.hits--; addLog(`🦣 김지훈: 과다살육설! ${climTarget.name} 진도 -1!`,'log-eat'); }
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(5);
    }

    // 김영순: 임용 기출문제 설치
    if(b.ability==='spawn_beacon'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%100<30;
      if(b.attackTimer>=(b.beaconCooldown||420)){
        b.attackTimer=0;
        b.quoteTimer=0;
        // 보스 주변 랜덤 위치에 설치 (최대 3개)
        if(bossBeacons.length<3){
          const angle=Math.random()*Math.PI*2;
          const r=80+Math.random()*100;
          bossBeacons.push({
            x: Math.max(30, Math.min(W-30, b.x+Math.cos(angle)*r)),
            y: Math.max(30, Math.min(H-30, b.y+Math.sin(angle)*r)),
            attackTimer:0, attackCooldown:120, projectileSpeed:2.2,
            color:'#fcd34d', r:8, alive:true, boss:b.name,
          });
          addLog(`🗿 김영순: 무명수! 임용 기출문제 설치!`,'log-eat');
        }
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(6);
    }

    // 장경호: 1초 화이트아웃
    if(b.ability==='whiteout'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%100<30;
      if(b.attackTimer>=(b.whiteoutCooldown||420)){
        b.attackTimer=0;
        whiteoutTimer=60; // 1초
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(5);
    }


    // 장경호: 도트뎀 + 속도 절반 / 계량경제학: 속도 절반만 (slow_debuff 재사용)
    if(b.ability==='dot_and_slow'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%90<25;
      if(b.attackTimer>=(b.actionCooldown||360)){
        b.attackTimer=0;
        b.quoteTimer=0;
        bossDotActive=true;
        bossDotTimer=b.dotDuration||180;
        bossDotDps=b.dotDps||5;
        playerSlowTimer=Math.max(playerSlowTimer, b.slowDuration||300);
        addLog(`🔥🐢 ${b.name}: ${b.quote.split('\n')[0]}! 도트뎀+속도 절반!`,'log-eat');
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(6);
    }

    // 정동준: 속도 절반 + 끌어당김
    if(b.ability==='slow_and_pull'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=dist < (b.pullRadius||160);
      // 끌어당김 (지속)
      if(dist < (b.pullRadius||160) && dist > b.size+player.size){
        const str=b.pullStrength||1.0;
        player.x -= (ddx/dist)*str*(1-dist/b.pullRadius);
        player.y -= (ddy/dist)*str*(1-dist/b.pullRadius);
        player.x=Math.max(player.size,Math.min(W-player.size,player.x));
        player.y=Math.max(player.size,Math.min(H-player.size,player.y));
        playerSlowed=true;
        playerSlowTimer=Math.max(playerSlowTimer, 10);
      }
      if(b.attackTimer>=(b.actionCooldown||360)){
        b.attackTimer=0;
        b.quoteTimer=0;
        playerSlowTimer=Math.max(playerSlowTimer, b.slowDuration||300);
        addLog(`🌀 정동준: 회사채이자율스프레드! 속도 절반+끌어당김!`,'log-eat');
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(6);
    }

    // 이브게론: 진도 1 감소 (학기 종료 제한 없음)
    if(b.ability==='hit_reduce_game'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%100<30;
      if(b.attackTimer>=(b.hitReduceCooldown||360)){
        b.attackTimer=0;
        b.quoteTimer=0;
        // 학부: 게임이론 및 응용 고정, 대학원: grad 과목 중 무작위
        const gradPool2=courseEntities.filter(c=>c.category==='grad'&&c.visible&&c.hits>0);
        const gameTarget=player.rankIdx===0
          ? courseEntities.find(c=>c.code==='212.339'&&c.visible&&c.hits>0)
          : gradPool2[Math.floor(Math.random()*gradPool2.length)];
        if(gameTarget){ gameTarget.hits--; addLog(`💤 이브게론: let's take a break! ${gameTarget.name} 진도 -1!`,'log-eat'); }
      }
      if(dist < b.size+player.size && player.invincible===0) applyBossDamage(5);
    }

    // ── 정치외교학부 보스 어빌리티 ─────────────────────────

    // 이정환: 세개의 화살 (120도 간격으로 동시 3발)
    if(b.ability==='triple_arrow'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%80<20;
      if(b.attackTimer>=(b.attackCooldown||200)){
        b.attackTimer=0; b.quoteTimer=0;
        const baseAng=Math.atan2(player.y-b.y, player.x-b.x);
        for(let i=-1;i<=1;i++){
          const ang=baseAng+(i*Math.PI/6); // ±30도
          bossProjectiles.push({x:b.x,y:b.y,vx:Math.cos(ang)*(b.projectileSpeed||3.2),vy:Math.sin(ang)*(b.projectileSpeed||3.2),color:b.color,r:5,alive:true,boss:b.name});
        }
        addLog(`🏹 이정환: 세개의 화살!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 강원택: 1초 정지 — stun 어빌리티는 기존 로직 재사용

    // 김상배: 레이저 회전
    if(b.ability==='laser_spin'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.laserActive||false;
      if(!b.laserActive&&b.attackTimer>=(b.laserCooldown||360)){
        b.attackTimer=0; b.quoteTimer=0;
        b.laserActive=true;
        b.laserDuration=Math.PI*2/(b.laserSpeed||0.022); // 한 바퀴 완료 프레임
        b.laserAngle=0;
        addLog(`⚡ 김상배: AI 안보 레이저 가동!`,'log-eat');
      }
      if(b.laserActive){
        b.laserAngle+=(b.laserSpeed||0.022);
        b.laserDuration--;
        if(b.laserDuration<=0) b.laserActive=false;
        // 레이저 충돌 판정: 플레이어가 레이저 선분 위에 있는지
        const lx2=b.x+Math.cos(b.laserAngle)*(b.laserLen||130);
        const ly2=b.y+Math.sin(b.laserAngle)*(b.laserLen||130);
        // 선분까지 거리 계산
        const ldx=lx2-b.x, ldy=ly2-b.y, ll=Math.sqrt(ldx*ldx+ldy*ldy);
        if(ll>0){
          const t=Math.max(0,Math.min(1,((player.x-b.x)*ldx+(player.y-b.y)*ldy)/(ll*ll)));
          const cx2=b.x+t*ldx, cy2=b.y+t*ldy;
          const pdist=Math.sqrt((player.x-cx2)**2+(player.y-cy2)**2);
          if(pdist<player.size+5&&player.invincible===0) applyBossDamage('contact');
        }
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 박원호: rangedattack — 기존 로직 재사용

    // 박종희(slow_debuff): 5초 속도 80%
    if(b.ability==='slow_debuff'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%80<25;
      if(b.attackTimer>=(b.slowCooldown||360)){
        b.attackTimer=0; b.quoteTimer=0;
        playerSlowTimer=Math.max(playerSlowTimer, b.slowDuration||300);
        addLog(`🐢 ${b.name}: ${b.quote}! 속도 감소!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 신범식: 리딩 터렛 설치
    if(b.ability==='reading_turret'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%100<30;
      if(b.attackTimer>=(b.turretCooldown||400)){
        b.attackTimer=0; b.quoteTimer=0;
        bossProjectiles.push({
          isTurret:true,
          x:b.x+(Math.random()-0.5)*80,
          y:b.y+(Math.random()-0.5)*80,
          vx:0,vy:0,color:b.color,r:10,alive:true,boss:b.name,
          label:'리딩',
          atkTimer:0,atkCooldown:120,projSpeed:2.8,
          life:600,
        });
        addLog(`📖 신범식: 리딩 설치!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 일본언어문명/역사학부 보스 어빌리티 ─────────────────

    // Andriesse: 플레이어 근방 무작위 순간이동
    if(b.ability==='player_teleport'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%90<28;
      if(b.attackTimer>=(b.teleportCooldown||300)){
        b.attackTimer=0; b.quoteTimer=0;
        const r = b.teleportRadius||120;
        const ang = Math.random()*Math.PI*2;
        const teleR = 40 + Math.random()*r;
        const nx = Math.max(player.size, Math.min(W-player.size, player.x+Math.cos(ang)*teleR));
        const ny = Math.max(player.size, Math.min(H-player.size, player.y+Math.sin(ang)*teleR));
        player.x = nx; player.y = ny;
        player.invincible = Math.max(player.invincible, 30);
        addLog(`🌊 Andriesse: Seaweeds Value Chain! 플레이어 이동!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 박수철: 자신이 방향 이동 (근기=원형, 관서=오른쪽, 동북=오른쪽위, 남해=아래, 서국=왼쪽)
    if(b.ability==='directional_push'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.pushActive||false;
      if(!b.pushActive && b.attackTimer>=(b.pushCooldown||240)){
        b.attackTimer=0;
        const idx=Math.floor(Math.random()*b.quotes.length);
        b.quote=b.quotes[idx];
        b.pushDir=b.pushDirs[idx];
        b.pushActive=true;
        b.pushTimer=90; // 1.5초간 이동
        b.quoteTimer=0;
        addLog(`🗾 박수철: ${b.quote}!`,'log-eat');
      }
      if(b.pushActive){
        b.pushTimer--;
        if(b.pushTimer<=0){ b.pushActive=false; b.pushDir=null; }
        else {
          const spd=2.5;
          if(b.pushDir==='orbit'){
            // 플레이어 주위를 원형으로 공전
            const angle=Math.atan2(b.y-player.y, b.x-player.x)+0.06;
            const orbitR=Math.max(60,dist);
            b.x=player.x+Math.cos(angle)*orbitR;
            b.y=player.y+Math.sin(angle)*orbitR;
            b.x=Math.max(b.size,Math.min(W-b.size,b.x));
            b.y=Math.max(b.size,Math.min(H-b.size,b.y));
          } else if(b.pushDir==='right'){
            b.vx=spd; b.vy=0;
          } else if(b.pushDir==='right_up'){
            b.vx=spd*0.707; b.vy=-spd*0.707;
          } else if(b.pushDir==='down'){
            b.vx=0; b.vy=spd;
          } else if(b.pushDir==='left'){
            b.vx=-spd; b.vy=0;
          }
        }
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 조경학 보스 어빌리티 ──────────────────────────────

    // 정동준: 원격공격 + 학기당 1회 조교(박사) 소환
    if(b.ability==='ta_spawn'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.taTimer=(b.taTimer||0)+1;
      b.quakeActive=b.attackTimer%60<20;
      if(b.attackTimer>=(b.attackCooldown||200)){
        b.attackTimer=0;
        const ang=Math.atan2(player.y-b.y, player.x-b.x);
        bossProjectiles.push({x:b.x,y:b.y,
          vx:Math.cos(ang)*(b.projectileSpeed||2.8),
          vy:Math.sin(ang)*(b.projectileSpeed||2.8),
          color:b.color, r:6, alive:true, boss:b.name});
        b.quoteTimer=0;
      }
      if(b.taTimer>=(b.taCooldown||600)){
        b.taTimer=0;
        // 조교(박사 수준) 소환 — taAssistants 배열에 등록
        taAssistants.push({
          x:b.x+(Math.random()-0.5)*80, y:b.y+(Math.random()-0.5)*80,
          vx:0, vy:0, size:13, color:'#fb923c', pts:5,
          speed:0.55, alive:true, wobble:0, changeTimer:60,
          isTA:true,
        });
        addLog(`🎓 ${b.name}: 조교 소환!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 박선미(조경식물재료학): 15초마다 1초 정지, 최대 3회
    if(b.ability==='repeat_stun'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=false;
      if((b.stunCount||0)<(b.maxStuns||3) && b.attackTimer>=(b.stunInterval||900)){
        b.attackTimer=0; b.quoteTimer=0;
        b.stunCount=(b.stunCount||0)+1;
        // 랜덤 말풍선 (quotes 배열 있으면 사용)
        if(b.quotes && b.quotes.length) b.quote = b.quotes[Math.floor(Math.random()*b.quotes.length)];
        playerStunTimer=Math.max(playerStunTimer, b.stunDuration||60);
        addLog(`📢 ${b.name}: "${b.quote}" — 1초 정지!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 박배균: 말풍선 띄우며 화면 왼쪽으로 텔레포트
    if(b.ability==='teleport_left'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=false;
      if(b.attackTimer>=(b.teleportCooldown||300)){
        b.attackTimer=0;
        // 랜덤 말풍선 변경
        if(b.quotes && b.quotes.length) b.quote = b.quotes[Math.floor(Math.random()*b.quotes.length)];
        b.quoteTimer=0;
        // 화면 왼쪽 랜덤 위치로 텔레포트
        b.x = b.size + Math.random() * (W * 0.15);
        b.y = b.size + Math.random() * (H - b.size * 2);
        b.vx = 0; b.vy = 0;
        addLog(`📖 ${b.name}: "${b.quote}" (텔레포트!)`, 'log-info');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // 박선미/박선미(설계): critique_click — 미니게임 트리거
    if(b.ability==='critique_click'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%80<25;
      if(b.attackTimer>=(b.attackCooldown||600) && !critiqueActive){
        b.attackTimer=0; b.quoteTimer=0;
        // 현재 보스와 연결된 수강 중인 과목 찾기
        const relCourse = courseEntities.find(c=>c.visible&&c.hits<c.maxHits);
        startCritiqueGame(b, relCourse||null);
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }


    // ── Andriesse: 리딩 터렛 설치 (논문 이름 무작위) ──────────
    if(b.ability==='andriesse_turret'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%90<28;
      if(b.attackTimer>=(b.turretCooldown||360)){
        b.attackTimer=0; b.quoteTimer=0;
        const rNames=b.readingNames||['Reading'];
        const rName=rNames[Math.floor(Math.random()*rNames.length)];
        b.quote=rName;
        bossBeacons.push({
          x:40+Math.random()*(W-80), y:40+Math.random()*(H-80),
          color:b.color, r:8, alive:true, boss:b.name,
          attackTimer:0, attackCooldown:150,
          projSpeed:2.5, label:rName.slice(0,12),
        });
        addLog(`📚 Andriesse: "${rName}" 배치!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 정상우: 도트뎀 or 실습 클릭게임 ──────────────────────
    if(b.ability==='dot_or_critique'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%80<25;
      // 도트뎀
      if(b.attackTimer%(b.dotCooldown||300)===0 && !bossDotActive){
        bossDotActive=true; bossDotTimer=b.dotDuration||180; bossDotDps=b.dotDps||4;
        b.quoteTimer=0;
        addLog(`🔥 ${b.name}: 도트뎀!`,'log-eat');
      }
      // 실습 클릭게임
      if(b.attackTimer>=(b.attackCooldown||480) && !critiqueActive && !bossDotActive){
        b.attackTimer=0; b.quoteTimer=0;
        const relCourse=courseEntities.find(c=>c.visible&&c.hits<c.maxHits);
        startCritiqueGame(b, relCourse||null);
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 박선미: 진도 감소 or 속도 절반 (무작위) ───────────────
    if(b.ability==='hit_reduce_or_slow'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%80<25;
      const timeLeft=semDuration-semTimer;
      if(b.attackTimer>=(b.hitReduceCooldown||600) && timeLeft>600){
        b.attackTimer=0; b.quoteTimer=0;
        if(Math.random()<0.5){
          // 진도 1 감소
          // 학부: 재정 및 조세정책 디자인 고정, 대학원: grad 과목 중 무작위
          const parGradPool=courseEntities.filter(c=>c.category==='grad'&&c.visible&&c.hits>0);
          const parTarget=player.rankIdx===0
            ? courseEntities.find(c=>c.code==='M1314.004500'&&c.visible&&c.hits>0)
            : parGradPool[Math.floor(Math.random()*parGradPool.length)];
          if(parTarget){ parTarget.hits=Math.max(0,parTarget.hits-1); addLog(`📉 박선미: ${parTarget.name} 진도 -1!`,'log-eat'); }
        } else {
          // 속도 절반
          playerSlowTimer=Math.max(playerSlowTimer,b.slowDuration||300);
          addLog(`🐢 박선미: Solow! 속도 절반!`,'log-eat');
        }
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 김영순: 15초마다 1초 스턴 + 원격공격/실습클릭 ────────
    if(b.ability==='parkpil_combo'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.stunTimer=(b.stunTimer||0)+1;
      b.quakeActive=b.attackTimer%60<20;
      // 15초마다 스턴
      if(b.stunTimer>=(b.stunCooldown||900)){
        b.stunTimer=0; b.quoteTimer=0;
        const qi=Math.floor(Math.random()*(b.quotes||['실습']).length);
        b.quote=(b.quotes||['실습'])[qi];
        playerStunTimer=Math.max(playerStunTimer,b.stunDuration||60);
        addLog(`🌲 ${b.name}: ${b.quote}! 1초 정지!`,'log-eat');
      }
      // 스턴 없는 시간: 원격공격 or 실습클릭게임
      if(b.attackTimer>=(b.attackCooldown||200) && b.stunTimer>60){
        b.attackTimer=0;
        if(Math.random()<(b.critChance||0.3) && !critiqueActive){
          const relCourse=courseEntities.find(c=>c.visible&&c.hits<c.maxHits);
          startCritiqueGame(b, relCourse||null);
        } else {
          const ang=Math.atan2(player.y-b.y,player.x-b.x);
          bossProjectiles.push({x:b.x,y:b.y,
            vx:Math.cos(ang)*(b.projectileSpeed||2.6),
            vy:Math.sin(ang)*(b.projectileSpeed||2.6),
            color:b.color,r:6,alive:true,boss:b.name});
        }
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 장경호/오윤정: 쪽지시험/쪽글 클릭게임 ───────────────
    if(b.ability==='quiz_click'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.quakeActive=b.attackTimer%80<25;
      if(b.attackTimer>=(b.attackCooldown||480) && !critiqueActive){
        b.attackTimer=0; b.quoteTimer=0;
        const relCourse=courseEntities.find(c=>c.visible&&c.hits<c.maxHits);
        startCritiqueGame(b, relCourse||null);
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 정동준: 실습클릭 + 원격공격 + 조교소환(최대5명) ───────
    if(b.ability==='ta_spawn_critique'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.taTimer=(b.taTimer||0)+1;
      b.critTimer=(b.critTimer||0)+1;
      b.quakeActive=b.attackTimer%60<20;
      // 원격공격
      if(b.attackTimer>=(b.attackCooldown||200)){
        b.attackTimer=0;
        const ang=Math.atan2(player.y-b.y,player.x-b.x);
        bossProjectiles.push({x:b.x,y:b.y,
          vx:Math.cos(ang)*(b.projectileSpeed||2.8),
          vy:Math.sin(ang)*(b.projectileSpeed||2.8),
          color:b.color,r:6,alive:true,boss:b.name});
        b.quoteTimer=0;
      }
      // 조교 소환 (최대 5명)
      if(b.taTimer>=(b.taCooldown||480) && taAssistants.length<(b.maxTAs||5)){
        b.taTimer=0;
        taAssistants.push({
          x:b.x+(Math.random()-0.5)*80, y:b.y+(Math.random()-0.5)*80,
          vx:0, vy:0, size:14, color:'#fb923c', pts:5,
          speed:0.6, alive:true, wobble:0, changeTimer:60, isTA:true,
        });
        addLog(`🎓 정동준: 조교 소환! (${taAssistants.length}명)`,'log-eat');
      }
      // 실습 클릭게임
      if(b.critTimer>=(b.critCooldown||600) && !critiqueActive){
        b.critTimer=0;
        const relCourse=courseEntities.find(c=>c.visible&&c.hits<c.maxHits);
        startCritiqueGame(b, relCourse||null);
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

    // ── 박선미: 설계비평 클릭게임 + 도트뎀 ──────────────────
    if(b.ability==='critique_and_dot'){
      b.attackTimer=(b.attackTimer||0)+1;
      b.dotTimer=(b.dotTimer||0)+1;
      b.quakeActive=b.attackTimer%80<25;
      // 설계비평 클릭게임
      if(b.attackTimer>=(b.attackCooldown||600) && !critiqueActive){
        b.attackTimer=0; b.quoteTimer=0;
        const relCourse=courseEntities.find(c=>c.visible&&c.hits<c.maxHits);
        startCritiqueGame(b, relCourse||null);
      }
      // 도트뎀
      if(b.dotTimer>=(b.dotCooldown||480) && !bossDotActive){
        b.dotTimer=0;
        bossDotActive=true; bossDotTimer=b.dotDuration||120; bossDotDps=b.dotDps||4;
        addLog(`🎨 박선미: 도트뎀!`,'log-eat');
      }
      if(dist<b.size+player.size&&player.invincible===0) applyBossDamage('contact');
    }

  } // end for(const b of bosses)

  // Update stun timer
  if(playerStunTimer>0) playerStunTimer--;

  // Update slow timer
  if(playerSlowTimer>0){ playerSlowTimer--; playerSlowed=true; }

  // Update dot damage (매 60프레임=1초마다 데미지)
  if(bossDotActive && bossDotTimer>0){
    bossDotTimer--;
    if(bossDotTimer%60===0){
      if(player.rankIdx===0){
        player.stamina=Math.max(0,player.stamina-bossDotDps);
        if(player.stamina<=0){ gameOverFn('stamina'); }
      } else {
        player.points=Math.max(0,player.points-bossDotDps);
        if(player.points<=0){ gameOverFn('stamina'); }
      }
      player.invincible=Math.max(player.invincible,20);
      updateUI();
    }
    if(bossDotTimer<=0) bossDotActive=false;
  }

  // Update whiteout timer
  if(whiteoutTimer>0) whiteoutTimer--;

  // Update 임용 기출문제 beacons
  for(const beacon of bossBeacons){
    if(!beacon.alive) continue;
    beacon.attackTimer++;
    if(beacon.attackTimer>=(beacon.attackCooldown||120)){
      beacon.attackTimer=0;
      const ang=Math.atan2(player.y-beacon.y, player.x-beacon.x);
      bossProjectiles.push({
        x:beacon.x, y:beacon.y,
        vx:Math.cos(ang)*(beacon.projectileSpeed||2.2),
        vy:Math.sin(ang)*(beacon.projectileSpeed||2.2),
        color:'#fcd34d', r:5, alive:true, boss:'임용 기출문제', fromTurret:true,
      });
    }
  }

  // Update projectiles
  const newProjs = [];
  for(const p of bossProjectiles){
    if(!p.alive) continue;
    // 리딩 터렛 — 고정 위치에서 주기적으로 플레이어를 향해 발사
    if(p.isTurret){
      p.life--;
      if(p.life<=0){ p.alive=false; continue; }
      p.atkTimer=(p.atkTimer||0)+1;
      if(p.atkTimer>=(p.atkCooldown||120)){
        p.atkTimer=0;
        const ang=Math.atan2(player.y-p.y, player.x-p.x);
        newProjs.push({
          x:p.x, y:p.y,
          vx:Math.cos(ang)*(p.projSpeed||2.8),
          vy:Math.sin(ang)*(p.projSpeed||2.8),
          color:p.color, r:5, alive:true, boss:p.boss, fromTurret:true,
        });
      }
      continue;
    }
    p.x+=p.vx; p.y+=p.vy;
    if(p.x<0||p.x>W||p.y<0||p.y>H) { p.alive=false; continue; }
    const dx=player.x-p.x, dy=player.y-p.y;
    if(Math.sqrt(dx*dx+dy*dy)<player.size+p.r && player.invincible===0){
      p.alive=false;
      // 설치형 터렛 발사체는 1/4 데미지
      applyBossDamage(p.fromTurret ? 'turret' : 12);
    }
  }
  bossProjectiles.push(...newProjs);
  bossProjectiles=bossProjectiles.filter(p=>p.alive);
}
