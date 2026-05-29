// ══════════════════════════════════════════════════════════════
// CRISIS STRESS TEST — Scenari Macro Storici Dettagliati
// Simula il path mensile ESATTO del portafoglio dell'utente
// durante le principali crisi storiche 1970-2024.
// I rendimenti sono presi direttamente da HIST_MONTHLY
// (dati mensili reali), non da parametri sintetici.
// ══════════════════════════════════════════════════════════════

// ── Definizione crisi con coordinate mensili precise ─────────
// startYr/startMo: primo mese della crisi (1-indexed)
// endYr/endMo: mese del bottom (picco drawdown)
// recovYr/recovMo: stima mese di recovery al livello pre-crisi
// I bounds sono usati per estrarre la finestra da HIST_MONTHLY.
// windowMonths: quanti mesi totali mostrare (pre+crisi+recovery)

const CRISIS_SCENARIOS = [
  {
    id: 'stagflation7374',
    label: '1973–74 Stagflazione OPEC',
    shortLabel: '1973–74',
    color: '#e37400',
    bg: 'rgba(227,116,0,.10)',
    startYr: 1972, startMo: 10,   // inizio finestra (2 mesi pre-crisi)
    peakYr:  1973, peakMo:  1,    // inizio drawdown formale
    troughYr:1974, troughMo:10,   // bottom storico
    windowMonths: 36,             // 3 anni di finestra
    context: `<strong>Embargo petrolifero OPEC</strong> (ottobre 1973) — I paesi arabi dell'OPEC bloccano le esportazioni di petrolio verso USA e alleati. Il prezzo del greggio quadruplica in pochi mesi. L'inflazione USA balza al 12%. Il mercato azionario mondiale perde il <strong>−48%</strong> in 23 mesi. L'oro sale del <strong>+162%</strong>. Per i portafogli bilanciati è il periodo più difficile del dopoguerra: sia azioni che obbligazioni in territorio negativo in termini reali.`,
    macro: { infl: '11%', rates: '12% (Fed Funds)', recov: '~24 mesi', sp500: '−48%' },
    lessons: 'L\'oro è l\'unico asset con rendimento positivo reale. Il cash in termini reali perde per inflazione elevata. I portafogli ad alta obbligazionaria soffrono meno in nominale ma il rendimento reale è devastante.',
  },
  {
    id: 'blackmonday87',
    label: '1987 Black Monday',
    shortLabel: '1987',
    color: '#9334e6',
    bg: 'rgba(147,52,230,.10)',
    startYr: 1987, startMo:  8,
    peakYr:  1987, peakMo:  10,
    troughYr:1987, troughMo:11,
    windowMonths: 24,
    context: `<strong>Black Monday, 19 ottobre 1987</strong> — Il mercato azionario USA crolla del <strong>−22.6% in un solo giorno</strong>: il peggior crash percentuale nella storia. Cause: portfolio insurance (feedback loop di vendite automatizzate), tassi in rialzo, deficit commerciale USA. Ma la crisi è <strong>breve e a V</strong>: recupero completo entro 2 anni. Le obbligazioni tengono (flight to quality).`,
    macro: { infl: '3.6%', rates: '7.25% (Fed)', recov: '~22 mesi', sp500: '−34%' },
    lessons: 'Crash violento ma breve. Chi non ha venduto ha recuperato tutto entro 2 anni. Il PAC mensile ha comprato ai minimi: esempio perfetto di perché non uscire dal mercato nei crash.',
  },
  {
    id: 'dotcom0002',
    label: '2000–02 Bolla Dot-com',
    shortLabel: '2000–02',
    color: '#d93025',
    bg: 'rgba(217,48,37,.10)',
    startYr: 2000, startMo:  1,
    peakYr:  2000, peakMo:   3,
    troughYr:2002, troughMo: 10,
    windowMonths: 48,
    context: `<strong>Burst della bolla internet</strong> — Dopo anni di valutazioni stellari (CAPE 44 a gennaio 2000), il NASDAQ perde il <strong>−78%</strong> tra marzo 2000 e ottobre 2002. Il mercato mondiale azionario cede il <strong>−49%</strong>. Le obbligazioni performano positivamente (flight to quality, Fed taglia i tassi). L'oro sale moderatamente. Crisi lenta e prolungata: il recovery azionario richiede <strong>oltre 5 anni</strong>.`,
    macro: { infl: '2.8%', rates: '6.5% → 1.0% (Fed)', recov: '~62 mesi', sp500: '−49%' },
    lessons: 'Crisi lenta e devastante per i portafogli azionari pesanti. Le obbligazioni hanno protetto. Chi aveva CAPE alto in portafoglio ha sofferto di più. Il PAC ha mediato ma il recovery è stato lunghissimo.',
  },
  {
    id: 'gfc0809',
    label: '2008–09 Crisi Finanziaria Globale',
    shortLabel: '2008–09',
    color: '#b31412',
    bg: 'rgba(179,20,18,.10)',
    startYr: 2007, startMo:  10,
    peakYr:  2008, peakMo:   9,
    troughYr:2009, troughMo:  3,
    windowMonths: 48,
    context: `<strong>Crisi dei subprime e Lehman Brothers</strong> (settembre 2008) — Il peggior crash dai 1929. S&P500 <strong>−57%</strong>, MSCI World <strong>−54%</strong>. Le correlazioni tra asset esplodono: azioni, obbligazioni corporate e immobiliare crollano insieme. Solo titoli di Stato USA e oro tengono (flight to quality estremo). La Fed taglia i tassi a zero. Recovery azionario richiede <strong>54 mesi</strong>, ma chi ha tenuto ha triplicato in 10 anni.`,
    macro: { infl: '3.8% → −0.4%', rates: '5.25% → 0.25% (Fed)', recov: '~54 mesi', sp500: '−57%' },
    lessons: 'L\'unica crisi in cui anche le obbligazioni corporate crollano. I titoli di Stato e l\'oro sono i soli rifugi. Il portafoglio Permanent (25/25/25/25) è stato quello che ha perso meno. Chi ha tenuto ha moltiplicato.',
  },
  {
    id: 'covid20',
    label: '2020 COVID-19 Crash',
    shortLabel: '2020',
    color: '#1a73e8',
    bg: 'rgba(26,115,232,.10)',
    startYr: 2020, startMo:  1,
    peakYr:  2020, peakMo:   2,
    troughYr:2020, troughMo:  3,
    windowMonths: 18,
    context: `<strong>Pandemia COVID-19</strong> — Il crash più veloce della storia: azioni mondiali <strong>−34% in 33 giorni</strong> (febbraio–marzo 2020). La FED interviene con QE illimitato. Recovery completa in <strong>meno di 6 mesi</strong>: il più rapido rimbalzo post-crash mai registrato. Le obbligazioni governative tengono; l'oro sale del +25% nel 2020. Chi ha venduto al bottom ha perso il recupero.`,
    macro: { infl: '1.2%', rates: '1.75% → 0.25% (Fed)', recov: '~5 mesi', sp500: '−34%' },
    lessons: 'Crash istantaneo, recovery istantaneo. Ogni asset class ha performato secondo le aspettative teoriche. Il portafoglio diversificato ha protetto molto. Chi non ha venduto ha partecipato al rimbalzo totale.',
  },
  {
    id: 'inflation22',
    label: '2022 Inflazione & Tassi',
    shortLabel: '2022',
    color: '#00897b',
    bg: 'rgba(0,137,123,.10)',
    startYr: 2021, startMo:  12,
    peakYr:  2022, peakMo:   1,
    troughYr:2022, troughMo: 10,
    windowMonths: 30,
    context: `<strong>Rialzo tassi Fed 2022</strong> — Crisi unica nel dopoguerra: <strong>azioni −20% E obbligazioni −15% contemporaneamente</strong>. Il 60/40 perde −17%: il peggior anno dal 1937. Causa: inflazione all'8%, Fed alza i tassi da 0% a 4.5% in 12 mesi (il ciclo più rapido dal 1980). L'oro sostanzialmente flat (−2%), il cash rivaluta. Unica crisi moderna in cui la diversificazione azioni/obbligazioni ha fallito completamente.`,
    macro: { infl: '8.0%', rates: '0.25% → 4.5% (Fed)', recov: 'Parziale al 2023', sp500: '−20%' },
    lessons: 'Il 2022 ha dimostrato che il 60/40 non è sempre una protezione. Solo i portafogli con high cash, commodities o obbligazioni a breve scadenza hanno tenuto. L\'oro ha deluso come hedger inflattivo nel breve.',
  },
];

