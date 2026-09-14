// ===================== MEMRISTOR: APĂRAREA IMPLANTULUI — DATE JOC =====================
// Temă preluată din fișierele sursă: implant bio-electronic hibrid, circuit memristor,
// citire wireless NFC, regenerare tisulară vs. inflamație/degradare.

const MAX_DESIGNED_WAVE = 200;
const FINAL_BOSS_WAVE = 200;

// V5.2 MAP ARCHITECTURE — hărți multiple, fiecare cu traseu și poziții de noduri proprii.
const MAPS = {
  neuralCore: { id:'neuralCore', name:'🧠 Nucleul Neural', path:[
    {x:40,y:-20},{x:40,y:100},{x:300,y:100},{x:300,y:220},{x:60,y:220},{x:60,y:340},{x:320,y:340},{x:320,y:460},{x:150,y:460},{x:150,y:590}
  ], slots:[
    {x:100,y:60},{x:250,y:55},{x:335,y:160},{x:150,y:160},{x:150,y:255},{x:20,y:280},{x:100,y:375},{x:210,y:285},{x:340,y:400},{x:250,y:425},{x:60,y:425},{x:110,y:525},{x:210,y:525}
  ]},
  vascularLabyrinth: { id:'vascularLabyrinth', name:'🩸 Labirint Vascular', path:[
    {x:-20,y:70},{x:100,y:70},{x:100,y:180},{x:300,y:180},{x:300,y:70},{x:380,y:70},{x:380,y:300},{x:220,y:300},{x:220,y:430},{x:60,y:430},{x:60,y:570},{x:180,y:570},{x:180,y:650}
  ], slots:[
    {x:45,y:125},{x:155,y:125},{x:255,y:125},{x:335,y:125},{x:65,y:250},{x:145,y:245},{x:255,y:245},{x:335,y:245},{x:120,y:360},{x:285,y:360},{x:25,y:500},{x:120,y:510},{x:245,y:520},{x:300,y:600}
  ]},
  synapseGarden: { id:'synapseGarden', name:'🌿 Grădina Sinaptică', path:[
    {x:180,y:-20},{x:180,y:90},{x:80,y:150},{x:80,y:270},{x:280,y:270},{x:280,y:150},{x:180,y:90},{x:180,y:380},{x:60,y:460},{x:60,y:570},{x:180,y:610}
  ], slots:[
    {x:120,y:55},{x:240,y:55},{x:35,y:190},{x:125,y:190},{x:235,y:190},{x:325,y:190},{x:35,y:330},{x:125,y:330},{x:235,y:330},{x:325,y:330},{x:120,y:445},{x:240,y:445},{x:20,y:520},{x:300,y:520}
  ]},
  quantumMembrane: { id:'quantumMembrane', name:'⚛️ Membrana Cuantică', path:[
    {x:12,y:110},{x:90,y:110},{x:180,y:35},{x:270,y:110},{x:348,y:110},{x:300,y:230},{x:300,y:360},{x:180,y:360},{x:60,y:360},{x:60,y:500},{x:180,y:500},{x:180,y:625}
  ], slots:[
    {x:45,y:55},{x:125,y:90},{x:235,y:90},{x:320,y:55},{x:125,y:210},{x:235,y:210},{x:320,y:210},{x:20,y:300},{x:110,y:315},{x:250,y:315},{x:335,y:315},{x:120,y:430},{x:240,y:430},{x:70,y:555},{x:290,y:555}
  ]},
  corticalSpiral: { id:'corticalSpiral', name:'🌀 Spirala Corticală', path:[
    {x:18,y:55},{x:170,y:55},{x:320,y:55},{x:320,y:165},{x:45,y:165},{x:45,y:275},{x:320,y:275},{x:320,y:385},{x:45,y:385},{x:45,y:495},{x:180,y:495},{x:180,y:625}
  ], slots:[{x:90,y:110},{x:230,y:110},{x:345,y:120},{x:110,y:215},{x:230,y:215},{x:335,y:235},{x:100,y:325},{x:230,y:325},{x:335,y:345},{x:100,y:435},{x:250,y:435},{x:75,y:545},{x:285,y:545}]},
  synapticForge: { id:'synapticForge', name:'🔥 Forja Sinaptică', path:[
    {x:18,y:120},{x:120,y:120},{x:120,y:35},{x:240,y:35},{x:240,y:120},{x:342,y:120},{x:342,y:300},{x:245,y:300},{x:245,y:410},{x:115,y:410},{x:115,y:520},{x:180,y:520},{x:180,y:625}
  ], slots:[{x:55,y:70},{x:175,y:80},{x:285,y:70},{x:65,y:180},{x:175,y:175},{x:285,y:180},{x:65,y:300},{x:170,y:300},{x:285,y:330},{x:55,y:465},{x:180,y:455},{x:305,y:465},{x:85,y:565},{x:280,y:565}]},
  lymphaticMaze: { id:'lymphaticMaze', name:'🧬 Labirint Limfatic', path:[
    {x:20,y:70},{x:340,y:70},{x:340,y:180},{x:20,y:180},{x:20,y:290},{x:340,y:290},{x:340,y:400},{x:20,y:400},{x:20,y:510},{x:340,y:510},{x:180,y:625}
  ], slots:[{x:75,y:120},{x:180,y:120},{x:285,y:120},{x:75,y:235},{x:180,y:235},{x:285,y:235},{x:75,y:345},{x:180,y:345},{x:285,y:345},{x:75,y:455},{x:180,y:455},{x:285,y:455},{x:90,y:560},{x:275,y:560}]},
  axonCathedral: { id:'axonCathedral', name:'🏛️ Catedrala Axonilor', path:[
    {x:180,y:10},{x:180,y:100},{x:65,y:180},{x:65,y:300},{x:295,y:300},{x:295,y:180},{x:180,y:100},{x:180,y:390},{x:65,y:470},{x:65,y:560},{x:180,y:625}
  ], slots:[{x:110,y:90},{x:250,y:90},{x:35,y:235},{x:125,y:235},{x:235,y:235},{x:325,y:235},{x:35,y:360},{x:125,y:360},{x:235,y:360},{x:325,y:360},{x:110,y:445},{x:250,y:445},{x:25,y:515},{x:325,y:515}]},
  omegaCitadel: { id:'omegaCitadel', name:'☠️ Citadela Omega', path:[
    {x:18,y:90},{x:105,y:90},{x:105,y:200},{x:255,y:200},{x:255,y:90},{x:342,y:90},{x:342,y:320},{x:255,y:320},{x:255,y:445},{x:105,y:445},{x:105,y:555},{x:180,y:625}
  ], slots:[{x:45,y:145},{x:175,y:145},{x:305,y:145},{x:55,y:250},{x:175,y:250},{x:305,y:250},{x:55,y:365},{x:175,y:365},{x:305,y:365},{x:45,y:500},{x:175,y:500},{x:305,y:500},{x:80,y:575},{x:280,y:575}]}
};
const MAP_ORDER = Object.keys(MAPS);


// V5.3 DAILY SYSTEM — provocare deterministă pe zi, fără server.
function dailyDateKey(date = new Date()) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
function dailySeed(key) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

const SUPPORTED_LANGS = ['ro','it','en','fr','es'];
function detectPhoneLanguage(){
  const raw = ((navigator.languages && navigator.languages[0]) || navigator.language || 'ro').toLowerCase();
  const code = raw.split('-')[0];
  return SUPPORTED_LANGS.includes(code) ? code : 'en';
}
const NODE_LOCALIZED = {
  pulse:{ro:'Memristor Rapid',it:'Memristore Rapido',en:'Rapid Memristor',fr:'Memristor Rapide',es:'Memristor Rápido'},
  cannon:{ro:'Memristor de Putere',it:'Memristore di Potenza',en:'Power Memristor',fr:'Memristor de Puissance',es:'Memristor de Potencia'},
  emp:{ro:'Câmp Electromagnetic',it:'Campo Elettromagnetico',en:'Electromagnetic Field',fr:'Champ Électromagnétique',es:'Campo Electromagnético'},
  slow:{ro:'Memristor Crio',it:'Memristore Criogenico',en:'Cryo Memristor',fr:'Memristor Cryo',es:'Memristor Criogénico'},
  laser:{ro:'Fascicul Neural',it:'Fascio Neurale',en:'Neural Beam',fr:'Faisceau Neural',es:'Haz Neural'},
  repair:{ro:'Regenerator Tisular',it:'Rigeneratore Tissutale',en:'Tissue Regenerator',fr:'Régénérateur Tissulaire',es:'Regenerador Tisular'},
  shield:{ro:'Barieră Bioelectrică',it:'Barriera Bioelettrica',en:'Bioelectric Barrier',fr:'Barrière Bioélectrique',es:'Barrera Bioeléctrica'},
  drone:{ro:'Nanodronă Sentinel',it:'Nanodrone Sentinel',en:'Sentinel Nanodrone',fr:'Nanodrone Sentinelle',es:'Nanodron Centinela'},
  virus:{ro:'Injector Antivirus',it:'Iniettore Antivirus',en:'Antivirus Injector',fr:'Injecteur Antivirus',es:'Inyector Antivirus'},
  chrono:{ro:'Nod Temporal',it:'Nodo Temporale',en:'Temporal Node',fr:'Nœud Temporel',es:'Nodo Temporal'},
  mine:{ro:'Nanomine Adaptivă',it:'Nanomina Adattiva',en:'Adaptive Nanomine',fr:'Nanomine Adaptive',es:'Nanomina Adaptativa'},
  amp:{ro:'Amplificator Sinaptic',it:'Amplificatore Sinaptico',en:'Synaptic Amplifier',fr:'Amplificateur Synaptique',es:'Amplificador Sináptico'}
};
function localizeNodeData(){ Object.keys(NODE_LOCALIZED).forEach(id=>{ if(NODE_TYPES[id]) NODE_TYPES[id].name=NODE_LOCALIZED[id][CURRENT_LANG]||NODE_LOCALIZED[id].en; }); }

