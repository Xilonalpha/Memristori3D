from pathlib import Path
p=Path('/tmp/mem/www/js/storage.js'); s=p.read_text(); s=s.replace("bestWave: 0,", "bestWave: 0,\n    selectedMap: 'neuralCore',") ; p.write_text(s)

p=Path('/tmp/mem/www/index.html'); s=p.read_text()
s=s.replace('<button class="btn btn-secondary" id="btnContinue" style="display:none">⏵ Continuă (Val <span id="continueWave"></span>)</button>', '<button class="btn btn-secondary" id="btnContinue" style="display:none">⏵ Continuă (Val <span id="continueWave"></span>)</button>\n      <div class="map-picker"><label for="mapSelect">🗺️ Sector de implant</label><select id="mapSelect"></select></div>')
s=s.replace('<button class="btn" id="btnHowTo">❔ Cum se joacă</button>', '<button class="btn" id="btnHowTo">❔ Cum se joacă</button>\n      <button class="btn" id="btnStory">📖 Povestea implantului</button>')
s=s.replace('<div class="wave-toast" id="waveToast"></div>', '<div class="wave-toast" id="waveToast"></div>\n  <div class="narrative-overlay" id="narrativeOverlay"><div class="narrative-card"><div class="narrative-kicker" id="narrativeKicker">ARCHIVE</div><h3 id="narrativeTitle">Jurnalul implantului</h3><p id="narrativeText"></p><button class="btn btn-primary" id="narrativeClose">Continuă</button></div></div>')
# add story screen before shop
marker='<!-- ===================== SHOP ===================== -->'
story='''<!-- ===================== STORY ===================== -->\n<section id="screen-story" class="screen">\n  <header class="panel-header"><button class="iconBtn back-btn" data-back="screen-menu">←</button><h2>Cronica Memristor</h2></header>\n  <div class="panel-body story-body">\n    <article class="story-chapter"><span>01</span><h3>Semnalul</h3><p>În anul 2049, un implant bio-electronic experimental păstrează memoria neuronală a unui pacient aflat la limita dintre viață și degradare. În interior, milioane de conexiuni memristive învață permanent.</p></article>\n    <article class="story-chapter"><span>02</span><h3>Infecția</h3><p>O colonie necunoscută pătrunde în membrana implantului. Nu atacă doar țesutul: învață din fiecare apărare și își schimbă structura.</p></article>\n    <article class="story-chapter"><span>03</span><h3>Răspunsul</h3><p>Inteligența de protecție trezește rețeaua Memristor. Nodurile trebuie construite, combinate și evoluate înainte ca Nucleul Bio-Electronic să fie compromis.</p></article>\n    <article class="story-chapter"><span>04</span><h3>Războiul adaptiv</h3><p>Pe măsură ce valurile cresc, patogenii dezvoltă arme proprii. Unele forme trag de la distanță, altele se multiplică, iar boss-ii schimbă complet regulile luptei.</p></article>\n    <article class="story-chapter"><span>05</span><h3>Ultimul protocol</h3><p>La capătul campaniei nu există doar supraviețuire. Există o întrebare: poate un sistem construit să protejeze memoria să învețe, la rândul său, să evolueze?</p></article>\n  </div>\n</section>\n\n'''
s=s.replace(marker,story+marker)
p.write_text(s)

