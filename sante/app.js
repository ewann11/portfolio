/* ═══════════════════════════════════════════════════════════════════════════
   Dashboard Perso — copie statique interactive (données fictives)
   Reprend la structure de l'app réelle : shell 4 pages + majordome 4 coachs IA.
   Aucun backend : tout l'état vit en mémoire / localStorage.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Utilitaires ─────────────────────────────────────────────────────────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const MONTHS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const DAYS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const pad = n => String(n).padStart(2, "0");
const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const todayStr = () => dateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
const fmtMin = m => { const h = Math.floor(m / 60); return `${h}h${pad(m % 60)}`; };

/* ── Données fictives ────────────────────────────────────────────────────── */
const STATE = {
  todos: [
    { id: 1, text: "Réviser les dérivées (ch.4)", done: false },
    { id: 2, text: "Envoyer le devis client", done: false },
    { id: 3, text: "Séance push 18h", done: true },
    { id: 4, text: "Appeler le CFA pour l'alternance", done: false },
  ],
  countdowns: [
    { id: 1, label: "🎓 Partiel S1", days: 12 },
    { id: 2, label: "🏝 Thaïlande", days: 34 },
    { id: 3, label: "💼 Rendu client", days: 6 },
  ],
  events: [],
  sessions: [
    { id: 1, date: "12/10", type: "Push", dur: 62, ex: 8, crowd: "moyenne", done: true },
    { id: 2, date: "10/10", type: "Pull", dur: 55, ex: 7, crowd: "faible", done: true },
    { id: 3, date: "08/10", type: "Legs", dur: 70, ex: 6, crowd: "forte", done: true },
    { id: 4, date: "06/10", type: "Push", dur: 58, ex: 7, crowd: "moyenne", done: true },
  ],
  meals: [
    { id: 1, name: "Bol de flocons d'avoine", cal: 420, p: 18, g: 62, l: 9, when: "matin" },
    { id: 2, name: "Poulet + riz + brocoli", cal: 760, p: 52, g: 88, l: 14, when: "midi" },
    { id: 3, name: "Shaker + banane", cal: 310, p: 28, g: 34, l: 5, when: "16h" },
    { id: 4, name: "Saumon + patates douces", cal: 970, p: 46, g: 76, l: 40, when: "soir" },
  ],
  weights: [73.6,73.4,73.5,73.1,73.0,72.8,72.9,72.6,72.7,72.4],
  target: { cal: 2800, p: 180, g: 320, l: 80 },
};
const MUSCLE = { chest:"#818cf8", back:"#60a5fa", legs:"#34d399", shoulders:"#fb923c", arms:"#f87171", core:"#fbbf24" };
const VOLUME = [
  { w:"S-3", chest:1200, back:900,  legs:1500, arms:600 },
  { w:"S-2", chest:1400, back:1100, legs:1600, arms:700 },
  { w:"S-1", chest:1300, back:1250, legs:1700, arms:750 },
  { w:"Cette sem.", chest:1500, back:1300, legs:1800, arms:800 },
];
// Événements fictifs sur la semaine courante.
(function seedEvents() {
  const t = new Date(); const monday = new Date(t); monday.setDate(t.getDate() - ((t.getDay() + 6) % 7));
  const mk = (off, summary, hour, cat) => { const d = new Date(monday); d.setDate(monday.getDate() + off);
    return { date: dateKey(d.getFullYear(), d.getMonth(), d.getDate()), summary, hour, cat }; };
  STATE.events = [
    mk(0,"Cours BTS SIO — SLAM",8,"cours"), mk(0,"Séance push",18,"sport"),
    mk(1,"Alternance — entreprise",9,"boulot"), mk(1,"Rappel : réviser éco",20,"perso"),
    mk(2,"Cours INGETIS",8,"cours"), mk(3,"Rendu projet client",14,"boulot"),
    mk(4,"Cours + TD maths",8,"cours"), mk(5,"Séance legs",11,"sport"),
    mk(6,"Détente / Call of Duty",15,"perso"),
  ];
})();
const CATCOLOR = { cours:"#60a5fa", boulot:"#fb923c", sport:"#84CC16", perso:"#818cf8" };