const I18N = {
  ro:{mission:'Misiune Nouă',continue:'Continuă',sector:'Sector de implant',lab:'Laborator',achievements:'Realizări',howto:'Cum se joacă',story:'Jurnalul implantului',settings:'Setări',daily:'PROVOCAREA ZILEI',dailyLogin:'RECOMPENSA ZILNICĂ',claim:'Revendică',claimed:'Revendicată',day:'Ziua',streak:'Streak',wave:'Val',waves:'valuri',score:'Scor',best:'Record',pause:'Pauză',resume:'Continuă',menu:'Meniu principal',final:'OMEGA — CONȘTIINȚA PATOGENĂ',boss:'BOSS FINAL',loginReward:'Recompensă login',locked:'Deblocat la val',continueStory:'Continuă',close:'Închide'},
  it:{mission:'Nuova missione',continue:'Continua',sector:'Settore dell’impianto',lab:'Laboratorio',achievements:'Obiettivi',howto:'Come si gioca',story:'Diario dell’impianto',settings:'Impostazioni',daily:'SFIDA DEL GIORNO',dailyLogin:'RICOMPENSA GIORNALIERA',claim:'Riscatta',claimed:'Riscattata',day:'Giorno',streak:'Serie',wave:'Ondata',waves:'ondate',score:'Punteggio',best:'Record',pause:'Pausa',resume:'Continua',menu:'Menu principale',final:'OMEGA — COSCIENZA PATOGENA',boss:'BOSS FINALE',loginReward:'Ricompensa login',locked:'Sbloccato all’ondata',continueStory:'Continua',close:'Chiudi'},
  en:{mission:'New Mission',continue:'Continue',sector:'Implant sector',lab:'Laboratory',achievements:'Achievements',howto:'How to Play',story:'Implant Journal',settings:'Settings',daily:'DAILY CHALLENGE',dailyLogin:'DAILY LOGIN REWARD',claim:'Claim',claimed:'Claimed',day:'Day',streak:'Streak',wave:'Wave',waves:'waves',score:'Score',best:'Best',pause:'Pause',resume:'Resume',menu:'Main Menu',final:'OMEGA — PATHOGEN CONSCIOUSNESS',boss:'FINAL BOSS',loginReward:'Login reward',locked:'Unlocked at wave',continueStory:'Continue',close:'Close'},
  fr:{mission:'Nouvelle mission',continue:'Continuer',sector:'Secteur de l’implant',lab:'Laboratoire',achievements:'Succès',howto:'Comment jouer',story:'Journal de l’implant',settings:'Réglages',daily:'DÉFI DU JOUR',dailyLogin:'RÉCOMPENSE DE CONNEXION',claim:'Réclamer',claimed:'Réclamée',day:'Jour',streak:'Série',wave:'Vague',waves:'vagues',score:'Score',best:'Record',pause:'Pause',resume:'Continuer',menu:'Menu principal',final:'OMEGA — CONSCIENCE PATHOGÈNE',boss:'BOSS FINAL',loginReward:'Récompense de connexion',locked:'Débloqué à la vague',continueStory:'Continuer',close:'Fermer'},
  es:{mission:'Nueva misión',continue:'Continuar',sector:'Sector del implante',lab:'Laboratorio',achievements:'Logros',howto:'Cómo jugar',story:'Diario del implante',settings:'Ajustes',daily:'DESAFÍO DEL DÍA',dailyLogin:'RECOMPENSA DIARIA',claim:'Reclamar',claimed:'Reclamada',day:'Día',streak:'Racha',wave:'Oleada',waves:'oleadas',score:'Puntuación',best:'Récord',pause:'Pausa',resume:'Continuar',menu:'Menú principal',final:'OMEGA — CONCIENCIA PATÓGENA',boss:'JEFE FINAL',loginReward:'Recompensa de acceso',locked:'Desbloqueado en la oleada',continueStory:'Continuar',close:'Cerrar'}
};
let CURRENT_LANG = detectPhoneLanguage();
function t(key){ return (I18N[CURRENT_LANG] && I18N[CURRENT_LANG][key]) || I18N.en[key] || key; }