p=Path('/tmp/mem/www/js/main.js'); s=p.read_text()
# map picker function after refreshMenu
needle='''  function refreshMenu() {'''
idx=s.index(needle)
# insert function before
insert='''  function renderMapPicker() {\n    const sel=document.getElementById('mapSelect'); if(!sel) return;\n    sel.innerHTML='';\n    MAP_ORDER.forEach(id=>{ const m=MAPS[id]; const o=document.createElement('option'); o.value=id; o.textContent=m.name; sel.appendChild(o); });\n    sel.value=SAVE.selectedMap || 'neuralCore';\n  }\n\n'''
s=s[:idx]+insert+s[idx:]
s=s.replace('''    const contBtn = document.getElementById('btnContinue');''','''    renderMapPicker();\n    const contBtn = document.getElementById('btnContinue');''',1)
# newGame selected map
s=s.replace('''    Game.startNewRun();''','''    Game.setMap(SAVE.selectedMap || 'neuralCore');\n    Game.startNewRun();''',1)
# continueGame replace whole preset section
old_start=s.index('  function continueGame() {')
old_end=s.index('  function autoSaveRun()', old_start)
new='''  function continueGame() {\n    const s=SAVE.savedRun; if(!s) return newGame();\n    const preset={...s, nodes:(s.nodes||[]).map(n=>({...n})), enemies:(s.enemies||[]).map(e=>({...e})), projectiles:(s.projectiles||[]).map(p=>({...p})), enemyProjectiles:(s.enemyProjectiles||[]).map(p=>({...p})), particles:(s.particles||[]).map(p=>({...p})), anomalies:(s.anomalies||[]).map(a=>({...a})), shockwaves:(s.shockwaves||[]).map(a=>({...a})), beams:(s.beams||[]).map(a=>({...a})), paused:false, running:true, finalized:false };\n    Game.startNewRun(preset); goTo('screen-game'); refreshHud();\n  }\n\n'''
s=s[:old_start]+new+s[old_end:]
# autosave function replace
start=s.index('  function autoSaveRun() {'); end=s.index('  function showVictory()', start)
new='''  function autoSaveRun() {\n    const R=Game.R; if(!R) return; const snap=Game.getSnapshot ? Game.getSnapshot() : null;\n    SAVE.hasSavedRun=true;\n    SAVE.savedRun=snap || {energy:R.energy,coreHP:R.coreHP,coreMaxHP:R.coreMaxHP,waveNumber:R.waveNumber,mapId:R.mapId,nodes:R.nodes.map(n=>({slot:n.slot,typeId:n.typeId,level:n.level}))};\n    SAVE.selectedMap=R.mapId || SAVE.selectedMap; persistSave();\n  }\n\n  function showNarrativeBeat(wave,mapId){\n    const ov=document.getElementById('narrativeOverlay'); if(!ov) return;\n    const beats={1:['ACTIVARE','Nucleul se trezește','Memoria pacientului este stabilă. Un semnal necunoscut traversează membrana.'],10:['ALERTĂ','Prima mutație','Patogenii au început să învețe. Directorul adaptiv recomandă diversificarea nodurilor.'],20:['SECTOR CRITIC','Țesutul răspunde','Infecția a pătruns în al doilea strat. Harta devine un organism activ.'],40:['PROTOCOL OMEGA','Războiul se schimbă','Amenințările dezvoltă arme proprii. Nu toate vor mai aștepta să ajungă la nucleu.'],60:['ARHIVA NEAGRĂ','Ceva învață','Semnalele din interiorul implantului nu mai corespund doar unui sistem defensiv.'],80:['ULTIMA MEMORIE','Nucleul','Ultimul sector ascunde originea infecției. Stabilizarea este doar începutul.']};\n    const b=beats[wave]; if(!b) return; document.getElementById('narrativeKicker').textContent=b[0]+' · '+(MAPS[mapId]?.name||'SECTOR'); document.getElementById('narrativeTitle').textContent=b[1]; document.getElementById('narrativeText').textContent=b[2]; ov.classList.add('active');\n  }\n\n'''
s=s[:start]+new+s[end:]
# wire UI additions
s=s.replace("document.getElementById('btnHowTo').onclick = () => { AudioSys.buttonClick(); goTo('screen-howto'); };", "document.getElementById('btnHowTo').onclick = () => { AudioSys.buttonClick(); goTo('screen-howto'); };\n    document.getElementById('btnStory').onclick = () => { AudioSys.buttonClick(); goTo('screen-story'); };\n    const mapSel=document.getElementById('mapSelect'); if(mapSel) mapSel.onchange=()=>{ SAVE.selectedMap=mapSel.value; persistSave(); };\n    document.getElementById('narrativeClose').onclick=()=>document.getElementById('narrativeOverlay').classList.remove('active');")
# pause autosave
s=s.replace("Game.R.paused = true;\n      document.getElementById('pauseOverlay')", "Game.R.paused = true;\n      autoSaveRun();\n      document.getElementById('pauseOverlay')")
# resume narrative? no
# mobile lifecycle autosave
s=s.replace("document.addEventListener('pause', () => {", "document.addEventListener('pause', () => {\n      if(Game.R){ Game.R.paused=true; autoSaveRun(); }")
s=s.replace("document.addEventListener('resume', () => {", "document.addEventListener('resume', () => {")
p.write_text(s)