/* ── Salon / navigation ──────────────────────────────────────────────────── */
function go(view) {
  $$(".view").forEach(v => v.classList.toggle("on", v.id === "view-" + view));
  const navView = view === "settings" ? "" : view;
  $$(".navlink").forEach(b => b.classList.toggle("on", b.dataset.view === navView));
  $$(".bottomnav .tab").forEach(b => b.classList.toggle("on", b.dataset.view === navView));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
$$(".navlink[data-view]").forEach(b => b.onclick = () => go(b.dataset.view));
$$(".bottomnav .tab").forEach(b => b.onclick = () => go(b.dataset.view));
$$("#open-settings, #open-settings-top").forEach(b => { if (b) b.onclick = () => go("settings"); });

function login() {
  $("#login").classList.add("hide");
  $("#app").classList.remove("hide");
  try { localStorage.setItem("demo-auth", "1"); } catch {}
  renderAll();
}
function logout() {
  $("#app").classList.add("hide");
  $("#login").classList.remove("hide");
  try { localStorage.removeItem("demo-auth"); } catch {}
}
$("#lg-btn").onclick = login;
$$("#lg-user, #lg-pwd").forEach(inp => inp.onkeydown = e => { if (e.key === "Enter") login(); });

/* ── Accueil ─────────────────────────────────────────────────────────────── */
function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Bonne nuit"; if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi"; return "Bonsoir";
}
function renderHome() {
  $("#greeting").textContent = `${greeting()}, Ewann 👋`;
  $("#today-label").textContent = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  // countdowns
  const cd = $("#countdowns"); cd.innerHTML = "";
  STATE.countdowns.forEach(c => {
    const cls = c.days <= 7 ? "soon" : "norm";
    cd.insertAdjacentHTML("beforeend",
      `<span class="countdown"><b>${c.label}</b><span style="color:var(--muted)">·</span><span class="d ${cls}">${c.days}j</span></span>`);
  });
  cd.insertAdjacentHTML("beforeend", `<button class="btn sm" style="border-radius:999px" onclick="addCountdown()">+</button>`);

  // events today + upcoming
  const today = todayStr();
  const todayEvents = STATE.events.filter(e => e.date === today).sort((a, b) => a.hour - b.hour);
  $("#today-events").innerHTML = todayEvents.length
    ? todayEvents.map(e => `<div style="display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid var(--line)">
        <span style="width:3px;align-self:stretch;border-radius:99px;background:${CATCOLOR[e.cat]}"></span>
        <span style="flex:1;font-size:11.5px;font-weight:500">${e.summary}</span>
        <span class="muted">${pad(e.hour)}:00</span></div>`).join("")
    : `<p class="muted" style="padding:4px 0">Rien de prévu.</p>`;

  const upcoming = STATE.events.filter(e => e.date > today).sort((a, b) => a.date.localeCompare(b.date) || a.hour - b.hour).slice(0, 4);
  $("#upcoming").innerHTML = upcoming.map(e => `<div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--line)">
      <span style="width:3px;align-self:stretch;border-radius:99px;background:${CATCOLOR[e.cat]}"></span>
      <span style="flex:1;font-size:11.5px;font-weight:500">${e.summary}</span>
      <span class="muted">${new Date(e.date + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</span></div>`).join("");

  // todos
  renderTodos("#todos-list", true);
  renderTodos("#todos-list-cal", false);

  // macro ring home
  const tot = mealsTotal();
  $("#macro-ring-home").innerHTML = macroRingSVG(tot, STATE.target);
  //
  $("#snap-weight").textContent = STATE.weights.at(-1).toFixed(1).replace(".", ",") + " kg";
  $("#snap-kcal").textContent = `${Math.round(tot.cal)} / ${STATE.target.cal}`;
}
function addCountdown() {
  const label = prompt("Label du countdown (ex: 🎓 Exam)");
  if (!label) return;
  const d = prompt("Dans combien de jours ?", "10");
  STATE.countdowns.push({ id: Date.now(), label, days: parseInt(d) || 0 });
  renderHome();
}