// ===================== COMPLETE LOCALIZATION V6 =====================
// All player-facing game text is localized for Romanian, Italian, English, French and Spanish.
const UI_TEXT = {
  ro:{
    splash:'Inițializare circuit memristor…', towerDefense:'APĂRARE CU TURNURI', brandSub:'TOWER DEFENSE', defenseCommand:'COMANDAMENT APĂRARE', coreStatus:'STARE NUCLEU: ONLINE', bestWave:'CEL MAI BUN VAL', startDefense:'PORNEȘTE APĂRAREA', newCampaign:'CAMPANIE NOUĂ', continue:'CONTINUĂ', wave:'VAL', tacticalMap:'HARTĂ TACTICĂ', uniqueSectors:'9 SECTOARE UNICE', arsenal:'ARSENAL', upgrades:'UPGRADE-URI', rankings:'CLASAMENT', achievements:'REALIZĂRI', tactics:'TACTICI', howToPlay:'CUM SE JOACĂ', chronicle:'CRONICĂ', chapters:'8 CAPITOLE', system:'SISTEM', settings:'SETĂRI', omegaProtocol:'PROTOCOL OMEGA', tacticalMaps:'HĂRȚI TACTICE', selectSector:'SELECTEAZĂ SECTORUL DE APĂRARE', maps:'HĂRȚI', objective:'Obiectiv', objectiveText:'Oprește toxinele și agenții patogeni înainte să ajungă la Nucleul Bio-Electronic. Dacă Integritatea ajunge la 0, misiunea se încheie.', placement:'Plasare noduri memristor', placementText:'Alege un tip de nod din bara de jos, apoi apasă pe un slot liber de pe circuit pentru a-l construi. Fiecare nod costă Energie bio-electrică.', upgradeSell:'Upgrade și vânzare', upgradeSellText:'Apasă pe un nod plasat pentru a-l îmbunătăți sau a-l vinde pentru 60% din costul investit.', wavesTitle:'Valuri', wavesText:'Fiecare val aduce amenințări tot mai puternice. La fiecare 5 valuri apare un Nucleu Infecțios cu escortă. Campania continuă până la valul 200. Valul 200 este OMEGA, Boss-ul Final cu rezistență adaptivă și ferestre de vulnerabilitate. După 200 începe Endless.', nanoTitle:'Nanoparticule', nanoText:'Câștigi Nanoparticule din bonusuri de val și realizări. Folosește-le în Laborator pentru upgrade-uri permanente în toate misiunile.', speedTitle:'Viteză joc', speedText:'Folosește butonul de viteză 1x/2x/3x în timpul jocului pentru a accelera valurile.', implantJournal:'Jurnalul implantului', laboratory:'Laborator', sound:'Sunet', vibrations:'Vibrații', newWaveNotifications:'Notificări val nou', resetProgress:'Resetează tot progresul', saveNote:'Progresul se salvează automat local pe dispozitiv.', integrity:'INTEGRITATE', liveDefense:'APĂRARE LIVE', omega:'OMEGA', advertisement:'PUBLICITATE', node:'Nod', upgrade:'Upgrade', fusion:'Fuziune', sell:'Vinde', close:'Închide', maxLevel:'Nivel maxim', fusionUnavailable:'Fuziune indisponibilă', fusionWith:'Fuziune cu', buff:'Amplificare', range:'Rază', damage:'Dmg', rate:'Rată', level:'Nv.', active:'ACTIV', combo:'COMBO', protocolOverdrive:'Protocol Overdrive', waveButton:'Val', pause:'Pauză', resume:'Continuă', mainMenu:'Meniu principal', exitMenu:'Ieși în meniu', archive:'ARHIVĂ', victoryStable:'IMPLANT STABILIZAT', implantCompromised:'IMPLANT COMPROMIS', waveReached:'Val atins', threatsNeutralized:'Amenințări neutralizate', score:'Scor', nanoWon:'Nanoparticule câștigate', newRecord:'Record nou!', continueEndless:'Continuă Endless', retry:'Încearcă din nou', lockedSector:'Sector blocat. Avansează în campanie.', online:'ONLINE', locked:'BLOCAT', waveShort:'VAL', confirmTitle:'Confirmare', yes:'Da', no:'Nu', resetConfirm:'Sigur vrei să resetezi tot progresul (nanoparticule, upgrade-uri, realizări)? Această acțiune nu poate fi anulată.', progressReset:'Progres resetat.', overdriveNeed:'Overdrive necesită 100% energie de rețea.', dailyCompleted:'Provocare completată!', fusionSuccess:'FUZIUNE REUȘITĂ', omegaExposed:'OMEGA EXPUȘ — concentrează focul acum!', omegaTactic:'OMEGA: schimbă tipurile de noduri — rezistența adaptivă crește.', overdriveActive:'OVERDRIVE ACTIV — rețeaua memristivă este supraîncărcată!', waiting:'Circuitul așteaptă comenzi. Revino pentru valul următor!', waveCompleted:'Val finalizat!', omegaDefeated:'OMEGA ELIMINAT — PROTOCOLUL FINAL A FOST DEBLOCAT.', director:'DIRECTOR', adaptationInsulation:'Izolație Bioelectrică', adaptationThermal:'Adaptare Termică', adaptationDispersion:'Dispersie de Roi', adaptationBalanced:'Presiune Adaptivă'
  },
  it:{
    splash:'Inizializzazione del circuito memristivo…', towerDefense:'TOWER DEFENSE', brandSub:'TOWER DEFENSE', defenseCommand:'COMANDO DIFESA', coreStatus:'STATO NUCLEO: ONLINE', bestWave:'MIGLIOR ONDATA', startDefense:'AVVIA DIFESA', newCampaign:'NUOVA CAMPAGNA', continue:'CONTINUA', wave:'ONDATA', tacticalMap:'MAPPA TATTICA', uniqueSectors:'9 SETTORI UNICI', arsenal:'ARSENALE', upgrades:'POTENZIAMENTI', rankings:'CLASSIFICA', achievements:'OBIETTIVI', tactics:'TATTICHE', howToPlay:'COME SI GIOCA', chronicle:'CRONACA', chapters:'8 CAPITOLI', system:'SISTEMA', settings:'IMPOSTAZIONI', omegaProtocol:'PROTOCOLLO OMEGA', tacticalMaps:'MAPPE TATTICHE', selectSector:'SELEZIONA IL SETTORE DI DIFESA', maps:'MAPPE', objective:'Obiettivo', objectiveText:'Ferma tossine e agenti patogeni prima che raggiungano il Nucleo Bio-Elettronico. Se l’Integrità arriva a 0, la missione termina.', placement:'Posizionamento dei memristori', placementText:'Scegli un tipo di nodo dalla barra inferiore, poi tocca uno slot libero del circuito per costruirlo. Ogni nodo costa Energia bioelettrica.', upgradeSell:'Potenziamento e vendita', upgradeSellText:'Tocca un nodo posizionato per potenziarlo o venderlo al 60% del costo investito.', wavesTitle:'Ondate', wavesText:'Ogni ondata porta minacce sempre più forti. Ogni 5 ondate compare un Nucleo Infettivo con scorta. La campagna continua fino all’ondata 200. L’ondata 200 è OMEGA, il Boss Finale con resistenza adattiva e finestre di vulnerabilità. Dopo 200 inizia Endless.', nanoTitle:'Nanoparticelle', nanoText:'Ottieni Nanoparticelle dai bonus delle ondate e dagli obiettivi. Usale nel Laboratorio per potenziamenti permanenti in tutte le missioni.', speedTitle:'Velocità di gioco', speedText:'Usa il pulsante 1x/2x/3x durante il gioco per accelerare le ondate.', implantJournal:'Diario dell’impianto', laboratory:'Laboratorio', sound:'Suono', vibrations:'Vibrazioni', newWaveNotifications:'Notifiche nuova ondata', resetProgress:'Azzera tutti i progressi', saveNote:'I progressi vengono salvati automaticamente sul dispositivo.', integrity:'INTEGRITÀ', liveDefense:'DIFESA LIVE', omega:'OMEGA', advertisement:'PUBBLICITÀ', node:'Nodo', upgrade:'Potenziamento', fusion:'Fusione', sell:'Vendi', close:'Chiudi', maxLevel:'Livello massimo', fusionUnavailable:'Fusione non disponibile', fusionWith:'Fusione con', buff:'Bonus', range:'Portata', damage:'Danni', rate:'Cadenza', level:'Lv.', active:'ATTIVO', combo:'COMBO', protocolOverdrive:'Protocollo Overdrive', waveButton:'Ondata', pause:'Pausa', resume:'Continua', mainMenu:'Menu principale', exitMenu:'Esci al menu', archive:'ARCHIVIO', victoryStable:'IMPIANTO STABILIZZATO', implantCompromised:'IMPIANTO COMPROMESSO', waveReached:'Ondata raggiunta', threatsNeutralized:'Minacce neutralizzate', score:'Punteggio', nanoWon:'Nanoparticelle ottenute', newRecord:'Nuovo record!', continueEndless:'Continua Endless', retry:'Riprova', lockedSector:'Settore bloccato. Avanza nella campagna.', online:'ONLINE', locked:'BLOCCATO', waveShort:'ONDATA', confirmTitle:'Conferma', yes:'Sì', no:'No', resetConfirm:'Vuoi davvero azzerare tutti i progressi (nanoparticelle, potenziamenti, obiettivi)? Questa azione non può essere annullata.', progressReset:'Progressi azzerati.', overdriveNeed:'Overdrive richiede il 100% di energia di rete.', dailyCompleted:'Sfida completata!', fusionSuccess:'FUSIONE RIUSCITA', omegaExposed:'OMEGA ESPOSTO — concentra il fuoco ora!', omegaTactic:'OMEGA: cambia i tipi di nodo — la resistenza adattiva aumenta.', overdriveActive:'OVERDRIVE ATTIVO — la rete memristiva è sovraccarica!', waiting:'Il circuito attende comandi. Torna per la prossima ondata!', waveCompleted:'Ondata completata!', omegaDefeated:'OMEGA ELIMINATO — PROTOCOLLO FINALE SBLOCCATO.', director:'DIRETTORE', adaptationInsulation:'Isolamento Bioelettrico', adaptationThermal:'Adattamento Termico', adaptationDispersion:'Dispersione dello Sciame', adaptationBalanced:'Pressione Adattiva'
  },
  en:{
    splash:'Initializing memristor circuit…', towerDefense:'TOWER DEFENSE', brandSub:'TOWER DEFENSE', defenseCommand:'DEFENSE COMMAND', coreStatus:'CORE STATUS: ONLINE', bestWave:'BEST WAVE', startDefense:'START DEFENSE', newCampaign:'NEW CAMPAIGN', continue:'CONTINUE', wave:'WAVE', tacticalMap:'TACTICAL MAP', uniqueSectors:'9 UNIQUE SECTORS', arsenal:'ARSENAL', upgrades:'UPGRADES', rankings:'RANKINGS', achievements:'ACHIEVEMENTS', tactics:'TACTICS', howToPlay:'HOW TO PLAY', chronicle:'CHRONICLE', chapters:'8 CHAPTERS', system:'SYSTEM', settings:'SETTINGS', omegaProtocol:'OMEGA PROTOCOL', tacticalMaps:'TACTICAL MAPS', selectSector:'SELECT DEFENSE SECTOR', maps:'MAPS', objective:'Objective', objectiveText:'Stop toxins and pathogens before they reach the Bio-Electronic Core. If Integrity reaches 0, the mission ends.', placement:'Memristor node placement', placementText:'Choose a node type from the bottom bar, then tap an empty circuit slot to build it. Each node costs bio-electric Energy.', upgradeSell:'Upgrade & sell', upgradeSellText:'Tap a placed node to upgrade it or sell it for 60% of its invested cost.', wavesTitle:'Waves', wavesText:'Each wave brings stronger threats. Every 5 waves, an Infectious Core appears with an escort. The campaign continues to Wave 200. Wave 200 is OMEGA, the Final Boss with adaptive resistance and vulnerability windows. Endless begins after 200.', nanoTitle:'Nanoparticles', nanoText:'Earn Nanoparticles from wave bonuses and achievements. Spend them in the Laboratory for permanent upgrades across all missions.', speedTitle:'Game speed', speedText:'Use the 1x/2x/3x speed button during combat to accelerate waves.', implantJournal:'Implant Journal', laboratory:'Laboratory', sound:'Sound', vibrations:'Vibrations', newWaveNotifications:'New wave notifications', resetProgress:'Reset all progress', saveNote:'Progress is saved automatically on the device.', integrity:'INTEGRITY', liveDefense:'LIVE DEFENSE', omega:'OMEGA', advertisement:'ADVERTISEMENT', node:'Node', upgrade:'Upgrade', fusion:'Fusion', sell:'Sell', close:'Close', maxLevel:'Max level', fusionUnavailable:'Fusion unavailable', fusionWith:'Fusion with', buff:'Buff', range:'Range', damage:'Dmg', rate:'Rate', level:'Lv.', active:'ACTIVE', combo:'COMBO', protocolOverdrive:'Protocol Overdrive', waveButton:'Wave', pause:'Pause', resume:'Resume', mainMenu:'Main Menu', exitMenu:'Exit to menu', archive:'ARCHIVE', victoryStable:'IMPLANT STABILIZED', implantCompromised:'IMPLANT COMPROMISED', waveReached:'Wave reached', threatsNeutralized:'Threats neutralized', score:'Score', nanoWon:'Nanoparticles earned', newRecord:'New record!', continueEndless:'Continue Endless', retry:'Retry', lockedSector:'Sector locked. Advance through the campaign.', online:'ONLINE', locked:'LOCKED', waveShort:'WAVE', confirmTitle:'Confirmation', yes:'Yes', no:'No', resetConfirm:'Are you sure you want to reset all progress (nanoparticles, upgrades, achievements)? This action cannot be undone.', progressReset:'Progress reset.', overdriveNeed:'Overdrive requires 100% network energy.', dailyCompleted:'Challenge completed!', fusionSuccess:'FUSION SUCCESSFUL', omegaExposed:'OMEGA EXPOSED — focus fire now!', omegaTactic:'OMEGA: rotate node types — adaptive resistance is increasing.', overdriveActive:'OVERDRIVE ACTIVE — the memristive network is overloaded!', waiting:'The circuit is waiting for commands. Return for the next wave!', waveCompleted:'Wave completed!', omegaDefeated:'OMEGA DEFEATED — FINAL PROTOCOL UNLOCKED.', director:'DIRECTOR', adaptationInsulation:'Bioelectric Insulation', adaptationThermal:'Thermal Adaptation', adaptationDispersion:'Swarm Dispersion', adaptationBalanced:'Adaptive Pressure'
  },
  fr:{
    splash:'Initialisation du circuit memristif…', towerDefense:'DÉFENSE DE TOURS', brandSub:'TOWER DEFENSE', defenseCommand:'COMMANDEMENT DÉFENSE', coreStatus:'ÉTAT DU NOYAU : EN LIGNE', bestWave:'MEILLEURE VAGUE', startDefense:'LANCER LA DÉFENSE', newCampaign:'NOUVELLE CAMPAGNE', continue:'CONTINUER', wave:'VAGUE', tacticalMap:'CARTE TACTIQUE', uniqueSectors:'9 SECTEURS UNIQUES', arsenal:'ARSENAL', upgrades:'AMÉLIORATIONS', rankings:'CLASSEMENT', achievements:'SUCCÈS', tactics:'TACTIQUES', howToPlay:'COMMENT JOUER', chronicle:'CHRONIQUE', chapters:'8 CHAPITRES', system:'SYSTÈME', settings:'RÉGLAGES', omegaProtocol:'PROTOCOLE OMEGA', tacticalMaps:'CARTES TACTIQUES', selectSector:'SÉLECTIONNEZ LE SECTEUR DE DÉFENSE', maps:'CARTES', objective:'Objectif', objectiveText:'Arrêtez les toxines et les agents pathogènes avant qu’ils n’atteignent le Noyau Bio-Électronique. Si l’Intégrité atteint 0, la mission se termine.', placement:'Placement des nœuds memristifs', placementText:'Choisissez un type de nœud dans la barre inférieure, puis touchez un emplacement libre du circuit pour le construire. Chaque nœud coûte de l’Énergie bioélectrique.', upgradeSell:'Amélioration et vente', upgradeSellText:'Touchez un nœud placé pour l’améliorer ou le vendre pour 60 % de son coût investi.', wavesTitle:'Vagues', wavesText:'Chaque vague apporte des menaces plus puissantes. Toutes les 5 vagues, un Noyau Infectieux apparaît avec une escorte. La campagne continue jusqu’à la vague 200. La vague 200 est OMEGA, le Boss Final avec résistance adaptative et fenêtres de vulnérabilité. Endless commence après 200.', nanoTitle:'Nanoparticules', nanoText:'Gagnez des Nanoparticules grâce aux bonus de vagues et aux succès. Utilisez-les au Laboratoire pour des améliorations permanentes dans toutes les missions.', speedTitle:'Vitesse du jeu', speedText:'Utilisez le bouton 1x/2x/3x pendant le combat pour accélérer les vagues.', implantJournal:'Journal de l’implant', laboratory:'Laboratoire', sound:'Son', vibrations:'Vibrations', newWaveNotifications:'Notifications de nouvelle vague', resetProgress:'Réinitialiser toute la progression', saveNote:'La progression est enregistrée automatiquement sur l’appareil.', integrity:'INTÉGRITÉ', liveDefense:'DÉFENSE EN DIRECT', omega:'OMEGA', advertisement:'PUBLICITÉ', node:'Nœud', upgrade:'Améliorer', fusion:'Fusion', sell:'Vendre', close:'Fermer', maxLevel:'Niveau max', fusionUnavailable:'Fusion indisponible', fusionWith:'Fusion avec', buff:'Bonus', range:'Portée', damage:'Dégâts', rate:'Cadence', level:'Nv.', active:'ACTIF', combo:'COMBO', protocolOverdrive:'Protocole Overdrive', waveButton:'Vague', pause:'Pause', resume:'Continuer', mainMenu:'Menu principal', exitMenu:'Quitter vers le menu', archive:'ARCHIVES', victoryStable:'IMPLANT STABILISÉ', implantCompromised:'IMPLANT COMPROMIS', waveReached:'Vague atteinte', threatsNeutralized:'Menaces neutralisées', score:'Score', nanoWon:'Nanoparticules gagnées', newRecord:'Nouveau record !', continueEndless:'Continuer en Endless', retry:'Réessayer', lockedSector:'Secteur verrouillé. Progressez dans la campagne.', online:'EN LIGNE', locked:'VERROUILLÉ', waveShort:'VAGUE', confirmTitle:'Confirmation', yes:'Oui', no:'Non', resetConfirm:'Voulez-vous vraiment réinitialiser toute la progression (nanoparticules, améliorations, succès) ? Cette action est irréversible.', progressReset:'Progression réinitialisée.', overdriveNeed:'Overdrive nécessite 100 % d’énergie réseau.', dailyCompleted:'Défi terminé !', fusionSuccess:'FUSION RÉUSSIE', omegaExposed:'OMEGA EXPOSÉ — concentrez le feu maintenant !', omegaTactic:'OMEGA : alternez les types de nœuds — la résistance adaptative augmente.', overdriveActive:'OVERDRIVE ACTIF — le réseau memristif est en surcharge !', waiting:'Le circuit attend des commandes. Revenez pour la prochaine vague !', waveCompleted:'Vague terminée !', omegaDefeated:'OMEGA ÉLIMINÉ — PROTOCOLE FINAL DÉBLOQUÉ.', director:'DIRECTEUR', adaptationInsulation:'Isolation Bioélectrique', adaptationThermal:'Adaptation Thermique', adaptationDispersion:'Dispersion d’Essaim', adaptationBalanced:'Pression Adaptative'
  },
  es:{
    splash:'Inicializando circuito memristivo…', towerDefense:'DEFENSA DE TORRES', brandSub:'TOWER DEFENSE', defenseCommand:'COMANDO DE DEFENSA', coreStatus:'ESTADO DEL NÚCLEO: ONLINE', bestWave:'MEJOR OLEADA', startDefense:'INICIAR DEFENSA', newCampaign:'NUEVA CAMPAÑA', continue:'CONTINUAR', wave:'OLEADA', tacticalMap:'MAPA TÁCTICO', uniqueSectors:'9 SECTORES ÚNICOS', arsenal:'ARSENAL', upgrades:'MEJORAS', rankings:'CLASIFICACIÓN', achievements:'LOGROS', tactics:'TÁCTICAS', howToPlay:'CÓMO JUGAR', chronicle:'CRÓNICA', chapters:'8 CAPÍTULOS', system:'SISTEMA', settings:'AJUSTES', omegaProtocol:'PROTOCOLO OMEGA', tacticalMaps:'MAPAS TÁCTICOS', selectSector:'SELECCIONA EL SECTOR DE DEFENSA', maps:'MAPAS', objective:'Objetivo', objectiveText:'Detén las toxinas y los agentes patógenos antes de que lleguen al Núcleo Bioelectrónico. Si la Integridad llega a 0, la misión termina.', placement:'Colocación de nodos memristivos', placementText:'Elige un tipo de nodo en la barra inferior y toca un espacio libre del circuito para construirlo. Cada nodo cuesta Energía bioeléctrica.', upgradeSell:'Mejora y venta', upgradeSellText:'Toca un nodo colocado para mejorarlo o venderlo por el 60 % de su coste invertido.', wavesTitle:'Oleadas', wavesText:'Cada oleada trae amenazas más fuertes. Cada 5 oleadas aparece un Núcleo Infeccioso con escolta. La campaña continúa hasta la oleada 200. La oleada 200 es OMEGA, el Jefe Final con resistencia adaptativa y ventanas de vulnerabilidad. Endless comienza después de 200.', nanoTitle:'Nanopartículas', nanoText:'Gana Nanopartículas con bonificaciones de oleada y logros. Úsalas en el Laboratorio para mejoras permanentes en todas las misiones.', speedTitle:'Velocidad del juego', speedText:'Usa el botón 1x/2x/3x durante el combate para acelerar las oleadas.', implantJournal:'Diario del implante', laboratory:'Laboratorio', sound:'Sonido', vibrations:'Vibración', newWaveNotifications:'Notificaciones de nueva oleada', resetProgress:'Restablecer todo el progreso', saveNote:'El progreso se guarda automáticamente en el dispositivo.', integrity:'INTEGRIDAD', liveDefense:'DEFENSA EN VIVO', omega:'OMEGA', advertisement:'PUBLICIDAD', node:'Nodo', upgrade:'Mejorar', fusion:'Fusión', sell:'Vender', close:'Cerrar', maxLevel:'Nivel máximo', fusionUnavailable:'Fusión no disponible', fusionWith:'Fusión con', buff:'Bonificación', range:'Alcance', damage:'Daño', rate:'Cadencia', level:'Nv.', active:'ACTIVO', combo:'COMBO', protocolOverdrive:'Protocolo Overdrive', waveButton:'Oleada', pause:'Pausa', resume:'Continuar', mainMenu:'Menú principal', exitMenu:'Salir al menú', archive:'ARCHIVO', victoryStable:'IMPLANTE ESTABILIZADO', implantCompromised:'IMPLANTE COMPROMETIDO', waveReached:'Oleada alcanzada', threatsNeutralized:'Amenazas neutralizadas', score:'Puntuación', nanoWon:'Nanopartículas obtenidas', newRecord:'¡Nuevo récord!', continueEndless:'Continuar Endless', retry:'Reintentar', lockedSector:'Sector bloqueado. Avanza en la campaña.', online:'ONLINE', locked:'BLOQUEADO', waveShort:'OLEADA', confirmTitle:'Confirmación', yes:'Sí', no:'No', resetConfirm:'¿Seguro que quieres restablecer todo el progreso (nanopartículas, mejoras, logros)? Esta acción no se puede deshacer.', progressReset:'Progreso restablecido.', overdriveNeed:'Overdrive requiere el 100 % de energía de red.', dailyCompleted:'¡Desafío completado!', fusionSuccess:'FUSIÓN COMPLETADA', omegaExposed:'OMEGA EXPUESTO — ¡concentra el fuego ahora!', omegaTactic:'OMEGA: cambia los tipos de nodo — aumenta la resistencia adaptativa.', overdriveActive:'OVERDRIVE ACTIVO — ¡la red memristiva está sobrecargada!', waiting:'El circuito espera órdenes. ¡Vuelve para la próxima oleada!', waveCompleted:'¡Oleada completada!', omegaDefeated:'OMEGA DERROTADO — PROTOCOLO FINAL DESBLOQUEADO.', director:'DIRECTOR', adaptationInsulation:'Aislamiento Bioeléctrico', adaptationThermal:'Adaptación Térmica', adaptationDispersion:'Dispersión de Enjambre', adaptationBalanced:'Presión Adaptativa'
  }
};
function ui(key){ return (UI_TEXT[CURRENT_LANG] && UI_TEXT[CURRENT_LANG][key]) || UI_TEXT.en[key] || key; }