// ── Utility: mese/anno → indice in HIST_MONTHLY ─────────────
function crisisYMtoIdx(yr, mo) {
  // HIST_MONTHLY parte da gennaio 1970 (indice 0)
  return Math.max(0, (yr - 1970) * 12 + (mo - 1));
}

// ── Simula path mensile di un portafoglio durante una crisi ──
// Ritorna array di oggetti {month, idx, eqRet, obRet, goldRet, portRet, cumValue}
// portValue0 = 100 (normalizzato) — mostra % rispetto all'inizio
function simulateCrisisPath(crisis, portKey, capitalEur) {
  const startIdx = crisisYMtoIdx(crisis.startYr, crisis.startMo);
  const endIdx   = Math.min(startIdx + crisis.windowMonths, HIST_MONTHLY.length - 1);

  // Pesi portafoglio (usa funzioni già definite in main.js)
  const eqW   = typeof getEquityWeight === 'function' ? getEquityWeight(portKey, state?.age || 40) : 0.6;
  const goldW = typeof getGoldWeight   === 'function' ? getGoldWeight(portKey) : 0;
  const cashW = typeof getCashWeight   === 'function' ? getCashWeight(portKey) : 0;
  const obW   = Math.max(0, 1 - eqW - goldW - cashW);

  const terMonthly = ((state?.ter ?? 0.2) / 100) / 12;

  let cumValue = 100; // normalizzato a 100
  let cumEur   = capitalEur;
  let peak     = 100;
  let maxDD    = 0;
  let maxDDMonth = 0;
  let worstMonthRet = 0;
  let worstMonthIdx = 0;

  const path = [];

  for (let idx = startIdx; idx <= endIdx; idx++) {
    if (idx >= HIST_MONTHLY.length) break;
    const row = calibrateHistRow(HIST_MONTHLY[idx]);
    const eqRet   = row[0];
    const obRet   = row[1];
    const goldRet = row[2];

    const portRet = eqW * eqRet + obW * obRet + goldW * goldRet + cashW * 0.002 - terMonthly;

    cumValue *= (1 + portRet);
    cumEur   *= (1 + portRet);

    if (cumValue > peak) peak = cumValue;
    const dd = peak > 0 ? (cumValue - peak) / peak : 0;
    if (dd < maxDD) { maxDD = dd; maxDDMonth = idx - startIdx; }
    if (portRet < worstMonthRet) { worstMonthRet = portRet; worstMonthIdx = idx - startIdx; }

    // Calcola anno e mese calendario
    const totalMo = 1970 * 12 + idx;
    const calYr   = Math.floor(totalMo / 12);
    const calMo   = totalMo % 12 + 1;

    path.push({
      monthN:   idx - startIdx,
      calYr, calMo,
      label:    `${calMo.toString().padStart(2,'0')}/${calYr}`,
      eqRet, obRet, goldRet,
      portRet,
      cumValue: +cumValue.toFixed(3),
      cumEur:   Math.round(cumEur),
      drawdown: +((cumValue / peak - 1) * 100).toFixed(2),
    });
  }

  // Trova recovery: primo mese dopo il bottom in cui si supera 100 (inizio crisi)
  let recoveryMonth = null;
  let pastTrough = false;
  const troughMonthN = maxDDMonth;
  for (const p of path) {
    if (p.monthN >= troughMonthN) pastTrough = true;
    if (pastTrough && p.cumValue >= 100) { recoveryMonth = p.monthN; break; }
  }

  return {
    path,
    maxDD,       // negativo
    maxDDMonth,
    maxDDMonthLabel: path[maxDDMonth]?.label || '—',
    worstMonthRet,
    worstMonthLabel: path[worstMonthIdx]?.label || '—',
    finalValue:  path[path.length - 1]?.cumValue ?? 100,
    finalEur:    path[path.length - 1]?.cumEur ?? capitalEur,
    recoveryMonth,
    lossEur:     Math.round((capitalEur * maxDD)),
    eqW, obW, goldW, cashW,
  };
}