/* ── Todos ───────────────────────────────────────────────────────────────── */
function renderTodos(sel, compact) {
  const box = $(sel); if (!box) return;
  box.innerHTML = STATE.todos.length === 0 ? `<p class="muted">Rien à faire.</p>` : "";
  STATE.todos.forEach(t => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px";
    row.innerHTML = `
      <button class="xbtn" style="width:15px;height:15px;border-radius:5px;flex:none;border:1px solid ${t.done ? "rgba(132,204,22,.6)" : "var(--line)"};
        background:${t.done ? "rgba(132,204,22,.5)" : "transparent"};padding:0"></button>
      <span style="flex:1;font-size:${compact ? 11 : 12.5}px;line-height:1.35;${t.done ? "text-decoration:line-through;color:var(--muted)" : ""}">${t.text}</span>
      <button class="xbtn">✕</button>`;
    const [tick, del] = row.querySelectorAll("button");
    tick.onclick = () => { t.done = !t.done; renderTodos("#todos-list", true); renderTodos("#todos-list-cal", false); };
    del.onclick = () => { STATE.todos = STATE.todos.filter(x => x.id !== t.id); renderTodos("#todos-list", true); renderTodos("#todos-list-cal", false); };
    box.appendChild(row);
  });
}
function addTodo(inputId = "todo-input") {
  const el = $("#" + inputId); const text = el.value.trim();
  if (!text) return;
  STATE.todos.unshift({ id: Date.now(), text, done: false });
  el.value = "";
  renderTodos("#todos-list", true); renderTodos("#todos-list-cal", false);
}
$$("#todo-input, #todo-input-cal").forEach(i => i.onkeydown = e => { if (e.key === "Enter") addTodo(i.id); });

/* ── Calendrier ──────────────────────────────────────────────────────────── */
let calView = "week", calRef = new Date();
function calendarRender() {
  const isWeek = calView === "week";
  $("#cal-week").classList.toggle("hide", !isWeek);
  $("#cal-month").classList.toggle("hide", isWeek);

  if (isWeek) {
    const monday = new Date(calRef); monday.setDate(calRef.getDate() - ((calRef.getDay() + 6) % 7));
    $("#cal-title").textContent = `Semaine du ${monday.toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`;
    $("#cal-week").innerHTML = DAYS.map((d, i) => {
      const day = new Date(monday); day.setDate(monday.getDate() + i);
      const dk = dateKey(day.getFullYear(), day.getMonth(), day.getDate());
      const evs = STATE.events.filter(e => e.date === dk).sort((a, b) => a.hour - b.hour);
      return `<div class="weekcol ${dk === todayStr() ? "today" : ""}">
        <div class="wd">${d}</div><div class="dd">${day.getDate()}</div>
        ${evs.map(e => `<div class="ev" style="border-left-color:${CATCOLOR[e.cat]}">
          <span class="et">${pad(e.hour)}:00</span>${e.summary}</div>`).join("")}
      </div>`;
    }).join("");
  } else {
    $("#cal-title").textContent = `${MONTHS[calRef.getMonth()]} ${calRef.getFullYear()}`;
    $("#cal-month-head").innerHTML = DAYS.map(d => `<div class="calhdr">${d}</div>`).join("");
    const y = calRef.getFullYear(), m = calRef.getMonth();
    let start = new Date(y, m, 1).getDay() - 1; if (start < 0) start = 6;
    const nDays = new Date(y, m + 1, 0).getDate();
    let html = "";
    for (let i = 0; i < start; i++) html += `<div></div>`;
    for (let d = 1; d <= nDays; d++) {
      const dk = dateKey(y, m, d);
      const cats = [...new Set(STATE.events.filter(e => e.date === dk).map(e => e.cat))];
      html += `<div class="mcell ${dk === todayStr() ? "today" : ""}" onclick="jumpToDay(${y},${m},${d})">
        <span>${d}</span><div class="mdots">${cats.map(c => `<span class="mdot" style="background:${CATCOLOR[c]}"></span>`).join("")}</div></div>`;
    }
    $("#cal-month-body").innerHTML = html;
  }
}
function jumpToDay(y, m, d) { calRef = new Date(y, m, d); calView = "week"; syncCalTabs(); calendarRender(); }
function syncCalTabs() { $$("[data-calview]").forEach(b => b.classList.toggle("on", b.dataset.calview === calView)); }
$$("[data-calview]").forEach(b => b.onclick = () => { calView = b.dataset.calview; syncCalTabs(); calendarRender(); });
$("#cal-prev").onclick = () => { calView === "week" ? calRef.setDate(calRef.getDate() - 7) : calRef.setMonth(calRef.getMonth() - 1); calendarRender(); };
$("#cal-next").onclick = () => { calView === "week" ? calRef.setDate(calRef.getDate() + 7) : calRef.setMonth(calRef.getMonth() + 1); calendarRender(); };

