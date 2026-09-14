// ===================== SALVARE PERSISTENTĂ (localStorage) =====================
const SAVE_KEY = 'memristor_defense_save_v1';

function defaultSave() {
  return {
    crystals: 0,
    bestWave: 0,
    selectedMap: 'neuralCore',
    totalRuns: 0,
    totalKills: 0,
    totalBossKills: 0,
    totalOverdrives: 0,
    shopLevels: {},          // { itemId: level }
    achievementsUnlocked: {}, // { achId: true }
    settings: { sound: true, vibrate: true, notif: true },
    hasSavedRun: false,
    savedRun: null,          // snapshot for "Continuă"
    dailyLastPlayed: null,
    dailyStreak: 0,
    dailyBest: {},
    dailyClaimed: {},
    storyUnlocked: {},
    dailyLoginLastClaim: null,
    dailyLoginStreak: 0,
    dailyLoginRewardsClaimed: {}
  };
}

let SAVE = null;

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      SAVE = Object.assign(defaultSave(), parsed);
      SAVE.shopLevels = Object.assign({}, parsed.shopLevels || {});
      SAVE.achievementsUnlocked = Object.assign({}, parsed.achievementsUnlocked || {});
      SAVE.dailyBest = Object.assign({}, parsed.dailyBest || {});
      SAVE.dailyClaimed = Object.assign({}, parsed.dailyClaimed || {});
      SAVE.storyUnlocked = Object.assign({}, parsed.storyUnlocked || {});
      SAVE.dailyLoginRewardsClaimed = Object.assign({}, parsed.dailyLoginRewardsClaimed || {});
      SAVE.settings = Object.assign({ sound: true, vibrate: true, notif: true }, parsed.settings || {});
    } else {
      SAVE = defaultSave();
    }
  } catch (e) {
    SAVE = defaultSave();
  }
  return SAVE;
}

function persistSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(SAVE));
  } catch (e) { /* storage full or unavailable — ignore silently */ }
}

function shopLevel(itemId) {
  return SAVE.shopLevels[itemId] || 0;
}

function resetAllProgress() {
  SAVE = defaultSave();
  persistSave();
}