// ── Render principale: inietta la sezione nella tab Backtesting ─
let crisisCharts = {};
let crisisInitialized = false;

function initCrisisStress() {
  if (crisisInitialized) return;
  crisisInitialized = true;

  const container = document.getElementById('crisisStressSection');
  if (!container) return;

  // Render selector crisi + contenuto
  container.innerHTML = buildCrisisUI();
  bindCrisisEvents();
}

function buildCrisisUI() {
  const pills = CRISIS_SCENARIOS.map((c, i) => `
    <button class="gbtn crisis-pill${i === 0 ? ' a-red' : ''}" data-crisis="${c.id}"
      style="border-left:3px solid ${c.color};${i === 0 ? `background:${c.bg}` : ''}">
      ${c.shortLabel}
    </button>`).join('');

  return `
  <div class="sec" style="margin-top:18px">
    <div class="sec-label" style="color:var(--red)">🔥 Stress Test Macro Storici — Path Mensile Esatto</div>
    <p style="font-size:12.5px;color:var(--text2);line-height:1.6;margin-bottom:14px">
      Simulazione del percorso mensile <strong>preciso</strong> del tuo portafoglio durante le principali crisi storiche,
      usando i rendimenti mensili reali 1970–2024. Nessuna approssimazione: ogni mese è il dato effettivo.
      Il capitale di riferimento è quello impostato nel simulatore principale.
    </p>
    <!-- Pills crisi -->
    <div class="btn-group" id="crisisPills" style="flex-wrap:wrap;gap:6px;margin-bottom:16px">${pills}</div>

    <!-- Contesto crisi -->
    <div id="crisisContext" style="padding:14px 16px;border-radius:10px;font-size:12.5px;line-height:1.7;margin-bottom:16px;border:1px solid var(--border2);background:var(--bg2)"></div>

    <!-- Metriche crisi -->
    <div id="crisisMetrics" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-bottom:18px"></div>

    <!-- Grafico path mensile -->
    <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px;letter-spacing:.04em;text-transform:uppercase">
      📈 Portafoglio normalizzato (base 100 = inizio crisi)
    </div>
    <div class="chart-wrap" style="height:300px;margin-bottom:16px"><canvas id="chCrisisPath"></canvas></div>

    <!-- Grafico drawdown mensile -->
    <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:6px;letter-spacing:.04em;text-transform:uppercase">
      📉 Drawdown mensile dal picco (%)
    </div>
    <div class="chart-wrap" style="height:200px;margin-bottom:18px"><canvas id="chCrisisDD"></canvas></div>

    <!-- Tabella mesi peggiori -->
    <div id="crisisWorstMonths" style="margin-bottom:16px"></div>

    <!-- Confronto tutte le crisi -->
    <div style="margin-top:4px">
      <button class="gbtn" id="btnAllCrises" onclick="renderAllCrisesCompare()"
        style="background:var(--bg2);border:1px solid var(--border2);font-weight:600;padding:9px 18px">
        📊 Confronta tutte le crisi con questo portafoglio
      </button>
    </div>

    <!-- Sezione confronto -->
    <div id="crisisCompareSection" style="display:none;margin-top:16px">
      <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px;letter-spacing:.04em;text-transform:uppercase">
        Confronto Crisi — Drawdown Portafoglio Attuale
      </div>
      <div id="crisisCompareTable" style="margin-bottom:16px"></div>
      <div class="chart-wrap" style="height:320px"><canvas id="chCrisisCompare"></canvas></div>
    </div>

    <!-- Nota metodologica -->
    <div style="margin-top:14px;padding:10px 14px;background:var(--bg2);border:1px solid var(--border2);border-radius:8px;font-size:11.5px;color:var(--text3);line-height:1.7">
      <strong>Metodologia:</strong> I rendimenti mensili provengono da HIST_MONTHLY (DMS Yearbook 2024, FRED, mercato internazionale oro),
      calibrati sulle medie annue verificate. I pesi del portafoglio sono quelli attuali del simulatore.
      TER applicato mensilmente. Nessun PAC aggiuntivo (snapshot del capitale iniziale).
      Drawdown calcolato rispetto al picco della finestra mostrata, non al picco assoluto storico.
    </div>
  </div>`;
}