/* ── Santé : workout ─────────────────────────────────────────────────────── */
function renderWorkout() {
  $("#wk-list").innerHTML = STATE.sessions.slice(0, 5).map(s => `<div class="rowitem">
      <div><div><span class="nm">${s.date}</span><span class="kl">${s.type} · ${s.dur}min · ${s.ex} exercices · ${s.crowd}</span></div></div>
      <button class="xbtn" data-del="${s.id}">✕</button></div>`).join("");
  $$("#wk-list [data-del]").forEach(b => b.onclick = () => { STATE.sessions = STATE.sessions.filter(s => s.id != b.dataset.del); renderWorkout(); });

  const maxVol = Math.max(...VOLUME.map(w => Object.values(w).slice(1).reduce((a, b) => a + b, 0)));
  $("#wk-chart").innerHTML = VOLUME.map(w => {
    const total = Object.values(w).slice(1).reduce((a, b) => a + b, 0);
    const segs = Object.entries(w).slice(1).map(([k, v]) =>
      `<span style="height:${(v / total * 100).toFixed(1)}%;background:${MUSCLE[k]}"></span>`).join("");
    return `<div class="col" style="height:${Math.round(total / maxVol * 100)}%">${segs}</div>`;
  }).join("");
}
function addSession() {
  const date = $("#wk-date").value || todayStr();
  const [y, m, d] = date.split("-");
  STATE.sessions.unshift({ id: Date.now(), date: `${d}/${m}`, type: $("#wk-type").value,
    dur: parseInt($("#wk-dur").value) || 60, ex: 7, crowd: $("#wk-crowd").value, done: true });
  $("#wk-dur").value = "";
  renderWorkout();
}

/* ── Santé : sommeil ─────────────────────────────────────────────────────── */
const sleepNights = [6.8, 7.5, 7.2, 8.1, 6.4, 7.9, 7.8];
function renderSleep() { sparkline($("#sleep-chart"), sleepNights, "#60a5fa"); }
function saveSleep() {
  const bed = $("#sl-bed").value, wake = $("#sl-wake").value;
  const [bh, bm] = bed.split(":").map(Number), [wh, wm] = wake.split(":").map(Number);
  let min = (wh * 60 + wm) - (bh * 60 + bm); if (min <= 0) min += 1440;
  const q = parseInt($("#sl-q").value);
  const score = Math.min(100, Math.round((min / 480 * 60) + (q / 5 * 40)));
  $("#sleep-score").textContent = score;
  $("#sleep-dur").textContent = fmtMin(min);
  const color = score >= 85 ? "#34d399" : score >= 70 ? "#fbbf24" : "#fb923c";
  $("#sleep-arc").setAttribute("stroke", color);
  $("#sleep-score").setAttribute("fill", color);
  $("#sleep-label").textContent = score >= 85 ? "Excellent" : score >= 70 ? "Bien" : "Moyen";
  $("#sleep-label").style.color = color;
  $("#sleep-arc").setAttribute("stroke-dashoffset", String(198 * (1 - score / 100)));
  sleepNights.push(+(min / 60).toFixed(1)); sleepNights.shift(); renderSleep();
}