const LOCALIZED_NODE_INFO = {
 pulse:{ro:['Memristor Rapid','Comută rezistența rapid — impulsuri dese, dmg mic. Bun contra roiurilor.'],it:['Memristore Rapido','Commuta rapidamente la resistenza: impulsi frequenti, danno ridotto. Efficace contro gli sciami.'],en:['Rapid Memristor','Rapid resistance switching: frequent low-damage pulses. Effective against swarms.'],fr:['Memristor Rapide','Commute rapidement la résistance : impulsions fréquentes à faibles dégâts. Efficace contre les essaims.'],es:['Memristor Rápido','Conmuta la resistencia rápidamente: pulsos frecuentes de poco daño. Eficaz contra enjambres.']},
 cannon:{ro:['Memristor de Putere','Rezistență mare, descărcare puternică. Eficient contra plăcilor fibrotice.'],it:['Memristore di Potenza','Alta resistenza, scarica potente. Efficace contro le placche fibrotiche.'],en:['Power Memristor','High resistance, powerful discharge. Effective against fibrotic plates.'],fr:['Memristor de Puissance','Forte résistance, décharge puissante. Efficace contre les plaques fibreuses.'],es:['Memristor de Potencia','Alta resistencia, descarga potente. Eficaz contra placas fibróticas.']},
 emp:{ro:['Câmp Electromagnetic','Emite un puls EM de arie — lovește tot ce este în rază.'],it:['Campo Elettromagnetico','Emette un impulso EM ad area che colpisce tutto ciò che è a portata.'],en:['Electromagnetic Field','Emits an area EM pulse that hits everything in range.'],fr:['Champ Électromagnétique','Émet une impulsion EM de zone qui frappe tout dans sa portée.'],es:['Campo Electromagnético','Emite un pulso EM de área que golpea todo lo que esté al alcance.']},
 slow:{ro:['Memristor Crio','Răcește circuitul local și încetinește agenții patogeni cu 50% timp de 2s.'],it:['Memristore Criogenico','Raffredda il circuito locale e rallenta i patogeni del 50% per 2 s.'],en:['Cryo Memristor','Cools the local circuit and slows pathogens by 50% for 2s.'],fr:['Memristor Cryo','Refroidit le circuit local et ralentit les agents pathogènes de 50 % pendant 2 s.'],es:['Memristor Criogénico','Enfría el circuito local y ralentiza a los patógenos un 50 % durante 2 s.']},
 laser:{ro:['Fascicul Neural','Fascicul adaptiv care poate sări între 3 amenințări apropiate.'],it:['Fascio Neurale','Raggio adattivo che può rimbalzare tra 3 minacce vicine.'],en:['Neural Beam','Adaptive beam that can chain between 3 nearby threats.'],fr:['Faisceau Neural','Faisceau adaptatif pouvant rebondir entre 3 menaces proches.'],es:['Haz Neural','Rayo adaptativo que puede encadenarse entre 3 amenazas cercanas.']},
 repair:{ro:['Regenerator Tisular','Repară periodic Nucleul Bio-Electronic în timpul asediului.'],it:['Rigeneratore Tissutale','Ripara periodicamente il Nucleo Bio-Elettronico durante l’assedio.'],en:['Tissue Regenerator','Periodically repairs the Bio-Electronic Core during the siege.'],fr:['Régénérateur Tissulaire','Répare périodiquement le Noyau Bio-Électronique pendant le siège.'],es:['Regenerador Tisular','Repara periódicamente el Núcleo Bioelectrónico durante el asedio.']},
 shield:{ro:['Barieră Bioelectrică','Reduce pagubele primite de nucleu. Mai multe bariere se cumulează.'],it:['Barriera Bioelettrica','Riduce i danni subiti dal nucleo. Più barriere si accumulano.'],en:['Bioelectric Barrier','Reduces damage taken by the core. Multiple barriers stack.'],fr:['Barrière Bioélectrique','Réduit les dégâts subis par le noyau. Les barrières se cumulent.'],es:['Barrera Bioeléctrica','Reduce el daño recibido por el núcleo. Varias barreras se acumulan.']},
 drone:{ro:['Nanodronă Sentinel','Unitate autonomă cu reacție rapidă. Prioritizează amenințările rapide și marcate.'],it:['Nanodrone Sentinel','Unità autonoma a reazione rapida. Prioritizza le minacce veloci e marcate.'],en:['Sentinel Nanodrone','Fast-reacting autonomous unit. Prioritizes fast and marked threats.'],fr:['Nanodrone Sentinelle','Unité autonome à réaction rapide. Priorise les menaces rapides et marquées.'],es:['Nanodron Centinela','Unidad autónoma de reacción rápida. Prioriza amenazas rápidas y marcadas.']},
 virus:{ro:['Injector Antivirus','Infectează amenințările: produce daune în timp și slăbește armura biologică.'],it:['Iniettore Antivirus','Infetta le minacce: infligge danni nel tempo e indebolisce l’armatura biologica.'],en:['Antivirus Injector','Infects threats, dealing damage over time and weakening biological armor.'],fr:['Injecteur Antivirus','Infecte les menaces, inflige des dégâts sur la durée et affaiblit l’armure biologique.'],es:['Inyector Antivirus','Infecta amenazas, inflige daño con el tiempo y debilita la armadura biológica.']},
 chrono:{ro:['Nod Temporal','Încetinește ținta și creează o anomalie temporală la impact.'],it:['Nodo Temporale','Rallenta il bersaglio e crea un’anomalia temporale all’impatto.'],en:['Temporal Node','Slows the target and creates a temporal anomaly on impact.'],fr:['Nœud Temporel','Ralentit la cible et crée une anomalie temporelle à l’impact.'],es:['Nodo Temporal','Ralentiza al objetivo y crea una anomalía temporal al impactar.']},
 mine:{ro:['Nanomine Adaptivă','Detectează concentrații de amenințări și declanșează o explozie adaptivă de arie.'],it:['Nanomina Adattiva','Rileva concentrazioni di minacce e attiva un’esplosione adattiva ad area.'],en:['Adaptive Nanomine','Detects threat clusters and triggers an adaptive area explosion.'],fr:['Nanomine Adaptive','Détecte les concentrations de menaces et déclenche une explosion de zone adaptative.'],es:['Nanomina Adaptativa','Detecta concentraciones de amenazas y activa una explosión adaptativa de área.']},
 amp:{ro:['Amplificator Sinaptic','Nu atacă, dar amplifică semnalul nodurilor din rază cu 35% damage.'],it:['Amplificatore Sinaptico','Non attacca, ma aumenta del 35% i danni dei nodi a portata.'],en:['Synaptic Amplifier','Does not attack, but boosts damage from nodes in range by 35%.'],fr:['Amplificateur Synaptique','N’attaque pas, mais augmente de 35 % les dégâts des nœuds à portée.'],es:['Amplificador Sináptico','No ataca, pero aumenta un 35 % el daño de los nodos dentro de su alcance.']},
 superconductive:{ro:['Nod Superconductiv','Fuziune CRIO + NEURAL: lanț electric puternic și îngheț sinaptic.'],it:['Nodo Superconduttivo','Fusione CRIO + NEURALE: potente catena elettrica e congelamento sinaptico.'],en:['Superconductive Node','CRYO + NEURAL fusion: powerful electric chain and synaptic freeze.'],fr:['Nœud Supraconducteur','Fusion CRYO + NEURAL : chaîne électrique puissante et gel synaptique.'],es:['Nodo Superconductor','Fusión CRIO + NEURAL: potente cadena eléctrica y congelación sináptica.']},
 swarmSentinel:{ro:['Swarm Sentinel','Fuziune DRONĂ + EM: țintește rapid și descarcă micro-pulsuri în roiuri.'],it:['Swarm Sentinel','Fusione DRONE + EM: mira rapidamente e scarica microimpulsi negli sciami.'],en:['Swarm Sentinel','DRONE + EM fusion: rapidly targets and discharges micro-pulses into swarms.'],fr:['Sentinelle d’Essaim','Fusion DRONE + EM : cible rapidement et décharge des micro-impulsions dans les essaims.'],es:['Centinela de Enjambre','Fusión DRON + EM: apunta rápido y descarga micropulsos contra los enjambres.']},
 photonicAntibody:{ro:['Anticorp Fotonic','Fuziune ANTIVIRUS + NEURAL: fascicul fotonic care infectează și arde grupuri.'],it:['Anticorpo Fotonico','Fusione ANTIVIRUS + NEURALE: raggio fotonico che infetta e brucia i gruppi.'],en:['Photonic Antibody','ANTIVIRUS + NEURAL fusion: a photonic beam that infects and burns groups.'],fr:['Anticorps Photonique','Fusion ANTIVIRUS + NEURAL : faisceau photonique qui infecte et brûle les groupes.'],es:['Anticuerpo Fotónico','Fusión ANTIVIRUS + NEURAL: rayo fotónico que infecta y quema grupos.']},
 temporalSingularity:{ro:['Singularitate Temporală','Fuziune TEMPORAL + CRIO: creează o zonă de colaps temporal persistentă.'],it:['Singolarità Temporale','Fusione TEMPORALE + CRIO: crea una zona persistente di collasso temporale.'],en:['Temporal Singularity','TEMPORAL + CRYO fusion: creates a persistent temporal collapse zone.'],fr:['Singularité Temporelle','Fusion TEMPORELLE + CRYO : crée une zone persistante d’effondrement temporel.'],es:['Singularidad Temporal','Fusión TEMPORAL + CRIO: crea una zona persistente de colapso temporal.']}
};
function localizeNodeData(){ Object.keys(LOCALIZED_NODE_INFO).forEach(id=>{ if(NODE_TYPES[id]){ const x=LOCALIZED_NODE_INFO[id][CURRENT_LANG]||LOCALIZED_NODE_INFO[id].en; NODE_TYPES[id].name=x[0]; NODE_TYPES[id].desc=x[1]; } }); }

