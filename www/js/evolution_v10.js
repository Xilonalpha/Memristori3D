/* MEMRISTORI V10 — ULTIMATE EVOLUTION ENGINE
   Additive layer built on V6.1.0. No renderer replacement, no network dependency.
   Online services are optional and intentionally left as user-configurable endpoints.
*/
(function(){
'use strict';
const KEY='memristor_v10_meta_v1';
const LANGS=['ro','it','en','fr','es'];
const L={
 ro:{hub:'CENTRUL NEURAL V10',evo:'Evoluție',relics:'Relicve',lab:'Laborator Neural',season:'Sezon',codex:'Codex',leader:'Clasament',level:'Nivel',xp:'XP',buy:'Cumpără',equip:'Echipează',unequip:'Scoate',equipped:'ECHIPAT',max:'MAX',cost:'Cost',close:'Închide',locked:'Blocat',unlocked:'Deblocat',skills:'Arbore Neural',nodeEvo:'Evoluții de noduri',relicForge:'Forja de relicve',director:'Director AI',seasonTitle:'Sezon local',stats:'Statistici',offline:'MOD LOCAL — SERVER OPȚIONAL',online:'ONLINE',need:'Ai nevoie de',forge:'Forjează',active:'ACTIV',wave:'Val',kills:'Eliminări',runs:'Misiuni',best:'Record',shards:'Fragmente',reset:'Resetare V10',resetConfirm:'Resetezi doar progresul V10? Progresul principal al jocului NU va fi șters.'},
 it:{hub:'CENTRO NEURALE V10',evo:'Evoluzione',relics:'Reliquie',lab:'Laboratorio Neurale',season:'Stagione',codex:'Codice',leader:'Classifica',level:'Livello',xp:'XP',buy:'Acquista',equip:'Equipaggia',unequip:'Rimuovi',equipped:'EQUIPAGGIATA',max:'MAX',cost:'Costo',close:'Chiudi',locked:'Bloccato',unlocked:'Sbloccato',skills:'Albero Neurale',nodeEvo:'Evoluzioni nodi',relicForge:'Forgia reliquie',director:'Direttore IA',seasonTitle:'Stagione locale',stats:'Statistiche',offline:'MODALITÀ LOCALE — SERVER OPZIONALE',online:'ONLINE',need:'Servono',forge:'Forgia',active:'ATTIVO',wave:'Ondata',kills:'Eliminazioni',runs:'Missioni',best:'Record',shards:'Frammenti',reset:'Reset V10',resetConfirm:'Azzerare solo il progresso V10? Il progresso principale del gioco NON verrà cancellato.'},
 en:{hub:'NEURAL COMMAND V10',evo:'Evolution',relics:'Relics',lab:'Neural Lab',season:'Season',codex:'Codex',leader:'Leaderboard',level:'Level',xp:'XP',buy:'Buy',equip:'Equip',unequip:'Unequip',equipped:'EQUIPPED',max:'MAX',cost:'Cost',close:'Close',locked:'Locked',unlocked:'Unlocked',skills:'Neural Skill Tree',nodeEvo:'Node Evolutions',relicForge:'Relic Forge',director:'AI Director',seasonTitle:'Local Season',stats:'Statistics',offline:'LOCAL MODE — SERVER OPTIONAL',online:'ONLINE',need:'Need',forge:'Forge',active:'ACTIVE',wave:'Wave',kills:'Kills',runs:'Runs',best:'Best',shards:'Shards',reset:'Reset V10',resetConfirm:'Reset only V10 progress? Your main game progress will NOT be deleted.'},
 fr:{hub:'CENTRE NEURAL V10',evo:'Évolution',relics:'Reliques',lab:'Laboratoire Neural',season:'Saison',codex:'Codex',leader:'Classement',level:'Niveau',xp:'XP',buy:'Acheter',equip:'Équiper',unequip:'Retirer',equipped:'ÉQUIPÉE',max:'MAX',cost:'Coût',close:'Fermer',locked:'Verrouillé',unlocked:'Débloqué',skills:'Arbre Neural',nodeEvo:'Évolutions des nœuds',relicForge:'Forge des reliques',director:'Directeur IA',seasonTitle:'Saison locale',stats:'Statistiques',offline:'MODE LOCAL — SERVEUR OPTIONNEL',online:'EN LIGNE',need:'Besoin',forge:'Forger',active:'ACTIF',wave:'Vague',kills:'Éliminations',runs:'Missions',best:'Record',shards:'Fragments',reset:'Réinitialiser V10',resetConfirm:'Réinitialiser seulement la progression V10 ? La progression principale ne sera PAS supprimée.'},
 es:{hub:'CENTRO NEURAL V10',evo:'Evolución',relics:'Reliquias',lab:'Laboratorio Neural',season:'Temporada',codex:'Códice',leader:'Clasificación',level:'Nivel',xp:'XP',buy:'Comprar',equip:'Equipar',unequip:'Quitar',equipped:'EQUIPADA',max:'MÁX',cost:'Coste',close:'Cerrar',locked:'Bloqueado',unlocked:'Desbloqueado',skills:'Árbol Neural',nodeEvo:'Evoluciones de nodos',relicForge:'Forja de reliquias',director:'Director IA',seasonTitle:'Temporada local',stats:'Estadísticas',offline:'MODO LOCAL — SERVIDOR OPCIONAL',online:'EN LÍNEA',need:'Necesitas',forge:'Forjar',active:'ACTIVO',wave:'Oleada',kills:'Eliminaciones',runs:'Misiones',best:'Récord',shards:'Fragmentos',reset:'Restablecer V10',resetConfirm:'¿Restablecer solo el progreso V10? El progreso principal NO se borrará.'}
};
function lang(){const x=(document.documentElement.lang||'en').toLowerCase().split('-')[0];return LANGS.includes(x)?x:'en'}
function tr(k){return (L[lang()]&&L[lang()][k])||L.en[k]||k}
function baseMeta(){return {xp:0,level:1,shards:0,skill:{core:0,offense:0,energy:0,precision:0,efficiency:0,overdrive:0,adaptation:0,fortune:0,lab:0},nodeEvo:{},ownedRelics:[],equippedRelics:[],relicForge:0,seasonXP:0,seasonKey:'',stats:{kills:0,waves:0,runs:0,bosses:0,damageEvents:0},director:{adaptive:true,intensity:1},loadout:[],localScores:[],eventsSeen:{},seasonClaims:[],seasonBadge:null,createdAt:Date.now()}}
function getMeta(){let m=baseMeta();try{const raw=localStorage.getItem(KEY);if(raw)m=Object.assign(m,JSON.parse(raw));}catch(e){};m.skill=Object.assign(baseMeta().skill,m.skill||{});m.nodeEvo=Object.assign({},m.nodeEvo||{});m.stats=Object.assign(baseMeta().stats,m.stats||{});m.director=Object.assign(baseMeta().director,m.director||{});m.ownedRelics=Array.isArray(m.ownedRelics)?m.ownedRelics:[];m.equippedRelics=Array.isArray(m.equippedRelics)?m.equippedRelics:[];m.localScores=Array.isArray(m.localScores)?m.localScores:[];m.seasonClaims=Array.isArray(m.seasonClaims)?m.seasonClaims:[];m.seasonBadge=m.seasonBadge||null;return m}
let M=getMeta();
function save(){try{localStorage.setItem(KEY,JSON.stringify(M));}catch(e){}}
function xpNeed(l){return Math.round(80*Math.pow(1.19,l-1))}
function grantXP(n){if(!n)return;M.xp+=n;M.seasonXP+=Math.round(n*.35);while(M.xp>=xpNeed(M.level)){M.xp-=xpNeed(M.level);M.level++;M.shards+=8+M.level*2;toast('⬆ '+tr('level')+' '+M.level+' · +'+(8+M.level*2)+' '+tr('shards'));}checkSeasonMilestones();save();renderStats();}
function checkSeasonMilestones(){const milestones=[100,300,600,1000];milestones.forEach((need,i)=>{if(M.seasonXP<need||M.seasonClaims.includes(need))return;M.seasonClaims.push(need);if(need===100){SAVE.crystals+=20;toast('🌐 SEASON MILESTONE · +20💠');}else if(need===300){const r=RELICS.find(x=>!M.ownedRelics.includes(x[0]));if(r){M.ownedRelics.push(r[0]);if(M.equippedRelics.length<3)M.equippedRelics.push(r[0]);toast('🧿 SEASON REWARD · '+r[2]);}else{M.shards+=40;toast('🧿 SEASON REWARD · +40 '+tr('shards'));}}else if(need===600){SAVE.crystals+=60;toast('🌐 SEASON MILESTONE · +60💠');}else if(need===1000){M.shards+=120;M.seasonBadge=seasonInfo().n;toast('🏆 SEASON COMPLETED · +120 '+tr('shards')+' · '+M.seasonBadge);}});persistSave();}
function toast(s){if(window.Main&&Main.showWaveToast)Main.showWaveToast(s);else{const t=document.getElementById('globalToast');if(t){t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}}}

const SKILLS=[
 ['core','🧬','Core Matrix',5,55,'+5% maximum Core Integrity / level'],
 ['offense','⚡','Synaptic Overclock',5,65,'+4% global node damage / level'],
 ['energy','🔋','Bio Reserve',5,50,'+6 starting Energy / level'],
 ['precision','🎯','Predictive Targeting',5,70,'+1.5% critical chance / level'],
 ['efficiency','💸','Adaptive Efficiency',5,60,'-2% node construction cost / level'],
 ['overdrive','🔥','Overdrive Reactor',5,75,'+0.8s Overdrive duration / level'],
 ['adaptation','🧠','Enemy Modeling',5,80,'stronger adaptive director rewards / level'],
 ['fortune','💠','Nanoparticle Yield',5,60,'+4% crystal yield / level'],
 ['lab','⚛️','Quantum Fabrication',5,90,'reduces relic forge cost / level']
];
const RELICS=[
 ['ionHeart','💙','Ion Heart','core',1,60,'+12 Core Integrity'],['solarCache','☀️','Solar Cache','energy',1,60,'+18 starting Energy'],['voidLens','◉','Void Lens','damage',2,75,'+10% global damage'],['chronoShard','⏳','Chrono Shard','speed',2,90,'+6% combat tempo'],['nanoBloom','🌱','Nano Bloom','yield',2,70,'+16% crystal yield'],['omegaSeal','☠️','Omega Seal','boss',3,110,'+30% boss rewards'],['cryoCrown','❄️','Cryo Crown','slow',3,85,'+30% slow effect'],['plasmaCore','🔺','Plasma Core','plasma',3,85,'+24% offensive damage'],['sentinelEye','🛰️','Sentinel Eye','precision',3,90,'+6% critical chance'],['memoryVault','🗃️','Memory Vault','xp',4,100,'+48% XP gain'],['neuralRoot','🌿','Neural Root','repair',2,80,'+20% Core recovery'],['blackArchive','📓','Black Archive','rare',4,130,'+60% elite reward multiplier']
];
const NODE_EVOS={
 pulse:[['Resonance','+12% damage'],['Hyperpulse','+22% damage'],['Quantum Pulse','+35% damage']],cannon:[['Rail Matrix','+12% damage'],['Siege Matrix','+24% damage'],['Titan Matrix','+40% damage']],emp:[['Wide Field','+10% radius'],['Storm Field','+22% radius'],['Singularity Field','+35% radius']],slow:[['Cryo Lock','+10% slow'],['Cryo Prison','+20% slow'],['Absolute Zero','+32% slow']],laser:[['Split Beam','+1 chain'],['Prism Beam','+2 chain'],['Neural Lance','+35% damage']],repair:[['Tissue Mesh','+15% heal'],['Regrowth','+30% heal'],['Regeneration','+50% heal']],shield:[['Barrier Mesh','+8% shield'],['Aegis','+16% shield'],['Bio Aegis','+25% shield']],drone:[['Scout Swarm','+12% damage'],['Hunter Swarm','+25% damage'],['Sentinel Prime','+42% damage']],virus:[['Antibody','+12% damage'],['Broad Spectrum','+25% damage'],['Panacea','+42% damage']],chrono:[['Temporal Lock','+12% damage'],['Time Fracture','+25% damage'],['Event Horizon','+45% damage']],mine:[['Microburst','+12% damage'],['Nanoblast','+28% damage'],['Cataclysm','+48% damage']],amp:[['Signal Boost','+6% buff'],['Synaptic Relay','+12% buff'],['Neural Amplifier','+20% buff']]
};

// V10 elite variants reuse the stable enemy update/render pipeline.
if(window.ENEMY_TYPES){
 ENEMY_TYPES.guardian={id:'guardian',name:'Guardian Synaptic',icon:'🛡️',hp:260,speed:30,damage:18,reward:34,color:'#60a5fa',armor:.44,v10Elite:true};
 ENEMY_TYPES.replicator={id:'replicator',name:'Replicator',icon:'🧬',hp:180,speed:52,damage:12,reward:38,color:'#e879f9',split:true,v10Elite:true};
 ENEMY_TYPES.nullifier={id:'nullifier',name:'Nullifier',icon:'◼️',hp:210,speed:46,damage:16,reward:42,color:'#c4b5fd',phase:true,shooter:true,v10Elite:true,shootRate:2.2,shootRange:180,shotDamage:13};
 ENEMY_TYPES.colossus={id:'colossus',name:'Colossus',icon:'☠️',hp:620,speed:19,damage:30,reward:95,color:'#fb7185',boss:true,armor:.5,v10Elite:true,shooter:true,shootRate:1.7,shootRange:220,shotDamage:20};
}

const NODE_BASE={};
function captureBases(){if(!window.NODE_TYPES)return;Object.keys(NODE_TYPES).forEach(id=>{if(!NODE_BASE[id])NODE_BASE[id]={damage:NODE_TYPES[id].damage,range:NODE_TYPES[id].range,rate:NODE_TYPES[id].rate,slow:NODE_TYPES[id].slow,chain:NODE_TYPES[id].chain||0,heal:NODE_TYPES[id].heal||0,shield:NODE_TYPES[id].shield||0,buff:NODE_TYPES[id].buff||0,splash:NODE_TYPES[id].splash||0,cost:NODE_TYPES[id].cost}})}
function evoLvl(id){return Math.min(3,Math.max(0,Number(M.nodeEvo[id]||0)))}
function recomputeNodeStats(){captureBases();Object.keys(NODE_BASE).forEach(id=>{const b=NODE_BASE[id],l=evoLvl(id),d=NODE_TYPES[id];d.damage=b.damage*(1+l*.115);d.range=b.range*(1+l*.055);d.rate=b.rate?b.rate/(1+l*.055):b.rate;d.slow=b.slow?(Math.min(.88,b.slow*(1+l*.08))):b.slow;d.chain=(b.chain||0)+((id==='laser'||id==='superconductive')?l:0);d.heal=b.heal*(1+l*.15);d.shield=b.shield*(1+l*.08);d.buff=b.buff*(1+l*.06);d.splash=b.splash*(1+l*.07);d.cost=b.cost});}
if(window.SHOP_ITEMS){const it=SHOP_ITEMS.find(x=>x.id==='globalDamage');if(it){it.effectPerLevel=.04;}}
function applyMetaToRun(){
 const r=Game&&Game.R;if(!r)return;
 const s=M.skill||{};
 const relics=M.equippedRelics.map(id=>RELICS.find(x=>x[0]===id)).filter(Boolean);
 const season=seasonBonus();
 let coreBonus=1+s.core*.05, energyBonus=s.energy*6, damageBonus=1+s.offense*.04, yieldBonus=1+s.fortune*.04;
 let critBonus=s.precision*.015, nodeCostMult=1-s.efficiency*.02, slowMult=1, repairMult=1, waveRewardMult=1, eliteRewardMult=1;
 let xpMult=1, bossReward=1, speedMult=1, overdriveDuration=8;
 relics.forEach(x=>{
   if(x[3]==='core') r.coreMaxHP+=12*x[4];
   if(x[3]==='energy') energyBonus+=18*x[4];
   if(x[3]==='damage') damageBonus*=1+.05*x[4];
   if(x[3]==='yield') yieldBonus*=1+.08*x[4];
   if(x[3]==='speed') speedMult*=1+.03*x[4];
   if(x[3]==='xp') xpMult*=1+.12*x[4];
   if(x[3]==='boss') bossReward*=1+.10*x[4];
   if(x[3]==='slow') slowMult*=1+.10*x[4];
   if(x[3]==='plasma') damageBonus*=1+.08*x[4];
   if(x[3]==='precision') critBonus+=.02*x[4];
   if(x[3]==='repair') repairMult*=1+.10*x[4];
   if(x[3]==='rare') eliteRewardMult*=1+.15*x[4];
 });
 // V10 skill tree effects are now consumed by the core gameplay path.
 xpMult*=1+(s.adaptation||0)*.025;
 waveRewardMult*=1+(s.adaptation||0)*.03;
 overdriveDuration+=s.overdrive*.8;
 // Active local season modifiers are real gameplay modifiers, not display-only text.
 if(season.n==='NEURAL AWAKENING') xpMult*=1.10;
 if(season.n==='CYBER IMMUNITY') coreBonus*=1.08;
 if(season.n==='OMEGA HUNT') bossReward*=1.15;
 if(season.n==='QUANTUM STORM') speedMult*=1.05;
 r.coreMaxHP=Math.round(r.coreMaxHP*coreBonus);
 r.coreHP=r.coreMaxHP; r.coreHPAtWaveStart=r.coreMaxHP;
 r.energy+=energyBonus;
 r.speedMult=Math.min(3,(r.speedMult||1)*speedMult);
 r.metaDamageMult=damageBonus;
 r.metaYieldMult=yieldBonus;
 r.metaXPMult=xpMult;
 r.metaBossReward=bossReward;
 r.metaCritBonus=critBonus;
 r.metaNodeCostMult=Math.max(.55,nodeCostMult);
 r.metaSlowMult=Math.min(1.75,slowMult);
 r.metaRepairMult=Math.min(1.75,repairMult);
 r.metaWaveRewardMult=Math.min(1.60,waveRewardMult);
 r.metaEliteRewardMult=Math.min(2.0,eliteRewardMult);
 r.metaOverdriveDuration=Math.min(15,overdriveDuration);
 r.metaLevel=M.level;
 r.metaRelics=relics.map(x=>x[0]);
 r.v10Season=season.n;
}

function forgeCost(relic){const base=relic[4]*relic[4]*8;return Math.max(25,Math.round(base*(1-(M.skill.lab||0)*.04)))}
function obtainRelic(id){const r=RELICS.find(x=>x[0]===id);if(!r)return;M.ownedRelics.push(id);if(M.equippedRelics.length<3)M.equippedRelics.push(id);M.shards=Math.max(0,M.shards-forgeCost(r));save();toast('🧿 '+r[2]+' '+tr('unlocked'));renderHub();}
function forgeRelic(id){const r=RELICS.find(x=>x[0]===id);if(!r||M.ownedRelics.includes(id))return;const c=forgeCost(r);if(M.shards<c){toast(tr('need')+' '+c+' '+tr('shards'));return}obtainRelic(id)}
function buySkill(id){const s=SKILLS.find(x=>x[0]===id),lv=M.skill[id]||0;if(!s||lv>=s[3])return;const c=Math.round(s[4]*Math.pow(1.75,lv));if(M.shards<c){toast(tr('need')+' '+c+' '+tr('shards'));return}M.shards-=c;M.skill[id]=lv+1;recomputeNodeStats();save();toast('🧠 '+s[2]+' '+tr('level')+' '+(lv+1));renderHub()}
function buyNodeEvo(id){const arr=NODE_EVOS[id],lv=evoLvl(id);if(!arr||lv>=3)return;const c=50+lv*85+M.level*3;if(M.shards<c){toast(tr('need')+' '+c+' '+tr('shards'));return}M.shards-=c;M.nodeEvo[id]=lv+1;recomputeNodeStats();save();toast('⚛️ '+id+' '+arr[lv][0]);renderHub()}
function equipRelic(id){if(!M.ownedRelics.includes(id))return;const i=M.equippedRelics.indexOf(id);if(i>=0)M.equippedRelics.splice(i,1);else if(M.equippedRelics.length<3)M.equippedRelics.push(id);else toast('3 relics max');save();renderHub()}
function seasonKey(){const d=new Date();return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')}
function seasonInfo(){const key=seasonKey();if(M.seasonKey!==key){M.seasonKey=key;M.seasonXP=0;M.seasonClaims=[];M.seasonBadge=null;M.eventsSeen={};save()}const idx=(new Date().getUTCMonth())%4;return [{n:'NEURAL AWAKENING',bonus:'XP +10%'},{n:'CYBER IMMUNITY',bonus:'Core +8%'},{n:'OMEGA HUNT',bonus:'Boss rewards +15%'},{n:'QUANTUM STORM',bonus:'Speed +5%'}][idx]}
function seasonBonus(){const s=seasonInfo();return s}

function ensureEl(){if(document.getElementById('v10Hub'))return;const b=document.createElement('button');b.className='v6-feature v10-launch';b.id='btnV10Hub';b.innerHTML='<b>◈</b><span>V10 NEURAL COMMAND</span><small>EVOLUTION • RELICS • SEASON</small>';const row=document.querySelector('.v6-feature-row');if(row)row.appendChild(b);b.addEventListener('click',()=>openHub());const hub=document.createElement('div');hub.id='v10Hub';hub.className='v10-overlay';hub.innerHTML=`<div class="v10-panel"><header class="v10-head"><div><small>MEMRISTORI</small><h2>${tr('hub')}</h2><span id="v10Status">${tr('offline')}</span></div><button class="v10-close" id="v10Close">×</button></header><div class="v10-stats" id="v10Stats"></div><div class="v10-tabs" id="v10Tabs"><button data-tab="evo">🧠 ${tr('evo')}</button><button data-tab="relics">🧿 ${tr('relics')}</button><button data-tab="lab">⚛️ ${tr('lab')}</button><button data-tab="season">🌐 ${tr('season')}</button><button data-tab="codex">📖 ${tr('codex')}</button><button data-tab="leader">🏆 ${tr('leader')}</button></div><div id="v10Content"></div><div class="v10-foot"><span>V10.1.1 INTEGRATED</span><button id="v10Reset">${tr('reset')}</button></div></div>`;document.body.appendChild(hub);document.getElementById('v10Close').onclick=closeHub;document.getElementById('v10Reset').onclick=()=>{if(confirm(tr('resetConfirm'))){M=baseMeta();save();recomputeNodeStats();renderHub()}};hub.querySelectorAll('[data-tab]').forEach(x=>x.onclick=()=>renderTab(x.dataset.tab));}
function openHub(){ensureEl();document.getElementById('v10Hub').classList.add('active');renderHub()}
function closeHub(){const h=document.getElementById('v10Hub');if(h)h.classList.remove('active')}
function renderStats(){const el=document.getElementById('v10Stats');if(!el)return;const need=xpNeed(M.level);el.innerHTML=`<div><b>🧬 ${tr('level')} ${M.level}</b><small>${M.xp}/${need} ${tr('xp')}</small><i><span style="width:${Math.min(100,M.xp/need*100)}%"></span></i></div><div><b>💠 ${M.shards}</b><small>${tr('shards')}</small></div><div><b>☠ ${M.stats.kills}</b><small>${tr('kills')}</small></div><div><b>🌊 ${M.stats.waves}</b><small>${tr('wave')}</small></div>`}
function renderHub(){renderStats();const c=document.getElementById('v10Content');if(c&&!c.dataset.tab)renderTab('evo')}
function renderTab(tab){const c=document.getElementById('v10Content');if(!c)return;c.dataset.tab=tab;renderStats();if(tab==='evo')renderEvolution(c);else if(tab==='relics')renderRelics(c);else if(tab==='lab')renderLab(c);else if(tab==='season')renderSeason(c);else if(tab==='codex')renderCodex(c);else renderLeader(c)}
function card(title,body,cls=''){return `<article class="v10-card ${cls}"><h3>${title}</h3>${body}</article>`}
function renderEvolution(c){let h='<div class="v10-section-title">🧠 '+tr('skills')+'</div><div class="v10-grid">';SKILLS.forEach(s=>{const lv=M.skill[s[0]]||0,max=lv>=s[3],cost=Math.round(s[4]*Math.pow(1.75,lv));h+=card(`${s[1]} ${s[2]}`,`<p>${s[5]}</p><div class="v10-level">${lv}/${s[3]}</div><button data-skill="${s[0]}" ${max||M.shards<cost?'disabled':''}>${max?tr('max'):tr('buy')+' · 💠 '+cost}</button>`)});h+='</div><div class="v10-section-title">⚛️ '+tr('nodeEvo')+'</div><div class="v10-grid">';Object.keys(NODE_EVOS).forEach(id=>{const lv=evoLvl(id),arr=NODE_EVOS[id],max=lv>=3,cost=50+lv*85+M.level*3;h+=card((window.NODE_TYPES[id]?.icon||'◈')+' '+(window.NODE_TYPES[id]?.name||id),`<p>${max?arr[2][1]:lv?arr[lv][1]:'Base → '+arr[0][1]}</p><div class="v10-level">${lv}/3</div><button data-nevo="${id}" ${max||M.shards<cost?'disabled':''}>${max?tr('max'):tr('buy')+' · 💠 '+cost}</button>`)});h+='</div>';c.innerHTML=h;c.querySelectorAll('[data-skill]').forEach(b=>b.onclick=()=>buySkill(b.dataset.skill));c.querySelectorAll('[data-nevo]').forEach(b=>b.onclick=()=>buyNodeEvo(b.dataset.nevo));}
function renderRelics(c){let h='<div class="v10-grid">';RELICS.forEach(r=>{const own=M.ownedRelics.includes(r[0]),eq=M.equippedRelics.includes(r[0]),cost=forgeCost(r);h+=card(`${r[1]} ${r[2]}`,`<p>${r[6]}</p><div class="v10-rarity">${'◆'.repeat(r[4])}</div>${own?`<b class="v10-owned">${eq?'✓ '+tr('equipped'):tr('unlocked')}</b><button data-eq="${r[0]}">${eq?tr('unequip'):tr('equip')}</button>`:`<button data-forge="${r[0]}" ${M.shards<cost?'disabled':''}>${tr('forge')} · 💠 ${cost}</button>`}`)});h+='</div>';c.innerHTML=h;c.querySelectorAll('[data-forge]').forEach(b=>b.onclick=()=>forgeRelic(b.dataset.forge));c.querySelectorAll('[data-eq]').forEach(b=>b.onclick=()=>equipRelic(b.dataset.eq));}
function renderLab(c){const s=seasonBonus();c.innerHTML='<div class="v10-lab-grid">'+card('🧪 Neural Forge','<p>Combine fragments into relics. Forge cost scales with rarity and Quantum Fabrication.</p><div class="v10-big">'+M.shards+' '+tr('shards')+'</div><p>Equipped relics: '+M.equippedRelics.length+'/3</p>')+card('🧠 '+tr('director'),'<p>Adaptive waves react to your recent performance. The director is deterministic and offline-safe.</p><div class="v10-toggle"><b>'+tr('active')+'</b><button id="directorToggle">'+(M.director.adaptive?'ON':'OFF')+'</button></div>')+card('📡 Server Bridge','<p>V10 stores all progress locally. For online leaderboard, cloud save or events, add your own HTTPS API later.</p><code>/api/v1/profile<br>/api/v1/leaderboard<br>/api/v1/events</code>')+card('🧬 Safety Layer','<p>No gameplay dependency on a server. If a server is unavailable, the game continues normally.</p><b>'+tr('offline')+'</b>')+'</div>';const bt=document.getElementById('directorToggle');if(bt)bt.onclick=()=>{M.director.adaptive=!M.director.adaptive;save();renderLab(c)}}
function renderSeason(c){const s=seasonBonus(),need=1000,prog=Math.min(100,M.seasonXP/need*100),badge=M.seasonBadge?`<p>🏆 <b>Badge: ${M.seasonBadge}</b></p>`:'<p>🏆 Badge: 1000 XP</p>';c.innerHTML=card('🌐 '+tr('seasonTitle'),`<div class="v10-season-name">${s.n}</div><p>${s.bonus}</p><div class="v10-progress"><span style="width:${prog}%"></span></div><b>${M.seasonXP}/${need} XP</b>${badge}<p>Sezonul este local până când un server este conectat. Evenimentele online pot folosi aceeași structură fără a schimba motorul.</p>`)+card('🎁 Milestones','<div class="v10-milestones"><span>100 XP<br>💠20</span><span>300 XP<br>🧿 relic</span><span>600 XP<br>💠60</span><span>1000 XP<br>🏆 badge +120 🔷</span></div>')}
function renderCodex(c){const enemies=Object.values(window.ENEMY_TYPES||{}),nodes=Object.values(window.NODE_TYPES||{});c.innerHTML=card('📖 Enemy Codex',`<div class="v10-codex">${enemies.map(e=>`<span>${e.icon||'◈'} ${e.name}</span>`).join('')}</div>`)+card('⚛️ Node Codex',`<div class="v10-codex">${nodes.map(n=>`<span>${n.icon||'◈'} ${n.name}</span>`).join('')}</div>`)+card('📊 '+tr('stats'),`<p>${tr('kills')}: <b>${M.stats.kills}</b></p><p>${tr('wave')}: <b>${M.stats.waves}</b></p><p>${tr('runs')}: <b>${M.stats.runs}</b></p><p>${tr('best')}: <b>${SAVE?.bestWave||0}</b></p>`)}
function renderLeader(c){const scores=[...M.localScores].sort((a,b)=>b.score-a.score).slice(0,20);c.innerHTML=card('🏆 '+tr('leader'),'<p>Clasament local offline. Nu pretinde rezultate globale fără server.</p><div class="v10-leader">'+(scores.length?scores.map((x,i)=>`<span><b>#${i+1}</b> ${x.name||'PLAYER'} <strong>${x.score}</strong></span>`).join(''):'<em>No scores yet.</em>')+'</div>')+card('☁️ Online Bridge','<p>Endpointurile sunt pregătite conceptual; nu se trimit date până când configurezi tu serverul.</p><code>HTTPS + auth + leaderboard</code>')}

function patchGame(){if(window.__memV10Patched||!window.Game)return;window.__memV10Patched=true;recomputeNodeStats();const os=Game.startNewRun,od=Game.startDailyRun,ow=Game.startWave,ob=Game.tryBuildNode,ou=Game.tryUpgradeNode,of=Game.tryFuseNode;
Game.startNewRun=function(){const preset=arguments[0];const z=os.apply(Game,arguments);if(!(preset&&preset.__v10MetaApplied)){applyMetaToRun();}M.stats.runs++;save();return z};
Game.startDailyRun=function(){const z=od.apply(Game,arguments);applyMetaToRun();M.stats.runs++;save();return z};
Game.startWave=function(){const before=Game.R?Game.R.waveNumber:0;const z=ow.apply(Game,arguments);const r=Game.R;if(r&&r.waveInProgress&&before>0&&before%12===0&&before<200){const cycle=before%48;const elite=cycle===0?'colossus':(cycle===12?'guardian':(cycle===24?'nullifier':'replicator'));r.spawnGroups.push({type:elite,count:1+Math.floor(before/60),hpMult:1+before*.035,interval:1.1});toast('☠️ ELITE CONTACT · '+(ENEMY_TYPES[elite]?.name||elite));}if(r&&r.waveInProgress&&M.director.adaptive){const perf=Math.min(1,(r.killsThisRun||0)/Math.max(20,before*4));const adapt=Math.min(.22,(before>15?0.04:0)+perf*.08+(M.skill.adaptation||0)*.012);r.spawnGroups.forEach(g=>{g.hpMult*=1+adapt;g.interval=Math.max(.16,g.interval*(1-(M.skill.adaptation||0)*.008));});r.metaWaveRewardMult=Math.min(1.6,(r.metaWaveRewardMult||1)*(1+adapt*.5));r.v10Director={pressure:adapt,season:seasonBonus().n};}return z};
Game.tryBuildNode=function(slot,type){const z=ob.apply(Game,arguments);if(z){grantXP(3);M.stats.damageEvents++;save();}return z};
Game.tryUpgradeNode=function(n){const z=ou.apply(Game,arguments);if(z)grantXP(5);return z};
Game.tryFuseNode=function(n){const z=of.apply(Game,arguments);if(z){grantXP(35);M.shards+=8;save()}return z};
if(window.Main&&Main.showVictory&&!Main.__v10VictoryWrapped){const ov=Main.showVictory;Main.showVictory=function(){const r=Game.R;if(r){const score=Math.round((r.killsThisRun||0)*10+(r.waveNumber-1)*50+(M.level*100));M.localScores.push({score,name:'PLAYER',wave:r.waveNumber-1,date:new Date().toISOString()});M.localScores=M.localScores.sort((a,b)=>b.score-a.score).slice(0,20);M.stats.bosses+=r.bossKillsThisRun||0;save()}return ov.apply(Main,arguments)};Main.__v10VictoryWrapped=true;}
setInterval(()=>{const r=Game.R;if(!r)return;const k=r.killsThisRun||0,w=r.waveNumber||1;const dk=Math.max(0,k-(r.__v10Kills||0));if(dk){const mult=r.metaXPMult||1;grantXP(Math.round(dk*mult));M.stats.kills+=dk;r.__v10Kills=k;M.stats.damageEvents+=dk;save()}const dw=Math.max(0,w-(r.__v10Wave||1));if(dw){M.stats.waves+=dw;grantXP(dw*20);r.__v10Wave=w;save()}},800);
}
function init(){ensureEl();patchGame();recomputeNodeStats();seasonInfo();setInterval(()=>{if(Game&&Game.R&&Game.R.running&&Game.R.waveInProgress){M.seasonXP+=1;checkSeasonMilestones();save();}},10000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else setTimeout(init,0);
window.MemristorV10={open:openHub,getMeta:()=>M,save,grantXP,recomputeNodeStats,seasonBonus};
})();