/* ── Santé : nutrition ───────────────────────────────────────────────────── */
function mealsTotal(list = STATE.meals) {
  return list.reduce((a, m) => ({ cal: a.cal + (m.cal || 0), p: a.p + (m.p || 0), g: a.g + (m.g || 0), l: a.l + (m.l || 0) }),
    { cal: 0, p: 0, g: 0, l: 0 });
}
function renderNutrition() {
  const tot = mealsTotal();
  const rows = [
    { l: "Kcal", a: tot.cal, t: STATE.target.cal, u: "" },
    { l: "Protéines", a: tot.p, t: STATE.target.p, u: "g" },
    { l: "Glucides", a: tot.g, t: STATE.target.g, u: "g" },
    { l: "Lipides", a: tot.l, t: STATE.target.l, u: "g" },
  ];
  $("#macros").innerHTML = rows.map(({ l, a, t, u }) => {
    const pct = Math.min(100, Math.round(a / t * 100));
    const color = pct >= 90 ? "var(--lime)" : "var(--violet)";
    return `<div class="bar"><div class="top"><span>${l}</span><span>${Math.round(a)}${u} / ${t}${u}</span></div>
      <div class="track"><div class="fill" style="width:${pct}%;background:${color}"></div></div></div>`;
  }).join("");

  $("#meals-list").innerHTML = STATE.meals.map(m => `<div class="rowitem">
      <div><span class="nm">${m.name}</span><span class="kl">${m.cal} kcal · ${m.p}g P</span></div>
      <div style="display:flex;align-items:center;gap:6px"><span class="rt">${m.when}</span>
      <button class="xbtn" data-meal="${m.id}">✕</button></div></div>`).join("")
    || `<p class="muted">Aucun repas enregistré.</p>`;
  $$("#meals-list [data-meal]").forEach(b => b.onclick = () => { STATE.meals = STATE.meals.filter(m => m.id != b.dataset.meal); renderNutrition(); renderHome(); });

  // donut + legend
  const segs = [{ v: tot.p * 4, c: "#818cf8" }, { v: tot.g * 4, c: "#60a5fa" }, { v: tot.l * 9, c: "#fb923c" }];
  const sum = segs.reduce((a, s) => a + s.v, 0) || 1;
  const r = 26, circ = 2 * Math.PI * r; let off = 0, svg = "";
  segs.forEach(s => {
    const len = s.v / sum * circ;
    svg += `<circle cx="40" cy="40" r="${r}" fill="none" stroke="${s.c}" stroke-width="15"
      stroke-dasharray="${len} ${circ - len}" stroke-dashoffset="${-off}" transform="rotate(-90 40 40)"/>`;
    off += len;
  });
  $("#macro-donut").innerHTML = svg;
  $("#macro-legend").innerHTML = `<span class="tot">${Math.round(tot.cal)} kcal</span>
    <span class="li"><span class="dot" style="background:#818cf8"></span>Protéines : ${Math.round(tot.p)} g</span>
    <span class="li"><span class="dot" style="background:#60a5fa"></span>Glucides : ${Math.round(tot.g)} g</span>
    <span class="li"><span class="dot" style="background:#fb923c"></span>Lipides : ${Math.round(tot.l)} g</span>`;

  // weight spark
  sparkline($("#weight-chart"), STATE.weights, "#8B5CF6");
}
function addMeal() {
  const name = $("#meal-name").value.trim(); if (!name) return;
  const cal = parseInt($("#meal-cal").value) || 350;
  STATE.meals.push({ id: Date.now(), name, cal, p: Math.round(cal * 0.06), g: Math.round(cal * 0.12), l: Math.round(cal * 0.02), when: "ajout" });
  $("#meal-name").value = ""; $("#meal-cal").value = "";
  renderNutrition(); renderHome();
}
function describeMeal() {
  const desc = $("#meal-desc").value.trim(); if (!desc) return;
  // « analyse » locale : estimation grossière, comme le vrai coach IA (ici sans réseau)
  const cal = 300 + Math.min(600, desc.length * 18);
  $("#meal-name").value = desc.charAt(0).toUpperCase() + desc.slice(1);
  $("#meal-cal").value = cal;
  $("#meal-desc").value = "";
}