const LOCALIZED_ENEMIES={
 basic:{ro:'Toxină',it:'Tossina',en:'Toxin',fr:'Toxine',es:'Toxina'},fast:{ro:'Radical Liber',it:'Radicale Libero',en:'Free Radical',fr:'Radical Libre',es:'Radical Libre'},tank:{ro:'Placă Fibrotică',it:'Placca Fibrotica',en:'Fibrotic Plate',fr:'Plaque Fibreuse',es:'Placa Fibrótica'},swarm:{ro:'Roi Bacterian',it:'Sciame Batterico',en:'Bacterial Swarm',fr:'Essaim Bactérien',es:'Enjambre Bacteriano'},phase:{ro:'Agent Patogen Camuflat',it:'Agente Patogeno Camuffato',en:'Cloaked Pathogen',fr:'Agent Pathogène Camouflé',es:'Patógeno Camuflado'},healer:{ro:'Celulă Mutantă',it:'Cellula Mutante',en:'Mutant Cell',fr:'Cellule Mutante',es:'Célula Mutante'},splitter:{ro:'Spora Divizibilă',it:'Spora Divisibile',en:'Splitting Spore',fr:'Spore Divisible',es:'Espora Divisible'},leech:{ro:'Parazit Memristiv',it:'Parassita Memristivo',en:'Memristive Parasite',fr:'Parasite Memristif',es:'Parásito Memristivo'},armored:{ro:'Biofilm Blindat',it:'Biofilm Corazzato',en:'Armored Biofilm',fr:'Biofilm Blindé',es:'Biofilm Blindado'},adaptive:{ro:'Patogen Adaptiv',it:'Patogeno Adattivo',en:'Adaptive Pathogen',fr:'Agent Pathogène Adaptatif',es:'Patógeno Adaptativo'},artillery:{ro:'Spora Artilerie',it:'Spora d’Artiglieria',en:'Artillery Spore',fr:'Spore d’Artillerie',es:'Espora de Artillería'},crimsonSentinel:{ro:'Santinela Crimson Core',it:'Sentinella Crimson Core',en:'Crimson Core Sentinel',fr:'Sentinelle Crimson Core',es:'Centinela Crimson Core'},boss:{ro:'Nucleu Infecțios',it:'Nucleo Infettivo',en:'Infectious Core',fr:'Noyau Infectieux',es:'Núcleo Infeccioso'},finalBoss:{ro:'OMEGA — Conștiința Patogenă',it:'OMEGA — Coscienza Patogena',en:'OMEGA — Pathogen Consciousness',fr:'OMEGA — Conscience Pathogène',es:'OMEGA — Conciencia Patógena'}};
function localizeEnemyData(){Object.keys(LOCALIZED_ENEMIES).forEach(id=>{if(ENEMY_TYPES[id])ENEMY_TYPES[id].name=LOCALIZED_ENEMIES[id][CURRENT_LANG]||LOCALIZED_ENEMIES[id].en;});}

const LOCALIZED_MUTATIONS={
 overclock:{ro:['Overclock','Amenințările au +18% viteză, dar recompensele de val sunt +20%.'],it:['Overclock','Le minacce hanno +18% velocità, ma le ricompense delle ondate sono +20%.'],en:['Overclock','Threats move 18% faster, but wave rewards are +20%.'],fr:['Overclock','Les menaces ont +18 % de vitesse, mais les récompenses de vague sont de +20 %.'],es:['Overclock','Las amenazas tienen +18 % de velocidad, pero las recompensas de oleada son +20%.']},
 cryoLeak:{ro:['Fuga Criogenică','Energia inițială este redusă cu 25%, iar fiecare val perfect oferă bonus.'],it:['Fuga Criogenica','L’energia iniziale è ridotta del 25%, ma ogni ondata perfetta offre un bonus.'],en:['Cryo Leak','Starting energy is reduced by 25%, but each perfect wave grants a bonus.'],fr:['Fuite Cryo','L’énergie initiale est réduite de 25 %, mais chaque vague parfaite offre un bonus.'],es:['Fuga Criogénica','La energía inicial se reduce un 25 %, pero cada oleada perfecta otorga una bonificación.']},
 swarmBloom:{ro:['Înflorire de Roi','Valurile fără boss au +35% roiuri. Distrugerea lor crește recompensa.'],it:['Fioritura dello Sciame','Le ondate senza boss hanno +35% di sciami. Distruggerli aumenta la ricompensa.'],en:['Swarm Bloom','Non-boss waves have +35% swarms. Destroying them increases the reward.'],fr:['Floraison d’Essaim','Les vagues sans boss ont +35 % d’essaims. Les détruire augmente la récompense.'],es:['Floración de Enjambre','Las oleadas sin jefe tienen +35 % de enjambres. Destruirlos aumenta la recompensa.']},
 rangedUprising:{ro:['Revolta la Distanță','Unitățile de artilerie apar mai devreme și trag mai des.'],it:['Rivolta a Distanza','Le unità d’artiglieria compaiono prima e sparano più spesso.'],en:['Ranged Uprising','Artillery units appear earlier and fire more often.'],fr:['Soulèvement à Distance','Les unités d’artillerie apparaissent plus tôt et tirent plus souvent.'],es:['Revuelta a Distancia','Las unidades de artillería aparecen antes y disparan con más frecuencia.']},
 lowEnergy:{ro:['Energie Redusă','Costurile nodurilor cresc cu 12%, dar eliminările oferă mai multă energie.'],it:['Energia Ridotta','I costi dei nodi aumentano del 12%, ma le uccisioni forniscono più energia.'],en:['Low Energy','Node costs increase by 12%, but kills grant more energy.'],fr:['Énergie Faible','Le coût des nœuds augmente de 12 %, mais les éliminations rapportent plus d’énergie.'],es:['Energía Baja','Los costes de los nodos aumentan un 12 %, pero las eliminaciones dan más energía.']},
 glassCore:{ro:['Nucleu de Sticlă','Nucleul are -20% integritate, iar toate recompensele sunt +35%.'],it:['Nucleo di Vetro','Il nucleo ha -20% integrità, mentre tutte le ricompense sono +35%.'],en:['Glass Core','The core has -20% integrity, while all rewards are +35%.'],fr:['Noyau de Verre','Le noyau a -20 % d’intégrité, tandis que toutes les récompenses sont de +35 %.'],es:['Núcleo de Cristal','El núcleo tiene -20 % de integridad, pero todas las recompensas son +35 %.']}
};
function localizeMutationData(id){return LOCALIZED_MUTATIONS[id]?.[CURRENT_LANG]||LOCALIZED_MUTATIONS[id]?.en||null;}