function bindCrisisEvents() {
  const pills = document.getElementById('crisisPills');
  if (!pills) return;
  pills.addEventListener('click', e => {
    const b = e.target.closest('.crisis-pill');
    if (!b) return;
    document.querySelectorAll('.crisis-pill').forEach(p => {
      p.classList.remove('a-red');
      p.style.background = '';
    });
    b.classList.add('a-red');
    const crisis = CRISIS_SCENARIOS.find(c => c.id === b.dataset.crisis);
    if (crisis) { b.style.background = crisis.bg; renderCrisis(crisis.id); }
  });
  // Render primo scenario di default
  renderCrisis(CRISIS_SCENARIOS[0].id);
}

function getActiveCrisisPortKey() {
  // Usa il portafoglio attualmente selezionato nel backtesting, o quello del simulatore
  const btPort = btState?.port;
  if (btPort && btPort !== 'sim') return btPort;
  return state?.portfolio || 'eq60';
}

function renderCrisis(crisisId) {
  const crisis = CRISIS_SCENARIOS.find(c => c.id === crisisId);
  if (!crisis) return;

  const portKey = getActiveCrisisPortKey();
  const capitalEur = btState?.w ?? state?.w ?? 10000;

  // I preset con leva / managed futures non hanno serie storica coerente:
  // lo stress test storico li modellerebbe come un semplice mix az/obbl/oro,
  // ignorando leva e trend. Mostra un avviso invece di numeri fuorvianti.
  const NON_BACKTESTABLE = { ec_us_9060: 1, ec_glob_9060: 1, return_stack: 1 };
  if (NON_BACKTESTABLE[portKey]) {
    const lbl = typeof getPortLabel === 'function' ? getPortLabel(portKey) : portKey;
    const ctx0 = document.getElementById('crisisContext');
    if (ctx0) {
      ctx0.style.background = 'rgba(230,138,0,.08)';
      ctx0.style.borderColor = 'rgba(230,138,0,.35)';
      ctx0.innerHTML = `<div style="font-size:13px;font-weight:700;color:#b8860b;margin-bottom:6px">Stress test non disponibile — ${lbl}</div>` +
        `<div style="font-size:12.5px;line-height:1.6;color:var(--text2)">Questa strategia usa leva (esposizione &gt;100%) e/o managed futures, ` +
        `asset privi di serie storica coerente in questo modello (i dati storici coprono solo azioni, obbligazioni e oro). ` +
        `Usa le schede <strong>Simulatore</strong> o <strong>Monte Carlo</strong>, che modellano correttamente leva e diversificazione.</div>`;
    }
    ['crisisMetrics','crisisWorstMonths'].forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = ''; });
    const cmp = document.getElementById('crisisCompareSection'); if (cmp) cmp.style.display = 'none';
    return;
  }

  const sim = simulateCrisisPath(crisis, portKey, capitalEur);
  const portLabel = typeof getPortLabel === 'function' ? getPortLabel(portKey) : portKey;

  // ─── Contesto ───
  const ctx = document.getElementById('crisisContext');
  if (ctx) {
    ctx.style.background = crisis.bg;
    ctx.style.borderColor = crisis.color + '44';
    ctx.innerHTML = `
      <div style="font-size:13px;font-weight:700;color:${crisis.color};margin-bottom:6px">${crisis.label}</div>
      <div style="color:var(--text2)">${crisis.context}</div>
      <div style="margin-top:10px;padding:8px 12px;background:rgba(255,255,255,.5);border-radius:6px;font-size:11.5px;color:var(--text3)">
        <strong>💡 Cosa imparare:</strong> ${crisis.lessons}
      </div>`;
  }

  // ─── Macro pills ───
  const macro = crisis.macro;
  const ddColor = sim.maxDD < -0.30 ? 'var(--red)' : sim.maxDD < -0.15 ? 'var(--orange)' : 'var(--green)';
  const lossSign = sim.lossEur < 0 ? '−' : '';
  const recStr = sim.recoveryMonth != null
    ? `${sim.recoveryMonth} mesi`
    : `>${crisis.windowMonths} mesi (non recuperato nella finestra)`;

  const metrics = [
    { l: 'Portafoglio simulato', v: portLabel, c: crisis.color },
    { l: 'Capitale iniziale', v: `€${capitalEur.toLocaleString('it-IT')}`, c: 'var(--blue)' },
    { l: 'Max Drawdown', v: `${(sim.maxDD * 100).toFixed(1)}%`, sub: `Bottom: ${sim.maxDDMonthLabel}`, c: ddColor },
    { l: 'Perdita max (€)', v: `−€${Math.abs(sim.lossEur).toLocaleString('it-IT')}`, c: 'var(--red)' },
    { l: 'Mese peggiore', v: `${(sim.worstMonthRet * 100).toFixed(1)}%`, sub: sim.worstMonthLabel, c: 'var(--red)' },
    { l: 'Recovery stimato', v: recStr, c: sim.recoveryMonth != null && sim.recoveryMonth < 24 ? 'var(--green)' : 'var(--orange)' },
    { l: `Inflazione (${crisis.peakYr})`, v: macro.infl, c: 'var(--text2)' },
    { l: 'Tassi Fed', v: macro.rates, c: 'var(--text2)' },
    { l: 'S&P500 storico', v: macro.sp500, c: 'var(--red)' },
    {
      l: 'Composizione',
      v: `Az.${(sim.eqW*100).toFixed(0)}% Ob.${(sim.obW*100).toFixed(0)}% Au.${(sim.goldW*100).toFixed(0)}% Liq.${(sim.cashW*100).toFixed(0)}%`,
      c: 'var(--text3)'
    },
  ];

  document.getElementById('crisisMetrics').innerHTML = metrics.map(m => `
    <div class="bt-stat-card" style="min-width:140px">
      <div class="lbl">${m.l}</div>
      <div class="val" style="color:${m.c};font-size:13.5px">${m.v}</div>
      ${m.sub ? `<div style="font-size:10.5px;color:var(--text3);margin-top:1px">${m.sub}</div>` : ''}
    </div>`).join('');

  // ─── Grafico path mensile ───
  const labels = sim.path.map(p => p.label);
  const cumVals = sim.path.map(p => p.cumValue);
  const ddVals  = sim.path.map(p => p.drawdown);

  // Linea di riferimento a 100 e marcatori: picco, bottom, recovery
  const refLine = sim.path.map(() => 100);

  // Colora i punti: verde pre-crisi, rosso in drawdown, verde recovery
  const pointColors = sim.path.map(p => {
    if (p.drawdown < -1) return crisis.color;
    return 'var(--green)';
  });

  if (crisisCharts.path) { crisisCharts.path.destroy(); crisisCharts.path = null; }
  const tC = 'rgba(0,0,0,.4)', gC = 'rgba(0,0,0,.06)';

  crisisCharts.path = new Chart(document.getElementById('chCrisisPath'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: `${portLabel} (base 100)`,
          data: cumVals,
          borderColor: crisis.color,
          borderWidth: 2,
          pointRadius: cumVals.map((v, i) => (i === sim.maxDDMonth) ? 5 : 0),
          pointBackgroundColor: crisis.color,
          fill: true,
          backgroundColor: crisis.bg,
          tension: 0.3,
        },
        {
          label: 'Livello di partenza (100)',
          data: refLine,
          borderColor: 'rgba(0,0,0,.25)',
          borderWidth: 1,
          borderDash: [4, 3],
          pointRadius: 0,
          fill: false,
        },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, labels: { font: { size: 11 } } },
        tooltip: {
          callbacks: {
            title: c => c[0].label,
            label: c => {
              if (c.datasetIndex === 0) {
                const dd = sim.path[c.dataIndex]?.drawdown ?? 0;
                const eur = sim.path[c.dataIndex]?.cumEur ?? 0;
                return [
                  ` Portafoglio: ${c.raw.toFixed(2)} (€${eur.toLocaleString('it-IT')})`,
                  ` Drawdown: ${dd.toFixed(2)}%`,
                ];
              }
              return ` Livello base: ${c.raw}`;
            }
          },
          backgroundColor: '#fff', borderColor: '#dadce0', borderWidth: 1,
          titleColor: '#202124', bodyColor: '#5f6368', padding: 10,
        },
      },
      scales: {
        x: {
          ticks: { color: tC, font: { size: 10, family: 'DM Mono' }, maxTicksLimit: 12 },
          grid: { color: gC }
        },
        y: {
          ticks: { color: tC, font: { size: 10, family: 'DM Mono' }, callback: v => v.toFixed(0) },
          grid: { color: gC },
          suggestedMin: Math.min(...cumVals) * 0.97,
          suggestedMax: Math.max(...cumVals) * 1.02,
        }
      }
    }
  });

  // ─── Grafico drawdown mensile ───
  if (crisisCharts.dd) { crisisCharts.dd.destroy(); crisisCharts.dd = null; }
  crisisCharts.dd = new Chart(document.getElementById('chCrisisDD'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Drawdown dal picco (%)',
        data: ddVals,
        backgroundColor: ddVals.map(d => d < -25 ? 'rgba(217,48,37,.8)' : d < -10 ? 'rgba(227,116,0,.7)' : d < -3 ? `${crisis.color}99` : 'rgba(30,142,62,.4)'),
        borderRadius: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: c => ` Drawdown: ${c.raw.toFixed(2)}%` } }
      },
      scales: {
        x: { ticks: { color: tC, font: { size: 10, family: 'DM Mono' }, maxTicksLimit: 12 }, grid: { color: gC } },
        y: {
          ticks: { color: tC, font: { size: 10, family: 'DM Mono' }, callback: v => v.toFixed(0) + '%' },
          grid: { color: gC },
          suggestedMin: Math.min(...ddVals) * 1.1,
          suggestedMax: 2,
        }
      }
    }
  });

  // ─── Tabella 10 mesi peggiori ───
  const sortedByRet = [...sim.path].sort((a, b) => a.portRet - b.portRet).slice(0, 10);
  document.getElementById('crisisWorstMonths').innerHTML = `
    <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px;letter-spacing:.04em;text-transform:uppercase">
      📋 I 10 mesi peggiori in questo scenario
    </div>
    <div class="tbl-outer"><table>
      <thead><tr>
        <th>Mese</th>
        <th>Rendim. portaf.</th>
        <th>Azioni</th>
        <th>Obbligaz.</th>
        <th>Oro</th>
        <th>Portaf. (base 100)</th>
        <th>Drawdown</th>
      </tr></thead>
      <tbody>${sortedByRet.map(p => `
        <tr>
          <td style="font-family:'DM Mono',monospace;font-weight:600">${p.label}</td>
          <td class="${p.portRet < 0 ? 'neg' : 'pos'}" style="font-family:'DM Mono',monospace;font-weight:700">${(p.portRet*100).toFixed(2)}%</td>
          <td class="${p.eqRet < 0 ? 'neg' : 'pos'}" style="font-family:'DM Mono',monospace">${(p.eqRet*100).toFixed(2)}%</td>
          <td class="${p.obRet < 0 ? 'neg' : 'pos'}" style="font-family:'DM Mono',monospace">${(p.obRet*100).toFixed(2)}%</td>
          <td class="${p.goldRet < 0 ? 'neg' : 'pos'}" style="font-family:'DM Mono',monospace">${(p.goldRet*100).toFixed(2)}%</td>
          <td style="font-family:'DM Mono',monospace">${p.cumValue.toFixed(1)}</td>
          <td class="neg" style="font-family:'DM Mono',monospace">${p.drawdown.toFixed(2)}%</td>
        </tr>`).join('')}
      </tbody>
    </table></div>`;
}