/* ── SVG helpers ─────────────────────────────────────────────────────────── */
function sparkline(el, values, color, w = 340, h = 110, p = 8) {
  const min = Math.min(...values), max = Math.max(...values), range = (max - min) || 1;
  const step = (w - p * 2) / (values.length - 1);
  const pts = values.map((v, i) => [p + i * step, h - p - ((v - min) / range) * (h - p * 2)]);
  const line = pts.map((q, i) => (i ? "L" : "M") + q[0].toFixed(1) + " " + q[1].toFixed(1)).join(" ");
  const area = line + ` L ${pts.at(-1)[0].toFixed(1)} ${h} L ${pts[0][0].toFixed(1)} ${h} Z`;
  el.innerHTML = `<defs><linearGradient id="g-${el.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.28"/><stop offset="100%" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#g-${el.id})"/>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${pts.map(q => `<circle cx="${q[0].toFixed(1)}" cy="${q[1].toFixed(1)}" r="2.6" fill="${color}"/>`).join("")}`;
}
function macroRingSVG(tot, target) {
  const R = 36, sw = 8, cx = 48, cy = 48, circ = 2 * Math.PI * R;
  const macros = [{ v: tot.p, t: target.p, c: "#818cf8", l: "P" }, { v: tot.g, t: target.g, c: "#60a5fa", l: "G" }, { v: tot.l, t: target.l, c: "#fb923c", l: "L" }];
  const gap = 0.02, slice = (1 - macros.length * gap) / macros.length;
  let svg = `<svg width="96" height="96" style="transform:rotate(-90deg)">`;
  macros.forEach((_, i) => svg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="${sw}"
    stroke-dasharray="${slice * circ} ${circ}" stroke-dashoffset="${-(i * (slice + gap)) * circ}"/>`);
  macros.forEach((m, i) => {
    const pct = m.t ? Math.min(1, m.v / m.t) : 0;
    svg += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${m.c}" stroke-width="${sw}"
      stroke-dasharray="${pct * slice * circ} ${circ}" stroke-dashoffset="${-(i * (slice + gap)) * circ}" stroke-linecap="round"/>`;
  });
  svg += `</svg>`;
  const legend = macros.map(m => `<span class="li"><span class="dot" style="background:${m.c}"></span>${m.l} ${Math.round(m.v)}g/${m.t}g</span>`).join("");
  return `<div style="display:flex;align-items:center;gap:14px">${svg}
    <div><span style="font-size:13px;font-weight:600">${Math.round(tot.cal)}</span><span class="muted"> / ${target.cal} kcal</span>
    <div style="display:flex;flex-direction:column;gap:5px;margin-top:7px">${legend}</div></div></div>`;
}

/* ── Pomodoro ────────────────────────────────────────────────────────────── */
let pomoLeft = 25 * 60, pomoTimer = null;
function renderPomo() { $("#pomo").textContent = `${pad(Math.floor(pomoLeft / 60))}:${pad(pomoLeft % 60)}`; }
$("#pomo-start").onclick = () => {
  if (pomoTimer) { clearInterval(pomoTimer); pomoTimer = null; $("#pomo-start").textContent = "Démarrer"; return; }
  $("#pomo-start").textContent = "Pause";
  pomoTimer = setInterval(() => {
    if (pomoLeft <= 0) { clearInterval(pomoTimer); pomoTimer = null; $("#pomo-start").textContent = "Démarrer"; pomoLeft = 25 * 60; renderPomo(); return; }
    pomoLeft--; renderPomo();
  }, 1000);
};
$("#pomo-reset").onclick = () => { clearInterval(pomoTimer); pomoTimer = null; pomoLeft = 25 * 60; renderPomo(); $("#pomo-start").textContent = "Démarrer"; };