const LOCALIZED_SHOP={
 startEnergy:{ro:['Rezerve Bio-Electrice','+25 Energie la începutul fiecărei misiuni'],it:['Riserve Bioelettriche','+25 Energia all’inizio di ogni missione'],en:['Bio-Electric Reserves','+25 Energy at the start of every mission'],fr:['Réserves Bioélectriques','+25 Énergie au début de chaque mission'],es:['Reservas Bioeléctricas','+25 Energía al inicio de cada misión']},
 coreHp:{ro:['Regenerare Tisulară','+20 Integritate maximă pentru Nucleu'],it:['Rigenerazione Tissutale','+20 Integrità massima del Nucleo'],en:['Tissue Regeneration','+20 max Core Integrity'],fr:['Régénération Tissulaire','+20 Intégrité maximale du Noyau'],es:['Regeneración Tisular','+20 Integridad máxima del Núcleo']},
 nodeDiscount:{ro:['Eficiență Memristor','-3% cost construcție noduri'],it:['Efficienza Memristiva','-3% costo di costruzione dei nodi'],en:['Memristor Efficiency','-3% node construction cost'],fr:['Efficacité Memristive','-3 % au coût de construction des nœuds'],es:['Eficiencia Memristiva','-3 % al coste de construcción de nodos']},
 globalDamage:{ro:['Protocol Ofensiv','+4% damage global pentru toate nodurile'],it:['Protocollo Offensivo','+4% danni globali per tutti i nodi'],en:['Offensive Protocol','+4% global damage for all nodes'],fr:['Protocole Offensif','+4 % de dégâts globaux pour tous les nœuds'],es:['Protocolo Ofensivo','+4 % de daño global para todos los nodos']},
 crystalGain:{ro:['Extractor Nanoparticule','+10% nanoparticule câștigate per misiune'],it:['Estrattore di Nanoparticelle','+10% nanoparticelle ottenute per missione'],en:['Nanoparticle Extractor','+10% Nanoparticles earned per mission'],fr:['Extracteur de Nanoparticules','+10 % de nanoparticules gagnées par mission'],es:['Extractor de Nanopartículas','+10 % de nanopartículas obtenidas por misión']},
 critChance:{ro:['Sisteme de Țintire','+3% șansă de lovitură critică (x2 dmg)'],it:['Sistemi di Puntamento','+3% probabilità di colpo critico (x2 danni)'],en:['Targeting Systems','+3% critical hit chance (x2 dmg)'],fr:['Systèmes de Visée','+3 % de chance de coup critique (x2 dégâts)'],es:['Sistemas de Apuntado','+3 % de probabilidad de crítico (x2 daño)']}
};
const LOCALIZED_ACH={
 first_node:{ro:['Primul Circuit','Construiește primul nod memristor'],it:['Primo Circuito','Costruisci il primo nodo memristivo'],en:['First Circuit','Build your first memristor node'],fr:['Premier Circuit','Construisez votre premier nœud memristif'],es:['Primer Circuito','Construye tu primer nodo memristivo']},wave5:{ro:['Sub Asediu','Supraviețuiește valului 5'],it:['Sotto Assedio','Sopravvivi all’ondata 5'],en:['Under Siege','Survive Wave 5'],fr:['Sous Siège','Survivez à la vague 5'],es:['Bajo Asedio','Sobrevive a la oleada 5']},wave10:{ro:['Rezistență','Supraviețuiește valului 10'],it:['Resistenza','Sopravvivi all’ondata 10'],en:['Resistance','Survive Wave 10'],fr:['Résistance','Survivez à la vague 10'],es:['Resistencia','Sobrevive a la oleada 10']},wave20:{ro:['Fortăreață Tisulară','Supraviețuiește valului 20'],it:['Fortezza Tissutale','Sopravvivi all’ondata 20'],en:['Tissue Fortress','Survive Wave 20'],fr:['Forteresse Tissulaire','Survivez à la vague 20'],es:['Fortaleza Tisular','Sobrevive a la oleada 20']},wave30:{ro:['Implant Stabilizat','Ajunge la valul 50'],it:['Impianto Stabilizzato','Raggiungi l’ondata 50'],en:['Stabilized Implant','Reach Wave 50'],fr:['Implant Stabilisé','Atteignez la vague 50'],es:['Implante Estabilizado','Alcanza la oleada 50']},endless10:{ro:['Regenerare Infinită','Supraviețuiește 10 valuri în modul Endless'],it:['Rigenerazione Infinita','Sopravvivi a 10 ondate in modalità Endless'],en:['Infinite Regeneration','Survive 10 waves in Endless mode'],fr:['Régénération Infinie','Survivez à 10 vagues en mode Endless'],es:['Regeneración Infinita','Sobrevive 10 oleadas en modo Endless']},kills100:{ro:['Sistem Imunitar','Neutralizează 100 de amenințări în total'],it:['Sistema Immunitario','Neutralizza 100 minacce in totale'],en:['Immune System','Neutralize 100 threats in total'],fr:['Système Immunitaire','Neutralisez 100 menaces au total'],es:['Sistema Inmunitario','Neutraliza 100 amenazas en total']},kills1000:{ro:['Imunitate Totală','Neutralizează 1000 de amenințări în total'],it:['Immunità Totale','Neutralizza 1000 minacce in totale'],en:['Total Immunity','Neutralize 1000 threats in total'],fr:['Immunité Totale','Neutralisez 1000 menaces au total'],es:['Inmunidad Total','Neutraliza 1000 amenazas en total']},emp5:{ro:['Maestru EM','Construiește 5 Câmpuri Electromagnetice într-o misiune'],it:['Maestro EM','Costruisci 5 Campi Elettromagnetici in una missione'],en:['EM Master','Build 5 Electromagnetic Fields in one mission'],fr:['Maître EM','Construisez 5 Champs Électromagnétiques en une mission'],es:['Maestro EM','Construye 5 Campos Electromagnéticos en una misión']},noDamageWave:{ro:['Țesut Intact','Termină un val fără să pierzi Integritate'],it:['Tessuto Intatto','Completa un’ondata senza perdere Integrità'],en:['Intact Tissue','Finish a wave without losing Integrity'],fr:['Tissu Intact','Terminez une vague sans perdre d’Intégrité'],es:['Tejido Intacto','Completa una oleada sin perder Integridad']},richRun:{ro:['Rezervă Bio-Electrică','Acumulează 3000 Energie într-o singură misiune'],it:['Riserva Bioelettrica','Accumula 3000 Energia in una sola missione'],en:['Bio-Electric Reserve','Accumulate 3000 Energy in one mission'],fr:['Réserve Bioélectrique','Accumulez 3000 Énergie en une seule mission'],es:['Reserva Bioeléctrica','Acumula 3000 Energía en una sola misión']},allNodes:{ro:['Circuit Complet','Construiește toate cele 12 tipuri de noduri într-o misiune'],it:['Circuito Completo','Costruisci tutti i 12 tipi di nodo in una missione'],en:['Complete Circuit','Build all 12 node types in one mission'],fr:['Circuit Complet','Construisez les 12 types de nœuds en une mission'],es:['Circuito Completo','Construye los 12 tipos de nodo en una misión']},runs20:{ro:['Veteran de Laborator','Joacă 20 de misiuni'],it:['Veterano del Laboratorio','Gioca 20 missioni'],en:['Lab Veteran','Play 20 missions'],fr:['Vétéran du Laboratoire','Jouez 20 missions'],es:['Veterano del Laboratorio','Juega 20 misiones']},laserMaster:{ro:['Rețea Neurală','Construiește 3 Fascicule Neurale într-o misiune'],it:['Rete Neurale','Costruisci 3 Fasci Neurali in una missione'],en:['Neural Network','Build 3 Neural Beams in one mission'],fr:['Réseau Neural','Construisez 3 Faisceaux Neuraux en une mission'],es:['Red Neural','Construye 3 Haces Neurales en una misión']},overdrive:{ro:['Supraîncărcare','Activează Protocolul Overdrive'],it:['Sovraccarico','Attiva il Protocollo Overdrive'],en:['Overload','Activate Overdrive Protocol'],fr:['Surcharge','Activez le Protocole Overdrive'],es:['Sobrecarga','Activa el Protocolo Overdrive']},bossSlayer:{ro:['Vânător de Nuclee Infecțioase','Elimină 10 boss-uri în total'],it:['Cacciatore di Nuclei Infettivi','Elimina 10 boss in totale'],en:['Infectious Core Slayer','Defeat 10 bosses in total'],fr:['Tueur de Noyaux Infectieux','Éliminez 10 boss au total'],es:['Cazador de Núcleos Infecciosos','Derrota 10 jefes en total']}
};
function localizeCollections(){
  localizeNodeData(); localizeEnemyData();
  Object.keys(LOCALIZED_SHOP).forEach(id=>{const x=LOCALIZED_SHOP[id][CURRENT_LANG]||LOCALIZED_SHOP[id].en; const item=SHOP_ITEMS.find(v=>v.id===id); if(item){item.name=x[0];item.desc=x[1];}});
  Object.keys(LOCALIZED_ACH).forEach(id=>{const x=LOCALIZED_ACH[id][CURRENT_LANG]||LOCALIZED_ACH[id].en; const a=ACHIEVEMENTS.find(v=>v.id===id); if(a){a.name=x[0];a.desc=x[1];}});
}


