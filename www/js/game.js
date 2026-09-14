// ===================== MOTORUL JOCULUI (Canvas) =====================
const Game = (function () {
  const VW = 360, VH = 640; // spațiu virtual de coordonate (circuitul)

  // Traseul circuitului (de la intrarea semnalului la Nucleul Bio-Electronic)
  // V5.2: harta activă — rendererul și gameplay-ul folosesc aceeași geometrie.
  let activeMapId = (typeof SAVE !== 'undefined' && SAVE && SAVE.selectedMap) || 'neuralCore';
  let ACTIVE_MAP = MAPS[activeMapId] || MAPS.neuralCore;
  let PATH = ACTIVE_MAP.path.map(p => ({...p}));
  let SLOT_POS = ACTIVE_MAP.slots.map(p => ({...p}));
  let CORE_POS = {...PATH[PATH.length - 1]};

  // precompute segment lengths + total length
  let segLens = [], totalLen = 0;
  function rebuildPathMetrics(){
    segLens=[]; totalLen=0;
    for(let i=0;i<PATH.length-1;i++){ const dx=PATH[i+1].x-PATH[i].x,dy=PATH[i+1].y-PATH[i].y,len=Math.hypot(dx,dy); segLens.push(len); totalLen+=len; }
    CORE_POS={...PATH[PATH.length-1]};
  }
  rebuildPathMetrics();
  function setMap(mapId){
    const m=MAPS[mapId]||MAPS.neuralCore; activeMapId=m.id; ACTIVE_MAP=m; PATH=m.path.map(p=>({...p})); SLOT_POS=m.slots.map(p=>({...p})); rebuildPathMetrics();
  }

  function posAtDistance(dist) {
    if (dist <= 0) return { x: PATH[0].x, y: PATH[0].y };
    let d = dist;
    for (let i = 0; i < segLens.length; i++) {
      if (d <= segLens[i]) {
        const t = segLens[i] === 0 ? 0 : d / segLens[i];
        const p0 = PATH[i], p1 = PATH[i + 1];
        return { x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t };
      }
      d -= segLens[i];
    }
    return { x: CORE_POS.x, y: CORE_POS.y };
  }

  // ===== canvas / scaling =====
  let canvas, ctx, scale = 1, offX = 0, offY = 0;
  // V5.1 VISUAL FORGE: păstrează rendererul existent și adaugă doar straturi noi.
  let visualQuality = 1, dprCap = 2;
  const visualCache = { stars: [], filaments: [] };
  for (let i=0;i<90;i++) visualCache.stars.push({x:Math.random()*VW,y:Math.random()*VH,r:.35+Math.random()*1.4,a:.08+Math.random()*.25,s:.15+Math.random()*.6});
  for (let i=0;i<14;i++) visualCache.filaments.push({x:Math.random()*VW,y:40+Math.random()*520,amp:5+Math.random()*14,len:35+Math.random()*75,phase:Math.random()*6.28});
  function resize() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (window.Memristor3D) window.Memristor3D.resize();
    scale = Math.min(rect.width / VW, rect.height / VH);
    offX = (rect.width - VW * scale) / 2;
    offY = (rect.height - VH * scale) / 2;
  }
  function w2s(x, y) { return { x: offX + x * scale, y: offY + y * scale }; }
  function s2w(x, y) { return { x: (x - offX) / scale, y: (y - offY) / scale }; }

  // ===== state per rulare (run) =====
  let R = null;
  function freshRun(save) {
    const lvl = id => shopLevel(id);
    const startEnergy = 100 + lvl('startEnergy') * SHOP_ITEMS.find(i => i.id === 'startEnergy').effectPerLevel;
    const coreMax = 100 + lvl('coreHp') * SHOP_ITEMS.find(i => i.id === 'coreHp').effectPerLevel;
    return {
      energy: startEnergy,
      coreHP: coreMax,
      coreMaxHP: coreMax,
      waveNumber: 1,
      mapId: activeMapId,
      mapName: ACTIVE_MAP.name,
      mode: 'campaign',
      daily: null,
      narrativeStage: 1,
      waveInProgress: false,
      spawnGroups: [],
      enemies: [],
      projectiles: [], enemyProjectiles: [],
      particles: [], anomalies: [], shockwaves: [], beams: [], visualTime: 0, cameraShake: 0,
      nodes: [], // {slot, typeId, level, cooldown}
      selected: null,
      speedMult: 1,
      paused: false,
      running: true,
      victoryShown: false,
      endlessMode: false,
      killsThisRun: 0,
      bossKillsThisRun: 0,
      nodeTypeCountsThisRun: {},
      maxEmpInRun: 0,
      maxEnergyInRun: startEnergy,
      perfectWaveAchieved: false,
      maxEndlessWave: 0,
      allNodeTypesUsed: false,
      coreHPAtWaveStart: coreMax,
      runCrystalsEarned: 0,
      nextEnemyId: 1, qualityLevel: 'auto', laserBuilt: 0, repairPulse: 0, bossTacticHits: {}, bossPhase: 0, bossExposeTimer: 0, bossCycleTimer: 11, bossSummonTimer: 7,
      finalized: false, __v10MetaApplied:false, __v10Kills:0, __v10Wave:1, overdrive: 0, overdriveActive: 0, metaDamageMult:1, metaYieldMult:1, metaXPMult:1, metaBossReward:1, metaCritBonus:0, metaNodeCostMult:1, metaSlowMult:1, metaRepairMult:1, metaWaveRewardMult:1, metaEliteRewardMult:1, metaOverdriveDuration:8, combo: 0, comboTimer: 0, battleDirector: {pressure:0, adaptation:null, lastWave:null}, fusionCount:0, qualityProfile:null
    };
  }

  function slotOccupant(slotIdx) {
    return R.nodes.find(n => n.slot === slotIdx);
  }

  function fusionRecipe(a, b) {
    const pair = [a.typeId, b.typeId].sort().join('+');
    const recipes = {
      'laser+slow': 'superconductive',
      'drone+emp': 'swarmSentinel',
      'laser+virus': 'photonicAntibody',
      'chrono+slow': 'temporalSingularity'
    };
    return recipes[pair] || null;
  }
  function nearbyFusionPartner(node) {
    const a = SLOT_POS[node.slot];
    return R.nodes.find(n => n !== node && Math.hypot(SLOT_POS[n.slot].x-a.x, SLOT_POS[n.slot].y-a.y) <= 145 && fusionRecipe(node,n));
  }
  function tryFuseNode(node) {
    const partner = nearbyFusionPartner(node);
    if (!partner) return false;
    const result = fusionRecipe(node, partner);
    const newLevel = Math.min(5, Math.max(node.level, partner.level));
    node.typeId = result; node.level = newLevel; node.cooldown = 0; node.fused = true;
    R.nodes = R.nodes.filter(n => n !== partner);
    R.fusionCount = (R.fusionCount || 0) + 1;
    R.overdrive = Math.min(100, R.overdrive + 20);
    const p=SLOT_POS[node.slot]; spawnParticles(p.x,p.y,NODE_TYPES[result].color,34,95);
    R.shockwaves.push({x:p.x,y:p.y,r:6,max:90,life:.9,color:NODE_TYPES[result].color}); R.cameraShake=Math.max(R.cameraShake,.28);
    Main.showWaveToast('⚛️ ' + ui('fusionSuccess') + ': ' + NODE_TYPES[result].name);
    AudioSys.upgrade(); return true;
  }
  function analyzeLoadout() {
    const counts={}; R.nodes.forEach(n=>counts[n.typeId]=(counts[n.typeId]||0)+1);
    const electric=(counts.laser||0)+(counts.emp||0)+(counts.superconductive||0);
    const cryo=(counts.slow||0)+(counts.chrono||0)+(counts.temporalSingularity||0);
    const aoe=(counts.emp||0)+(counts.mine||0)+(counts.photonicAntibody||0);
    if (electric>=3) return {id:'insulation', name:ui('adaptationInsulation'), armor:0.12};
    if (cryo>=3) return {id:'thermal', name:ui('adaptationThermal'), speed:0.12};
    if (aoe>=3) return {id:'dispersion', name:ui('adaptationDispersion'), split:0.15};
    return {id:'balanced', name:ui('adaptationBalanced'), hp:0.08};
  }

  function buffMultiplierFor(slotIdx) {
    let mult = 1;
    const myPos = SLOT_POS[slotIdx];
    R.nodes.forEach(n => {
      if (n.typeId !== 'amp') return;
      const ampPos = SLOT_POS[n.slot];
      const def = NODE_TYPES.amp;
      const rangeLvl = def.range * (1 + (n.level - 1) * 0.18);
      const dist = Math.hypot(ampPos.x - myPos.x, ampPos.y - myPos.y);
      if (dist <= rangeLvl && n.slot !== slotIdx) mult += def.buff;
    });
    return mult;
  }

  function globalDamageMult() {
    const lvl = shopLevel('globalDamage');
    return (1 + lvl * SHOP_ITEMS.find(i => i.id === 'globalDamage').effectPerLevel) * (R?.metaDamageMult || 1);
  }
  function critChance() {
    const lvl = shopLevel('critChance');
    return Math.min(0.75, lvl * SHOP_ITEMS.find(i => i.id === 'critChance').effectPerLevel + (R?.metaCritBonus || 0));
  }
  function nodeCostMult() {
    const lvl = shopLevel('nodeDiscount');
    return Math.max(0.45, (1 - lvl * SHOP_ITEMS.find(i => i.id === 'nodeDiscount').effectPerLevel) * (R?.metaNodeCostMult || 1));
  }

  function nodeCost(typeId, level) {
    const base = NODE_TYPES[typeId].cost;
    const growth = Math.pow(1.75, level - 1);
    return Math.round(base * growth * nodeCostMult());
  }
  function nodeSellValue(node) {
    let spent = 0;
    for (let l = 1; l <= node.level; l++) spent += nodeCost(node.typeId, l);
    return Math.round(spent * 0.6);
  }

  // ===== construcție / vânzare noduri =====
  function tryBuildNode(slotIdx, typeId) {
    if (slotOccupant(slotIdx)) return false;
    const cost = nodeCost(typeId, 1);
    if (R.energy < cost) { AudioSys.error(); return false; }
    R.energy -= cost;
    R.nodes.push({ slot: slotIdx, typeId, level: 1, cooldown: 0 });
    if (typeId === 'laser') R.laserBuilt = (R.laserBuilt || 0) + 1;
    R.nodeTypeCountsThisRun[typeId] = (R.nodeTypeCountsThisRun[typeId] || 0) + 1;
    if (typeId === 'emp') R.maxEmpInRun = Math.max(R.maxEmpInRun, R.nodeTypeCountsThisRun.emp || 0);
    if (NODE_ORDER.every(t => (R.nodeTypeCountsThisRun[t] || 0) > 0)) R.allNodeTypesUsed = true;
    AudioSys.place();
    Main.onNodeBuilt();
    return true;
  }
  function tryUpgradeNode(node) {
    if (node.level >= 5) return false;
    const cost = nodeCost(node.typeId, node.level + 1);
    if (R.energy < cost) { AudioSys.error(); return false; }
    R.energy -= cost;
    node.level++;
    AudioSys.upgrade();
    return true;
  }
  function sellNode(node) {
    R.energy += nodeSellValue(node);
    R.nodes = R.nodes.filter(n => n !== node);
    AudioSys.buttonClick();
  }

  // ===== waves =====
  function startWave() {
    if (R.waveInProgress) return;
    const daily = R.daily;
    const wave = generateWave(R.waveNumber);
    if (daily && daily.mutationData) {
      const md = daily.mutationData;
      if (md.swarmMult) wave.groups.forEach(g => { if (g.type === 'swarm') g.count = Math.max(1, Math.round(g.count * md.swarmMult)); });
      if (md.rangedEarly && R.waveNumber >= 3 && R.waveNumber % 5 !== 0) wave.groups.push({type:'artillery', count:1 + Math.floor(R.waveNumber/6), hpMult:1 + (R.waveNumber-1)*.08, interval:1.0});
      if (md.rewardMult) wave.crystalBonus = Math.round(wave.crystalBonus * md.rewardMult);
    }
    const adaptation = analyzeLoadout();
    R.battleDirector.adaptation = adaptation; R.battleDirector.lastWave = R.waveNumber;
    R.spawnGroups = wave.groups.map(g => ({ ...g, remaining: g.count, timer: 0 }));
    R.waveInProgress = true;
    R.coreHPAtWaveStart = R.coreHP;
    R.currentWaveMeta = wave;
    if (R.waveNumber >= 6 && adaptation.id !== 'balanced') Main.showWaveToast('🧠 ' + ui('director') + ': ' + adaptation.name);
    AudioSys.waveStart();
    if (Main.showNarrativeBeat) Main.showNarrativeBeat(R.waveNumber, R.mapId);
    if (navigator.vibrate && SAVE.settings.vibrate) navigator.vibrate(40);
  }

  function spawnEnemy(typeId, hpMult) {
    const def = ENEMY_TYPES[typeId];
    const dailySpeed = (R.daily && R.daily.mutationData && R.daily.mutationData.speed) || 1;
    const shootRateMult = (R.daily && R.daily.mutationData && R.daily.mutationData.shootRateMult) || 1;
    R.enemies.push({
      id: R.nextEnemyId++, typeId,
      hp: Math.round(def.hp * hpMult), maxHp: Math.round(def.hp * hpMult),
      distance: 0, speedBase: def.speed, dailySpeed, dailyShootRateMult: shootRateMult, slowTimer: 0, slowFactor: 1,
      phaseTimer: def.phase ? 1.5 : 0, phased: false, healTimer: 0, dotTimer: 0, infectedTimer: 0, adaptiveArmor: 0, shootTimer: def.shooter ? (0.8 + Math.random()*def.shootRate*shootRateMult) : 9999,
      bossTacticHits: {}, bossExposeTimer: 0, bossCycleTimer: def.finalBoss ? 11 : 9999, bossSummonTimer: def.finalBoss ? 7 : 9999,
      genome: (R && R.battleDirector && R.waveNumber >= 6) ? { ...R.battleDirector.adaptation } : null
    });
  }

  function waveClearCheck() {
    if (!R.waveInProgress) return;
    const groupsDone = R.spawnGroups.every(g => g.remaining <= 0);
    if (groupsDone && R.enemies.length === 0) {
      completeWave();
    }
  }

  function completeWave() {
    R.waveInProgress = false;
    const meta = R.currentWaveMeta;
    const crystalGainLvl = shopLevel('crystalGain');
    const crystalMult = 1 + crystalGainLvl * SHOP_ITEMS.find(i => i.id === 'crystalGain').effectPerLevel;
    const crystalsWon = Math.round(meta.crystalBonus * crystalMult * (R.metaYieldMult || 1) * (R.metaWaveRewardMult || 1));
    R.energy += meta.energyBonus;
    R.maxEnergyInRun = Math.max(R.maxEnergyInRun, R.energy);
    SAVE.crystals += crystalsWon;
    R.runCrystalsEarned += crystalsWon;
    if (R.coreHP === R.coreHPAtWaveStart) { R.perfectWaveAchieved = true; if(R.daily && R.daily.mutationData && R.daily.mutationData.perfectBonus){ R.energy += R.daily.mutationData.perfectBonus; } }

    Main.showWaveToast(`${ui('waveCompleted')} ${R.waveNumber} +${meta.energyBonus}⚡ +${crystalsWon}💠`);
    if (R.mode === 'daily' && R.daily) {
      const key = R.daily.key;
      const score = Math.max(0, Math.round(R.waveNumber * 1000 + R.killsThisRun * 12 + R.coreHP * 6));
      SAVE.dailyBest[key] = Math.max(SAVE.dailyBest[key] || 0, score);
    }
    if (R.waveNumber > SAVE.bestWave && R.mode !== 'daily') { SAVE.bestWave = R.waveNumber; }
    persistSave();
    Main.checkAchievements();

    const hitVictoryThreshold = R.mode === 'daily'
      ? R.waveNumber >= R.daily.target && !R.victoryShown
      : R.waveNumber >= MAX_DESIGNED_WAVE && !R.victoryShown;
    if (R.endlessMode) R.maxEndlessWave = Math.max(R.maxEndlessWave || 0, R.waveNumber - FINAL_BOSS_WAVE);
    R.waveNumber++;
    Main.refreshHud();
    Main.autoSaveRun();

    if (hitVictoryThreshold) {
      R.victoryShown = true;
      if (R.mode !== 'daily' && R.waveNumber - 1 === FINAL_BOSS_WAVE) Main.showWaveToast('☠ ' + ui('omegaDefeated'));
      if (R.mode === 'daily' && R.daily && !SAVE.dailyClaimed[R.daily.key]) {
        SAVE.dailyClaimed[R.daily.key] = true;
        SAVE.crystals += R.daily.reward;
        R.runCrystalsEarned += R.daily.reward;
        Main.showWaveToast(`☀️ ${ui('dailyCompleted')} +${R.daily.reward}💠`);
      }
      R.running = false;
      persistSave();
      Main.showVictory();
    }
  }

  // ===== update loop — mobile performance profile =====
  // The original V6 renderer was running a full Canvas pass on every display
  // refresh (often 60/90/120 Hz). On phones this needlessly increases CPU/GPU
  // load and heat. We intentionally cap the game simulation/render path to
  // ~30 FPS; the simulation remains time based, so gameplay speed is preserved.
  const TARGET_FRAME_MS = 1000 / 30;
  let lastT = 0, rafId = null, lastFrameT = 0;
  function tick(t) {
    rafId = requestAnimationFrame(tick);
    if (!lastT) { lastT = t; lastFrameT = t; return; }
    if ((t - lastFrameT) < TARGET_FRAME_MS) return;
    let dt = (t - lastT) / 1000;
    lastT = t;
    lastFrameT = t;
    if (dt > 0.12) dt = 0.12;
    if (R.running && !R.paused) update(dt * R.speedMult);
    render();
  }

  function update(dt) {
    R.visualTime += dt;
    R.cameraShake = Math.max(0, (R.cameraShake || 0) - dt * 2.8);
    // spawn
    if (R.waveInProgress) {
      R.spawnGroups.forEach(g => {
        if (g.remaining <= 0) return;
        g.timer -= dt;
        if (g.timer <= 0) {
          spawnEnemy(g.type, g.hpMult);
          g.remaining--;
          g.timer = g.interval;
        }
      });
    }

    // protocol timers
    if (R.overdriveActive > 0) R.overdriveActive -= dt;
    if (R.comboTimer > 0) R.comboTimer -= dt; else R.combo = 0;

    // OMEGA boss: rotating exposure windows + adaptive resistance + reinforcements.
    if (R.enemies.some(e => e.typeId === 'finalBoss')) {
      const omega = R.enemies.find(e => e.typeId === 'finalBoss');
      if (omega) {
        omega.bossExposeTimer = Math.max(0, (omega.bossExposeTimer || 0) - dt);
        omega.bossCycleTimer = (omega.bossCycleTimer || 11) - dt;
        if(omega.bossCycleTimer<=0){ omega.bossExposeTimer=3.2; omega.bossCycleTimer=11; Main.showWaveToast('⚡ ' + ui('omegaExposed')); }
        omega.bossSummonTimer = (omega.bossSummonTimer || 7) - dt;
        const ratio = omega.hp / omega.maxHp;
        omega.bossPhase = Math.min(5, Math.floor((1-ratio) * 5));
        if (omega.bossSummonTimer <= 0) {
          const adds = omega.bossPhase >= 3 ? ['artillery','adaptive','leech'] : ['adaptive','phase'];
          adds.forEach((typeId,idx)=>spawnEnemy(typeId, 2.2 + omega.bossPhase*.45));
          omega.bossSummonTimer = Math.max(4.5, 8.5 - omega.bossPhase*.7);
          spawnParticles(CORE_POS.x, CORE_POS.y, '#ff1744', 14, 70);
        }
      }
    }

    // enemies move
    for (let i = R.enemies.length - 1; i >= 0; i--) {
      const e = R.enemies[i];
      const def = ENEMY_TYPES[e.typeId];
      if (e.infectedTimer > 0) { e.infectedTimer -= dt; e.dotTimer -= dt; if (e.dotTimer <= 0) { applyDamage(e, 6 + R.waveNumber * 0.35); e.dotTimer = 0.5; } }
      if (def.adaptive) e.adaptiveArmor = Math.min(0.42, (e.adaptiveArmor || 0) + dt * 0.018);
      if (R.anomalies) R.anomalies.forEach(a => { const ep=posAtDistance(e.distance); if (Math.hypot(ep.x-a.x, ep.y-a.y) < a.radius) { e.slowFactor=Math.min(e.slowFactor,0.62); e.slowTimer=Math.max(e.slowTimer,0.25); } });
      if (def.leech && Math.abs(totalLen - e.distance) < 220) R.coreHP = Math.max(1, R.coreHP - dt * 1.2);
      if (def.phase) {
        e.phaseTimer -= dt;
        if (e.phaseTimer <= 0) { e.phased = !e.phased; e.phaseTimer = e.phased ? 1 : 1.5; }
      }
      if (e.slowTimer > 0) { e.slowTimer -= dt; if (e.slowTimer <= 0) e.slowFactor = 1; }
      // Unele amenințări sunt atacatori la distanță; nu toate trag.
      if(def.shooter && !e.phased){
        e.shootTimer -= dt;
        const ep=posAtDistance(e.distance);
        if(e.shootTimer<=0 && e.distance < totalLen-45){
          const dCore=Math.hypot(CORE_POS.x-ep.x,CORE_POS.y-ep.y);
          if(dCore <= (def.shootRange||160)) {
            R.enemyProjectiles.push({x:ep.x,y:ep.y,target:'core',speed:155+(def.boss?35:0),damage:def.shotDamage||8,color:def.color,life:4.5});
            spawnParticles(ep.x,ep.y,def.color,5,20);
          }
          e.shootTimer=(def.shootRate||2.5)*(e.dailyShootRateMult||1);
        }
      }
      const genomeSpeed = e.genome && e.genome.speed ? (1 + e.genome.speed) : 1;
      e.distance += def.speed * (e.dailySpeed||1) * e.slowFactor * genomeSpeed * dt;
      if (e.distance >= totalLen) {
        const shieldReduction = Math.min(0.72, R.nodes.filter(n => n.typeId === 'shield').reduce((a,n) => a + NODE_TYPES.shield.shield * (1 + (n.level - 1) * 0.15), 0));
        R.coreHP -= Math.max(1, Math.round(def.damage * (1 - shieldReduction)));
        AudioSys.coreHit();
        if (navigator.vibrate && SAVE.settings.vibrate) navigator.vibrate([0, 60, 30, 60]);
        spawnParticles(CORE_POS.x, CORE_POS.y, '#ef4444', 10);
        R.enemies.splice(i, 1);
        if (R.coreHP <= 0) { R.coreHP = 0; endRun('gameover'); return; }
      }
    }

    // biologic support enemies regenerate nearby threats
    R.enemies.forEach(e => {
      const def = ENEMY_TYPES[e.typeId];
      if (def.healer) { e.healTimer -= dt; if (e.healTimer <= 0) {
        R.enemies.forEach(o => { if (o !== e && Math.abs(o.distance - e.distance) < 95) o.hp = Math.min(o.maxHp, o.hp + 4); });
        e.healTimer = 1.2;
      }}
    });

    // node firing
    const buffCache = R.nodes.map((n, idx) => buffMultiplierFor(n.slot));
    R.nodes.forEach((n, idx) => {
      const def = NODE_TYPES[n.typeId];
      if (def.id === 'amp' || def.id === 'shield') return;
      if (def.id === 'repair') {
        n.cooldown -= dt;
        if (n.cooldown <= 0 && R.coreHP < R.coreMaxHP) { R.coreHP = Math.min(R.coreMaxHP, R.coreHP + def.heal * (1 + (n.level - 1) * 0.35) * (R.metaRepairMult || 1)); n.cooldown = def.rate; spawnParticles(CORE_POS.x, CORE_POS.y, def.color, 8); }
        return;
      }
      n.cooldown -= dt;
      if (n.cooldown > 0) return;
      const rangeLvl = def.range * (1 + (n.level - 1) * 0.12);
      const pos = SLOT_POS[n.slot];
      // țintă = inamicul cel mai aproape de nucleu, aflat în rază
      let best = null, bestDist = -1;
      R.enemies.forEach(e => {
        const epos = posAtDistance(e.distance);
        const d = Math.hypot(epos.x - pos.x, epos.y - pos.y);
        if (d <= rangeLvl && e.distance > bestDist) { best = e; bestDist = e.distance; }
      });
      if (!best) return;
      n.cooldown = def.rate;
      const dmgMult = buffCache[idx] * globalDamageMult() * (R.overdriveActive > 0 ? 1.45 : 1);
      if (def.mine && R.enemies.filter(e => { const ep=posAtDistance(e.distance); return Math.hypot(ep.x-pos.x, ep.y-pos.y) <= def.range; }).length < 2) return;
      if (def.splash > 0) {
        // câmp EM: lovește toți din rază instant
        AudioSys.emp();
        R.enemies.forEach(e => {
          const epos = posAtDistance(e.distance);
          const d = Math.hypot(epos.x - pos.x, epos.y - pos.y);
          if (d <= def.splash) applyDamage(e, def.damage * (1 + (n.level - 1) * 0.3) * dmgMult, 0, def.id);
        });
        spawnParticles(pos.x, pos.y, def.color, 18, def.splash); R.shockwaves.push({x:pos.x,y:pos.y,r:4,max:def.splash,life:.55,color:def.color}); R.cameraShake=Math.max(R.cameraShake,.16);
      } else {
        const dmg = def.damage * (1 + (n.level - 1) * 0.3) * dmgMult;
        R.projectiles.push({
          x: pos.x, y: pos.y, target: best, speed: def.projectileSpeed,
          damage: dmg, color: def.color, sourceType: def.id, slow: def.slow, chain: def.chain || 0, infect: !!def.infect, temporal: !!def.temporal
        });
        AudioSys.shoot();
      }
    });

    // projectiles
    for (let i = R.projectiles.length - 1; i >= 0; i--) {
      const p = R.projectiles[i];
      if (!R.enemies.includes(p.target)) { R.projectiles.splice(i, 1); continue; }
      const epos = posAtDistance(p.target.distance);
      const dx = epos.x - p.x, dy = epos.y - p.y;
      const dist = Math.hypot(dx, dy);
      const step = p.speed * dt;
      if (dist <= step) {
        applyDamage(p.target, p.damage, p.slow, p.sourceType || 'unknown'); if (p.temporal) { const rr = (p.target && NODE_TYPES[p.target.typeId]) ? 42 : 42; R.anomalies.push({x:epos.x,y:epos.y,radius: (p.damage>20?58:42),life:(p.damage>20?3.8:2.6)}); } if (p.infect && R.enemies.includes(p.target)) { p.target.infectedTimer = Math.max(p.target.infectedTimer, 4.5); p.target.dotTimer = 0.3; }
        if (p.chain > 0) chainDamage(p.target, p.damage * 0.7, p.chain, p.color);
        spawnParticles(epos.x, epos.y, p.color, 10); R.shockwaves.push({x:epos.x,y:epos.y,r:3,max:32,life:.32,color:p.color}); R.cameraShake=Math.max(R.cameraShake,.06); if (p.chain>0) R.beams.push({x1:p.x,y1:p.y,x2:epos.x,y2:epos.y,life:.12,color:p.color});
        R.projectiles.splice(i, 1);
      } else {
        p.x += (dx / dist) * step;
        p.y += (dy / dist) * step;
      }
    }

    // enemy projectiles — focuri rare, lizibile, care lovesc Nucleul.
    for(let i=R.enemyProjectiles.length-1;i>=0;i--){
      const p=R.enemyProjectiles[i]; const dx=CORE_POS.x-p.x,dy=CORE_POS.y-p.y,dist=Math.hypot(dx,dy);
      if(dist<=p.speed*dt){
        R.coreHP=Math.max(0,R.coreHP-p.damage); R.shockwaves.push({x:CORE_POS.x,y:CORE_POS.y,r:4,max:38,life:.35,color:p.color}); spawnParticles(CORE_POS.x,CORE_POS.y,p.color,9,35); R.cameraShake=Math.max(R.cameraShake,.1); R.enemyProjectiles.splice(i,1);
        if(R.coreHP<=0){ R.coreHP=0; endRun('gameover'); return; }
      } else { p.x+=(dx/dist)*p.speed*dt; p.y+=(dy/dist)*p.speed*dt; p.life-=dt; if(p.life<=0)R.enemyProjectiles.splice(i,1); }
    }

    // shockwaves / visual effects
    for (let i=R.shockwaves.length-1;i>=0;i--){ const q=R.shockwaves[i]; q.life-=dt; q.r += (q.max-q.r)*Math.min(1,dt*10); if(q.life<=0)R.shockwaves.splice(i,1); }
    for (let i=R.beams.length-1;i>=0;i--){ R.beams[i].life-=dt; if(R.beams[i].life<=0)R.beams.splice(i,1); }

    // temporal anomalies
    for (let i=R.anomalies.length-1;i>=0;i--) { R.anomalies[i].life-=dt; if (R.anomalies[i].life<=0) R.anomalies.splice(i,1); }

    // particles
    for (let i = R.particles.length - 1; i >= 0; i--) {
      const pt = R.particles[i];
      pt.life -= dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.vx *= 0.92; pt.vy *= 0.92;
      if (pt.life <= 0) R.particles.splice(i, 1);
    }

    waveClearCheck();
    Main.refreshHud();
  }

  function applyDamage(e, dmg, slow, sourceType) {
    const def = ENEMY_TYPES[e.typeId];
    let d = dmg;
    if (def.armor) d *= (1 - def.armor);
    if (e.genome && e.genome.armor) d *= (1 - e.genome.armor);
    if (e.adaptiveArmor) d *= (1 - e.adaptiveArmor);
    if (e.phased) d *= 0.3;
    if (def.finalBoss) {
      const type = sourceType || 'unknown';
      e.bossTacticHits = e.bossTacticHits || {};
      e.bossTacticHits[type] = (e.bossTacticHits[type] || 0) + 1;
      // Repeating one weapon becomes progressively inefficient: the player must rotate node families.
      const repetition = Math.min(0.72, Math.max(0, e.bossTacticHits[type] - 8) * 0.025);
      d *= (1 - repetition);
      // Omega alternates protected/exposed states. Every 11s there is a 3.2s vulnerability window.
      if ((e.bossExposeTimer || 0) <= 0) {
        d *= 0.26;
      }
      if ((e.bossExposeTimer || 0) > 0) spawnParticles(CORE_POS.x, CORE_POS.y, '#7dd3fc', 1, 18);
      if (e.hp / e.maxHp < 0.8 && !e._warnedTactic) { e._warnedTactic=true; Main.showWaveToast('☠ ' + ui('omegaTactic')); }
    }
    if (Math.random() < critChance()) d *= 2;
    e.hp -= d;
    AudioSys.hit();
    if (slow) { const effectiveSlow=Math.min(0.92, slow*(R.metaSlowMult||1)); e.slowFactor = 1 - effectiveSlow; e.slowTimer = 2; }
    if (e.hp <= 0) killEnemy(e);
  }

  function chainDamage(origin, damage, jumps, color) {
    let from = origin;
    for (let j = 0; j < jumps; j++) {
      const fp = posAtDistance(from.distance);
      let next = null, best = Infinity;
      R.enemies.forEach(e => { if (e === from) return; const ep = posAtDistance(e.distance); const d = Math.hypot(ep.x-fp.x, ep.y-fp.y); if (d < 75 && d < best) { best=d; next=e; } });
      if (!next) break;
      const np = posAtDistance(next.distance); spawnParticles(np.x,np.y,color,5); applyDamage(next, damage, 0); from=next; damage*=0.72;
    }
  }

  function killEnemy(e) {
    const def = ENEMY_TYPES[e.typeId];
    const idx = R.enemies.indexOf(e);
    if (idx === -1) return;
    R.enemies.splice(idx, 1);
    if (def.split) { for (let k=0;k<2;k++) { const child = { ...ENEMY_TYPES.swarm }; R.enemies.push({ id:R.nextEnemyId++, typeId:'swarm', hp:Math.round(child.hp*0.8), maxHp:Math.round(child.hp*0.8), distance:Math.max(0,e.distance-k*8), speedBase:child.speed, slowTimer:0, slowFactor:1, phaseTimer:0, phased:false, healTimer:0 }); } }
    const epos = posAtDistance(e.distance);
    spawnParticles(epos.x, epos.y, def.color, def.boss ? 30 : 16, def.boss ? 100 : 42); R.shockwaves.push({x:epos.x,y:epos.y,r:4,max:def.boss?90:30,life:def.boss?.8:.38,color:def.color}); R.cameraShake=Math.max(R.cameraShake,def.boss?.45:.12);
    const rewardMult = def.boss ? (R.metaBossReward || 1) : (def.v10Elite ? (R.metaEliteRewardMult || 1) : 1);
    const dailyKillEnergy = (R.daily && R.daily.mutationData && R.daily.mutationData.killEnergy) ? 1.18 : 1;
    R.energy += def.reward * rewardMult * dailyKillEnergy;
    R.maxEnergyInRun = Math.max(R.maxEnergyInRun, R.energy);
    R.killsThisRun++;
    R.combo++; R.comboTimer = 2.2; R.overdrive = Math.min(100, R.overdrive + (def.boss ? 30 : 7));
    SAVE.totalKills++;
    if (def.boss) { R.bossKillsThisRun++; SAVE.totalBossKills++; }
    AudioSys.kill();
    Main.checkAchievements();
  }

  function spawnParticles(x, y, color, n, radius) {
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = radius ? radius * 0.4 : 60 + Math.random() * 60;
      R.particles.push({
        x, y, vx: Math.cos(ang) * speed * 0.6, vy: Math.sin(ang) * speed * 0.6,
        life: 0.4 + Math.random() * 0.3, color, r: 2 + Math.random() * 2
      });
    }
  }

  function activateOverdrive() {
    if (!R || R.overdrive < 100 || R.overdriveActive > 0) return false;
    R.overdrive = 0; R.overdriveActive = R.metaOverdriveDuration || 8; SAVE.totalOverdrives = (SAVE.totalOverdrives || 0) + 1;
    R.enemies.forEach(e => { e.slowFactor = Math.min(e.slowFactor, 0.55); e.slowTimer = Math.max(e.slowTimer, 3); });
    spawnParticles(CORE_POS.x, CORE_POS.y, '#fbbf24', 36, 130); R.shockwaves.push({x:CORE_POS.x,y:CORE_POS.y,r:8,max:150,life:1.2,color:'#fbbf24'}); R.cameraShake=.35;
    Main.showWaveToast('🔥 ' + ui('overdriveActive'));
    persistSave(); Main.checkAchievements(); return true;
  }

  function endRun(reason) {
    if (R.finalized) return;
    R.finalized = true;
    R.running = false;
    if (reason === 'gameover') {
      SAVE.hasSavedRun = false;
      SAVE.savedRun = null;
      SAVE.totalRuns++;
      AudioSys.gameOver();
    }
    persistSave();
    Main.checkAchievements();
    Main.onRunEnded(reason);
  }

  // ===== VISUAL REBIRTH RENDERER =====
  function render() {
    if (!ctx || !R) return;
    const rect = canvas.getBoundingClientRect();
    const eco = document.documentElement.dataset.memristorPerf === 'eco';
    ctx.clearRect(0,0,rect.width,rect.height);
    const shake=(R.cameraShake||0)*10*scale;
    ctx.save();
    if(shake){ ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake); }
    drawBioBackground(rect);
    // Expensive atmospheric layers are optional on thermally constrained phones.
    if (!eco) {
      drawLivingAtmosphere(rect);
      drawOrganicGrid(rect);
      drawNeuralPulseField();
    }
    drawPathReborn();
    if (!eco) drawAmbientCells();
    drawSlotsReborn();
    drawSelectionReticle();
    drawAnomalies();
    drawShockwaves();
    R.projectiles.forEach(drawProjectileReborn);
    (R.enemyProjectiles||[]).forEach(drawEnemyProjectile);
    R.beams.forEach(drawBeam);
    R.enemies.forEach(e => { if (e.typeId === 'crimsonSentinel' && window.Memristor3D && window.Memristor3D.enemyModelReady) return; drawEnemyReborn(e); });
    drawParticlesReborn(eco ? 70 : 140);
    drawCoreReborn();
    if (!eco) drawVignette(rect);
    ctx.restore();
    if (window.Memristor3D) window.Memristor3D.render();
  }

  function drawLivingAtmosphere(rect){
    const t=R.visualTime||0;
    ctx.save();
    // Deep-space cellular parallax: subtle, cheap, but gives depth behind the existing renderer.
    for(const st of visualCache.stars){
      const x=offX+((st.x+t*st.s*2)%VW)*scale;
      const y=offY+((st.y+Math.sin(t*.25+st.x)*1.5)%VH)*scale;
      ctx.globalAlpha=st.a*(.65+.35*Math.sin(t*1.7+st.x));
      ctx.fillStyle='#b7fff4'; ctx.beginPath(); ctx.arc(x,y,st.r*scale,0,Math.PI*2); ctx.fill();
    }
    // Organic membranes / capillaries
    ctx.globalAlpha=.16; ctx.lineWidth=1.2*scale;
    for(const f of visualCache.filaments){
      ctx.strokeStyle=f.phase%2<1?'#00d4aa':'#7dd3fc'; ctx.beginPath();
      for(let k=0;k<=8;k++){
        const u=k/8, x=offX+(f.x+u*f.len)*scale;
        const y=offY+(f.y+Math.sin(u*5+f.phase+t*.45)*f.amp)*scale;
        if(!k)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      } ctx.stroke();
    }
    ctx.restore();
  }

  function drawNeuralPulseField(){
    const t=R.visualTime||0;
    ctx.save();
    const pts=[{x:62,y:96},{x:278,y:126},{x:72,y:330},{x:282,y:410},{x:48,y:510},{x:310,y:540}];
    for(let i=0;i<pts.length;i++){
      const p=pts[i], q=w2s(p.x,p.y), rr=(18+8*Math.sin(t*1.4+i))*scale;
      const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,rr*3.2);
      g.addColorStop(0,'rgba(103,232,249,.10)');g.addColorStop(1,'rgba(103,232,249,0)');
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,rr*3.2,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  function drawSelectionReticle(){
    if(!R.selected) return;
    const def=NODE_TYPES[R.selected], t=R.visualTime||0;
    ctx.save(); ctx.globalAlpha=.42+.18*Math.sin(t*5);
    SLOT_POS.forEach((sp,i)=>{if(slotOccupant(i))return;const q=w2s(sp.x,sp.y);ctx.strokeStyle=def.color;ctx.shadowColor=def.color;ctx.shadowBlur=8*scale;ctx.lineWidth=1*scale;ctx.beginPath();ctx.arc(q.x,q.y,(20+Math.sin(t*3+i)*1.5)*scale,0,Math.PI*2);ctx.stroke();});
    ctx.restore();
  }

  function drawBioBackground(rect){
    const g=ctx.createLinearGradient(0,0,0,rect.height); g.addColorStop(0,'#030814'); g.addColorStop(.52,'#06121a'); g.addColorStop(1,'#020611'); ctx.fillStyle=g; ctx.fillRect(0,0,rect.width,rect.height);
    const t=R.visualTime||0;
    for(let i=0;i<6;i++){ const x=rect.width*(.1+i*.17)+Math.sin(t*.17+i)*35; const y=rect.height*(.15+((i*13)%70)/100)+Math.cos(t*.23+i)*45; const rad=90+25*Math.sin(t*.2+i); const rg=ctx.createRadialGradient(x,y,0,x,y,rad); rg.addColorStop(0,'rgba(0,212,170,.055)'); rg.addColorStop(1,'rgba(0,212,170,0)'); ctx.fillStyle=rg; ctx.beginPath(); ctx.arc(x,y,rad,0,Math.PI*2); ctx.fill(); }
  }

  function drawOrganicGrid(rect){
    ctx.save(); ctx.lineWidth=1; ctx.strokeStyle='rgba(39,211,188,.065)'; const gap=31*scale;
    for(let x=(offX%gap);x<rect.width;x+=gap){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,rect.height);ctx.stroke();}
    for(let y=(offY%gap);y<rect.height;y+=gap){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(rect.width,y);ctx.stroke();}
    ctx.restore();
  }

  function tracePath(){ ctx.beginPath(); PATH.forEach((p,i)=>{const q=w2s(p.x,p.y); if(!i)ctx.moveTo(q.x,q.y); else ctx.lineTo(q.x,q.y);}); }
  function drawPathReborn(){
    const t=R.visualTime||0; ctx.save(); ctx.lineCap='round';ctx.lineJoin='round';
    ctx.shadowColor='#00d4aa';ctx.shadowBlur=20*scale;ctx.strokeStyle='rgba(0,212,170,.12)';ctx.lineWidth=24*scale;tracePath();ctx.stroke();
    ctx.shadowBlur=8*scale;ctx.strokeStyle='rgba(55,238,205,.48)';ctx.lineWidth=5*scale;tracePath();ctx.stroke();
    ctx.shadowBlur=0;ctx.strokeStyle='rgba(180,255,239,.72)';ctx.lineWidth=1.25*scale;tracePath();ctx.stroke();
    // travelling neural impulses
    for(let k=0;k<5;k++){const d=((t*110+k*totalLen/5)%totalLen);const p=posAtDistance(d),q=w2s(p.x,p.y);const rg=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,12*scale);rg.addColorStop(0,'rgba(196,255,245,.95)');rg.addColorStop(.28,'rgba(0,212,170,.75)');rg.addColorStop(1,'rgba(0,212,170,0)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(q.x,q.y,12*scale,0,Math.PI*2);ctx.fill();}
    ctx.restore();
  }

  function drawAmbientCells(){ const t=R.visualTime||0; ctx.save(); for(let i=0;i<22;i++){ const x=offX+((i*71+37)%VW)*scale+Math.sin(t*.35+i)*5*scale; const y=offY+((i*113+51)%VH)*scale+Math.cos(t*.27+i)*7*scale; const r=(1.1+(i%4)*.7)*scale; ctx.fillStyle='rgba(73,255,220,.10)';ctx.beginPath();ctx.arc(x,y,r*2.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(73,255,220,.14)';ctx.lineWidth=.6*scale;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke(); } ctx.restore(); }

  function drawSlotsReborn(){
    SLOT_POS.forEach((sp,idx)=>{const q=w2s(sp.x,sp.y),n=slotOccupant(idx),pulse=1+Math.sin((R.visualTime||0)*3+idx)*.04;
      ctx.save();
      if(!n){ctx.strokeStyle=R.selected?'rgba(0,255,210,.62)':'rgba(75,255,225,.22)';ctx.lineWidth=1.5*scale;ctx.setLineDash([5*scale,5*scale]);ctx.beginPath();ctx.arc(q.x,q.y,17*scale*pulse,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(0,212,170,.025)';ctx.beginPath();ctx.arc(q.x,q.y,14*scale,0,Math.PI*2);ctx.fill();}
      else drawNodeReborn(q,n,sp);
      ctx.restore();
    });
  }

  function drawNodeReborn(q,n,sp){ const d=NODE_TYPES[n.typeId],t=R.visualTime||0; const r=(13+(n.level-1)*.8)*scale; const a=(t*.8+n.slot)*1.3;
    ctx.save();ctx.shadowColor=d.color;ctx.shadowBlur=18*scale;const rg=ctx.createRadialGradient(q.x,q.y,2*scale,q.x,q.y,r*1.8);rg.addColorStop(0,'#dffff8');rg.addColorStop(.25,d.color);rg.addColorStop(1,'rgba(3,9,20,.15)');ctx.fillStyle=rg;ctx.beginPath();ctx.arc(q.x,q.y,r*1.28,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle='rgba(220,255,250,.7)';ctx.lineWidth=1*scale;for(let k=0;k<3;k++){const rr=r*(1.15+k*.17);ctx.globalAlpha=.22;ctx.beginPath();ctx.arc(q.x,q.y,rr,a+k, a+k+1.35);ctx.stroke();}ctx.globalAlpha=1;
    ctx.fillStyle='#071421';ctx.beginPath();ctx.arc(q.x,q.y,r*.68,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.font=`${12*scale}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(d.icon,q.x,q.y+0.5*scale);
    if(n.level>1){ctx.fillStyle='#fbbf24';ctx.font=`bold ${7.5*scale}px sans-serif`;ctx.fillText('L'+n.level,q.x,q.y+r*1.55);}ctx.restore();
  }

  function drawAnomalies(){(R.anomalies||[]).forEach(a=>{const q=w2s(a.x,a.y),alpha=Math.max(0,a.life/2.6);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle='#67e8f9';ctx.shadowColor='#67e8f9';ctx.shadowBlur=14*scale;ctx.lineWidth=2*scale;ctx.beginPath();ctx.arc(q.x,q.y,a.radius*scale*(1.08-alpha*.08),0,Math.PI*2);ctx.stroke();ctx.setLineDash([5*scale,4*scale]);ctx.beginPath();ctx.arc(q.x,q.y,a.radius*.72*scale,0,Math.PI*2);ctx.stroke();ctx.restore();});}
  function drawShockwaves(){(R.shockwaves||[]).forEach(sw=>{const q=w2s(sw.x,sw.y),alpha=Math.max(0,sw.life/.8);ctx.save();ctx.globalAlpha=alpha*.7;ctx.strokeStyle=sw.color;ctx.shadowColor=sw.color;ctx.shadowBlur=12*scale;ctx.lineWidth=Math.max(1,2*scale*alpha);ctx.beginPath();ctx.arc(q.x,q.y,sw.r*scale,0,Math.PI*2);ctx.stroke();ctx.restore();});}

  function drawCoreReborn(){
    const q=w2s(CORE_POS.x,CORE_POS.y),t=R.visualTime||0,h=R.coreHP/R.coreMaxHP,col=h>.5?'#00e0b8':h>.25?'#f59e0b':'#ff365a';
    ctx.save();
    // energy lattice
    for(let k=0;k<4;k++){const rr=(22+k*7+Math.sin(t*(1.4+k*.2)+k)*2.5)*scale;ctx.globalAlpha=.10+.05*k;ctx.strokeStyle=col;ctx.shadowColor=col;ctx.shadowBlur=16*scale;ctx.lineWidth=(2-k*.25)*scale;ctx.beginPath();ctx.arc(q.x,q.y,rr,t*.35+k,t*.35+k+Math.PI*1.45);ctx.stroke();}
    // orbital DNA helix
    ctx.globalAlpha=.55;ctx.shadowBlur=8*scale;ctx.lineWidth=1*scale;ctx.strokeStyle='#d9fff8';
    for(let lane=-1;lane<=1;lane+=2){ctx.beginPath();for(let i=0;i<=18;i++){const a=i/18*Math.PI*3+t*1.2;const x=q.x+Math.cos(a)*((9+lane*2)*scale),y=q.y+Math.sin(a)*((9+lane*2)*scale);if(!i)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
    const g=ctx.createRadialGradient(q.x-5*scale,q.y-6*scale,1*scale,q.x,q.y,27*scale);g.addColorStop(0,'#ffffff');g.addColorStop(.18,col);g.addColorStop(.55,'rgba(0,70,65,.95)');g.addColorStop(1,'rgba(2,7,15,.1)');ctx.globalAlpha=1;ctx.shadowBlur=26*scale;ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,18*scale,0,Math.PI*2);ctx.fill();
    ctx.shadowBlur=0;ctx.strokeStyle='rgba(220,255,250,.8)';ctx.lineWidth=1.4*scale;ctx.stroke();
    ctx.globalAlpha=.8;ctx.fillStyle=col;ctx.beginPath();ctx.arc(q.x,q.y,5*scale+Math.sin(t*4)*1.2*scale,0,Math.PI*2);ctx.fill();
    // health ring
    ctx.globalAlpha=.9;ctx.strokeStyle=col;ctx.lineWidth=2.5*scale;ctx.beginPath();ctx.arc(q.x,q.y,30*scale,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,h));ctx.stroke();
    ctx.restore();
  }

  function drawEnemyReborn(e){
    const d=ENEMY_TYPES[e.typeId],p=posAtDistance(e.distance),q=w2s(p.x,p.y),base=((d.finalBoss?32:d.boss?18:10))*scale,t=R.visualTime||0;
    ctx.save();ctx.globalAlpha=e.phased?.42:1;ctx.shadowColor=d.color;ctx.shadowBlur=(d.boss?26:15)*scale;
    // outer biological membrane
    const pulse=1+Math.sin(t*(2.2+(e.typeId==='fast'?1:0))+e.distance)*.08;
    ctx.strokeStyle=d.color;ctx.lineWidth=1.4*scale;ctx.beginPath();
    const spikes=d.boss?12:(e.typeId==='adaptive'?8:7);
    for(let k=0;k<spikes;k++){const a=-Math.PI/2+k*Math.PI*2/spikes+t*(d.boss?.12:.35);const rr=(k%2?base*.82:base*1.15)*pulse;const x=q.x+Math.cos(a)*rr,y=q.y+Math.sin(a)*rr;if(!k)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.closePath();ctx.stroke();
    if(e.typeId==='leech'){ctx.strokeStyle=d.color;ctx.lineWidth=3*scale;ctx.beginPath();for(let k=0;k<9;k++){const xx=q.x+(k-4)*3.2*scale,yy=q.y+Math.sin(t*9+k+e.distance)*4*scale;if(!k)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.stroke();}
    else if(e.typeId==='swarm'){for(let k=0;k<7;k++){const a=t*3.4+k*1.05,rr=base*(.8+((k%2)*.35));ctx.fillStyle=d.color;ctx.beginPath();ctx.arc(q.x+Math.cos(a)*rr,q.y+Math.sin(a)*rr,base*.27,0,Math.PI*2);ctx.fill();}}
    else if(e.typeId==='tank'||e.typeId==='armored'){ctx.fillStyle='rgba(8,18,30,.92)';ctx.strokeStyle=d.color;ctx.lineWidth=2*scale;ctx.beginPath();ctx.roundRect(q.x-base,q.y-base,base*2,base*2,4*scale);ctx.fill();ctx.stroke();for(let k=0;k<4;k++){ctx.strokeStyle='rgba(255,255,255,.20)';ctx.beginPath();ctx.moveTo(q.x-base*.72,q.y-base*.48+k*base*.32);ctx.lineTo(q.x+base*.72,q.y-base*.48+k*base*.32);ctx.stroke();}}
    else {ctx.fillStyle=d.color;ctx.beginPath();for(let k=0;k<spikes;k++){const a=-Math.PI/2+k*Math.PI*2/spikes+t*.35,rr=k%2?base*.78:base*1.08;const x=q.x+Math.cos(a)*rr,y=q.y+Math.sin(a)*rr;if(!k)ctx.moveTo(x,y);else ctx.lineTo(x,y)}ctx.closePath();ctx.fill();ctx.fillStyle='rgba(3,9,17,.86)';ctx.beginPath();ctx.arc(q.x,q.y,base*.50,0,Math.PI*2);ctx.fill();
      // nucleus + eye
      const ng=ctx.createRadialGradient(q.x-base*.18,q.y-base*.18,0,q.x,q.y,base*.55);ng.addColorStop(0,'#fff');ng.addColorStop(.2,d.color);ng.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ng;ctx.beginPath();ctx.arc(q.x,q.y,base*.55,0,Math.PI*2);ctx.fill();}
    if(e.infectedTimer>0){ctx.strokeStyle='#e879f9';ctx.globalAlpha=.9;ctx.setLineDash([3*scale,2*scale]);ctx.beginPath();ctx.arc(q.x,q.y,base*1.42,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
    if(e.adaptiveTimer>0){ctx.strokeStyle='#fbbf24';ctx.globalAlpha=.7;ctx.lineWidth=1*scale;ctx.beginPath();ctx.arc(q.x,q.y,base*1.6,t,t+Math.PI*1.2);ctx.stroke();}
    ctx.globalAlpha=1;const w=base*2.6;ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(q.x-w/2,q.y-base-9*scale,w,4*scale);ctx.fillStyle=d.color;ctx.fillRect(q.x-w/2,q.y-base-9*scale,w*Math.max(0,e.hp/e.maxHp),4*scale);
    if(d.boss){ctx.strokeStyle=d.finalBoss&&e.bossExposeTimer>0?'rgba(125,211,252,.95)':'rgba(244,63,94,.55)';ctx.lineWidth=(d.finalBoss?2.4:1)*scale;ctx.beginPath();ctx.arc(q.x,q.y,base*(d.finalBoss?1.95:1.9)+Math.sin(t*2)*2*scale,0,Math.PI*2);ctx.stroke();if(d.finalBoss){ctx.fillStyle='#fff';ctx.font=`bold ${8*scale}px sans-serif`;ctx.textAlign='center';ctx.fillText(e.bossExposeTimer>0?'EXPOSED':'SHIELDED',q.x,q.y-base*2.35);}}
    ctx.restore();
  }

  function drawProjectileReborn(p){const q=w2s(p.x,p.y),r=3.2*scale;ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=16*scale;const g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,8*scale);g.addColorStop(0,'#fff');g.addColorStop(.3,p.color);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,8*scale,0,Math.PI*2);ctx.fill();ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fill();ctx.restore();}
  function drawEnemyProjectile(p){const q=w2s(p.x,p.y),r=3.8*scale;ctx.save();ctx.shadowColor=p.color;ctx.shadowBlur=18*scale;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=.8*scale;ctx.beginPath();ctx.arc(q.x,q.y,r*1.8,0,Math.PI*2);ctx.stroke();ctx.restore();}
  function drawBeam(b){const a=w2s(b.x1,b.y1),z=w2s(b.x2,b.y2);ctx.save();ctx.globalAlpha=Math.min(1,b.life/.12);ctx.strokeStyle=b.color;ctx.shadowColor=b.color;ctx.shadowBlur=16*scale;ctx.lineWidth=2.5*scale;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(z.x,z.y);ctx.stroke();ctx.strokeStyle='#fff';ctx.lineWidth=.7*scale;ctx.stroke();ctx.restore();}
  function drawParticlesReborn(maxParticles){const list=R.particles.length>(maxParticles||140)?R.particles.slice(-(maxParticles||140)):R.particles;list.forEach(pt=>{const q=w2s(pt.x,pt.y),a=Math.max(0,pt.life*1.7);ctx.save();ctx.globalAlpha=a;ctx.shadowColor=pt.color;ctx.shadowBlur=8*scale;ctx.fillStyle=pt.color;ctx.beginPath();ctx.arc(q.x,q.y,pt.r*scale,0,Math.PI*2);ctx.fill();ctx.restore();});}
  function drawVignette(rect){const g=ctx.createRadialGradient(rect.width/2,rect.height/2,rect.height*.15,rect.width/2,rect.height/2,rect.height*.75);g.addColorStop(.55,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.48)');ctx.fillStyle=g;ctx.fillRect(0,0,rect.width,rect.height);}

  // ===== input =====
  function handleTap(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const w = s2w(clientX - rect.left, clientY - rect.top);
    let closestIdx = -1, closestDist = 26 / scale;
    SLOT_POS.forEach((sp, idx) => {
      const d = Math.hypot(sp.x - w.x, sp.y - w.y);
      if (d < closestDist) { closestDist = d; closestIdx = idx; }
    });
    if (closestIdx === -1) return;
    const occ = slotOccupant(closestIdx);
    if (occ) {
      Main.openNodePopup(occ);
    } else if (R.selected) {
      tryBuildNode(closestIdx, R.selected);
    }
  }


  function getSnapshot(){
    if(!R) return null;
    return {
      energy:R.energy,coreHP:R.coreHP,coreMaxHP:R.coreMaxHP,waveNumber:R.waveNumber,mapId:R.mapId||activeMapId,
      mode:R.mode||'campaign',daily:R.daily?JSON.parse(JSON.stringify(R.daily)):null,waveInProgress:R.waveInProgress,spawnGroups:R.spawnGroups.map(g=>({...g})),
      enemies:R.enemies.map(e=>({...e})),projectiles:R.projectiles.map(p=>({x:p.x,y:p.y,targetId:p.target?p.target.id:null,speed:p.speed,damage:p.damage,color:p.color,slow:p.slow,chain:p.chain,infect:p.infect,temporal:p.temporal})),
      enemyProjectiles:(R.enemyProjectiles||[]).map(p=>({...p})),particles:R.particles.map(p=>({...p})),anomalies:R.anomalies.map(a=>({...a})),shockwaves:R.shockwaves.map(a=>({...a})),beams:R.beams.map(a=>({...a})),
      nodes:R.nodes.map(n=>({slot:n.slot,typeId:n.typeId,level:n.level,cooldown:n.cooldown})),selected:R.selected,speedMult:R.speedMult,
      killsThisRun:R.killsThisRun,bossKillsThisRun:R.bossKillsThisRun,nodeTypeCountsThisRun:R.nodeTypeCountsThisRun,maxEmpInRun:R.maxEmpInRun,maxEnergyInRun:R.maxEnergyInRun,perfectWaveAchieved:R.perfectWaveAchieved,allNodeTypesUsed:R.allNodeTypesUsed,coreHPAtWaveStart:R.coreHPAtWaveStart,runCrystalsEarned:R.runCrystalsEarned,nextEnemyId:R.nextEnemyId,maxEndlessWave:R.maxEndlessWave||0,endlessMode:!!R.endlessMode,
      finalized:false,__v10MetaApplied:true,__v10Kills:R.__v10Kills||0,__v10Wave:R.__v10Wave||R.waveNumber,metaDamageMult:R.metaDamageMult||1,metaYieldMult:R.metaYieldMult||1,metaXPMult:R.metaXPMult||1,metaBossReward:R.metaBossReward||1,metaCritBonus:R.metaCritBonus||0,metaNodeCostMult:R.metaNodeCostMult||1,metaSlowMult:R.metaSlowMult||1,metaRepairMult:R.metaRepairMult||1,metaWaveRewardMult:R.metaWaveRewardMult||1,metaEliteRewardMult:R.metaEliteRewardMult||1,metaOverdriveDuration:R.metaOverdriveDuration||8,metaLevel:R.metaLevel||1,metaRelics:Array.isArray(R.metaRelics)?R.metaRelics.slice():[],v10Season:R.v10Season||null,overdrive:R.overdrive,overdriveActive:R.overdriveActive,combo:R.combo,comboTimer:R.comboTimer,battleDirector:R.battleDirector,fusionCount:R.fusionCount,currentWaveMeta:R.currentWaveMeta,visualTime:R.visualTime,bossTacticHits:R.enemies.filter(e=>e.typeId==='finalBoss').map(e=>e.bossTacticHits||{}),bossPhase:R.enemies.find(e=>e.typeId==='finalBoss')?.bossPhase||0,bossCycleTimer:R.enemies.find(e=>e.typeId==='finalBoss')?.bossCycleTimer||11
    };
  }
  function restoreTargets(){ if(!R)return; const byId=new Map(R.enemies.map(e=>[e.id,e])); R.projectiles.forEach(p=>p.target=byId.get(p.targetId)||null); R.projectiles=R.projectiles.filter(p=>p.target); }

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');
    if (window.Memristor3D) window.Memristor3D.init(document.getElementById('game3DCanvas'), canvas);
    window.addEventListener('resize', resize);
    canvas.addEventListener('click', e => handleTap(e.clientX, e.clientY));
    canvas.addEventListener('touchstart', e => {
      if (e.touches && e.touches[0]) {
        handleTap(e.touches[0].clientX, e.touches[0].clientY);
      }
      e.preventDefault();
    }, { passive: false });
  }

  function startNewRun(preset) {
    if(preset && preset.mapId) setMap(preset.mapId); else setMap((preset&&preset.mapId)||activeMapId);
    R = preset || freshRun(SAVE);
    R.mapId=activeMapId; R.mapName=ACTIVE_MAP.name;
    restoreTargets();
    resize();
    if (!rafId) { lastT = 0; rafId = requestAnimationFrame(tick); }
  }

  function startDailyRun() {
    const challenge = getDailyChallenge();
    setMap(challenge.mapId);
    R = freshRun(SAVE);
    R.mode = 'daily';
    R.daily = challenge;
    const md = challenge.mutationData || {};
    if (md.startEnergyMult) R.energy = Math.max(30, Math.round(R.energy * md.startEnergyMult));
    if (md.coreMult) { R.coreMaxHP = Math.max(1, Math.round(R.coreMaxHP * md.coreMult)); R.coreHP = R.coreMaxHP; R.coreHPAtWaveStart = R.coreMaxHP; }
    R.running = true; R.paused = false; R.finalized = false;
    restoreTargets();
    resize();
    if (!rafId) { lastT = 0; rafId = requestAnimationFrame(tick); }
  }

  function stopLoop() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  return {
    VW, VH, get PATH(){return PATH;}, get SLOT_POS(){return SLOT_POS;}, get CORE_POS(){return CORE_POS;}, setMap, get mapId(){return activeMapId;}, get mapName(){return ACTIVE_MAP.name;},
    init, resize, startNewRun, startDailyRun, stopLoop, endRun,
    startWave, tryBuildNode, tryUpgradeNode, sellNode, tryFuseNode, nearbyFusionPartner, nodeCost, nodeSellValue,
    get R() { return R; }, set R(v) { R = v; },
    activateOverdrive, getSnapshot,
    get totalLen() { return totalLen; }
  };
})();

// Evolution v5: Evolution Engine — adaptive director, genome pressure, node synthesis.
// WebGPU remains optional because support is still not universal; this build keeps Canvas compatibility.

// Evolution v4: Adaptive Visual Engine — reduce presiunea de randare pe telefoane slabe.
(function(){ let samples=[], last=performance.now(); setInterval(()=>{ const now=performance.now(); samples.push(now-last); last=now; if(samples.length>30)samples.shift(); const avg=samples.reduce((a,b)=>a+b,0)/samples.length; document.documentElement.dataset.memristorPerf=avg>28?'eco':'full'; },1000); })();
window.Game = Game;