/* ── Majordome : 4 coachs IA ─────────────────────────────────────────────── */
const COACHES = {
  gym:       { label: "🏋️ Coach gym",       icon: "🏋️" },
  sleep:     { label: "🌙 Coach sommeil",   icon: "🌙" },
  nutrition: { label: "🥗 Coach nutrition", icon: "🥗" },
  study:     { label: "📚 Coach études",    icon: "📚" },
};
const COACH_INTRO = {
  gym: "Tu es un coach de musculation expert en hypertrophie et force. Tu t'adresses à Ewann (tutoiement, direct, sans chichis).",
  sleep: "Tu es un expert en chronobiologie et hygiène du sommeil. Tu t'adresses à Ewann (tutoiement, bienveillant mais direct).",
  nutrition: "Tu es un nutritionniste spécialisé sport et performance. Tu t'adresses à Ewann (tutoiement, pratique et concret).",
  study: "Tu es un coach pédagogique expert en méthodes d'apprentissage (Pomodoro, spaced repetition, active recall). Tu t'adresses à Ewann (tutoiement, motivant et structuré).",
};
// Réponses de démonstration — la vraie app interroge DeepSeek via OpenRouter.
const COACH_DEMO = {
  gym: "Sur ta séance push : garde le développé couché en 4×6 lourd, puis 3×10 aux dips. Tu es à 57 kg pour 180 cm, la priorité c'est la charge progressive + 3 200 kcal/j. Ajoute 2,5 kg sur le couché toutes les 2 semaines tant que la technique tient.",
  sleep: "Ton score est bon (7h48, FC 52, HRV 74). Pour progresser : coucher fixe à 23h00 même le week-end, pas d'écran 45 min avant, chambre à 18 °C. Une nuit sous 7h fait chuter ta HRV de ~10 % le lendemain, donc vise la régularité avant la durée.",
  nutrition: "À 2 460 kcal tu es 340 kcal sous ta cible (2 800). Ajoute un 5e apport vers 17h : 60 g de flocons d'avoine + 30 g de whey = ~380 kcal, 30 g de protéines. Tu es à 144 g de protéines, vise 180 g : +1 shaker ou +150 g de skyr.",
  study: "Passe en Pomodoro 25/5 : 4 blocs le matin sur les dérivées (matière la plus dure quand le cerveau est frais), puis révision espacée à J+1, J+3, J+7. Termine par un test actif de 10 min sans notes, c'est ce qui ancre la mémoire.",
};
let chatHistory = [];
function openChat() { $("#chatpanel").classList.add("on"); $("#chat-backdrop").classList.add("on"); }
function closeChat() { $("#chatpanel").classList.remove("on"); $("#chat-backdrop").classList.remove("on"); }
$("#open-chat-top").onclick = openChat;
$("#chat-send").onclick = sendChat;
$("#chat-input").onkeydown = e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } };

function pushMsg(role, text, logs) {
  const box = $("#chat-body");
  if ($("#chat-body .muted")) $("#chat-body").innerHTML = "";
  const div = document.createElement("div");
  div.className = "msg " + role;
  div.innerHTML = (logs ? `<div class="logs">${logs}</div>` : "") + text;
  box.appendChild(div); box.scrollTop = box.scrollHeight;
}
function sendChat() {
  const input = $("#chat-input");
  const text = input.value.trim();
  if (!text) return;
  pushMsg("user", text);
  input.value = "";

  // Routage automatique : un seul majordome qui délègue au bon coach (comme les tool calls de l'app réelle).
  const t = text.toLowerCase();
  let key = null;
  if (/sommeil|dormir|nuit|coucher|réveil|fatigue|sieste/.test(t)) key = "sleep";
  else if (/manger|repas|kcal|protéine|calorie|nutrition|macro|poids|régime/.test(t)) key = "nutrition";
  else if (/révis|étud|exam|pomodoro|cours|bts|slam|école/.test(t)) key = "study";
  else if (/muscu|séance|gym|sport|push|pull|legs|entraîn/.test(t)) key = "gym";

  if (key) {
    const c = COACHES[key];
    const log = `${c.label} → <b>consultation</b> <span style="opacity:.7">· mémoire du coach (profil + notes)</span>`;
    setTimeout(() => pushMsg("assistant", COACH_DEMO[key], log), 320);
  } else {
    setTimeout(() => pushMsg("assistant",
      "Je m'occupe de tout : sport, sommeil, nutrition et études. Dis-moi simplement ce qui te préoccupe, je consulte le coach concerné si besoin."), 320);
  }
}

/* ── Boot ────────────────────────────────────────────────────────────────── */
function renderAll() {
  renderHome(); calendarRender(); renderWorkout(); renderSleep(); renderNutrition(); renderPomo();
}
// Auto-login en démo (l'app réelle demande un mot de passe)
if (location.hash === "#noauth") { /* laisse l'écran de login */ } else { login(); }