function localizeAdaptation(id){ const map={insulation:'adaptationInsulation',thermal:'adaptationThermal',dispersion:'adaptationDispersion',balanced:'adaptationBalanced'}; return ui(map[id]||'adaptationBalanced'); }

const DAILY_MUTATIONS = [
  {id:'overclock', name:'Overclock', icon:'⚡', desc:'Amenințările au +18% viteză, dar recompensele de val sunt +20%.', speed:1.18, rewardMult:1.20},
  {id:'cryoLeak', name:'Cryo Leak', icon:'❄️', desc:'Energia inițială este redusă cu 25%, iar fiecare val perfect oferă bonus.', startEnergyMult:.75, perfectBonus:8},
  {id:'swarmBloom', name:'Swarm Bloom', icon:'🧬', desc:'Valurile non-boss au +35% roiuri. Distrugerea lor crește recompensa.', swarmMult:1.35, rewardMult:1.12},
  {id:'rangedUprising', name:'Ranged Uprising', icon:'🎯', desc:'Unitățile de artilerie apar mai devreme și trag mai des.', rangedEarly:true, shootRateMult:.82},
  {id:'lowEnergy', name:'Low Energy', icon:'🔋', desc:'Costurile nodurilor cresc cu 12%, dar kill-urile oferă mai multă energie.', nodeCostMult:.12, killEnergy:1},
  {id:'glassCore', name:'Glass Core', icon:'💎', desc:'Nucleul are -20% integritate, iar toate recompensele sunt +35%.', coreMult:.80, rewardMult:1.35}
];
function getDailyChallenge(date = new Date()) {
  const key = dailyDateKey(date), seed = dailySeed(key);
  const mapId = MAP_ORDER[seed % MAP_ORDER.length];
  const mutation = DAILY_MUTATIONS[(seed >>> 3) % DAILY_MUTATIONS.length];
  const target = 10 + ((seed >>> 7) % 6); // 10–15 valuri
  return {
    key, seed, mapId, target,
    mutationId: mutation.id, mutation: mutation.name, icon: mutation.icon,
    desc: (localizeMutationData(mutation.id)?.[1] || mutation.desc),
    reward: 35 + ((seed >>> 11) % 26),
    mutationData: mutation
  };
}

const NODE_TYPES = {
  pulse: {
    id: 'pulse', name: 'Memristor Rapid', icon: '🔹', color: '#00d4aa',
    cost: 45, damage: 9, range: 78, rate: 0.55, splash: 0, slow: 0,
    projectileSpeed: 480,
    desc: 'Comută rezistența rapid — impulsuri dese, dmg mic. Bun contra roiurilor.'
  },
  cannon: {
    id: 'cannon', name: 'Memristor de Putere', icon: '🔷', color: '#3b82f6',
    cost: 110, damage: 38, range: 95, rate: 1.3, splash: 0, slow: 0,
    projectileSpeed: 380,
    desc: 'Rezistență mare, descărcare puternică. Eficient contra plăcilor fibrotice.'
  },
  emp: {
    id: 'emp', name: 'Câmp Electromagnetic', icon: '🟣', color: '#a855f7',
    cost: 145, damage: 20, range: 82, rate: 1.7, splash: 65, slow: 0,
    projectileSpeed: 0,
    desc: 'Emite un puls EM de arie (ca reader-ul NFC) — lovește tot ce e în rază.'
  },
  slow: {
    id: 'slow', name: 'Memristor Crio', icon: '🔵', color: '#38bdf8',
    cost: 85, damage: 3, range: 80, rate: 0.9, splash: 0, slow: 0.5,
    projectileSpeed: 500,
    desc: 'Răcește circuitul local — încetinește agenții patogeni cu 50% timp de 2s.'
  },
  laser: {
    id: 'laser', name: 'Fascicul Neural', icon: '🔺', color: '#fb7185',
    cost: 165, damage: 24, range: 112, rate: 0.75, splash: 0, slow: 0, projectileSpeed: 760, chain: 2,
    desc: 'Fascicul adaptiv care poate sări între 3 amenințări apropiate.'
  },
  repair: {
    id: 'repair', name: 'Regenerator Tisular', icon: '💚', color: '#34d399',
    cost: 175, damage: 0, range: 0, rate: 3.2, splash: 0, slow: 0, projectileSpeed: 0, heal: 6,
    desc: 'Repară periodic Nucleul Bio-Electronic în timpul asediului.'
  },
  shield: {
    id: 'shield', name: 'Barieră Bioelectrică', icon: '🛡️', color: '#60a5fa',
    cost: 210, damage: 0, range: 120, rate: 0, splash: 0, slow: 0, projectileSpeed: 0, shield: 0.16,
    desc: 'Reduce pagubele primite de nucleu. Mai multe bariere se cumulează.'
  },
  drone: {
    id: 'drone', name: 'Nanodronă Sentinel', icon: '🤖', color: '#22c55e',
    cost: 230, damage: 18, range: 145, rate: 0.42, splash: 0, slow: 0, projectileSpeed: 620, drone: true,
    desc: 'Unitate autonomă cu reacție rapidă. Prioritizează amenințările rapide și marcate.'
  },
  virus: {
    id: 'virus', name: 'Injector Antivirus', icon: '🧬', color: '#e879f9',
    cost: 260, damage: 12, range: 105, rate: 1.6, splash: 0, slow: 0, projectileSpeed: 520, infect: true,
    desc: 'Infectează amenințările: produce daune în timp și slăbește armura biologică.'
  },
  chrono: {
    id: 'chrono', name: 'Nod Temporal', icon: '⏳', color: '#67e8f9',
    cost: 285, damage: 14, range: 125, rate: 1.15, splash: 0, slow: 0.28, projectileSpeed: 680, temporal: true,
    desc: 'Tehnologie de control temporal: încetinește ținta și construiește o anomalie de timp la impact.'
  },
  mine: {
    id: 'mine', name: 'Nanomine Adaptivă', icon: '💠', color: '#fbbf24',
    cost: 310, damage: 70, range: 95, rate: 2.8, splash: 58, slow: 0, projectileSpeed: 0, mine: true,
    desc: 'Detectează concentrații de amenințări și declanșează o explozie adaptivă de arie.'
  },

  // ===== V5.0 SYNTHESIS NODES (obținute prin fuziune, nu pot fi construite direct) =====
  superconductive: {
    id: 'superconductive', name: 'Nod Superconductiv', icon: '⚛️', color: '#7dd3fc',
    cost: 0, damage: 34, range: 118, rate: 0.62, splash: 0, slow: 0.34,
    projectileSpeed: 820, chain: 4, fusion: true,
    desc: 'Fuziune CRIO + NEURAL: lanț electric puternic și îngheț sinaptic.'
  },
  swarmSentinel: {
    id: 'swarmSentinel', name: 'Swarm Sentinel', icon: '🛰️', color: '#34d399',
    cost: 0, damage: 28, range: 160, rate: 0.32, splash: 0, slow: 0,
    projectileSpeed: 760, drone: true, fusion: true,
    desc: 'Fuziune DRONĂ + EM: țintește rapid și descarcă micro-pulsuri în roiuri.'
  },
  photonicAntibody: {
    id: 'photonicAntibody', name: 'Anticorp Fotonic', icon: '☀️', color: '#fda4af',
    cost: 0, damage: 46, range: 138, rate: 0.82, splash: 52, slow: 0,
    projectileSpeed: 880, infect: true, fusion: true,
    desc: 'Fuziune ANTIVIRUS + NEURAL: fascicul fotonic care infectează și arde grupuri.'
  },
  temporalSingularity: {
    id: 'temporalSingularity', name: 'Singularitate Temporală', icon: '🌀', color: '#c4b5fd',
    cost: 0, damage: 24, range: 145, rate: 0.72, splash: 64, slow: 0.52,
    projectileSpeed: 700, temporal: true, fusion: true,
    desc: 'Fuziune TEMPORAL + CRIO: creează o zonă de colaps temporal persistentă.'
  },
  amp: {
    id: 'amp', name: 'Amplificator Sinaptic', icon: '🟡', color: '#fbbf24',
    cost: 190, damage: 0, range: 105, rate: 0, splash: 0, slow: 0,
    projectileSpeed: 0, buff: 0.35,
    desc: 'Nu atacă, dar amplifică semnalul nodurilor din rază cu 35% damage.'
  }
};
const NODE_ORDER = ['pulse', 'cannon', 'emp', 'slow', 'laser', 'repair', 'shield', 'drone', 'virus', 'chrono', 'mine', 'amp'];

// Inamicii sunt amenințări biologice care se propagă spre Nucleul Bio-Electronic
const ENEMY_TYPES = {
  basic: { id: 'basic', name: 'Toxină', icon: '🔺', hp: 28, speed: 52, damage: 5, reward: 4, color: '#ef4444' },
  fast: { id: 'fast', name: 'Radical Liber', icon: '⚡', hp: 16, speed: 108, damage: 3, reward: 5, color: '#f59e0b' },
  tank: { id: 'tank', name: 'Placă Fibrotică', hp: 150, speed: 28, damage: 14, reward: 15, color: '#64748b', icon: '⬛', armor: 0.32 },
  swarm: { id: 'swarm', name: 'Roi Bacterian', icon: '🔻', hp: 9, speed: 68, damage: 2, reward: 2, color: '#22d3ee' },
  phase: { id: 'phase', name: 'Agent Patogen Camuflat', icon: '👻', hp: 46, speed: 62, damage: 6, reward: 9, color: '#c084fc', phase: true, shooter: true, shootRate: 2.8, shootRange: 145, shotDamage: 7 },
  healer: { id: 'healer', name: 'Celulă Mutantă', icon: '🧫', hp: 70, speed: 42, damage: 7, reward: 13, color: '#4ade80', healer: true },
  splitter: { id: 'splitter', name: 'Spora Divizibilă', icon: '🧪', hp: 52, speed: 55, damage: 6, reward: 11, color: '#f472b6', split: true },
  leech: { id: 'leech', name: 'Parazit Memristiv', icon: '🪱', hp: 82, speed: 48, damage: 8, reward: 16, color: '#a3e635', leech: true },
  armored: { id: 'armored', name: 'Biofilm Blindat', icon: '🧱', hp: 115, speed: 38, damage: 11, reward: 18, color: '#94a3b8', armor: 0.52 },
  adaptive: { id: 'adaptive', name: 'Patogen Adaptiv', icon: '🧠', hp: 95, speed: 58, damage: 9, reward: 21, color: '#f97316', adaptive: true, shooter: true, shootRate: 2.1, shootRange: 175, shotDamage: 11 },
  artillery: { id:'artillery', name:'Spora Artilerie', icon:'🧿', hp:72, speed:34, damage:10, reward:24, color:'#fb923c', shooter:true, shootRate:2.4, shootRange:190, shotDamage:15 },
  crimsonSentinel: { id:'crimsonSentinel', name:'Santinela Crimson Core', icon:'🤖', hp:125, speed:36, damage:12, reward:26, color:'#ef4444', armor:0.28 },
  boss: { id: 'boss', name: 'Nucleu Infecțios', icon: '☠', hp: 420, speed: 24, damage: 26, reward: 90, color: '#f43f5e', boss: true, shooter: true, shootRate: 1.35, shootRange: 220, shotDamage: 18 },
  finalBoss: { id:'finalBoss', name:'OMEGA — Conștiința Patogenă', icon:'☠️', hp: 52000, speed: 10, damage: 75, reward: 1000, color:'#ff1744', boss:true, finalBoss:true, shooter:true, shootRate:0.72, shootRange:260, shotDamage:32, armor:0.58 }
};