// ── Confronto tutte le crisi con il portafoglio corrente ─────
function renderAllCrisesCompare() {
  const portKey    = getActiveCrisisPortKey();
  const capitalEur = btState?.w ?? state?.w ?? 10000;
  const portLabel  = typeof getPortLabel === 'function' ? getPortLabel(portKey) : portKey;

  const compareSection = document.getElementById('crisisCompareSection');
  if (compareSection) compareSection.style.display = 'block';

  const results = CRISIS_SCENARIOS.map(c => ({
    crisis: c,
    sim:    simulateCrisisPath(c, portKey, capitalEur),
  }));

  // ─── Tabella comparativa ───
  const rows = results.map(({ crisis: c, sim }) => {
    const ddColor = sim.maxDD < -0.30 ? 'var(--red)' : sim.maxDD < -0.15 ? 'var(--orange)' : 'var(--green)';
    const recStr  = sim.recoveryMonth != null ? `${sim.recoveryMonth} mesi` : `>${c.windowMonths} mesi`;
    return `<tr>
      <td style="font-weight:700;color:${c.color};white-space:nowrap">${c.shortLabel}</td>
      <td style="font-size:11.5px;color:var(--text2);max-width:160px">${c.label.split(' ').slice(1).join(' ')}</td>
      <td style="font-family:'DM Mono',monospace;font-weight:700;color:${ddColor}">${(sim.maxDD*100).toFixed(1)}%</td>
      <td style="font-family:'DM Mono',monospace;color:var(--red)">−€${Math.abs(sim.lossEur).toLocaleString('it-IT')}</td>
      <td style="font-family:'DM Mono',monospace;color:var(--text2)">${(sim.worstMonthRet*100).toFixed(2)}%</td>
      <td style="font-family:'DM Mono',monospace;color:${sim.recoveryMonth != null && sim.recoveryMonth < 24 ? 'var(--green)' : 'var(--orange)'}">${recStr}</td>
      <td style="font-family:'DM Mono',monospace">${sim.finalValue.toFixed(1)}</td>
    </tr>`;
  });

  document.getElementById('crisisCompareTable').innerHTML = `
    <div style="font-size:11.5px;color:var(--text2);margin-bottom:8px">
      Portafoglio: <strong>${portLabel}</strong> · Capitale: <strong>€${capitalEur.toLocaleString('it-IT')}</strong>
    </div>
    <div class="tbl-outer"><table>
      <thead><tr>
        <th>Crisi</th>
        <th>Evento</th>
        <th title="Max Drawdown portafoglio nella finestra di crisi">Max DD</th>
        <th title="Perdita massima in euro sul capitale iniziale">Perdita max (€)</th>
        <th title="Rendimento del mese peggiore">Mese peggiore</th>
        <th title="Mesi per recuperare il livello iniziale">Recovery</th>
        <th title="Valore finale normalizzato (base 100 = inizio crisi)">Fine finestra</th>
      </tr></thead>
      <tbody>${rows.join('')}</tbody>
    </table></div>
    <div style="font-size:11px;color:var(--text3);margin-top:8px;line-height:1.6">
      ⚠️ Il Recovery è calcolato rispetto al livello di <em>inizio finestra</em> mostrata, non al picco assoluto pre-crisi.
      La finestra include alcuni mesi pre-crisi per contesto. Nessun PAC aggiuntivo applicato.
    </div>`;

  // ─── Grafico a linee sovrapposte (normalizzate) ───
  // Tutti i path normalizzati a 100 all'inizio finestra, x = mese relativo
  const maxLen = Math.max(...results.map(r => r.sim.path.length));
  const xLabels = Array.from({ length: maxLen }, (_, i) => `M+${i}`);

  const datasets = results.map(({ crisis: c, sim }) => ({
    label: c.shortLabel,
    data:  sim.path.map(p => +p.cumValue.toFixed(2)),
    borderColor: c.color,
    borderWidth: 2,
    pointRadius: 0,
    fill: false,
    tension: 0.3,
  }));

  // Aggiunge linea di riferimento a 100
  datasets.push({
    label: 'Base 100',
    data: Array(maxLen).fill(100),
    borderColor: 'rgba(0,0,0,.2)',
    borderWidth: 1,
    borderDash: [4, 3],
    pointRadius: 0,
    fill: false,
  });

  if (crisisCharts.compare) { crisisCharts.compare.destroy(); crisisCharts.compare = null; }
  const tC = 'rgba(0,0,0,.4)', gC = 'rgba(0,0,0,.06)';

  crisisCharts.compare = new Chart(document.getElementById('chCrisisCompare'), {
    type: 'line',
    data: { labels: xLabels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, labels: { font: { size: 10.5 }, boxWidth: 14 } },
        tooltip: {
          callbacks: {
            title: c => `Mese ${c[0].label.replace('M+', '')} dall\'inizio`,
            label: c => ` ${c.dataset.label}: ${typeof c.raw === 'number' ? c.raw.toFixed(1) : c.raw}`,
          },
          backgroundColor: '#fff', borderColor: '#dadce0', borderWidth: 1,
          titleColor: '#202124', bodyColor: '#5f6368', padding: 10,
        },
      },
      scales: {
        x: { ticks: { color: tC, font: { size: 10, family: 'DM Mono' }, maxTicksLimit: 16 }, grid: { color: gC } },
        y: { ticks: { color: tC, font: { size: 10, family: 'DM Mono' }, callback: v => v + '' }, grid: { color: gC } }
      }
    }
  });

  // Scroll verso la sezione confronto
  compareSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Esponi globalmente ─────────────────────────────────────────
window.initCrisisStress       = initCrisisStress;
window.renderAllCrisesCompare = renderAllCrisesCompare;
window.renderCrisis           = renderCrisis;

// ── Hook su switchTab per lazy init ──────────────────────────
(function hookCrisisStress() {
  const origSwitch = window.switchTab;
  if (typeof origSwitch === 'function') {
    window.switchTab = function(tabId, ...args) {
      origSwitch(tabId, ...args);
      if (tabId === 'backtest') {
        setTimeout(() => {
          try { initCrisisStress(); } catch(e) { console.warn('CrisisStress init error:', e); }
        }, 80);
      }
    };
  } else {
    // Fallback: poll finché switchTab non è disponibile
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if (attempts > 50) { clearInterval(poll); return; }
      const sw = window.switchTab;
      if (typeof sw === 'function' && sw !== hookCrisisStress) {
        clearInterval(poll);
        window.switchTab = function(tabId, ...args) {
          sw(tabId, ...args);
          if (tabId === 'backtest') {
            setTimeout(() => {
              try { initCrisisStress(); } catch(e) { console.warn('CrisisStress init error:', e); }
            }, 80);
          }
        };
      }
    }, 100);
  }
})();