// Generează compoziția unui val (procedural, se extinde la nesfârșit pt. modul Endless)
function generateWave(n) {
  const isFinal = n === FINAL_BOSS_WAVE;
  const isBoss = n % 5 === 0 || isFinal;
  const diff = 1 + (n - 1) * 0.095;
  const late = Math.max(0, n - 80);
  const groups = [];

  if (isFinal) {
    // W200 = encounter tactic: the Omega boss is not intended to be burned down by one tower type.
    groups.push({type:'finalBoss', count:1, hpMult:1, interval:1});
    groups.push({type:'adaptive', count:18, hpMult:4.6, interval:.62});
    groups.push({type:'artillery', count:10, hpMult:5.2, interval:.82});
    groups.push({type:'leech', count:8, hpMult:5.0, interval:.95});
    groups.push({type:'healer', count:7, hpMult:4.8, interval:1.15});
    groups.push({type:'phase', count:12, hpMult:4.4, interval:.7});
    return { number:n, groups, isBoss:true, isFinal:true, energyBonus:1600, crystalBonus:250 };
  }
  if (isBoss) {
    const bossHpMult = 1 + (n / 5 - 1) * 0.38;
    groups.push({ type: 'boss', count: 1, hpMult: bossHpMult, interval: 1 });
    groups.push({ type: 'basic', count: 6 + Math.floor(n / 3), hpMult: diff * 0.8, interval: 0.5 });
    if (n >= 10) groups.push({ type: 'fast', count: 4 + Math.floor(n / 6), hpMult: diff * 0.7, interval: 0.35 });
    if (n >= 25) groups.push({ type: 'adaptive', count: 3 + Math.floor(n / 8), hpMult: diff, interval: 0.62 });
    if (n >= 40) groups.push({ type: 'artillery', count: 2 + Math.floor(n / 14), hpMult: diff * 1.15, interval: 1.0 });
    if (n >= 80) groups.push({ type: 'leech', count: 2 + Math.floor(n / 18), hpMult: diff * 1.25, interval: .9 });
    if (n >= 120) groups.push({ type: 'phase', count: 3 + Math.floor(n / 20), hpMult: diff * 1.3, interval: .7 });
    if (n >= 7 && n % 5 !== 0) groups.push({ type:'crimsonSentinel', count:1, hpMult:1 + Math.max(0,n-7)*0.06, interval:1.1 });
  } else {
    const basicCount = 5 + Math.floor(n * 0.78) + Math.floor(late * .45);
    groups.push({ type: 'basic', count: basicCount, hpMult: diff, interval: 0.55 });
    if (n >= 2) groups.push({ type: 'fast', count: 2 + Math.floor(n * 0.45), hpMult: diff * 0.9, interval: 0.32 });
    if (n >= 3) groups.push({ type: 'swarm', count: 4 + Math.floor(n * 0.65), hpMult: diff * 0.7, interval: 0.22 });
    if (n >= 6) groups.push({ type: 'tank', count: 1 + Math.floor(n / 5) + Math.floor(late/20), hpMult: diff, interval: 1.1 });
    if (n >= 7) groups.push({ type: 'healer', count: 1 + Math.floor(n / 8), hpMult: diff, interval: 1.4 });
    if (n >= 12) groups.push({ type: 'splitter', count: 1 + Math.floor(n / 10), hpMult: diff, interval: 1.0 });
    if (n >= 9) groups.push({ type: 'phase', count: 1 + Math.floor(n / 6), hpMult: diff, interval: 0.8 });
    if (n >= 14) groups.push({ type: 'leech', count: 1 + Math.floor(n / 9), hpMult: diff, interval: 1.0 });
    if (n >= 18) groups.push({ type: 'armored', count: 1 + Math.floor(n / 10), hpMult: diff, interval: 1.25 });
    if (n >= 22) groups.push({ type: 'adaptive', count: 1 + Math.floor(n / 12), hpMult: diff * 1.08, interval: 0.95 });
    if (n >= 28) groups.push({ type: 'artillery', count: 1 + Math.floor(n / 14), hpMult: diff * 1.12, interval: 1.35 });
    if (n >= 35) groups.push({ type: 'adaptive', count: 2 + Math.floor(n / 10), hpMult: diff * 1.16, interval: 0.72 });
    if (n >= 50) groups.push({ type: 'artillery', count: 2 + Math.floor(n / 12), hpMult: diff * 1.2, interval: 1.0 });
    if (n >= 90) groups.push({ type:'phase', count:2+Math.floor(n/16), hpMult:diff*1.35, interval:.62});
    if (n >= 110) groups.push({ type:'leech', count:2+Math.floor(n/15), hpMult:diff*1.45, interval:.82});
    if (n >= 140) groups.push({ type:'artillery', count:3+Math.floor(n/12), hpMult:diff*1.5, interval:.82});
  }
  return { number: n, groups, isBoss, isFinal:false, energyBonus: 30 + n * 6 + Math.floor(n/20)*25, crystalBonus: isBoss ? 8 + Math.floor(n / 2) : 2 + Math.floor(n / 6) };
}

// ===================== LABORATOR (upgrade-uri permanente, cumpărate cu Nanoparticule) =====================
const SHOP_ITEMS = [
  { id: 'startEnergy', icon: '⚡', name: 'Rezerve Bio-Electrice', desc: '+25 Energie la începutul fiecărei misiuni', baseCost: 15, costMult: 1.6, maxLevel: 8, effectPerLevel: 25 },
  { id: 'coreHp', icon: '🧬', name: 'Regenerare Tisulară', desc: '+20 Integritate maximă pentru Nucleu', baseCost: 18, costMult: 1.65, maxLevel: 10, effectPerLevel: 20 },
  { id: 'nodeDiscount', icon: '💸', name: 'Eficiență Memristor', desc: '-3% cost construcție noduri', baseCost: 25, costMult: 1.8, maxLevel: 6, effectPerLevel: 0.03 },
  { id: 'globalDamage', icon: '💥', name: 'Protocol Ofensiv', desc: '+4% damage global pentru toate nodurile', baseCost: 30, costMult: 1.85, maxLevel: 8, effectPerLevel: 0.04 },
  { id: 'crystalGain', icon: '💠', name: 'Extractor Nanoparticule', desc: '+10% nanoparticule câștigate per misiune', baseCost: 22, costMult: 1.7, maxLevel: 6, effectPerLevel: 0.10 },
  { id: 'critChance', icon: '🎯', name: 'Sisteme de Țintire', desc: '+3% șansă de lovitură critică (x2 dmg)', baseCost: 28, costMult: 1.75, maxLevel: 6, effectPerLevel: 0.03 }
];

function shopItemCost(item, level) {
  return Math.round(item.baseCost * Math.pow(item.costMult, level));
}

// ===================== REALIZĂRI =====================
const ACHIEVEMENTS = [
  { id: 'first_node', name: 'Primul Circuit', desc: 'Construiește primul nod memristor', icon: '🔧', reward: 5, check: s => s.totalNodesBuilt >= 1 },
  { id: 'wave5', name: 'Sub Asediu', desc: 'Supraviețuiește valului 5', icon: '🌊', reward: 8, check: s => s.bestWave >= 5 },
  { id: 'wave10', name: 'Rezistență', desc: 'Supraviețuiește valului 10', icon: '🛡', reward: 12, check: s => s.bestWave >= 10 },
  { id: 'wave20', name: 'Fortăreață Tisulară', desc: 'Supraviețuiește valului 20', icon: '🏰', reward: 20, check: s => s.bestWave >= 20 },
  { id: 'wave30', name: 'Implant Stabilizat', desc: 'Supraviețuiește valului 50', icon: '👑', reward: 40, check: s => s.bestWave >= 50 },
  { id: 'endless10', name: 'Regenerare Infinită', desc: 'Supraviețuiește 10 valuri în modul Endless', icon: '♾', reward: 35, check: s => (s.maxEndlessWave || 0) >= 10 },
  { id: 'kills100', name: 'Sistem Imunitar', desc: 'Neutralizează 100 de amenințări în total', icon: '💀', reward: 10, check: s => s.totalKills >= 100 },
  { id: 'kills1000', name: 'Imunitate Totală', desc: 'Neutralizează 1000 de amenințări în total', icon: '☠️', reward: 30, check: s => s.totalKills >= 1000 },
  { id: 'emp5', name: 'Maestru EM', desc: 'Construiește 5 Câmpuri Electromagnetice într-o misiune', icon: '🟣', reward: 10, check: s => s.maxEmpInRun >= 5 },
  { id: 'noDamageWave', name: 'Țesut Intact', desc: 'Termină un val fără să pierzi Integritate', icon: '✨', reward: 12, check: s => s.perfectWaveAchieved },
  { id: 'richRun', name: 'Rezervă Bio-Electrică', desc: 'Acumulează 3000 Energie într-o singură misiune', icon: '💰', reward: 15, check: s => s.maxEnergyInRun >= 3000 },
  { id: 'allNodes', name: 'Circuit Complet', desc: 'Construiește toate cele 12 tipuri de noduri într-o misiune', icon: '📦', reward: 15, check: s => s.allNodeTypesUsed },
  { id: 'runs20', name: 'Veteran de Laborator', desc: 'Joacă 20 de misiuni', icon: '🎖', reward: 20, check: s => s.totalRuns >= 20 },
  { id: 'laserMaster', name: 'Rețea Neurală', desc: 'Construiește 3 Fascicule Neurale într-o misiune', icon: '🔺', reward: 16, check: s => (s.laserBuilt || 0) >= 3 },
  { id: 'overdrive', name: 'Supraîncărcare', desc: 'Activează Protocolul Overdrive', icon: '🔥', reward: 22, check: s => (s.totalOverdrives || 0) >= 5 },
  { id: 'bossSlayer', name: 'Vânător de Nuclee Infecțioase', desc: 'Elimină 10 boss-uri în total', icon: '🗡', reward: 18, check: s => s.totalBossKills >= 10 }
];
